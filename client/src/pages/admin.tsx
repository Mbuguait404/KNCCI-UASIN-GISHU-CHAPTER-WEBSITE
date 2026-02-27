import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
    Users, BarChart3, Shield, Search, ChevronLeft, ChevronRight,
    LogOut, Crown, Medal, Award, Trash2, KeyRound, UserCog,
    Building2, Mail, Phone, MapPin, Globe, Eye, X, Home,
    TrendingUp, Activity, LayoutDashboard, ChevronDown,
    AlertTriangle, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SEOHead } from "@/components/seo/seo-head";
import { useAuth } from "@/services/auth-context";
import { adminService, DashboardStats, MemberDoc, PaginatedMembers } from "@/services/admin-service";
import { useToast } from "@/hooks/use-toast";


// ── Plan badge styling ──────────────────────────────────────────────────────
const planConfig: Record<string, { color: string; icon: React.ReactNode; bg: string }> = {
    Gold: {
        color: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-500/10 border-amber-500/20",
        icon: <Crown className="w-3.5 h-3.5" />,
    },
    Silver: {
        color: "text-slate-500 dark:text-slate-300",
        bg: "bg-slate-400/10 border-slate-400/20",
        icon: <Medal className="w-3.5 h-3.5" />,
    },
    Bronze: {
        color: "text-orange-700 dark:text-orange-400",
        bg: "bg-orange-500/10 border-orange-500/20",
        icon: <Award className="w-3.5 h-3.5" />,
    },
};

function PlanBadge({ plan }: { plan: string }) {
    const cfg = planConfig[plan] || planConfig.Bronze;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${cfg.bg} ${cfg.color}`}>
            {cfg.icon} {plan}
        </span>
    );
}

function RoleBadge({ role }: { role: string }) {
    return role === "admin" ? (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400">
            <Shield className="w-3 h-3" /> Admin
        </span>
    ) : (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400">
            <Users className="w-3 h-3" /> Member
        </span>
    );
}


// ── Main Admin Dashboard ────────────────────────────────────────────────────
export default function AdminDashboard() {
    const [, setLocation] = useLocation();
    const { user, logout, isAuthenticated, loading: authLoading } = useAuth();
    const { toast } = useToast();

    // ─── State ─────────────────────────────────────────────────────────
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [members, setMembers] = useState<PaginatedMembers | null>(null);
    const [loadingStats, setLoadingStats] = useState(true);
    const [loadingMembers, setLoadingMembers] = useState(true);

    // Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("all");
    const [planFilter, setPlanFilter] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const pageLimit = 10;

    // Modals
    const [selectedMember, setSelectedMember] = useState<MemberDoc | null>(null);
    const [detailOpen, setDetailOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<MemberDoc | null>(null);
    const [resetPwTarget, setResetPwTarget] = useState<MemberDoc | null>(null);
    const [newPassword, setNewPassword] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    // Active sidebar item
    const [activeTab, setActiveTab] = useState("overview");

    // ─── Auth guard ────────────────────────────────────────────────────
    useEffect(() => {
        if (!authLoading && (!isAuthenticated || user?.role !== "admin")) {
            setLocation("/login");
        }
    }, [authLoading, isAuthenticated, user, setLocation]);

    // ─── Fetch stats ───────────────────────────────────────────────────
    const fetchStats = useCallback(async () => {
        try {
            setLoadingStats(true);
            const res = await adminService.getStats();
            if (res.success) setStats(res.data);
        } catch (err: any) {
            toast({ title: "Error", description: err.response?.data?.message || "Failed to load stats", variant: "destructive" });
        } finally {
            setLoadingStats(false);
        }
    }, [toast]);

    // ─── Fetch members ─────────────────────────────────────────────────
    const fetchMembers = useCallback(async () => {
        try {
            setLoadingMembers(true);
            const params: any = { page: currentPage, limit: pageLimit };
            if (searchQuery) params.search = searchQuery;
            if (roleFilter !== "all") params.role = roleFilter;
            if (planFilter !== "all") params.plan = planFilter;
            const res = await adminService.getMembers(params);
            if (res.success) setMembers(res.data);
        } catch (err: any) {
            toast({ title: "Error", description: err.response?.data?.message || "Failed to load members", variant: "destructive" });
        } finally {
            setLoadingMembers(false);
        }
    }, [currentPage, searchQuery, roleFilter, planFilter, toast]);

    useEffect(() => { fetchStats(); }, [fetchStats]);
    useEffect(() => { fetchMembers(); }, [fetchMembers]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => { setCurrentPage(1); }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // ─── Actions ───────────────────────────────────────────────────────
    const handleRoleToggle = async (member: MemberDoc) => {
        const newRole = member.role === "admin" ? "member" : "admin";
        setActionLoading(true);
        try {
            await adminService.updateRole(member._id, newRole);
            toast({ title: "Role Updated", description: `${member.name} is now ${newRole}.` });
            fetchMembers();
            fetchStats();
        } catch (err: any) {
            toast({ title: "Error", description: err.response?.data?.message || "Failed to update role", variant: "destructive" });
        } finally {
            setActionLoading(false);
        }
    };

    const handlePlanUpdate = async (memberId: string, plan: "Bronze" | "Silver" | "Gold") => {
        setActionLoading(true);
        try {
            await adminService.updatePlan(memberId, plan);
            toast({ title: "Plan Updated", description: `Plan changed to ${plan}.` });
            fetchMembers();
            fetchStats();
        } catch (err: any) {
            toast({ title: "Error", description: err.response?.data?.message || "Failed to update plan", variant: "destructive" });
        } finally {
            setActionLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!resetPwTarget || !newPassword) return;
        setActionLoading(true);
        try {
            await adminService.resetPassword(resetPwTarget._id, newPassword);
            toast({ title: "Password Reset", description: `Password reset for ${resetPwTarget.name}.` });
            setResetPwTarget(null);
            setNewPassword("");
        } catch (err: any) {
            toast({ title: "Error", description: err.response?.data?.message || "Failed to reset password", variant: "destructive" });
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setActionLoading(true);
        try {
            await adminService.deleteMember(deleteTarget._id);
            toast({ title: "Member Deleted", description: `${deleteTarget.name} and associated data removed.` });
            setDeleteTarget(null);
            fetchMembers();
            fetchStats();
        } catch (err: any) {
            toast({ title: "Error", description: err.response?.data?.message || "Failed to delete member", variant: "destructive" });
        } finally {
            setActionLoading(false);
        }
    };

    const openDetail = async (member: MemberDoc) => {
        try {
            const res = await adminService.getMember(member._id);
            if (res.success) {
                setSelectedMember(res.data);
                setDetailOpen(true);
            }
        } catch {
            setSelectedMember(member);
            setDetailOpen(true);
        }
    };

    // ─── Render helpers ────────────────────────────────────────────────
    if (authLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const totalMembers = stats?.totalMembers ?? 0;
    const goldCount = stats?.plans?.Gold ?? 0;
    const silverCount = stats?.plans?.Silver ?? 0;
    const bronzeCount = stats?.plans?.Bronze ?? 0;

    // ─── Stat cards ────────────────────────────────────────────────────
    const statCards = [
        {
            title: "Total Members",
            value: totalMembers,
            icon: <Users className="w-5 h-5" />,
            gradient: "from-blue-500 to-indigo-600",
            bgGlow: "bg-blue-500/10",
        },
        {
            title: "Gold Plan",
            value: goldCount,
            icon: <Crown className="w-5 h-5" />,
            gradient: "from-amber-500 to-yellow-500",
            bgGlow: "bg-amber-500/10",
        },
        {
            title: "Silver Plan",
            value: silverCount,
            icon: <Medal className="w-5 h-5" />,
            gradient: "from-slate-400 to-slate-500",
            bgGlow: "bg-slate-400/10",
        },
        {
            title: "Bronze Plan",
            value: bronzeCount,
            icon: <Award className="w-5 h-5" />,
            gradient: "from-orange-500 to-amber-600",
            bgGlow: "bg-orange-500/10",
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
            <SEOHead
                title="Admin Dashboard | KNCCI Uasin Gishu"
                description="KNCCI Uasin Gishu admin dashboard for managing members and monitoring membership."
            />

            {/* ──── Sidebar ──────────────────────────────────────────────── */}
            <aside className="hidden lg:flex lg:flex-col w-72 bg-white dark:bg-slate-900 border-r border-border/40 p-6 justify-between fixed h-full z-20">
                <div>
                    {/* Brand */}
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-extrabold text-sm shadow-lg shadow-primary/20">
                            K
                        </div>
                        <div>
                            <h2 className="font-extrabold text-sm tracking-tight">KNCCI Admin</h2>
                            <p className="text-[10px] text-muted-foreground font-medium">Uasin Gishu Chapter</p>
                        </div>
                    </div>

                    {/* Nav Items */}
                    <nav className="space-y-1">
                        {[
                            { key: "overview", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
                            { key: "members", label: "Members", icon: <Users className="w-4 h-4" /> },
                        ].map((item) => (
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

                    {/* Return to Home */}
                    <div className="mt-6 pt-6 border-t border-border/30">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
                            onClick={() => setLocation('/')}
                        >
                            <Home className="w-4 h-4 mr-3" /> Return to Home
                        </Button>
                    </div>
                </div>

                {/* User & Logout */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                        <Avatar className="w-9 h-9">
                            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                                {user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold truncate">{user?.name}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-sm font-bold text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                        onClick={logout}
                    >
                        <LogOut className="w-4 h-4 mr-2" /> Log Out
                    </Button>
                </div>
            </aside>

            {/* ──── Main Content ─────────────────────────────────────────── */}
            <main className="flex-1 lg:ml-72">
                {/* Mobile Header */}
                <div className="lg:hidden flex items-center justify-between p-4 border-b border-border/40 bg-white dark:bg-slate-900 sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-extrabold text-xs">K</div>
                        <h2 className="font-extrabold text-sm">Admin Panel</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="h-9">
                                <TabsTrigger value="overview" className="text-xs px-3 h-7"><BarChart3 className="w-3.5 h-3.5" /></TabsTrigger>
                                <TabsTrigger value="members" className="text-xs px-3 h-7"><Users className="w-3.5 h-3.5" /></TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <Button variant="ghost" size="icon" onClick={() => setLocation('/')} title="Return to Home">
                            <Home className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500" onClick={logout}>
                            <LogOut className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
                    {/* ─── Header ───────────────────────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">
                            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                        </p>
                        <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
                            {activeTab === "overview" ? "Dashboard Overview" : "Member Management"}
                        </h1>
                    </motion.div>

                    {/* ═══ OVERVIEW TAB ═══════════════════════════════════ */}
                    {activeTab === "overview" && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-8"
                        >
                            {/* Stat Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                                {statCards.map((card, i) => (
                                    <motion.div
                                        key={card.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.08, duration: 0.4 }}
                                    >
                                        <Card className="relative overflow-hidden border-border/40 hover:shadow-lg transition-shadow duration-300 group">
                                            <div className={`absolute top-0 right-0 w-24 h-24 ${card.bgGlow} rounded-full -translate-y-6 translate-x-6 blur-2xl group-hover:scale-150 transition-transform duration-500`} />
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white shadow-lg`}>
                                                        {card.icon}
                                                    </div>
                                                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                                                </div>
                                                <p className="text-3xl font-extrabold tracking-tight">
                                                    {loadingStats ? "—" : card.value.toLocaleString()}
                                                </p>
                                                <p className="text-xs font-bold text-muted-foreground mt-1 uppercase tracking-wider">{card.title}</p>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Plan Distribution Chart (visual bar) */}
                            <Card className="border-border/40">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base font-extrabold flex items-center gap-2">
                                        <Activity className="w-4 h-4 text-primary" /> Plan Distribution
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4 space-y-5">
                                    {[
                                        { label: "Gold", count: goldCount, color: "bg-gradient-to-r from-amber-400 to-yellow-500", textColor: "text-amber-600" },
                                        { label: "Silver", count: silverCount, color: "bg-gradient-to-r from-slate-300 to-slate-400", textColor: "text-slate-500" },
                                        { label: "Bronze", count: bronzeCount, color: "bg-gradient-to-r from-orange-400 to-amber-500", textColor: "text-orange-600" },
                                    ].map((plan) => {
                                        const pct = totalMembers > 0 ? Math.round((plan.count / totalMembers) * 100) : 0;
                                        return (
                                            <div key={plan.label} className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-bold">{plan.label}</span>
                                                    <span className={`text-sm font-extrabold ${plan.textColor}`}>{plan.count} <span className="text-muted-foreground font-medium">({pct}%)</span></span>
                                                </div>
                                                <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                                    <motion.div
                                                        className={`h-full rounded-full ${plan.color}`}
                                                        initial={{ width: "0%" }}
                                                        animate={{ width: `${pct}%` }}
                                                        transition={{ duration: 1, delay: 0.3 }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </CardContent>
                            </Card>

                            {/* Quick Actions */}
                            <Card className="border-border/40">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base font-extrabold flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-primary" /> Quick Actions
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <Button
                                            variant="outline"
                                            className="h-auto p-5 flex flex-col items-center gap-3 rounded-2xl border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all"
                                            onClick={() => setActiveTab("members")}
                                        >
                                            <Users className="w-6 h-6 text-primary" />
                                            <div className="text-center">
                                                <p className="text-sm font-bold">View Members</p>
                                                <p className="text-[10px] text-muted-foreground">Browse & manage</p>
                                            </div>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="h-auto p-5 flex flex-col items-center gap-3 rounded-2xl border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all"
                                            onClick={() => { setActiveTab("members"); setRoleFilter("admin"); }}
                                        >
                                            <Shield className="w-6 h-6 text-purple-500" />
                                            <div className="text-center">
                                                <p className="text-sm font-bold">Admin Users</p>
                                                <p className="text-[10px] text-muted-foreground">View admin accounts</p>
                                            </div>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="h-auto p-5 flex flex-col items-center gap-3 rounded-2xl border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all"
                                            onClick={() => { setActiveTab("members"); setPlanFilter("Gold"); }}
                                        >
                                            <Crown className="w-6 h-6 text-amber-500" />
                                            <div className="text-center">
                                                <p className="text-sm font-bold">Gold Members</p>
                                                <p className="text-[10px] text-muted-foreground">Premium members</p>
                                            </div>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* ═══ MEMBERS TAB ════════════════════════════════════ */}
                    {activeTab === "members" && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            {/* Filters Bar */}
                            <Card className="border-border/40">
                                <CardContent className="p-4">
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Search by name, email, or reg number..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-10 h-11 rounded-xl border-border/50"
                                            />
                                        </div>
                                        <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setCurrentPage(1); }}>
                                            <SelectTrigger className="w-full sm:w-40 h-11 rounded-xl border-border/50">
                                                <SelectValue placeholder="Role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Roles</SelectItem>
                                                <SelectItem value="member">Members</SelectItem>
                                                <SelectItem value="admin">Admins</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Select value={planFilter} onValueChange={(v) => { setPlanFilter(v); setCurrentPage(1); }}>
                                            <SelectTrigger className="w-full sm:w-40 h-11 rounded-xl border-border/50">
                                                <SelectValue placeholder="Plan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Plans</SelectItem>
                                                <SelectItem value="Gold">Gold</SelectItem>
                                                <SelectItem value="Silver">Silver</SelectItem>
                                                <SelectItem value="Bronze">Bronze</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Members Table */}
                            <Card className="border-border/40 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-slate-50/50 dark:bg-slate-900/50">
                                                <TableHead className="font-extrabold text-xs uppercase tracking-wider">Member</TableHead>
                                                <TableHead className="font-extrabold text-xs uppercase tracking-wider">Reg No.</TableHead>
                                                <TableHead className="font-extrabold text-xs uppercase tracking-wider">Role</TableHead>
                                                <TableHead className="font-extrabold text-xs uppercase tracking-wider">Business</TableHead>
                                                <TableHead className="font-extrabold text-xs uppercase tracking-wider">Plan</TableHead>
                                                <TableHead className="font-extrabold text-xs uppercase tracking-wider text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {loadingMembers ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="h-40 text-center">
                                                        <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
                                                        <p className="text-sm text-muted-foreground mt-2">Loading members...</p>
                                                    </TableCell>
                                                </TableRow>
                                            ) : !members?.members?.length ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="h-40 text-center">
                                                        <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                                        <p className="text-sm font-bold text-muted-foreground">No members found</p>
                                                        <p className="text-xs text-muted-foreground">Try adjusting your search or filters</p>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                members.members.map((member, i) => (
                                                    <motion.tr
                                                        key={member._id}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: i * 0.03 }}
                                                        className="border-b border-border/30 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors group"
                                                    >
                                                        <TableCell>
                                                            <div className="flex items-center gap-3">
                                                                <Avatar className="w-9 h-9">
                                                                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-[10px]">
                                                                        {member.name?.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <p className="text-sm font-bold">{member.name}</p>
                                                                    <p className="text-[11px] text-muted-foreground">{member.email}</p>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className="text-xs font-mono font-bold text-muted-foreground">{member.reg_no}</span>
                                                        </TableCell>
                                                        <TableCell><RoleBadge role={member.role} /></TableCell>
                                                        <TableCell>
                                                            {member.business ? (
                                                                <span className="text-sm font-medium">{member.business.name}</span>
                                                            ) : (
                                                                <span className="text-xs text-muted-foreground italic">No business</span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {member.business ? (
                                                                <PlanBadge plan={member.business.plan} />
                                                            ) : (
                                                                <span className="text-xs text-muted-foreground">—</span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="w-8 h-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                                                                    title="View Details"
                                                                    onClick={() => openDetail(member)}
                                                                >
                                                                    <Eye className="w-4 h-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="w-8 h-8 text-purple-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/30"
                                                                    title={member.role === "admin" ? "Demote to Member" : "Promote to Admin"}
                                                                    onClick={() => handleRoleToggle(member)}
                                                                    disabled={actionLoading}
                                                                >
                                                                    <UserCog className="w-4 h-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="w-8 h-8 text-orange-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/30"
                                                                    title="Reset Password"
                                                                    onClick={() => setResetPwTarget(member)}
                                                                >
                                                                    <KeyRound className="w-4 h-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="w-8 h-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                                                                    title="Delete Member"
                                                                    onClick={() => setDeleteTarget(member)}
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </motion.tr>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Pagination */}
                                {members && members.pagination.totalPages > 1 && (
                                    <div className="flex items-center justify-between px-6 py-4 border-t border-border/30">
                                        <p className="text-xs text-muted-foreground font-medium">
                                            Showing <span className="font-bold text-foreground">{((currentPage - 1) * pageLimit) + 1}–{Math.min(currentPage * pageLimit, members.pagination.total)}</span> of <span className="font-bold text-foreground">{members.pagination.total}</span>
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={currentPage <= 1}
                                                onClick={() => setCurrentPage((p) => p - 1)}
                                                className="h-8 px-3 rounded-lg"
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </Button>
                                            <span className="text-sm font-bold px-2">
                                                {currentPage} / {members.pagination.totalPages}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={currentPage >= members.pagination.totalPages}
                                                onClick={() => setCurrentPage((p) => p + 1)}
                                                className="h-8 px-3 rounded-lg"
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        </motion.div>
                    )}
                </div>
            </main>

            {/* ════════════════════════════════════════════════════════════ */}
            {/* ──── MODALS ───────────────────────────────────────────────  */}
            {/* ════════════════════════════════════════════════════════════ */}

            {/* ─── Member Detail Dialog ──────────────────────────────────  */}
            <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
                <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-extrabold flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                                    {selectedMember?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                                </AvatarFallback>
                            </Avatar>
                            {selectedMember?.name}
                        </DialogTitle>
                        <DialogDescription>Full member and business details</DialogDescription>
                    </DialogHeader>

                    {selectedMember && (
                        <div className="space-y-6 mt-4">
                            {/* Personal Info */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-extrabold uppercase tracking-[0.2em] text-muted-foreground">Personal Information</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900">
                                        <Mail className="w-4 h-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-[10px] text-muted-foreground font-bold uppercase">Email</p>
                                            <p className="text-sm font-medium">{selectedMember.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900">
                                        <Phone className="w-4 h-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-[10px] text-muted-foreground font-bold uppercase">Phone</p>
                                            <p className="text-sm font-medium">{selectedMember.phone || "N/A"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900">
                                        <Shield className="w-4 h-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-[10px] text-muted-foreground font-bold uppercase">Role</p>
                                            <RoleBadge role={selectedMember.role} />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900">
                                        <Users className="w-4 h-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-[10px] text-muted-foreground font-bold uppercase">Reg No.</p>
                                            <p className="text-sm font-mono font-bold">{selectedMember.reg_no}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Business Info */}
                            {selectedMember.business && (
                                <div className="space-y-3">
                                    <h4 className="text-xs font-extrabold uppercase tracking-[0.2em] text-muted-foreground">Business Profile</h4>
                                    <div className="p-5 rounded-2xl border border-border/40 bg-white dark:bg-slate-900/50 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                                    <Building2 className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-bold">{selectedMember.business.name}</p>
                                                    <p className="text-xs text-muted-foreground">{selectedMember.business.category}</p>
                                                </div>
                                            </div>
                                            <PlanBadge plan={selectedMember.business.plan} />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                            {selectedMember.business.location && (
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <MapPin className="w-3.5 h-3.5" /> {selectedMember.business.location}
                                                </div>
                                            )}
                                            {selectedMember.business.email && (
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Mail className="w-3.5 h-3.5" /> {selectedMember.business.email}
                                                </div>
                                            )}
                                            {selectedMember.business.phone && (
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Phone className="w-3.5 h-3.5" /> {selectedMember.business.phone}
                                                </div>
                                            )}
                                            {selectedMember.business.website && (
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Globe className="w-3.5 h-3.5" /> {selectedMember.business.website}
                                                </div>
                                            )}
                                        </div>

                                        {selectedMember.business.description && (
                                            <p className="text-sm text-muted-foreground leading-relaxed">{selectedMember.business.description}</p>
                                        )}

                                        {selectedMember.business.services && selectedMember.business.services.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {selectedMember.business.services.map((s) => (
                                                    <Badge key={s} variant="secondary" className="text-[10px] font-bold">{s}</Badge>
                                                ))}
                                            </div>
                                        )}

                                        {/* Plan change inline */}
                                        <div className="pt-3 border-t border-border/30">
                                            <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground mb-2">Change Plan</p>
                                            <div className="flex gap-2">
                                                {(["Bronze", "Silver", "Gold"] as const).map((plan) => (
                                                    <Button
                                                        key={plan}
                                                        size="sm"
                                                        variant={selectedMember.business?.plan === plan ? "default" : "outline"}
                                                        className="text-xs rounded-lg"
                                                        onClick={() => handlePlanUpdate(selectedMember._id, plan)}
                                                        disabled={actionLoading || selectedMember.business?.plan === plan}
                                                    >
                                                        {plan}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Quick actions in detail modal */}
                            <div className="flex flex-wrap gap-2 pt-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-xs rounded-lg gap-1.5"
                                    onClick={() => { handleRoleToggle(selectedMember); setDetailOpen(false); }}
                                    disabled={actionLoading}
                                >
                                    <UserCog className="w-3.5 h-3.5" />
                                    {selectedMember.role === "admin" ? "Demote to Member" : "Promote to Admin"}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-xs rounded-lg gap-1.5"
                                    onClick={() => { setResetPwTarget(selectedMember); setDetailOpen(false); }}
                                >
                                    <KeyRound className="w-3.5 h-3.5" /> Reset Password
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-xs rounded-lg gap-1.5 text-red-500 hover:text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/20"
                                    onClick={() => { setDeleteTarget(selectedMember); setDetailOpen(false); }}
                                >
                                    <Trash2 className="w-3.5 h-3.5" /> Delete Member
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* ─── Reset Password Dialog ─────────────────────────────────  */}
            <Dialog open={!!resetPwTarget} onOpenChange={(open) => { if (!open) { setResetPwTarget(null); setNewPassword(""); } }}>
                <DialogContent className="max-w-md rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="font-extrabold flex items-center gap-2">
                            <KeyRound className="w-5 h-5 text-orange-500" /> Reset Password
                        </DialogTitle>
                        <DialogDescription>
                            Set a new password for <span className="font-bold">{resetPwTarget?.name}</span>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-2">
                        <Input
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="h-12 rounded-xl"
                        />
                        <p className="text-[10px] text-muted-foreground">
                            Password must be at least 8 characters with one uppercase letter and one number.
                        </p>
                    </div>
                    <DialogFooter className="mt-4">
                        <Button variant="ghost" onClick={() => { setResetPwTarget(null); setNewPassword(""); }}>Cancel</Button>
                        <Button
                            onClick={handleResetPassword}
                            disabled={actionLoading || newPassword.length < 8}
                            className="rounded-xl"
                        >
                            {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Reset Password
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ─── Delete Confirmation ────────────────────────────────────  */}
            <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
                <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 font-extrabold">
                            <AlertTriangle className="w-5 h-5 text-red-500" /> Delete Member
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently remove <span className="font-bold">{deleteTarget?.name}</span> and all their associated data, including their business profile. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-500 hover:bg-red-600 text-white rounded-xl"
                            disabled={actionLoading}
                        >
                            {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Yes, Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
