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
    Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SEOHead } from "@/components/seo/seo-head";
import { Link, useLocation } from "wouter";

export default function ProfilePage() {
    const [, setLocation] = useLocation();

    const handleLogout = () => {
        // Mock logout
        setLocation("/");
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
                                        JD
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 mb-4">
                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">John Doe</h1>
                                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border-none px-3 py-1 flex gap-1.5 items-center">
                                            <BadgeCheck className="w-4 h-4" />
                                            Active Member
                                        </Badge>
                                    </div>
                                    <p className="text-xl text-muted-foreground flex items-center gap-2">
                                        CEO, Eldoret Tech Solutions
                                    </p>
                                </div>

                                <div className="flex gap-3 mb-4">
                                    <Button variant="outline" className="rounded-xl border-border hover:bg-muted font-bold">
                                        <Settings className="w-4 h-4 mr-2" /> Edit Profile
                                    </Button>
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
                                                <p className="text-sm font-bold text-foreground">john.doe@eldorettech.co.ke</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-muted-foreground">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                                                <Phone className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Phone Number</p>
                                                <p className="text-sm font-bold text-foreground">+254 712 345 678</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-muted-foreground">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                                                <MapPin className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Location</p>
                                                <p className="text-sm font-bold text-foreground">Eldoret, Uasin Gishu County</p>
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
                                            <Badge className="bg-primary text-white">Full Member</Badge>
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
                                    <Button className="w-full rounded-xl font-bold">Download Certificate</Button>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Main Content Area */}
                        <div className="lg:col-span-2 space-y-8">
                            <Tabs defaultValue="overview" className="w-full">
                                <TabsList className="w-full h-14 bg-muted/40 p-1.5 rounded-2xl border border-border/50 overflow-x-auto overflow-y-hidden">
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
                                                    <h2 className="text-2xl font-extrabold mb-2">Eldoret Tech Solutions</h2>
                                                    <p className="text-muted-foreground flex items-center gap-2">
                                                        <Briefcase className="w-4 h-4" /> IT & Technology Services
                                                    </p>
                                                </div>
                                                <Button variant="outline" className="rounded-xl font-bold">Change Logo</Button>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-8 mb-8">
                                                <div>
                                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Business Description</p>
                                                    <p className="text-muted-foreground leading-relaxed leading-relaxed">
                                                        Providing cutting-edge software solutions and hardware maintenance for businesses in the Rift Valley region.
                                                        Specialized in ERP systems and cloud infra.
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Website</p>
                                                    <a href="#" className="text-primary font-bold flex items-center gap-2 hover:underline">
                                                        www.eldorettech.co.ke <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                </div>
                                            </div>

                                            <div className="pt-8 border-t border-border/50">
                                                <h3 className="font-bold mb-6">Business Registrations</h3>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-border/50">
                                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">KRA PIN</p>
                                                        <p className="font-bold font-mono">P051234567X</p>
                                                    </div>
                                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-border/50">
                                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Company Reg No</p>
                                                        <p className="font-bold font-mono">PVT-L6M7R2N</p>
                                                    </div>
                                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-border/50">
                                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Business Permit</p>
                                                        <p className="font-bold font-mono">UG/2024/7782</p>
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
        </div>
    );
}
