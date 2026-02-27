import api from './api';


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

export { api };

