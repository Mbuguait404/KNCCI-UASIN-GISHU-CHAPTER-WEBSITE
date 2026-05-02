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
    async updateApplicationStatus(id: string, status: string): Promise<{ success: boolean; data: { application: any; password?: string }; message: string }> {
        const response = await api.patch(`/membership-applications/admin/${id}/status`, { status });
        return response.data;
    },

    /** POST /membership-applications/admin/:id/send-approval */
    async sendApprovalEmail(id: string, password?: string): Promise<{ success: boolean; message: string }> {
        const response = await api.post(`/membership-applications/admin/${id}/send-approval`, { password });
        return response.data;
    },

    /** POST /membership-applications/:id/send-confirmation */
    async sendConfirmationEmail(id: string): Promise<{ success: boolean; message: string }> {
        const response = await api.post(`/membership-applications/${id}/send-confirmation`);
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
};

