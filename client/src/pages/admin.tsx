import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
    Users, BarChart3, Shield, Search, ChevronLeft, ChevronRight,
    LogOut, Crown, Medal, Award, Trash2, KeyRound, UserCog,
    Building2, Mail, Phone, MapPin, Globe, Eye, X, Home,
    TrendingUp, Activity, LayoutDashboard, ChevronDown,
    AlertTriangle, Loader2, FileText, MessageSquare, Send,
    Plus, Pencil, Clock, CheckCircle2, XCircle, Smartphone,
    AtSign, UserPlus, FileEdit, Upload,
    User,
    CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
import { messagingService, MessageTemplate, MessageLogEntry, MessageChannel, MessagingStats, PaginatedLogs, MessagingSettings } from "@/services/messaging-service";
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
    const [applications, setApplications] = useState<any[]>([]);
    const [loadingStats, setLoadingStats] = useState(true);
    const [loadingMembers, setLoadingMembers] = useState(true);
    const [loadingApplications, setLoadingApplications] = useState(true);

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
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<any>({});
    const [fileUploading, setFileUploading] = useState<{ logo: boolean; certificate: boolean }>({ logo: false, certificate: false });

    // Application Modals
    const [selectedApplication, setSelectedApplication] = useState<any>(null);
    const [appDetailOpen, setAppDetailOpen] = useState(false);
    const [appEditForm, setAppEditForm] = useState<any>({});
    const [isAppEditing, setIsAppEditing] = useState(false);

    // Active sidebar item
    const [activeTab, setActiveTab] = useState("overview");

    // ─── Messaging state ────────────────────────────────────────────
    const [msgSubTab, setMsgSubTab] = useState<"compose" | "templates" | "logs" | "settings">("compose");
    const [msgSettings, setMsgSettings] = useState<MessagingSettings | null>(null);
    const [msgLoadingSettings, setMsgLoadingSettings] = useState(false);
    const [msgSavingSettings, setMsgSavingSettings] = useState(false);
    const [msgChannel, setMsgChannel] = useState<MessageChannel>("sms");
    const [msgRecipientMode, setMsgRecipientMode] = useState<"all" | "select" | "manual">("all");
    const [msgManualRecipients, setMsgManualRecipients] = useState("");
    const [msgSelectedMemberIds, setMsgSelectedMemberIds] = useState<string[]>([]);
    const [msgSubject, setMsgSubject] = useState("");
    const [msgBody, setMsgBody] = useState("");
    const [msgSending, setMsgSending] = useState(false);
    const [msgTemplates, setMsgTemplates] = useState<MessageTemplate[]>([]);
    const [msgLoadingTemplates, setMsgLoadingTemplates] = useState(false);
    const [msgLogs, setMsgLogs] = useState<PaginatedLogs | null>(null);
    const [msgLogsPage, setMsgLogsPage] = useState(1);
    const [msgLoadingLogs, setMsgLoadingLogs] = useState(false);
    const [msgStats, setMsgStats] = useState<MessagingStats | null>(null);
    const [msgAllMembers, setMsgAllMembers] = useState<MemberDoc[]>([]);
    const [msgMemberSearch, setMsgMemberSearch] = useState("");
    // Template editor
    const [tplEditOpen, setTplEditOpen] = useState(false);
    const [tplEditing, setTplEditing] = useState<MessageTemplate | null>(null);
    const [tplName, setTplName] = useState("");
    const [tplChannel, setTplChannel] = useState<MessageChannel>("sms");
    const [tplSubject, setTplSubject] = useState("");
    const [tplBody, setTplBody] = useState("");
    const [tplSaving, setTplSaving] = useState(false);
    const [msgLogsChannelFilter, setMsgLogsChannelFilter] = useState<string>("all");
    const [msgLogsStatusFilter, setMsgLogsStatusFilter] = useState<string>("all");

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

    // ─── Fetch applications ───────────────────────────────────────────
    const fetchApplications = useCallback(async () => {
        try {
            setLoadingApplications(true);
            const res = await adminService.getApplications();
            if (res.success) setApplications(res.data);
        } catch (err: any) {
            toast({ title: "Error", description: err.response?.data?.message || "Failed to load applications", variant: "destructive" });
        } finally {
            setLoadingApplications(false);
        }
    }, [toast]);

    useEffect(() => { fetchApplications(); }, [fetchApplications]);

    // ─── Messaging data fetchers ────────────────────────────────────
    const fetchMsgTemplates = useCallback(async () => {
        try {
            setMsgLoadingTemplates(true);
            const res = await messagingService.getTemplates();
            if (res.success) setMsgTemplates(res.data);
        } catch { /* quiet */ } finally { setMsgLoadingTemplates(false); }
    }, []);

    const fetchMsgLogs = useCallback(async () => {
        try {
            setMsgLoadingLogs(true);
            const params: any = { page: msgLogsPage, limit: 15 };
            if (msgLogsChannelFilter !== "all") params.channel = msgLogsChannelFilter;
            if (msgLogsStatusFilter !== "all") params.status = msgLogsStatusFilter;
            const res = await messagingService.getLogs(params);
            if (res.success) setMsgLogs(res.data);
        } catch { /* quiet */ } finally { setMsgLoadingLogs(false); }
    }, [msgLogsPage, msgLogsChannelFilter, msgLogsStatusFilter]);

    const fetchMsgStats = useCallback(async () => {
        try {
            const res = await messagingService.getStats();
            if (res.success) setMsgStats(res.data);
        } catch { /* quiet */ }
    }, []);

    const fetchMsgSettings = useCallback(async () => {
        try {
            setMsgLoadingSettings(true);
            const res = await messagingService.getSettings();
            if (res.success) setMsgSettings(res.data);
        } catch { /* quiet */ } finally { setMsgLoadingSettings(false); }
    }, []);

    const fetchAllMembersForMessaging = useCallback(async () => {
        try {
            const res = await adminService.getMembers({ page: 1, limit: 500 });
            if (res.success) setMsgAllMembers(res.data.members);
        } catch { /* quiet */ }
    }, []);

    useEffect(() => {
        if (activeTab === "messaging") {
            fetchMsgTemplates();
            fetchMsgLogs();
            fetchMsgStats();
            fetchMsgSettings();
            fetchAllMembersForMessaging();
        }
    }, [activeTab, fetchMsgTemplates, fetchMsgLogs, fetchMsgStats, fetchMsgSettings, fetchAllMembersForMessaging]);

    const handleSaveSettings = async (payload: Partial<MessagingSettings>) => {
        setMsgSavingSettings(true);
        try {
            const res = await messagingService.updateSettings(payload);
            if (res.success) {
                setMsgSettings(res.data);
                toast({ title: "Settings Saved", description: "Messaging configuration updated successfully." });
            }
        } catch (err: any) {
            toast({ title: "Save Failed", description: err.response?.data?.message || "Failed to save settings", variant: "destructive" });
        } finally { setMsgSavingSettings(false); }
    };

    // ─── Send message handler ───────────────────────────────────────
    const handleSendMessage = async () => {
        let recipients: string[] = [];
        if (msgRecipientMode === "all") {
            recipients = msgAllMembers.map(m => msgChannel === "sms" ? (m.phone || "") : m.email).filter(Boolean);
        } else if (msgRecipientMode === "select") {
            recipients = msgAllMembers
                .filter(m => msgSelectedMemberIds.includes(m._id))
                .map(m => msgChannel === "sms" ? (m.phone || "") : m.email)
                .filter(Boolean);
        } else {
            recipients = msgManualRecipients.split(/[,;\n]+/).map(s => s.trim()).filter(Boolean);
        }
        if (recipients.length === 0) {
            toast({ title: "No Recipients", description: "Please add at least one recipient.", variant: "destructive" });
            return;
        }
        if (!msgBody.trim()) {
            toast({ title: "Empty Message", description: "Please enter a message body.", variant: "destructive" });
            return;
        }
        setMsgSending(true);
        try {
            const res = await messagingService.sendMessage({
                type: msgChannel,
                to: recipients,
                message: msgBody,
                subject: msgChannel === "email" ? msgSubject : undefined,
            });
            if (res.success) {
                toast({ title: "Messages Sent", description: `${res.data.sent} sent, ${res.data.failed} failed out of ${res.data.totalRecipients}.` });
                setMsgBody(""); setMsgSubject(""); setMsgManualRecipients(""); setMsgSelectedMemberIds([]);
                fetchMsgLogs(); fetchMsgStats();
            }
        } catch (err: any) {
            toast({ title: "Send Failed", description: err.response?.data?.message || "Failed to send messages", variant: "destructive" });
        } finally { setMsgSending(false); }
    };

    // ─── Template save handler ──────────────────────────────────────
    const handleSaveTemplate = async () => {
        if (!tplName.trim() || !tplBody.trim()) return;
        setTplSaving(true);
        try {
            if (tplEditing) {
                await messagingService.updateTemplate(tplEditing._id, { name: tplName, channel: tplChannel, subject: tplSubject, body: tplBody });
                toast({ title: "Template Updated" });
            } else {
                await messagingService.createTemplate({ name: tplName, channel: tplChannel, subject: tplSubject, body: tplBody });
                toast({ title: "Template Created" });
            }
            setTplEditOpen(false); setTplEditing(null); setTplName(""); setTplChannel("sms"); setTplSubject(""); setTplBody("");
            fetchMsgTemplates();
        } catch (err: any) {
            toast({ title: "Error", description: err.response?.data?.message || "Failed to save template", variant: "destructive" });
        } finally { setTplSaving(false); }
    };

    const handleDeleteTemplate = async (id: string) => {
        try {
            await messagingService.deleteTemplate(id);
            toast({ title: "Template Deleted" });
            fetchMsgTemplates();
        } catch { toast({ title: "Error", description: "Failed to delete template", variant: "destructive" }); }
    };

    const openEditTemplate = (tpl: MessageTemplate) => {
        setTplEditing(tpl); setTplName(tpl.name); setTplChannel(tpl.channel); setTplSubject(tpl.subject || ""); setTplBody(tpl.body);
        setTplEditOpen(true);
    };

    const applyTemplate = (tpl: MessageTemplate) => {
        setMsgChannel(tpl.channel);
        setMsgBody(tpl.body);
        if (tpl.subject) setMsgSubject(tpl.subject);
        setMsgSubTab("compose");
        toast({ title: "Template Applied", description: `"${tpl.name}" loaded into composer.` });
    };

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

    const handleApplicationStatus = async (id: string, status: string) => {
        setActionLoading(true);
        try {
            await adminService.updateApplicationStatus(id, status);
            toast({ title: "Status Updated", description: `Application is now ${status}.` });
            fetchApplications();
        } catch (err: any) {
            toast({ title: "Error", description: err.response?.data?.message || "Failed to update status", variant: "destructive" });
        } finally {
            setActionLoading(false);
        }
    };

    const handleApplicationDelete = async (id: string) => {
        setActionLoading(true);
        try {
            await adminService.deleteApplication(id);
            toast({ title: "Application Deleted", description: "The membership application has been removed." });
            fetchApplications();
        } catch (err: any) {
            toast({ title: "Error", description: err.response?.data?.message || "Failed to delete application", variant: "destructive" });
        } finally {
            setActionLoading(false);
        }
    };

    const handleSaveApplication = async () => {
        if (!selectedApplication) return;
        setActionLoading(true);
        try {
            const res = await adminService.updateApplication(selectedApplication._id, appEditForm);
            if (res.success) {
                setSelectedApplication({ ...selectedApplication, ...appEditForm });
                setIsAppEditing(false);
                toast({ title: "Application Updated", description: "Details have been saved." });
                fetchApplications();
            }
        } catch (err: any) {
            toast({ title: "Error", description: err.response?.data?.message || "Failed to update application", variant: "destructive" });
        } finally {
            setActionLoading(false);
        }
    };

    const openAppDetail = (app: any) => {
        setSelectedApplication(app);
        setAppEditForm({
            paymentMethod: app.paymentMethod || "Not Set",
            paymentStatus: app.paymentStatus || "Pending",
            amountToPay: app.amountToPay || 0,
        });
        setIsAppEditing(false);
        setAppDetailOpen(true);
    };

    const handleSaveProfile = async () => {
        if (!selectedMember) return;
        setActionLoading(true);
        try {
            const res = await adminService.updateMemberProfile(selectedMember._id, editForm);
            if (res.success) {
                setSelectedMember(res.data);
                setIsEditing(false);
                toast({ title: "Profile Updated", description: "Member details have been saved." });
                fetchMembers();
            }
        } catch (err: any) {
            toast({ title: "Error", description: err.response?.data?.message || "Failed to update profile", variant: "destructive" });
        } finally {
            setActionLoading(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'certificate') => {
        const file = e.target.files?.[0];
        if (!file || !selectedMember) return;

        setFileUploading(prev => ({ ...prev, [type]: true }));
        try {
            const res = await adminService.uploadFile(selectedMember._id, type, file);
            if (res.success) {
                toast({ title: `${type === 'logo' ? 'Logo' : 'Certificate'} Uploaded` });
                // Refresh member data
                const updated = await adminService.getMember(selectedMember._id);
                if (updated.success) setSelectedMember(updated.data);
                fetchMembers();
            }
        } catch (err: any) {
            toast({ title: "Upload Failed", description: err.response?.data?.message || "File upload failed", variant: "destructive" });
        } finally {
            setFileUploading(prev => ({ ...prev, [type]: false }));
        }
    };

    const openDetail = async (member: MemberDoc) => {
        setIsEditing(false);
        try {
            const res = await adminService.getMember(member._id);
            if (res.success) {
                setSelectedMember(res.data);
                setEditForm({
                    name: res.data.name,
                    email: res.data.email,
                    phone: res.data.phone || "",
                    reg_no: res.data.reg_no,
                    name_biz: res.data.business?.name || "",
                    category: res.data.business?.category || "",
                    location: res.data.business?.location || "",
                    website: res.data.business?.website || "",
                    description: res.data.business?.description || "",
                });
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
                            { key: "applications", label: "Applications", icon: <FileText className="w-4 h-4" /> },
                            { key: "messaging", label: "Messaging", icon: <MessageSquare className="w-4 h-4" /> },
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
                                <TabsTrigger value="applications" className="text-xs px-3 h-7"><FileText className="w-3.5 h-3.5" /></TabsTrigger>
                                <TabsTrigger value="messaging" className="text-xs px-3 h-7"><MessageSquare className="w-3.5 h-3.5" /></TabsTrigger>
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
                            {activeTab === "overview" ? "Dashboard Overview" : activeTab === "members" ? "Member Management" : activeTab === "applications" ? "Application Management" : "Messaging Center"}
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

                    {/* ═══ APPLICATIONS TAB ═══════════════════════════════ */}
                    {activeTab === "applications" && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            <Card className="border-border/40 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-slate-50/50 dark:bg-slate-900/50">
                                                <TableHead className="font-extrabold text-xs uppercase tracking-wider">Applicant</TableHead>
                                                <TableHead className="font-extrabold text-xs uppercase tracking-wider">Business</TableHead>
                                                <TableHead className="font-extrabold text-xs uppercase tracking-wider">Location</TableHead>
                                                <TableHead className="font-extrabold text-xs uppercase tracking-wider">Status</TableHead>
                                                <TableHead className="font-extrabold text-xs uppercase tracking-wider text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {loadingApplications ? (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="h-40 text-center">
                                                        <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
                                                        <p className="text-sm text-muted-foreground mt-2">Loading applications...</p>
                                                    </TableCell>
                                                </TableRow>
                                            ) : applications.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="h-40 text-center">
                                                        <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                                        <p className="text-sm font-bold text-muted-foreground">No applications found</p>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                applications.map((app, i) => (
                                                    <motion.tr
                                                        key={app._id}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: i * 0.03 }}
                                                        className="border-b border-border/30 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors group"
                                                    >
                                                        <TableCell>
                                                            <div>
                                                                <p className="text-sm font-bold">{app.name}</p>
                                                                <p className="text-[11px] text-muted-foreground">{app.email}</p>
                                                                <p className="text-[11px] text-muted-foreground">{app.contact}</p>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <p className="text-sm font-medium">{app.businessName}</p>
                                                            <p className="text-[11px] text-muted-foreground">{app.businessClass}</p>
                                                        </TableCell>
                                                        <TableCell>
                                                            <p className="text-xs">{app.location}</p>
                                                            <p className="text-[10px] text-muted-foreground">{app.subCounty}</p>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant={app.status === 'pending' ? 'outline' : app.status === 'approved' ? 'default' : 'destructive'}>
                                                                {app.status}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center justify-end gap-1">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                                                                    onClick={() => openAppDetail(app)}
                                                                    title="View Details"
                                                                >
                                                                    <Eye className="w-4 h-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50"
                                                                    onClick={() => handleApplicationStatus(app._id, 'approved')}
                                                                    disabled={actionLoading || app.status === 'approved'}
                                                                >
                                                                    Approve
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="text-amber-500 hover:text-amber-600 hover:bg-amber-50"
                                                                    onClick={() => handleApplicationStatus(app._id, 'rejected')}
                                                                    disabled={actionLoading || app.status === 'rejected'}
                                                                >
                                                                    Reject
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                                    onClick={() => handleApplicationDelete(app._id)}
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
                            </Card>
                        </motion.div>
                    )}

                    {/* ═══ MESSAGING TAB ═══════════════════════════════════ */}
                    {activeTab === "messaging" && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            {/* Stats Row */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {[
                                    { label: "Total Sent", value: msgStats?.totalSent ?? 0, icon: <CheckCircle2 className="w-4 h-4" />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                                    { label: "Failed", value: msgStats?.totalFailed ?? 0, icon: <XCircle className="w-4 h-4" />, color: "text-red-500", bg: "bg-red-500/10" },
                                    { label: "SMS Sent", value: msgStats?.totalSms ?? 0, icon: <Smartphone className="w-4 h-4" />, color: "text-blue-500", bg: "bg-blue-500/10" },
                                    { label: "Emails Sent", value: msgStats?.totalEmail ?? 0, icon: <Mail className="w-4 h-4" />, color: "text-purple-500", bg: "bg-purple-500/10" },
                                ].map((s, i) => (
                                    <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                                        <Card className="border-border/40">
                                            <CardContent className="p-4 flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center ${s.color}`}>{s.icon}</div>
                                                <div>
                                                    <p className="text-xl font-extrabold">{s.value}</p>
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{s.label}</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Sub-tab nav */}
                            <div className="flex gap-2">
                                {[
                                    { key: "compose" as const, label: "Compose", icon: <Send className="w-3.5 h-3.5" /> },
                                    { key: "templates" as const, label: "Templates", icon: <FileEdit className="w-3.5 h-3.5" /> },
                                    { key: "logs" as const, label: "History", icon: <Clock className="w-3.5 h-3.5" /> },
                                    { key: "settings" as const, label: "Settings", icon: <UserCog className="w-3.5 h-3.5" /> },
                                ].map(t => (
                                    <Button
                                        key={t.key}
                                        variant={msgSubTab === t.key ? "default" : "outline"}
                                        size="sm"
                                        className="text-xs rounded-xl gap-1.5 font-bold"
                                        onClick={() => setMsgSubTab(t.key)}
                                    >
                                        {t.icon} {t.label}
                                    </Button>
                                ))}
                            </div>

                            {/* ── COMPOSE ─────────────────────────────────── */}
                            {msgSubTab === "compose" && (
                                <Card className="border-border/40">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-base font-extrabold flex items-center gap-2">
                                            <Send className="w-4 h-4 text-primary" /> Compose Message
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-5">
                                        {/* Channel */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Channel</label>
                                            <div className="flex gap-2">
                                                <Button variant={msgChannel === "sms" ? "default" : "outline"} size="sm" className="rounded-xl gap-1.5 text-xs font-bold" onClick={() => setMsgChannel("sms")}>
                                                    <Smartphone className="w-3.5 h-3.5" /> SMS
                                                </Button>
                                                <Button variant={msgChannel === "email" ? "default" : "outline"} size="sm" className="rounded-xl gap-1.5 text-xs font-bold" onClick={() => setMsgChannel("email")}>
                                                    <Mail className="w-3.5 h-3.5" /> Email
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Recipients */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Recipients</label>
                                            <div className="flex gap-2 flex-wrap">
                                                {([
                                                    { key: "all" as const, label: "All Members", icon: <Users className="w-3.5 h-3.5" /> },
                                                    { key: "select" as const, label: "Select Members", icon: <UserPlus className="w-3.5 h-3.5" /> },
                                                    { key: "manual" as const, label: "Manual Entry", icon: <AtSign className="w-3.5 h-3.5" /> },
                                                ]).map(r => (
                                                    <Button key={r.key} variant={msgRecipientMode === r.key ? "default" : "outline"} size="sm" className="rounded-xl gap-1.5 text-xs font-bold" onClick={() => setMsgRecipientMode(r.key)}>
                                                        {r.icon} {r.label}
                                                    </Button>
                                                ))}
                                            </div>

                                            {msgRecipientMode === "all" && (
                                                <p className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950/30 px-3 py-2 rounded-lg">
                                                    📤 Message will be sent to <span className="font-bold">{msgAllMembers.length}</span> members ({msgChannel === "sms" ? "phone numbers" : "email addresses"}).
                                                </p>
                                            )}

                                            {msgRecipientMode === "select" && (
                                                <div className="space-y-2">
                                                    <Input placeholder="Search members..." value={msgMemberSearch} onChange={e => setMsgMemberSearch(e.target.value)} className="h-9 rounded-xl text-xs" />
                                                    <div className="max-h-48 overflow-y-auto border border-border/40 rounded-xl p-2 space-y-1">
                                                        {msgAllMembers
                                                            .filter(m => m.name.toLowerCase().includes(msgMemberSearch.toLowerCase()) || m.email.toLowerCase().includes(msgMemberSearch.toLowerCase()))
                                                            .slice(0, 50)
                                                            .map(m => (
                                                                <label key={m._id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer text-xs">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={msgSelectedMemberIds.includes(m._id)}
                                                                        onChange={e => {
                                                                            if (e.target.checked) setMsgSelectedMemberIds(prev => [...prev, m._id]);
                                                                            else setMsgSelectedMemberIds(prev => prev.filter(id => id !== m._id));
                                                                        }}
                                                                        className="rounded"
                                                                    />
                                                                    <span className="font-bold">{m.name}</span>
                                                                    <span className="text-muted-foreground">— {msgChannel === "sms" ? (m.phone || "No phone") : m.email}</span>
                                                                </label>
                                                            ))}
                                                    </div>
                                                    <p className="text-[10px] text-muted-foreground">{msgSelectedMemberIds.length} selected</p>
                                                </div>
                                            )}

                                            {msgRecipientMode === "manual" && (
                                                <Textarea
                                                    placeholder={msgChannel === "sms" ? "Enter phone numbers separated by commas or new lines...\n254712345678, 254798765432" : "Enter email addresses separated by commas or new lines...\njohn@example.com, jane@example.com"}
                                                    value={msgManualRecipients}
                                                    onChange={e => setMsgManualRecipients(e.target.value)}
                                                    className="min-h-[80px] rounded-xl text-xs"
                                                />
                                            )}
                                        </div>

                                        {/* Quick template selector */}
                                        {msgTemplates.filter(t => t.channel === msgChannel).length > 0 && (
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Quick Template</label>
                                                <div className="flex gap-2 flex-wrap">
                                                    {msgTemplates.filter(t => t.channel === msgChannel).map(tpl => (
                                                        <Button key={tpl._id} variant="outline" size="sm" className="rounded-xl text-xs gap-1 font-bold" onClick={() => applyTemplate(tpl)}>
                                                            <FileEdit className="w-3 h-3" /> {tpl.name}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Subject (email only) */}
                                        {msgChannel === "email" && (
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Subject</label>
                                                <Input placeholder="Email subject line..." value={msgSubject} onChange={e => setMsgSubject(e.target.value)} className="h-11 rounded-xl" />
                                            </div>
                                        )}

                                        {/* Body */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Message</label>
                                            <Textarea placeholder="Type your message here..." value={msgBody} onChange={e => setMsgBody(e.target.value)} className="min-h-[120px] rounded-xl" />
                                            {msgChannel === "sms" && (
                                                <p className="text-[10px] text-muted-foreground">{msgBody.length} / 160 characters {msgBody.length > 160 ? `(${Math.ceil(msgBody.length / 153)} SMS segments)` : ""}</p>
                                            )}
                                        </div>

                                        {/* Send */}
                                        <Button onClick={handleSendMessage} disabled={msgSending || !msgBody.trim()} className="w-full h-12 rounded-xl font-extrabold text-sm gap-2">
                                            {msgSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                            {msgSending ? "Sending..." : `Send ${msgChannel.toUpperCase()}`}
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}

                            {/* ── TEMPLATES ───────────────────────────────── */}
                            {msgSubTab === "templates" && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-bold text-muted-foreground">{msgTemplates.length} templates</p>
                                        <Button size="sm" className="rounded-xl gap-1.5 text-xs font-bold" onClick={() => { setTplEditing(null); setTplName(""); setTplChannel("sms"); setTplSubject(""); setTplBody(""); setTplEditOpen(true); }}>
                                            <Plus className="w-3.5 h-3.5" /> New Template
                                        </Button>
                                    </div>

                                    {msgLoadingTemplates ? (
                                        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
                                    ) : msgTemplates.length === 0 ? (
                                        <Card className="border-border/40">
                                            <CardContent className="py-12 text-center">
                                                <FileEdit className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                                <p className="text-sm font-bold text-muted-foreground">No templates yet</p>
                                                <p className="text-xs text-muted-foreground">Create templates to speed up message composition</p>
                                            </CardContent>
                                        </Card>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {msgTemplates.map((tpl, i) => (
                                                <motion.div key={tpl._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                                                    <Card className="border-border/40 group hover:shadow-md transition-shadow">
                                                        <CardContent className="p-5 space-y-3">
                                                            <div className="flex items-start justify-between">
                                                                <div>
                                                                    <p className="font-bold text-sm">{tpl.name}</p>
                                                                    <Badge variant="outline" className="text-[10px] mt-1">
                                                                        {tpl.channel === "sms" ? <Smartphone className="w-3 h-3 mr-1" /> : <Mail className="w-3 h-3 mr-1" />}
                                                                        {tpl.channel.toUpperCase()}
                                                                    </Badge>
                                                                </div>
                                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => applyTemplate(tpl)} title="Use template">
                                                                        <Send className="w-3.5 h-3.5 text-primary" />
                                                                    </Button>
                                                                    <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => openEditTemplate(tpl)} title="Edit">
                                                                        <Pencil className="w-3.5 h-3.5 text-amber-500" />
                                                                    </Button>
                                                                    <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => handleDeleteTemplate(tpl._id)} title="Delete">
                                                                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                            {tpl.subject && <p className="text-xs text-muted-foreground"><span className="font-bold">Subject:</span> {tpl.subject}</p>}
                                                            <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">{tpl.body}</p>
                                                        </CardContent>
                                                    </Card>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ── LOGS ────────────────────────────────────── */}
                            {msgSubTab === "logs" && (
                                <div className="space-y-4">
                                    {/* Filters */}
                                    <Card className="border-border/40">
                                        <CardContent className="p-4">
                                            <div className="flex flex-col sm:flex-row gap-3">
                                                <Select value={msgLogsChannelFilter} onValueChange={v => { setMsgLogsChannelFilter(v); setMsgLogsPage(1); }}>
                                                    <SelectTrigger className="w-full sm:w-40 h-10 rounded-xl border-border/50">
                                                        <SelectValue placeholder="Channel" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">All Channels</SelectItem>
                                                        <SelectItem value="sms">SMS</SelectItem>
                                                        <SelectItem value="email">Email</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Select value={msgLogsStatusFilter} onValueChange={v => { setMsgLogsStatusFilter(v); setMsgLogsPage(1); }}>
                                                    <SelectTrigger className="w-full sm:w-40 h-10 rounded-xl border-border/50">
                                                        <SelectValue placeholder="Status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">All Statuses</SelectItem>
                                                        <SelectItem value="sent">Sent</SelectItem>
                                                        <SelectItem value="failed">Failed</SelectItem>
                                                        <SelectItem value="pending">Pending</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Logs table */}
                                    <Card className="border-border/40 overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="bg-slate-50/50 dark:bg-slate-900/50">
                                                        <TableHead className="font-extrabold text-xs uppercase tracking-wider">Channel</TableHead>
                                                        <TableHead className="font-extrabold text-xs uppercase tracking-wider">Recipient</TableHead>
                                                        <TableHead className="font-extrabold text-xs uppercase tracking-wider">Message</TableHead>
                                                        <TableHead className="font-extrabold text-xs uppercase tracking-wider">Status</TableHead>
                                                        <TableHead className="font-extrabold text-xs uppercase tracking-wider">Date</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {msgLoadingLogs ? (
                                                        <TableRow>
                                                            <TableCell colSpan={5} className="h-40 text-center">
                                                                <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
                                                                <p className="text-sm text-muted-foreground mt-2">Loading logs...</p>
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : !msgLogs?.logs?.length ? (
                                                        <TableRow>
                                                            <TableCell colSpan={5} className="h-40 text-center">
                                                                <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                                                <p className="text-sm font-bold text-muted-foreground">No message history</p>
                                                                <p className="text-xs text-muted-foreground">Messages you send will appear here</p>
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : (
                                                        msgLogs.logs.map((log, i) => (
                                                            <motion.tr
                                                                key={log._id}
                                                                initial={{ opacity: 0, x: -10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: i * 0.02 }}
                                                                className="border-b border-border/30 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors"
                                                            >
                                                                <TableCell>
                                                                    <Badge variant="outline" className="text-[10px] font-bold">
                                                                        {log.channel === "sms" ? <Smartphone className="w-3 h-3 mr-1" /> : <Mail className="w-3 h-3 mr-1" />}
                                                                        {log.channel.toUpperCase()}
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <p className="text-xs font-mono font-bold">{log.recipient}</p>
                                                                    {log.recipientName && <p className="text-[10px] text-muted-foreground">{log.recipientName}</p>}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <p className="text-xs text-muted-foreground line-clamp-2 max-w-xs">{log.message}</p>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${log.status === "sent" ? "bg-emerald-500/10 text-emerald-600" : log.status === "failed" ? "bg-red-500/10 text-red-600" : "bg-amber-500/10 text-amber-600"}`}>
                                                                        {log.status === "sent" ? <CheckCircle2 className="w-3 h-3" /> : log.status === "failed" ? <XCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                                                        {log.status}
                                                                    </span>
                                                                    {log.errorMessage && <p className="text-[10px] text-red-500 mt-0.5">{log.errorMessage}</p>}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <p className="text-xs text-muted-foreground">{new Date(log.createdAt).toLocaleString()}</p>
                                                                </TableCell>
                                                            </motion.tr>
                                                        ))
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>

                                        {/* Pagination */}
                                        {msgLogs && msgLogs.pagination.totalPages > 1 && (
                                            <div className="flex items-center justify-between px-6 py-4 border-t border-border/30">
                                                <p className="text-xs text-muted-foreground font-medium">
                                                    Page <span className="font-bold text-foreground">{msgLogs.pagination.page}</span> of <span className="font-bold text-foreground">{msgLogs.pagination.totalPages}</span>
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <Button variant="outline" size="sm" disabled={msgLogsPage <= 1} onClick={() => setMsgLogsPage(p => p - 1)} className="h-8 px-3 rounded-lg">
                                                        <ChevronLeft className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="outline" size="sm" disabled={msgLogsPage >= msgLogs.pagination.totalPages} onClick={() => setMsgLogsPage(p => p + 1)} className="h-8 px-3 rounded-lg">
                                                        <ChevronRight className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </Card>
                                </div>
                            )}

                            {/* ── SETTINGS ────────────────────────────────── */}
                            {msgSubTab === "settings" && (
                                <div className="space-y-6">
                                    <Card className="border-border/40">
                                        <CardHeader>
                                            <CardTitle className="text-base font-extrabold flex items-center gap-2">
                                                <KeyRound className="w-4 h-4 text-primary" /> API Configuration
                                            </CardTitle>
                                            <p className="text-xs text-muted-foreground">Configure the API settings used for sending notifications via Uniflow.</p>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            {msgLoadingSettings ? (
                                                <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
                                            ) : !msgSettings ? (
                                                <p className="text-sm text-center text-muted-foreground py-12">Failed to load settings.</p>
                                            ) : (
                                                <div className="space-y-6">
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-border/30">
                                                        <div className="space-y-1">
                                                            <p className="text-sm font-bold">Use Custom API Key</p>
                                                            <p className="text-[10px] text-muted-foreground">Toggle between system default and your own Uniflow API key.</p>
                                                        </div>
                                                        <Button
                                                            variant={msgSettings.useCustomApiKey ? "default" : "outline"}
                                                            size="sm"
                                                            className={`rounded-xl font-bold h-9 px-6 ${msgSettings.useCustomApiKey ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
                                                            onClick={() => handleSaveSettings({ useCustomApiKey: !msgSettings.useCustomApiKey })}
                                                            disabled={msgSavingSettings}
                                                        >
                                                            {msgSavingSettings ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : null}
                                                            {msgSettings.useCustomApiKey ? "Custom Key Active" : "Using System Default"}
                                                        </Button>
                                                    </div>

                                                    <AnimatePresence>
                                                        {msgSettings.useCustomApiKey && (
                                                            <motion.div
                                                                initial={{ opacity: 0, height: 0 }}
                                                                animate={{ opacity: 1, height: "auto" }}
                                                                exit={{ opacity: 0, height: 0 }}
                                                                className="space-y-4 overflow-hidden"
                                                            >
                                                                <div className="space-y-2">
                                                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Custom Uniflow API Key</label>
                                                                    <div className="relative">
                                                                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                                        <Input
                                                                            type="password"
                                                                            placeholder="Enter your API key..."
                                                                            value={msgSettings.customApiKey || ""}
                                                                            onChange={e => setMsgSettings({ ...msgSettings, customApiKey: e.target.value })}
                                                                            className="pl-10 h-11 rounded-xl"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-2">
                                                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Custom Base URL</label>
                                                                    <div className="relative">
                                                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                                        <Input
                                                                            placeholder="https://smsapi.solby.io:8443"
                                                                            value={msgSettings.customBaseUrl || ""}
                                                                            onChange={e => setMsgSettings({ ...msgSettings, customBaseUrl: e.target.value })}
                                                                            className="pl-10 h-11 rounded-xl"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <Button
                                                                    className="w-full h-11 rounded-xl font-bold gap-2"
                                                                    onClick={() => handleSaveSettings({ customApiKey: msgSettings.customApiKey, customBaseUrl: msgSettings.customBaseUrl })}
                                                                    disabled={msgSavingSettings}
                                                                >
                                                                    {msgSavingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                                                    Save API Credentials
                                                                </Button>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>

                                                    <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30">
                                                        <div className="flex gap-3">
                                                            <AlertTriangle className="w-5 h-5 text-blue-500 shrink-0" />
                                                            <div className="space-y-2">
                                                                <p className="text-xs font-bold text-blue-700 dark:text-blue-400">Default Configuration</p>
                                                                <p className="text-[10px] text-blue-600/80 dark:text-blue-400/70 leading-relaxed">
                                                                    When "Using System Default" is active, the application uses the API key configured in the server's environment variables. Custom credentials allow for independent billing or specific channel configurations.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>
            </main>

            {/* ════════════════════════════════════════════════════════════ */}
            {/* ──── MODALS ───────────────────────────────────────────────  */}
            {/* ════════════════════════════════════════════════════════════ */}

            {/* ─── Member Detail Dialog ──────────────────────────────────  */}
            <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-0 border-none bg-slate-50 dark:bg-slate-950">
                    <div className="sticky top-0 z-50 flex items-center justify-between p-6 bg-white dark:bg-slate-900 border-b border-border/40">
                        <div className="flex items-center gap-4">
                            <Avatar className="w-12 h-12 border-2 border-primary/10">
                                <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                                    {selectedMember?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <DialogTitle className="text-xl font-extrabold tracking-tight">
                                    {selectedMember?.name}
                                </DialogTitle>
                                <DialogDescription className="text-xs font-medium">Member ID: {selectedMember?._id}</DialogDescription>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={isEditing ? "default" : "outline"}
                                size="sm"
                                className="rounded-xl font-bold text-xs h-9 px-4"
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                {isEditing ? <X className="w-3.5 h-3.5 mr-2" /> : <Pencil className="w-3.5 h-3.5 mr-2" />}
                                {isEditing ? "Cancel" : "Edit Profile"}
                            </Button>
                            <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9" onClick={() => setDetailOpen(false)}>
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    <div className="p-6 space-y-8 pb-10">
                        {selectedMember && (
                            <div className="space-y-8">
                                {/* Personal Info Section */}
                                <section className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                            <Shield className="w-3 h-3" /> Personal Account Details
                                        </h4>
                                        {isEditing && (
                                            <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px] font-bold">Editing Mode</Badge>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Full Name</label>
                                            {isEditing ? (
                                                <Input
                                                    value={editForm.name}
                                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                    className="h-11 rounded-xl bg-white dark:bg-slate-900 border-border/50"
                                                />
                                            ) : (
                                                <div className="h-11 flex items-center px-4 rounded-xl bg-white dark:bg-slate-900 border border-border/20 font-medium text-sm">
                                                    {selectedMember.name}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Registration Number</label>
                                            {isEditing ? (
                                                <Input
                                                    value={editForm.reg_no}
                                                    onChange={(e) => setEditForm({ ...editForm, reg_no: e.target.value })}
                                                    className="h-11 rounded-xl bg-white dark:bg-slate-900 border-border/50 font-mono"
                                                />
                                            ) : (
                                                <div className="h-11 flex items-center px-4 rounded-xl bg-white dark:bg-slate-900 border border-border/20 font-mono font-bold text-sm text-primary">
                                                    {selectedMember.reg_no}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-1.5 focus-within:ring-0">
                                            <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Email Address</label>
                                            {isEditing ? (
                                                <Input
                                                    value={editForm.email}
                                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                                    className="h-11 rounded-xl bg-white dark:bg-slate-900 border-border/50"
                                                />
                                            ) : (
                                                <div className="h-11 flex items-center px-4 rounded-xl bg-white dark:bg-slate-900 border border-border/20 font-medium text-sm overflow-hidden text-ellipsis">
                                                    {selectedMember.email}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Phone Number</label>
                                            {isEditing ? (
                                                <Input
                                                    value={editForm.phone}
                                                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                                    className="h-11 rounded-xl bg-white dark:bg-slate-900 border-border/50"
                                                />
                                            ) : (
                                                <div className="h-11 flex items-center px-4 rounded-xl bg-white dark:bg-slate-900 border border-border/20 font-medium text-sm">
                                                    {selectedMember.phone || "Not Provided"}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </section>

                                {/* Business Profile Section */}
                                <section className="space-y-4">
                                    <h4 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                        <Building2 className="w-3 h-3" /> Business Information
                                    </h4>

                                    <div className="p-6 rounded-2xl border border-border/40 bg-white dark:bg-slate-900 space-y-6">
                                        {/* Business Logo & Basic Info */}
                                        <div className="flex flex-col sm:flex-row items-start gap-6">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-24 h-24 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-border/60 flex items-center justify-center overflow-hidden relative group">
                                                    {selectedMember.business?.logoUrl ? (
                                                        <img src={selectedMember.business.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                                                    ) : (
                                                        <Building2 className="w-8 h-8 text-muted-foreground/40" />
                                                    )}

                                                    {fileUploading.logo && (
                                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                            <Loader2 className="w-6 h-6 animate-spin text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="relative">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                        onChange={(e) => handleFileChange(e, 'logo')}
                                                        disabled={fileUploading.logo}
                                                    />
                                                    <Button variant="outline" size="sm" className="text-[10px] font-bold h-7 rounded-lg">
                                                        <Upload className="w-3 h-3 mr-1.5" /> {selectedMember.business?.logoUrl ? "Change Logo" : "Upload Logo"}
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="flex-1 grid grid-cols-1 gap-4 w-full">
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Business Name</label>
                                                    {isEditing ? (
                                                        <Input
                                                            value={editForm.name_biz}
                                                            onChange={(e) => setEditForm({ ...editForm, name_biz: e.target.value })}
                                                            className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-border/50"
                                                        />
                                                    ) : (
                                                        <p className="text-lg font-extrabold tracking-tight">{selectedMember.business?.name || "No Business Name"}</p>
                                                    )}
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Industry / Category</label>
                                                    {isEditing ? (
                                                        <Input
                                                            value={editForm.category}
                                                            onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                                            className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-border/50"
                                                        />
                                                    ) : (
                                                        <Badge variant="secondary" className="font-bold text-[10px] px-3">{selectedMember.business?.category || "General"}</Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Contact & Location Details */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Physical Location</label>
                                                {isEditing ? (
                                                    <Input
                                                        value={editForm.location}
                                                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                                        className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-border/50"
                                                    />
                                                ) : (
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                                                        <MapPin className="w-3.5 h-3.5" /> {selectedMember.business?.location || "N/A"}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Website URL</label>
                                                {isEditing ? (
                                                    <Input
                                                        value={editForm.website}
                                                        onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                                                        className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-border/50 font-mono"
                                                    />
                                                ) : (
                                                    <div className="flex items-center gap-2 text-sm text-blue-500 font-medium">
                                                        <Globe className="w-3.5 h-3.5" /> {selectedMember.business?.website || "N/A"}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Company Description</label>
                                            {isEditing ? (
                                                <Textarea
                                                    value={editForm.description}
                                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                                    className="min-h-[100px] rounded-xl bg-slate-50 dark:bg-slate-800 border-border/50 text-sm"
                                                />
                                            ) : (
                                                <p className="text-sm text-muted-foreground leading-relaxed">{selectedMember.business?.description || "No description provided."}</p>
                                            )}
                                        </div>

                                        {/* Certificate Manager */}
                                        <div className="pt-4 border-t border-border/30">
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Membership Certificate</p>
                                                    <p className="text-[10px] text-muted-foreground italic">Uploaded certificates are available for member download</p>
                                                </div>
                                                <div className="relative">
                                                    <input
                                                        type="file"
                                                        accept=".pdf,image/*"
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                        onChange={(e) => handleFileChange(e, 'certificate')}
                                                        disabled={fileUploading.certificate}
                                                    />
                                                    <Button variant="default" size="sm" className="rounded-xl font-bold h-9 px-4 bg-emerald-600 hover:bg-emerald-700">
                                                        {fileUploading.certificate ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : <Upload className="w-3.5 h-3.5 mr-2" />}
                                                        {selectedMember.business?.certificateUrl ? "Replace Certificate" : "Upload Certificate"}
                                                    </Button>
                                                </div>
                                            </div>

                                            {selectedMember.business?.certificateUrl && (
                                                <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                                                    <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
                                                        <FileText className="w-5 h-5" />
                                                        <span className="text-sm font-bold truncate max-w-[200px]">Official_Certificate.pdf</span>
                                                    </div>
                                                    <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 font-bold" onClick={() => window.open(selectedMember.business?.certificateUrl, '_blank')}>
                                                        <Eye className="w-4 h-4 mr-2" /> View
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </section>

                                {/* Membership Level Control */}
                                <section className="space-y-4">
                                    <h4 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                        <Activity className="w-3 h-3" /> Membership Strategy
                                    </h4>
                                    <div className="p-6 rounded-2xl border border-border/40 bg-white dark:bg-slate-900 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-bold">Assigned Tier</p>
                                            <PlanBadge plan={selectedMember.business?.plan || "Bronze"} />
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            {(["Bronze", "Silver", "Gold"] as const).map((plan) => (
                                                <Button
                                                    key={plan}
                                                    size="sm"
                                                    variant={selectedMember.business?.plan === plan ? "default" : "outline"}
                                                    className={`h-11 rounded-xl font-bold ${selectedMember.business?.plan === plan ? "bg-primary shadow-lg shadow-primary/20" : ""}`}
                                                    onClick={() => handlePlanUpdate(selectedMember._id, plan)}
                                                    disabled={actionLoading}
                                                >
                                                    {plan}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </section>

                                {isEditing ? (
                                    <div className="pt-4 sticky bottom-0 bg-slate-50 dark:bg-slate-950 py-4 border-t border-border/40">
                                        <Button className="w-full h-12 rounded-xl bg-primary font-bold shadow-xl shadow-primary/20" onClick={handleSaveProfile} disabled={actionLoading}>
                                            {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                                            Save Changes
                                        </Button>
                                    </div>
                                ) : (
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
                                )}

                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* ─── Application Detail Dialog ──────────────────────────────  */}
            <Dialog open={appDetailOpen} onOpenChange={setAppDetailOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-0 border-none bg-slate-50 dark:bg-slate-950">
                    <div className="sticky top-0 z-50 flex items-center justify-between p-6 bg-white dark:bg-slate-900 border-b border-border/40">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-extrabold tracking-tight">
                                    {selectedApplication?.name}
                                </DialogTitle>
                                <DialogDescription className="text-xs font-medium">Application ID: {selectedApplication?._id}</DialogDescription>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={isAppEditing ? "default" : "outline"}
                                size="sm"
                                className="rounded-xl font-bold text-xs h-9 px-4"
                                onClick={() => setIsAppEditing(!isAppEditing)}
                            >
                                {isAppEditing ? <X className="w-3.5 h-3.5 mr-2" /> : <Pencil className="w-3.5 h-3.5 mr-2" />}
                                {isAppEditing ? "Cancel" : "Modify Info"}
                            </Button>
                            <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9" onClick={() => setAppDetailOpen(false)}>
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    <div className="p-6 space-y-8 pb-10">
                        {selectedApplication && (
                            <div className="space-y-8">
                                {/* Applicant Info */}
                                <section className="space-y-4">
                                    <h4 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                        <User className="w-3 h-3" /> Applicant & Business Details
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-border/20">
                                            <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Company</p>
                                            <p className="text-sm font-extrabold">{selectedApplication.businessName}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{selectedApplication.businessClass}</p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-border/20">
                                            <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Contact Info</p>
                                            <p className="text-sm font-bold">{selectedApplication.email}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{selectedApplication.contact}</p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-border/20">
                                            <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Location</p>
                                            <p className="text-sm font-bold">{selectedApplication.location}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{selectedApplication.subCounty} Sub-county</p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-border/20">
                                            <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Status</p>
                                            <Badge variant={selectedApplication.status === 'pending' ? 'outline' : selectedApplication.status === 'approved' ? 'default' : 'destructive'}>
                                                {selectedApplication.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </section>

                                {/* Payment Info Section */}
                                <section className="space-y-4">
                                    <h4 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                        <CreditCard className="w-3 h-3" /> Payment & Subscription
                                    </h4>
                                    <div className="p-6 rounded-2xl border border-border/40 bg-white dark:bg-slate-900 space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Subscription Selection</label>
                                                <div className="h-11 flex items-center px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-border/20 font-medium text-xs">
                                                    {selectedApplication.subscriptionFee}
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Amount to Pay (Ksh)</label>
                                                {isAppEditing ? (
                                                    <Input
                                                        type="number"
                                                        value={appEditForm.amountToPay}
                                                        onChange={(e) => setAppEditForm({ ...appEditForm, amountToPay: parseInt(e.target.value) || 0 })}
                                                        className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-border/50 font-bold"
                                                    />
                                                ) : (
                                                    <div className="h-11 flex items-center px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-border/20 font-extrabold text-lg text-primary">
                                                        {selectedApplication.amountToPay?.toLocaleString()}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Payment Method</label>
                                                {isAppEditing ? (
                                                    <Select value={appEditForm.paymentMethod} onValueChange={(v) => setAppEditForm({ ...appEditForm, paymentMethod: v })}>
                                                        <SelectTrigger className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-border/50">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Not Set">Not Set</SelectItem>
                                                            <SelectItem value="M-Pesa">M-Pesa</SelectItem>
                                                            <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                                            <SelectItem value="Cash">Cash</SelectItem>
                                                            <SelectItem value="Other">Other</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                ) : (
                                                    <div className="h-11 flex items-center px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-border/20 font-medium text-sm">
                                                        {selectedApplication.paymentMethod || "Not Set"}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Payment Status</label>
                                                {isAppEditing ? (
                                                    <Select value={appEditForm.paymentStatus} onValueChange={(v) => setAppEditForm({ ...appEditForm, paymentStatus: v })}>
                                                        <SelectTrigger className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-border/50">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Pending">Pending</SelectItem>
                                                            <SelectItem value="Partial">Partial</SelectItem>
                                                            <SelectItem value="Paid">Paid</SelectItem>
                                                            <SelectItem value="Verified">Verified</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                ) : (
                                                    <div className="h-11">
                                                        <Badge variant={selectedApplication.paymentStatus === 'Verified' ? 'default' : selectedApplication.paymentStatus === 'Paid' ? 'secondary' : 'outline'} className="h-full px-4 rounded-xl text-xs font-bold">
                                                            {selectedApplication.paymentStatus || "Pending"}
                                                        </Badge>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {isAppEditing && (
                                            <div className="pt-4 border-t border-border/30">
                                                <Button className="w-full h-12 rounded-xl bg-primary font-bold shadow-xl shadow-primary/20" onClick={handleSaveApplication} disabled={actionLoading}>
                                                    {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                                                    Save Payment Info
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </section>

                                {/* Action Buttons */}
                                {!isAppEditing && (
                                    <section className="pt-4 flex flex-wrap gap-3">
                                        <Button
                                            className="h-12 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold"
                                            onClick={() => {
                                                if (selectedApplication.paymentMethod === 'Not Set' || selectedApplication.paymentStatus === 'Pending') {
                                                    toast({
                                                        title: "Payment Info Required",
                                                        description: "Please set the payment method and status before approving.",
                                                        variant: "destructive"
                                                    });
                                                    return;
                                                }
                                                handleApplicationStatus(selectedApplication._id, 'approved');
                                                setAppDetailOpen(false);
                                            }}
                                            disabled={actionLoading || selectedApplication.status === 'approved'}
                                        >
                                            <CheckCircle2 className="w-4 h-4 mr-2" /> Approve Application
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="h-12 px-8 rounded-xl border-amber-200 text-amber-600 hover:bg-amber-50 font-bold"
                                            onClick={() => { handleApplicationStatus(selectedApplication._id, 'rejected'); setAppDetailOpen(false); }}
                                            disabled={actionLoading || selectedApplication.status === 'rejected'}
                                        >
                                            <XCircle className="w-4 h-4 mr-2" /> Reject
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="h-12 px-4 rounded-xl text-red-500 hover:bg-red-50 font-bold ml-auto"
                                            onClick={() => { handleApplicationDelete(selectedApplication._id); setAppDetailOpen(false); }}
                                            disabled={actionLoading}
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                                        </Button>
                                    </section>
                                )}
                            </div>
                        )}
                    </div>
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

            {/* ─── Template Editor Dialog ────────────────────────────────  */}
            <Dialog open={tplEditOpen} onOpenChange={(open) => { if (!open) { setTplEditOpen(false); setTplEditing(null); } }}>
                <DialogContent className="max-w-lg rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="font-extrabold flex items-center gap-2">
                            <FileEdit className="w-5 h-5 text-primary" /> {tplEditing ? "Edit Template" : "New Template"}
                        </DialogTitle>
                        <DialogDescription>
                            {tplEditing ? "Update template details below." : "Create a reusable message template."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-2">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Template Name</label>
                            <Input placeholder="e.g. Welcome Message" value={tplName} onChange={e => setTplName(e.target.value)} className="h-11 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Channel</label>
                            <div className="flex gap-2">
                                <Button variant={tplChannel === "sms" ? "default" : "outline"} size="sm" className="rounded-xl gap-1.5 text-xs font-bold" onClick={() => setTplChannel("sms")}>
                                    <Smartphone className="w-3.5 h-3.5" /> SMS
                                </Button>
                                <Button variant={tplChannel === "email" ? "default" : "outline"} size="sm" className="rounded-xl gap-1.5 text-xs font-bold" onClick={() => setTplChannel("email")}>
                                    <Mail className="w-3.5 h-3.5" /> Email
                                </Button>
                            </div>
                        </div>
                        {tplChannel === "email" && (
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Subject</label>
                                <Input placeholder="Email subject..." value={tplSubject} onChange={e => setTplSubject(e.target.value)} className="h-11 rounded-xl" />
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Body</label>
                            <Textarea placeholder="Type your template body... Use {{name}}, {{company}} for placeholders." value={tplBody} onChange={e => setTplBody(e.target.value)} className="min-h-[120px] rounded-xl" />
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <Button variant="ghost" onClick={() => { setTplEditOpen(false); setTplEditing(null); }}>Cancel</Button>
                        <Button onClick={handleSaveTemplate} disabled={tplSaving || !tplName.trim() || !tplBody.trim()} className="rounded-xl gap-1.5">
                            {tplSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            {tplEditing ? "Update" : "Create"} Template
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    );
}
