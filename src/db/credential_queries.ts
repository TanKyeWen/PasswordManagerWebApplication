import axios from 'axios'
import { ref } from 'vue'
import { useSQLite } from '@/composables/useSQLite'

const { isLoading, error, executeQuery } = useSQLite()

// Configure axios defaults
axios.defaults.withCredentials = true // Important for session cookies
axios.defaults.baseURL = 'http://localhost:9011'

/**
 * Get current session user ID from API
 */
async function getCurrentUserId() {
    try {
        const response = await axios.get('/api/user/session', {
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
            withCredentials: true
        })
        
        if (response.data?.success && response.data?.user?.id) {
            return response.data.user.id
        }
        
        throw new Error('No valid session found')

    } catch (error) {
        console.error('Error getting current user ID:', error)
        return null
    }
}

/**
 * Validate user access to credentials
 */
async function validateUserAccess(requestedUserId: number) {
    const sessionUserId = await getCurrentUserId()

    if (!sessionUserId) {
        return {
            valid: false,
            error: 'No valid session',
            code: 'NO_SESSION'
        }
    }

    if (sessionUserId !== requestedUserId) {
        return {
            valid: false,
            error: 'Access denied - user ID mismatch',
            code: 'ACCESS_DENIED'
        }
    }

    return {
        valid: true,
        userId: sessionUserId
    }
}

/**
 * Fetch vault data from API and store in local SQLite database
 */
export async function fetchVaultData() {
    try {
        // Fetch data from API with proper headers
        const response = await axios.get('/api/vault', {
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest', // Helps with CSRF protection
            },
            timeout: 10000, // 10 second timeout
            withCredentials: true // Send session cookies
        })

        // Validate response structure
        if (!response.data || !response.data.success) {
            throw new Error(response.data?.error || 'Invalid response from server')
        }

        console.log('Vault data received:', response.data)

        // Extract credentials array from response
        const vaultItems = response.data.data || []
        
        if (vaultItems.length === 0) {
            return {
                success: true,
                message: 'No vault data to sync',
                insertedCount: 0
            }
        }

        // Process each vault item and insert into local SQLite
        const results = []
        let insertedCount = 0
        
        // Start transaction
        await executeQuery('BEGIN TRANSACTION')
        
        try {
            // Define the prepared SQL once
            const insertSQL = `
            INSERT OR REPLACE INTO credentials
            (id, user_id, credential_website, credential_username, credential_password)
            VALUES (?, ?, ?, ?, ?)
            `
            
            for (const item of vaultItems) {
                if (!item.credential_website || !item.credential_username) {
                    console.warn('Skipping invalid vault item:', item)
                    continue
                }
                
                // Execute with the same SQL but different parameters
                const result = await executeQuery(insertSQL, [
                    item.id,
                    item.user_id,
                    item.credential_website.trim(),
                    item.credential_username.trim(),
                    item.credential_password
                ])
                
                results.push(result.result)
                insertedCount++
                
                console.log(`Inserted credential for ${item.credential_website}`)
            }
            
            await executeQuery('COMMIT')
            
            return {
                success: true,
                message: `Successfully synced ${insertedCount} vault items`,
                insertedCount,
                totalItems: vaultItems.length,
                results
            }
            
        } catch (error) {
            await executeQuery('ROLLBACK').catch(console.error)
            throw error
        }

    } catch (error) {
        console.error('Error fetching vault data:', error)
        
        // Handle specific error types
        if (error.response) {
            // Server responded with error status
            const status = error.response.status
            const message = error.response.data?.error || 'Server error'
            
            if (status === 401) {
                // Authentication required - redirect to login
                return {
                    success: false,
                    error: 'Authentication required',
                    code: 'UNAUTHORIZED',
                    requiresLogin: true
                }
            } else if (status === 403) {
                return {
                    success: false,
                    error: 'Access denied',
                    code: 'FORBIDDEN'
                }
            } else {
                return {
                    success: false,
                    error: message,
                    code: 'SERVER_ERROR'
                }
            }
        } else if (error.request) {
            // Network error
            return {
                success: false,
                error: 'Network error - server unreachable',
                code: 'NETWORK_ERROR'
            }
        } else {
            // Other error
            return {
                success: false,
                error: error.message,
                code: 'CLIENT_ERROR'
            }
        }
    }
}

/**
 * Retrieve all credentials for auth user
 */
export async function getAllCredentials(userId: number) {
    try {
        // Validate user access
        const accessCheck = await validateUserAccess(userId)
        if (!accessCheck.valid) {
            return {
                success: false,
                error: accessCheck.error,
                code: accessCheck.code
            }
        }

        const result = await executeQuery(`
            SELECT
                id,
                credential_website,
                credential_username
            FROM credentials
            WHERE user_id = ?
            ORDER BY credential_website ASC
            `, [userId])
        
        return {
            success: true,
            data: result.result.resultRows || []
        }

    } catch (err) {
        return {
            success: false,
            error: err instanceof Error ? err.message : 'Failed to fetch credentials'
        }
    }
}

/**
 * Retrieve individual credential data for auth user
 */
export async function getIndividualCredential(promiser, user_id, credential_id) {
    try {
        const result = await promiser('exec', {
            sql: `
                SELECT
                    id,
                    credential_website,
                    credential_username,
                    credential_password,
                    updated_at
                FROM credentials
                WHERE user_id = ? AND id = ?
                LIMIT 1
            `,
            bind: [user_id, credential_id],
        });

        // Since we're getting a single credential, return the first item or null
        const credential = result && result.length > 0 ? result[0] : null;

        return {
            success: true,
            data: credential,
            found: credential !== null
        };
    } catch (error) {
        console.error('Error fetching individual credential:', error);
        return {
            success: false,
            error: error.message,
            data: null,
            found: false
        };
    }
}

/**
 * Add a new credential for auth user
 */
export async function addCredential(promiser, user_id, credential_id, updates) {
    // Input validation
    if (!user_id || !credential_id || !updates || typeof updates !== 'object') {
        return {
            success: false,
            error: 'Missing or invalid parameters',
            code: 'INVALID_INPUT'
        };
    }

    try {
        // Check if credential exists
        const checkResult = await promiser('exec', {
            sql: `
                SELECT id FROM credentials
                WHERE user_id = ? AND id = ?
            `,
            bind: [user_id, credential_id],
        });

        if (checkResult.length > 0) {
            return {
                success: false,
                error: 'Credential found',
                code: 'FOUND'
            };
        }

        // Prepare add fields
        const allowedFields = ['credential_website', 'credential_username', 'credential_password'];
        const setClauses = [];
        const bindValues = []; // Values for the SET clause

        // Build dynamic SET clauses
        for (const field of allowedFields) {
            if (updates[field] !== undefined && updates[field] !== null) {
                setClauses.push(`${field} = ?`);
                bindValues.push(updates[field]);
            }
        }

        if (setClauses.length === 0) {
            return {
                success: false,
                error: 'No valid fields to update',
                code: 'INVALID_UPDATE'
            };
        }

        // add created_at field
        setClauses.push('created_at = ?');
        bindValues.push(new Date().toISOString());

        // Add updated_at field
        setClauses.push('updated_at = ?');
        bindValues.push(new Date().toISOString());

        // TODO: ADD CREDENTIAL ID CALL TO BACK END
        // Execute update query
        // Order: SET values first, then WHERE values
        const finalBindValues = [...bindValues, user_id];
        
        await promiser('exec', {
            sql: `
                INSERT INTO credentials
                (user_id, id, ${setClauses.join(', ')})
                VALUES (?, ?, ${setClauses.map(() => '?').join(', ')})
            `,
            bind: finalBindValues,
        });

        return {
            success: true,
            message: 'Credential added successfully',
            updatedFields: Object.keys(updates).filter(key => 
                allowedFields.includes(key) && updates[key] !== undefined
            )
        };

    } catch (error) {
        console.error('Error add credential:', error);
        return {
            success: false,
            error: error.message,
            code: 'ADD_ERROR'
        };
    }
}

/**
 * Update a credential for auth user
 */
export async function updateCredential(promiser, user_id, credential_id, updates) {
    // Input validation
    if (!user_id || !credential_id || !updates || typeof updates !== 'object') {
        return {
            success: false,
            error: 'Missing or invalid parameters',
            code: 'INVALID_INPUT'
        };
    }

    try {
        // Check if credential exists
        const checkResult = await promiser('exec', {
            sql: `
                SELECT id FROM credentials
                WHERE user_id = ? AND id = ?
            `,
            bind: [user_id, credential_id],
        });

        if (checkResult.length === 0) {
            return {
                success: false,
                error: 'Credential not found',
                code: 'NOT_FOUND'
            };
        }

        // Prepare update fields
        const allowedFields = ['credential_website', 'credential_username', 'credential_password'];
        const setClauses = [];
        const bindValues = []; // Values for the SET clause

        // Build dynamic SET clauses
        for (const field of allowedFields) {
            if (updates[field] !== undefined && updates[field] !== null) {
                setClauses.push(`${field} = ?`);
                bindValues.push(updates[field]);
            }
        }

        if (setClauses.length === 0) {
            return {
                success: false,
                error: 'No valid fields to update',
                code: 'INVALID_UPDATE'
            };
        }

        // Add updated_at field
        setClauses.push('updated_at = ?');
        bindValues.push(new Date().toISOString());

        // Execute update query
        // Order: SET values first, then WHERE values
        const finalBindValues = [...bindValues, user_id, credential_id];
        
        await promiser('exec', {
            sql: `
                UPDATE credentials
                SET ${setClauses.join(', ')}
                WHERE user_id = ? AND id = ?
            `,
            bind: finalBindValues,
        });

        return {
            success: true,
            message: 'Credential updated successfully',
            updatedFields: Object.keys(updates).filter(key => 
                allowedFields.includes(key) && updates[key] !== undefined
            )
        };

    } catch (error) {
        console.error('Error updating credential:', error);
        return {
            success: false,
            error: error.message,
            code: 'UPDATE_ERROR'
        };
    }
}

/**
 * Delete a credential for auth user
 */
export async function deleteCredential(promiser, user_id, credential_id) {
    try {
        // Check if credential exists
        const checkResult = await promiser('exec', {
            sql: `
                SELECT id FROM credentials 
                WHERE user_id = ? AND id = ?
            `,
            bind: [user_id, credential_id],
        });

        if (checkResult.length === 0) {
            return {
                success: false,
                error: 'Credential not found',
                code: 'NOT_FOUND'
            };
        }

        // Proceed with deletion
        await promiser('exec', {
            sql: `
                DELETE FROM credentials 
                WHERE user_id = ? AND id = ?
            `,
            bind: [user_id, credential_id],
        });

        return {
            success: true,
            message: 'Credential deleted successfully'
        };
    } catch (error) {
        console.error('Error deleting credential:', error);
        return {
            success: false,
            error: error.message,
            code: 'DELETE_ERROR'
        };
    }
}