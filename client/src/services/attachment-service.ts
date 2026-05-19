import api from '@/lib/api';

export interface AttachmentMatchRequest {
    _id: string;
    businessId: string;
    businessName: string;
    status: 'pending' | 'accepted' | 'declined';
}

export interface AttachmentRequest {
    _id: string;
    studentName: string;
    studentEmail: string;
    studentPhone?: string;
    course: string;
    institution: string;
    attachmentStartDate: string;
    attachmentEndDate: string;
    status: 'pending' | 'matchmaking' | 'placed' | 'rejected' | 'completed';
    documents: string[];
    matchRequests: AttachmentMatchRequest[];
    note?: string;
    createdAt: string;
}

export interface AttachmentPagination {
    total: number;
    page: number;
    limit: number;
}

export const attachmentService = {
    businessList: async (): Promise<AttachmentRequest[]> => {
        const res = await api.get('/attachments/business');
        return res.data?.data ?? [];
    },

    respond: async (id: string, status: 'accepted' | 'declined', note?: string): Promise<{ success: boolean }> => {
        const res = await api.patch(`/attachments/${id}/respond`, { status, note });
        return res.data;
    },

    adminList: async (params?: { status?: string; page?: number; limit?: number }): Promise<{ data: AttachmentRequest[]; pagination: AttachmentPagination }> => {
        const res = await api.get('/attachments/admin', { params });
        return res.data?.data ?? { data: [], pagination: { total: 0, page: 1, limit: 10 } };
    },

    adminMatchmake: async (id: string, businessIds: string[]): Promise<{ success: boolean }> => {
        const res = await api.post(`/attachments/${id}/matchmake`, { businessIds });
        return res.data;
    },
};
