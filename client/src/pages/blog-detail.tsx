import { useEffect, useMemo, useState } from "react";
import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { websiteContentService } from "@/services/website-content-service";
import type { ContentBlogPost } from "@/types/content";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  User,
  ArrowLeft,
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  Tag,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

function formatDate(value?: string) {
  if (!value) return "Recently";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-KE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogDetail() {
  const [, params] = useRoute("/blog/:id");
  const slug = params?.id;
  const [post, setPost] = useState<ContentBlogPost | null>(null);
  const [posts, setPosts] = useState<ContentBlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (!slug) return;

    const loadPost = async () => {
      setLoading(true);
      try {
        const [postData, listData] = await Promise.all([
          websiteContentService.getBlogBySlug(slug),
          websiteContentService.getBlogs({ page: 1, limit: 100 }),
        ]);
        setPost(postData);
        setPosts(listData.posts || []);
      } catch {
        setPost(null);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    void loadPost();
  }, [slug]);

  const relatedPosts = useMemo(() => {
    if (!post) return [];

    const sameCategoryPosts = posts.filter(
      (candidate) => candidate.category === post.category && candidate.slug !== post.slug,
    );

    const otherRecentPosts = posts.filter(
      (candidate) => candidate.category !== post.category && candidate.slug !== post.slug,
    );

    return [...sameCategoryPosts, ...otherRecentPosts].slice(0, 3);
  }, [post, posts]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex flex-grow items-center justify-center p-4 text-muted-foreground">
          Loading article...
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex flex-grow items-center justify-center p-4">
          <div className="text-center">
            <h1 className="mb-4 text-3xl font-bold">Post not found</h1>
            <p className="mb-8 text-lg text-muted-foreground">
              The blog post you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link href="/blog">
              <Button size="lg" className="rounded-full shadow-lg">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const tags = Array.from(new Set([post.category, ...(post.tags || [])].filter(Boolean)));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>{post.title} - KNCCI Blog</title>
        <meta name="description" content={post.excerpt || post.title} />
      </Helmet>

      <Navigation />

      <main className="pb-16 pt-24">
        <motion.div
          className="fixed left-0 right-0 top-0 z-50 h-1 origin-left bg-primary"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5 }}
        />

        <header className="bg-primary/5 py-12 md:py-20">
          <div className="container mx-auto max-w-4xl px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/blog">
                <Button variant="ghost" className="mb-8 pl-0 font-semibold text-primary transition-all hover:bg-transparent hover:text-primary/80">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
                </Button>
              </Link>

              <div className="mb-6 flex flex-wrap items-center gap-3">
                <Badge className="bg-primary px-4 py-1 text-xs uppercase tracking-widest text-primary-foreground">
                  {post.category || "KNCCI Update"}
                </Badge>
                <span className="text-muted-foreground">•</span>
                <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                  <Calendar className="h-4 w-4" /> {formatDate(post.createdAt)}
                </span>
              </div>

              <h1 className="mb-8 text-3xl font-bold leading-tight tracking-tight md:text-5xl">
                {post.title}
              </h1>

              <div className="flex flex-col gap-6 rounded-2xl border border-border/50 bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-background bg-primary/10 shadow-md">
                    <User className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <p className="mb-1 text-lg font-bold leading-none">{post.author}</p>
                    <p className="text-sm font-medium text-muted-foreground">Author, KNCCI Insights</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="mr-2 hidden text-sm font-semibold text-muted-foreground sm:block">Share:</span>
                  <div className="flex gap-2">
                    <Button size="icon" variant="outline" className="h-10 w-10 rounded-full border-border/50 transition-all hover:bg-primary/10 hover:text-primary">
                      <Twitter className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline" className="h-10 w-10 rounded-full border-border/50 transition-all hover:bg-primary/10 hover:text-primary">
                      <Facebook className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline" className="h-10 w-10 rounded-full border-border/50 transition-all hover:bg-primary/10 hover:text-primary">
                      <Linkedin className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline" className="h-10 w-10 rounded-full border-border/50 transition-all hover:bg-primary/10 hover:text-primary">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </header>

        <div className="container mx-auto max-w-5xl -mt-12 px-4 md:-mt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="overflow-hidden rounded-3xl border-4 border-background shadow-2xl"
          >
            <img
              src={post.featuredImage || ""}
              alt={post.title}
              className="aspect-video h-auto w-full object-cover"
            />
          </motion.div>
        </div>

        <div className="container mx-auto max-w-4xl px-4 py-12 md:py-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <article className="lg:col-span-12">
              <div
                className="prose prose-lg max-w-none rounded-3xl border border-border/40 bg-card p-8 shadow-sm prose-headings:font-bold prose-p:leading-relaxed prose-a:text-primary prose-img:rounded-3xl dark:prose-invert md:p-12"
                dangerouslySetInnerHTML={{ __html: post.content || "<p>No article content available.</p>" }}
              />

              <div className="mt-12 flex flex-wrap gap-2">
                <span className="mr-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  <Tag className="h-4 w-4" /> Tags:
                </span>
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="rounded-full border-none bg-accent/50 px-4 py-1.5 text-accent-foreground"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <Separator className="my-16 opacity-50" />

              {relatedPosts.length > 0 && (
                <section className="mt-8 border-t border-border pt-16">
                  <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="text-3xl font-bold tracking-tight">Related Articles</h2>
                      <p className="mt-2 text-muted-foreground">Continue reading more business insights from KNCCI Uasin Gishu.</p>
                    </div>
                    <Link href="/blog">
                      <Button variant="outline" className="rounded-full px-6">All Articles</Button>
                    </Link>
                  </div>

                  <div className="grid gap-8 md:grid-cols-3">
                    {relatedPosts.map((relatedPost, index) => (
                      <motion.div
                        key={relatedPost._id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Link href={`/blog/${relatedPost.slug}`}>
                          <a className="group block h-full">
                            <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-xl">
                              <div className="aspect-[4/3] overflow-hidden">
                                <img
                                  src={relatedPost.featuredImage || ""}
                                  alt={relatedPost.title}
                                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                              </div>
                              <div className="space-y-3 p-5">
                                <Badge variant="secondary" className="bg-primary/10 text-primary">
                                  {relatedPost.category || "KNCCI Update"}
                                </Badge>
                                <h3 className="line-clamp-2 text-lg font-bold transition-colors group-hover:text-primary">
                                  {relatedPost.title}
                                </h3>
                                <p className="line-clamp-2 text-sm text-muted-foreground">
                                  {relatedPost.excerpt}
                                </p>
                              </div>
                            </div>
                          </a>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}
            </article>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
