import api from '@/lib/api';

export interface AttachmentRequest {
  _id: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  institution: string;
  course: string;
  attachmentStartDate: string;
  attachmentEndDate: string;
  documents: string[];
  status: 'pending' | 'matchmaking' | 'placed' | 'rejected' | 'completed';
  matchRequests: MatchRequest[];
  placedBusinessId?: string;
  note?: string;
  adminNotes?: string;
  createdAt: string;
  myMatchRequest?: MatchRequest;
}

export interface MatchRequest {
  _id: string;
  businessId: string;
  businessName: string;
  businessEmail?: string;
  status: 'pending' | 'accepted' | 'declined';
  requestedAt?: string;
  respondedAt?: string;
  businessNote?: string;
}

export interface AttachmentPagination {
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
}

export interface SubmitAttachmentData {
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  institution: string;
  course: string;
  attachmentStartDate: string;
  attachmentEndDate: string;
  documents?: string[];
}

export const attachmentService = {
  async uploadDocument(file: File): Promise<{ url: string }> {
    const form = new FormData();
    form.append('file', file);
    const res = await api.post('/attachment/upload-document', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data?.data || res.data;
  },

  async submit(data: SubmitAttachmentData): Promise<AttachmentRequest> {
    const res = await api.post('/attachment', data);
    return res.data?.data || res.data;
  },

  async adminList(params?: { page?: number; limit?: number; status?: string }): Promise<{ data: AttachmentRequest[]; pagination: AttachmentPagination }> {
    try {
      const res = await api.get('/attachment/admin', { params });
      return {
        data: (res.data?.data ?? []) as AttachmentRequest[],
        pagination: (res.data?.pagination ?? { total: 0, page: 1, limit: 20, totalPages: 1 }) as AttachmentPagination,
      };
    } catch {
      const res = await api.get('/attachments/admin', { params });
      return res.data?.data ?? { data: [], pagination: { total: 0, page: 1, limit: 10 } };
    }
  },

  async adminGetOne(id: string): Promise<AttachmentRequest> {
    const res = await api.get(`/attachment/admin/${id}`);
    return res.data?.data || res.data;
  },

  async adminMatchmake(requestId: string, businessIds: string[]): Promise<AttachmentRequest> {
    try {
      const res = await api.post(`/attachment/admin/${requestId}/matchmake`, { businessIds });
      return res.data?.data || res.data;
    } catch {
      const res = await api.post(`/attachments/${requestId}/matchmake`, { businessIds });
      return res.data?.data || res.data;
    }
  },

  async adminUpdate(requestId: string, data: { adminNotes?: string; status?: string }): Promise<AttachmentRequest> {
    const res = await api.patch(`/attachment/admin/${requestId}`, data);
    return res.data?.data || res.data;
  },

  async businessList(): Promise<AttachmentRequest[]> {
    try {
      const res = await api.get('/attachment/business');
      return res.data?.data || res.data;
    } catch {
      const res = await api.get('/attachments/business');
      return res.data?.data ?? [];
    }
  },

  async businessRespond(requestId: string, accept: boolean, note?: string): Promise<AttachmentRequest> {
    try {
      const res = await api.patch(`/attachment/business/${requestId}/respond`, { accept, note });
      return res.data?.data || res.data;
    } catch {
      const status = accept ? 'accepted' : 'declined';
      const res = await api.patch(`/attachments/${requestId}/respond`, { status, note });
      return res.data?.data || res.data;
    }
  },

  async respond(id: string, status: 'accepted' | 'declined', note?: string): Promise<{ success: boolean }> {
    const accept = status === 'accepted';
    await this.businessRespond(id, accept, note);
    return { success: true };
  },
};
