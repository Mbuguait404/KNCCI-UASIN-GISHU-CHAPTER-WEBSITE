import axios from 'axios';

const API_URL = 'http://localhost:4000/api/v1';

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

export const authService = {
    async login(credentials: any) {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    async getMe() {
        const response = await api.get('/auth/me');
        return response.data;
    },

    async getProfile() {
        const response = await api.get('/profile');
        return response.data;
    },

    async getBusiness() {
        const response = await api.get('/business');
        return response.data;
    }
};

export default api;
