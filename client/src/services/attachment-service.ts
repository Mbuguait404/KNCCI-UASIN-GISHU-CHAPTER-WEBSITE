import api from '@/lib/api';

export interface AttachmentRequest {
  _id: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  institution: string;
  course: string;
  attachmentStartDate: string;
  attachmentEndDate: string;
  documents: string[];
  status: 'pending' | 'matchmaking' | 'placed' | 'rejected' | 'completed';
  matchRequests: MatchRequest[];
  placedBusinessId?: string;
  adminNotes?: string;
  createdAt: string;
  myMatchRequest?: MatchRequest;
}

export interface MatchRequest {
  _id: string;
  businessId: string;
  businessName: string;
  businessEmail: string;
  status: 'pending' | 'accepted' | 'declined';
  requestedAt: string;
  respondedAt?: string;
  businessNote?: string;
}

export interface SubmitAttachmentData {
  studentName: string;
  studentEmail: string;
  studentPhone: string;
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

  async adminList(params?: { page?: number; limit?: number; status?: string }) {
    const res = await api.get('/attachment/admin', { params });
    return res.data?.data as { data: AttachmentRequest[]; pagination: any };
  },

  async adminGetOne(id: string): Promise<AttachmentRequest> {
    const res = await api.get(`/attachment/admin/${id}`);
    return res.data?.data || res.data;
  },

  async adminMatchmake(requestId: string, businessIds: string[]): Promise<AttachmentRequest> {
    const res = await api.post(`/attachment/admin/${requestId}/matchmake`, { businessIds });
    return res.data?.data || res.data;
  },

  async adminUpdate(requestId: string, data: { adminNotes?: string; status?: string }): Promise<AttachmentRequest> {
    const res = await api.patch(`/attachment/admin/${requestId}`, data);
    return res.data?.data || res.data;
  },

  async businessList(): Promise<AttachmentRequest[]> {
    const res = await api.get('/attachment/business');
    return res.data?.data || res.data;
  },

  async businessRespond(requestId: string, accept: boolean, note?: string): Promise<AttachmentRequest> {
    const res = await api.patch(`/attachment/business/${requestId}/respond`, { accept, note });
    return res.data?.data || res.data;
  },
};
