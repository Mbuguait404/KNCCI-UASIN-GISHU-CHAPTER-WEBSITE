import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";
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
    Award
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
                    // Reset form with fetched data
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
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!user) return null;

    const handleLogout = () => {
        logout();
    };


    return (
        <div className="min-h-screen bg-background">
            <SEOHead
                title="Your Profile | KNCCI Uasin Gishu Member Portal"
                description="Manage your KNCCI Uasin Gishu membership, business details, and trade opportunities."
            />
            <Navigation />

            <main className="pt-24 pb-20">
                <div className="container mx-auto px-4">
                    {/* Hero Profile Section */}
                    <div className="relative mb-12">
                        <div className="h-48 md:h-64 rounded-3xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/10 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full -ml-32 -mb-32 blur-2xl" />
                        </div>

                        <div className="container px-8 -mt-20 relative z-10">
                            <div className="flex flex-col md:flex-row gap-8 items-end">
                                <Avatar className="w-40 h-40 border-8 border-background shadow-2xl rounded-3xl">
                                    <AvatarImage src="" alt="Profile" />
                                    <AvatarFallback className="bg-primary text-white text-5xl font-extrabold rounded-none">
                                        {user.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 mb-4">
                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{user.name}</h1>
                                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border-none px-3 py-1 flex gap-1.5 items-center">
                                            <BadgeCheck className="w-4 h-4" />
                                            Active Member
                                        </Badge>
                                    </div>
                                    <p className="text-xl text-muted-foreground flex items-center gap-2">
                                        {business?.name || "Member"}, {business?.category || "Individual"}
                                    </p>
                                </div>

                                <div className="flex gap-3 mb-4 flex-wrap">
                                    {user.role === 'admin' && (
                                        <Button
                                            className="rounded-xl font-bold bg-gradient-to-r from-primary/5 to-secondary/5 text-white hover:from-primary/10 hover:to-secondary/10 shadow-lg shadow-primary/20"
                                            onClick={() => setLocation('/admin')}
                                        >
                                            <LayoutDashboard className="w-4 h-4 mr-2" /> Admin Dashboard
                                        </Button>
                                    )}
                                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="rounded-xl border-border hover:bg-primary/5 font-bold">
                                                <Settings className="w-4 h-4 mr-2" /> Edit Profile
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto rounded-3xl p-0 border-none shadow-2xl">
                                            <div className="bg-primary/5 p-8 border-b border-primary/10">
                                                <DialogHeader>
                                                    <DialogTitle className="text-2xl font-extrabold flex items-center gap-2">
                                                        <Briefcase className="w-6 h-6 text-primary" />
                                                        Business Profile Settings
                                                    </DialogTitle>
                                                    <DialogDescription className="text-base">
                                                        Update your organization's details to better represent your business in the chamber.
                                                    </DialogDescription>
                                                </DialogHeader>
                                            </div>

                                            <div className="p-8">
                                                <Form {...form}>
                                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <FormField
                                                                control={form.control}
                                                                name="name"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel className="font-bold">Business Name</FormLabel>
                                                                        <FormControl>
                                                                            <Input placeholder="e.g. Eldoret Tech Solutions" className="rounded-xl" {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={form.control}
                                                                name="category"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel className="font-bold">Category</FormLabel>
                                                                        <FormControl>
                                                                            <Input placeholder="e.g. IT & Technology" className="rounded-xl" {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={form.control}
                                                                name="email"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel className="font-bold">Business Email</FormLabel>
                                                                        <FormControl>
                                                                            <Input placeholder="info@company.co.ke" className="rounded-xl" {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={form.control}
                                                                name="phone"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel className="font-bold">Business Phone</FormLabel>
                                                                        <FormControl>
                                                                            <Input placeholder="+254..." className="rounded-xl" {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={form.control}
                                                                name="location"
                                                                render={({ field }) => (
                                                                    <FormItem className="md:col-span-2">
                                                                        <FormLabel className="font-bold">Location</FormLabel>
                                                                        <FormControl>
                                                                            <Input placeholder="e.g. KVDA Plaza, 4th Floor, Eldoret" className="rounded-xl" {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={form.control}
                                                                name="plan"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel className="font-bold">Membership Plan</FormLabel>
                                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                            <FormControl>
                                                                                <SelectTrigger className="rounded-xl">
                                                                                    <SelectValue placeholder="Select a plan" />
                                                                                </SelectTrigger>
                                                                            </FormControl>
                                                                            <SelectContent className="rounded-xl">
                                                                                <SelectItem value="Bronze">Bronze</SelectItem>
                                                                                <SelectItem value="Silver">Silver</SelectItem>
                                                                                <SelectItem value="Gold">Gold</SelectItem>
                                                                            </SelectContent>
                                                                        </Select>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={form.control}
                                                                name="website"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel className="font-bold">Website</FormLabel>
                                                                        <FormControl>
                                                                            <Input placeholder="https://..." className="rounded-xl" {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={form.control}
                                                                name="description"
                                                                render={({ field }) => (
                                                                    <FormItem className="md:col-span-2">
                                                                        <FormLabel className="font-bold">Business Description</FormLabel>
                                                                        <FormControl>
                                                                            <Textarea
                                                                                placeholder="Describe your business services and goals..."
                                                                                className="rounded-xl min-h-[100px]"
                                                                                {...field}
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>

                                                        <div className="pt-6 border-t border-border/50">
                                                            <h3 className="font-bold mb-4 flex items-center gap-2">
                                                                <Shield className="w-5 h-5 text-primary" />
                                                                Compliance Details
                                                            </h3>
                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                                <FormField
                                                                    control={form.control}
                                                                    name="kra_pin"
                                                                    render={({ field }) => (
                                                                        <FormItem>
                                                                            <FormLabel className="font-bold uppercase text-xs tracking-widest text-muted-foreground">KRA PIN</FormLabel>
                                                                            <FormControl>
                                                                                <Input className="rounded-xl font-mono" {...field} />
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                                <FormField
                                                                    control={form.control}
                                                                    name="company_reg_no"
                                                                    render={({ field }) => (
                                                                        <FormItem>
                                                                            <FormLabel className="font-bold uppercase text-xs tracking-widest text-muted-foreground">Reg No.</FormLabel>
                                                                            <FormControl>
                                                                                <Input className="rounded-xl font-mono" {...field} />
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                                <FormField
                                                                    control={form.control}
                                                                    name="business_permit"
                                                                    render={({ field }) => (
                                                                        <FormItem>
                                                                            <FormLabel className="font-bold uppercase text-xs tracking-widest text-muted-foreground">Permit No.</FormLabel>
                                                                            <FormControl>
                                                                                <Input className="rounded-xl font-mono" {...field} />
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                            </div>
                                                        </div>

                                                        <DialogFooter className="pt-8">
                                                            <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} className="rounded-xl font-bold">
                                                                Cancel
                                                            </Button>
                                                            <Button type="submit" className="rounded-xl font-bold px-8 shadow-lg shadow-primary/20">
                                                                Save Changes
                                                            </Button>
                                                        </DialogFooter>
                                                    </form>
                                                </Form>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                    <Button variant="destructive" className="rounded-xl font-bold shadow-lg shadow-red-500/10" onClick={handleLogout}>
                                        <LogOut className="w-4 h-4 mr-2" /> Logout
                                    </Button>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Sidebar */}
                        <div className="space-y-8">
                            <Card className="rounded-3xl border-border/50 shadow-xl overflow-hidden">
                                <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b border-border/50">
                                    <CardTitle className="text-lg font-bold">Member Information</CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 text-muted-foreground">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                                                <Mail className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Email Address</p>
                                                <p className="text-sm font-bold text-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-muted-foreground">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                                                <Phone className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Phone Number</p>
                                                <p className="text-sm font-bold text-foreground">{user.phone || "Not set"}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 text-muted-foreground">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                                                <MapPin className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Location</p>
                                                <p className="text-sm font-bold text-foreground">{business?.location || "Not set"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-muted-foreground">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                                                <Calendar className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Member Since</p>
                                                <p className="text-sm font-bold text-foreground">January 2023</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-border/50">
                                        <div className="flex justify-between items-center mb-4">
                                            <p className="font-bold">Membership Plan</p>
                                            <Badge className="bg-primary text-white">{business?.plan || "Full Member"}</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-4">Your membership expires on Dec 31, 2026</p>
                                        <Button className="w-full rounded-xl font-bold bg-muted text-foreground hover:bg-slate-200 dark:hover:bg-slate-800 border-none transition-colors" variant="outline">
                                            Renew Membership
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="rounded-3xl border-border/50 shadow-xl overflow-hidden bg-primary/5 border-primary/10">
                                <CardContent className="p-6 text-center">
                                    <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                                    <h3 className="text-xl font-bold mb-2">Member Verified</h3>
                                    <p className="text-sm text-muted-foreground mb-6">
                                        Your account has been fully verified by the KNCCI Uasin Gishu administration team.
                                    </p>
                                    <Button className="w-full rounded-xl font-bold" onClick={() => setShowCertificate(true)}>
                                        <Award className="w-4 h-4 mr-2" /> Download Certificate
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Main Content Area */}
                        <div className="lg:col-span-2 space-y-8">
                            <Tabs defaultValue="overview" className="w-full">
                                <TabsList className="w-full h-14 bg-primary/10 p-1.5 rounded-2xl border border-border/50 overflow-x-auto overflow-y-hidden">
                                    <TabsTrigger value="overview" className="flex-1 h-full rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-md font-bold text-sm">Dashboard</TabsTrigger>
                                    <TabsTrigger value="business" className="flex-1 h-full rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-md font-bold text-sm">Business Details</TabsTrigger>
                                    <TabsTrigger value="payments" className="flex-1 h-full rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-md font-bold text-sm">Finances</TabsTrigger>
                                    <TabsTrigger value="activity" className="flex-1 h-full rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-md font-bold text-sm">Recent Activity</TabsTrigger>
                                </TabsList>

                                <TabsContent value="overview" className="mt-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <Card className="rounded-3xl border-border/50 shadow-lg hover:shadow-xl transition-all group overflow-hidden">
                                            <CardContent className="p-8">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                                        <Activity className="w-7 h-7" />
                                                    </div>
                                                    <Badge className="bg-blue-100 text-blue-700 border-none px-3 font-bold">6 Active Jobs</Badge>
                                                </div>
                                                <h3 className="text-xl font-extrabold mb-2">Active Trade Leads</h3>
                                                <p className="text-muted-foreground mb-6">You have matching trade opportunities based on your business category.</p>
                                                <Link href="/marketplace">
                                                    <a className="text-primary font-bold flex items-center gap-1.5 hover:gap-2.5 transition-all">
                                                        View Opportunities <ChevronRight className="w-4 h-4" />
                                                    </a>
                                                </Link>
                                            </CardContent>
                                        </Card>

                                        <Card className="rounded-3xl border-border/50 shadow-lg hover:shadow-xl transition-all group overflow-hidden">
                                            <CardContent className="p-8">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
                                                        <Briefcase className="w-7 h-7" />
                                                    </div>
                                                    <Badge className="bg-amber-100 text-amber-700 border-none px-3 font-bold">Member Rate</Badge>
                                                </div>
                                                <h3 className="text-xl font-extrabold mb-2">Upcoming Events</h3>
                                                <p className="text-muted-foreground mb-6">Register for the next County Business Forum with your member discount.</p>
                                                <Link href="/events">
                                                    <a className="text-primary font-bold flex items-center gap-1.5 hover:gap-2.5 transition-all">
                                                        Explore Events <ChevronRight className="w-4 h-4" />
                                                    </a>
                                                </Link>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    <Card className="rounded-3xl border-border/50 shadow-xl overflow-hidden">
                                        <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b border-border/50 p-8">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <CardTitle className="text-2xl font-extrabold">Recent Notifications</CardTitle>
                                                    <CardDescription>Stay updated with chamber news and alerts</CardDescription>
                                                </div>
                                                <Button variant="ghost" className="text-primary font-bold hover:bg-primary/5">Mark all as read</Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <div className="divide-y divide-border/40">
                                                {[
                                                    { title: "Membership Renewal Success", time: "2 hours ago", icon: BadgeCheck, color: "text-emerald-500", bg: "bg-emerald-50" },
                                                    { title: "New Trade Lead: Agriculture Equipment", time: "1 day ago", icon: BaggageClaim, color: "text-blue-500", bg: "bg-blue-50" },
                                                    { title: "Invitation: Eldoret Business Gala", time: "3 days ago", icon: Calendar, color: "text-amber-500", bg: "bg-amber-50" },
                                                    { title: "System Update Complete", time: "1 week ago", icon: Shield, color: "text-slate-500", bg: "bg-slate-50" },
                                                ].map((note, i) => (
                                                    <div key={i} className="p-6 flex gap-4 hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors cursor-pointer group">
                                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${note.bg} ${note.color}`}>
                                                            <note.icon className="w-6 h-6" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-bold mb-1 group-hover:text-primary transition-colors">{note.title}</h4>
                                                            <p className="text-sm text-muted-foreground">{note.time}</p>
                                                        </div>
                                                        <ChevronRight className="w-5 h-5 text-muted-foreground self-center opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="p-6 bg-slate-50 dark:bg-slate-900/40 text-center border-t border-border/50">
                                                <Button variant="outline" className="font-bold text-primary">View all notifications</Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="business" className="mt-8">
                                    <div className="space-y-6">
                                        <Card className="rounded-3xl border-border/50 shadow-xl p-8">
                                            <div className="flex justify-between items-start mb-8">
                                                <div>
                                                    <h2 className="text-2xl font-extrabold mb-2">{business?.name || "Business Name Not Set"}</h2>
                                                    <p className="text-muted-foreground flex items-center gap-2">
                                                        <Briefcase className="w-4 h-4" /> {business?.category || "Category Not Set"}
                                                    </p>
                                                </div>
                                                <Button variant="outline" className="rounded-xl font-bold" onClick={() => setIsEditDialogOpen(true)}>
                                                    Edit Business Details
                                                </Button>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-8 mb-8">
                                                <div>
                                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Business Description</p>
                                                    <p className="text-muted-foreground leading-relaxed">
                                                        {business?.description || "No description provided yet. Complete your profile to help other members find you."}
                                                    </p>
                                                </div>
                                                <div className="space-y-4">
                                                    <div>
                                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Website</p>
                                                        {business?.website ? (
                                                            <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-primary font-bold flex items-center gap-2 hover:underline">
                                                                {business.website.replace(/^https?:\/\//, '')} <ExternalLink className="w-4 h-4" />
                                                            </a>
                                                        ) : (
                                                            <p className="text-sm text-muted-foreground italic">No website listed</p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Business Email</p>
                                                        <p className="font-bold">{business?.email || "Not set"}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Primary Phone</p>
                                                        <p className="font-bold">{business?.phone || "Not set"}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-8 border-t border-border/50">
                                                <h3 className="font-bold mb-6 flex items-center gap-2">
                                                    <BadgeCheck className="w-5 h-5 text-primary" />
                                                    Registration & Compliance
                                                </h3>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-border/50">
                                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">KRA PIN</p>
                                                        <p className="font-bold font-mono">{business?.kra_pin || "---"}</p>
                                                    </div>
                                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-border/50">
                                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Company Reg No</p>
                                                        <p className="font-bold font-mono">{business?.company_reg_no || "---"}</p>
                                                    </div>
                                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-border/50">
                                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Business Permit</p>
                                                        <p className="font-bold font-mono">{business?.business_permit || "---"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            {/* Membership Certificate Modal */}
            {showCertificate && (
                <MembershipCertificate
                    memberName={user.name}
                    regNo={user.reg_no}
                    businessName={business?.name}
                    businessCategory={business?.category}
                    plan={business?.plan}
                    onClose={() => setShowCertificate(false)}
                />
            )}
        </div>
    );
}
