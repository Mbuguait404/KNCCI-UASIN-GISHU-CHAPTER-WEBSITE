import api from "@/lib/api";
import type {
  ContentAudience,
  ContentBlogList,
  ContentBlogPost,
  ContentStatus,
  WebsiteEventContent,
  WebsiteGalleryItem,
} from "@/types/content";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export const contentAdminService = {
  async listBlogs(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    status?: ContentStatus;
    audience?: ContentAudience;
  }): Promise<ApiResponse<ContentBlogList>> {
    const response = await api.get("/admin/content/blogs", { params });
    return response.data;
  },

  async createBlog(payload: Partial<ContentBlogPost>): Promise<ApiResponse<ContentBlogPost>> {
    const response = await api.post("/admin/content/blogs", payload);
    return response.data;
  },

  async updateBlog(blogId: string, payload: Partial<ContentBlogPost>): Promise<ApiResponse<ContentBlogPost>> {
    const response = await api.patch(`/admin/content/blogs/${blogId}`, payload);
    return response.data;
  },

  async deleteBlog(blogId: string): Promise<ApiResponse<null>> {
    const response = await api.delete(`/admin/content/blogs/${blogId}`);
    return response.data;
  },

  async listEvents(): Promise<ApiResponse<WebsiteEventContent[]>> {
    const response = await api.get("/admin/content/events");
    return response.data;
  },

  async createEvent(payload: Partial<WebsiteEventContent>): Promise<ApiResponse<WebsiteEventContent>> {
    const response = await api.post("/admin/content/events", payload);
    return response.data;
  },

  async updateEvent(eventId: string, payload: Partial<WebsiteEventContent>): Promise<ApiResponse<WebsiteEventContent>> {
    const response = await api.patch(`/admin/content/events/${eventId}`, payload);
    return response.data;
  },

  async deleteEvent(eventId: string): Promise<ApiResponse<null>> {
    const response = await api.delete(`/admin/content/events/${eventId}`);
    return response.data;
  },

  async listGallery(): Promise<ApiResponse<WebsiteGalleryItem[]>> {
    const response = await api.get("/admin/content/gallery");
    return response.data;
  },

  async createGalleryItem(payload: Partial<WebsiteGalleryItem>): Promise<ApiResponse<WebsiteGalleryItem>> {
    const response = await api.post("/admin/content/gallery", payload);
    return response.data;
  },

  async updateGalleryItem(itemId: string, payload: Partial<WebsiteGalleryItem>): Promise<ApiResponse<WebsiteGalleryItem>> {
    const response = await api.patch(`/admin/content/gallery/${itemId}`, payload);
    return response.data;
  },

  async deleteGalleryItem(itemId: string): Promise<ApiResponse<null>> {
    const response = await api.delete(`/admin/content/gallery/${itemId}`);
    return response.data;
  },

  async uploadImage(file: File): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/cms/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};

