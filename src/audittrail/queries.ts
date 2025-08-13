import axios from 'axios'

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

export async function addActivityCred(user_id: number, activity_name: String, cred_id: number){
    // Input validation
    if (!user_id) {
        return {
            success: false,
            error: 'Invalid user_id: must be a positive number',
            code: 406
        };
    }

    if (!activity_name) {
        return {
            success: false,
            error: 'Invalid Activity Name: must be a non-null',
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
        const response = await axios.post('/api/audit-trail', {
            userId: user_id,
            credId: cred_id,
            activityName: activity_name
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