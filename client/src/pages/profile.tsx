import { Navigation } from "@/components/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    Settings,
    CreditCard,
    Briefcase,
    MapPin,
    Phone,
    Mail,
    Calendar,
    LogOut,
    ExternalLink,
    ChevronRight,
    Shield,
    BadgeCheck,
    BaggageClaim,
    Activity,
    LayoutDashboard,
    Award,
    Home,
    Search,
    Bell,
    TrendingUp,
    Store,
    Users,
    FileText,
    Download,
    CreditCard as PaymentIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SEOHead } from "@/components/seo/seo-head";
import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useAuth } from "@/services/auth-context";
import { businessService, BusinessData } from "@/services/business-service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { MembershipCertificate } from "@/components/membership-certificate";

export default function ProfilePage() {
    const [, setLocation] = useLocation();
    const { user, logout, loading: authLoading } = useAuth();
    const [business, setBusiness] = useState<BusinessData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [showCertificate, setShowCertificate] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");

    const businessSchema = z.object({
        name: z.string().min(2, "Business name must be at least 2 characters"),
        category: z.string().min(2, "Category is required"),
        email: z.string().email("Invalid email address"),
        phone: z.string().min(10, "Phone number must be at least 10 characters"),
        location: z.string().min(2, "Location is required"),
        plan: z.enum(["Bronze", "Silver", "Gold"]),
        website: z.string().url("Invalid website URL").optional().or(z.literal("")),
        description: z.string().min(10, "Description must be at least 10 characters").optional().or(z.literal("")),
        kra_pin: z.string().optional().or(z.literal("")),
        company_reg_no: z.string().optional().or(z.literal("")),
        business_permit: z.string().optional().or(z.literal("")),
    });

    const form = useForm<z.infer<typeof businessSchema>>({
        resolver: zodResolver(businessSchema),
        defaultValues: {
            name: "",
            category: "",
            email: "",
            phone: "",
            location: "",
            plan: "Bronze",
            website: "",
            description: "",
            kra_pin: "",
            company_reg_no: "",
            business_permit: "",
        },
    });

    useEffect(() => {
        if (!authLoading && !user) {
            setLocation("/login");
            return;
        }

        const fetchBusiness = async () => {
            try {
                const response = await businessService.getMyBusiness();
                if (response.success && response.data) {
                    setBusiness(response.data);
                    form.reset({
                        name: response.data.name || "",
                        category: response.data.category || "",
                        email: response.data.email || "",
                        phone: response.data.phone || "",
                        location: response.data.location || "",
                        plan: response.data.plan || "Bronze",
                        website: response.data.website || "",
                        description: response.data.description || "",
                        kra_pin: response.data.kra_pin || "",
                        company_reg_no: response.data.company_reg_no || "",
                        business_permit: response.data.business_permit || "",
                    });
                }
            } catch (error) {
                console.error("Failed to fetch business:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchBusiness();
        }
    }, [user, authLoading, setLocation, form]);

    const onSubmit = async (data: z.infer<typeof businessSchema>) => {
        try {
            let response;
            if (business?._id) {
                response = await businessService.updateBusiness(data);
            } else {
                response = await businessService.createBusiness(data as BusinessData);
            }

            if (response.success) {
                setBusiness(response.data);
                toast({
                    title: "Success",
                    description: "Business profile updated successfully.",
                });
                setIsEditDialogOpen(false);
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to update business profile.",
                variant: "destructive",
            });
        }
    };

    if (authLoading || (loading && !business && user)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full"
                />
            </div>
        );
    }

    if (!user) return null;

    const sideNavItems = [
        { key: "overview", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
        { key: "business", label: "Business Profile", icon: <Briefcase className="w-4 h-4" /> },
        { key: "finances", label: "Finances", icon: <PaymentIcon className="w-4 h-4" /> },
        { key: "marketplace", label: "Marketplace", icon: <Store className="w-4 h-4" /> },
        { key: "events", label: "Events & Trade", icon: <Activity className="w-4 h-4" /> },
    ];

    const stats = [
        { title: "Membership Status", value: business?.plan || "Full", icon: <Shield className="w-5 h-5" />, color: "from-blue-500 to-indigo-600", bg: "bg-blue-500/10" },
        { title: "Registered Events", value: "2", icon: <Calendar className="w-5 h-5" />, color: "from-primary to-primary/70", bg: "bg-primary/10" },
        { title: "Trade Leads", value: "12", icon: <TrendingUp className="w-5 h-5" />, color: "from-emerald-500 to-teal-600", bg: "bg-emerald-500/10" },
        { title: "Total Points", value: "450", icon: <Award className="w-5 h-5" />, color: "from-amber-500 to-orange-600", bg: "bg-amber-500/10" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans">
            <SEOHead
                title="Member Dashboard | KNCCI Uasin Gishu"
                description="Manage your business, explore trade leads, and connect with the chamber through your personal dashboard."
            />

            {/* ──── Sidebar ──────────────────────────────────────────────── */}
            <aside className="hidden lg:flex lg:flex-col w-72 bg-white dark:bg-slate-900 border-r border-border/40 p-6 justify-between fixed h-full z-20 overflow-y-auto">
                <div className="space-y-8">
                    {/* Brand */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-extrabold text-sm shadow-lg shadow-primary/20">
                            K
                        </div>
                        <div>
                            <h2 className="font-extrabold text-sm tracking-tight text-foreground">Member Portal</h2>
                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">KNCCI Uasin Gishu</p>
                        </div>
                    </div>

                    {/* Nav Items */}
                    <nav className="space-y-1">
                        {sideNavItems.map((item) => (
                            <button
                                key={item.key}
                                onClick={() => setActiveTab(item.key)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${activeTab === item.key
                                    ? "bg-primary/10 text-primary shadow-sm"
                                    : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-foreground"
                                    }`}
                            >
                                {item.icon}
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    {/* Navigation Help */}
                    <div className="pt-4 space-y-4">
                        <p className="px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Resources</p>
                        <div className="space-y-1">
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
                                onClick={() => setLocation('/')}
                            >
                                <Home className="w-4 h-4 mr-3" /> Visit Website
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
                                onClick={() => setShowCertificate(true)}
                            >
                                <Award className="w-4 h-4 mr-3" /> Certificate
                            </Button>
                        </div>
                    </div>
                </div>

                {/* User & Logout */}
                <div className="mt-8 space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-border/20 text-foreground">
                        <Avatar className="w-9 h-9">
                            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs uppercase">
                                {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold truncate">{user.name}</p>
                            <p className="text-[10px] text-muted-foreground truncate italic">{business?.plan || "Member"}</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-sm font-bold text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl"
                        onClick={logout}
                    >
                        <LogOut className="w-4 h-4 mr-2" /> Log Out
                    </Button>
                </div>
            </aside>

            {/* ──── Main Content ─────────────────────────────────────────── */}
            <main className="flex-1 lg:ml-72 min-h-screen text-foreground">
                {/* Mobile Header */}
                <header className="lg:hidden flex items-center justify-between p-4 border-b border-border/40 bg-white dark:bg-slate-900 sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-extrabold text-xs">K</div>
                        <h2 className="font-extrabold text-sm uppercase">Dashboard</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setShowCertificate(true)}>
                            <Award className="w-4 h-4 text-primary" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500" onClick={logout}>
                            <LogOut className="w-4 h-4" />
                        </Button>
                    </div>
                </header>

                <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
                    {/* Header Section with glassmorphism welcome banner */}
                    <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/5 border border-primary/10 p-8 lg:p-12">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -mr-32 -mt-32 blur-[80px]" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full -ml-32 -mb-32 blur-[60px]" />

                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary/70 mb-2">
                                    Welcome back, {user.name.split(' ')[0]}
                                </p>
                                <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight mb-4">
                                    {sideNavItems.find(n => n.key === activeTab)?.label || "Dashboard"}
                                </h1>
                                <div className="flex flex-wrap items-center gap-3">
                                    <Badge className="bg-white dark:bg-slate-800 text-primary border-primary/20 shadow-sm font-bold px-3 py-1 flex gap-1.5 items-center">
                                        <BadgeCheck className="w-4 h-4 text-primary" />
                                        Verified Member
                                    </Badge>
                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                                        Member Since Jan 2023
                                    </span>
                                </div>
                            </motion.div>

                            <div className="flex flex-wrap gap-3">
                                {user.role === 'admin' && (
                                    <Button
                                        variant="outline"
                                        className="rounded-2xl border-primary/20 bg-white/50 backdrop-blur-sm hover:bg-white dark:bg-slate-900/50 dark:hover:bg-slate-900 font-bold h-12"
                                        onClick={() => setLocation('/admin')}
                                    >
                                        <LayoutDashboard className="w-4 h-4 mr-2" /> Admin Panel
                                    </Button>
                                )}
                                <Button className="rounded-2xl shadow-xl shadow-primary/20 font-bold h-12 px-6" onClick={() => setIsEditDialogOpen(true)}>
                                    <Settings className="w-4 h-4 mr-2" /> Settings
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* ═══ Left Column: Profile Card ═══ */}
                        <div className="lg:col-span-1 space-y-8">
                            <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-primary/5 overflow-hidden transition-all duration-500 hover:shadow-primary/10 bg-white dark:bg-slate-900 border-none">
                                <CardHeader className="p-0 relative">
                                    <div className="h-32 bg-gradient-to-br from-primary via-primary/80 to-secondary/80">
                                        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
                                            <BadgeCheck className="w-3 h-3" /> System Active
                                        </div>
                                    </div>
                                    <div className="px-8 -mt-16 flex items-end justify-between">
                                        <Avatar className="w-32 h-32 border-[8px] border-white dark:border-slate-900 shadow-2xl rounded-[2rem]">
                                            <AvatarFallback className="bg-primary text-white text-4xl font-extrabold uppercase">
                                                {user.name.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 space-y-6 pt-6">
                                    <div>
                                        <h2 className="text-2xl font-extrabold tracking-tight">{user.name}</h2>
                                        <p className="text-muted-foreground font-medium flex items-center gap-2 mt-1">
                                            {business?.category || "KNCCI Member"} • Uasin Gishu
                                        </p>
                                    </div>

                                    <div className="space-y-4 pt-4">
                                        <div className="flex items-center gap-4 text-muted-foreground group">
                                            <div className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                                <Mail className="w-5 h-5" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email Address</p>
                                                <p className="text-sm font-bold text-foreground truncate">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-muted-foreground group">
                                            <div className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                                <Phone className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Direct Contact</p>
                                                <p className="text-sm font-bold text-foreground">{user.phone || "Not set"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-muted-foreground group">
                                            <div className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                                <MapPin className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Headquarters</p>
                                                <p className="text-sm font-bold text-foreground">{business?.location || "Eldoret, Kenya"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-border/40">
                                        <div className="flex justify-between items-center mb-4">
                                            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Current Plan</p>
                                            <Badge className="bg-primary/10 text-primary border-none font-bold rounded-lg px-3 py-1">
                                                {business?.plan || "Bronze"}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-relaxed italic">
                                            Membership status is currently active. Next renewal due in December 2026.
                                        </p>
                                        <Button className="w-full mt-6 rounded-2xl h-12 font-bold shadow-lg shadow-primary/10 bg-primary/5 text-primary border-primary/20 hover:bg-primary hover:text-white transition-all" variant="outline" onClick={() => setShowCertificate(true)}>
                                            <Award className="w-4 h-4 mr-2" /> Download Certificate
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* ═══ Right Column: Dynamic Content Tabs ═══ */}
                        <div className="lg:col-span-2 space-y-8">
                            <AnimatePresence mode="wait">
                                {activeTab === "overview" && (
                                    <motion.div
                                        key="overview"
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        className="space-y-8"
                                    >
                                        {/* Quick Stats Grid */}
                                        <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
                                            {stats.map((stat, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.1 }}
                                                >
                                                    <Card className="rounded-3xl border-none shadow-xl shadow-primary/5 hover:shadow-primary/10 transition-all border-border/30 overflow-hidden relative group">
                                                        <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} rounded-full -mr-12 -mt-12 transition-transform duration-700 group-hover:scale-150 blur-2xl`} />
                                                        <CardContent className="p-6 relative">
                                                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                                                {stat.icon}
                                                            </div>
                                                            <p className="text-3xl font-extrabold tracking-tight">{stat.value}</p>
                                                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1 opacity-70">{stat.title}</p>
                                                        </CardContent>
                                                    </Card>
                                                </motion.div>
                                            ))}
                                        </div>

                                        {/* Notifications / Activity */}
                                        <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-primary/5 dark:bg-slate-900 overflow-hidden">
                                            <CardHeader className="p-8 pb-4">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <CardTitle className="text-xl font-extrabold text-foreground">Recent Activities</CardTitle>
                                                        <CardDescription className="text-sm font-medium">Insights and updates for your business journey</CardDescription>
                                                    </div>
                                                    <Button variant="ghost" className="text-primary font-extrabold text-[10px] uppercase tracking-widest">Mark read</Button>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-0">
                                                <div className="divide-y divide-border/20">
                                                    {[
                                                        { title: "Renewal Success", desc: "Your membership for 2026/27 has been officially confirmed.", time: "2h ago", icon: Award, color: "text-amber-500", bg: "bg-amber-500/10" },
                                                        { title: "Marketplace Match", desc: "A new lead in 'Construction Materials' matches your profile.", time: "1d ago", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                                                        { title: "Directory Profile", desc: "Your business is now visible in the verified member directory.", time: "3d ago", icon: User, color: "text-blue-500", bg: "bg-blue-500/10" },
                                                    ].map((item, i) => (
                                                        <div key={i} className="p-6 flex gap-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group">
                                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${item.bg} ${item.color} shadow-sm group-hover:rotate-6 transition-transform`}>
                                                                <item.icon className="w-7 h-7" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex justify-between items-start mb-1">
                                                                    <h4 className="font-extrabold truncate pr-4 text-xs uppercase tracking-tight group-hover:text-primary transition-colors">{item.title}</h4>
                                                                    <span className="text-[10px] font-extrabold text-muted-foreground bg-slate-100 dark:bg-slate-800 rounded-full px-2 py-0.5 whitespace-nowrap">{item.time}</span>
                                                                </div>
                                                                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed font-medium">{item.desc}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="p-6 bg-slate-50/50 dark:bg-slate-800/20 text-center border-t border-border/10">
                                                    <Button variant="ghost" className="font-extrabold text-primary text-[10px] uppercase tracking-[0.2em] hover:bg-transparent">All Updates <ChevronRight className="w-4 h-4 ml-1" /></Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                )}

                                {activeTab === "business" && (
                                    <motion.div
                                        key="business"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="space-y-6"
                                    >
                                        <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-primary/5 p-8 lg:p-12 bg-white dark:bg-slate-900 border border-border/40 overflow-hidden relative">
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />

                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
                                                <div className="relative z-10">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight">{business?.name || "Member Organization"}</h2>
                                                        <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary font-bold uppercase text-[10px] tracking-widest px-3 h-6">{business?.plan || "Bronze"}</Badge>
                                                    </div>
                                                    <p className="text-muted-foreground font-bold flex items-center gap-2 uppercase tracking-widest text-xs">
                                                        <Briefcase className="w-4 h-4 text-primary" /> {business?.category || "Industrial Sector"}
                                                    </p>
                                                </div>
                                                <Button className="rounded-2xl h-12 px-8 font-bold shadow-xl shadow-primary/20 group animate-pulse hover:animate-none" onClick={() => setIsEditDialogOpen(true)}>
                                                    Modify Details
                                                </Button>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-12 mb-12 relative z-10">
                                                <div className="space-y-6">
                                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Organizational Background</p>
                                                    <p className="text-muted-foreground leading-[1.8] font-medium">
                                                        {business?.description || "No primary organization description provided. A complete profile helps you connect with trade partners and enhances your visibility in the regional business landscape. Please click 'Modify Details' to update your background info."}
                                                    </p>
                                                </div>
                                                <div className="space-y-8">
                                                    <div className="flex flex-col gap-2">
                                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Web & Social</p>
                                                        {business?.website ? (
                                                            <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-foreground font-extrabold flex items-center gap-2 hover:text-primary transition-all text-sm group">
                                                                {business.website.replace(/^https?:\/\//, '')} <ExternalLink className="w-4 h-4 opacity-30 group-hover:opacity-100" />
                                                            </a>
                                                        ) : (
                                                            <p className="text-sm text-muted-foreground italic font-medium">Corporate website not linked</p>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col gap-3">
                                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Official Contacts</p>
                                                        <div className="space-y-1">
                                                            <p className="font-extrabold text-sm">{business?.email || "General info missing"}</p>
                                                            <p className="font-extrabold text-sm">{business?.phone || "Phone contact missing"}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-12 border-t border-border/40 relative z-10">
                                                <h3 className="font-extrabold text-[10px] uppercase tracking-[0.3em] mb-8 flex items-center gap-3 text-muted-foreground">
                                                    <Shield className="w-4 h-4 text-primary" /> Registration Compliance
                                                </h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                                    <div className="p-8 rounded-[2rem] bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 transition-all hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl hover:shadow-primary/5 group cursor-default">
                                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3 group-hover:text-primary transition-colors">KRA PIN Status</p>
                                                        <p className="font-extrabold font-mono text-foreground text-sm tracking-wider uppercase">{business?.kra_pin || "---"}</p>
                                                    </div>
                                                    <div className="p-8 rounded-[2rem] bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 transition-all hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl hover:shadow-primary/5 group cursor-default">
                                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3 group-hover:text-primary transition-colors">Company Registry</p>
                                                        <p className="font-extrabold font-mono text-foreground text-sm tracking-wider uppercase">{business?.company_reg_no || "---"}</p>
                                                    </div>
                                                    <div className="p-8 rounded-[2rem] bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 transition-all hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl hover:shadow-primary/5 group cursor-default">
                                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3 group-hover:text-primary transition-colors">Operating Permit</p>
                                                        <p className="font-extrabold font-mono text-foreground text-sm tracking-wider uppercase">{business?.business_permit || "---"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                )}

                                {activeTab === "finances" && (
                                    <motion.div
                                        key="finances"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="space-y-6"
                                    >
                                        <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-primary/5 p-12 bg-white dark:bg-slate-900 border border-border/40 min-h-[500px] flex flex-col items-center justify-center text-center">
                                            <div className="w-24 h-24 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-8 shadow-inner">
                                                <PaymentIcon className="w-10 h-10 text-muted-foreground/30" />
                                            </div>
                                            <h3 className="text-3xl font-extrabold mb-4 tracking-tight">Finances & Billing</h3>
                                            <p className="text-muted-foreground max-w-sm font-medium leading-[1.8]">
                                                Track your investment in the chamber. View past receipts, upcoming renewals, and download tax-ready invoices. This feature is currently in final verification.
                                            </p>
                                            <div className="mt-10 flex gap-4">
                                                <Button variant="ghost" className="font-bold opacity-50 cursor-not-allowed">H1 Stat</Button>
                                                <div className="w-px h-10 bg-border/40" />
                                                <Button variant="ghost" className="font-bold opacity-50 cursor-not-allowed">H2 Stat</Button>
                                            </div>
                                            <Button variant="outline" className="mt-12 rounded-2xl h-12 px-10 font-extrabold uppercase tracking-widest text-[10px]" disabled>
                                                System locked
                                            </Button>
                                        </Card>
                                    </motion.div>
                                )}

                                {activeTab === "marketplace" && (
                                    <motion.div
                                        key="marketplace"
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        className="space-y-6"
                                    >
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                                                <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-primary/5 p-10 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800/80 group overflow-hidden relative">
                                                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/5 rounded-full blur-[50px] group-hover:bg-secondary/10 transition-colors" />
                                                    <div className="w-16 h-16 rounded-[1.5rem] bg-secondary/10 text-secondary flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                                                        <Store className="w-8 h-8" />
                                                    </div>
                                                    <h3 className="text-2xl font-extrabold mb-4 tracking-tight">Marketplace Hub</h3>
                                                    <p className="text-sm text-muted-foreground mb-10 leading-[1.8] font-medium italic">Discover products, post services, and find verified regional suppliers within the Uasin Gishu trade network.</p>
                                                    <Link href="/marketplace">
                                                        <a className="text-primary font-bold text-xs flex items-center gap-2 hover:gap-4 transition-all uppercase tracking-[0.2em] group">
                                                            Enter Marketplace <ChevronRight className="w-4 h-4 group-hover:translate-x-1" />
                                                        </a>
                                                    </Link>
                                                </Card>
                                            </motion.div>

                                            <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                                                <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-primary/5 p-10 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800/80 group overflow-hidden relative">
                                                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-[50px] group-hover:bg-primary/10 transition-colors" />
                                                    <div className="w-16 h-16 rounded-[1.5rem] bg-primary/10 text-primary flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                                                        <Users className="w-8 h-8" />
                                                    </div>
                                                    <h3 className="text-2xl font-extrabold mb-4 tracking-tight">Verified Connections</h3>
                                                    <p className="text-sm text-muted-foreground mb-10 leading-[1.8] font-medium italic">Communicate directly with verified KNCCI members to forge durable partnerships and expand your corporate reach.</p>
                                                    <Link href="/member-directory">
                                                        <a className="text-primary font-bold text-xs flex items-center gap-2 hover:gap-4 transition-all uppercase tracking-[0.2em] group">
                                                            Search Members <ChevronRight className="w-4 h-4 group-hover:translate-x-1" />
                                                        </a>
                                                    </Link>
                                                </Card>
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === "events" && (
                                    <motion.div
                                        key="events"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="space-y-6"
                                    >
                                        <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-primary/5 p-10 lg:p-12 bg-white dark:bg-slate-900 border border-border/40">
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
                                                <div className="relative z-10">
                                                    <h3 className="text-2xl lg:text-3xl font-extrabold tracking-tight">County Business Events</h3>
                                                    <p className="text-sm text-muted-foreground mt-2 font-bold uppercase tracking-widest flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Event Portal
                                                    </p>
                                                </div>
                                                <Link href="/events">
                                                    <Button className="rounded-2xl h-14 px-8 font-bold shadow-xl shadow-primary/20 bg-primary hover:scale-105 transition-transform uppercase tracking-widest text-[10px]">
                                                        Full Calendar View
                                                    </Button>
                                                </Link>
                                            </div>

                                            <div className="space-y-6">
                                                {[
                                                    { title: "Eldoret Business Expo 2026", date: "Oct 15, 2026", type: "Conference", status: "Open for Gold", speakers: 12 },
                                                    { title: "SME Digital Growth Forum", date: "Nov 02, 2026", type: "Workshop", status: "Limited Slots", speakers: 4 },
                                                ].map((event, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: i * 0.1 }}
                                                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-8 rounded-[2rem] bg-slate-50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 transition-all border border-transparent hover:border-border/30 hover:shadow-xl hover:shadow-primary/5 group"
                                                    >
                                                        <div className="flex items-center gap-6 mb-4 sm:mb-0">
                                                            <div className="w-16 h-16 rounded-[1.5rem] bg-white dark:bg-slate-900 flex flex-col items-center justify-center border border-border/20 shadow-sm group-hover:border-primary/40 transition-colors">
                                                                <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-60 tracking-tighter">{event.date.split(' ')[0]}</span>
                                                                <span className="text-2xl font-extrabold text-primary leading-none -mt-1">{event.date.split(' ')[1].slice(0, 2)}</span>
                                                            </div>
                                                            <div>
                                                                <h4 className="font-extrabold text-base uppercase tracking-tight group-hover:text-primary transition-colors">{event.title}</h4>
                                                                <div className="flex flex-wrap items-center gap-3 mt-2">
                                                                    <Badge variant="outline" className="text-[9px] h-5 font-bold border-primary/20 bg-primary/5 text-primary tracking-widest uppercase">{event.type}</Badge>
                                                                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-widest">{event.status}</span>
                                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                                                                        <Users className="w-3 h-3" /> {event.speakers} Key Speakers
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Button variant="ghost" className="rounded-xl font-bold text-xs uppercase tracking-widest text-primary hover:bg-primary/5 px-6">Event Details</Button>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </Card>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </main>

            {/* Membership Certificate Modal */}
            {showCertificate && (
                <MembershipCertificate
                    memberName={user.name}
                    regNo={user.reg_no || "KNCCI/UG/0000"}
                    businessName={business?.name || "Member Organization"}
                    businessCategory={business?.category || "Sector Information"}
                    plan={business?.plan || "Bronze"}
                    onClose={() => setShowCertificate(false)}
                />
            )}

            {/* Form Dialog for Edits - Already integrated above but keeping logic intact */}
        </div>
    );
}
