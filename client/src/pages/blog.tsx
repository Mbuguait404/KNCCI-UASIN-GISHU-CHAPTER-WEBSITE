import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { websiteContentService } from "@/services/website-content-service";
import type { ContentBlogPost } from "@/types/content";

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

export default function BlogPage() {
  const [posts, setPosts] = useState<ContentBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const data = await websiteContentService.getBlogs({ page: 1, limit: 100 });
        setPosts(data.posts || []);
      } catch {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    void loadPosts();
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(posts.map((post) => post.category).filter(Boolean))),
    [posts],
  );

  const filteredPosts = useMemo(
    () =>
      posts.filter((post) => {
        const searchValue = searchQuery.toLowerCase();
        const matchesSearch =
          post.title.toLowerCase().includes(searchValue) ||
          (post.excerpt || "").toLowerCase().includes(searchValue);
        const matchesCategory = selectedCategory ? post.category === selectedCategory : true;
        return matchesSearch && matchesCategory;
      }),
    [posts, searchQuery, selectedCategory],
  );

  const featuredPosts = filteredPosts.filter((post) => post.isFeatured && !searchQuery && !selectedCategory);
  const otherPosts = filteredPosts.filter((post) => !post.isFeatured || searchQuery || selectedCategory);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Blog - KNCCI Uasin Gishu Chapter</title>
        <meta
          name="description"
          content="Stay updated with the latest news, business insights, and economic trends from the KNCCI Uasin Gishu Chapter."
        />
      </Helmet>

      <Navigation />

      <main className="pt-20">
        <section className="border-b border-border bg-slate-50 py-20 dark:bg-slate-900/40">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="mb-4 block text-sm font-bold uppercase tracking-widest text-primary">
                  Member Resources
                </span>
                <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-6xl">
                  Business <span className="text-primary">Insights</span> & Updates
                </h1>
                <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-muted-foreground">
                  Explore our latest perspectives on the economy, technology, and entrepreneurship in Uasin Gishu County.
                </p>
              </motion.div>

              <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-4 md:flex-row">
                <div className="relative w-full md:max-w-md">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search articles..."
                    className="h-14 rounded-xl border-border bg-background pl-12 shadow-md focus-visible:ring-primary"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                  />
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <Button
                    variant={selectedCategory === null ? "default" : "outline"}
                    className="h-11 rounded-full px-6 font-bold"
                    onClick={() => setSelectedCategory(null)}
                  >
                    All
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      className="h-11 rounded-full px-6 font-bold"
                      onClick={() => setSelectedCategory(category || null)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto mt-12 px-4">
          {loading ? (
            <div className="py-24 text-center text-muted-foreground">Loading blog posts...</div>
          ) : (
            <>
              {!searchQuery && !selectedCategory && featuredPosts.length > 0 && (
                <section className="mb-20">
                  <div className="mb-8 flex items-center gap-4">
                    <div className="h-px flex-grow bg-border" />
                    <h2 className="text-2xl font-bold uppercase tracking-widest text-muted-foreground">Featured Stories</h2>
                    <div className="h-px flex-grow bg-border" />
                  </div>

                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {featuredPosts.map((post, index) => (
                      <motion.div
                        key={post._id}
                        initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                      >
                        <Link href={`/blog/${post.slug}`}>
                          <a className="group block h-full">
                            <Card className="h-full overflow-hidden border-border/50 bg-card shadow-sm transition-all duration-500 hover:border-primary/50 hover:shadow-xl">
                              <div className="relative aspect-[16/9] overflow-hidden">
                                <img
                                  src={post.featuredImage || ""}
                                  alt={post.title}
                                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                                <div className="absolute bottom-6 left-6 right-6">
                                  <Badge className="mb-3 bg-primary text-primary-foreground hover:bg-primary/90">
                                    {post.category || "KNCCI Update"}
                                  </Badge>
                                  <h3 className="mb-2 text-2xl font-bold leading-tight text-white transition-colors group-hover:text-primary md:text-3xl">
                                    {post.title}
                                  </h3>
                                  <div className="flex items-center gap-4 text-sm text-white/80">
                                    <span className="flex items-center gap-1.5 font-medium">
                                      <User className="h-4 w-4" />
                                      {post.author}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                      <Calendar className="h-4 w-4" />
                                      {formatDate(post.createdAt)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <CardContent className="p-6">
                                <p className="line-clamp-3 text-lg leading-relaxed text-muted-foreground">
                                  {post.excerpt}
                                </p>
                              </CardContent>
                              <CardFooter className="px-6 pb-6 pt-0">
                                <span className="inline-flex items-center font-bold text-primary">
                                  Read Article <ArrowRight className="ml-2 h-4 w-4" />
                                </span>
                              </CardFooter>
                            </Card>
                          </a>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              <section className="mb-24">
                <div className="mb-10 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                      {searchQuery || selectedCategory ? "Search Results" : "Latest Articles"}
                    </h2>
                    <p className="mt-1 text-muted-foreground">
                      {filteredPosts.length} article{filteredPosts.length === 1 ? "" : "s"} available
                    </p>
                  </div>
                </div>

                {otherPosts.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center text-muted-foreground">
                    No blog posts match your current filters.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                    {otherPosts.map((post, index) => (
                      <motion.div
                        key={post._id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                      >
                        <Link href={`/blog/${post.slug}`}>
                          <a className="group block h-full">
                            <Card className="flex h-full flex-col overflow-hidden border-border/50 bg-card shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-xl">
                              <div className="relative aspect-[16/10] overflow-hidden">
                                <img
                                  src={post.featuredImage || ""}
                                  alt={post.title}
                                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                              </div>
                              <CardHeader className="pb-4">
                                <div className="mb-3 flex items-center justify-between">
                                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                                    {post.category || "KNCCI Update"}
                                  </Badge>
                                  <span className="text-xs font-medium text-muted-foreground">{formatDate(post.createdAt)}</span>
                                </div>
                                <CardTitle className="line-clamp-2 text-2xl leading-tight transition-colors group-hover:text-primary">
                                  {post.title}
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="flex-grow">
                                <p className="line-clamp-3 leading-relaxed text-muted-foreground">
                                  {post.excerpt}
                                </p>
                              </CardContent>
                              <CardFooter className="flex items-center justify-between border-t border-border/40 pt-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <User className="h-4 w-4" />
                                  <span>{post.author}</span>
                                </div>
                                <span className="inline-flex items-center font-semibold text-primary">
                                  Read More <ArrowRight className="ml-2 h-4 w-4" />
                                </span>
                              </CardFooter>
                            </Card>
                          </a>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
