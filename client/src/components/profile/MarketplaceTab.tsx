import { motion, AnimatePresence } from "framer-motion";
import {
    Store,
    Briefcase,
    Shield,
    CheckCircle2,
    XCircle,
    Edit,
    KeyRound,
    Eye,
    EyeOff,
    Loader2,
    Package,
    ShoppingCart,
    DollarSign,
    ShieldCheck,
    Wallet,
    LayoutDashboard,
    Settings,
    FileText,
    ExternalLink,
    Activity,
    Plus,
    Upload,
    Trash2,
    AlertCircle,
    ChevronRight
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { cmsService, CmsStatus, CmsDashboard, CmsProduct, CmsCategory, CmsOrder, CmsService, CmsBlogPost } from "@/services/cms-service";
import { BusinessData } from "@/services/business-service";

interface MarketplaceTabProps {
    business: BusinessData | null;
    user: { name: string; email: string; phone?: string;[key: string]: any };
    onBusinessTabSwitch: () => void;
}

export function MarketplaceTab({ business, user, onBusinessTabSwitch }: MarketplaceTabProps) {
    const [cmsStatus, setCmsStatus] = useState<CmsStatus | null>(null);
    const [dashboard, setDashboard] = useState<CmsDashboard | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSessionExpired, setIsSessionExpired] = useState(false);
    const [loginPassword, setLoginPassword] = useState("");
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [showLoginPassword, setShowLoginPassword] = useState(false);

    const [connecting, setConnecting] = useState(false);
    const [cmsPassword, setCmsPassword] = useState("");
    const [cmsConfirmPassword, setCmsConfirmPassword] = useState("");
    const [showCmsPassword, setShowCmsPassword] = useState(false);
    const [cmsAmountPaid, setCmsAmountPaid] = useState("");
    const [cmsPaymentMethod, setCmsPaymentMethod] = useState<'mpesa' | 'bank' | 'cash' | 'other'>('mpesa');
    const [cmsTransactionRef, setCmsTransactionRef] = useState("");
    const [addingProduct, setAddingProduct] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: "", description: "", price: "", category: "", stock: "", unit: "" });
    const [selectedProduct, setSelectedProduct] = useState<CmsProduct | null>(null);
    const [isEditingProduct, setIsEditingProduct] = useState(false);
    const [categories, setCategories] = useState<CmsCategory[]>([]);
    const [newCategory, setNewCategory] = useState({ name: "", categoryType: 'product' as 'product' | 'service', description: "" });
    const [creatingCategory, setCreatingCategory] = useState(false);

    // Sub-tab navigation
    const [subTab, setSubTab] = useState<'overview' | 'products' | 'services' | 'categories' | 'orders' | 'blogs'>('overview');

    // Services state
    const [services, setServices] = useState<CmsService[]>([]);
    const [loadingServices, setLoadingServices] = useState(false);
    const [showServiceForm, setShowServiceForm] = useState(false);
    const [newService, setNewService] = useState({ name: "", description: "", price: "", duration: "", category: "" });
    const [selectedService, setSelectedService] = useState<CmsService | null>(null);
    const [isEditingService, setIsEditingService] = useState(false);

    // Blogs state
    const [blogs, setBlogs] = useState<CmsBlogPost[]>([]);
    const [loadingBlogs, setLoadingBlogs] = useState(false);
    const [showBlogForm, setShowBlogForm] = useState(false);
    const [newBlog, setNewBlog] = useState({ title: "", content: "", author: user.name, status: 'published' as 'published' | 'draft' });
    const [selectedBlog, setSelectedBlog] = useState<CmsBlogPost | null>(null);
    const [isEditingBlog, setIsEditingBlog] = useState(false);

    // Orders state
    const [orders, setOrders] = useState<CmsOrder[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    // Bulk Import state
    const [showBulkImport, setShowBulkImport] = useState(false);
    const [bulkImportType, setBulkImportType] = useState<'products' | 'services'>('products');
    const [bulkRawData, setBulkRawData] = useState("");
    const [isImporting, setIsImporting] = useState(false);

    useEffect(() => {
        loadCmsData();
    }, [business]);

    useEffect(() => {
        if (cmsStatus?.connected && !isSessionExpired) {
            loadCategories();
        }
    }, [cmsStatus?.connected, isSessionExpired]);


    const loadCmsData = async () => {
        if (!business) { setLoading(false); return; }
        try {
            setIsSessionExpired(false);
            const statusRes = await cmsService.getStatus();
            setCmsStatus(statusRes.data);

            if (statusRes.data.connected) {
                try {
                    const dashRes = await cmsService.getDashboard();
                    setDashboard(dashRes.data);

                    // Preload all data if connected
                    loadProducts();
                    loadServices();
                    loadBlogs();
                    loadOrders();
                    loadCategories();
                } catch (err: any) {
                    if (err.response?.status === 400 && err.response?.data?.error?.includes("Session expired")) {
                        setIsSessionExpired(true);
                    } else {
                        console.error("Dashboard load failed:", err);
                    }
                }
            }
        } catch (err: any) {
            console.error("CMS status check failed:", err);
            if (err.response?.data?.error?.includes("Session expired")) {
                setIsSessionExpired(true);
            }
        } finally {
            setLoading(false);
        }
    };

    const loadProducts = async () => {
        // This is handled by getDashboard for now, but could be a separate call
    };

    const handleMarketplaceLogin = async () => {
        if (!loginPassword) return;
        try {
            setIsLoggingIn(true);
            await cmsService.login(loginPassword);
            toast({ title: "Welcome Back", description: "Successfully logged in to marketplace." });
            setLoginPassword("");
            setIsSessionExpired(false);
            await loadCmsData();
        } catch (error: any) {
            toast({
                title: "Login Failed",
                description: error.response?.data?.message || "Invalid marketplace password.",
                variant: "destructive"
            });
        } finally {
            setIsLoggingIn(false);
        }
    };

    const MEMBER_FEE = 20000;

    const handleConnect = async () => {
        if (cmsPassword.length < 8) {
            toast({ title: "Password too short", description: "Password must be at least 8 characters.", variant: "destructive" });
            return;
        }
        if (cmsPassword !== cmsConfirmPassword) {
            toast({ title: "Passwords don't match", description: "Please make sure both passwords match.", variant: "destructive" });
            return;
        }
        const amountPaid = Number(cmsAmountPaid);
        if (!amountPaid || amountPaid <= 0) {
            toast({ title: "Payment Required", description: "Please enter the amount paid for marketplace activation.", variant: "destructive" });
            return;
        }
        if (!cmsTransactionRef) {
            toast({ title: "Reference Required", description: "Please provide a transaction reference.", variant: "destructive" });
            return;
        }
        try {
            setConnecting(true);
            const res = await cmsService.connect({
                password: cmsPassword,
                confirmPassword: cmsConfirmPassword,
                amountPaid,
                paymentMethod: cmsPaymentMethod,
                transactionReference: cmsTransactionRef,
                subscriptionFee: MEMBER_FEE,
            });
            toast({ title: "🎉 Marketplace Activated!", description: res.data.message });
            setCmsPassword(""); setCmsConfirmPassword(""); setCmsAmountPaid(""); setCmsTransactionRef("");
            await loadCmsData();
        } catch (error: any) {
            toast({ title: "Activation Failed", description: error.response?.data?.message || "Could not activate marketplace account.", variant: "destructive" });
        } finally {
            setConnecting(false);
        }
    };

    const loadCategories = async () => {
        try {
            const res = await cmsService.getCategories();
            if (res.success) setCategories(res.data.data);
        } catch (err: any) {
            console.error("Failed to load categories:", err);
            if (err.response?.status === 400 && err.response?.data?.error?.includes("Session expired")) {
                setIsSessionExpired(true);
            }
        }
    };

    const handleAddProduct = async () => {
        if (!newProduct.name || !newProduct.description || !newProduct.price || !newProduct.category) {
            toast({ title: "Incomplete", description: "Please fill in all required fields.", variant: "destructive" });
            return;
        }
        try {
            setAddingProduct(true);
            await cmsService.createProduct({
                name: newProduct.name,
                description: newProduct.description,
                price: parseFloat(newProduct.price),
                category: newProduct.category,
                stock: newProduct.stock ? parseInt(newProduct.stock) : undefined,
                unit: newProduct.unit || undefined,
            });
            toast({ title: "Product Added", description: `"${newProduct.name}" is now listed on the marketplace.` });
            setNewProduct({ name: "", description: "", price: "", category: "", stock: "", unit: "" });
            setShowAddForm(false);
            await loadCmsData();
        } catch (error: any) {
            toast({ title: "Error", description: error.response?.data?.message || "Failed to create product.", variant: "destructive" });
        } finally {
            setAddingProduct(false);
        }
    };

    const handleUpdateProduct = async (data: any) => {
        if (!selectedProduct) return;
        try {
            setAddingProduct(true);
            await cmsService.updateProduct(selectedProduct._id, data);
            toast({ title: "Product Updated", description: "Changes saved successfully." });
            setIsEditingProduct(false);
            setSelectedProduct(null);
            await loadCmsData();
        } catch (error: any) {
            toast({ title: "Error", description: error.response?.data?.message || "Failed to update product.", variant: "destructive" });
        } finally {
            setAddingProduct(false);
        }
    };

    const handleCreateCategory = async () => {
        if (!newCategory.name) return;
        try {
            setCreatingCategory(true);
            await cmsService.createCategory(newCategory);
            toast({ title: "Category Created", description: `"${newCategory.name}" is now available.` });
            setNewCategory({ name: "", categoryType: 'product', description: "" });
            await loadCategories();
        } catch (error: any) {
            toast({ title: "Error", description: "Failed to create category." });
        } finally {
            setCreatingCategory(false);
        }
    };

    const handleDeleteCategory = async (id: string, name: string) => {
        if (!confirm(`Delete category "${name}"?`)) return;
        try {
            await cmsService.deleteCategory(id);
            toast({ title: "Category Deleted" });
            await loadCategories();
        } catch (err) {
            toast({ title: "Error", description: "Failed to delete category." });
        }
    };

    const handleDeleteProduct = async (productId: string, productName: string) => {
        if (!confirm(`Delete "${productName}"? This cannot be undone.`)) return;
        try {
            await cmsService.deleteProduct(productId);
            toast({ title: "Deleted", description: `"${productName}" has been removed.` });
            await loadCmsData();
        } catch (error: any) {
            toast({ title: "Error", description: "Failed to delete product.", variant: "destructive" });
        }
    };

    const loadOrders = async () => {
        try {
            setLoadingOrders(true);
            const res = await cmsService.getOrders();
            if (res.success) {
                const responseData = res.data as any;
                let fetchedOrders = [];
                if (Array.isArray(responseData)) fetchedOrders = responseData;
                else if (Array.isArray(responseData?.data)) fetchedOrders = responseData.data;
                else if (Array.isArray(responseData?.orders)) fetchedOrders = responseData.orders;
                setOrders(fetchedOrders);
            } else {
                setOrders([]);
            }
        } catch (err: any) {
            console.error("Failed to load orders:", err);
            if (err.response?.status === 400 && err.response?.data?.error?.includes("Session expired")) {
                setIsSessionExpired(true);
            }
        } finally {
            setLoadingOrders(false);
        }
    };

    const handleUpdateOrderStatus = async (orderId: string, status: string) => {
        try {
            await cmsService.updateOrderStatus(orderId, status);
            toast({ title: "Updated", description: "Order status has been updated." });
            await loadOrders();
            await loadCmsData();
        } catch (err: any) {
            toast({ title: "Error", description: "Failed to update order status.", variant: "destructive" });
        }
    };

    const loadServices = async () => {
        try {
            setLoadingServices(true);
            const res = await cmsService.getServices();
            if (res.success) setServices(res.data.data);
        } catch (err: any) {
            console.error("Services load failed:", err);
            if (err.response?.status === 400 && err.response?.data?.error?.includes("Session expired")) {
                setIsSessionExpired(true);
            }
        } finally {
            setLoadingServices(false);
        }
    };

    const handleAddService = async () => {
        if (!newService.name || !newService.category) return;
        try {
            setAddingProduct(true);
            await cmsService.createService({
                name: newService.name,
                description: newService.description,
                price: newService.price ? parseFloat(newService.price) : undefined,
                duration: newService.duration,
                category: newService.category,
                status: 'active'
            });
            toast({ title: "Service Created" });
            setNewService({ name: "", description: "", price: "", duration: "", category: "" });
            setShowServiceForm(false);
            await loadServices();
        } catch (err) {
            toast({ title: "Error", description: "Failed to create service.", variant: "destructive" });
        } finally {
            setAddingProduct(false);
        }
    };

    const handleUpdateService = async (data: any) => {
        if (!selectedService?._id) return;
        try {
            setAddingProduct(true);
            await cmsService.updateService(selectedService._id, data);
            toast({ title: "Service Updated" });
            setIsEditingService(false);
            setSelectedService(null);
            await loadServices();
        } catch (error: any) {
            toast({ title: "Error", description: "Failed to update service.", variant: "destructive" });
        } finally {
            setAddingProduct(false);
        }
    };

    const handleDeleteService = async (id: string, name: string) => {
        if (!confirm(`Delete service "${name}"?`)) return;
        try {
            await cmsService.deleteService(id);
            toast({ title: "Deleted" });
            await loadServices();
        } catch (err) {
            toast({ title: "Error", description: "Failed to delete service." });
        }
    };

    const loadBlogs = async () => {
        try {
            setLoadingBlogs(true);
            const res = await cmsService.getBlogs();
            if (res.success) {
                const data = res.data as any;
                setBlogs(data.posts || data.data || []);
            }
        } catch (err: any) {
            console.error("Blogs load failed:", err);
            if (err.response?.status === 400 && err.response?.data?.error?.includes("Session expired")) {
                setIsSessionExpired(true);
            }
        } finally {
            setLoadingBlogs(false);
        }
    };

    const handleAddBlog = async () => {
        if (!newBlog.title || !newBlog.content) return;
        try {
            setAddingProduct(true);
            await cmsService.createBlog(newBlog);
            toast({ title: "Article Published" });
            setNewBlog({ title: "", content: "", author: user.name, status: 'published' });
            setShowBlogForm(false);
            await loadBlogs();
        } catch (err) {
            toast({ title: "Error", description: "Failed to publish article." });
        } finally {
            setAddingProduct(false);
        }
    };

    const handleUpdateBlog = async (data: any) => {
        if (!selectedBlog?._id) return;
        try {
            setAddingProduct(true);
            await cmsService.updateBlog(selectedBlog._id, data);
            toast({ title: "Article Updated" });
            setIsEditingBlog(false);
            setSelectedBlog(null);
            await loadBlogs();
        } catch (error: any) {
            toast({ title: "Error", description: "Failed to update article." });
        } finally {
            setAddingProduct(false);
        }
    };

    const handleDeleteBlog = async (id: string) => {
        if (!confirm("Delete this article?")) return;
        try {
            await cmsService.deleteBlog(id);
            toast({ title: "Deleted" });
            await loadBlogs();
        } catch (err) {
            toast({ title: "Error", description: "Failed to delete article." });
        }
    };

    const handleBulkImport = async () => {
        if (!bulkRawData.trim()) return;
        try {
            setIsImporting(true);
            let rows: any[] = [];

            try {
                const parsed = JSON.parse(bulkRawData);
                rows = Array.isArray(parsed) ? parsed : [parsed];
            } catch (e) {
                const lines = bulkRawData.trim().split('\n');
                if (lines.length < 2) throw new Error("Invalid format");
                const headers = lines[0].split(',').map(h => h.trim());
                rows = lines.slice(1).map(line => {
                    const values = line.split(',').map(v => v.trim());
                    const obj: any = {};
                    headers.forEach((h, i) => { obj[h] = values[i]; });
                    return obj;
                });
            }

            let success = 0;
            let failed = 0;

            for (const row of rows) {
                try {
                    if (bulkImportType === 'products') {
                        await cmsService.createProduct({
                            name: row.name,
                            description: row.description || "",
                            price: parseFloat(row.price),
                            category: row.category,
                            stock: row.stock ? parseInt(row.stock) : undefined,
                            unit: row.unit
                        });
                    } else {
                        await cmsService.createService({
                            name: row.name,
                            description: row.description || "",
                            price: row.price ? parseFloat(row.price) : undefined,
                            category: row.category,
                            duration: row.duration
                        });
                    }
                    success++;
                } catch (err) {
                    failed++;
                }
            }

            toast({
                title: "Import Complete",
                description: `Successfully imported ${success} items. ${failed} failed.`,
                variant: failed > 0 ? "destructive" : "default"
            });

            setBulkRawData("");
            setShowBulkImport(false);
            if (bulkImportType === 'products') await loadCmsData();
            else await loadServices();

        } catch (err: any) {
            toast({ title: "Import Error", description: "Check your data format (JSON or CSV).", variant: "destructive" });
        } finally {
            setIsImporting(false);
        }
    };

    useEffect(() => {
        if (subTab === 'orders' && cmsStatus?.connected && !isSessionExpired) {
            loadOrders();
        }
        if (subTab === 'services' && cmsStatus?.connected && !isSessionExpired) {
            loadServices();
        }
        if (subTab === 'blogs' && cmsStatus?.connected && !isSessionExpired) {
            loadBlogs();
        }
        if (subTab === 'categories' && categories.length === 0 && cmsStatus?.connected && !isSessionExpired) {
            loadCategories();
        }
    }, [subTab, cmsStatus?.connected, isSessionExpired]);


    if (loading) {
        return (
            <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-primary/5 p-12 bg-white dark:bg-slate-900 min-h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Loading marketplace...</p>
                </div>
            </Card>
        );
    }

    if (!business) {
        return (
            <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-primary/5 p-12 bg-white dark:bg-slate-900 min-h-[500px] flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 rounded-full bg-amber-500/10 flex items-center justify-center mb-8">
                    <Store className="w-10 h-10 text-amber-500" />
                </div>
                <h3 className="text-3xl font-extrabold mb-4 tracking-tight">Business Profile Required</h3>
                <p className="text-muted-foreground max-w-md font-medium leading-relaxed mb-8">
                    To sell on the KNCCI Marketplace, you first need to set up your business profile. This ensures all marketplace sellers are verified KNCCI members.
                </p>
                <Button className="rounded-2xl h-12 px-8 font-extrabold shadow-xl shadow-primary/20" onClick={onBusinessTabSwitch}>
                    <Briefcase className="w-4 h-4 mr-2" /> Set Up Business Profile
                </Button>
            </Card>
        );
    }

    const checks = [
        { label: "Business Name", value: business.name, ok: !!business.name },
        { label: "Email Address", value: business.email, ok: !!business.email },
        { label: "Phone Number", value: business.phone, ok: !!business.phone },
        { label: "Category", value: business.category, ok: !!business.category },
        { label: "Location", value: business.location || "Not set", ok: !!business.location, optional: true },
        { label: "Description", value: business.description ? "Provided" : "Not set", ok: !!business.description, optional: true },
    ];
    const requiredComplete = checks.filter(c => !c.optional).every(c => c.ok);

    if (!cmsStatus?.connected) {
        return (
            <div className="space-y-8">
                <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-primary/5 p-10 lg:p-12 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800/80 overflow-hidden relative">
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-secondary/10 rounded-full blur-[80px]" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-secondary to-secondary/70 flex items-center justify-center text-white shadow-lg shadow-secondary/20">
                                <Store className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-2xl lg:text-3xl font-extrabold tracking-tight">Activate Your Marketplace Store</h3>
                                <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest mt-1">Sell to the KNCCI Trade Network</p>
                            </div>
                        </div>
                        <p className="text-muted-foreground max-w-2xl leading-relaxed font-medium">
                            As a verified KNCCI member, you can list your products and services on the marketplace.
                            Your business details will be used to set up your seller storefront. Complete the checklist below and choose a marketplace password to get started.
                        </p>
                    </div>
                </Card>

                <div className="grid md:grid-cols-2 gap-8">
                    <Card className="rounded-[2.5rem] border-none shadow-xl shadow-primary/5 p-8 bg-white dark:bg-slate-900">
                        <h4 className="font-extrabold text-sm uppercase tracking-[0.2em] text-muted-foreground mb-6 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-primary" /> Pre-flight Checklist
                        </h4>
                        <div className="space-y-4">
                            {checks.map((check, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-3">
                                        {check.ok ? (
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                        ) : (
                                            <XCircle className={`w-5 h-5 shrink-0 ${check.optional ? 'text-amber-400' : 'text-red-400'}`} />
                                        )}
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                                {check.label} {check.optional && <span className="text-[9px] opacity-50">(optional)</span>}
                                            </p>
                                            <p className="text-sm font-extrabold truncate max-w-[200px]">{check.value}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {!requiredComplete && (
                            <Button variant="outline" className="w-full mt-6 rounded-xl h-11 font-bold border-primary/20 text-primary" onClick={onBusinessTabSwitch}>
                                <Edit className="w-4 h-4 mr-2" /> Complete Business Profile
                            </Button>
                        )}
                    </Card>

                    <Card className="rounded-[2.5rem] border-none shadow-xl shadow-primary/5 p-8 bg-white dark:bg-slate-900">
                        <h4 className="font-extrabold text-sm uppercase tracking-[0.2em] text-muted-foreground mb-2 flex items-center gap-2">
                            <KeyRound className="w-4 h-4 text-primary" /> Marketplace Credentials
                        </h4>
                        <p className="text-xs text-muted-foreground mb-6 leading-relaxed font-medium">
                            Choose a password for your marketplace seller account. Your KNCCI email <span className="font-bold text-foreground">{user.email}</span> will be your login.
                        </p>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground ml-1">Marketplace Password</label>
                                <div className="relative">
                                    <Input
                                        type={showCmsPassword ? "text" : "password"}
                                        placeholder="Min 8 characters"
                                        value={cmsPassword}
                                        onChange={(e) => setCmsPassword(e.target.value)}
                                        className="rounded-xl h-12 bg-slate-50 dark:bg-slate-800 border-border/50 pr-10"
                                    />
                                    <button type="button" onClick={() => setShowCmsPassword(!showCmsPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                        {showCmsPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground ml-1">Confirm Password</label>
                                <div className="relative">
                                    <Input
                                        type={showCmsPassword ? "text" : "password"}
                                        placeholder="Re-enter password"
                                        value={cmsConfirmPassword}
                                        onChange={(e) => setCmsConfirmPassword(e.target.value)}
                                        className="rounded-xl h-12 bg-slate-50 dark:bg-slate-800 border-border/50 pr-10"
                                    />
                                    <button type="button" onClick={() => setShowCmsPassword(!showCmsPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                        {showCmsPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Payment Section */}
                        <div className="mt-6 border-t pt-6">
                            <h4 className="font-extrabold text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4 flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-primary" /> Payment Details
                            </h4>
                            <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4 mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-muted-foreground">Member Subscription Fee</span>
                                    <span className="font-bold text-foreground">KES {MEMBER_FEE.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Balance</span>
                                    <span className={`font-bold ${Number(cmsAmountPaid) >= MEMBER_FEE ? 'text-green-500' : 'text-orange-500'}`}>
                                        KES {Math.max(0, MEMBER_FEE - (Number(cmsAmountPaid) || 0)).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground ml-1">Payment Method</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { value: 'mpesa', label: 'M-Pesa' },
                                            { value: 'bank', label: 'Bank Transfer' },
                                            { value: 'cash', label: 'Cash' },
                                            { value: 'other', label: 'Other' },
                                        ].map((m) => (
                                            <button
                                                key={m.value}
                                                type="button"
                                                onClick={() => setCmsPaymentMethod(m.value as any)}
                                                className={`py-2 px-3 rounded-lg text-xs font-bold border-2 transition-all ${
                                                    cmsPaymentMethod === m.value
                                                        ? 'border-primary bg-primary/5 text-primary'
                                                        : 'border-slate-200 dark:border-slate-700 hover:border-primary/30'
                                                }`}
                                            >
                                                {m.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground ml-1">Amount Paid (KES)</label>
                                    <Input
                                        type="number"
                                        placeholder="Enter amount paid"
                                        value={cmsAmountPaid}
                                        onChange={(e) => setCmsAmountPaid(e.target.value)}
                                        className="rounded-xl h-12 bg-slate-50 dark:bg-slate-800 border-border/50"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground ml-1">Transaction Reference</label>
                                    <Input
                                        placeholder="e.g. MPESA123456 or Bank Ref"
                                        value={cmsTransactionRef}
                                        onChange={(e) => setCmsTransactionRef(e.target.value)}
                                        className="rounded-xl h-12 bg-slate-50 dark:bg-slate-800 border-border/50"
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            className="w-full mt-8 rounded-2xl h-14 font-extrabold text-sm shadow-xl shadow-primary/20 uppercase tracking-widest"
                            disabled={!requiredComplete || connecting || cmsPassword.length < 8 || cmsPassword !== cmsConfirmPassword || !cmsAmountPaid || !cmsTransactionRef}
                            onClick={handleConnect}
                        >
                            {connecting ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Activating...</>
                            ) : (
                                <><Store className="w-4 h-4 mr-2" /> Activate Seller Account</>
                            )}
                        </Button>

                        {!requiredComplete && (
                            <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                                <p className="text-xs font-bold text-amber-600 dark:text-amber-400">Complete required business fields first</p>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        );
    }

    if (isSessionExpired) {
        return (
            <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-primary/5 p-12 bg-white dark:bg-slate-900 min-h-[500px] flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-8">
                    <KeyRound className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-3xl font-extrabold mb-4 tracking-tight">Marketplace Session Expired</h3>
                <p className="text-muted-foreground max-w-sm font-medium leading-[1.8] mb-8">
                    Your marketplace session has expired for security. Please enter your marketplace password to continue managing products.
                </p>
                <div className="w-full max-w-xs space-y-4">
                    <div className="relative">
                        <Input
                            type={showLoginPassword ? "text" : "password"}
                            placeholder="Marketplace Password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            className="rounded-xl h-12 text-center pr-10"
                            onKeyDown={(e) => e.key === 'Enter' && handleMarketplaceLogin()}
                        />
                        <button
                            type="button"
                            onClick={() => setShowLoginPassword(!showLoginPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                        >
                            {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    <Button
                        className="w-full rounded-2xl h-12 font-extrabold uppercase tracking-widest text-[10px]"
                        onClick={handleMarketplaceLogin}
                        disabled={isLoggingIn || !loginPassword}
                    >
                        {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify Identity"}
                    </Button>
                </div>
            </Card>
        );
    }

    const products: CmsProduct[] = dashboard?.products?.data || (Array.isArray(dashboard?.products) ? dashboard?.products as any : []);
    const totalProducts = dashboard?.products?.total || products.length;
    const totalOrders = dashboard?.orderStats?.totalOrders || 0;
    const totalRevenue = dashboard?.orderStats?.totalRevenue || 0;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 shadow-sm shadow-emerald-500/5">
                        <div className="relative">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-500 animate-ping opacity-75" />
                        </div>
                        <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.1em]">Connected to Marketplace</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="text-right">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Store Slug</p>
                        <p className="text-[11px] font-extrabold text-foreground truncate max-w-[150px]">{business?.cms_org_slug || 'active-store'}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {[
                    { label: "Products", value: totalProducts, icon: <Package className="w-5 h-5" />, color: "from-secondary to-secondary/70", bg: "bg-secondary/10" },
                    { label: "Orders", value: totalOrders, icon: <ShoppingCart className="w-5 h-5" />, color: "from-blue-500 to-indigo-600", bg: "bg-blue-500/10" },
                    { label: "Revenue", value: `KES ${totalRevenue.toLocaleString()}`, icon: <DollarSign className="w-5 h-5" />, color: "from-emerald-500 to-teal-600", bg: "bg-emerald-500/10" },
                    { label: "Escrow", value: `KES ${dashboard?.orderStats?.escrowBalance?.toLocaleString() || 0}`, icon: <ShieldCheck className="w-5 h-5" />, color: "from-amber-500 to-orange-600", bg: "bg-amber-500/10" },
                    { label: "Available", value: `KES ${dashboard?.orderStats?.availableBalance?.toLocaleString() || 0}`, icon: <Wallet className="w-5 h-5" />, color: "from-primary to-primary/70", bg: "bg-primary/10" },
                ].map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                        <Card className="rounded-3xl border-none shadow-xl shadow-primary/5 overflow-hidden relative group hover:shadow-primary/10 transition-all">
                            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} rounded-full -mr-12 -mt-12 blur-2xl group-hover:scale-150 transition-transform duration-700`} />
                            <CardContent className="p-6 relative">
                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                                    {stat.icon}
                                </div>
                                <p className="text-xl font-extrabold tracking-tight">{stat.value}</p>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1 opacity-70">{stat.label}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="flex flex-wrap gap-2 border-b border-border/40 pb-2">
                {[
                    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
                    { id: 'products', label: 'Products', icon: <Package className="w-4 h-4" /> },
                    { id: 'services', label: 'Services', icon: <Briefcase className="w-4 h-4" /> },
                    { id: 'categories', label: 'Categories', icon: <Settings className="w-4 h-4" /> },
                    { id: 'orders', label: 'Orders', icon: <ShoppingCart className="w-4 h-4" /> },
                    { id: 'blogs', label: 'Updates & Blog', icon: <FileText className="w-4 h-4" /> },
                ].map(tab => (
                    <Button
                        key={tab.id}
                        variant={subTab === tab.id ? "secondary" : "ghost"}
                        className={`rounded-xl font-bold uppercase tracking-widest text-[10px] h-10 px-5 ${subTab === tab.id ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'text-muted-foreground hover:text-foreground'}`}
                        onClick={() => setSubTab(tab.id as any)}
                    >
                        {tab.icon}
                        <span className="ml-2">{tab.label}</span>
                    </Button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {subTab === 'overview' && (
                    <motion.div key="overview" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-8">
                            <Card className="rounded-[2.5rem] border-none shadow-xl shadow-primary/5 p-10 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800/80 overflow-hidden relative border border-border/40">
                                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-extrabold tracking-tight mb-4">Marketplace Performance</h3>
                                    <p className="text-muted-foreground font-medium leading-relaxed mb-8">
                                        Your store is currently active in the KNCCI trade network. You have {totalProducts} products listed and {totalOrders} total orders.
                                    </p>
                                    <div className="flex flex-wrap gap-4">
                                        <Button className="rounded-2xl h-12 px-8 font-extrabold shadow-lg shadow-primary/20 bg-primary" onClick={() => setSubTab('products')}>
                                            Manage Products
                                        </Button>
                                        <Button variant="outline" className="rounded-2xl h-12 px-8 font-bold border-primary/20 text-primary" onClick={() => setSubTab('orders')}>
                                            View Orders
                                        </Button>
                                    </div>
                                </div>
                            </Card>

                            <Card className="rounded-[2.5rem] border-none shadow-xl shadow-primary/5 p-10 bg-slate-900 text-white overflow-hidden relative group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-700" />
                                <div className="relative z-10">
                                    <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center mb-6 border border-white/10 shadow-xl">
                                        <ExternalLink className="w-7 h-7 text-primary" />
                                    </div>
                                    <h3 className="text-2xl font-extrabold tracking-tight mb-4">Advanced Seller Portal</h3>
                                    <p className="text-slate-300 font-medium leading-relaxed mb-8">
                                        Access full seller features including detailed analytics, marketing tools, and advanced storefront customization in the dedicated Marketplace app.
                                    </p>
                                    <a
                                        href={`${import.meta.env.VITE_MARKETPLACE_URL || 'https://kncci-marketplace.vercel.app'}/seller`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center rounded-2xl h-14 px-10 font-black uppercase tracking-widest text-xs bg-white text-slate-900 hover:bg-slate-100 transition-all shadow-2xl shadow-white/10"
                                    >
                                        Open Full Dashboard <ExternalLink className="w-4 h-4 ml-2" />
                                    </a>
                                </div>
                            </Card>
                        </div>

                        <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-primary/5 bg-white dark:bg-slate-900 overflow-hidden border border-border/40">
                            <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg font-extrabold">Recent Store Activity</CardTitle>
                                    <CardDescription className="font-medium">Stay updated on your store events</CardDescription>
                                </div>
                                <Activity className="w-5 h-5 text-primary opacity-50" />
                            </CardHeader>
                            <CardContent className="p-8 pt-0">
                                <div className="space-y-4">
                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-border/20 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                                <Store className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-extrabold">Storefront Online</p>
                                                <p className="text-xs text-muted-foreground">Your store is visible to all KNCCI members</p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="rounded-lg font-bold text-[9px] uppercase tracking-widest text-emerald-500 border-emerald-500/20">Active</Badge>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-border/20 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                                <Package className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-extrabold">{totalProducts} Products Listed</p>
                                                <p className="text-xs text-muted-foreground">Last updated recently</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" className="text-xs font-bold text-primary" onClick={() => setSubTab('products')}>Manage</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {subTab === 'products' && (
                    <motion.div key="products" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
                        <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-primary/5 bg-white dark:bg-slate-900 overflow-hidden">
                            <CardHeader className="p-8 pb-4">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <CardTitle className="text-xl font-extrabold">Your Products</CardTitle>
                                        <CardDescription className="font-medium">Manage your marketplace listings</CardDescription>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Button
                                            variant="outline"
                                            className="rounded-xl font-bold text-xs uppercase tracking-widest border-primary/20 text-primary h-10 px-5"
                                            onClick={() => {
                                                setBulkImportType('products');
                                                setShowBulkImport(!showBulkImport);
                                            }}
                                        >
                                            <Upload className="w-3.5 h-3.5 mr-2" /> Bulk Import
                                        </Button>
                                        <Button className="rounded-xl font-bold text-xs uppercase tracking-widest h-10 px-5 shadow-lg shadow-primary/20" onClick={() => {
                                            setShowAddForm(!showAddForm);
                                            if (!showAddForm) loadCategories();
                                        }}>
                                            <Plus className="w-4 h-4 mr-2" /> Add Product
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>

                            <AnimatePresence>
                                {showBulkImport && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="bg-primary/5 border-b border-primary/10 overflow-hidden"
                                    >
                                        <div className="p-8">
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <h4 className="font-extrabold text-sm uppercase tracking-widest text-primary">Bulk Import {bulkImportType}</h4>
                                                    <p className="text-xs text-muted-foreground font-medium">Paste JSON array or CSV data</p>
                                                </div>
                                                <Button variant="ghost" size="sm" onClick={() => setShowBulkImport(false)} className="rounded-xl font-bold">Cancel</Button>
                                            </div>
                                            <Textarea
                                                placeholder={bulkImportType === 'products' ? '[{"name": "Product A", "price": 100, "category": "General"}]' : 'name,description,price,category\\nService A,Nice service,1000,Consulting'}
                                                className="min-h-[200px] font-mono text-xs rounded-2xl bg-white dark:bg-slate-950"
                                                value={bulkRawData}
                                                onChange={e => setBulkRawData(e.target.value)}
                                            />
                                            <div className="flex justify-end mt-4">
                                                <Button className="rounded-xl font-extrabold shadow-lg shadow-primary/20 px-8" onClick={handleBulkImport} disabled={isImporting || !bulkRawData.trim()}>
                                                    {isImporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                                                    Start Import
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <AnimatePresence>
                                {showAddForm && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                        <div className="px-8 pb-6 pt-2 border-t border-border/20">
                                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">New Product</p>
                                            <div className="grid sm:grid-cols-3 gap-4">
                                                <Input placeholder="Product name *" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} className="rounded-xl h-11" />
                                                <Select onValueChange={val => setNewProduct({ ...newProduct, category: val })} value={newProduct.category}>
                                                    <SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="Select category *" /></SelectTrigger>
                                                    <SelectContent className="rounded-xl">
                                                        {categories.filter(c => c.categoryType === 'product').map(c => <SelectItem key={c._id} value={c.name}>{c.name}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                                <Input placeholder="Price *" type="number" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} className="rounded-xl h-11" />
                                            </div>
                                            <Textarea placeholder="Product description *" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} className="mt-4 rounded-xl min-h-[80px]" />
                                            <div className="flex justify-end gap-3 mt-4">
                                                <Button variant="ghost" className="rounded-xl font-bold" onClick={() => setShowAddForm(false)}>Cancel</Button>
                                                <Button className="rounded-xl px-8 font-bold shadow-lg shadow-primary/20" onClick={handleAddProduct} disabled={addingProduct}>Save Product</Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <CardContent className="p-0">
                                {loading ? <div className="p-12 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div> : products.length === 0 ? <div className="p-12 text-center text-muted-foreground">No products yet. Add your first listing to start selling.</div> : (
                                    <div className="divide-y divide-border/20">
                                        {products.map(p => (
                                            <div key={p._id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-all group cursor-pointer" onClick={() => { setSelectedProduct(p); setIsEditingProduct(false); }}>
                                                <div className="flex items-center gap-6">
                                                    <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 overflow-hidden border border-border/10">
                                                        {p.images?.[0] ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" /> : <Package className="w-6 h-6 text-muted-foreground/40" />}
                                                    </div>
                                                    <div className="space-y-1">
                                                        <h4 className="font-extrabold text-sm">{p.name}</h4>
                                                        <div className="flex items-center gap-3">
                                                            <Badge variant="secondary" className="text-[9px] uppercase tracking-widest font-bold px-2 py-0 h-5">{p.category}</Badge>
                                                            <span className="text-xs font-bold text-primary">KES {p.price.toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 hover:text-red-500" onClick={(e) => { e.stopPropagation(); handleDeleteProduct(p._id, p.name); }}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                    <ChevronRight className="w-4 h-4 text-muted-foreground opacity-50" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {subTab === 'services' && (
                    <motion.div key="services" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
                        <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-primary/5 bg-white dark:bg-slate-900 overflow-hidden">
                            <CardHeader className="p-8 pb-4">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <CardTitle className="text-xl font-extrabold">Professional Services</CardTitle>
                                        <CardDescription className="font-medium">Manage your service offerings</CardDescription>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Button
                                            variant="outline"
                                            className="rounded-xl font-bold text-xs uppercase tracking-widest border-primary/20 text-primary h-10 px-5"
                                            onClick={() => {
                                                setBulkImportType('services');
                                                setShowBulkImport(!showBulkImport);
                                            }}
                                        >
                                            <Upload className="w-3.5 h-3.5 mr-2" /> Bulk Import
                                        </Button>
                                        <Button className="rounded-xl font-bold text-xs uppercase h-10 px-5 shadow-lg shadow-primary/20" onClick={() => setShowServiceForm(!showServiceForm)}>
                                            <Plus className="w-4 h-4 mr-2" /> Add Service
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <AnimatePresence>
                                {showServiceForm && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                        <div className="px-8 pb-6 pt-2 border-t border-border/20 space-y-4">
                                            <div className="grid sm:grid-cols-2 gap-4">
                                                <Input placeholder="Service name *" value={newService.name} onChange={e => setNewService({ ...newService, name: e.target.value })} className="rounded-xl h-11" />
                                                <Select onValueChange={val => setNewService({ ...newService, category: val })} value={newService.category}>
                                                    <SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="Category" /></SelectTrigger>
                                                    <SelectContent className="rounded-xl">
                                                        {categories.filter(c => c.categoryType === 'service').map(c => <SelectItem key={c._id} value={c.name}>{c.name}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="flex justify-end gap-3 mt-2">
                                                <Button variant="ghost" onClick={() => setShowServiceForm(false)}>Cancel</Button>
                                                <Button className="rounded-xl px-8 font-bold" onClick={handleAddService} disabled={addingProduct}>Save Service</Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <CardContent className="p-0">
                                {loadingServices ? <div className="p-12 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div> : services.length === 0 ? <div className="p-12 text-center text-muted-foreground">No services yet.</div> : (
                                    <div className="divide-y divide-border/20">
                                        {services.map(s => (
                                            <div key={s._id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-all group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><Briefcase className="w-6 h-6" /></div>
                                                    <div>
                                                        <h4 className="font-extrabold text-sm">{s.name}</h4>
                                                        <p className="text-xs font-bold text-primary">{s.price ? `KES ${s.price.toLocaleString()}` : 'Contact for pricing'}</p>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="icon" className="hover:text-red-500 opacity-0 group-hover:opacity-100" onClick={() => handleDeleteService(s._id, s.name)}><Trash2 className="w-4 h-4" /></Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {subTab === 'categories' && (
                    <motion.div key="categories" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-6">
                        <div className="grid md:grid-cols-3 gap-6">
                            <Card className="md:col-span-1 rounded-[2.5rem] border-none shadow-xl shadow-primary/5 p-8 bg-white dark:bg-slate-900">
                                <h4 className="font-extrabold text-sm uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
                                    <Plus className="w-4 h-4 text-primary" /> Create Category
                                </h4>
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Category Name</label>
                                        <Input
                                            placeholder="e.g. Electronics"
                                            value={newCategory.name}
                                            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                            className="rounded-xl h-12"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Type</label>
                                        <Select
                                            value={newCategory.categoryType}
                                            onValueChange={(val: any) => setNewCategory({ ...newCategory, categoryType: val })}
                                        >
                                            <SelectTrigger className="rounded-xl h-12"><SelectValue /></SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="product">Products</SelectItem>
                                                <SelectItem value="service">Services</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button
                                        className="w-full rounded-2xl h-12 font-extrabold uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20"
                                        onClick={handleCreateCategory}
                                        disabled={creatingCategory || !newCategory.name}
                                    >
                                        {creatingCategory ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Category"}
                                    </Button>
                                </div>
                            </Card>

                            <Card className="md:col-span-2 rounded-[2.5rem] border-none shadow-xl shadow-primary/5 bg-white dark:bg-slate-900 overflow-hidden">
                                <CardHeader className="p-8 pb-4">
                                    <CardTitle className="text-xl font-extrabold">Active Categories</CardTitle>
                                    <CardDescription className="font-medium">Manage your store organization</CardDescription>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="divide-y divide-border/20">
                                        {categories.map(cat => (
                                            <div key={cat._id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-all group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                                        <Settings className="w-5 h-5 text-muted-foreground/60" />
                                                    </div>
                                                    <div>
                                                        <p className="font-extrabold text-sm">{cat.name}</p>
                                                        <Badge variant="outline" className="text-[9px] uppercase tracking-[0.2em] font-bold px-2 h-4 border-primary/20 text-primary">
                                                            {cat.categoryType}s
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="opacity-0 group-hover:opacity-100 hover:text-red-500"
                                                    onClick={() => handleDeleteCategory(cat._id, cat.name)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                        {categories.length === 0 && (
                                            <div className="p-12 text-center text-muted-foreground font-medium">No categories created yet.</div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </motion.div>
                )}

                {subTab === 'orders' && (
                    <motion.div key="orders" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
                        <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-primary/5 bg-white dark:bg-slate-900 overflow-hidden min-h-[400px]">
                            <CardHeader className="p-8 pb-4"><CardTitle className="text-xl font-extrabold">Order Management</CardTitle></CardHeader>
                            <CardContent className="p-0">
                                {loadingOrders ? <div className="p-12 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div> : (orders || []).length === 0 ? <div className="p-12 text-center text-muted-foreground">No orders yet.</div> : (
                                    <div className="divide-y divide-border/20">
                                        {(orders || []).map(order => (
                                            <div key={order._id} className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                                                <div className="space-y-1">
                                                    <h4 className="font-extrabold text-sm">{order.guestInfo?.name || 'Customer'}</h4>
                                                    <p className="text-xs text-muted-foreground">KES {order.totalAmount?.toLocaleString()} • {order.status}</p>
                                                </div>
                                                <Select value={order.status?.toLowerCase()} onValueChange={val => handleUpdateOrderStatus(order._id, val)}>
                                                    <SelectTrigger className="w-[150px] rounded-xl h-10 text-xs font-bold uppercase"><SelectValue /></SelectTrigger>
                                                    <SelectContent className="rounded-xl">
                                                        <SelectItem value="pending">Pending</SelectItem>
                                                        <SelectItem value="paid">Paid</SelectItem>
                                                        <SelectItem value="shipped">Shipped</SelectItem>
                                                        <SelectItem value="completed">Completed</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {subTab === 'blogs' && (
                    <motion.div key="blogs" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
                        <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-primary/5 bg-white dark:bg-slate-900 overflow-hidden">
                            <CardHeader className="p-8 pb-4">
                                <div className="flex justify-between items-center">
                                    <div><CardTitle className="text-xl font-extrabold">Updates & Blog</CardTitle></div>
                                    <Button className="rounded-xl font-bold text-xs uppercase h-10 px-5" onClick={() => setShowBlogForm(!showBlogForm)}><Plus className="w-4 h-4 mr-2" /> New Article</Button>
                                </div>
                            </CardHeader>
                            <AnimatePresence>
                                {showBlogForm && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                        <div className="px-8 pb-6 pt-2 border-t border-border/20 space-y-4">
                                            <Input placeholder="Title" value={newBlog.title} onChange={e => setNewBlog({ ...newBlog, title: e.target.value })} className="rounded-xl h-11" />
                                            <Textarea placeholder="Content..." value={newBlog.content} onChange={e => setNewBlog({ ...newBlog, content: e.target.value })} className="min-h-[150px] rounded-xl" />
                                            <div className="flex justify-end gap-3"><Button variant="ghost" onClick={() => setShowBlogForm(false)}>Cancel</Button><Button className="rounded-xl px-8 font-bold" onClick={handleAddBlog} disabled={addingProduct}>Publish</Button></div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <CardContent className="p-0">
                                {loadingBlogs ? <div className="p-12 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></div> : blogs.length === 0 ? <div className="p-12 text-center text-muted-foreground">No articles yet.</div> : (
                                    <div className="divide-y divide-border/20">
                                        {blogs.map(post => (
                                            <div key={post._id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-all group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center"><FileText className="w-6 h-6" /></div>
                                                    <div>
                                                        <h4 className="font-extrabold text-sm">{post.title}</h4>
                                                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
                                                            {post.status} • {new Date(post.createdAt!).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500" onClick={() => handleDeleteBlog(post._id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
                <DialogContent className="sm:max-w-[600px] rounded-[2rem]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-extrabold tracking-tight">
                            {isEditingProduct ? "Edit Listing" : "Product Details"}
                        </DialogTitle>
                    </DialogHeader>

                    {selectedProduct && (
                        <div className="space-y-6 pt-4">
                            {isEditingProduct ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Name</label>
                                            <Input
                                                defaultValue={selectedProduct.name}
                                                onBlur={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                                                className="rounded-xl h-11"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Category</label>
                                            <Select
                                                defaultValue={selectedProduct.category}
                                                onValueChange={(val) => setSelectedProduct({ ...selectedProduct, category: val })}
                                            >
                                                <SelectTrigger className="rounded-xl h-11"><SelectValue /></SelectTrigger>
                                                <SelectContent className="rounded-xl">
                                                    {categories.map(c => <SelectItem key={c._id} value={c.name}>{c.name}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Price (KES)</label>
                                            <Input
                                                type="number"
                                                defaultValue={selectedProduct.price}
                                                onBlur={(e) => setSelectedProduct({ ...selectedProduct, price: parseFloat(e.target.value) })}
                                                className="rounded-xl h-11"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Stock</label>
                                            <Input
                                                type="number"
                                                defaultValue={selectedProduct.stock}
                                                onBlur={(e) => setSelectedProduct({ ...selectedProduct, stock: parseInt(e.target.value) })}
                                                className="rounded-xl h-11"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Unit</label>
                                            <Input
                                                defaultValue={selectedProduct.unit}
                                                placeholder="e.g. Kg"
                                                onBlur={(e) => setSelectedProduct({ ...selectedProduct, unit: e.target.value })}
                                                className="rounded-xl h-11"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Description</label>
                                        <Textarea
                                            defaultValue={selectedProduct.description}
                                            onBlur={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
                                            className="rounded-xl min-h-[100px]"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-3 pt-4">
                                        <Button variant="ghost" className="rounded-xl font-bold" onClick={() => setIsEditingProduct(false)}>Cancel</Button>
                                        <Button
                                            className="rounded-xl px-10 font-extrabold shadow-xl shadow-primary/20 bg-primary"
                                            disabled={addingProduct}
                                            onClick={() => handleUpdateProduct({
                                                name: selectedProduct.name,
                                                price: selectedProduct.price,
                                                category: selectedProduct.category,
                                                description: selectedProduct.description,
                                                stock: selectedProduct.stock,
                                                unit: selectedProduct.unit
                                            })}
                                        >
                                            {addingProduct ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex gap-6">
                                        <div className="w-32 h-32 rounded-[2rem] bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 overflow-hidden border border-border/20">
                                            {selectedProduct.images?.[0] ? (
                                                <img src={selectedProduct.images[0]} alt={selectedProduct.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <Package className="w-10 h-10 text-muted-foreground/30" />
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <Badge className="bg-primary/10 text-primary border-none font-bold rounded-lg px-2 h-5 text-[9px] uppercase tracking-widest">
                                                {selectedProduct.category}
                                            </Badge>
                                            <h3 className="text-2xl font-extrabold tracking-tight">{selectedProduct.name}</h3>
                                            <p className="text-2xl font-black text-primary">KES {((selectedProduct.basePrice || selectedProduct.price || 0) + (selectedProduct.additions || 0)).toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-border/20">
                                            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Stock Availability</p>
                                            <p className="font-extrabold text-lg">{selectedProduct.stock || 0} {selectedProduct.unit || 'Units'}</p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-border/20">
                                            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Status</p>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${selectedProduct.isActive !== false ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                                <p className="font-extrabold text-sm uppercase tracking-widest">{selectedProduct.isActive !== false ? 'Active' : 'Hidden'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Description</p>
                                        <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                                            {selectedProduct.description}
                                        </p>
                                    </div>

                                    <div className="flex justify-end pt-6 border-t border-border/20">
                                        <Button className="rounded-xl font-bold" onClick={() => setIsEditingProduct(true)}>
                                            <Edit className="w-4 h-4 mr-2" /> Edit Listing
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
