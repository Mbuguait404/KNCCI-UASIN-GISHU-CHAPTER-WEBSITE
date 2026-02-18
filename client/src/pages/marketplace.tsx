import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShoppingBag,
    Search,
    Filter,
    Store,
    ArrowUpRight,
    Tag,
    ChevronRight,
    Package,
    CheckCircle2,
    Building2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SEOHead } from "@/components/seo/seo-head";
import { membersList } from "@/data/members";

export default function MarketplacePage() {
    const [searchQuery, setSearchQuery] = useState("");

    const categories = [
        "All Categories",
        "Agribusiness",
        "Manufacturing",
        "Professional Services",
        "Hospitality & Tourism",
        "Construction",
        "Technology"
    ];

    const featuredProducts = [
        {
            id: 1,
            name: "Organic Eldoret Tea",
            seller: "Rift Valley Farmers Co-op",
            price: "KES 450",
            image: "https://images.unsplash.com/photo-1594631252845-29fc4586c567?auto=format&fit=crop&q=80&w=800",
            category: "Agribusiness"
        },
        {
            id: 2,
            name: "Handcrafted Leather Goods",
            seller: "Uasin Gishu Artisans",
            price: "KES 2,500",
            image: "https://images.unsplash.com/photo-1524289286702-f07229da36f5?auto=format&fit=crop&q=80&w=800",
            category: "Manufacturing"
        },
        {
            id: 3,
            name: "Business Strategy Consultation",
            seller: "Ken Mwenda & Associates",
            price: "Contact for Quote",
            image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800",
            category: "Professional Services"
        },
        {
            id: 4,
            name: "Premium Maize Flour",
            seller: "Eldoret Millers Ltd",
            price: "KES 180",
            image: "https://images.unsplash.com/photo-1536511110382-7f9e851d7237?auto=format&fit=crop&q=80&w=800",
            category: "Agribusiness"
        }
    ];

    const filteredMembers = membersList.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 12); // Limit for listing

    return (
        <div className="min-h-screen bg-background">
            <SEOHead
                title="Marketplace & Member Directory | KNCCI Uasin Gishu"
                description="Discover and trade with verified businesses in Uasin Gishu County. Explore our member directory and marketplace for local products and services."
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
                                <span className="text-primary font-bold text-sm uppercase tracking-widest block mb-4">The Chamber Marketplace</span>
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
                                <Button size="lg" className="h-14 px-12 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105">
                                    Explore Marketplace
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Categories / Tabs Section */}
                <section className="py-12 border-b border-border bg-muted/30">
                    <div className="container mx-auto px-4 overflow-x-auto">
                        <div className="flex whitespace-nowrap gap-4 pb-2">
                            {categories.map((cat, i) => (
                                <Button
                                    key={i}
                                    variant={i === 0 ? "default" : "outline"}
                                    className={`rounded-full px-8 ${i === 0 ? 'bg-primary text-white shadow-lg' : 'bg-background hover:bg-primary/5'}`}
                                >
                                    {cat}
                                </Button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Featured Products */}
                <section className="py-24">
                    <div className="container mx-auto px-4">
                        <div className="flex items-end justify-between mb-12">
                            <div>
                                <h2 className="text-3xl font-bold italic mb-2">Featured Products</h2>
                                <div className="w-20 h-1.5 bg-primary rounded-full" />
                            </div>
                            <Button variant="ghost" className="gap-2 font-bold group">
                                View All <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {featuredProducts.map((product) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                >
                                    <Card className="h-full overflow-hidden border-border/50 group hover:shadow-2xl transition-all duration-500">
                                        <div className="relative aspect-[4/5] overflow-hidden">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute top-4 left-4">
                                                <Badge className="bg-white/90 backdrop-blur-md text-slate-900 border-none px-3 py-1">{product.category}</Badge>
                                            </div>
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Button className="rounded-full bg-primary text-white font-bold gap-2 scale-90 group-hover:scale-100 transition-transform">
                                                    View Details <ArrowUpRight className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <CardContent className="p-6">
                                            <h3 className="text-lg font-bold mb-1 truncate">{product.name}</h3>
                                            <p className="text-sm text-muted-foreground mb-4 flex items-center gap-1">
                                                <Store className="w-3.5 h-3.5" /> {product.seller}
                                            </p>
                                            <div className="flex items-center justify-between mt-auto">
                                                <span className="text-xl font-black text-primary">{product.price}</span>
                                                <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                                                    <ShoppingBag className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Member Directory Preview */}
                <section className="py-24 bg-slate-50 dark:bg-slate-900/40 border-y border-border">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-5xl font-bold mb-6">Member <span className="text-primary italic">Directory</span></h2>
                                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                    A comprehensive directory of the businesses driving growth in Uasin Gishu County.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                                <AnimatePresence>
                                    {filteredMembers.map((member, i) => (
                                        <motion.div
                                            key={i}
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-6 rounded-2xl bg-background border border-border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center font-bold text-xl group-hover:bg-primary group-hover:text-white transition-colors">
                                                    {member.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-foreground leading-tight group-hover:text-primary transition-colors">{member.name}</h4>
                                                    <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Verified Member</span>
                                                </div>
                                                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            <div className="text-center">
                                <Button size="lg" variant="outline" className="rounded-full px-12 h-14 font-bold border-primary text-primary hover:bg-primary hover:text-white transition-all shadow-lg hover:shadow-primary/25" asChild>
                                    <a href="/member-directory">
                                        View Full Member Directory
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Sell Section */}
                <section className="py-24">
                    <div className="container mx-auto px-4">
                        <div className="max-w-5xl mx-auto bg-primary rounded-[3rem] overflow-hidden flex flex-col md:flex-row items-center relative shadow-2xl">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] pointer-events-none" />
                            <div className="p-12 md:p-16 md:w-1/2 text-white">
                                <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">Grow your business <span className="italic opacity-80">Online</span></h2>
                                <p className="text-xl text-white/90 mb-10 leading-relaxed">
                                    Join our marketplace and reach thousands of potential customers. It's time to scale your business beyond physical borders.
                                </p>
                                <ul className="space-y-4 mb-10">
                                    <li className="flex items-center gap-3">
                                        <CheckCircle2 className="w-6 h-6 text-white" />
                                        <span className="font-medium text-lg">Verified Member Badge</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <CheckCircle2 className="w-6 h-6 text-white" />
                                        <span className="font-medium text-lg">Direct Inquiries System</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <CheckCircle2 className="w-6 h-6 text-white" />
                                        <span className="font-medium text-lg">Unlimited Product Listings</span>
                                    </li>
                                </ul>
                                <Button size="lg" variant="secondary" className="rounded-full px-12 h-16 text-lg font-bold shadow-xl hover:scale-105 transition-transform" asChild>
                                    <a href="/membership">Register as a Seller/</a>
                                </Button>
                            </div>
                            <div className="md:w-1/2 relative h-[400px] md:h-[600px] w-full">
                                <img
                                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426"
                                    alt="Marketplace Platform"
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-primary to-transparent" />
                                <div className="absolute inset-0 flex items-center justify-center p-8">
                                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl animate-bounce-slow">
                                        <Store className="w-24 h-24 text-white" />
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
