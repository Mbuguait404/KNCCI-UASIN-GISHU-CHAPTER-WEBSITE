import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { TicketSelection } from "@/components/ticket-selection";
import { CheckoutForm } from "@/components/checkout-form";
import { Event } from "@shared/schema";
import { Calendar, MapPin, CheckCircle2, Phone, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { ticketing } from "@/lib/ticketing";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

interface RegistrationDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    event: Event;
}

type Step = "tickets" | "checkout" | "payment" | "success";

export function RegistrationDialog({ isOpen, onOpenChange, event }: RegistrationDialogProps) {
    const [step, setStep] = useState<Step>("tickets");
    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentTimer, setPaymentTimer] = useState(5);

    const { data: ticketTypes } = useQuery({
        queryKey: ["ticketTypes", event.id],
        queryFn: () => ticketing.getTicketTypes(event.id),
    });

    const handleProceedToCheckout = () => {
        setStep("checkout");
    };

    const handleBackToTickets = () => {
        setStep("tickets");
    };

    const handleSubmitOrder = async (data: any) => {
        setIsSubmitting(true);
        try {
            // Simulate initiating STK Push
            console.log("Initiating STK Push for order:", { eventId: event.id, quantities, user: data });
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Move to payment simulation step
            setStep("payment");
            setPaymentTimer(5);

        } catch (error) {
            console.error("Failed to submit order", error);
            setIsSubmitting(false);
        }
    };

    // Effect to handle the countdown and transition to success
    useEffect(() => {
        if (step === "payment") {
            const interval = setInterval(() => {
                setPaymentTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setStep("success");
                        setIsSubmitting(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [step]);

    const handleClose = () => {
        onOpenChange(false);
        // Reset state after a delay or immediately
        setTimeout(() => {
            setStep("tickets");
            setQuantities({});
            setIsSubmitting(false);
        }, 300);
    };

    const totalTickets = Object.values(quantities).reduce((sum, q) => sum + q, 0);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden gap-0 border-0 shadow-2xl">
                <div className="bg-gradient-to-r from-primary/90 to-primary text-primary-foreground p-6 sm:p-8">
                    <DialogHeader className="space-y-4 text-left">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-primary-foreground/80 text-sm font-medium uppercase tracking-wider">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(event.date).toLocaleDateString()}</span>
                                <span>•</span>
                                <MapPin className="w-4 h-4" />
                                <span>{event.location}</span>
                            </div>
                            <DialogTitle className="text-3xl sm:text-4xl font-bold leading-tight">
                                Register for {event.name}
                            </DialogTitle>
                            <DialogDescription className="text-primary-foreground/90 text-lg sm:text-xl max-w-2xl">
                                {step === "tickets" && "Select your tickets to proceed."}
                                {step === "checkout" && "Enter your details to complete registration."}
                                {step === "payment" && "Awaiting Payment Confirmation"}
                                {step === "success" && "Registration Successful!"}
                            </DialogDescription>
                        </div>
                    </DialogHeader>
                </div>

                <div className="p-6 sm:p-8 bg-background max-h-[70vh] overflow-y-auto">
                    {step === "tickets" && (
                        <TicketSelection
                            eventId={event.id}
                            quantities={quantities}
                            onQuantitiesChange={setQuantities}
                            onProceed={handleProceedToCheckout}
                        />
                    )}

                    {step === "checkout" && ticketTypes && (
                        <CheckoutForm
                            quantities={quantities}
                            ticketTypes={ticketTypes}
                            onBack={handleBackToTickets}
                            onSubmit={handleSubmitOrder}
                            isSubmitting={isSubmitting}
                        />
                    )}

                    {step === "payment" && (
                        <div className="flex flex-col items-center justify-center py-12 space-y-6 text-center animate-in fade-in zoom-in duration-300">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse"></div>
                                <div className="w-24 h-24 rounded-full bg-background border-4 border-primary/20 flex items-center justify-center relative z-10">
                                    <Phone className="w-10 h-10 text-primary animate-bounce" />
                                </div>
                            </div>

                            <div className="space-y-3 max-w-md">
                                <h3 className="text-2xl font-bold">Check your phone</h3>
                                <p className="text-muted-foreground">
                                    We've sent an M-PESA prompt to your number. Please enter your PIN to complete the payment.
                                </p>
                                <div className="flex items-center justify-center gap-2 text-sm font-medium text-primary bg-primary/10 py-2 px-4 rounded-full mx-auto w-fit">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Waiting for payment... {paymentTimer}s</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === "success" && (
                        <div className="flex flex-col items-center justify-center py-12 space-y-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-green-600 shadow-lg shadow-green-100">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold">You're all set!</h3>
                                <p className="text-muted-foreground max-w-md mx-auto">
                                    Payment received and registration confirmed. We've sent your tickets to your email.
                                </p>
                            </div>
                            <div className="bg-muted p-4 rounded-lg w-full max-w-sm space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Tickets</span>
                                    <span className="font-medium">{totalTickets}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Status</span>
                                    <span className="text-green-600 font-bold">Paid</span>
                                </div>
                            </div>
                            <Button onClick={handleClose} size="lg" className="min-w-[200px] shadow-lg shadow-primary/20">
                                View My Tickets
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
