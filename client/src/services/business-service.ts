import api from '@/lib/api';


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
