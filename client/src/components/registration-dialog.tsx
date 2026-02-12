import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { TicketSelection } from "@/components/ticket-selection";
import { CheckoutForm } from "@/components/checkout-form";
import { Event } from "@shared/schema";
import { Calendar, MapPin, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { ticketing } from "@/lib/ticketing";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

interface RegistrationDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    event: Event;
}

type Step = "tickets" | "checkout" | "success";

export function RegistrationDialog({ isOpen, onOpenChange, event }: RegistrationDialogProps) {
    const [step, setStep] = useState<Step>("tickets");
    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

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
            // Mock API call
            console.log("Submitting order:", { eventId: event.id, quantities, user: data });
            await new Promise(resolve => setTimeout(resolve, 2000));
            setStep("success");
            // Reset state logically if needed, or keep for success view
        } catch (error) {
            console.error("Failed to submit order", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        onOpenChange(false);
        // Reset state after a delay or immediately
        setTimeout(() => {
            setStep("tickets");
            setQuantities({});
        }, 300);
    };

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

                    {step === "success" && (
                        <div className="flex flex-col items-center justify-center py-12 space-y-6 text-center">
                            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold">Registration Confirmed!</h3>
                                <p className="text-muted-foreground max-w-md mx-auto">
                                    Thank you for registering. A confirmation email has been sent to your inbox.
                                </p>
                            </div>
                            <Button onClick={handleClose} size="lg" className="min-w-[200px]">
                                Done
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
