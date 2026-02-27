import api from '@/lib/api';


export interface DashboardStats {
    totalMembers: number;
    plans: {
        Bronze: number;
        Silver: number;
        Gold: number;
    };
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
};
