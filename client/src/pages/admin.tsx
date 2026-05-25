import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
    Users, BarChart3, Shield, Search, ChevronLeft, ChevronRight,
    LogOut, Crown, Medal, Award, Trash2, KeyRound, UserCog,
    Building2, Mail, Phone, MapPin, Globe, Eye, EyeOff, X, Home,
    TrendingUp, Activity, LayoutDashboard, ChevronDown,
    AlertTriangle, Loader2, FileText, MessageSquare, Send,
    Plus, Pencil, Clock, CheckCircle2, XCircle, Smartphone,
    AtSign, UserPlus, FileEdit, Upload, Download,
    User, Store, Menu,
    CreditCard, GraduationCap, Calendar, CalendarDays, Bell, Star
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
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SEOHead } from "@/components/seo/seo-head";
import { useAuth } from "@/services/auth-context";
import { adminService, DashboardStats, MemberDoc, PaginatedMembers, SellerDoc, PaginatedSellers, OrderStats, SubscriptionPlan, SubscriptionStats, PaginatedOrders, PaginatedSubscribers } from "@/services/admin-service";
import { messagingService, MessageTemplate, MessageLogEntry, MessageChannel, MessagingStats, PaginatedLogs, MessagingSettings } from "@/services/messaging-service";
import { notificationService } from "@/services/notification-service";
import { useToast } from "@/hooks/use-toast";
import { BUSINESS_CATEGORIES, normalizeBusinessCategory } from "@shared/business-categories";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ContentManagementPanel } from "@/components/admin/content-management-panel";
import { meetingService, MeetingDoc, MeetingTargetGroup, MeetingStatus } from "@/services/meeting-service";
import { attachmentService, AttachmentRequest, AttachmentPagination } from "@/services/attachment-service";
import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);


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

function MemberTypeBadge({ memberType }: { memberType?: string }) {
    if (!memberType || memberType === 'member') {
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400">
                <Users className="w-3 h-3" /> Member
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
            <Star className="w-3 h-3" /> Director
        </span>
    );
}

function PaymentStatusBadge({ status }: { status?: string }) {
    const config: Record<string, { color: string; bg: string; border: string }> = {
        pending: { color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
        partial: { color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
        paid: { color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
        verified: { color: "text-green-700 dark:text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
    };
    const cfg = config[status || "pending"] || config.pending;
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${cfg.bg} ${cfg.border} ${cfg.color}`}>
            <CreditCard className="w-3 h-3" /> {status || "pending"}
        </span>
    );
}

function AttachmentStatusBadge({ status }: { status: string }) {
    const configs: Record<string, { color: string; bg: string; label: string }> = {
        pending: { color: 'text-amber-700', bg: 'bg-amber-500/10 border-amber-500/20', label: 'Pending' },
        matchmaking: { color: 'text-blue-700', bg: 'bg-blue-500/10 border-blue-500/20', label: 'Matchmaking' },
        placed: { color: 'text-green-700', bg: 'bg-green-500/10 border-green-500/20', label: 'Placed' },
        rejected: { color: 'text-red-700', bg: 'bg-red-500/10 border-red-500/20', label: 'Rejected' },
        completed: { color: 'text-purple-700', bg: 'bg-purple-500/10 border-purple-500/20', label: 'Completed' },
    };
    const cfg = configs[status] || configs.pending;
    return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>;
}


// ── Bulk Import Tab ─────────────────────────────────────────────────────────
function BulkImportTab() {
    const { toast } = useToast();
    const [importing, setImporting] = useState(false);
    const [importResult, setImportResult] = useState<{ imported: number; failed: number; errors: { row: number; message: string }[] } | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useState<React.RefObject<HTMLInputElement | null>>({ current: null });

    const handleDownloadTemplate = async () => {
        try {
            await adminService.downloadImportTemplate();
            toast({ title: "Template Downloaded", description: "Fill in the spreadsheet and re-upload it." });
        } catch {
            toast({ title: "Download Failed", description: "Could not download the template. Try again.", variant: "destructive" });
        }
    };

    const handleFileSelect = async (file: File) => {
        if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
            toast({ title: "Invalid Format", description: "Please upload an .xlsx or .xls file.", variant: "destructive" });
            return;
        }
        setImporting(true);
        setImportResult(null);
        try {
            const res = await adminService.bulkImportBusinesses(file);
            if (res.success) {
                setImportResult(res.data);
                toast({
                    title: "Import Complete",
                    description: `${res.data.imported} businesses imported, ${res.data.failed} failed.`,
                });
            }
        } catch (err: any) {
            toast({ title: "Import Failed", description: err.response?.data?.message || err.response?.data?.error || "Bulk import failed.", variant: "destructive" });
        } finally {
            setImporting(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFileSelect(file);
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
            <Card className="rounded-2xl border border-border/40 bg-white dark:bg-slate-900">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <Upload className="w-5 h-5 text-primary" />
                        Bulk Business Import
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Upload an Excel spreadsheet to import multiple businesses at once. Download the template first to ensure correct formatting.</p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Button variant="outline" className="rounded-xl font-bold" onClick={handleDownloadTemplate}>
                        <Download className="w-4 h-4 mr-2" /> Download Excel Template
                    </Button>

                    <div
                        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${dragOver ? 'border-primary bg-primary/5' : 'border-border/40 hover:border-primary/50'}`}
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                    >
                        {importing ? (
                            <div className="flex flex-col items-center gap-3">
                                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                                <p className="font-bold">Importing businesses...</p>
                                <p className="text-sm text-muted-foreground">This may take a moment for large files.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <Upload className="w-10 h-10 text-muted-foreground/40" />
                                <p className="font-bold">Drop your Excel file here, or</p>
                                <label className="cursor-pointer">
                                    <span className="text-primary font-bold underline">browse files</span>
                                    <input
                                        type="file"
                                        accept=".xlsx,.xls"
                                        className="hidden"
                                        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }}
                                    />
                                </label>
                                <p className="text-xs text-muted-foreground">.xlsx or .xls files only</p>
                            </div>
                        )}
                    </div>

                    {importResult && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                                    <p className="text-2xl font-extrabold text-emerald-600">{importResult.imported}</p>
                                    <p className="text-xs font-bold text-emerald-600/70 uppercase">Imported</p>
                                </div>
                                <div className={`p-4 rounded-xl border text-center ${importResult.failed > 0 ? 'bg-red-500/10 border-red-500/20' : 'bg-slate-50 dark:bg-slate-800 border-border/20'}`}>
                                    <p className={`text-2xl font-extrabold ${importResult.failed > 0 ? 'text-red-600' : 'text-muted-foreground'}`}>{importResult.failed}</p>
                                    <p className={`text-xs font-bold uppercase ${importResult.failed > 0 ? 'text-red-600/70' : 'text-muted-foreground/70'}`}>Failed</p>
                                </div>
                            </div>

                            {importResult.errors.length > 0 && (
                                <div className="rounded-xl border border-red-500/20 bg-red-500/5 overflow-hidden">
                                    <div className="p-3 bg-red-500/10 border-b border-red-500/20">
                                        <p className="text-xs font-bold text-red-600 uppercase">Import Errors</p>
                                    </div>
                                    <div className="max-h-64 overflow-y-auto p-3 space-y-1">
                                        {importResult.errors.map((err, i) => (
                                            <div key={i} className="flex gap-3 text-sm">
                                                <span className="font-mono text-xs text-red-500/70 min-w-[60px]">Row {err.row}</span>
                                                <span className="text-muted-foreground">{err.message}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
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
    const [showPassword, setShowPassword] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<any>({});
    const [fileUploading, setFileUploading] = useState<{ logo: boolean; certificate: boolean; coverImage: boolean }>({ logo: false, certificate: false, coverImage: false });

    // Application Modals
    const [selectedApplication, setSelectedApplication] = useState<any>(null);
    const [appDetailOpen, setAppDetailOpen] = useState(false);
    const [appEditForm, setAppEditForm] = useState<any>({});
    const [isAppEditing, setIsAppEditing] = useState(false);

    // Active sidebar item
    const [activeTab, setActiveTab] = useState("overview");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    // memberType filter for members tab
    const [memberTypeFilter, setMemberTypeFilter] = useState<string>("all");

    // Approval dialog with memberType
    const [approveDialogOpen, setApproveDialogOpen] = useState(false);
    const [pendingApproveId, setPendingApproveId] = useState<string>("");
    const [pendingApproveMemberType, setPendingApproveMemberType] = useState<'director' | 'member'>('member');

    // Meetings state
    const [meetings, setMeetings] = useState<MeetingDoc[]>([]);
    const [loadingMeetings, setLoadingMeetings] = useState(false);
    const [meetingModalOpen, setMeetingModalOpen] = useState(false);
    const [editingMeeting, setEditingMeeting] = useState<MeetingDoc | null>(null);
    const [meetingForm, setMeetingForm] = useState({
        title: '',
        description: '',
        location: '',
        meetingLink: '',
        startDateTime: '',
        endDateTime: '',
        targetGroup: 'all' as MeetingTargetGroup,
        status: 'scheduled' as MeetingStatus,
    });
    const [savingMeeting, setSavingMeeting] = useState(false);
    const [sendingNotification, setSendingNotification] = useState<string | null>(null);
    const [calendarView, setCalendarView] = useState<string>(Views.MONTH);

    // ─── Sellers State ─────────────────────────────────────────────
    const [sellers, setSellers] = useState<PaginatedSellers | null>(null);
    const [loadingSellers, setLoadingSellers] = useState(false);
    const [sellerSearch, setSellerSearch] = useState("");
    const [sellerStatusFilter, setSellerStatusFilter] = useState("all");
    const [sellerPage, setSellerPage] = useState(1);
    
    // Seller Modals
    const [selectedSeller, setSelectedSeller] = useState<SellerDoc | null>(null);
    const [sellerDetailOpen, setSellerDetailOpen] = useState(false);
    const [sellerRejectionReason, setSellerRejectionReason] = useState("");
    const [verifyPaymentOpen, setVerifyPaymentOpen] = useState(false);
    const [verifyPaymentForm, setVerifyPaymentForm] = useState({
        amountPaid: 0,
        paymentMethod: "",
        paymentStatus: "pending" as "pending" | "partial" | "paid" | "verified",
        transactionReference: "",
        paymentDate: "",
        paymentNotes: "",
    });

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

    // ─── Orders State ─────────────────────────────────────────────
    const [orders, setOrders] = useState<PaginatedOrders | null>(null);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [orderSearch, setOrderSearch] = useState("");
    const [orderStatusFilter, setOrderStatusFilter] = useState("all");
    const [orderPage, setOrderPage] = useState(1);
    const [orderStats, setOrderStats] = useState<OrderStats | null>(null);

    // ─── Subscriptions State ──────────────────────────────────────
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [loadingPlans, setLoadingPlans] = useState(false);
    const [planEditOpen, setPlanEditOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
    const [planForm, setPlanForm] = useState<Partial<SubscriptionPlan>>({ name: "", price: 0, features: [], isActive: true, description: "" });
    const [subscriptionStats, setSubscriptionStats] = useState<SubscriptionStats | null>(null);
    const [subscribers, setSubscribers] = useState<PaginatedSubscribers | null>(null);
    const [loadingSubscribers, setLoadingSubscribers] = useState(false);
    const [subPage, setSubPage] = useState(1);
    const [subSearch, setSubSearch] = useState("");

    // ─── Attachments State ────────────────────────────────────────
    const [attachments, setAttachments] = useState<AttachmentRequest[]>([]);
    const [attachmentsLoading, setAttachmentsLoading] = useState(false);
    const [attachmentPagination, setAttachmentPagination] = useState<AttachmentPagination>({ total: 0, page: 1, limit: 10 });
    const [attachmentStatusFilter, setAttachmentStatusFilter] = useState("");
    const [selectedAttachment, setSelectedAttachment] = useState<AttachmentRequest | null>(null);
    const [matchmakeOpen, setMatchmakeOpen] = useState(false);
    const [matchmakeBusinessIds, setMatchmakeBusinessIds] = useState<string[]>([]);
    const [matchmakeLoading, setMatchmakeLoading] = useState(false);

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
            toast({ title: "Error", description: err.response?.data?.message || err.response?.data?.error || "Failed to load stats", variant: "destructive" });
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
            if (memberTypeFilter !== "all") params.memberType = memberTypeFilter;
            const res = await adminService.getMembers(params);
            if (res.success) setMembers(res.data);
        } catch (err: any) {
            toast({ title: "Error", description: err.response?.data?.message || err.response?.data?.error || "Failed to load members", variant: "destructive" });
        } finally {
            setLoadingMembers(false);
        }
    }, [currentPage, searchQuery, roleFilter, planFilter, memberTypeFilter, toast]);

    useEffect(() => { fetchStats(); }, [fetchStats]);
    useEffect(() => { fetchMembers(); }, [fetchMembers]);

    // ─── Fetch applications ───────────────────────────────────────────
    const fetchApplications = useCallback(async () => {
        try {
            setLoadingApplications(true);
            const res = await adminService.getApplications();
            if (res.success) setApplications(res.data);
        } catch (err: any) {
            toast({ title: "Error", description: err.response?.data?.message || err.response?.data?.error || "Failed to load applications", variant: "destructive" });
        } finally {
            setLoadingApplications(false);
        }
    }, [toast]);

    const fetchMeetings = useCallback(async () => {
        try {
            setLoadingMeetings(true);
            const res = await meetingService.getMeetings();
            if (res.success) setMeetings(res.data);
        } catch {
            toast({ title: "Error", description: "Failed to load meetings", variant: "destructive" });
        } finally {
            setLoadingMeetings(false);
        }
    }, [toast]);

    // ─── Fetch Orders ──────────────────────────────────────────────────
    const fetchOrders = useCallback(async () => {
        try {
            setLoadingOrders(true);
            const params: any = { page: orderPage, limit: 10 };
            if (orderSearch) params.search = orderSearch;
            if (orderStatusFilter !== "all") params.status = orderStatusFilter;
            const res = await adminService.getOrders(params);
            if (res.success) setOrders(res.data);
        } catch (err: any) {
            toast({ title: "Error", description: "Failed to load orders", variant: "destructive" });
        } finally {
            setLoadingOrders(false);
        }
    }, [orderPage, orderSearch, orderStatusFilter, toast]);

    const fetchOrderStats = useCallback(async () => {
        try {
            const res = await adminService.getOrderStats();
            if (res.success) setOrderStats(res.data);
        } catch (err: any) {
            console.error("Failed to load order stats", err);
        }
    }, []);

    // ─── Fetch Plans ───────────────────────────────────────────────────
    const fetchPlans = useCallback(async () => {
        try {
            setLoadingPlans(true);
            const res = await adminService.getPlans(true);
            if (res.success) setPlans(res.data);
        } catch (err: any) {
            toast({ title: "Error", description: "Failed to load subscription plans", variant: "destructive" });
        } finally {
            setLoadingPlans(false);
        }
    }, [toast]);

    const fetchSubscriptionStats = useCallback(async () => {
        try {
            const res = await adminService.getSubscriptionStats();
            if (res.success) setSubscriptionStats(res.data);
        } catch (err: any) {
            console.error("Failed to load subscription stats", err);
        }
    }, []);

    const fetchSubscribers = useCallback(async () => {
        try {
            setLoadingSubscribers(true);
            const params: any = { page: subPage, limit: 10 };
            if (subSearch) params.search = subSearch;
            const res = await adminService.getSubscribers(params);
            if (res.success) setSubscribers(res.data);
        } catch (err: any) {
            toast({ title: "Error", description: "Failed to load subscribers", variant: "destructive" });
        } finally {
            setLoadingSubscribers(false);
        }
    }, [subPage, subSearch, toast]);

    useEffect(() => { fetchApplications(); }, [fetchApplications]);
    useEffect(() => { if (activeTab === 'meetings') fetchMeetings(); }, [activeTab, fetchMeetings]);

    // ─── Fetch sellers ────────────────────────────────────────────────
    const fetchSellers = useCallback(async () => {
        try {
            setLoadingSellers(true);
            const params: any = { page: sellerPage, limit: pageLimit };
            if (sellerSearch) params.search = sellerSearch;
            if (sellerStatusFilter !== "all") params.status = sellerStatusFilter;
            const res = await adminService.getSellers(params);
            if (res.success) setSellers(res.data);
        } catch (err: any) {
            toast({ title: "Error", description: err.response?.data?.message || err.response?.data?.error || "Failed to load sellers", variant: "destructive" });
        } finally {
            setLoadingSellers(false);
        }
    }, [sellerPage, sellerSearch, sellerStatusFilter, toast]);

    const fetchAttachments = useCallback(async () => {
        try {
            setAttachmentsLoading(true);
            const params: any = {};
            if (attachmentStatusFilter) params.status = attachmentStatusFilter;
            const result = await attachmentService.adminList(params);
            setAttachments(result.data);
            setAttachmentPagination(result.pagination);
        } catch (err: any) {
            toast({ title: "Error", description: err.response?.data?.message || err.response?.data?.error || "Failed to load attachments", variant: "destructive" });
        } finally {
            setAttachmentsLoading(false);
        }
    }, [attachmentStatusFilter, toast]);

    useEffect(() => {
        if (activeTab === "overview") { fetchOrderStats(); fetchSubscriptionStats(); }
        if (activeTab === "sellers") fetchSellers();
        if (activeTab === "orders") { fetchOrders(); fetchOrderStats(); }
        if (activeTab === "subscriptions") { fetchPlans(); fetchSubscriptionStats(); fetchSubscribers(); }
        if (activeTab === "attachments") fetchAttachments();
    }, [fetchSellers, fetchOrders, fetchOrderStats, fetchPlans, fetchSubscriptionStats, fetchSubscribers, fetchAttachments, activeTab]);

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
            toast({ title: "Save Failed", description: err.response?.data?.message || err.response?.data?.error || "Failed to save settings", variant: "destructive" });
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
            toast({ title: "Send Failed", description: err.response?.data?.message || err.response?.data?.error || "Failed to send messages", variant: "destructive" });
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
            toast({ title: "Error", description: err.response?.data?.message || err.response?.data?.error || "Failed to save template", variant: "destructive" });
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
            toast({ title: "Error", description: err.response?.data?.message || err.response?.data?.error || "Failed to update role", variant: "destructive" });
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
            toast({ title: "Error", description: err.response?.data?.message || err.response?.data?.error || "Failed to update plan", variant: "destructive" });
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
            toast({ title: "Error", description: err.response?.data?.message || err.response?.data?.error || "Failed to reset password", variant: "destructive" });
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
            toast({ title: "Error", description: err.response?.data?.message || err.response?.data?.error || "Failed to delete member", variant: "destructive" });
        } finally {
            setActionLoading(false);
        }
    };

    const handleApplicationStatus = async (id: string, status: string, memberType?: 'director' | 'member') => {
        setActionLoading(true);
        try {
            const res = await adminService.updateApplicationStatus(id, status, memberType);
            toast({ title: "Status Updated", description: `Application is now ${status}.` });

            // Always send approval notification when approving — password may be undefined for
            // returning applicants (user already exists); backend falls back to '********' gracefully.
            if (status === 'approved') {
                try {
                    const app = applications.find(a => a._id === id);
                    if (app) {
                        const name = app.name;
                        const company = app.businessName;
                        const email = app.email;
                        const phone = app.contact;
                        const regNo = app.reg_no || "PENDING";
                        const plan = app.subscriptionFee || "Standard";
                        const password = res.data?.password;

                        console.log("Sending approval notifications from admin frontend:", { email, phone });

                        // Send Email
                        await notificationService.sendApprovalEmail(name, company, regNo, plan, email, password);
                        
                        // Send SMS
                        if (phone) {
                            await notificationService.sendApprovalSms(name, company, regNo, phone);
                        }

                        toast({ title: "Email & SMS Sent", description: "Membership approval notifications sent successfully from frontend." });
                    } else {
                        // Fallback to backend if app data not found in local state
                        await adminService.sendApprovalEmail(id, res.data?.password);
                        toast({ title: "Email Sent", description: "Membership approval notification triggered via backend." });
                    }
                } catch (emailErr) {
                    console.error("Failed to send approval notification:", emailErr);
                    toast({ 
                        title: "Notification Delayed", 
                        description: "Status updated, but welcome notification failed. You can resend it from the details view.", 
                        variant: "destructive" 
                    });
                }
            }

            fetchApplications();
        } catch (err: any) {
            toast({ title: "Error", description: err.response?.data?.message || err.response?.data?.error || "Failed to update status", variant: "destructive" });
        } finally {
            setActionLoading(false);
        }
    };

    const handleResendEmail = async (id: string, type: 'confirmation' | 'approval') => {
        setActionLoading(true);
        try {
            if (type === 'confirmation') {
                const app = applications.find(a => a._id === id);
                if (app) {
                    await notificationService.sendWelcomeEmail(app.name, app.businessName, app.email);
                    if (app.contact) await notificationService.sendWelcomeSms(app.name, app.businessName, app.contact);
                    toast({ title: "Confirmation Resent", description: "Registration confirmation sent from frontend." });
                } else {
                    await adminService.sendConfirmationEmail(id);
                    toast({ title: "Confirmation Resent", description: "The registration confirmation email has been resent." });
                }
            } else {
                const app = applications.find(a => a._id === id);
                if (app) {
                    await notificationService.sendApprovalEmail(app.name, app.businessName, app.reg_no || "PENDING", app.subscriptionFee || "Standard", app.email);
                    if (app.contact) await notificationService.sendApprovalSms(app.name, app.businessName, app.reg_no || "PENDING", app.contact);
                    toast({ title: "Welcome Resent", description: "Membership approval notification sent from frontend." });
                } else {
                    await adminService.sendApprovalEmail(id, ""); 
                    toast({ title: "Welcome Email Resent", description: "The membership approval notification has been resent." });
                }
            }
        } catch (err: any) {
            toast({ title: "Error", description: err.response?.data?.message || err.response?.data?.error || "Failed to resend email", variant: "destructive" });
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
            toast({ title: "Error", description: err.response?.data?.message || err.response?.data?.error || "Failed to delete application", variant: "destructive" });
        } finally {
            setActionLoading(false);
        }
    };

    const openCreateMeeting = () => {
        setEditingMeeting(null);
        setMeetingForm({ title: '', description: '', location: '', meetingLink: '', startDateTime: '', endDateTime: '', targetGroup: 'all', status: 'scheduled' });
        setMeetingModalOpen(true);
    };

    const openEditMeeting = (m: MeetingDoc) => {
        setEditingMeeting(m);
        setMeetingForm({
            title: m.title,
            description: m.description || '',
            location: m.location || '',
            meetingLink: (m as any).meetingLink || '',
            startDateTime: m.startDateTime ? m.startDateTime.slice(0, 16) : '',
            endDateTime: m.endDateTime ? m.endDateTime.slice(0, 16) : '',
            targetGroup: m.targetGroup,
            status: m.status,
        });
        setMeetingModalOpen(true);
    };

    const handleSaveMeeting = async () => {
        if (!meetingForm.title || !meetingForm.startDateTime) {
            toast({ title: "Missing fields", description: "Title and start date/time are required.", variant: "destructive" });
            return;
        }
        setSavingMeeting(true);
        try {
            const toISO = (val: string) => val ? new Date(val).toISOString() : val;
            const payload = {
                ...meetingForm,
                startDateTime: toISO(meetingForm.startDateTime),
                endDateTime: meetingForm.endDateTime ? toISO(meetingForm.endDateTime) : undefined,
            };
            if (editingMeeting) {
                await meetingService.updateMeeting(editingMeeting._id, payload);
                toast({ title: "Meeting Updated" });
            } else {
                await meetingService.createMeeting(payload);
                toast({ title: "Meeting Created" });
            }
            setMeetingModalOpen(false);
            fetchMeetings();
        } catch (err: any) {
            toast({ title: "Error", description: err.response?.data?.message || err.response?.data?.error || "Failed to save meeting", variant: "destructive" });
        } finally {
            setSavingMeeting(false);
        }
    };

    const handleCancelMeeting = async (id: string) => {
        try {
            await meetingService.deleteMeeting(id);
            toast({ title: "Meeting Cancelled" });
            fetchMeetings();
        } catch {
            toast({ title: "Error", description: "Failed to cancel meeting", variant: "destructive" });
        }
    };

    const handleSendNotifications = async (id: string) => {
        setSendingNotification(id);
        try {
            const res = await meetingService.sendNotifications(id);
            toast({ title: "Notifications Sent", description: res.message || "Notifications dispatched successfully." });
            fetchMeetings();
        } catch (err: any) {
            toast({ title: "Error", description: err.response?.data?.message || err.response?.data?.error || "Failed to send notifications", variant: "destructive" });
        } finally {
            setSendingNotification(null);
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
            toast({ title: "Error", description: err.response?.data?.message || err.response?.data?.error || "Failed to update application", variant: "destructive" });
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
            amountPaid: app.amountPaid || 0,
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
            toast({ title: "Error", description: err.response?.data?.message || err.response?.data?.error || "Failed to update profile", variant: "destructive" });
        } finally {
            setActionLoading(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'certificate' | 'coverImage') => {
        const file = e.target.files?.[0];
        if (!file || !selectedMember) return;

        setFileUploading(prev => ({ ...prev, [type]: true }));
        try {
            if (type === 'coverImage') {
                const res = await adminService.uploadCoverImage(selectedMember._id, file);
                if (res.success) {
                    toast({ title: 'Cover Image Uploaded' });
                    const updated = await adminService.getMember(selectedMember._id);
                    if (updated.success) setSelectedMember(updated.data);
                    fetchMembers();
                }
            } else {
                const res = await adminService.uploadFile(selectedMember._id, type, file);
                if (res.success) {
                    toast({ title: `${type === 'logo' ? 'Logo' : 'Certificate'} Uploaded` });
                    const updated = await adminService.getMember(selectedMember._id);
                    if (updated.success) setSelectedMember(updated.data);
                    fetchMembers();
                }
            }
        } catch (err: any) {
            toast({ title: "Upload Failed", description: err.response?.data?.message || err.response?.data?.error || "File upload failed", variant: "destructive" });
        } finally {
            setFileUploading(prev => ({ ...prev, [type]: false }));
        }
    };

    const handleSellerStatusUpdate = async (id: string, status: 'approved' | 'rejected' | 'deactivated') => {
        setActionLoading(true);
        try {
            const res = await adminService.updateSellerStatus(id, status, status === 'rejected' ? sellerRejectionReason : undefined);
            if (res.success) {
                toast({ title: "Status Updated", description: `Seller account has been ${status}.` });
                fetchSellers();
                fetchStats();
                if (status === 'rejected') setSellerRejectionReason("");
            }
        } catch (err: any) {
            toast({ title: "Error", description: err.response?.data?.message || err.response?.data?.error || `Failed to ${status} seller`, variant: "destructive" });
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteSeller = async (id: string) => {
        setActionLoading(true);
        try {
            const res = await adminService.deleteSeller(id);
            if (res.success) {
                toast({ title: "Seller Deleted", description: "Seller account has been removed." });
                fetchSellers();
                fetchStats();
            }
        } catch (err: any) {
            toast({ title: "Error", description: err.response?.data?.message || err.response?.data?.error || "Failed to delete seller", variant: "destructive" });
        } finally {
            setActionLoading(false);
        }
    };

    const handleVerifyPayment = async (id: string) => {
        setActionLoading(true);
        try {
            const res = await adminService.updateSellerPayment(id, {
                amountPaid: Number(verifyPaymentForm.amountPaid) || 0,
                paymentMethod: verifyPaymentForm.paymentMethod,
                paymentStatus: verifyPaymentForm.paymentStatus,
                transactionReference: verifyPaymentForm.transactionReference || undefined,
                paymentDate: verifyPaymentForm.paymentDate || undefined,
                paymentNotes: verifyPaymentForm.paymentNotes || undefined,
            });
            if (res.success) {
                toast({ title: "Payment Updated", description: `Payment status set to ${verifyPaymentForm.paymentStatus}.` });
                setVerifyPaymentOpen(false);
                fetchSellers();
                if (selectedSeller && selectedSeller._id === id) setSelectedSeller(res.data);
            }
        } catch (err: any) {
            toast({ title: "Error", description: err.response?.data?.message || err.response?.data?.error || "Failed to update payment", variant: "destructive" });
        } finally {
            setActionLoading(false);
        }
    };

    const openVerifyPayment = (seller: SellerDoc) => {
        setSelectedSeller(seller);
        setVerifyPaymentForm({
            amountPaid: (seller as any).amountPaid ?? 0,
            paymentMethod: (seller as any).paymentMethod ?? "",
            paymentStatus: (seller as any).paymentStatus ?? "pending",
            transactionReference: (seller as any).transactionReference ?? "",
            paymentDate: (seller as any).paymentDate ? (seller as any).paymentDate.slice(0, 10) : "",
            paymentNotes: "",
        });
        setVerifyPaymentOpen(true);
    };


    const openSellerDetail = async (seller: SellerDoc) => {
        try {
            const res = await adminService.getSeller(seller._id);
            if (res.success) {
                setSelectedSeller(res.data);
                setSellerDetailOpen(true);
            }
        } catch {
            setSelectedSeller(seller);
            setSellerDetailOpen(true);
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
                    category: normalizeBusinessCategory(res.data.business?.category),
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

    // ─── Order Actions ────────────────────────────────────────────────
    const [releasingOrders, setReleasingOrders] = useState<Set<string>>(new Set());
    const handleReleaseEscrow = async (orderId: string) => {
        setReleasingOrders(prev => new Set(prev).add(orderId));
        try {
            const res = await adminService.releaseEscrow(orderId);
            if (res.success) {
                toast({ title: "Success", description: "Funds released from escrow" });
                fetchOrders();
            }
        } catch (err: any) {
            toast({ title: "Error", description: err.response?.data?.message || err.response?.data?.error || "Failed to release funds", variant: "destructive" });
        } finally {
            setReleasingOrders(prev => { const next = new Set(prev); next.delete(orderId); return next; });
        }
    };

    // ─── Subscription Actions ──────────────────────────────────────────
    const handleSavePlan = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loadingPlans) return; // Prevent double submission
        try {
            setLoadingPlans(true);
            let res;
            if (selectedPlan) {
                res = await adminService.updateSubscriptionPlan(selectedPlan._id, planForm);
            } else {
                res = await adminService.createPlan(planForm as any);
            }
            if (res.success) {
                toast({ title: "Success", description: `Plan ${selectedPlan ? 'updated' : 'created'} successfully` });
                setPlanEditOpen(false);
                fetchPlans();
            }
        } catch (err: any) {
            toast({ title: "Error", description: "Failed to save plan", variant: "destructive" });
        } finally {
            setLoadingPlans(false);
        }
    };

    const handleDeletePlan = async (id: string) => {
        if (!confirm("Are you sure you want to delete this plan?")) return;
        try {
            setLoadingPlans(true);
            const res = await adminService.deletePlan(id);
            if (res.success) {
                toast({ title: "Success", description: "Plan deleted" });
                fetchPlans();
            }
        } catch (err: any) {
            toast({ title: "Error", description: "Failed to delete plan", variant: "destructive" });
        } finally {
            setLoadingPlans(false);
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

    const totalSellers = stats?.totalSellers ?? 0;
    const pendingSellers = stats?.pendingSellers ?? 0;

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
            title: "Marketplace Sellers",
            value: totalSellers,
            icon: <Store className="w-5 h-5" />,
            gradient: "from-emerald-500 to-teal-500",
            bgGlow: "bg-emerald-500/10",
        },
        {
            title: "Pending Approval",
            value: pendingSellers,
            icon: <AlertTriangle className="w-5 h-5" />,
            gradient: "from-amber-500 to-yellow-500",
            bgGlow: "bg-amber-500/10",
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
                            { key: "content", label: "Content", icon: <FileEdit className="w-4 h-4" /> },
                            { key: "sellers", label: "Sellers", icon: <Store className="w-4 h-4" /> },
                            { key: "orders", label: "Orders", icon: <CreditCard className="w-4 h-4" /> },
                            { key: "subscriptions", label: "Subscriptions", icon: <Crown className="w-4 h-4" /> },
                            { key: "attachments", label: "Student Attachment", icon: <GraduationCap className="w-4 h-4" /> },
                            { key: "meetings", label: "Meetings", icon: <Calendar className="w-4 h-4" /> },
                            { key: "bulk-import", label: "Bulk Import", icon: <Upload className="w-4 h-4" /> },
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
                        <div>
                            <h2 className="font-extrabold text-sm leading-none">KNCCI Admin</h2>
                            <p className="text-[10px] text-muted-foreground">
                                {activeTab === "overview" ? "Dashboard" :
                                    activeTab === "members" ? "Members" :
                                        activeTab === "applications" ? "Applications" :
                                            activeTab === "sellers" ? "Sellers" :
                                                activeTab === "orders" ? "Orders" :
                                                    activeTab === "subscriptions" ? "Subscriptions" :
                                                    activeTab === "attachments" ? "Student Attachment" :
                                                    activeTab === "meetings" ? "Meetings" :
                                                        "Messaging"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Mobile Slide-in Menu */}
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                    <SheetContent side="right" className="w-[280px] p-0 flex flex-col">
                        <SheetHeader className="p-6 pb-4 border-b border-border/40">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-extrabold text-sm shadow-lg shadow-primary/20">
                                    K
                                </div>
                                <div>
                                    <SheetTitle className="font-extrabold text-sm tracking-tight">KNCCI Admin</SheetTitle>
                                    <p className="text-[10px] text-muted-foreground font-medium">Uasin Gishu Chapter</p>
                                </div>
                            </div>
                        </SheetHeader>

                        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                            {[
                                { key: "overview", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
                                { key: "members", label: "Members", icon: <Users className="w-4 h-4" /> },
                                { key: "applications", label: "Applications", icon: <FileText className="w-4 h-4" /> },
                                { key: "sellers", label: "Sellers", icon: <Store className="w-4 h-4" /> },
                                { key: "orders", label: "Orders", icon: <CreditCard className="w-4 h-4" /> },
                                { key: "subscriptions", label: "Subscriptions", icon: <Crown className="w-4 h-4" /> },
                                { key: "attachments", label: "Student Attachment", icon: <GraduationCap className="w-4 h-4" /> },
                                { key: "meetings", label: "Meetings", icon: <Calendar className="w-4 h-4" /> },
                                { key: "messaging", label: "Messaging", icon: <MessageSquare className="w-4 h-4" /> },
                            ].map((item) => (
                                <button
                                    key={item.key}
                                    onClick={() => { setActiveTab(item.key); setMobileMenuOpen(false); }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${activeTab === item.key
                                        ? "bg-primary/10 text-primary shadow-sm"
                                        : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-foreground"
                                        }`}
                                >
                                    {item.icon}
                                    {item.label}
                                </button>
                            ))}
                            <div className="pt-4 border-t border-border/30 mt-4">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
                                    onClick={() => { setMobileMenuOpen(false); setLocation('/'); }}
                                >
                                    <Home className="w-4 h-4 mr-3" /> Return to Home
                                </Button>
                            </div>
                        </nav>

                        <div className="p-4 border-t border-border/40 space-y-3">
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                <Avatar className="w-8 h-8">
                                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                                        {user?.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
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
                                onClick={() => { setMobileMenuOpen(false); logout(); }}
                            >
                                <LogOut className="w-4 h-4 mr-2" /> Log Out
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>

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
                            {activeTab === "overview" ? "Dashboard Overview" : 
                             activeTab === "members" ? "Member Management" : 
                             activeTab === "applications" ? "Application Management" : 
                             activeTab === "content" ? "Content Management" :
                             activeTab === "sellers" ? "Seller Marketplace" :
                             activeTab === "orders" ? "System Orders" :
                             activeTab === "subscriptions" ? "Subscription Plans" :
                             activeTab === "attachments" ? "Student Attachment Requests" :
                             activeTab === "meetings" ? "Meeting Calendar" :
                              "Messaging Center"}
                        </h1>
                    </motion.div>

                    {activeTab === "content" && <ContentManagementPanel />}

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

                            {/* Marketplace Analytics */}
                            {orderStats && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                                    <Card className="border-border/40">
                                        <CardHeader>
                                            <CardTitle className="text-base font-extrabold flex items-center gap-2">
                                                <Activity className="w-4 h-4 text-primary" /> Order Volume
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Total Orders</p>
                                                    <p className="text-2xl font-black">{orderStats.totalOrders}</p>
                                                </div>
                                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-emerald-500/10">
                                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Total Revenue</p>
                                                    <p className="text-2xl font-black text-emerald-600">KES {orderStats.totalRevenue.toLocaleString()}</p>
                                                </div>
                                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-amber-500/10 col-span-2">
                                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Escrow Balance</p>
                                                    <p className="text-2xl font-black text-amber-600">KES {orderStats.escrowBalance?.toLocaleString() || '0'}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-3 pt-2">
                                                {orderStats.statusCounts.map((stat: any) => (
                                                    <div key={stat.status} className="flex items-center justify-between">
                                                        <span className="text-sm font-medium capitalize">{stat.status}</span>
                                                        <div className="flex items-center gap-3 flex-1 max-w-[200px] ml-4">
                                                            <div className="h-2 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                                <div 
                                                                    className="h-full bg-primary" 
                                                                    style={{ width: `${(stat.count / orderStats.totalOrders) * 100}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-xs font-bold w-8 text-right">{stat.count}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-border/40">
                                        <CardHeader>
                                            <CardTitle className="text-base font-extrabold flex items-center gap-2">
                                                <Store className="w-4 h-4 text-primary" /> Top Vendors
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {orderStats.topVendors.map((vendor: any, i: number) => (
                                                    <div key={i} className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold">
                                                            {i + 1}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-bold truncate">{vendor.name || 'Unknown Vendor'}</p>
                                                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">{vendor.count} Orders</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm font-black">KES {vendor.totalSales.toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                                {orderStats.topVendors.length === 0 && (
                                                    <div className="h-40 flex flex-col items-center justify-center text-muted-foreground">
                                                        <Store className="w-8 h-8 mb-2 opacity-20" />
                                                        <p className="text-xs font-bold">No vendor data yet</p>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {subscriptionStats && (
                                        <Card className="border-border/40 md:col-span-2">
                                            <CardHeader>
                                                <CardTitle className="text-base font-extrabold flex items-center gap-2">
                                                    <Crown className="w-4 h-4 text-primary" /> Subscription Performance
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Total Subscribers</p>
                                                        <p className="text-2xl font-black">{subscriptionStats.totalSubscribers}</p>
                                                    </div>
                                                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-primary/10">
                                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Annual Projections</p>
                                                        <p className="text-2xl font-black text-primary">KES {subscriptionStats.estimatedAnnualRevenue.toLocaleString()}</p>
                                                    </div>
                                                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-amber-500/10">
                                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Top Plan</p>
                                                        <p className="text-2xl font-black text-amber-600">{subscriptionStats.topPlan}</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            )}
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
                                        <Select value={memberTypeFilter} onValueChange={(v) => { setMemberTypeFilter(v); setCurrentPage(1); }}>
                                            <SelectTrigger className="w-full sm:w-44 h-11 rounded-xl border-border/50">
                                                <SelectValue placeholder="Member Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Types</SelectItem>
                                                <SelectItem value="director">Directors</SelectItem>
                                                <SelectItem value="member">Members</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Members — Mobile Cards */}
                            <div className="block sm:hidden space-y-3">
                                {loadingMembers ? (
                                    <div className="flex items-center justify-center h-40">
                                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                    </div>
                                ) : !members?.members?.length ? (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                        <p className="text-sm font-bold">No members found</p>
                                    </div>
                                ) : (
                                    members.members.map((member) => (
                                        <Card key={member._id} className="border-border/40">
                                            <CardContent className="p-4">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        <Avatar className="w-10 h-10 flex-shrink-0">
                                                            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                                                                {member.name?.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="min-w-0">
                                                            <p className="font-bold text-sm truncate">{member.name}</p>
                                                            <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                                                            <p className="text-[10px] font-mono text-muted-foreground">{member.reg_no}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                                                        <RoleBadge role={member.role} />
                                                        <MemberTypeBadge memberType={member.memberType} />
                                                        {member.business && <PlanBadge plan={member.business.plan} />}
                                                    </div>
                                                </div>
                                                {member.business && (
                                                    <p className="text-xs text-muted-foreground mt-2 pl-13">{member.business.name}</p>
                                                )}
                                                <div className="flex items-center gap-1 mt-3 pt-3 border-t border-border/30 justify-end">
                                                    <Button variant="ghost" size="icon" className="w-8 h-8 text-blue-500 hover:bg-blue-50" onClick={() => openDetail(member)}>
                                                        <Eye className="w-3.5 h-3.5" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="w-8 h-8 text-purple-500 hover:bg-purple-50" onClick={() => handleRoleToggle(member)} disabled={actionLoading}>
                                                        <UserCog className="w-3.5 h-3.5" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="w-8 h-8 text-orange-500 hover:bg-orange-50" onClick={() => setResetPwTarget(member)}>
                                                        <KeyRound className="w-3.5 h-3.5" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="w-8 h-8 text-red-500 hover:bg-red-50" onClick={() => setDeleteTarget(member)}>
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                                {members && members.pagination.totalPages > 1 && (
                                    <div className="flex items-center justify-between py-2">
                                        <p className="text-xs text-muted-foreground">
                                            {((currentPage - 1) * pageLimit) + 1}–{Math.min(currentPage * pageLimit, members.pagination.total)} of {members.pagination.total}
                                        </p>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)} className="h-8 px-3 rounded-lg">
                                                <ChevronLeft className="w-4 h-4" />
                                            </Button>
                                            <Button variant="outline" size="sm" disabled={currentPage >= members.pagination.totalPages} onClick={() => setCurrentPage(p => p + 1)} className="h-8 px-3 rounded-lg">
                                                <ChevronRight className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Members Table — Desktop */}
                            <Card className="hidden sm:block border-border/40 overflow-hidden">
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
                                                        <TableCell>
                                                            <div className="flex flex-col gap-1">
                                                                <RoleBadge role={member.role} />
                                                                <MemberTypeBadge memberType={member.memberType} />
                                                            </div>
                                                        </TableCell>
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
                            {/* Applications — Mobile Cards */}
                            <div className="block sm:hidden space-y-3">
                                {loadingApplications ? (
                                    <div className="flex items-center justify-center h-40"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
                                ) : applications.length === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                        <p className="text-sm font-bold">No applications found</p>
                                    </div>
                                ) : (
                                    applications.map((app) => (
                                        <Card key={app._id} className="border-border/40">
                                            <CardContent className="p-4">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="min-w-0">
                                                        <p className="font-bold text-sm">{app.name}</p>
                                                        <p className="text-xs text-muted-foreground">{app.email}</p>
                                                        <p className="text-xs text-muted-foreground">{app.businessName}</p>
                                                        <p className="text-[11px] text-muted-foreground">{app.location}{app.subCounty ? `, ${app.subCounty}` : ''}</p>
                                                    </div>
                                                    <Badge variant={app.status === 'pending' ? 'outline' : app.status === 'approved' ? 'default' : 'destructive'} className="flex-shrink-0">
                                                        {app.status}
                                                    </Badge>
                                                </div>
                                                <div className="mt-2 flex items-center justify-between text-xs">
                                                    <span className="text-muted-foreground">KES {app.amountToPay?.toLocaleString() || '0'}</span>
                                                    <span className={app.amountPaid >= app.amountToPay && app.amountToPay > 0 ? "text-emerald-600 font-bold" : "text-muted-foreground"}>
                                                        Paid: KES {app.amountPaid?.toLocaleString() || '0'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1 mt-3 pt-3 border-t border-border/30 flex-wrap">
                                                    <Button variant="ghost" size="icon" className="w-8 h-8 text-blue-500 hover:bg-blue-50" onClick={() => openAppDetail(app)}>
                                                        <Eye className="w-3.5 h-3.5" />
                                                    </Button>
                                                    {app.status === 'pending' && (
                                                        <Button variant="ghost" size="sm" className="h-8 text-emerald-600 hover:bg-emerald-50 text-xs font-bold" onClick={() => { setPendingApproveId(app._id); setPendingApproveMemberType('member'); setApproveDialogOpen(true); }} disabled={actionLoading}>
                                                            Approve
                                                        </Button>
                                                    )}
                                                    {app.status === 'pending' && (
                                                        <Button variant="ghost" size="sm" className="h-8 text-amber-600 hover:bg-amber-50 text-xs font-bold" onClick={() => handleApplicationStatus(app._id, 'rejected')} disabled={actionLoading}>
                                                            Reject
                                                        </Button>
                                                    )}
                                                    {app.status === 'approved' && (
                                                        <Button variant="ghost" size="icon" className="w-8 h-8 text-purple-500 hover:bg-purple-50" onClick={() => handleResendEmail(app._id, 'approval')} disabled={actionLoading}>
                                                            <Mail className="w-3.5 h-3.5" />
                                                        </Button>
                                                    )}
                                                    <Button variant="ghost" size="icon" className="w-8 h-8 text-red-500 hover:bg-red-50 ml-auto" onClick={() => handleApplicationDelete(app._id)}>
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>

                            <Card className="hidden sm:block border-border/40 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-slate-50/50 dark:bg-slate-900/50">
                                                <TableHead className="font-extrabold text-xs uppercase tracking-wider">Applicant</TableHead>
                                                <TableHead className="font-extrabold text-xs uppercase tracking-wider">Business</TableHead>
                                                <TableHead className="font-extrabold text-xs uppercase tracking-wider">Location</TableHead>
                                                <TableHead className="font-extrabold text-xs uppercase tracking-wider">Payment</TableHead>
                                                <TableHead className="font-extrabold text-xs uppercase tracking-wider">Status</TableHead>
                                                <TableHead className="font-extrabold text-xs uppercase tracking-wider text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {loadingApplications ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="h-40 text-center">
                                                        <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
                                                        <p className="text-sm text-muted-foreground mt-2">Loading applications...</p>
                                                    </TableCell>
                                                </TableRow>
                                            ) : applications.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="h-40 text-center">
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
                                                            <p className="text-sm font-medium">KES {app.amountToPay?.toLocaleString() || '0'}</p>
                                                            <p className="text-[11px] text-muted-foreground">Paid: <span className={app.amountPaid >= app.amountToPay && app.amountToPay > 0 ? "text-emerald-500 font-bold" : ""}>KES {app.amountPaid?.toLocaleString() || '0'}</span></p>
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
                                                                {app.status === 'approved' && (
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="text-purple-500 hover:text-purple-600 hover:bg-purple-50"
                                                                        onClick={() => handleResendEmail(app._id, 'approval')}
                                                                        disabled={actionLoading}
                                                                        title="Resend Welcome Email"
                                                                    >
                                                                        <Mail className="w-4 h-4" />
                                                                    </Button>
                                                                )}
                                                                {app.status === 'pending' && (
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="text-amber-500 hover:text-amber-600 hover:bg-amber-50"
                                                                        onClick={() => handleResendEmail(app._id, 'confirmation')}
                                                                        disabled={actionLoading}
                                                                        title="Resend Confirmation"
                                                                    >
                                                                        <Send className="w-4 h-4" />
                                                                    </Button>
                                                                )}
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50"
                                                                    onClick={() => { setPendingApproveId(app._id); setPendingApproveMemberType('member'); setApproveDialogOpen(true); }}
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

                    {/* ═══ SELLERS TAB ════════════════════════════════════ */}
                    {activeTab === "sellers" && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            <Card className="border-border/40">
                                <CardContent className="p-4">
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Search by name, email, or business..."
                                                value={sellerSearch}
                                                onChange={(e) => setSellerSearch(e.target.value)}
                                                className="pl-10 h-11 rounded-xl border-border/50"
                                            />
                                        </div>
                                        <Select value={sellerStatusFilter} onValueChange={(v) => { setSellerStatusFilter(v); setSellerPage(1); }}>
                                            <SelectTrigger className="w-full sm:w-40 h-11 rounded-xl border-border/50">
                                                <SelectValue placeholder="Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Statuses</SelectItem>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="approved">Approved</SelectItem>
                                                <SelectItem value="rejected">Rejected</SelectItem>
                                                <SelectItem value="deactivated">Deactivated</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-border/40 overflow-hidden shadow-sm shadow-slate-200/50 dark:shadow-none">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-slate-50/80 dark:bg-slate-900/50">
                                            <TableRow className="border-border/40 hover:bg-transparent">
                                                <TableHead className="font-extrabold text-xs uppercase tracking-wider text-slate-500">Seller</TableHead>
                                                <TableHead className="font-extrabold text-xs uppercase tracking-wider text-slate-500">Business</TableHead>
                                                <TableHead className="font-extrabold text-xs uppercase tracking-wider text-slate-500">Category</TableHead>
                                                <TableHead className="font-extrabold text-xs uppercase tracking-wider text-slate-500">Status</TableHead>
                                                <TableHead className="text-right font-extrabold text-xs uppercase tracking-wider text-slate-500">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {loadingSellers ? (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="h-40 text-center">
                                                        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                                                        <p className="text-sm text-muted-foreground mt-2">Loading sellers...</p>
                                                    </TableCell>
                                                </TableRow>
                                            ) : sellers?.sellers.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="h-40 text-center">
                                                        <Store className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                                        <p className="text-sm font-bold text-muted-foreground">No sellers found</p>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                sellers?.sellers.map((seller, i) => (
                                                    <motion.tr
                                                        key={seller._id}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: i * 0.03 }}
                                                        className="border-b border-border/30 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors group"
                                                    >
                                                        <TableCell>
                                                            <div>
                                                                <p className="text-sm font-bold">{seller.firstName} {seller.lastName}</p>
                                                                <p className="text-[11px] text-muted-foreground">{seller.email}</p>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <p className="text-sm font-medium">{seller.businessName}</p>
                                                            <p className="text-[11px] text-muted-foreground truncate max-w-[150px]">{seller.businessLocation || 'No location'}</p>
                                                        </TableCell>
                                                        <TableCell>
                                                            <p className="text-xs">{seller.businessCategory}</p>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant={seller.status === 'pending' ? 'outline' : seller.status === 'approved' ? 'default' : 'destructive'}>
                                                                {seller.status}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center justify-end gap-1">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                                                                    onClick={() => openSellerDetail(seller)}
                                                                    title="View Details"
                                                                >
                                                                    <Eye className="w-4 h-4" />
                                                                </Button>
                                                                {seller.status === 'pending' && (
                                                                    <>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50"
                                                                            onClick={() => handleSellerStatusUpdate(seller._id, 'approved')}
                                                                            disabled={actionLoading}
                                                                        >
                                                                            Approve
                                                                        </Button>
                                                                    </>
                                                                )}
                                                                {(seller.status === 'approved' || seller.status === 'rejected') && (
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="text-orange-500 hover:text-orange-600 hover:bg-orange-50"
                                                                        onClick={() => handleSellerStatusUpdate(seller._id, 'deactivated')}
                                                                        disabled={actionLoading}
                                                                    >
                                                                        Deactivate
                                                                    </Button>
                                                                )}
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                                    onClick={() => handleDeleteSeller(seller._id)}
                                                                    disabled={actionLoading}
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
                                {sellers && sellers.pagination.totalPages > 1 && (
                                    <div className="p-4 border-t border-border/40 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/30">
                                        <p className="text-xs font-bold text-muted-foreground">
                                            Page {sellers.pagination.page} of {sellers.pagination.totalPages}
                                        </p>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 rounded-lg"
                                                disabled={sellers.pagination.page === 1}
                                                onClick={() => setSellerPage(p => p - 1)}
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 rounded-lg"
                                                disabled={sellers.pagination.page === sellers.pagination.totalPages}
                                                onClick={() => setSellerPage(p => p + 1)}
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        </motion.div>
                    )}

                    {/* ═══ ORDERS TAB ══════════════════════════════════════ */}
                    {activeTab === "orders" && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            {/* Order Stats Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <Card className="border-border/40 bg-gradient-to-br from-indigo-500/5 to-transparent">
                                    <CardContent className="p-4 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                                            <TrendingUp className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Total Revenue</p>
                                            <p className="text-xl font-black">KES {orderStats?.revenueLast30Days?.toLocaleString() || 0}</p>
                                            <p className="text-[10px] text-indigo-600 font-bold">LAST 30 DAYS</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="border-border/40 bg-gradient-to-br from-emerald-500/5 to-transparent">
                                    <CardContent className="p-4 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                            <Shield className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Escrow Balance</p>
                                            <p className="text-xl font-black">KES {orderStats?.escrowBalance?.toLocaleString() || 0}</p>
                                            <p className="text-[10px] text-emerald-600 font-bold">HELD FUNDS</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="border-border/40">
                                    <CardContent className="p-4 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                                            <Activity className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Total Orders</p>
                                            <p className="text-xl font-black">{orders?.pagination.total || 0}</p>
                                            <p className="text-[10px] text-blue-600 font-bold">ALL TIME</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="border-border/40">
                                    <CardContent className="p-4 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                                            <Clock className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">In Escrow</p>
                                            <p className="text-xl font-black">{orderStats?.byStatus.find((s: any) => s._id === 'PAID_ESCROW')?.count || 0}</p>
                                            <p className="text-[10px] text-amber-600 font-bold">PENDING RELEASE</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                            <Card className="border-border/40">
                                <CardContent className="p-4">
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Search by order ID or customer..."
                                                value={orderSearch}
                                                onChange={(e) => setOrderSearch(e.target.value)}
                                                className="pl-10 h-11 rounded-xl border-border/50"
                                            />
                                        </div>
                                        <Select value={orderStatusFilter} onValueChange={(v) => { setOrderStatusFilter(v); setOrderPage(1); }}>
                                            <SelectTrigger className="w-full sm:w-40 h-11 rounded-xl border-border/50">
                                                <SelectValue placeholder="Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Orders</SelectItem>
                                                <SelectItem value="PENDING">Pending</SelectItem>
                                                <SelectItem value="PAID_ESCROW">Paid (Escrow)</SelectItem>
                                                <SelectItem value="COMPLETED">Completed</SelectItem>
                                                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                                <SelectItem value="REFUNDED">Refunded</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-border/40 overflow-hidden shadow-sm">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-slate-50/80 dark:bg-slate-900/50">
                                            <TableRow className="border-border/40">
                                                <TableHead className="font-extrabold text-xs uppercase tracking-wider">Order ID</TableHead>
                                                <TableHead className="font-extrabold text-xs uppercase tracking-wider">Customer</TableHead>
                                                <TableHead className="font-extrabold text-xs uppercase tracking-wider">Vendor</TableHead>
                                                <TableHead className="font-extrabold text-xs uppercase tracking-wider">Total</TableHead>
                                                <TableHead className="font-extrabold text-xs uppercase tracking-wider">Status</TableHead>
                                                <TableHead className="font-extrabold text-xs uppercase tracking-wider text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {loadingOrders ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="h-40 text-center">
                                                        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                                                        <p className="text-sm text-muted-foreground mt-2">Loading system orders...</p>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (orders?.orders.length ?? 0) === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="h-40 text-center">
                                                        <CreditCard className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-20" />
                                                        <p className="text-sm font-bold text-muted-foreground">No orders found</p>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                orders?.orders.map((order, i) => (
                                                    <motion.tr
                                                        key={order._id}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: i * 0.03 }}
                                                        className="border-b border-border/30 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors"
                                                    >
                                                        <TableCell className="font-mono text-xs font-bold text-primary">
                                                            {order._id.substring(0, 8).toUpperCase()}
                                                        </TableCell>
                                                        <TableCell>
                                                            <p className="text-sm font-bold">{order.buyerId?.name || 'Guest'}</p>
                                                            <p className="text-[10px] text-muted-foreground">{order.buyerId?.email || 'No email'}</p>
                                                        </TableCell>
                                                        <TableCell>
                                                            <p className="text-sm font-medium">{order.vendorId?.name || 'Unknown'}</p>
                                                        </TableCell>
                                                        <TableCell className="font-black">
                                                            KES {order.amount.toLocaleString()}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant={
                                                                order.status === 'COMPLETED' ? 'default' : 
                                                                order.status === 'PAID_ESCROW' ? 'outline' : 
                                                                order.status === 'CANCELLED' ? 'destructive' : 'secondary'
                                                            }>
                                                                {order.status.replace('_', ' ')}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                {order.status === 'PAID_ESCROW' && (
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="h-8 rounded-lg bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                                                        onClick={() => handleReleaseEscrow(order._id)}
                                                                        disabled={releasingOrders.has(order._id)}
                                                                    >
                                                                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Release Escrow
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                    </motion.tr>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                                {orders && orders.pagination.totalPages > 1 && (
                                    <div className="p-4 border-t border-border/40 flex items-center justify-between bg-slate-50/50">
                                        <p className="text-xs font-bold text-muted-foreground">
                                            Page {orders.pagination.page} of {orders.pagination.totalPages}
                                        </p>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={orders.pagination.page === 1}
                                                onClick={() => setOrderPage(p => p - 1)}
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={orders.pagination.page === orders.pagination.totalPages}
                                                onClick={() => setOrderPage(p => p + 1)}
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        </motion.div>
                    )}

                    {/* ═══ SUBSCRIPTIONS TAB ═══════════════════════════════ */}
                    {activeTab === "subscriptions" && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            {/* Subscription Stats Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <Card className="border-border/40 bg-gradient-to-br from-primary/5 to-transparent">
                                    <CardContent className="p-4 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                            <Users className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Total Subscribers</p>
                                            <p className="text-xl font-black">{subscriptionStats?.totalSubscribers || 0}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="border-border/40 bg-gradient-to-br from-emerald-500/5 to-transparent">
                                    <CardContent className="p-4 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                            <BarChart3 className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Est. Annual Revenue</p>
                                            <p className="text-xl font-black">KES {subscriptionStats?.estimatedAnnualRevenue?.toLocaleString() || 0}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="border-border/40 bg-gradient-to-br from-amber-500/5 to-transparent">
                                    <CardContent className="p-4 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                                            <Crown className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Top Plan</p>
                                            <p className="text-xl font-black">{subscriptionStats?.activeSubscribersByPlan[0]?._id || "None"}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <Tabs defaultValue="plans" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 mb-6">
                                    <TabsTrigger value="plans">Membership Plans</TabsTrigger>
                                    <TabsTrigger value="subscribers">Active Subscribers</TabsTrigger>
                                </TabsList>

                                <TabsContent value="plans" className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-black tracking-tight">Manage Plans</h3>
                                        <Button onClick={() => { setSelectedPlan(null); setPlanForm({ name: "", price: 0, features: [], isActive: true }); setPlanEditOpen(true); }} className="rounded-xl shadow-lg shadow-primary/20">
                                            <Plus className="w-4 h-4 mr-2" /> Create New Plan
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {loadingPlans ? (
                                            <div className="col-span-full h-60 flex items-center justify-center">
                                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                            </div>
                                        ) : plans.map((plan) => (
                                            <Card key={plan._id} className="border-border/40 overflow-hidden group hover:shadow-xl transition-all duration-300">
                                                <div className={`h-2 w-full bg-primary ${!plan.isActive ? 'grayscale' : ''}`} />
                                                <CardHeader>
                                                    <div className="flex items-center justify-between">
                                                        <CardTitle className="font-black text-2xl">{plan.name}</CardTitle>
                                                        <Badge variant={plan.isActive ? 'default' : 'secondary'}>
                                                            {plan.isActive ? 'Active' : 'Disabled'}
                                                        </Badge>
                                                    </div>
                                                    <div className="mt-2">
                                                        <span className="text-3xl font-black">KES {plan.price.toLocaleString()}</span>
                                                        <span className="text-muted-foreground text-xs font-bold ml-1 uppercase">/ Year</span>
                                                    </div>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-3 min-h-[150px]">
                                                        {plan.features.map((feature, idx) => (
                                                            <div key={idx} className="flex items-start gap-2">
                                                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />
                                                                <span className="text-sm font-medium">{feature}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="flex gap-2 mt-6">
                                                        <Button 
                                                            variant="outline" 
                                                            className="flex-1 rounded-xl"
                                                            onClick={() => { setSelectedPlan(plan); setPlanForm(plan); setPlanEditOpen(true); }}
                                                        >
                                                            <Pencil className="w-4 h-4 mr-2" /> Edit Plan
                                                        </Button>
                                                        <Button 
                                                            variant="ghost" 
                                                            className="w-10 h-10 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
                                                            onClick={() => handleDeletePlan(plan._id)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </TabsContent>

                                <TabsContent value="subscribers" className="space-y-6">
                                    <Card className="border-border/40">
                                        <CardContent className="p-4">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    placeholder="Search subscribers by business name..."
                                                    value={subSearch}
                                                    onChange={(e) => setSubSearch(e.target.value)}
                                                    className="pl-10 h-11 rounded-xl border-border/50"
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-border/40 overflow-hidden">
                                        <Table>
                                            <TableHeader className="bg-slate-50/80 dark:bg-slate-900/50">
                                                <TableRow>
                                                    <TableHead className="font-extrabold text-xs uppercase tracking-wider">Business</TableHead>
                                                    <TableHead className="font-extrabold text-xs uppercase tracking-wider">Owner</TableHead>
                                                    <TableHead className="font-extrabold text-xs uppercase tracking-wider">Plan</TableHead>
                                                    <TableHead className="font-extrabold text-xs uppercase tracking-wider">Status</TableHead>
                                                    <TableHead className="font-extrabold text-xs uppercase tracking-wider">Joined</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {loadingSubscribers ? (
                                                    <TableRow>
                                                        <TableCell colSpan={5} className="h-40 text-center">
                                                            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                                                        </TableCell>
                                                    </TableRow>
                                                ) : subscribers?.subscribers.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={5} className="h-40 text-center text-muted-foreground">
                                                            No active subscribers found
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    subscribers?.subscribers.map((sub: any) => (
                                                        <TableRow key={sub._id}>
                                                            <TableCell className="font-bold">{sub.name}</TableCell>
                                                            <TableCell>
                                                                <p className="text-sm font-medium">{sub.userId?.name}</p>
                                                                <p className="text-xs text-muted-foreground">{sub.userId?.email}</p>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge variant="outline" className="bg-primary/5">
                                                                    {sub.subscriptionPlanId?.name}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                                                                    Active
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="text-sm text-muted-foreground">
                                                                {new Date(sub.createdAt).toLocaleDateString()}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                        {subscribers && subscribers.pagination.totalPages > 1 && (
                                            <div className="p-4 border-t border-border/40 flex items-center justify-between">
                                                <p className="text-xs font-bold text-muted-foreground">
                                                    Page {subPage} of {subscribers.pagination.totalPages}
                                                </p>
                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="sm" disabled={subPage === 1} onClick={() => setSubPage(p => p - 1)}>
                                                        <ChevronLeft className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="outline" size="sm" disabled={subPage === subscribers.pagination.totalPages} onClick={() => setSubPage(p => p + 1)}>
                                                        <ChevronRight className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </motion.div>
                    )}

                    {/* ═══ BULK IMPORT TAB ═══════════════════════════════════ */}
                    {activeTab === "bulk-import" && (
                        <BulkImportTab />
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

                    {activeTab === "attachments" && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-black">Student Attachment Requests</h2>
                                    <p className="text-muted-foreground text-sm mt-1">{attachmentPagination.total} total requests</p>
                                </div>
                                <Select value={attachmentStatusFilter} onValueChange={(v) => setAttachmentStatusFilter(v === 'all' ? '' : v)}>
                                    <SelectTrigger className="w-44"><SelectValue placeholder="All Statuses" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="matchmaking">Matchmaking</SelectItem>
                                        <SelectItem value="placed">Placed</SelectItem>
                                        <SelectItem value="rejected">Rejected</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {attachmentsLoading ? (
                                <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                            ) : attachments.length === 0 ? (
                                <div className="text-center py-16 text-muted-foreground">No attachment requests found</div>
                            ) : (
                                <div className="space-y-4">
                                    {attachments.map(req => (
                                        <Card key={req._id} className="rounded-2xl border border-border/60">
                                            <CardContent className="p-6">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-lg">{req.studentName}</span>
                                                            <AttachmentStatusBadge status={req.status} />
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">{req.institution} · {req.course}</p>
                                                        <p className="text-xs text-muted-foreground">{req.studentEmail} · {req.studentPhone}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {new Date(req.attachmentStartDate).toLocaleDateString()} – {new Date(req.attachmentEndDate).toLocaleDateString()}
                                                            {req.matchRequests.length > 0 && ` · ${req.matchRequests.length} business${req.matchRequests.length > 1 ? 'es' : ''} contacted`}
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-2 flex-wrap">
                                                        {req.documents.length > 0 && (
                                                            <Button size="sm" variant="outline" className="rounded-xl" asChild>
                                                                <a href={req.documents[0]} target="_blank" rel="noopener noreferrer">
                                                                    <FileText className="w-4 h-4 mr-1" /> Documents ({req.documents.length})
                                                                </a>
                                                            </Button>
                                                        )}
                                                        <Button size="sm" variant="outline" className="rounded-xl" onClick={() => { setSelectedAttachment(req); setMatchmakeBusinessIds([]); setMatchmakeOpen(true); }}>
                                                            <Users className="w-4 h-4 mr-1" /> Matchmake
                                                        </Button>
                                                    </div>
                                                </div>
                                                {req.matchRequests.length > 0 && (
                                                    <div className="mt-4 pt-4 border-t border-border/60">
                                                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Match Requests</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {req.matchRequests.map(m => (
                                                                <span key={m._id} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${m.status === 'accepted'
                                                                    ? 'bg-green-500/10 text-green-700 border-green-500/20'
                                                                    : m.status === 'declined'
                                                                        ? 'bg-red-500/10 text-red-700 border-red-500/20'
                                                                        : 'bg-amber-500/10 text-amber-700 border-amber-500/20'
                                                                    }`}>
                                                                    {m.businessName} · {m.status}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}

                            <Dialog open={matchmakeOpen} onOpenChange={setMatchmakeOpen}>
                                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Matchmake: {selectedAttachment?.studentName}</DialogTitle>
                                        <DialogDescription>
                                            Select businesses to send this attachment request to. Selected businesses will see this request in their dashboard.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-2 max-h-96 overflow-y-auto">
                                        {(members?.members || []).filter(m => m.business && m.role !== 'admin').map(member => {
                                            const bizId = member.business?._id;
                                            if (!bizId) return null;
                                            const selected = matchmakeBusinessIds.includes(bizId);
                                            const alreadySent = selectedAttachment?.matchRequests.some(r => r.businessId === bizId);
                                            return (
                                                <div key={member._id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'} ${alreadySent ? 'opacity-50 pointer-events-none' : ''}`}
                                                    onClick={() => {
                                                        if (alreadySent) return;
                                                        setMatchmakeBusinessIds(prev =>
                                                            prev.includes(bizId) ? prev.filter(id => id !== bizId) : [...prev, bizId]
                                                        );
                                                    }}>
                                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${selected ? 'bg-primary border-primary' : 'border-muted-foreground'}`}>
                                                        {(selected || alreadySent) && <CheckCircle2 className="w-3 h-3 text-white" />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-sm truncate">{member.business?.name || member.name}</p>
                                                        <p className="text-xs text-muted-foreground truncate">{member.business?.category} · {member.email}</p>
                                                    </div>
                                                    {alreadySent && <Badge variant="secondary" className="text-xs">Already sent</Badge>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => { setMatchmakeOpen(false); setMatchmakeBusinessIds([]); }}>Cancel</Button>
                                        <Button disabled={matchmakeBusinessIds.length === 0 || matchmakeLoading} onClick={async () => {
                                            if (!selectedAttachment) return;
                                            setMatchmakeLoading(true);
                                            try {
                                                await attachmentService.adminMatchmake(selectedAttachment._id, matchmakeBusinessIds);
                                                toast({ title: `Sent to ${matchmakeBusinessIds.length} business(es)` });
                                                setMatchmakeOpen(false);
                                                setMatchmakeBusinessIds([]);
                                                fetchAttachments();
                                            } catch {
                                                toast({ title: 'Matchmaking failed', variant: 'destructive' });
                                            } finally {
                                                setMatchmakeLoading(false);
                                            }
                                        }}>
                                            {matchmakeLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                            Send to {matchmakeBusinessIds.length} Business{matchmakeBusinessIds.length !== 1 ? 'es' : ''}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    )}
                    {/* ═══ MEETINGS TAB ════════════════════════════════════ */}
                    {activeTab === "meetings" && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            {/* Toolbar */}
                            <div className="flex items-center justify-between gap-4 flex-wrap">
                                <div className="flex gap-2">
                                    {(['month', 'week', 'day'] as const).map(v => (
                                        <Button
                                            key={v}
                                            variant={calendarView === v ? 'default' : 'outline'}
                                            size="sm"
                                            className="rounded-xl font-bold capitalize"
                                            onClick={() => setCalendarView(v)}
                                        >
                                            {v}
                                        </Button>
                                    ))}
                                </div>
                                <Button className="rounded-xl font-bold" onClick={openCreateMeeting}>
                                    <Plus className="w-4 h-4 mr-2" /> New Meeting
                                </Button>
                            </div>

                            {/* react-big-calendar */}
                            <Card className="border-border/40 overflow-hidden">
                                <CardContent className="p-4">
                                    {loadingMeetings ? (
                                        <div className="flex items-center justify-center h-64">
                                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                        </div>
                                    ) : (
                                        <div style={{ height: 600 }}>
                                            <BigCalendar
                                                localizer={localizer}
                                                events={meetings
                                                    .filter(m => m.status !== 'cancelled')
                                                    .map(m => ({
                                                        id: m._id,
                                                        title: `${m.targetGroup === 'directors' ? '★ ' : ''}${m.title}`,
                                                        start: new Date(m.startDateTime),
                                                        end: m.endDateTime ? new Date(m.endDateTime) : new Date(new Date(m.startDateTime).getTime() + 60 * 60 * 1000),
                                                        resource: m,
                                                    }))}
                                                view={calendarView as any}
                                                onView={(v) => setCalendarView(v)}
                                                onSelectEvent={(event: any) => openEditMeeting(event.resource)}
                                                style={{ height: '100%' }}
                                                eventPropGetter={(event: any) => ({
                                                    style: {
                                                        backgroundColor: event.resource.targetGroup === 'directors' ? '#d97706' : '#2563eb',
                                                        borderRadius: '8px',
                                                        border: 'none',
                                                        fontWeight: 'bold',
                                                        fontSize: '12px',
                                                    }
                                                })}
                                            />
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Meetings List */}
                            <Card className="border-border/40">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base font-extrabold flex items-center gap-2">
                                        <CalendarDays className="w-4 h-4 text-primary" /> All Meetings
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {meetings.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <Calendar className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                            <p className="text-sm font-bold">No meetings scheduled</p>
                                            <p className="text-xs">Click "New Meeting" to get started.</p>
                                        </div>
                                    ) : (
                                        meetings.map(m => (
                                            <div key={m._id} className={`flex items-start justify-between gap-4 p-4 rounded-xl border transition-colors ${m.status === 'cancelled' ? 'opacity-50 bg-slate-50/50 dark:bg-slate-900/20 border-border/20' : 'bg-white dark:bg-slate-900 border-border/40 hover:border-primary/20'}`}>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                                        <p className="font-bold text-sm">{m.title}</p>
                                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${m.targetGroup === 'directors' ? 'bg-amber-500/10 border-amber-500/20 text-amber-600' : 'bg-blue-500/10 border-blue-500/20 text-blue-600'}`}>
                                                            {m.targetGroup === 'directors' ? <Star className="w-2.5 h-2.5" /> : <Users className="w-2.5 h-2.5" />}
                                                            {m.targetGroup === 'directors' ? 'Directors Only' : 'Everyone'}
                                                        </span>
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${m.status === 'scheduled' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' : m.status === 'cancelled' ? 'bg-red-500/10 border-red-500/20 text-red-600' : 'bg-slate-500/10 border-slate-500/20 text-slate-600'}`}>
                                                            {m.status}
                                                        </span>
                                                        {m.notificationsSent && (
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border bg-green-500/10 border-green-500/20 text-green-600">
                                                                <Bell className="w-2.5 h-2.5" /> Notified
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        {new Date(m.startDateTime).toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' })}
                                                        {m.endDateTime && ` – ${new Date(m.endDateTime).toLocaleTimeString('en-KE', { timeStyle: 'short' })}`}
                                                    </p>
                                                    {m.location && <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" /> {m.location}</p>}
                                                    {m.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{m.description}</p>}
                                                </div>
                                                {m.status !== 'cancelled' && (
                                                    <div className="flex items-center gap-1 flex-shrink-0">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-xs font-bold h-8 rounded-xl text-blue-600 hover:bg-blue-50"
                                                            onClick={() => openEditMeeting(m)}
                                                        >
                                                            <Pencil className="w-3 h-3 mr-1" /> Edit
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className={`text-xs font-bold h-8 rounded-xl ${m.notificationsSent ? 'text-muted-foreground' : 'text-emerald-600 hover:bg-emerald-50'}`}
                                                            onClick={() => handleSendNotifications(m._id)}
                                                            disabled={!!sendingNotification}
                                                        >
                                                            {sendingNotification === m._id ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Bell className="w-3 h-3 mr-1" />}
                                                            {m.notificationsSent ? 'Resend' : 'Notify'}
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="w-8 h-8 text-red-500 hover:bg-red-50"
                                                            onClick={() => handleCancelMeeting(m._id)}
                                                            title="Cancel Meeting"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </CardContent>
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

                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="w-24 h-24 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-border/60 flex items-center justify-center overflow-hidden relative group">
                                                        {selectedMember.business?.coverImageUrl ? (
                                                            <img src={selectedMember.business.coverImageUrl} alt="Cover" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <Building2 className="w-8 h-8 text-muted-foreground/40" />
                                                        )}

                                                        {fileUploading.coverImage && (
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
                                                            onChange={(e) => handleFileChange(e, 'coverImage')}
                                                            disabled={fileUploading.coverImage}
                                                        />
                                                        <Button variant="outline" size="sm" className="text-[10px] font-bold h-7 rounded-lg">
                                                            <Upload className="w-3 h-3 mr-1.5" /> {selectedMember.business?.coverImageUrl ? "Change Cover" : "Upload Cover"}
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
                                                        <Select
                                                            value={editForm.category}
                                                            onValueChange={(value) => setEditForm({ ...editForm, category: value })}
                                                        >
                                                            <SelectTrigger className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-border/50">
                                                                <SelectValue placeholder="Select category" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {BUSINESS_CATEGORIES.map((category) => (
                                                                    <SelectItem key={category} value={category}>
                                                                        {category}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
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
                                                <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Amount Required (Ksh)</label>
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
                                                <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Amount Paid (Ksh)</label>
                                                {isAppEditing ? (
                                                    <Input
                                                        type="number"
                                                        value={appEditForm.amountPaid}
                                                        onChange={(e) => setAppEditForm({ ...appEditForm, amountPaid: parseInt(e.target.value) || 0 })}
                                                        className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-border/50 font-bold"
                                                    />
                                                ) : (
                                                    <div className="h-11 flex items-center px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-border/20 font-extrabold text-lg text-emerald-500">
                                                        {(selectedApplication.amountPaid || 0).toLocaleString()}
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
                                        {selectedApplication.status === 'pending' && (
                                            <Button
                                                className="h-12 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold"
                                                onClick={() => {
                                                    const amountRequired = selectedApplication.amountToPay || 0;
                                                    const amountPaid = selectedApplication.amountPaid || 0;

                                                    if (selectedApplication.paymentMethod === 'Not Set' || selectedApplication.paymentStatus === 'Pending' || amountPaid < amountRequired) {
                                                        toast({
                                                            title: "Payment Incomplete",
                                                            description: `Approval requires full payment. Required: Ksh ${amountRequired.toLocaleString()}, Paid: Ksh ${amountPaid.toLocaleString()}`,
                                                            variant: "destructive"
                                                        });
                                                        return;
                                                    }
                                                    handleApplicationStatus(selectedApplication._id, 'approved');
                                                    setAppDetailOpen(false);
                                                }}
                                                disabled={actionLoading}
                                            >
                                                <CheckCircle2 className="w-4 h-4 mr-2" /> Approve Application
                                            </Button>
                                        )}
                                        {selectedApplication.status === 'approved' && (
                                            <Button
                                                variant="outline"
                                                className="h-12 px-8 rounded-xl border-primary text-primary hover:bg-primary/5 font-bold"
                                                onClick={() => handleResendEmail(selectedApplication._id, 'approval')}
                                                disabled={actionLoading}
                                            >
                                                <Mail className="w-4 h-4 mr-2" /> Resend Welcome Email
                                            </Button>
                                        )}
                                        {selectedApplication.status === 'pending' && (
                                            <>
                                                <Button
                                                    variant="outline"
                                                    className="h-12 px-8 rounded-xl border-amber-200 text-amber-600 hover:bg-amber-50 font-bold"
                                                    onClick={() => { handleApplicationStatus(selectedApplication._id, 'rejected'); setAppDetailOpen(false); }}
                                                    disabled={actionLoading}
                                                >
                                                    <XCircle className="w-4 h-4 mr-2" /> Reject
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="h-12 px-6 rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50 font-bold"
                                                    onClick={() => handleResendEmail(selectedApplication._id, 'confirmation')}
                                                    disabled={actionLoading}
                                                >
                                                    <Send className="w-4 h-4 mr-2" /> Resend Confirmation
                                                </Button>
                                            </>
                                        )}
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
            <Dialog open={!!resetPwTarget} onOpenChange={(open) => { if (!open) { setResetPwTarget(null); setNewPassword(""); setShowPassword(false); } }}>
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
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="h-12 rounded-xl pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
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
            {/* ─── Plan Management Dialog ────────────────────────────────  */}
            <Dialog open={planEditOpen} onOpenChange={setPlanEditOpen}>
                <DialogContent className="max-w-md rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="font-extrabold flex items-center gap-2">
                            <Plus className="w-5 h-5 text-primary" /> {selectedPlan ? "Edit Membership Plan" : "Create New Plan"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-2">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Plan Name</label>
                            <Input 
                                placeholder="e.g. Gold Membership" 
                                value={planForm.name} 
                                onChange={e => setPlanForm({ ...planForm, name: e.target.value })} 
                                className="h-11 rounded-xl" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Price (KES/Year)</label>
                            <Input 
                                type="number"
                                placeholder="e.g. 5000" 
                                value={planForm.price} 
                                onChange={e => setPlanForm({ ...planForm, price: parseInt(e.target.value) || 0 })} 
                                className="h-11 rounded-xl" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Features (One per line)</label>
                                <Textarea 
                                    placeholder="Feature 1\nFeature 2..." 
                                    value={(planForm.features || []).join("\n")} 
                                    onChange={e => setPlanForm({ ...planForm, features: e.target.value.split("\n").filter(f => f.trim()) })} 
                                    className="min-h-[80px] rounded-xl" 
                                />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Plan Description (Rich Text)</label>
                            <div className="rounded-xl border border-border/50 overflow-hidden bg-white dark:bg-slate-950">
                                <ReactQuill 
                                    theme="snow" 
                                    value={planForm.description || ""} 
                                    onChange={(val) => setPlanForm({ ...planForm, description: val })}
                                    placeholder="Detailed description of the plan benefits..."
                                    className="h-40 mb-10"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                            <input 
                                type="checkbox" 
                                id="planActive" 
                                checked={planForm.isActive} 
                                onChange={e => setPlanForm({ ...planForm, isActive: e.target.checked })}
                                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <label htmlFor="planActive" className="text-sm font-bold">This plan is active and visible</label>
                        </div>
                    </div>
                    <DialogFooter className="mt-6">
                        <Button variant="ghost" onClick={() => setPlanEditOpen(false)}>Cancel</Button>
                        <Button 
                            onClick={handleSavePlan} 
                            disabled={loadingPlans || !(planForm.name || "").trim()} 
                            className="rounded-xl shadow-lg shadow-primary/20"
                        >
                            {loadingPlans ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            {selectedPlan ? "Update Plan" : "Create Plan"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ─── Seller Detail Modal ───────────────────────────────────────  */}
            <Dialog open={sellerDetailOpen} onOpenChange={setSellerDetailOpen}>
                <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="font-extrabold flex items-center gap-2">
                            <Store className="w-5 h-5 text-primary" /> Seller Details
                        </DialogTitle>
                        <DialogDescription>
                            Review marketplace seller account information.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedSeller && (
                        <div className="space-y-6 mt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Owner Name</p>
                                    <p className="font-medium">{selectedSeller.firstName} {selectedSeller.lastName}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email</p>
                                    <p className="font-medium">{selectedSeller.email}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Phone</p>
                                    <p className="font-medium">{selectedSeller.phone || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</p>
                                    <Badge variant={selectedSeller.status === 'pending' ? 'outline' : selectedSeller.status === 'approved' ? 'default' : 'destructive'}>
                                        {selectedSeller.status}
                                    </Badge>
                                </div>
                            </div>
                            
                            <div className="border-t border-border/40 pt-4">
                                <h4 className="font-bold mb-3 flex items-center gap-2"><Building2 className="w-4 h-4 text-primary" /> Business Details</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Business Name</p>
                                        <p className="font-medium">{selectedSeller.businessName}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Category</p>
                                        <p className="font-medium">{selectedSeller.businessCategory}</p>
                                    </div>
                                    <div className="col-span-2 space-y-1">
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Description</p>
                                        <p className="text-sm">{selectedSeller.businessDescription || 'N/A'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Location</p>
                                        <p className="text-sm">{selectedSeller.businessLocation || 'N/A'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Website</p>
                                        <p className="text-sm">{selectedSeller.businessWebsite || 'N/A'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">KRA PIN</p>
                                        <p className="font-medium">{selectedSeller.kraPin || 'N/A'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Reg No.</p>
                                        <p className="font-medium">{selectedSeller.businessRegistrationNo || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {selectedSeller.status === 'pending' && (
                                <div className="border-t border-border/40 pt-4 space-y-3">
                                    <h4 className="font-bold flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" /> Admin Actions</h4>
                                    <div className="flex gap-2">
                                        <Button
                                            className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl flex-1"
                                            onClick={() => {
                                                setSellerDetailOpen(false);
                                                handleSellerStatusUpdate(selectedSeller._id, 'approved');
                                            }}
                                            disabled={actionLoading}
                                        >
                                            <CheckCircle2 className="w-4 h-4 mr-2" /> Approve Seller
                                        </Button>
                                    </div>
                                    <div className="space-y-2 mt-4 p-4 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-100 dark:border-red-900/30">
                                        <label className="text-xs font-bold text-red-800 dark:text-red-400">Reject Application</label>
                                        <Textarea 
                                            placeholder="Reason for rejection (optional)..." 
                                            value={sellerRejectionReason}
                                            onChange={(e) => setSellerRejectionReason(e.target.value)}
                                            className="min-h-[80px] bg-white dark:bg-slate-900 rounded-xl text-sm"
                                        />
                                        <Button
                                            variant="outline"
                                            className="w-full border-red-200 text-red-600 hover:bg-red-100 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/40 rounded-xl"
                                            onClick={() => {
                                                setSellerDetailOpen(false);
                                                handleSellerStatusUpdate(selectedSeller._id, 'rejected');
                                            }}
                                            disabled={actionLoading}
                                        >
                                            <XCircle className="w-4 h-4 mr-2" /> Reject Seller
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* ─── Verify Payment Dialog ───────────────────────────────────  */}
            {/* ─── Approve Application Dialog ──────────────────────────────  */}
            <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
                <DialogContent className="max-w-md rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="font-extrabold">Approve Application</DialogTitle>
                        <DialogDescription>
                            Before approving, assign this person's member type. This determines which meetings and features they can access.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Member Type</label>
                            <Select value={pendingApproveMemberType} onValueChange={(v) => setPendingApproveMemberType(v as 'director' | 'member')}>
                                <SelectTrigger className="h-11 rounded-xl border-border/50">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="member">Member — Regular member access</SelectItem>
                                    <SelectItem value="director">Director — Senior member, invited to director meetings</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className={`p-3 rounded-xl border ${pendingApproveMemberType === 'director' ? 'bg-amber-500/10 border-amber-500/20' : 'bg-sky-500/10 border-sky-500/20'}`}>
                            <p className="text-xs font-bold text-muted-foreground">
                                {pendingApproveMemberType === 'director'
                                    ? '★ Directors receive invitations to Director-only meetings as well as All-member meetings.'
                                    : 'Members receive invitations to All-member meetings only.'}
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="rounded-xl" onClick={() => setApproveDialogOpen(false)}>Cancel</Button>
                        <Button
                            className="rounded-xl font-bold"
                            disabled={actionLoading}
                            onClick={() => {
                                setApproveDialogOpen(false);
                                handleApplicationStatus(pendingApproveId, 'approved', pendingApproveMemberType);
                            }}
                        >
                            {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                            Confirm Approval
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ─── Create / Edit Meeting Dialog ────────────────────────────  */}
            <Dialog open={meetingModalOpen} onOpenChange={setMeetingModalOpen}>
                <DialogContent className="max-w-lg rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="font-extrabold">{editingMeeting ? 'Edit Meeting' : 'Create Meeting'}</DialogTitle>
                        <DialogDescription>
                            {editingMeeting ? 'Update the meeting details or reschedule.' : 'Schedule a new meeting for directors, members or everyone.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Title *</label>
                            <Input value={meetingForm.title} onChange={(e) => setMeetingForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Q1 Board Meeting" className="h-11 rounded-xl" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase text-muted-foreground">Start Date & Time *</label>
                                <Input type="datetime-local" value={meetingForm.startDateTime} onChange={(e) => setMeetingForm(f => ({ ...f, startDateTime: e.target.value }))} className="h-11 rounded-xl" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase text-muted-foreground">End Date & Time</label>
                                <Input type="datetime-local" value={meetingForm.endDateTime} onChange={(e) => setMeetingForm(f => ({ ...f, endDateTime: e.target.value }))} className="h-11 rounded-xl" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Location</label>
                            <Input value={meetingForm.location} onChange={(e) => setMeetingForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g. KNCCI Boardroom, Eldoret" className="h-11 rounded-xl" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                                Virtual Meeting Link
                                <span className="text-[10px] font-normal text-muted-foreground normal-case">(Google Meet or Zoom — optional)</span>
                            </label>
                            <Input
                                value={meetingForm.meetingLink}
                                onChange={(e) => setMeetingForm(f => ({ ...f, meetingLink: e.target.value }))}
                                placeholder="https://meet.google.com/xxx or https://zoom.us/j/xxx"
                                className="h-11 rounded-xl"
                                type="url"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Invite</label>
                            <Select value={meetingForm.targetGroup} onValueChange={(v) => setMeetingForm(f => ({ ...f, targetGroup: v as MeetingTargetGroup }))}>
                                <SelectTrigger className="h-11 rounded-xl">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Everyone (Directors + Members)</SelectItem>
                                    <SelectItem value="directors">Directors Only</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {editingMeeting && (
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase text-muted-foreground">Status</label>
                                <Select value={meetingForm.status} onValueChange={(v) => setMeetingForm(f => ({ ...f, status: v as MeetingStatus }))}>
                                    <SelectTrigger className="h-11 rounded-xl">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="scheduled">Scheduled</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Description</label>
                            <Textarea value={meetingForm.description} onChange={(e) => setMeetingForm(f => ({ ...f, description: e.target.value }))} placeholder="Optional agenda or notes..." className="rounded-xl resize-none" rows={3} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="rounded-xl" onClick={() => setMeetingModalOpen(false)}>Cancel</Button>
                        <Button className="rounded-xl font-bold" disabled={savingMeeting} onClick={handleSaveMeeting}>
                            {savingMeeting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            {editingMeeting ? 'Save Changes' : 'Create Meeting'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={verifyPaymentOpen} onOpenChange={setVerifyPaymentOpen}>
                <DialogContent className="max-w-md rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="font-extrabold flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-primary" /> Verify Payment
                        </DialogTitle>
                        <DialogDescription>
                            Update payment details for {selectedSeller?.firstName} {selectedSeller?.lastName}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-2">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Amount Paid (KES)</label>
                            <Input
                                type="number"
                                placeholder="0"
                                value={verifyPaymentForm.amountPaid}
                                onChange={(e) => setVerifyPaymentForm({ ...verifyPaymentForm, amountPaid: Number(e.target.value) })}
                                className="h-11 rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Payment Method</label>
                            <Input
                                placeholder="e.g. MPesa, Bank Transfer"
                                value={verifyPaymentForm.paymentMethod}
                                onChange={(e) => setVerifyPaymentForm({ ...verifyPaymentForm, paymentMethod: e.target.value })}
                                className="h-11 rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Payment Status</label>
                            <Select
                                value={verifyPaymentForm.paymentStatus}
                                onValueChange={(v) => setVerifyPaymentForm({ ...verifyPaymentForm, paymentStatus: v as any })}
                            >
                                <SelectTrigger className="h-11 rounded-xl">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="partial">Partial</SelectItem>
                                    <SelectItem value="paid">Paid</SelectItem>
                                    <SelectItem value="verified">Verified</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Transaction Reference</label>
                            <Input
                                placeholder="e.g. MPESA12345"
                                value={verifyPaymentForm.transactionReference}
                                onChange={(e) => setVerifyPaymentForm({ ...verifyPaymentForm, transactionReference: e.target.value })}
                                className="h-11 rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Payment Date</label>
                            <Input
                                type="date"
                                value={verifyPaymentForm.paymentDate}
                                onChange={(e) => setVerifyPaymentForm({ ...verifyPaymentForm, paymentDate: e.target.value })}
                                className="h-11 rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Notes</label>
                            <Textarea
                                placeholder="Optional notes..."
                                value={verifyPaymentForm.paymentNotes}
                                onChange={(e) => setVerifyPaymentForm({ ...verifyPaymentForm, paymentNotes: e.target.value })}
                                className="min-h-[80px] rounded-xl"
                            />
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <Button variant="ghost" onClick={() => setVerifyPaymentOpen(false)}>Cancel</Button>
                        <Button
                            onClick={() => selectedSeller && handleVerifyPayment(selectedSeller._id)}
                            disabled={actionLoading || !verifyPaymentForm.paymentMethod}
                            className="rounded-xl gap-1.5"
                        >
                            {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                            Update Payment
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div >
    );
}
