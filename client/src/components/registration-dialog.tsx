import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { TicketSelection } from "@/components/ticket-selection";
import { CheckoutForm } from "@/components/checkout-form";
import { Event } from "@shared/schema";
import { Calendar, MapPin, CheckCircle2, Phone, Loader2, Ticket, User, CreditCard, Check, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { ticketing, type Purchase } from "@/lib/ticketing";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface RegistrationDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    event: Event;
}

type Step = "tickets" | "checkout" | "payment" | "success";

const steps = [
    { id: "tickets" as Step, label: "Select Tickets", icon: Ticket },
    { id: "checkout" as Step, label: "Your Details", icon: User },
    { id: "payment" as Step, label: "Payment", icon: CreditCard },
    { id: "success" as Step, label: "Complete", icon: Check },
];

const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 60 : -60,
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction: number) => ({
        x: direction < 0 ? 60 : -60,
        opacity: 0,
    }),
};

const fadeInVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
};

const checkmarkVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
        pathLength: 1, 
        opacity: 1,
        transition: { 
            pathLength: { duration: 0.6, ease: "easeOut" },
            opacity: { duration: 0.2 }
        }
    }
};

const circleVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
        scale: 1, 
        opacity: 1,
        transition: { 
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.1
        }
    }
};

const confettiVariants = {
    hidden: { opacity: 0, y: 20, scale: 0 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            delay: 0.3 + i * 0.08,
            duration: 0.5,
            ease: "easeOut"
        }
    })
};

const stepIndicatorVariants = {
    inactive: { scale: 1, backgroundColor: "hsl(var(--muted))" },
    active: { 
        scale: 1.1, 
        backgroundColor: "hsl(var(--primary))",
        transition: { type: "spring", stiffness: 300, damping: 20 }
    },
    completed: { scale: 1, backgroundColor: "hsl(var(--secondary))" }
};

export function RegistrationDialog({ isOpen, onOpenChange, event }: RegistrationDialogProps) {
    const { toast } = useToast();
    const [step, setStep] = useState<Step>("tickets");
    const [direction, setDirection] = useState(0);
    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentTimer, setPaymentTimer] = useState(5);
    const [purchaseId, setPurchaseId] = useState<string | null>(null);

    const { data: ticketTypes } = useQuery({
        queryKey: ["ticketTypes", event.id],
        queryFn: () => ticketing.getTicketTypes(event.id),
    });

    const createPurchaseMutation = useMutation({
        mutationFn: async (purchaseData: Parameters<typeof ticketing.createPurchase>[0]) => {
            return ticketing.createPurchase(purchaseData);
        },
        onError: (error: Error) => {
            console.error("Purchase creation error:", error);
            toast({
                title: "Purchase Failed",
                description: error.message || "Failed to create purchase. Please try again.",
                variant: "destructive",
            });
        },
    });

    const handleProceedToCheckout = () => {
        setDirection(1);
        setStep("checkout");
    };

    const handleBackToTickets = () => {
        setDirection(-1);
        setStep("tickets");
    };

    const handleSubmitOrder = async (data: any) => {
        setIsSubmitting(true);
        try {
            // Prepare ticket items from quantities
            const ticketItems = Object.entries(quantities)
                .filter(([_, qty]) => qty > 0)
                .map(([ticketTypeId, quantity]) => ({
                    ticketTypeId,
                    quantity,
                }));

            if (ticketItems.length === 0) {
                toast({
                    title: "No Tickets Selected",
                    description: "Please select at least one ticket to proceed.",
                    variant: "destructive",
                });
                setIsSubmitting(false);
                return;
            }

            // Calculate total amount
            const totalAmount = ticketTypes?.reduce((sum, ticket) => {
                return sum + (ticket.price * (quantities[ticket.id] || 0));
            }, 0) || 0;

            // Determine payment method based on total amount
            const paymentMethod = totalAmount === 0 ? "none" : "M-Pesa";

            // Create purchase
            const purchaseData = {
                eventId: event.id,
                ticketItems,
                paymentMethod,
                notes: `Contact: ${data.firstName} ${data.lastName}, Email: ${data.email}, Phone: ${data.phone}${data.organization ? `, Organization: ${data.organization}` : ""}`,
            };

            console.log("Creating purchase:", purchaseData);

            const purchase = await createPurchaseMutation.mutateAsync(purchaseData);
            
            // Extract purchase ID from response (handle different response structures)
            // The API may return Purchase directly or wrapped in { data: Purchase | Purchase[] }
            let purchaseIdValue: string | undefined;
            const purchaseAny = purchase as any; // Handle wrapped responses
            
            if (purchaseAny?.id) {
                // Direct Purchase object
                purchaseIdValue = purchaseAny.id;
            } else if (purchaseAny?.data) {
                // Wrapped response: { data: Purchase | Purchase[] }
                const data = purchaseAny.data;
                if (Array.isArray(data) && data.length > 0 && data[0]?.id) {
                    purchaseIdValue = data[0].id;
                } else if (data?.id) {
                    purchaseIdValue = data.id;
                }
            }
            
            if (purchaseIdValue) {
                setPurchaseId(purchaseIdValue);
            }

            // If free tickets, go directly to success
            if (totalAmount === 0) {
                setDirection(1);
                setStep("success");
                setIsSubmitting(false);
                toast({
                    title: "Registration Successful!",
                    description: "Your free tickets have been generated. Check your email for confirmation.",
                });
            } else {
                // For paid tickets, proceed to payment step
                // TODO: Integrate M-Pesa STK Push here
                console.log("Initiating payment for purchase:", purchase.id);
                setDirection(1);
                setStep("payment");
                setPaymentTimer(5);
            }
        } catch (error) {
            console.error("Failed to submit order", error);
            setIsSubmitting(false);
            // Error toast is handled by mutation onError
        }
    };

    useEffect(() => {
        if (step === "payment" && purchaseId) {
            // TODO: Poll purchase status or wait for M-Pesa callback
            // For now, simulate payment completion after timer
            const interval = setInterval(() => {
                setPaymentTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        // In production, check purchase status here
                        // For now, proceed to success
                        setDirection(1);
                        setStep("success");
                        setIsSubmitting(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [step, purchaseId]);

    const handleClose = () => {
        onOpenChange(false);
        setTimeout(() => {
            setStep("tickets");
            setDirection(0);
            setQuantities({});
            setIsSubmitting(false);
            setPurchaseId(null);
        }, 300);
    };

    const totalTickets = Object.values(quantities).reduce((sum, q) => sum + q, 0);

    const getCurrentStepIndex = () => steps.findIndex(s => s.id === step);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden gap-0 bg-background w-[95vw]">
                <motion.div 
                    className="p-3 sm:p-4 border-b border-border bg-card"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                >
                    <DialogHeader className="space-y-2 text-left">
                        <div className="space-y-1.5">
                            <motion.div 
                                className="flex items-center gap-2 text-primary text-[10px] sm:text-xs font-semibold uppercase tracking-wider"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1, duration: 0.4 }}
                            >
                                <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                <span>{new Date(event.date).toLocaleDateString()}</span>
                                <span className="text-muted-foreground">•</span>
                                <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                <span className="truncate max-w-[150px] sm:max-w-none">{event.location === "METROPOLIS" ? "Rupa mall Grounds" : (event.venue || event.location)}</span>
                            </motion.div>
                            <DialogTitle className="text-lg sm:text-xl font-bold leading-tight text-foreground">
                                <motion.span
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.4 }}
                                    className="line-clamp-2"
                                >
                                    Register for {event.name}
                                </motion.span>
                            </DialogTitle>
                            <DialogDescription className="text-muted-foreground text-xs sm:text-sm max-w-2xl">
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={step}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {step === "tickets" && "Select your tickets to proceed."}
                                        {step === "checkout" && "Enter your details to complete registration."}
                                        {step === "payment" && "Awaiting Payment Confirmation"}
                                        {step === "success" && "Registration Successful!"}
                                    </motion.span>
                                </AnimatePresence>
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    <motion.div 
                        className="mt-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                    >
                        <div className="flex items-center justify-between max-w-full">
                            {steps.map((s, index) => {
                                const Icon = s.icon;
                                const isActive = step === s.id;
                                const isCompleted = getCurrentStepIndex() > index;
                                const isPending = getCurrentStepIndex() < index;

                                return (
                                    <div key={s.id} className="flex items-center flex-1 last:flex-none min-w-0">
                                        <div className="flex flex-col items-center gap-1">
                                            <motion.div
                                                className={cn(
                                                    "w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-colors duration-300 flex-shrink-0",
                                                    isActive && "text-primary-foreground shadow-lg shadow-primary/20",
                                                    isCompleted && "text-secondary-foreground",
                                                    isPending && "text-muted-foreground border border-border"
                                                )}
                                                variants={stepIndicatorVariants}
                                                initial={isPending ? "inactive" : isActive ? "active" : "completed"}
                                                animate={isPending ? "inactive" : isActive ? "active" : "completed"}
                                                whileHover={!isPending ? { scale: 1.1 } : {}}
                                            >
                                                <AnimatePresence mode="wait">
                                                    {isCompleted ? (
                                                        <motion.div
                                                            key="check"
                                                            initial={{ scale: 0, rotate: -180 }}
                                                            animate={{ scale: 1, rotate: 0 }}
                                                            exit={{ scale: 0, rotate: 180 }}
                                                            transition={{ type: "spring", stiffness: 300 }}
                                                        >
                                                            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                        </motion.div>
                                                    ) : (
                                                        <motion.div
                                                            key="icon"
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            exit={{ scale: 0 }}
                                                        >
                                                            <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                            <motion.span
                                                className={cn(
                                                    "text-[9px] sm:text-[10px] font-medium uppercase tracking-wider whitespace-nowrap",
                                                    isActive && "text-primary",
                                                    isCompleted && "text-secondary",
                                                    isPending && "text-muted-foreground"
                                                )}
                                                animate={{
                                                    opacity: isActive ? 1 : 0.6,
                                                    y: isActive ? 0 : 2
                                                }}
                                            >
                                                {s.label}
                                            </motion.span>
                                        </div>
                                        {index < steps.length - 1 && (
                                            <motion.div
                                                className={cn(
                                                    "h-0.5 flex-1 mx-2 sm:mx-3",
                                                    isCompleted ? "bg-secondary" : "bg-border"
                                                )}
                                                initial={{ scaleX: 0, originX: 0 }}
                                                animate={{ scaleX: isCompleted ? 1 : 0.3 }}
                                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                </motion.div>

                <div className="p-4 sm:p-6 bg-background max-h-[60vh] overflow-y-auto overflow-x-hidden">
                    <AnimatePresence mode="wait" custom={direction}>
                        {step === "tickets" && (
                            <motion.div
                                key="tickets"
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                            >
                                <TicketSelection
                                    eventId={event.id}
                                    quantities={quantities}
                                    onQuantitiesChange={setQuantities}
                                    onProceed={handleProceedToCheckout}
                                />
                            </motion.div>
                        )}

                        {step === "checkout" && ticketTypes && (
                            <motion.div
                                key="checkout"
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                            >
                                <CheckoutForm
                                    quantities={quantities}
                                    ticketTypes={ticketTypes}
                                    onBack={handleBackToTickets}
                                    onSubmit={handleSubmitOrder}
                                    isSubmitting={isSubmitting}
                                />
                            </motion.div>
                        )}

                        {step === "payment" && (
                            <motion.div
                                key="payment"
                                variants={fadeInVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.4 }}
                                className="flex flex-col items-center justify-center py-12 space-y-6 text-center"
                            >
                                <motion.div 
                                    className="relative"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                >
                                    <motion.div 
                                        className="absolute inset-0 bg-primary/20 blur-xl rounded-full"
                                        animate={{ 
                                            scale: [1, 1.2, 1],
                                            opacity: [0.5, 0.8, 0.5]
                                        }}
                                        transition={{ 
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    />
                                    <Card className="w-24 h-24 rounded-full bg-card border-2 border-primary/20 flex items-center justify-center relative z-10">
                                        <motion.div
                                            animate={{ y: [0, -5, 0] }}
                                            transition={{ 
                                                duration: 1.5,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                        >
                                            <Phone className="w-10 h-10 text-primary" />
                                        </motion.div>
                                    </Card>
                                </motion.div>

                                <motion.div 
                                    className="space-y-3 max-w-md"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.4 }}
                                >
                                    <h3 className="text-2xl font-bold text-foreground">Check your phone</h3>
                                    <p className="text-muted-foreground">
                                        We've sent an M-PESA prompt to your number. Please enter your PIN to complete the payment.
                                    </p>
                                    <motion.div 
                                        className="flex items-center justify-center gap-2 text-sm font-medium text-primary bg-primary/10 py-2 px-4 rounded-full mx-auto w-fit"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.3, duration: 0.3 }}
                                    >
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        >
                                            <Loader2 className="w-4 h-4" />
                                        </motion.div>
                                        <span>Waiting for payment... {paymentTimer}s</span>
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        )}

                        {step === "success" && (
                            <motion.div
                                key="success"
                                variants={fadeInVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.5 }}
                                className="flex flex-col items-center justify-center py-12 space-y-6 text-center"
                            >
                                <motion.div 
                                    className="relative"
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                                >
                                    {/* Confetti particles */}
                                    <div className="absolute inset-0 pointer-events-none">
                                        {[...Array(8)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                custom={i}
                                                variants={confettiVariants}
                                                initial="hidden"
                                                animate="visible"
                                                className="absolute"
                                                style={{
                                                    left: `${50 + Math.cos(i * 45 * Math.PI / 180) * 60}%`,
                                                    top: `${50 + Math.sin(i * 45 * Math.PI / 180) * 60}%`,
                                                }}
                                            >
                                                <Sparkles 
                                                    className={`w-5 h-5 ${
                                                        i % 3 === 0 ? 'text-yellow-500' : 
                                                        i % 3 === 1 ? 'text-green-500' : 'text-primary'
                                                    }`}
                                                />
                                            </motion.div>
                                        ))}
                                    </div>
                                    
                                    <motion.div 
                                        className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 shadow-xl shadow-green-100 dark:shadow-green-900/30"
                                        variants={circleVariants}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        <svg 
                                            width="48" 
                                            height="48" 
                                            viewBox="0 0 48 48" 
                                            fill="none" 
                                            className="text-green-600 dark:text-green-400"
                                        >
                                            <motion.circle
                                                cx="24"
                                                cy="24"
                                                r="20"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                fill="none"
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ duration: 0.5, ease: "easeOut" }}
                                            />
                                            <motion.path
                                                d="M14 24L20 30L34 16"
                                                stroke="currentColor"
                                                strokeWidth="3"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                variants={checkmarkVariants}
                                                initial="hidden"
                                                animate="visible"
                                            />
                                        </svg>
                                    </motion.div>
                                </motion.div>

                                <motion.div 
                                    className="space-y-2"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.4 }}
                                >
                                    <h3 className="text-2xl font-bold text-foreground">You're all set!</h3>
                                    <p className="text-muted-foreground max-w-md mx-auto">
                                        {purchaseId 
                                            ? "Your purchase has been confirmed. We've sent your tickets to your email."
                                            : "Payment received and registration confirmed. We've sent your tickets to your email."}
                                    </p>
                                    {purchaseId && (
                                        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-xs text-muted-foreground mt-3">
                                            <p className="font-medium text-foreground mb-1">Purchase Confirmed</p>
                                            <p>Purchase ID: <code className="text-primary">{purchaseId}</code></p>
                                        </div>
                                    )}
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, duration: 0.4 }}
                                >
                                    <Card className="p-4 w-full max-w-sm space-y-2 text-sm border border-border bg-card">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Tickets</span>
                                            <motion.span 
                                                className="font-medium text-foreground"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.7 }}
                                            >
                                                {totalTickets}
                                            </motion.span>
                                        </div>
                                        {purchaseId && (
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Purchase ID</span>
                                                <motion.span 
                                                    className="font-mono text-xs text-foreground"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.75 }}
                                                >
                                                    {purchaseId.slice(0, 8)}...
                                                </motion.span>
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Status</span>
                                            <motion.span 
                                                className="text-green-600 dark:text-green-400 font-bold"
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.8, type: "spring", stiffness: 300 }}
                                            >
                                                Confirmed
                                            </motion.span>
                                        </div>
                                    </Card>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6, duration: 0.4 }}
                                >
                                    <Button 
                                        onClick={handleClose} 
                                        size="lg" 
                                        className="min-w-[200px] shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
                                    >
                                        View My Tickets
                                    </Button>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </DialogContent>
        </Dialog>
    );
}
