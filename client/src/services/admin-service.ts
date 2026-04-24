import api from '@/lib/api';


export interface DashboardStats {
    totalMembers: number;
    plans: {
        Bronze: number;
        Silver: number;
        Gold: number;
    };
    totalSellers?: number;
    pendingSellers?: number;
}

export interface MemberListParams {
    page?: number;
    limit?: number;
    search?: string;
    role?: 'member' | 'admin';
    plan?: 'Bronze' | 'Silver' | 'Gold';
}

export interface MemberDoc {
    _id: string;
    name: string;
    email: string;
    reg_no: string;
    role: string;
    phone?: string;
    business?: {
        _id: string;
        name: string;
        category: string;
        plan: string;
        location: string;
        email: string;
        phone: string;
        website?: string;
        description?: string;
        services?: string[];
        kra_pin?: string;
        company_reg_no?: string;
        business_permit?: string;
        certificateUrl?: string;
        logoUrl?: string;
    };
}


export interface PaginatedMembers {
    members: MemberDoc[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

// ── Seller Types ────────────────────────────────────────────────────────────

export type SellerStatus = 'pending' | 'approved' | 'rejected' | 'deactivated';

export interface SellerDoc {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    businessName: string;
    businessCategory: string;
    businessDescription?: string;
    businessLocation?: string;
    businessWebsite?: string;
    businessPhone?: string;
    businessEmail?: string;
    kraPin?: string;
    businessRegistrationNo?: string;
    logoUrl?: string;
    status: SellerStatus;
    rejectionReason?: string;
    adminNotes?: string;
    approvedAt?: string;
    approvedBy?: string;
    isEmailVerified: boolean;
    lastLogin?: string;
    cms_tenant_id?: string;
    cms_org_slug?: string;
    createdAt: string;
    updatedAt: string;
}

export interface PaginatedSellers {
    sellers: SellerDoc[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface SellerStats {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    deactivated: number;
}

export interface SellerListParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: SellerStatus;
}

// ── Order & Plan Types ──────────────────────────────────────────────────────

export interface OrderDoc {
    _id: string;
    buyerId: { _id: string; name: string; email: string };
    vendorId: { _id: string; name: string; email: string };
    amount: number;
    currency: string;
    status: string;
    escrowWalletId: string;
    paymentCheckoutId?: string;
    paymentStatus?: string;
    completedAt?: string;
    createdAt: string;
    metadata?: Record<string, any>;
}

export interface PaginatedOrders {
    orders: OrderDoc[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface SubscriptionPlan {
    _id: string;
    name: string;
    price: number;
    features: string[];
    isActive: boolean;
    description?: string;
    createdAt?: string;
}

export interface OrderStats {
    byStatus: { _id: string; count: number; totalAmount: number }[];
    statusCounts: { _id: string; count: number; totalAmount: number }[];
    revenueLast30Days: number;
    escrowBalance: number;
    monthlyRevenue: { _id: { month: number; year: number }; total: number }[];
    topVendors: { name: string; totalSales: number; count: number }[];
    totalOrders: number;
    totalRevenue: number;
}

export interface SubscriptionStats {
    activeSubscribersByPlan: { _id: string; count: number; totalRevenue: number }[];
    estimatedAnnualRevenue: number;
    planPopularity: { _id: string; count: number }[];
    totalSubscribers: number;
    topPlan: string;
}

export interface PaginatedSubscribers {
    subscribers: any[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export const adminService = {
    /** GET /admin/stats */
    async getStats(): Promise<{ success: boolean; data: DashboardStats; message: string }> {
        const response = await api.get('/admin/stats');
        return response.data;
    },

    /** GET /admin/members (paginated, searchable, filterable) */
    async getMembers(params?: MemberListParams): Promise<{ success: boolean; data: PaginatedMembers; message: string }> {
        const response = await api.get('/admin/members', { params });
        return response.data;
    },

    /** GET /admin/members/:id */
    async getMember(id: string): Promise<{ success: boolean; data: MemberDoc; message: string }> {
        const response = await api.get(`/admin/members/${id}`);
        return response.data;
    },

    /** PATCH /admin/members/:id/role */
    async updateRole(id: string, role: 'member' | 'admin'): Promise<{ success: boolean; message: string }> {
        const response = await api.patch(`/admin/members/${id}/role`, { role });
        return response.data;
    },

    /** PATCH /admin/members/:id/plan */
    async updatePlan(id: string, plan: 'Bronze' | 'Silver' | 'Gold'): Promise<{ success: boolean; message: string }> {
        const response = await api.patch(`/admin/members/${id}/plan`, { plan });
        return response.data;
    },

    /** PATCH /admin/members/:id/reset-password */
    async resetPassword(id: string, newPassword: string): Promise<{ success: boolean; message: string }> {
        const response = await api.patch(`/admin/members/${id}/reset-password`, { newPassword });
        return response.data;
    },

    /** DELETE /admin/members/:id */
    async deleteMember(id: string): Promise<{ success: boolean; message: string }> {
        const response = await api.delete(`/admin/members/${id}`);
        return response.data;
    },

    /** GET /membership-applications/admin/all */
    async getApplications(): Promise<{ success: boolean; data: any[]; message: string }> {
        const response = await api.get('/membership-applications/admin/all');
        return response.data;
    },

    /** PATCH /membership-applications/admin/:id/status */
    async updateApplicationStatus(id: string, status: string): Promise<{ success: boolean; message: string }> {
        const response = await api.patch(`/membership-applications/admin/${id}/status`, { status });
        return response.data;
    },
    
    /** PATCH /membership-applications/admin/:id */
    async updateApplication(id: string, data: any): Promise<{ success: boolean; message: string }> {
        const response = await api.patch(`/membership-applications/admin/${id}`, data);
        return response.data;
    },

    /** DELETE /membership-applications/admin/:id */
    async deleteApplication(id: string): Promise<{ success: boolean; message: string }> {
        const response = await api.delete(`/membership-applications/admin/${id}`);
        return response.data;
    },
    
    /** PATCH /admin/members/:id/profile */
    async updateMemberProfile(id: string, data: any): Promise<{ success: boolean; data: MemberDoc; message: string }> {
        const response = await api.patch(`/admin/members/${id}/profile`, data);
        return response.data;
    },

    /** POST /admin/members/:id/upload/:type */
    async uploadFile(id: string, type: 'logo' | 'certificate', file: File): Promise<{ success: boolean; data: any; message: string }> {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post(`/admin/members/${id}/upload/${type}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // ── SELLER MANAGEMENT ───────────────────────────────────────────────────
    // ═══════════════════════════════════════════════════════════════════════════

    /** GET /admin/sellers/stats */
    async getSellerStats(): Promise<{ success: boolean; data: SellerStats; message: string }> {
        const response = await api.get('/admin/sellers/stats');
        return response.data;
    },

    /** GET /admin/sellers (paginated, searchable, filterable) */
    async getSellers(params?: SellerListParams): Promise<{ success: boolean; data: PaginatedSellers; message: string }> {
        const response = await api.get('/admin/sellers', { params });
        return response.data;
    },

    /** GET /admin/sellers/:id */
    async getSeller(id: string): Promise<{ success: boolean; data: SellerDoc; message: string }> {
        const response = await api.get(`/admin/sellers/${id}`);
        return response.data;
    },

    /** PATCH /admin/sellers/:id/status */
    async updateSellerStatus(
        id: string,
        status: SellerStatus,
        rejectionReason?: string,
        adminNotes?: string,
    ): Promise<{ success: boolean; data: SellerDoc; message: string }> {
        const response = await api.patch(`/admin/sellers/${id}/status`, {
            status,
            rejectionReason,
            adminNotes,
        });
        return response.data;
    },

    /** DELETE /admin/sellers/:id */
    async deleteSeller(id: string): Promise<{ success: boolean; message: string }> {
        const response = await api.delete(`/admin/sellers/${id}`);
        return response.data;
    },

    // ── SUBSCRIPTION PLAN MANAGEMENT ──────────────────────────────────────────

    /** GET /admin/plans */
    async getPlans(all = false): Promise<{ success: boolean; data: SubscriptionPlan[]; message: string }> {
        const response = await api.get('/admin/plans', { params: { all } });
        return response.data;
    },

    /** POST /admin/plans */
    async createPlan(data: Partial<SubscriptionPlan>): Promise<{ success: boolean; data: SubscriptionPlan; message: string }> {
        const response = await api.post('/admin/plans', data);
        return response.data;
    },

    /** PATCH /admin/plans/:id */
    async updateSubscriptionPlan(id: string, data: Partial<SubscriptionPlan>): Promise<{ success: boolean; data: SubscriptionPlan; message: string }> {
        const response = await api.patch(`/admin/plans/${id}`, data);
        return response.data;
    },

    /** DELETE /admin/plans/:id */
    async deletePlan(id: string): Promise<{ success: boolean; message: string }> {
        const response = await api.delete(`/admin/plans/${id}`);
        return response.data;
    },

    // ── ORDER MANAGEMENT ────────────────────────────────────────────────────

    /** GET /admin/orders */
    async getOrders(params?: any): Promise<{ success: boolean; data: PaginatedOrders; message: string }> {
        const response = await api.get('/admin/orders', { params });
        return response.data;
    },

    /** GET /admin/orders/stats */
    async getOrderStats(): Promise<{ success: boolean; data: OrderStats; message: string }> {
        const response = await api.get('/admin/orders/stats');
        return response.data;
    },

    /** POST /admin/orders/:id/release */
    async releaseEscrow(id: string): Promise<{ success: boolean; message: string }> {
        const response = await api.post(`/admin/orders/${id}/release`);
        return response.data;
    },
    
    /** GET /admin/subscriptions/stats */
    async getSubscriptionStats(): Promise<{ success: boolean; data: SubscriptionStats; message: string }> {
        const response = await api.get('/admin/subscriptions/stats');
        return response.data;
    },

    /** GET /admin/subscriptions/subscribers */
    async getSubscribers(params?: any): Promise<{ success: boolean; data: PaginatedSubscribers; message: string }> {
        const response = await api.get('/admin/subscriptions/subscribers', { params });
        return response.data;
    },
};

