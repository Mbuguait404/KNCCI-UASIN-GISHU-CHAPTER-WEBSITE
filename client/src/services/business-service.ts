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

export interface BusinessData {
    _id?: string;
    userId?: string;
    name: string;
    category: string;
    email: string;
    phone: string;
    location: string;
    plan: 'Bronze' | 'Silver' | 'Gold';
    website?: string;
    description?: string;
    services?: string[];
    kra_pin?: string;
    company_reg_no?: string;
    business_permit?: string;
}

export const businessService = {
    async getMyBusiness() {
        const response = await api.get('/business');
        return response.data;
    },

    async createBusiness(data: BusinessData) {
        const response = await api.post('/business', data);
        return response.data;
    },

    async updateBusiness(data: Partial<BusinessData>) {
        const response = await api.patch('/business', data);
        return response.data;
    }
};
