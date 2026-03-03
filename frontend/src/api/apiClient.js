import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const STORAGE_KEY = import.meta.env.VITE_USER_STORAGE_KEY || 'btg_user_data';

/**
 * Axios Instance with interceptor for User ID header.
 */
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to inject the Auth header automatically
apiClient.interceptors.request.use((config) => {
    const userData = localStorage.getItem(STORAGE_KEY);
    if (userData) {
        const { id, token } = JSON.parse(userData);
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        } else if (id) {
            config.headers['x-user-id'] = id; // Fallback for testing
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default apiClient;
