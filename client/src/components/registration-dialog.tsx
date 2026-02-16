import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { TicketSelection } from "@/components/ticket-selection";
import { CheckoutForm } from "@/components/checkout-form";
import { Event } from "@shared/schema";
import { Calendar, MapPin, CheckCircle2, Phone, Loader2, Ticket, User, CreditCard, Check, Mail } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { submitRegistration } from "@/lib/registration-api";
import { REGISTRATION_EVENT, HARDCODED_TICKET_TYPES } from "@/data/registration-data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { processMockMpesaPayment, type MockMpesaPaymentStatus } from "@/lib/mock-mpesa";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RegistrationDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    event: Event;
}

type Step = "tickets" | "checkout" | "payment" | "success";

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
    const [phoneNumber, setPhoneNumber] = useState("");
    const [paymentStatus, setPaymentStatus] = useState<MockMpesaPaymentStatus | null>(null);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [customerData, setCustomerData] = useState<any>(null);

    const ticketTypes = HARDCODED_TICKET_TYPES;

    // Calculate total amount based on selected tickets
    const totalAmount = useMemo(() => {
        return ticketTypes?.reduce((sum, ticket) => {
            return sum + (ticket.price * (quantities[ticket.id] || 0));
        }, 0) || 0;
    }, [quantities, ticketTypes]);

    // Dynamic steps array - exclude payment step for free events
    const steps = useMemo(() => {
        const baseSteps = [
            { id: "tickets" as Step, label: "Select Tickets", icon: Ticket },
            { id: "checkout" as Step, label: "Your Details", icon: User },
        ];
        
        // Only include payment step if there's a cost
        if (totalAmount > 0) {
            baseSteps.push({ id: "payment" as Step, label: "Payment", icon: CreditCard });
        }
        
        baseSteps.push({ id: "success" as Step, label: "Complete", icon: Check });
        return baseSteps;
    }, [totalAmount]);

    const handleProceedToCheckout = () => {
        setDirection(1);
        setStep("checkout");
    };

    const handleBackToTickets = () => {
        setDirection(-1);
        setStep("tickets");
    };

    const buildRegistrationPayload = (
        data: { firstName: string; lastName: string; email: string; phone: string; organization?: string },
        payment: { method: string; amount: number; status: string; currency?: string; transactionId?: string; phoneNumber?: string; paidAt?: string }
    ) => ({
        event: { id: REGISTRATION_EVENT.id, name: REGISTRATION_EVENT.name },
        attendee: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            organization: data.organization || undefined,
        },
        tickets: Object.entries(quantities)
            .filter(([_, qty]) => qty > 0)
            .map(([ticketTypeId, qty]) => {
                const tt = ticketTypes.find(t => t.id === ticketTypeId)!;
                return {
                    ticketTypeId,
                    name: tt.name,
                    quantity: qty,
                    price: tt.price,
                    currency: tt.currency,
                };
            }),
        payment: {
            method: payment.method,
            amount: payment.amount,
            status: payment.status,
            currency: payment.currency || "KES",
            transactionId: payment.transactionId,
            phoneNumber: payment.phoneNumber,
            paidAt: payment.paidAt,
        },
        metadata: {
            source: "event-sphere-web",
            userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
            timestamp: new Date().toISOString(),
        },
    });

    const handleSubmitOrder = async (data: any) => {
        setIsSubmitting(true);
        setCustomerData(data);
        
        try {
            const ticketItems = Object.entries(quantities).filter(([_, qty]) => qty > 0);
            if (ticketItems.length === 0) {
                toast({
                    title: "No Tickets Selected",
                    description: "Please select at least one ticket to proceed.",
                    variant: "destructive",
                });
                setIsSubmitting(false);
                return;
            }

            // For free tickets, submit registration and go directly to success
            if (totalAmount === 0) {
                const payload = buildRegistrationPayload(data, {
                    method: "none",
                    amount: 0,
                    status: "completed",
                });
                await submitRegistration(payload);
                setPurchaseId(`reg-${Date.now()}`);
                setDirection(1);
                setStep("success");
                setIsSubmitting(false);
                toast({
                    title: "Registration Successful!",
                    description: "Your free tickets have been confirmed. Check your email for details.",
                });
                return;
            }

            // For paid tickets, proceed to payment step
            setDirection(1);
            setStep("payment");
            setIsSubmitting(false);
        } catch (error) {
            console.error("Failed to submit order", error);
            setIsSubmitting(false);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to process your request. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleMpesaPayment = async () => {
        if (!phoneNumber.trim()) {
            toast({
                title: "Phone Number Required",
                description: "Please enter your M-Pesa phone number to proceed with payment.",
                variant: "destructive",
            });
            return;
        }

        setIsProcessingPayment(true);
        setPaymentStatus(null);

        try {
            // Determine ticket type name for reference
            const ticketTypeNames = ticketTypes
                ?.filter(tt => quantities[tt.id] > 0)
                .map(tt => tt.name)
                .join(", ") || "Event Tickets";

            const paymentResult = await processMockMpesaPayment(
                {
                    phoneNumber,
                    amount: totalAmount,
                    accountReference: `EVENT-${event.id.substring(0, 8).toUpperCase()}`,
                    transactionDesc: `${ticketTypeNames} - ${event.name}`,
                },
                (status) => {
                    setPaymentStatus(status);
                }
            );

            if (paymentResult.success) {
                try {
                    const payload = buildRegistrationPayload(customerData, {
                        method: "M-Pesa",
                        amount: totalAmount,
                        status: "completed",
                        currency: "KES",
                        transactionId: paymentResult.status?.transactionId,
                        phoneNumber: phoneNumber.trim(),
                        paidAt: new Date().toISOString(),
                    });
                    await submitRegistration(payload);
                    setPurchaseId(`reg-${Date.now()}`);

                    toast({
                        title: "Payment Successful!",
                        description: "Your payment has been confirmed. Registration complete.",
                    });

                    await new Promise(resolve => setTimeout(resolve, 1500));

                    setDirection(1);
                    setStep("success");
                    setIsProcessingPayment(false);
                } catch (error) {
                    console.error("Failed to submit registration after payment", error);
                    toast({
                        title: "Payment Successful",
                        description: "Payment confirmed, but there was an issue completing registration. Please contact support.",
                        variant: "destructive",
                    });
                    setIsProcessingPayment(false);
                }
            } else {
                // Payment failed
                toast({
                    title: "Payment Failed",
                    description: paymentResult.error || "Payment could not be processed. Please try again.",
                    variant: "destructive",
                });
                setIsProcessingPayment(false);
            }
        } catch (error) {
            console.error("Payment processing error", error);
            toast({
                title: "Payment Error",
                description: "An error occurred while processing your payment. Please try again.",
                variant: "destructive",
            });
            setIsProcessingPayment(false);
        }
    };

    // Reset payment state when dialog closes
    useEffect(() => {
        if (!isOpen) {
            setPhoneNumber("");
            setPaymentStatus(null);
            setIsProcessingPayment(false);
            setCustomerData(null);
        }
    }, [isOpen]);

    const handleClose = () => {
        onOpenChange(false);
        setTimeout(() => {
            setStep("tickets");
            setDirection(0);
            setQuantities({});
            setIsSubmitting(false);
            setPurchaseId(null);
            setPhoneNumber("");
            setPaymentStatus(null);
            setIsProcessingPayment(false);
            setCustomerData(null);
        }, 300);
    };

    const totalTickets = Object.values(quantities).reduce((sum, q) => sum + q, 0);

    const getCurrentStepIndex = () => steps.findIndex(s => s.id === step);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden gap-0 bg-background w-[95vw] max-h-[90vh] sm:max-h-[85vh] z-[100] flex flex-col">
                <motion.div 
                    className="p-3 sm:p-4 border-b border-border bg-muted/30 shrink-0"
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
                                        {step === "checkout" && totalAmount === 0 
                                            ? "Enter your details to complete your free registration." 
                                            : "Enter your details to complete registration."}
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
                                                    isActive && "text-primary-foreground shadow-lg shadow-primary/25 ring-2 ring-primary/30",
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

                <div className="flex-1 min-h-0 p-4 sm:p-6 pb-12 bg-background overflow-y-auto overflow-x-hidden">
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
                                className="flex flex-col items-center justify-center py-8 space-y-6"
                            >
                                {!isProcessingPayment ? (
                                    <>
                                        <motion.div 
                                            className="space-y-4 w-full max-w-md"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2, duration: 0.4 }}
                                        >
                                            <div className="text-center space-y-2 mb-6">
                                                <h3 className="text-2xl font-bold text-foreground">M-Pesa Payment</h3>
                                                <p className="text-muted-foreground">
                                                    Enter your M-Pesa phone number to receive a payment prompt
                                                </p>
                                            </div>

                                            <Card className="p-6 space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="phone">M-Pesa Phone Number</Label>
                                                    <Input
                                                        id="phone"
                                                        type="tel"
                                                        placeholder="0712345678 or 254712345678"
                                                        value={phoneNumber}
                                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                                        disabled={isProcessingPayment}
                                                        className="text-lg"
                                                    />
                                                    <p className="text-xs text-muted-foreground">
                                                        Format: 0712345678 or 254712345678
                                                    </p>
                                                </div>

                                                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-muted-foreground">Total Amount</span>
                                                        <span className="font-bold text-lg text-foreground">
                                                            KES {totalAmount.toLocaleString()}
                                                        </span>
                                                    </div>
                                                    {ticketTypes && (
                                                        <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t border-border">
                                                            {ticketTypes
                                                                .filter(tt => quantities[tt.id] > 0)
                                                                .map(tt => (
                                                                    <div key={tt.id} className="flex justify-between">
                                                                        <span>{tt.name} x{quantities[tt.id]}</span>
                                                                        <span>KES {(tt.price * quantities[tt.id]).toLocaleString()}</span>
                                                                    </div>
                                                                ))}
                                                        </div>
                                                    )}
                                                </div>

                                                <Button
                                                    onClick={handleMpesaPayment}
                                                    disabled={!phoneNumber.trim() || isProcessingPayment}
                                                    className="w-full"
                                                    size="lg"
                                                >
                                                    <Phone className="w-4 h-4 mr-2" />
                                                    Pay with M-Pesa
                                                </Button>
                                            </Card>
                                        </motion.div>
                                    </>
                                ) : (
                                    <>
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
                                            className="space-y-3 max-w-md text-center"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2, duration: 0.4 }}
                                        >
                                            <h3 className="text-2xl font-bold text-foreground">Check your phone</h3>
                                            <p className="text-muted-foreground">
                                                {paymentStatus?.status === 'pending' && "We've sent an M-PESA prompt to your number. Please check your phone."}
                                                {paymentStatus?.status === 'processing' && "You've entered your PIN. Processing your payment..."}
                                                {!paymentStatus && "Preparing payment request..."}
                                            </p>
                                            
                                            {paymentStatus && (
                                                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                                                    <div className="flex items-center justify-center gap-2 text-sm font-medium text-primary">
                                                        <motion.div
                                                            animate={{ rotate: 360 }}
                                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                        >
                                                            <Loader2 className="w-4 h-4" />
                                                        </motion.div>
                                                        <span className="capitalize">{paymentStatus.status}</span>
                                                    </div>
                                                    {paymentStatus.resultDesc && (
                                                        <p className="text-xs text-muted-foreground mt-2">
                                                            {paymentStatus.resultDesc}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </motion.div>
                                    </>
                                )}
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
                                className="flex flex-col items-center py-8 sm:py-10"
                            >
                                <motion.div 
                                    className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 border-2 border-green-200 dark:border-green-800"
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                                >
                                    <Check className="w-8 h-8" strokeWidth={2.5} />
                                </motion.div>

                                <motion.div 
                                    className="space-y-3 text-center max-w-md"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.4 }}
                                >
                                    <h3 className="text-xl sm:text-2xl font-semibold text-foreground">Registration Successful</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Your purchase has been confirmed. We&apos;ve sent your tickets to your email.
                                    </p>
                                    <div className="flex items-center justify-center gap-2 py-3 px-4 bg-muted/50 rounded-lg border border-border">
                                        <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                                        <p className="text-sm font-medium text-foreground">
                                            Please check your email inbox for your tickets
                                        </p>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.35, duration: 0.4 }}
                                    className="w-full max-w-sm"
                                >
                                    <Card className="p-5 border border-border bg-card/50">
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-muted-foreground">Tickets</span>
                                                <span className="font-medium text-foreground">{totalTickets}</span>
                                            </div>
                                            {purchaseId && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-muted-foreground">Reference</span>
                                                    <span className="font-mono text-xs text-foreground">{purchaseId}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between items-center pt-2 border-t border-border">
                                                <span className="text-sm text-muted-foreground">Status</span>
                                                <span className="text-sm font-medium text-green-600 dark:text-green-400">Confirmed</span>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, duration: 0.4 }}
                                    className="pt-4"
                                >
                                    <Button 
                                        onClick={handleClose} 
                                        size="lg" 
                                        className="min-w-[200px]"
                                    >
                                        Close
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
