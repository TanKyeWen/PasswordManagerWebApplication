import axios from 'axios'

// Configure axios defaults
axios.defaults.withCredentials = true // Important for session cookies
axios.defaults.baseURL = 'http://localhost:5000'

/**
 * Fetch vault data from API and store in local SQLite database
 */
export async function fetchVaultData(promiser, user_id) {
    try {
        // Input validation
        if (!promiser || typeof promiser !== 'function') {
            throw new Error('Invalid promiser function provided')
        }
        
        if (!user_id) {
            throw new Error('User ID is required')
        }

        console.log(`Fetching vault data for user: ${user_id}`)
        
        // Fetch data from API with proper headers
        const response = await axios.get('/api/vault', {
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest', // Helps with CSRF protection
                // Add authorization header if using JWT tokens
                'Authorization': `Bearer ${getAuthToken()}`
            },
            // Optional: send user_id as query parameter for verification
            params: {
                user_id: user_id
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
        
        // Begin transaction for better performance
        await promiser('exec', { sql: 'BEGIN TRANSACTION' })
        
        try {
            for (const item of vaultItems) {
                // Validate required fields
                if (!item.credential_website || !item.credential_username) {
                    console.warn('Skipping invalid vault item:', item)
                    continue
                }

                // Prepare timestamps
                const now = new Date().toISOString()
                const createdAt = item.created_at || now
                const updatedAt = item.updated_at || now

                // Insert into local database
                const result = await promiser('exec', {
                    sql: `
                        INSERT OR REPLACE INTO credentials 
                        (user_id, credential_website, credential_username, created_at, updated_at)
                        VALUES (?, ?, ?, ?, ?)
                    `,
                    bind: [
                        user_id,
                        item.credential_website.trim(),
                        item.credential_username.trim(),
                        createdAt,
                        updatedAt
                    ]
                })

                results.push(result)
                insertedCount++
                
                console.log(`Inserted credential for ${item.credential_website}`)
            }
            
            // Commit transaction
            await promiser('exec', { sql: 'COMMIT' })
            
        } catch (insertError) {
            // Rollback on error
            await promiser('exec', { sql: 'ROLLBACK' })
            throw insertError
        }

        return {
            success: true,
            message: `Successfully synced ${insertedCount} vault items`,
            insertedCount,
            totalItems: vaultItems.length,
            results
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
 * Incremental sync function
 */
export async function syncVaultData(promiser, user_id) {
    try {
        // Get last sync timestamp from local database
        const lastSyncResult = await promiser('exec', {
            sql: 'SELECT value FROM app_settings WHERE key = ?',
            bind: ['last_vault_sync']
        })
        
        const lastSync = lastSyncResult[0]?.value || '1970-01-01T00:00:00Z'
        
        // Fetch only updated data since last sync
        const response = await axios.get('/api/vault/sync', {
            params: { 
                user_id,
                since: lastSync 
            },
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            withCredentials: true
        })

        const vaultItems = response.data || []
        
        if (vaultItems.length === 0) {
            console.log('No new vault data to sync')
            return { success: true, syncedCount: 0 }
        }

        // Process updates with transaction
        let syncedCount = 0
        const now = new Date().toISOString()
        
        await promiser('exec', { sql: 'BEGIN TRANSACTION' })
        
        try {
            for (const item of vaultItems) {
                // Check if item exists locally
                const existingResult = await promiser('exec', {
                    sql: `
                        SELECT id, updated_at FROM credentials 
                        WHERE user_id = ? AND credential_website = ? AND credential_username = ?
                    `,
                    bind: [user_id, item.credential_website, item.credential_username]
                })

                if (existingResult.length > 0) {
                    // Update existing record if remote is newer
                    const existing = existingResult[0]
                    if (new Date(item.updated_at) > new Date(existing.updated_at)) {
                        await promiser('exec', {
                            sql: `
                                UPDATE credentials 
                                SET credential_username = ?, updated_at = ?
                                WHERE id = ?
                            `,
                            bind: [item.credential_username, item.updated_at, existing.id]
                        })
                        syncedCount++
                    }
                } else {
                    // Insert new record
                    await promiser('exec', {
                        sql: `
                            INSERT INTO credentials 
                            (user_id, credential_website, credential_username, created_at, updated_at)
                            VALUES (?, ?, ?, ?, ?)
                        `,
                        bind: [
                            user_id,
                            item.credential_website,
                            item.credential_username,
                            item.created_at || now,
                            item.updated_at || now
                        ]
                    })
                    syncedCount++
                }
            }

            // Update last sync timestamp
            await promiser('exec', {
                sql: `
                    INSERT OR REPLACE INTO app_settings (key, value, updated_at)
                    VALUES ('last_vault_sync', ?, ?)
                `,
                bind: [now, now]
            })

            await promiser('exec', { sql: 'COMMIT' })
            
            return {
                success: true,
                syncedCount,
                lastSync: now
            }
            
        } catch (syncError) {
            await promiser('exec', { sql: 'ROLLBACK' })
            throw syncError
        }

    } catch (error) {
        console.error('Vault sync error:', error)
        return {
            success: false,
            error: error.message
        }
    }
}

export async function getVaultData(promiser, user_id) {
    const result = await promiser('exec', {
        sql: `
            SELECT
                id,
                credential_website,
                credential_username,
                created_at,
                updated_at
            FROM credentials
            WHERE user_id = ?
            ORDER BY credential_website ASC
        `,
        bind: [user_id],
    });
    
    return result;
}