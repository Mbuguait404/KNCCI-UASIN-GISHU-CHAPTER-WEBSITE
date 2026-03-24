import api from '@/lib/api';

export interface CmsStatus {
    connected: boolean;
    tenantId: string | null;
    connectedAt: string | null;
}

export interface CmsProduct {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    isActive: boolean;
    stock?: number;
    slug?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CmsDashboard {
    products: {
        data: CmsProduct[];
        total: number;
    };
    orderStats: {
        totalOrders: number;
        totalRevenue: number;
    };
}

export interface ConnectCmsPayload {
    password: string;
    confirmPassword: string;
}

export interface CreateProductPayload {
    name: string;
    description: string;
    price: number;
    category: string;
    images?: string[];
    isActive?: boolean;
    stock?: number;
}

export const cmsService = {
    /** Check if the member's business is connected to the CMS marketplace */
    async getStatus(): Promise<{ success: boolean; data: CmsStatus }> {
        const response = await api.get('/cms/status');
        return response.data;
    },

    /**
     * Activate marketplace seller account.
     * Creates CMS organization + user with the member's chosen password.
     */
    async connect(payload: ConnectCmsPayload): Promise<{ success: boolean; data: { tenantId: string; accessToken: string; message: string } }> {
        const response = await api.post('/cms/connect', payload);
        return response.data;
    },

    /** Login to CMS with marketplace password */
    async login(password: string): Promise<{ success: boolean; data: { accessToken: string } }> {
        const response = await api.post('/cms/login', { password });
        return response.data;
    },

    /** Get marketplace dashboard data (products + orders summary) */
    async getDashboard(): Promise<{ success: boolean; data: CmsDashboard }> {
        const response = await api.get('/cms/dashboard');
        return response.data;
    },

    /** List products */
    async getProducts(params?: Record<string, any>): Promise<{ success: boolean; data: any }> {
        const response = await api.get('/cms/products', { params });
        return response.data;
    },

    /** Create a new product */
    async createProduct(payload: CreateProductPayload): Promise<{ success: boolean; data: CmsProduct }> {
        const response = await api.post('/cms/products', payload);
        return response.data;
    },

    /** Update a product */
    async updateProduct(productId: string, payload: Partial<CreateProductPayload>): Promise<{ success: boolean; data: CmsProduct }> {
        const response = await api.patch(`/cms/products/${productId}`, payload);
        return response.data;
    },

    /** Delete a product */
    async deleteProduct(productId: string): Promise<{ success: boolean }> {
        const response = await api.delete(`/cms/products/${productId}`);
        return response.data;
    },
};
