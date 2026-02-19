import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { staticBlogPosts } from "@/data/static-data";
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
    MessageSquare
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function BlogDetail() {
    const [, params] = useRoute("/blog/:id");
    const post = staticBlogPosts.find((p) => p.id === params?.id);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [params?.id]);

    if (!post) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navigation />
                <main className="flex-grow flex items-center justify-center p-4">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold mb-4">Post not found</h1>
                        <p className="text-muted-foreground mb-8 text-lg">The blog post you're looking for doesn't exist or has been removed.</p>
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

    // Logic: Same category first, then others to fill up to 3 posts
    const sameCategoryPosts = staticBlogPosts.filter(
        (p) => p.category === post.category && p.id !== post.id
    );

    const otherRecentPosts = staticBlogPosts.filter(
        (p) => p.category !== post.category && p.id !== post.id
    );

    const relatedPosts = [...sameCategoryPosts, ...otherRecentPosts].slice(0, 3);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Helmet>
                <title>{post.title} - KNCCI Blog</title>
                <meta name="description" content={post.excerpt} />
            </Helmet>

            <Navigation />

            <main className="pt-24 pb-16">
                {/* Progress Bar (simple visual) */}
                <motion.div
                    className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5 }}
                />

                {/* Hero Header */}
                <header className="py-12 md:py-20 bg-primary/5">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Link href="/blog">
                                <Button variant="ghost" className="mb-8 pl-0 hover:bg-transparent text-primary hover:text-primary/80 transition-all font-semibold">
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
                                </Button>
                            </Link>

                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                <Badge className="px-4 py-1 text-xs uppercase tracking-widest bg-primary text-primary-foreground">
                                    {post.category}
                                </Badge>
                                <span className="text-muted-foreground">•</span>
                                <span className="text-muted-foreground text-sm flex items-center gap-1.5 font-medium">
                                    <Calendar className="h-4 w-4" /> {post.date}
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-5xl font-bold mb-8 leading-tight tracking-tight">
                                {post.title}
                            </h1>

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 bg-card border border-border/50 rounded-2xl shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center border-2 border-background shadow-md">
                                        <User className="h-7 w-7 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg leading-none mb-1">{post.author}</p>
                                        <p className="text-sm text-muted-foreground font-medium">Author, KNCCI Insights</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-muted-foreground mr-2 hidden sm:block">Share:</span>
                                    <div className="flex gap-2">
                                        <Button size="icon" variant="outline" className="h-10 w-10 rounded-full border-border/50 hover:bg-primary/10 hover:text-primary transition-all">
                                            <Twitter className="h-4 w-4" />
                                        </Button>
                                        <Button size="icon" variant="outline" className="h-10 w-10 rounded-full border-border/50 hover:bg-primary/10 hover:text-primary transition-all">
                                            <Facebook className="h-4 w-4" />
                                        </Button>
                                        <Button size="icon" variant="outline" className="h-10 w-10 rounded-full border-border/50 hover:bg-primary/10 hover:text-primary transition-all">
                                            <Linkedin className="h-4 w-4" />
                                        </Button>
                                        <Button size="icon" variant="outline" className="h-10 w-10 rounded-full border-border/50 hover:bg-primary/10 hover:text-primary transition-all">
                                            <Share2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </header>

                {/* Featured Image */}
                <div className="container mx-auto px-4 max-w-5xl -mt-12 md:-mt-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="rounded-3xl overflow-hidden shadow-2xl border-4 border-background"
                    >
                        <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-full h-auto aspect-video object-cover"
                        />
                    </motion.div>
                </div>

                {/* Article Content */}
                <div className="container mx-auto px-4 max-w-4xl py-12 md:py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Main Content */}
                        <article className="lg:col-span-12">
                            <div
                                className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-p:leading-relaxed prose-a:text-primary prose-img:rounded-3xl shadow-sm bg-card p-8 md:p-12 border border-border/40 rounded-3xl"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />

                            <div className="mt-12 flex flex-wrap gap-2">
                                <span className="mr-2 font-bold flex items-center gap-2 text-muted-foreground uppercase text-xs tracking-widest">
                                    <Tag className="h-4 w-4" /> Tags:
                                </span>
                                <Badge variant="secondary" className="bg-accent/50 text-accent-foreground px-4 py-1.5 rounded-full border-none">
                                    {post.category}
                                </Badge>
                                <Badge variant="secondary" className="bg-accent/50 text-accent-foreground px-4 py-1.5 rounded-full border-none">
                                    Business
                                </Badge>
                                <Badge variant="secondary" className="bg-accent/50 text-accent-foreground px-4 py-1.5 rounded-full border-none">
                                    Growth
                                </Badge>
                            </div>

                            <Separator className="my-16 opacity-50" />

                            {/* Other Reads / Related Posts */}
                            {relatedPosts.length > 0 && (
                                <section className="mt-8 border-t border-border pt-16">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                                        <div>
                                            <Badge variant="outline" className="mb-2 text-primary border-primary/20 bg-primary/5 px-3 py-0.5 uppercase tracking-tighter font-bold">
                                                Recommendations
                                            </Badge>
                                            <h2 className="text-3xl font-bold tracking-tight">Other <span className="text-primary">Reads</span> for You</h2>
                                        </div>
                                        <Link href="/blog">
                                            <a className="text-primary font-bold flex items-center gap-2 hover:bg-primary/5 px-6 py-2.5 rounded-full border border-primary/20 transition-all w-fit">
                                                Explore All News <ArrowLeft className="h-4 w-4 rotate-180" />
                                            </a>
                                        </Link>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        {relatedPosts.map((relatedPost, idx) => (
                                            <motion.div
                                                key={relatedPost.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                            >
                                                <Link href={`/blog/${relatedPost.id}`}>
                                                    <a className="group block h-full">
                                                        <div className="relative aspect-video rounded-2xl overflow-hidden mb-5 shadow-lg bg-accent">
                                                            <img
                                                                src={relatedPost.imageUrl}
                                                                alt={relatedPost.title}
                                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                            <div className="absolute top-3 right-3">
                                                                <Badge className="bg-white/10 backdrop-blur-md text-white border-white/20 text-[10px] uppercase font-bold py-0.5">
                                                                    {relatedPost.category}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-3">
                                                            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium uppercase tracking-widest">
                                                                <span>{relatedPost.date}</span>
                                                            </div>
                                                            <h3 className="font-bold text-xl group-hover:text-primary transition-colors line-clamp-2 leading-[1.3]">
                                                                {relatedPost.title}
                                                            </h3>
                                                            <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                                {relatedPost.excerpt}
                                                            </p>
                                                            <div className="pt-2">
                                                                <span className="text-primary text-sm font-bold inline-flex items-center gap-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                                                    Read More <ArrowLeft className="h-3 w-3 rotate-180" />
                                                                </span>
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
