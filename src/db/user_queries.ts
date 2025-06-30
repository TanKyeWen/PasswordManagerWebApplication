import axios from 'axios'

// Configure axios defaults
axios.defaults.withCredentials = true // Important for session cookies
axios.defaults.baseURL = 'http://localhost:9011'

