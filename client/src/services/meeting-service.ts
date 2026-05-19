import api from '@/lib/api';

export type MeetingTargetGroup = 'directors' | 'all';
export type MeetingStatus = 'scheduled' | 'cancelled' | 'completed';

export interface MeetingDoc {
    _id: string;
    title: string;
    description?: string;
    location?: string;
    meetingLink?: string;
    startDateTime: string;
    endDateTime?: string;
    targetGroup: MeetingTargetGroup;
    status: MeetingStatus;
    createdBy?: { _id: string; name: string };
    notificationsSent: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface MeetingNote {
    _id: string;
    meetingId: string;
    userId: string;
    userName: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateMeetingPayload {
    title: string;
    description?: string;
    location?: string;
    startDateTime: string;
    endDateTime?: string;
    targetGroup?: MeetingTargetGroup;
}

export interface UpdateMeetingPayload {
    title?: string;
    description?: string;
    location?: string;
    startDateTime?: string;
    endDateTime?: string;
    targetGroup?: MeetingTargetGroup;
    status?: MeetingStatus;
}

export const meetingService = {
    /** GET /meetings — admin: all meetings */
    async getMeetings(): Promise<{ success: boolean; data: MeetingDoc[]; message: string }> {
        const response = await api.get('/meetings');
        return response.data;
    },

    /** GET /meetings/upcoming — member: upcoming meetings filtered by memberType */
    async getUpcomingMeetings(): Promise<{ success: boolean; data: MeetingDoc[]; message: string }> {
        const response = await api.get('/meetings/upcoming');
        return response.data;
    },

    async getMeeting(id: string): Promise<{ success: boolean; data: MeetingDoc; message: string }> {
        const response = await api.get(`/meetings/${id}`);
        return response.data;
    },

    async upsertNote(meetingId: string, content: string): Promise<{ success: boolean; data: MeetingNote; message: string }> {
        const response = await api.post(`/meetings/${meetingId}/notes`, { content });
        return response.data;
    },

    async getNotes(meetingId: string): Promise<{ success: boolean; data: MeetingNote[]; message: string }> {
        const response = await api.get(`/meetings/${meetingId}/notes`);
        return response.data;
    },

    /** POST /meetings */
    async createMeeting(payload: CreateMeetingPayload): Promise<{ success: boolean; data: MeetingDoc; message: string }> {
        const response = await api.post('/meetings', payload);
        return response.data;
    },

    /** PATCH /meetings/:id */
    async updateMeeting(id: string, payload: UpdateMeetingPayload): Promise<{ success: boolean; data: MeetingDoc; message: string }> {
        const response = await api.patch(`/meetings/${id}`, payload);
        return response.data;
    },

    /** DELETE /meetings/:id — soft cancel */
    async deleteMeeting(id: string): Promise<{ success: boolean; data: MeetingDoc; message: string }> {
        const response = await api.delete(`/meetings/${id}`);
        return response.data;
    },

    /** POST /meetings/:id/notify — send email+SMS to target group */
    async sendNotifications(id: string): Promise<{ success: boolean; data: any; message: string }> {
        const response = await api.post(`/meetings/${id}/notify`);
        return response.data;
    },
};
