import api from '@/lib/api';

// ── Types ───────────────────────────────────────────────────────────────────
export type MessageChannel = 'sms' | 'email';
export type MessageStatus = 'pending' | 'sent' | 'failed';

export interface MessageTemplate {
    _id: string;
    name: string;
    channel: MessageChannel;
    subject?: string;
    body: string;
    placeholders: string[];
    createdAt: string;
    updatedAt: string;
}

export interface MessageLogEntry {
    _id: string;
    channel: MessageChannel;
    recipient: string;
    recipientName?: string;
    subject?: string;
    message: string;
    status: MessageStatus;
    uniflowResponse?: string;
    errorMessage?: string;
    createdAt: string;
}

export interface SendMessagePayload {
    type: MessageChannel;
    to: string[];
    message: string;
    subject?: string;
}

export interface SendMessageResult {
    totalRecipients: number;
    sent: number;
    failed: number;
    results: { recipient: string; status: string; error?: string }[];
}

export interface CreateTemplatePayload {
    name: string;
    channel: MessageChannel;
    subject?: string;
    body: string;
    placeholders?: string[];
}

export interface MessagingStats {
    totalSent: number;
    totalFailed: number;
    totalSms: number;
    totalEmail: number;
}

export interface PaginatedLogs {
    logs: MessageLogEntry[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

// ── Service ─────────────────────────────────────────────────────────────────
export const messagingService = {
    // ── Send ────────────────────────────────────────────────────────────────
    async sendMessage(payload: SendMessagePayload): Promise<{ success: boolean; data: SendMessageResult }> {
        const response = await api.post('/messaging/send', payload);
        return response.data;
    },

    // ── Templates ───────────────────────────────────────────────────────────
    async getTemplates(channel?: MessageChannel): Promise<{ success: boolean; data: MessageTemplate[] }> {
        const params: any = {};
        if (channel) params.channel = channel;
        const response = await api.get('/messaging/templates', { params });
        return response.data;
    },

    async getTemplate(id: string): Promise<{ success: boolean; data: MessageTemplate }> {
        const response = await api.get(`/messaging/templates/${id}`);
        return response.data;
    },

    async createTemplate(payload: CreateTemplatePayload): Promise<{ success: boolean; data: MessageTemplate }> {
        const response = await api.post('/messaging/templates', payload);
        return response.data;
    },

    async updateTemplate(id: string, payload: Partial<CreateTemplatePayload>): Promise<{ success: boolean; data: MessageTemplate }> {
        const response = await api.put(`/messaging/templates/${id}`, payload);
        return response.data;
    },

    async deleteTemplate(id: string): Promise<{ success: boolean; message: string }> {
        const response = await api.delete(`/messaging/templates/${id}`);
        return response.data;
    },

    // ── Logs ────────────────────────────────────────────────────────────────
    async getLogs(params?: {
        page?: number;
        limit?: number;
        channel?: MessageChannel;
        status?: MessageStatus;
        search?: string;
    }): Promise<{ success: boolean; data: PaginatedLogs }> {
        const response = await api.get('/messaging/logs', { params });
        return response.data;
    },

    // ── Stats ───────────────────────────────────────────────────────────────
    async getStats(): Promise<{ success: boolean; data: MessagingStats }> {
        const response = await api.get('/messaging/stats');
        return response.data;
    },
};
