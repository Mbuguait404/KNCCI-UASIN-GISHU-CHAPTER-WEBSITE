import { useState, useMemo } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Users,
    Mail,
    Building2,
    CheckCircle2,
    ArrowUpDown,
    ArrowUpRight,
    MapPin,
    Phone,
    Globe,
    Calendar,
    Briefcase,
    ShieldCheck,
    Facebook,
    Twitter,
    Linkedin,
    ExternalLink
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { SEOHead } from "@/components/seo/seo-head";
import { membersList, Member } from "@/data/members";

export default function MemberDirectoryPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [visibleCount, setVisibleCount] = useState(24);
    const [sortBy, setSortBy] = useState<"name" | "email">("name");
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredMembers = useMemo(() => {
        return membersList
            .filter(member =>
                member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                member.email.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .sort((a, b) => {
                if (sortBy === "name") return a.name.localeCompare(b.name);
                return a.email.localeCompare(b.email);
            });
    }, [searchQuery, sortBy]);

    const displayedMembers = filteredMembers.slice(0, visibleCount);
    const hasMore = visibleCount < filteredMembers.length;

    const loadMore = () => {
        setVisibleCount(prev => prev + 24);
    };

    const handleViewProfile = (member: Member) => {
        setSelectedMember(member);
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <SEOHead
                title="Member Directory | KNCCI Uasin Gishu"
                description="Browse our comprehensive directory of registered members and businesses in Uasin Gishu County. Connect with local partners and explore the chamber network."
            />
            <Navigation />

            <main className="pt-20">
                {/* Header section */}
                <section className="py-24 bg-slate-50 dark:bg-slate-900/40 border-b border-border relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 rounded-l-full blur-3xl -z-10" />
                    <div className="container mx-auto px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-4xl mx-auto text-center"
                        >
                            <span className="text-primary font-bold text-sm uppercase tracking-[0.2em] block mb-4">Official Member Directory</span>
                            <h1 className="text-4xl md:text-7xl font-extrabold mb-8 tracking-tight">
                                Connect with <span className="text-primary italic">Our Members</span>
                            </h1>
                            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-12">
                                Discover thousands of verified businesses and professional services dedicated to the economic growth of Uasin Gishu County.
                            </p>
                        </motion.div>

                        {/* Search Bar */}
                        <div className="max-w-4xl mx-auto">
                            <div className="flex flex-col md:flex-row gap-4 p-3 bg-background/80 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-primary/10">
                                <div className="relative flex-1">
                                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                                    <Input
                                        placeholder="Search by name, company, or email..."
                                        className="pl-14 h-16 border-none focus-visible:ring-0 text-lg rounded-[1.5rem] w-full bg-slate-50/50 dark:bg-slate-900/50"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Button size="lg" className="h-16 px-12 rounded-[1.5rem] font-bold shadow-xl shadow-primary/20 transition-all hover:scale-105 bg-primary">
                                    Search Directory
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-12 border-b border-border bg-white dark:bg-slate-950 sticky top-[72px] z-30 shadow-sm">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="flex items-center gap-3">
                                <Users className="w-5 h-5 text-primary" />
                                <p className="text-lg font-bold">
                                    Showing <span className="text-primary">{filteredMembers.length}</span> verified members
                                </p>
                            </div>
                            <div className="flex items-center gap-6">
                                <span className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">Sort by:</span>
                                <div className="flex bg-slate-100 dark:bg-slate-900 rounded-2xl p-1.5 border border-border">
                                    <Button
                                        variant={sortBy === "name" ? "secondary" : "ghost"}
                                        size="sm"
                                        onClick={() => setSortBy("name")}
                                        className={`rounded-xl px-6 font-bold ${sortBy === "name" ? "bg-white dark:bg-slate-800 shadow-md text-primary" : ""}`}
                                    >
                                        Member Name
                                    </Button>
                                    <Button
                                        variant={sortBy === "email" ? "secondary" : "ghost"}
                                        size="sm"
                                        onClick={() => setSortBy("email")}
                                        className={`rounded-xl px-6 font-bold ${sortBy === "email" ? "bg-white dark:bg-slate-800 shadow-md text-primary" : ""}`}
                                    >
                                        Industry/Email
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-20 bg-slate-50/50 dark:bg-slate-900/10">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            <AnimatePresence mode="popLayout">
                                {displayedMembers.map((member, i) => (
                                    <motion.div
                                        key={`${member.name}-${i}`}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3, delay: i % 12 * 0.05 }}
                                    >
                                        <Card className="h-full border-border/50 hover:shadow-2xl transition-all duration-500 group overflow-hidden bg-background rounded-[2rem] hover:-translate-y-2">
                                            <CardContent className="p-8 flex flex-col h-full">
                                                <div className="flex items-start gap-4 mb-8">
                                                    <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-extrabold text-3xl group-hover:bg-primary group-hover:text-white transition-all duration-500 ring-4 ring-primary/5">
                                                        {member.name.charAt(0)}
                                                    </div>
                                                    <div className="flex-1 overflow-hidden">
                                                        <h3 className="font-extrabold text-xl group-hover:text-primary transition-colors truncate mb-1">
                                                            {member.name}
                                                        </h3>
                                                        <div className="flex items-center gap-2 text-[10px] text-emerald-600 font-extrabold uppercase tracking-widest">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                            Verified Member
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-4 flex-1">
                                                    <div className="flex items-center gap-3 text-sm text-muted-foreground group-hover:text-foreground transition-colors overflow-hidden">
                                                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                                            <Mail className="w-4 h-4" />
                                                        </div>
                                                        <span className="truncate">{member.email}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                                            <Building2 className="w-4 h-4" />
                                                        </div>
                                                        <span>Uasin Gishu Chapter</span>
                                                    </div>
                                                </div>

                                                <Button
                                                    onClick={() => handleViewProfile(member)}
                                                    variant="outline"
                                                    className="w-full mt-8 h-12 rounded-xl gap-2 border-primary/20 text-primary font-bold hover:bg-primary hover:text-white group/btn shadow-lg shadow-primary/5"
                                                >
                                                    View Details <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {hasMore && (
                            <div className="mt-20 text-center">
                                <Button
                                    size="lg"
                                    onClick={loadMore}
                                    className="rounded-[2rem] px-16 h-16 text-xl font-bold bg-primary text-white shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all"
                                >
                                    Load More Businesses
                                </Button>
                                <p className="mt-6 text-sm font-bold text-muted-foreground uppercase tracking-widest">
                                    Displaying {displayedMembers.length} of {filteredMembers.length} active members
                                </p>
                            </div>
                        )}

                        {filteredMembers.length === 0 && (
                            <div className="py-32 text-center bg-background rounded-[3rem] border-2 border-dashed border-border mt-12">
                                <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-8">
                                    <Users className="w-12 h-12 text-primary/40" />
                                </div>
                                <h3 className="text-3xl font-extrabold mb-4">No results found</h3>
                                <p className="text-xl text-muted-foreground max-w-md mx-auto mb-10">
                                    We couldn't find any members matching "<span className="text-primary font-bold">{searchQuery}</span>". Try another keyword.
                                </p>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="rounded-2xl px-12 h-14 font-bold border-primary text-primary"
                                    onClick={() => setSearchQuery("")}
                                >
                                    Reset Search
                                </Button>
                            </div>
                        )}
                    </div>
                </section>

                {/* Call to action */}
                <section className="py-32 bg-slate-900 text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary rounded-full blur-[150px]" />
                        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-primary rounded-full blur-[150px]" />
                    </div>
                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <div className="max-w-4xl mx-auto">
                            <Badge className="bg-primary/20 text-primary border-primary/30 mb-8 py-2 px-6 rounded-full font-bold uppercase tracking-widest">Growth Opportunities</Badge>
                            <h2 className="text-4xl md:text-6xl font-extrabold mb-8">Ready to Scale Your Business?</h2>
                            <p className="text-xl text-slate-300 mb-12 leading-relaxed max-w-2xl mx-auto">
                                Join 6,500+ verified businesses in Uasin Gishu County and unlock world-class networking, trade leads, and professional advocacy.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                <Button size="lg" className="rounded-full px-12 h-16 text-lg font-extrabold bg-primary hover:bg-white hover:text-slate-900 transition-all shadow-2xl shadow-primary/20" asChild>
                                    <a href="/membership">Register as a Member</a>
                                </Button>
                                <Button size="lg" variant="outline" className="rounded-full px-12 h-16 text-lg font-extrabold border-white/20 text-white hover:bg-white/10 transition-all" asChild>
                                    <a href="/contact">Inquire About Tenders</a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Profile Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border-none rounded-[3rem] bg-background">
                    <div className="relative">
                        {/* Modal Header/Hero */}
                        <div className="h-40 bg-gradient-to-br from-primary via-primary/80 to-slate-900 relative">
                            <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]" />
                            <div className="absolute -bottom-16 left-10 p-2 bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl">
                                <div className="w-32 h-32 rounded-[1.5rem] bg-primary text-white flex items-center justify-center text-5xl font-extrabold">
                                    {selectedMember?.name.charAt(0)}
                                </div>
                            </div>
                        </div>

                        <div className="pt-20 pb-10 px-10">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-3xl font-extrabold tracking-tight mb-2">{selectedMember?.name}</h2>
                                    <div className="flex flex-wrap gap-3 items-center">
                                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border-none px-3 font-bold flex items-center gap-1.5">
                                            <ShieldCheck className="w-3.5 h-3.5" />
                                            Verified Member
                                        </Badge>
                                        <Badge variant="secondary" className="bg-primary/5 text-primary border-none px-3 font-bold">
                                            Uasin Gishu Chapter
                                        </Badge>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="icon" variant="outline" className="rounded-xl border-slate-200"><Facebook className="w-4 h-4" /></Button>
                                    <Button size="icon" variant="outline" className="rounded-xl border-slate-200"><Twitter className="w-4 h-4" /></Button>
                                    <Button size="icon" variant="outline" className="rounded-xl border-slate-200"><Linkedin className="w-4 h-4" /></Button>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 mb-10">
                                <div className="space-y-6">
                                    <div className="flex gap-4 items-center group">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-primary border border-slate-100 dark:border-slate-800 transition-colors group-hover:bg-primary group-hover:text-white">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">Official Email</p>
                                            <p className="font-bold text-lg group-hover:text-primary transition-colors">{selectedMember?.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-center group">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-primary border border-slate-100 dark:border-slate-800 transition-colors group-hover:bg-primary group-hover:text-white">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">Direct Contact</p>
                                            <p className="font-bold text-lg group-hover:text-primary transition-colors">+254 700 000 123</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-center group">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-primary border border-slate-100 dark:border-slate-800 transition-colors group-hover:bg-primary group-hover:text-white">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">Business Location</p>
                                            <p className="font-bold text-lg group-hover:text-primary transition-colors">Eldoret Central, KVDA Plaza</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="flex gap-4 items-center group">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-primary border border-slate-100 dark:border-slate-800 transition-colors group-hover:bg-primary group-hover:text-white">
                                            <Briefcase className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">Industry Category</p>
                                            <p className="font-bold text-lg group-hover:text-primary transition-colors">General Trade & Services</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-center group">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-primary border border-slate-100 dark:border-slate-800 transition-colors group-hover:bg-primary group-hover:text-white">
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">Member Since</p>
                                            <p className="font-bold text-lg group-hover:text-primary transition-colors">August 2022</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-center group">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-primary border border-slate-100 dark:border-slate-800 transition-colors group-hover:bg-primary group-hover:text-white">
                                            <Globe className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">Website</p>
                                            <p className="font-bold text-lg group-hover:text-primary transition-colors">www.{selectedMember?.name.toLowerCase().replace(/\s+/g, '')}.co.ke</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button className="flex-1 h-14 rounded-2xl font-bold bg-primary text-white shadow-xl shadow-primary/20">
                                    Send Message <ExternalLink className="w-4 h-4 ml-2" />
                                </Button>
                                <Button variant="outline" className="flex-1 h-14 rounded-2xl font-bold border-primary/20 text-primary hover:bg-primary/5">
                                    Download Profile
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Footer />
        </div>
    );
}

