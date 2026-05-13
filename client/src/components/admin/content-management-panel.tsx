import type { ChangeEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  CalendarDays,
  ImagePlus,
  Loader2,
  Newspaper,
  Plus,
  Trash2,
  Pencil,
  Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { contentAdminService } from "@/services/content-admin-service";
import type {
  ContentAudience,
  ContentBlogPost,
  ContentStatus,
  WebsiteEventAgendaItem,
  WebsiteEventContent,
  WebsiteGalleryItem,
} from "@/types/content";

type ContentTab = "blogs" | "events" | "gallery";
type UploadTarget = "blog" | "event" | "gallery";

interface BlogFormState {
  title: string;
  author: string;
  category: string;
  excerpt: string;
  featuredImage: string;
  content: string;
  tags: string;
  status: ContentStatus;
  audience: ContentAudience;
  isFeatured: boolean;
}

interface EventFormState {
  title: string;
  date: string;
  location: string;
  image: string;
  category: string;
  description: string;
  content: string;
  longDescription: string;
  registrationLink: string;
  status: ContentStatus;
  featured: boolean;
  isPast: boolean;
  agenda: WebsiteEventAgendaItem[];
}

interface GalleryFormState {
  eventName: string;
  year: string;
  url: string;
  alt: string;
  status: ContentStatus;
}

interface ImageUrlFieldProps {
  label: string;
  value: string;
  previewAlt: string;
  uploading: boolean;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

function createEmptyBlogForm(): BlogFormState {
  return {
    title: "",
    author: "KNCCI Uasin Gishu",
    category: "",
    excerpt: "",
    featuredImage: "",
    content: "",
    tags: "",
    status: "published",
    audience: "website",
    isFeatured: false,
  };
}

function createEmptyEventForm(): EventFormState {
  return {
    title: "",
    date: "",
    location: "",
    image: "",
    category: "",
    description: "",
    content: "",
    longDescription: "",
    registrationLink: "",
    status: "published",
    featured: false,
    isPast: false,
    agenda: [{ time: "", activity: "" }],
  };
}

function createEmptyGalleryForm(): GalleryFormState {
  return {
    eventName: "",
    year: String(new Date().getFullYear()),
    url: "",
    alt: "",
    status: "published",
  };
}

function formatDate(value?: string) {
  if (!value) return "Just now";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function ImageUrlField({ label, value, previewAlt, uploading, onFileChange }: ImageUrlFieldProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <Label>{label}</Label>
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-primary">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {uploading ? "Uploading..." : "Upload image"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFileChange}
            disabled={uploading}
          />
        </label>
      </div>

      <Input
        value={value}
        readOnly
        placeholder="Upload an image to autofill this URL"
        className="bg-muted/30"
      />
      <p className="text-xs text-muted-foreground">
        Images are uploaded through the image upload API and the returned URL is filled in automatically.
      </p>

      {value ? (
        <div className="overflow-hidden rounded-xl border border-border/50 bg-muted/20">
          <img src={value} alt={previewAlt} className="h-48 w-full object-cover" />
        </div>
      ) : null}
    </div>
  );
}

export function ContentManagementPanel() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<ContentTab>("blogs");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingTarget, setUploadingTarget] = useState<UploadTarget | null>(null);

  const [blogs, setBlogs] = useState<ContentBlogPost[]>([]);
  const [events, setEvents] = useState<WebsiteEventContent[]>([]);
  const [galleryItems, setGalleryItems] = useState<WebsiteGalleryItem[]>([]);

  const [blogDialogOpen, setBlogDialogOpen] = useState(false);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [galleryDialogOpen, setGalleryDialogOpen] = useState(false);

  const [editingBlog, setEditingBlog] = useState<ContentBlogPost | null>(null);
  const [editingEvent, setEditingEvent] = useState<WebsiteEventContent | null>(null);
  const [editingGalleryItem, setEditingGalleryItem] = useState<WebsiteGalleryItem | null>(null);

  const [blogForm, setBlogForm] = useState<BlogFormState>(createEmptyBlogForm());
  const [eventForm, setEventForm] = useState<EventFormState>(createEmptyEventForm());
  const [galleryForm, setGalleryForm] = useState<GalleryFormState>(createEmptyGalleryForm());
  const uploading = uploadingTarget !== null;

  const loadContent = async () => {
    setLoading(true);
    try {
      const [blogRes, eventRes, galleryRes] = await Promise.all([
        contentAdminService.listBlogs({ limit: 100 }),
        contentAdminService.listEvents(),
        contentAdminService.listGallery(),
      ]);

      if (blogRes.success) {
        setBlogs(blogRes.data.posts || []);
      }
      if (eventRes.success) {
        setEvents(eventRes.data || []);
      }
      if (galleryRes.success) {
        setGalleryItems(galleryRes.data || []);
      }
    } catch (error: any) {
      toast({
        title: "Content unavailable",
        description: error?.response?.data?.message || error?.message || "Failed to load content.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const stats = useMemo(
    () => ({
      blogs: blogs.length,
      events: events.length,
      gallery: galleryItems.length,
    }),
    [blogs.length, events.length, galleryItems.length],
  );

  const openCreateBlog = () => {
    setEditingBlog(null);
    setBlogForm(createEmptyBlogForm());
    setBlogDialogOpen(true);
  };

  const openEditBlog = (blog: ContentBlogPost) => {
    setEditingBlog(blog);
    setBlogForm({
      title: blog.title,
      author: blog.author,
      category: blog.category || "",
      excerpt: blog.excerpt || "",
      featuredImage: blog.featuredImage || "",
      content: blog.content || "",
      tags: (blog.tags || []).join(", "),
      status: blog.status,
      audience: blog.audience,
      isFeatured: blog.isFeatured,
    });
    setBlogDialogOpen(true);
  };

  const openCreateEvent = () => {
    setEditingEvent(null);
    setEventForm(createEmptyEventForm());
    setEventDialogOpen(true);
  };

  const openEditEvent = (event: WebsiteEventContent) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      date: event.date,
      location: event.location,
      image: event.image,
      category: event.category,
      description: event.description,
      content: event.content || "",
      longDescription: event.longDescription || "",
      registrationLink: event.registrationLink || "",
      status: event.status,
      featured: event.featured,
      isPast: event.isPast,
      agenda: event.agenda && event.agenda.length > 0 ? event.agenda : [{ time: "", activity: "" }],
    });
    setEventDialogOpen(true);
  };

  const openCreateGalleryItem = () => {
    setEditingGalleryItem(null);
    setGalleryForm(createEmptyGalleryForm());
    setGalleryDialogOpen(true);
  };

  const openEditGalleryItem = (item: WebsiteGalleryItem) => {
    setEditingGalleryItem(item);
    setGalleryForm({
      eventName: item.eventName,
      year: item.year,
      url: item.url,
      alt: item.alt,
      status: item.status,
    });
    setGalleryDialogOpen(true);
  };

  const uploadToField = async (file: File, target: UploadTarget) => {
    setUploadingTarget(target);
    try {
      const response = await contentAdminService.uploadImage(file);
      const url = response.data?.url;
      if (!url) {
        throw new Error("No file URL returned.");
      }

      if (target === "blog") {
        setBlogForm((current) => ({ ...current, featuredImage: url }));
      } else if (target === "event") {
        setEventForm((current) => ({ ...current, image: url }));
      } else {
        setGalleryForm((current) => ({ ...current, url }));
      }

      toast({
        title: "Image uploaded",
        description: "The image URL was added to the form.",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error?.response?.data?.message || error?.message || "Failed to upload image.",
        variant: "destructive",
      });
    } finally {
      setUploadingTarget(null);
    }
  };

  const handleImageFileChange = async (event: ChangeEvent<HTMLInputElement>, target: UploadTarget) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }

    await uploadToField(file, target);
  };

  const saveBlog = async () => {
    setSaving(true);
    try {
      const payload = {
        title: blogForm.title,
        author: blogForm.author,
        category: blogForm.category,
        excerpt: blogForm.excerpt,
        featuredImage: blogForm.featuredImage,
        content: blogForm.content,
        status: blogForm.status,
        audience: blogForm.audience,
        isFeatured: blogForm.isFeatured,
        tags: blogForm.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      if (editingBlog) {
        await contentAdminService.updateBlog(editingBlog._id, payload);
      } else {
        await contentAdminService.createBlog(payload);
      }

      toast({
        title: editingBlog ? "Blog updated" : "Blog created",
        description: "The blog post has been saved.",
      });
      setBlogDialogOpen(false);
      await loadContent();
    } catch (error: any) {
      toast({
        title: "Save failed",
        description: error?.response?.data?.message || error?.message || "Failed to save blog post.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const saveEvent = async () => {
    setSaving(true);
    try {
      const payload = {
        ...eventForm,
        agenda: eventForm.agenda.filter((item) => item.time.trim() && item.activity.trim()),
      };

      if (editingEvent) {
        await contentAdminService.updateEvent(editingEvent._id, payload);
      } else {
        await contentAdminService.createEvent(payload);
      }

      toast({
        title: editingEvent ? "Event updated" : "Event created",
        description: "The event has been saved.",
      });
      setEventDialogOpen(false);
      await loadContent();
    } catch (error: any) {
      toast({
        title: "Save failed",
        description: error?.response?.data?.message || error?.message || "Failed to save event.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const saveGalleryItem = async () => {
    setSaving(true);
    try {
      if (editingGalleryItem) {
        await contentAdminService.updateGalleryItem(editingGalleryItem._id, galleryForm);
      } else {
        await contentAdminService.createGalleryItem(galleryForm);
      }

      toast({
        title: editingGalleryItem ? "Gallery item updated" : "Gallery item created",
        description: "The gallery item has been saved.",
      });
      setGalleryDialogOpen(false);
      await loadContent();
    } catch (error: any) {
      toast({
        title: "Save failed",
        description: error?.response?.data?.message || error?.message || "Failed to save gallery item.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteBlog = async (blogId: string) => {
    if (!window.confirm("Delete this blog post?")) return;
    try {
      await contentAdminService.deleteBlog(blogId);
      toast({ title: "Blog deleted" });
      await loadContent();
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error?.response?.data?.message || error?.message || "Failed to delete blog post.",
        variant: "destructive",
      });
    }
  };

  const deleteEvent = async (eventId: string) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await contentAdminService.deleteEvent(eventId);
      toast({ title: "Event deleted" });
      await loadContent();
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error?.response?.data?.message || error?.message || "Failed to delete event.",
        variant: "destructive",
      });
    }
  };

  const deleteGalleryItem = async (itemId: string) => {
    if (!window.confirm("Delete this gallery item?")) return;
    try {
      await contentAdminService.deleteGalleryItem(itemId);
      toast({ title: "Gallery item deleted" });
      await loadContent();
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error?.response?.data?.message || error?.message || "Failed to delete gallery item.",
        variant: "destructive",
      });
    }
  };

  const updateAgendaItem = (index: number, key: keyof WebsiteEventAgendaItem, value: string) => {
    setEventForm((current) => ({
      ...current,
      agenda: current.agenda.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    }));
  };

  const addAgendaItem = () => {
    setEventForm((current) => ({
      ...current,
      agenda: [...current.agenda, { time: "", activity: "" }],
    }));
  };

  const removeAgendaItem = (index: number) => {
    setEventForm((current) => ({
      ...current,
      agenda: current.agenda.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Blogs", value: stats.blogs, icon: <Newspaper className="h-5 w-5" /> },
          { label: "Events", value: stats.events, icon: <CalendarDays className="h-5 w-5" /> },
          { label: "Gallery", value: stats.gallery, icon: <ImagePlus className="h-5 w-5" /> },
        ].map((stat) => (
          <Card key={stat.label} className="border-border/50 shadow-sm">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  {stat.label}
                </p>
                <p className="mt-2 text-3xl font-extrabold">{stat.value}</p>
              </div>
              <div className="rounded-2xl bg-primary/10 p-3 text-primary">{stat.icon}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-2xl font-extrabold">Content Management</CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage editorial blogs, chamber events, and gallery images from one dashboard.
              </p>
            </div>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ContentTab)}>
              <TabsList className="grid w-full grid-cols-3 lg:w-[360px]">
                <TabsTrigger value="blogs">Blogs</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              <Loader2 className="mr-3 h-5 w-5 animate-spin" />
              Loading content...
            </div>
          ) : null}

          {!loading && activeTab === "blogs" && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button onClick={openCreateBlog} className="gap-2 rounded-xl">
                  <Plus className="h-4 w-4" />
                  New blog post
                </Button>
              </div>
              <div className="grid gap-4">
                {blogs.map((blog) => (
                  <Card key={blog._id} className="border-border/50">
                    <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-bold">{blog.title}</h3>
                          <Badge variant={blog.status === "published" ? "default" : "secondary"}>
                            {blog.status}
                          </Badge>
                          <Badge variant="outline">{blog.audience}</Badge>
                          {blog.isFeatured ? <Badge className="bg-amber-500 text-white">Featured</Badge> : null}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {blog.author} • {blog.category || "Uncategorized"} • Updated {formatDate(blog.updatedAt || blog.createdAt)}
                        </p>
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {blog.excerpt || "No excerpt provided."}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-2" onClick={() => openEditBlog(blog)}>
                          <Pencil className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2 text-red-600" onClick={() => deleteBlog(blog._id)}>
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {blogs.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border px-6 py-12 text-center text-muted-foreground">
                    No blog posts yet.
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {!loading && activeTab === "events" && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button onClick={openCreateEvent} className="gap-2 rounded-xl">
                  <Plus className="h-4 w-4" />
                  New event
                </Button>
              </div>
              <div className="grid gap-4">
                {events.map((event) => (
                  <Card key={event._id} className="border-border/50">
                    <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-bold">{event.title}</h3>
                          <Badge variant={event.status === "published" ? "default" : "secondary"}>
                            {event.status}
                          </Badge>
                          {event.featured ? <Badge className="bg-amber-500 text-white">Featured</Badge> : null}
                          {event.isPast ? <Badge variant="outline">Past</Badge> : <Badge variant="outline">Upcoming</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {event.date} • {event.location} • {event.category}
                        </p>
                        <p className="line-clamp-2 text-sm text-muted-foreground">{event.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-2" onClick={() => openEditEvent(event)}>
                          <Pencil className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2 text-red-600" onClick={() => deleteEvent(event._id)}>
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {events.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border px-6 py-12 text-center text-muted-foreground">
                    No events yet.
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {!loading && activeTab === "gallery" && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button onClick={openCreateGalleryItem} className="gap-2 rounded-xl">
                  <Plus className="h-4 w-4" />
                  New gallery item
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {galleryItems.map((item) => (
                  <Card key={item._id} className="overflow-hidden border-border/50">
                    <div className="aspect-video bg-slate-100">
                      {item.url ? (
                        <img src={item.url} alt={item.alt} className="h-full w-full object-cover" />
                      ) : null}
                    </div>
                    <CardContent className="space-y-3 p-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold">{item.eventName}</h3>
                        <Badge variant={item.status === "published" ? "default" : "secondary"}>
                          {item.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.year} • {item.alt}
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-2" onClick={() => openEditGalleryItem(item)}>
                          <Pencil className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2 text-red-600" onClick={() => deleteGalleryItem(item._id)}>
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {galleryItems.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border px-6 py-12 text-center text-muted-foreground md:col-span-2 xl:col-span-3">
                    No gallery items yet.
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={blogDialogOpen} onOpenChange={setBlogDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{editingBlog ? "Edit blog post" : "Create blog post"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={blogForm.title} onChange={(event) => setBlogForm((current) => ({ ...current, title: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Author</Label>
                <Input value={blogForm.author} onChange={(event) => setBlogForm((current) => ({ ...current, author: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input value={blogForm.category} onChange={(event) => setBlogForm((current) => ({ ...current, category: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Tags</Label>
                <Input
                  placeholder="trade, policy, events"
                  value={blogForm.tags}
                  onChange={(event) => setBlogForm((current) => ({ ...current, tags: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={blogForm.status} onValueChange={(value) => setBlogForm((current) => ({ ...current, status: value as ContentStatus }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Audience</Label>
                <Select value={blogForm.audience} onValueChange={(value) => setBlogForm((current) => ({ ...current, audience: value as ContentAudience }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website">Website only</SelectItem>
                    <SelectItem value="marketplace">Marketplace only</SelectItem>
                    <SelectItem value="both">Website and marketplace</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Excerpt</Label>
              <Textarea value={blogForm.excerpt} onChange={(event) => setBlogForm((current) => ({ ...current, excerpt: event.target.value }))} rows={3} />
            </div>

            <ImageUrlField
              label="Featured image URL"
              value={blogForm.featuredImage}
              previewAlt={blogForm.title || "Blog featured image preview"}
              uploading={uploadingTarget === "blog"}
              onFileChange={(event) => {
                void handleImageFileChange(event, "blog");
              }}
            />

            <div className="flex items-center justify-between rounded-xl border border-border/50 px-4 py-3">
              <div>
                <p className="font-semibold">Feature this post</p>
                <p className="text-sm text-muted-foreground">Featured posts appear first on the website blog page.</p>
              </div>
              <Switch checked={blogForm.isFeatured} onCheckedChange={(checked) => setBlogForm((current) => ({ ...current, isFeatured: Boolean(checked) }))} />
            </div>

            <div className="space-y-2">
              <Label>Content</Label>
              <ReactQuill value={blogForm.content} onChange={(value) => setBlogForm((current) => ({ ...current, content: value }))} theme="snow" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBlogDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveBlog} disabled={saving || uploading}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save blog
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={eventDialogOpen} onOpenChange={setEventDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{editingEvent ? "Edit event" : "Create event"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={eventForm.title} onChange={(event) => setEventForm((current) => ({ ...current, title: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Date label</Label>
                <Input placeholder="July 23-25, 2026" value={eventForm.date} onChange={(event) => setEventForm((current) => ({ ...current, date: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input value={eventForm.location} onChange={(event) => setEventForm((current) => ({ ...current, location: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input value={eventForm.category} onChange={(event) => setEventForm((current) => ({ ...current, category: event.target.value }))} />
              </div>
              <div className="md:col-span-2">
                <ImageUrlField
                  label="Event image URL"
                  value={eventForm.image}
                  previewAlt={eventForm.title || "Event image preview"}
                  uploading={uploadingTarget === "event"}
                  onFileChange={(event) => {
                    void handleImageFileChange(event, "event");
                  }}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={eventForm.status} onValueChange={(value) => setEventForm((current) => ({ ...current, status: value as ContentStatus }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Registration link</Label>
                <Input value={eventForm.registrationLink} onChange={(event) => setEventForm((current) => ({ ...current, registrationLink: event.target.value }))} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between rounded-xl border border-border/50 px-4 py-3">
                <div>
                  <p className="font-semibold">Featured event</p>
                  <p className="text-sm text-muted-foreground">Show this event first on the events page.</p>
                </div>
                <Switch checked={eventForm.featured} onCheckedChange={(checked) => setEventForm((current) => ({ ...current, featured: Boolean(checked) }))} />
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border/50 px-4 py-3">
                <div>
                  <p className="font-semibold">Past event</p>
                  <p className="text-sm text-muted-foreground">Moves the event into the past events section.</p>
                </div>
                <Switch checked={eventForm.isPast} onCheckedChange={(checked) => setEventForm((current) => ({ ...current, isPast: Boolean(checked) }))} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Short description</Label>
              <Textarea value={eventForm.description} onChange={(event) => setEventForm((current) => ({ ...current, description: event.target.value }))} rows={3} />
            </div>

            <div className="space-y-2">
              <Label>Long description</Label>
              <Textarea value={eventForm.longDescription} onChange={(event) => setEventForm((current) => ({ ...current, longDescription: event.target.value }))} rows={5} />
            </div>

            <div className="space-y-2">
              <Label>Rich content</Label>
              <ReactQuill value={eventForm.content} onChange={(value) => setEventForm((current) => ({ ...current, content: value }))} theme="snow" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Agenda</Label>
                <Button type="button" variant="outline" size="sm" onClick={addAgendaItem}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add agenda row
                </Button>
              </div>
              {eventForm.agenda.map((item, index) => (
                <div key={`agenda-${index}`} className="grid gap-3 rounded-xl border border-border/50 p-4 md:grid-cols-[180px_1fr_auto]">
                  <Input
                    placeholder="09:00 AM"
                    value={item.time}
                    onChange={(event) => updateAgendaItem(index, "time", event.target.value)}
                  />
                  <Input
                    placeholder="Opening keynote"
                    value={item.activity}
                    onChange={(event) => updateAgendaItem(index, "activity", event.target.value)}
                  />
                  <Button type="button" variant="outline" size="icon" onClick={() => removeAgendaItem(index)} disabled={eventForm.agenda.length === 1}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEventDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveEvent} disabled={saving || uploading}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={galleryDialogOpen} onOpenChange={setGalleryDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingGalleryItem ? "Edit gallery item" : "Create gallery item"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Event name</Label>
                <Input value={galleryForm.eventName} onChange={(event) => setGalleryForm((current) => ({ ...current, eventName: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Input value={galleryForm.year} onChange={(event) => setGalleryForm((current) => ({ ...current, year: event.target.value }))} />
              </div>
            </div>
            <ImageUrlField
              label="Image URL"
              value={galleryForm.url}
              previewAlt={galleryForm.alt || galleryForm.eventName || "Gallery image preview"}
              uploading={uploadingTarget === "gallery"}
              onFileChange={(event) => {
                void handleImageFileChange(event, "gallery");
              }}
            />
            <div className="space-y-2">
              <Label>Alt text</Label>
              <Textarea value={galleryForm.alt} onChange={(event) => setGalleryForm((current) => ({ ...current, alt: event.target.value }))} rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={galleryForm.status} onValueChange={(value) => setGalleryForm((current) => ({ ...current, status: value as ContentStatus }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGalleryDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveGalleryItem} disabled={saving || uploading}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save gallery item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

