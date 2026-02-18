import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { staticBlogPosts } from "@/data/static-data";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowRight, Search, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function BlogPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const categories = Array.from(
        new Set(staticBlogPosts.map((post) => post.category))
    );

    const filteredPosts = staticBlogPosts.filter((post) => {
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory ? post.category === selectedCategory : true;
        return matchesSearch && matchesCategory;
    });

    const featuredPosts = staticBlogPosts.filter((post) => post.isFeatured);
    const otherPosts = filteredPosts.filter((post) => !post.isFeatured || (searchQuery || selectedCategory));

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Helmet>
                <title>Blog - KNCCI Uasin Gishu Chapter</title>
                <meta name="description" content="Stay updated with the latest news, business insights, and economic trends from the KNCCI Uasin Gishu Chapter." />
            </Helmet>

            <Navigation />

            <main className="pt-24 pb-16">
                {/* Header Section */}
                <section className="relative py-20 overflow-hidden">
                    <div className="absolute inset-0 bg-primary/5 -z-10" />
                    <div className="container mx-auto px-4 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Badge variant="outline" className="mb-4 px-4 py-1 text-primary border-primary/20 bg-primary/5 uppercase tracking-wider font-semibold">
                                Member Resources
                            </Badge>
                            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                                Business <span className="text-primary">Insights</span> & Updates
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                                Explore our latest perspectives on the economy, technology, and entrepreneurship in Uasin Gishu County.
                            </p>
                        </motion.div>

                        {/* Search & Filter */}
                        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-center">
                            <div className="relative w-full md:max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search articles..."
                                    className="pl-10 h-12 bg-background border-border/50 focus:border-primary transition-all"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-2">
                                <Button
                                    variant={selectedCategory === null ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedCategory(null)}
                                    className="rounded-full"
                                >
                                    All
                                </Button>
                                {categories.map((category) => (
                                    <Button
                                        key={category}
                                        variant={selectedCategory === category ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setSelectedCategory(category)}
                                        className="rounded-full"
                                    >
                                        {category}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <div className="container mx-auto px-4 mt-12">
                    {/* Featured Posts Section - Only show when no filters are active */}
                    {!searchQuery && !selectedCategory && featuredPosts.length > 0 && (
                        <section className="mb-20">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-px bg-border flex-grow" />
                                <h2 className="text-2xl font-bold uppercase tracking-widest text-muted-foreground">Featured Stories</h2>
                                <div className="h-px bg-border flex-grow" />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {featuredPosts.map((post, index) => (
                                    <motion.div
                                        key={post.id}
                                        initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: index * 0.1 }}
                                    >
                                        <Link href={`/blog/${post.id}`}>
                                            <a className="group block h-full">
                                                <Card className="h-full overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-500 shadow-sm hover:shadow-xl bg-card">
                                                    <div className="relative aspect-[16/9] overflow-hidden">
                                                        <img
                                                            src={post.imageUrl}
                                                            alt={post.title}
                                                            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                                                        <div className="absolute bottom-6 left-6 right-6">
                                                            <Badge className="mb-3 bg-primary text-primary-foreground hover:bg-primary/90">
                                                                {post.category}
                                                            </Badge>
                                                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight group-hover:text-primary transition-colors">
                                                                {post.title}
                                                            </h3>
                                                            <div className="flex items-center gap-4 text-white/80 text-sm">
                                                                <span className="flex items-center gap-1.5 font-medium">
                                                                    <User className="h-4 w-4" />
                                                                    {post.author}
                                                                </span>
                                                                <span className="flex items-center gap-1.5">
                                                                    <Calendar className="h-4 w-4" />
                                                                    {post.date}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <CardContent className="p-6">
                                                        <p className="text-muted-foreground text-lg leading-relaxed line-clamp-3">
                                                            {post.excerpt}
                                                        </p>
                                                    </CardContent>
                                                    <CardFooter className="px-6 pb-6 pt-0">
                                                        <span className="inline-flex items-center gap-2 text-primary font-semibold group-hover:translate-x-2 transition-transform">
                                                            Read Full Article <ArrowRight className="h-4 w-4" />
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

                    {/* All Posts Grid */}
                    <section>
                        {(searchQuery || selectedCategory) ? (
                            <h2 className="text-2xl font-bold mb-8">
                                Search Results ({filteredPosts.length})
                            </h2>
                        ) : (
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-px bg-border flex-grow" />
                                <h2 className="text-2xl font-bold uppercase tracking-widest text-muted-foreground">More Articles</h2>
                                <div className="h-px bg-border flex-grow" />
                            </div>
                        )}

                        {filteredPosts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {(!searchQuery && !selectedCategory ? otherPosts : filteredPosts).map((post, index) => (
                                    <motion.div
                                        key={post.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                    >
                                        <Link href={`/blog/${post.id}`}>
                                            <a className="group block h-full">
                                                <Card className="h-full flex flex-col overflow-hidden border-border/40 hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-md bg-card/50">
                                                    <div className="relative aspect-[16/10] overflow-hidden">
                                                        <img
                                                            src={post.imageUrl}
                                                            alt={post.title}
                                                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                                                        />
                                                        <div className="absolute top-4 right-4">
                                                            <Badge variant="secondary" className="backdrop-blur-md bg-white/10 text-white border-white/20">
                                                                {post.category}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <CardHeader className="p-5">
                                                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3 uppercase tracking-widest">
                                                            <span className="flex items-center gap-1 font-semibold text-primary/80">
                                                                <Tag className="h-3 w-3" />
                                                                {post.category}
                                                            </span>
                                                            <span>•</span>
                                                            <span>{post.date}</span>
                                                        </div>
                                                        <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                                                            {post.title}
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="p-5 pt-0 flex-grow">
                                                        <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                                                            {post.excerpt}
                                                        </p>
                                                    </CardContent>
                                                    <CardFooter className="p-5 pt-0 border-t border-border/50 mt-auto flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                                                                {post.author.charAt(0)}
                                                            </div>
                                                            <span className="text-xs font-medium text-muted-foreground">{post.author}</span>
                                                        </div>
                                                        <ArrowRight className="h-4 w-4 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                                    </CardFooter>
                                                </Card>
                                            </a>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-accent/30 rounded-3xl">
                                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                                <h3 className="text-xl font-bold mb-2">No articles found</h3>
                                <p className="text-muted-foreground">
                                    Try adjusting your search or filters to find what you're looking for.
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={() => { setSearchQuery(""); setSelectedCategory(null); }}
                                    className="mt-4"
                                >
                                    Clear all filters
                                </Button>
                            </div>
                        )}
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
