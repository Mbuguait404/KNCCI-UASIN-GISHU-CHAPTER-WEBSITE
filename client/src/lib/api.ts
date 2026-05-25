import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptor to add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Normalize backend error responses: backend uses { error: "..." } not { message: "..." }
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.data && typeof error.response.data === 'object') {
            const data = error.response.data;
            if (!data.message && data.error) {
                error.response.data.message = data.error;
            }
        }
        return Promise.reject(error);
    }
);

export default api;
