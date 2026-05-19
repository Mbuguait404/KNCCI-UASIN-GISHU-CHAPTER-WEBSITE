import api from '@/lib/api';

export interface MembershipSubscription {
  plan: string;
  status: string;
  isActive: boolean;
  startDate: string | null;
  endDate: string | null;
  nextPaymentDue: string | null;
  daysRemaining: number;
  totalPaid: number;
  paymentCount: number;
}

export interface MarketplaceSubscription {
  status: string;
  isActive: boolean;
  startDate: string | null;
  endDate: string | null;
  nextPaymentDue: string | null;
  daysRemaining: number;
  subscriptionFee: number;
  amountPaid: number;
  totalPaid: number;
  paymentCount: number;
}

export interface FinancialsData {
  membership: MembershipSubscription;
  marketplace: MarketplaceSubscription | null;
  payments: PaymentRecord[];
}

export interface MemberDashboardStats {
  totalMeetings?: number;
  upcomingMeetings?: number;
  memberType?: string;
  memberSince?: string;
  member: {
    id: string;
    name: string;
    email: string;
    role: string;
    membershipStatus: string;
    plan: string;
    membershipVerifiedAt: string | null;
    certificateUrl: string | null;
    logoUrl: string | null;
  };
  business: any | null;
  seller: {
    status: string;
    paymentStatus: string;
    amountPaid: number;
    subscriptionFee: number;
    isMember: boolean;
    kncciMemberId: string;
    businessName: string;
    businessCategory: string;
  } | null;
  financials: FinancialsData;
  stats: {
    totalPayments: number;
    totalSpent: number;
    activeEventRegistrations: number;
    totalActivities: number;
    activityBreakdown: Record<string, number>;
  };
  recentPayments: any[];
  recentActivities: any[];
  upcomingEvents: any[];
}

export interface ActivityLog {
  _id: string;
  type: string;
  title: string;
  description?: string;
  link?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface PaymentRecord {
  id: string;
  type: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
  description: string;
  transactionReference?: string;
  receiptUrl?: string;
  createdAt: string;
}

export interface EventRegistration {
  _id: string;
  eventId: {
    _id: string;
    title: string;
    startDate: string;
    endDate?: string;
    location?: string;
    description?: string;
    image?: string;
  };
  status: string;
  notes?: string;
  attendedAt?: string;
  createdAt: string;
}

export const memberService = {
  /** Get member dashboard overview stats */
  async getDashboardStats(): Promise<{ success: boolean; data: MemberDashboardStats; message?: string }> {
    try {
      const response = await api.get('/member/dashboard/stats');
      return response.data;
    } catch {
      const response = await api.get('/members/dashboard-stats');
      return response.data;
    }
  },

  /** Get member activity logs */
  async getActivities(page = 1, limit = 20): Promise<{ success: boolean; data: { activities: ActivityLog[]; pagination: any }; message: string }> {
    const response = await api.get('/member/dashboard/activities', { params: { page, limit } });
    return response.data;
  },

  /** Get member payment history */
  async getPayments(page = 1, limit = 20): Promise<{ success: boolean; data: { payments: PaymentRecord[]; totalSpent: number; pagination: any }; message: string }> {
    const response = await api.get('/member/dashboard/payments', { params: { page, limit } });
    return response.data;
  },

  /** Get member event registrations */
  async getEvents(page = 1, limit = 20): Promise<{ success: boolean; data: { events: EventRegistration[]; pagination: any }; message: string }> {
    const response = await api.get('/member/dashboard/events', { params: { page, limit } });
    return response.data;
  },

  /** Activate marketplace for member */
  async activateMarketplace(payload: {
    password: string;
    amountPaid: number;
    paymentMethod: string;
    transactionReference?: string;
    subscriptionFee: number;
  }): Promise<{ success: boolean; data: any; message: string }> {
    const response = await api.post('/member/marketplace/activate', payload);
    return response.data;
  },
};
