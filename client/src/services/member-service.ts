import api from '@/lib/api';

export interface MemberDashboardStats {
    totalMeetings?: number;
    upcomingMeetings?: number;
    memberType?: string;
    memberSince?: string;
}

export interface FinancialsData {
    balance?: number;
    transactions?: { date: string; amount: number; description: string }[];
}

export const memberService = {
    getDashboardStats: async (): Promise<{ success: boolean; data: MemberDashboardStats }> => {
        const res = await api.get('/members/dashboard-stats');
        return res.data;
    },
};
