export interface Advertisement {
  _id: string;
  tenantId: string;
  title: string;
  badgeText?: string;
  description?: string;
  imageUrl: string;
  ctaLabel: string;
  ctaUrl?: string;
  openInNewTab: boolean;
  placement: string;
  priority: number;
  isActive: boolean;
  dismissible: boolean;
  startsAt?: string;
  endsAt?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}
