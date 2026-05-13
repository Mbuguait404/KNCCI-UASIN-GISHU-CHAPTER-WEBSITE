import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";
import {
    ShoppingBag,
    Search,
    Store,
    ArrowUpRight,
    ChevronRight,
    CheckCircle2,
    MapPin,
    ExternalLink,
    Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEOHead } from "@/components/seo/seo-head";
import api from "@/lib/api";

interface Vendor {
    id: string;
    name: string;
    slug: string;
    category: string;
    description: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    logoUrl: string | null;
    bannerUrl: string | null;
    plan: string;
    services: string[];
    tenantId: string;
    joinedAt: string;
}

const MARKETPLACE_URL = import.meta.env.VITE_MARKETPLACE_URL || "http://localhost:3002";

export default function MarketplacePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchVendors() {
            try {
                setLoading(true);
                const response = await api.get("/marketplace/vendors", {
                    params: { limit: 5, page: 1 },
                });
                // Response shape: { data: { data: Vendor[], total, page, limit }, message }
                const result = response.data?.data;
                setVendors(result?.data || []);
            } catch (err: any) {
                setError(err?.response?.data?.message || "Failed to load businesses");
            } finally {
                setLoading(false);
            }
        }
        fetchVendors();
    }, []);

    const categories = [
        "All Categories",
        "Agribusiness",
        "Manufacturing",
        "Professional Services",
        "Hospitality & Tourism",
        "Construction",
        "Technology",
    ];

    return (
        <div className="min-h-screen bg-background">
            <SEOHead
                title="Marketplace | KNCCI Uasin Gishu"
                description="Discover and trade with verified businesses in Uasin Gishu County. Explore our marketplace for local products and services."
            />
            <Navigation />

            <main className="pt-20">
                {/* Header section */}
                <section className="py-20 bg-slate-50 dark:bg-slate-900/40 border-b border-border">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <span className="text-primary font-bold text-sm uppercase tracking-widest block mb-4">
                                    The Chamber Marketplace
                                </span>
                                <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
                                    Discover <span className="text-primary">Verified</span> Local Business
                                </h1>
                                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
                                    Trade with confidence. Our marketplace connects you with verified chamber members offering high-quality products and professional services.
                                </p>
                            </motion.div>
                        </div>

                        {/* Search Bar */}
                        <div className="mt-8 max-w-5xl mx-auto">
                            <div className="flex flex-col md:flex-row gap-4 p-2 bg-background rounded-2xl shadow-xl border border-border">
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input
                                        placeholder="Search for products, services or companies..."
                                        className="pl-12 h-14 border-none focus-visible:ring-0 text-lg rounded-xl"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Button
                                    size="lg"
                                    className="h-14 px-12 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105"
                                    asChild
                                >
                                    <a href={MARKETPLACE_URL} target="_blank" rel="noopener noreferrer">
                                        Explore Marketplace <ExternalLink className="w-4 h-4 ml-2" />
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Categories / Tabs Section */}
                <section className="py-12 border-b border-border bg-background">
                    <div className="container mx-auto px-4 overflow-x-auto">
                        <div className="flex whitespace-nowrap gap-4 pb-2">
                            {categories.map((cat, i) => (
                                <Button
                                    key={i}
                                    variant={i === 0 ? "default" : "outline"}
                                    className={`rounded-full px-8 ${i === 0 ? "bg-primary text-white shadow-lg" : "bg-background hover:bg-primary/5"}`}
                                >
                                    {cat}
                                </Button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Featured Businesses */}
                <section className="py-24">
                    <div className="container mx-auto px-4">
                        <div className="flex items-end justify-between mb-12">
                            <div>
                                <h2 className="text-3xl font-bold italic mb-2">Featured Businesses</h2>
                                <div className="w-20 h-1.5 bg-primary rounded-full" />
                            </div>
                        </div>

                        {loading && (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                <span className="ml-3 text-muted-foreground">Loading businesses...</span>
                            </div>
                        )}

                        {error && (
                            <div className="text-center py-12">
                                <p className="text-destructive mb-4">{error}</p>
                                <Button onClick={() => window.location.reload()} variant="outline">
                                    Try Again
                                </Button>
                            </div>
                        )}

                        {!loading && !error && vendors.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">No businesses found.</p>
                            </div>
                        )}

                        {!loading && !error && vendors.length > 0 && (
                            <>
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                                    {vendors.map((vendor, index) => (
                                        <motion.div
                                            key={vendor.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <Card className="h-full overflow-hidden border-border/50 group hover:shadow-2xl hover:border-primary/20 transition-all duration-500">
                                                <div className="relative aspect-square overflow-hidden bg-muted">
                                                    {vendor.logoUrl ? (
                                                        <img
                                                            src={vendor.logoUrl}
                                                            alt={vendor.name}
                                                            className="w-full h-full object-contain p-6 transition-transform duration-700 group-hover:scale-110"
                                                        />
                                                    ) : vendor.bannerUrl ? (
                                                        <img
                                                            src={vendor.bannerUrl}
                                                            alt={vendor.name}
                                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-primary/5">
                                                            <Store className="w-16 h-16 text-primary/30" />
                                                        </div>
                                                    )}
                                                    <div className="absolute top-3 left-3">
                                                        <Badge className="bg-white/90 backdrop-blur-md text-slate-900 border-none px-2 py-0.5 text-[10px]">
                                                            {vendor.category}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <CardContent className="p-5">
                                                    <h3 className="font-bold text-foreground mb-1 truncate group-hover:text-primary transition-colors">
                                                        {vendor.name}
                                                    </h3>
                                                    {vendor.location && (
                                                        <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                                                            <MapPin className="w-3 h-3" />
                                                            {vendor.location}
                                                        </p>
                                                    )}
                                                    <a
                                                        href={`${MARKETPLACE_URL}/stores/${vendor.slug}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                                                    >
                                                        Visit Store <ArrowUpRight className="w-3 h-3" />
                                                    </a>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="mt-16 text-center">
                                    <Button
                                        size="lg"
                                        className="rounded-full px-12 h-14 font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105"
                                        asChild
                                    >
                                        <a href={MARKETPLACE_URL} target="_blank" rel="noopener noreferrer">
                                            View More Businesses <ChevronRight className="w-4 h-4 ml-1" />
                                        </a>
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </section>

                {/* Sell Section */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="max-w-7xl mx-auto bg-primary rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row items-center relative shadow-2xl">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] pointer-events-none" />
                            <div className="p-10 md:p-12 md:w-3/5 text-white">
                                <h2 className="text-2xl md:text-4xl font-extrabold mb-4 leading-tight">
                                    Grow your business <span className="italic opacity-80">Online</span>
                                </h2>
                                <p className="text-lg text-white/90 mb-6 leading-relaxed max-w-xl">
                                    Join our marketplace and reach thousands of potential customers. It's time to scale your business beyond physical borders.
                                </p>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                                    <li className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-white/80" />
                                        <span className="font-medium text-base">Verified Member Badge</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-white/80" />
                                        <span className="font-medium text-base">Direct Inquiries System</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-white/80" />
                                        <span className="font-medium text-base">Unlimited Product Listings</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-white/80" />
                                        <span className="font-medium text-base">E-commerce Ready</span>
                                    </li>
                                </ul>
                                <Button
                                    size="lg"
                                    variant="secondary"
                                    className="rounded-full px-10 h-14 text-base font-bold shadow-xl hover:scale-105 transition-transform"
                                    asChild
                                >
                                    <a href="/membership">Register as a Seller</a>
                                </Button>
                            </div>
                            <div className="md:w-2/5 relative h-[300px] md:h-[400px] w-full">
                                <img
                                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426"
                                    alt="Marketplace Platform"
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/50 to-transparent md:bg-gradient-to-r md:from-primary md:to-transparent" />
                                <div className="absolute inset-0 flex items-center justify-center p-8">
                                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl animate-bounce-slow">
                                        <Store className="w-16 h-16 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
