export type ContentStatus = "draft" | "published";
export type ContentAudience = "website" | "marketplace" | "both";

export interface WebsiteEventAgendaItem {
  time: string;
  activity: string;
}

export interface ContentBlogPost {
  _id: string;
  title: string;
  slug: string;
  content?: string;
  author: string;
  excerpt?: string;
  featuredImage?: string;
  category?: string;
  tags?: string[];
  status: ContentStatus;
  audience: ContentAudience;
  isFeatured: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContentBlogList {
  posts: ContentBlogPost[];
  total: number;
  page: number;
  totalPages: number;
}

export interface WebsiteEventContent {
  _id: string;
  title: string;
  slug: string;
  date: string;
  location: string;
  image: string;
  category: string;
  description: string;
  featured: boolean;
  isPast: boolean;
  content?: string;
  longDescription?: string;
  registrationLink?: string;
  agenda?: WebsiteEventAgendaItem[];
  status: ContentStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface WebsiteGalleryItem {
  _id: string;
  eventName: string;
  year: string;
  url: string;
  alt: string;
  status: ContentStatus;
  createdAt?: string;
  updatedAt?: string;
}

