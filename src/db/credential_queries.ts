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
       
        if (response.data?.success && response.data?.data?.user_id) {
            return response.data.data.user_id
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
            code: 403
        }
    }

    if (String(sessionUserId) !== String(requestedUserId)) {
        return {
            valid: false,
            error: 'Access denied - user ID mismatch',
            code: 401
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
export async function fetchVaultData(user_id: number) {
    try {
        // Validate user access
        const accessCheck = await validateUserAccess(user_id)
        if (!accessCheck.valid) {
            return {
                success: false,
                error: accessCheck.error,
                code: accessCheck.code
            }
        }

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
                results,
                code: 200
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
                    code: 401,
                    requiresLogin: true
                }
            } else if (status === 403) {
                return {
                    success: false,
                    error: 'Access denied',
                    code: 403
                }
            } else {
                return {
                    success: false,
                    error: message,
                    code: 500
                }
            }
        } else if (error.request) {
            // Network error
            return {
                success: false,
                error: 'Network error - server unreachable',
                code: 503
            }
        } else {
            // Other error
            return {
                success: false,
                error: error.message,
                code: 502
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
            data: result.result.resultRows || [],
            code: 200
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
export async function getIndividualCredential(user_id: number, credential_id: number) {
    try {
        // Validate user access
        const accessCheck = await validateUserAccess(user_id)
        if (!accessCheck.valid) {
            return {
                success: false,
                error: accessCheck.error,
                code: accessCheck.code
            }
        }

        const result = await executeQuery( `
            SELECT
                id,
                credential_website,
                credential_username,
                credential_password
            FROM credentials
            WHERE user_id = ? AND id = ?
            LIMIT 1
            `, [user_id, credential_id]
        );

        // Extract the actual rows from the result object
        const rows = result.result?.resultRows || [];

        // Since we're getting a single credential, return the first item or null
        const credential = rows.length > 0 ? rows[0] : null;
        
        console.log('Fetched individual credential:', credential);

        if (!credential) {
            return {
                success: false,
                error: 'Credential not found',
                code: 404
            };
        }

        try{
            // Fetch data from API with proper headers
            const response = await axios.get(`/api/credential/decrypt/${credential_id}`, {
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

            console.log('Credential Password Received:', response.data)

            credential[3] = response.data.data?.decrypted_password || null;

            return {
                success: true,
                data: credential,
                found: credential !== null,
                code: 200
            };
        } catch (error) {
            console.error('Error fetching credential password:', error);
            return {
                success: false,
                error: error.message || 'Failed to fetch credential password',
                code: 500
            };
        }

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
export async function addCredential(user_id: number, credential: object) {
    // Input validation
    if (!user_id || typeof user_id !== 'number' || user_id <= 0) {
        return {
            success: false,
            error: 'Invalid user_id: must be a positive number',
            code: 406
        };
    }

    if (!credential || typeof credential !== 'object' || Array.isArray(credential)) {
        return {
            success: false,
            error: 'Invalid credential: must be a non-null object',
            code: 406
        };
    }

    // Check if credential object is empty
    if (Object.keys(credential).length === 0) {
        return {
            success: false,
            error: 'Credential object cannot be empty',
            code: 406
        };
    }

    // Validate specific fields if they exist
    const validFields = ['credential_website', 'credential_username', 'credential_password'];
    const credentialKeys = Object.keys(credential);
    
    // Check for invalid fields
    const invalidFields = credentialKeys.filter(key => !validFields.includes(key));
    if (invalidFields.length > 0) {
        return {
            success: false,
            error: `Invalid fields: ${invalidFields.join(', ')}. Allowed fields: ${validFields.join(', ')}`,
            code: 406
        };
    }

    try {
        // Validate user access
        const accessCheck = await validateUserAccess(user_id)
        if (!accessCheck.valid) {
            return {
                success: false,
                error: accessCheck.error,
                code: accessCheck.code
            }
        }

        // Fetch data from API with proper headers
        const response = await axios.post('/api/credential', {
            user_id: user_id,
            ...credential
        }, {
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
        const vaultData = response.data.data || []
        
        if (!vaultData || !vaultData.credential_id) {
            return {
                success: false,
                error: 'Invalid response: missing credential data',
                code: 500
            }
        }
        
        // Start transaction
        await executeQuery('BEGIN TRANSACTION')
        
        try {
            // Check if credential exists
            const checkResult = await executeQuery(`
                    SELECT id FROM credentials
                    WHERE user_id = ? AND credential_website = ? AND credential_username = ?
                `,
                [user_id, credential.credential_website, credential.credential_username],
            );

            if (checkResult.length > 0) {
                return {
                    success: false,
                    error: 'Credential already exists for this user',
                    code: 409
                };
            }

            const insertSQL = `
                INSERT INTO credentials (id, user_id, credential_website, credential_username, credential_password)
                VALUES (?, ?, ?, ?, ?)
            `;

            // Execute insert query
            await executeQuery(insertSQL, [
                vaultData.new_credential_id, // Use the ID from the response
                user_id,
                credential.credential_website.trim(),
                credential.credential_username.trim(),
                vaultData.encrypted_password // Use the password from the response
            ]);

            await executeQuery('COMMIT')

            console.log(`Credential ${vaultData.new_credential_id} added for user ${user_id}`); 

            return {
                success: true,
                message: 'Credential added successfully',
                user: user_id,
                code: 201,
            };

        } catch (error) {
            await executeQuery('ROLLBACK').catch(console.error)
            throw error
        }

    } catch (error) {
        console.error('Error fetching add data:', error)
        
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
                    code: 401,
                    requiresLogin: true
                }
            } else if (status === 403) {
                return {
                    success: false,
                    error: 'Access denied',
                    code: 403
                }
            } else {
                return {
                    success: false,
                    error: message,
                    code: 500
                }
            }
        } else if (error.request) {
            // Network error
            return {
                success: false,
                error: 'Network error - server unreachable',
                code: 503
            }
        } else {
            // Other error
            return {
                success: false,
                error: error.message,
                code: 502
            }
        }
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
export async function deleteIndividualCredential(user_id: number, credential_id: number) {
    try {
         // Validate user access
        const accessCheck = await validateUserAccess(user_id)
        if (!accessCheck.valid) {
            return {
                success: false,
                error: accessCheck.error,
                code: accessCheck.code
            }
        }

        // Start transaction
        await executeQuery('BEGIN TRANSACTION')

        // Check if credential exists
        const checkResult = await executeQuery(`
                SELECT id FROM credentials 
                WHERE user_id = ? AND id = ?
            `,
            [user_id, credential_id]
        );

        if (checkResult.length === 0) {
            return {
                success: false,
                error: 'Credential not found',
                code: 'NOT_FOUND'
            };
        }

        // Proceed with deletion
        await executeQuery(`
                DELETE FROM credentials 
                WHERE user_id = ? AND id = ?
            `,
            [user_id, credential_id],
        );

        await executeQuery('COMMIT')

        console.log(`Credential ${credential_id} deleted for user ${user_id}`);        

        try {
            const response = await axios.delete(`/api/credential/${credential_id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest', // Helps with CSRF protection
                },
                timeout: 10000, // 10 second timeout
                withCredentials: true // Send session cookies
            });

            return response.data;
            
        } catch (error) {
            if (error.response) {
            // Server responded with error status
            const errorMessage = error.response.data?.error || 'Failed to delete credential';
            throw new Error(errorMessage);
            } else if (error.request) {
                // Network error
                throw new Error('Network error - please check your connection');
            } else if (error.code === 'ECONNABORTED') {
                // Timeout error
                throw new Error('Request timeout');
            } else {
                // Other error
                throw new Error(error.message || 'Unknown error occurred');
            }
        }

    } catch (error) {
        console.error('Error deleting credential:', error);
        await executeQuery('ROLLBACK').catch(console.error);
        return {
            success: false,
            error: error.message,
            code: 'DELETE_ERROR'
        };
    }
}