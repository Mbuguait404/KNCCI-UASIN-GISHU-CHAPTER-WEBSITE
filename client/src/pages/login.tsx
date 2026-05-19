import { motion, AnimatePresence } from "framer-motion";
import { Lock, User, Mail, ArrowRight, ShieldCheck, LogIn, ChevronLeft, Eye, EyeOff, KeyRound, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SEOHead } from "@/components/seo/seo-head";
import { Link, useLocation } from "wouter";
import { useState, useEffect, useRef, useCallback } from "react";

import { useAuth, OtpPendingState } from "@/services/auth-context";
import { useToast } from "@/hooks/use-toast";
import { cmsService } from "@/services/cms-service";



export default function LoginPage() {
    const [, setLocation] = useLocation();
    const { login, verifyOtp, isAuthenticated, user } = useAuth();
    const { toast } = useToast();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // OTP step state
    const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
    const [otpPending, setOtpPending] = useState<OtpPendingState | null>(null);
    const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
    const [otpError, setOtpError] = useState('');
    const [resendCooldown, setResendCooldown] = useState(0);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
    const cooldownTimer = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (isAuthenticated && user) {
            setLocation(user.role === 'admin' ? '/admin' : '/profile');
        }
    }, [isAuthenticated, user, setLocation]);

    // Countdown timer for OTP resend
    useEffect(() => {
        if (resendCooldown > 0) {
            cooldownTimer.current = setInterval(() => {
                setResendCooldown(prev => {
                    if (prev <= 1) {
                        if (cooldownTimer.current) clearInterval(cooldownTimer.current);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => { if (cooldownTimer.current) clearInterval(cooldownTimer.current); };
    }, [resendCooldown]);

    const startCooldown = () => setResendCooldown(60);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const result = await login({ email, password });

            if ('requiresOTP' in result && result.requiresOTP) {
                setOtpPending(result as OtpPendingState);
                setStep('otp');
                setOtpDigits(['', '', '', '', '', '']);
                setOtpError('');
                startCooldown();
                setTimeout(() => otpRefs.current[0]?.focus(), 150);
                return;
            }

            const loggedInUser = result as any;
            toast({
                title: "Welcome back!",
                description: loggedInUser.role === 'admin'
                    ? "Redirecting to admin dashboard..."
                    : "You have successfully logged in.",
            });
            setLocation(loggedInUser.role === 'admin' ? '/admin' : '/profile');

            if (loggedInUser.role !== 'admin' && !loggedInUser.requirePasswordChange) {
                cmsService.warmup(password).catch(() => {});
            }

        } catch (error: any) {
            toast({
                title: "Login failed",
                description: error.response?.data?.message || "Invalid email or password",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        const char = value.replace(/\D/g, '').slice(-1);
        const next = [...otpDigits];
        next[index] = char;
        setOtpDigits(next);
        setOtpError('');
        if (char && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
        // Auto-submit when 6th digit is entered
        if (char && index === 5) {
            const code = next.join('');
            if (code.length === 6) {
                submitOtp(code);
            }
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('');
        const next = ['', '', '', '', '', ''];
        digits.forEach((d, i) => { next[i] = d; });
        setOtpDigits(next);
        setOtpError('');
        const lastFilled = Math.min(digits.length, 5);
        otpRefs.current[lastFilled]?.focus();
        // Auto-submit on paste if all 6 digits were pasted
        if (digits.length === 6) {
            submitOtp(next.join(''));
        }
    };

    const submitOtp = useCallback(async (code: string) => {
        if (!otpPending || isLoading) return;
        setIsLoading(true);
        try {
            const loggedInUser = await verifyOtp(otpPending.otpToken, code, { password });
            toast({
                title: "Welcome back!",
                description: loggedInUser.role === 'admin'
                    ? "Redirecting to admin dashboard..."
                    : "You have successfully logged in.",
            });
            setLocation(loggedInUser.role === 'admin' ? '/admin' : '/profile');
            if (loggedInUser.role !== 'admin' && !loggedInUser.requirePasswordChange) {
                cmsService.warmup(password).catch(() => {});
            }
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Invalid code. Please try again.';
            setOtpError(msg);
            setOtpDigits(['', '', '', '', '', '']);
            setTimeout(() => otpRefs.current[0]?.focus(), 50);
        } finally {
            setIsLoading(false);
        }
    }, [otpPending, isLoading, password, verifyOtp, toast, setLocation]);

    const handleVerifyOtp = (e: React.FormEvent) => {
        e.preventDefault();
        if (!otpPending) return;
        const code = otpDigits.join('');
        if (code.length < 6) {
            setOtpError('Please enter all 6 digits.');
            return;
        }
        submitOtp(code);
    };

    const handleResend = async () => {
        if (resendCooldown > 0) return;
        setIsLoading(true);
        try {
            const result = await login({ email, password });
            if ('requiresOTP' in result && result.requiresOTP) {
                setOtpPending(result as OtpPendingState);
                setOtpDigits(['', '', '', '', '', '']);
                setOtpError('');
                startCooldown();
                setTimeout(() => otpRefs.current[0]?.focus(), 100);
                toast({ title: "Code resent", description: `A new code was sent to ${(result as OtpPendingState).maskedEmail}` });
            }
        } catch {
            toast({ title: "Resend failed", description: "Please try again.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        setStep('credentials');
        setOtpPending(null);
        setOtpDigits(['', '', '', '', '', '']);
        setOtpError('');
        if (cooldownTimer.current) clearInterval(cooldownTimer.current);
        setResendCooldown(0);
    };


    return (
        <div className="h-screen w-full bg-slate-50 dark:bg-slate-900 overflow-hidden flex flex-col">
            <SEOHead
                title="Login | KNCCI Uasin Gishu Member Portal"
                description="Access your KNCCI Uasin Gishu member portal. Manage your profile, pay for membership, and explore business opportunities."
            />

            <main className="flex-grow flex items-center justify-center p-4 relative">
                {/* Abstract Background Orbs */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
                </div>

                <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center relative z-10">
                    {/* Left Column - Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="hidden lg:block space-y-8"
                    >
                        <Link href="/">
                            <Button variant="ghost" className="mb-4 text-primary font-bold hover:bg-primary/5 pl-0">
                                <ChevronLeft className="w-4 h-4 mr-2" /> Back to Home
                            </Button>
                        </Link>

                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-primary/20">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                Secure Member Portal
                            </div>
                            <h1 className="text-5xl font-extrabold mb-8 leading-tight">
                                Unlock Your <span className="text-primary italic">Chamber</span> Benefits
                            </h1>
                            <p className="text-xl text-muted-foreground leading-relaxed mb-10 max-w-md">
                                Access exclusive member resources, update your business profile, and connect with other businesses in the North Rift region.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {[
                                "Manage your membership status",
                                "Access trade opportunities & leads",
                                "Register for events with member discounts",
                                "Post products in the marketplace"
                            ].map((text, i) => (
                                <div key={i} className="flex gap-4 items-center group">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                    <span className="text-lg font-bold text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">{text}</span>
                                </div>
                            ))}
                        </div>

                        <div className="pt-8 flex items-center gap-6">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-slate-200" />
                                ))}
                                <div className="w-10 h-10 rounded-full border-2 border-background bg-primary text-white text-[10px] flex items-center justify-center font-bold">
                                    +6k
                                </div>
                            </div>
                            <p className="text-sm font-bold text-muted-foreground">Join 6,500+ businesses registered with us</p>
                        </div>
                    </motion.div>

                    {/* Right Column - Form */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-md mx-auto"
                    >
                        <Card className="border-border/50 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] rounded-[2.5rem] overflow-hidden bg-background/80 backdrop-blur-xl">
                            <AnimatePresence mode="wait">
                                {step === 'credentials' ? (
                                    <motion.div
                                        key="credentials"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.25 }}
                                    >
                                        <Tabs defaultValue="login" className="w-full">
                                            <TabsList className="grid grid-cols-2 h-16  bg-primary/5 rounded-none p-1.5 gap-1">
                                                <TabsTrigger value="login" className="h-full data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-lg font-bold text-sm rounded-3xl transition-all">Login</TabsTrigger>
                                                <TabsTrigger value="register" className="h-full data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-lg font-bold text-sm rounded-3xl transition-all">Register</TabsTrigger>
                                            </TabsList>

                                            <CardContent className="p-10">
                                                <TabsContent value="login" className="mt-0 space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                                    <div className="text-center mb-2">
                                                        <h2 className="text-3xl font-extrabold mb-2 tracking-tight">Welcome Back</h2>
                                                        <p className="text-muted-foreground font-medium">Enter your credentials to access your account</p>
                                                    </div>

                                                    <form onSubmit={handleLogin} className="space-y-6">
                                                        <div className="space-y-4">
                                                            <div className="space-y-2">
                                                                <label className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground ml-1">Email / Username</label>
                                                                <div className="relative group">
                                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                                                    <Input
                                                                        required
                                                                        type="email"
                                                                        value={email}
                                                                        onChange={(e) => setEmail(e.target.value)}
                                                                        placeholder="name@company.com"
                                                                        className="h-14 pl-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border-border/50 focus:border-primary focus:ring-primary/20 transition-all text-base"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="space-y-2">
                                                                <div className="flex justify-between items-center mb-1">
                                                                    <label className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground ml-1">Password</label>
                                                                    <Button variant="ghost" type="button" className="text-xs h-auto p-0 font-bold text-primary hover:bg-transparent hover:underline">Forgot Password?</Button>
                                                                </div>
                                                                <div className="relative group">
                                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                                                    <Input
                                                                        required
                                                                        type={showPassword ? "text" : "password"}
                                                                        value={password}
                                                                        onChange={(e) => setPassword(e.target.value)}
                                                                        placeholder="••••••••"
                                                                        className="h-14 pl-12 pr-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border-border/50 focus:border-primary focus:ring-primary/20 transition-all text-base"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setShowPassword(!showPassword)}
                                                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors focus:outline-none"
                                                                    >
                                                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <Button
                                                            size="lg"
                                                            type="submit"
                                                            disabled={isLoading}
                                                            className="w-full h-14 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 group relative overflow-hidden"
                                                        >
                                                            <span className="relative z-10 flex items-center justify-center">
                                                                {isLoading ? "Signing In..." : "Sign In"} <LogIn className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                            </span>
                                                        </Button>
                                                    </form>

                                                    <div className="relative py-2">
                                                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
                                                        <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest"><span className="bg-background px-3 text-muted-foreground">Or continue with</span></div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <Button variant="outline" className="h-14 rounded-2xl font-bold gap-3 hover:bg-slate-50 dark:hover:bg-slate-900 border-border/60 transition-all">
                                                            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                                                            Google
                                                        </Button>
                                                        <Button variant="outline" className="h-14 rounded-2xl font-bold gap-3 hover:bg-slate-50 dark:hover:bg-slate-900 border-border/60 transition-all">
                                                            <User className="w-4 h-4 text-primary" />
                                                            Member ID
                                                        </Button>
                                                    </div>
                                                </TabsContent>

                                                <TabsContent value="register" className="mt-0 space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
                                                    <div className="text-center mb-2">
                                                        <h2 className="text-3xl font-extrabold mb-2 tracking-tight">Grow With Us</h2>
                                                        <p className="text-muted-foreground font-medium">Join the largest business network in Uasin Gishu</p>
                                                    </div>

                                                    <div className="p-8 rounded-[2rem] bg-primary/5 border border-primary/10">
                                                        <p className="text-sm leading-relaxed mb-6 font-medium text-slate-700 dark:text-slate-300">
                                                            Ready to take your business to the next level? Join over 6,500 members in Uasin Gishu County today.
                                                        </p>
                                                        <Button className="w-full h-14 rounded-2xl font-bold shadow-lg shadow-primary/10" variant="default" asChild>
                                                            <Link href="/membership">Start Application <ArrowRight className="ml-2 w-4 h-4" /></Link>
                                                        </Button>
                                                    </div>

                                                    <p className="text-center text-[10px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground">Become a member to access</p>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {["Trade Leads", "Discounts", "Networking", "Marketplace"].map((tag) => (
                                                            <div key={tag} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 border border-border/50">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                                <span className="text-xs font-bold">{tag}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </TabsContent>
                                            </CardContent>
                                        </Tabs>
                                    </motion.div>
                                ) : (
                                    /* ── OTP Step ─────────────────────────────────────────────────── */
                                    <motion.div
                                        key="otp"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.25 }}
                                    >
                                        <div className="p-2 bg-primary/5 rounded-none">
                                            <div className="flex items-center gap-3 px-4 py-3">
                                                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                                                    <KeyRound className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-extrabold uppercase tracking-widest text-primary">Two-Step Verification</p>
                                                    <p className="text-[11px] text-muted-foreground font-medium">KNCCI Member Portal</p>
                                                </div>
                                            </div>
                                        </div>

                                        <CardContent className="p-10">
                                            <form onSubmit={handleVerifyOtp} className="space-y-8">
                                                <div className="text-center space-y-3">
                                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                                        <ShieldCheck className="w-8 h-8 text-primary" />
                                                    </div>
                                                    <h2 className="text-2xl font-extrabold tracking-tight">Enter Verification Code</h2>
                                                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                                                        We sent a 6-digit code to{' '}
                                                        <span className="font-bold text-foreground">{otpPending?.maskedEmail}</span>
                                                        {otpPending?.maskedPhone && (
                                                            <> and <span className="font-bold text-foreground">{otpPending.maskedPhone}</span></>
                                                        )}
                                                    </p>
                                                </div>

                                                {/* 6-digit input boxes */}
                                                <div className="flex gap-2 justify-center">
                                                    {otpDigits.map((digit, i) => (
                                                        <input
                                                            key={i}
                                                            ref={el => { otpRefs.current[i] = el; }}
                                                            type="text"
                                                            inputMode="numeric"
                                                            maxLength={1}
                                                            value={digit}
                                                            onChange={e => handleOtpChange(i, e.target.value)}
                                                            onKeyDown={e => handleOtpKeyDown(i, e)}
                                                            onPaste={i === 0 ? handleOtpPaste : undefined}
                                                            className={`w-12 h-14 text-center text-2xl font-extrabold rounded-2xl border-2 bg-slate-50 dark:bg-slate-900 focus:outline-none transition-all
                                                                ${otpError ? 'border-destructive focus:border-destructive' : 'border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20'}
                                                                ${digit ? 'border-primary/50 bg-primary/5' : ''}
                                                            `}
                                                        />
                                                    ))}
                                                </div>

                                                {otpError && (
                                                    <motion.p
                                                        initial={{ opacity: 0, y: -4 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="text-sm text-destructive text-center font-semibold"
                                                    >
                                                        {otpError}
                                                    </motion.p>
                                                )}

                                                <Button
                                                    size="lg"
                                                    type="submit"
                                                    disabled={isLoading || otpDigits.join('').length < 6}
                                                    className="w-full h-14 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20"
                                                >
                                                    {isLoading ? "Verifying..." : "Verify & Sign In"}
                                                </Button>

                                                <div className="flex items-center justify-between pt-2">
                                                    <button
                                                        type="button"
                                                        onClick={handleBack}
                                                        className="flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
                                                    >
                                                        <ChevronLeft className="w-4 h-4" />
                                                        Use different account
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={handleResend}
                                                        disabled={resendCooldown > 0 || isLoading}
                                                        className="flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <RefreshCw className="w-3.5 h-3.5" />
                                                        {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
                                                    </button>
                                                </div>
                                            </form>
                                        </CardContent>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Card>

                        <div className="mt-8 text-center text-sm text-muted-foreground font-medium">
                            &copy; {new Date().getFullYear()} KNCCI Uasin Gishu Chapter
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}

function CheckCircle2(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    );
}
