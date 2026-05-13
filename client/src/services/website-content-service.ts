import type {
  ContentBlogList,
  ContentBlogPost,
  WebsiteEventContent,
  WebsiteGalleryItem,
} from "@/types/content";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

async function fetchPublic<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
  const url = new URL(`${API_URL}${path}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Request failed with status ${response.status}`);
  }

  const json = await response.json();
  return json.data ?? json;
}

export const websiteContentService = {
  async getBlogs(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
  }): Promise<ContentBlogList> {
    return fetchPublic<ContentBlogList>("/content/blogs", params);
  },

  async getBlogBySlug(slug: string): Promise<ContentBlogPost> {
    return fetchPublic<ContentBlogPost>(`/content/blogs/${slug}`);
  },

  async getEvents(): Promise<WebsiteEventContent[]> {
    return fetchPublic<WebsiteEventContent[]>("/content/events");
  },

  async getEvent(slugOrId: string): Promise<WebsiteEventContent> {
    return fetchPublic<WebsiteEventContent>(`/content/events/${slugOrId}`);
  },

  async getGallery(): Promise<WebsiteGalleryItem[]> {
    return fetchPublic<WebsiteGalleryItem[]>("/content/gallery");
  },
};

