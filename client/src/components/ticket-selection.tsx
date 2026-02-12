import { useQuery } from "@tanstack/react-query";
import { ticketing, type TicketType } from "@/lib/ticketing";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Ticket, Check, ArrowRight, Plus, Minus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface TicketSelectionProps {
    eventId: string;
}

export function TicketSelection({ eventId }: TicketSelectionProps) {
    const { toast } = useToast();
    // Track quantity for each ticket type: { [ticketId]: quantity }
    const [quantities, setQuantities] = useState<Record<string, number>>({});

    const { data: ticketTypes, isLoading, error } = useQuery({
        queryKey: ["ticketTypes", eventId],
        queryFn: () => ticketing.getTicketTypes(eventId),
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 space-y-4 text-muted-foreground">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p>Loading ticket options...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-12 space-y-4 text-red-500 bg-red-50 rounded-lg border border-red-100">
                <p className="font-medium">Failed to load ticket options.</p>
                <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
            </div>
        );
    }

    const updateQuantity = (id: string, delta: number) => {
        setQuantities(prev => {
            const current = prev[id] || 0;
            const newQuantity = Math.max(0, current + delta);

            // Limit max quantity per ticket type if needed (e.g., 10)
            if (newQuantity > 10) return prev;

            const next = { ...prev, [id]: newQuantity };
            if (newQuantity === 0) {
                delete next[id];
            }
            return next;
        });
    };

    const totalTickets = Object.values(quantities).reduce((sum, q) => sum + q, 0);
    const totalPrice = ticketTypes?.reduce((sum, ticket) => {
        return sum + (ticket.price * (quantities[ticket.id] || 0));
    }, 0) || 0;
    // Assuming all tickets have the same currency for now, or take the first one
    const currency = ticketTypes?.[0]?.currency || 'KES';

    const handleRegister = () => {
        if (totalTickets === 0) return;

        // Placeholder for registration flow
        toast({
            title: "Registration Started",
            description: `Selected ${totalTickets} tickets. Total: ${currency} ${totalPrice.toLocaleString()}. Implementation pending.`
        });
    }

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2 mb-8">
                <h3 className="text-2xl font-bold tracking-tight">Select Your Access Pass</h3>
                <p className="text-muted-foreground">Choose the tickets that best suit your participation needs.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ticketTypes?.map((ticket) => {
                    const quantity = quantities[ticket.id] || 0;
                    const isSelected = quantity > 0;

                    return (
                        <Card
                            key={ticket.id}
                            className={cn(
                                "relative overflow-hidden transition-all duration-300 hover:shadow-xl",
                                isSelected
                                    ? 'border-primary ring-2 ring-primary/20 shadow-lg bg-primary/5'
                                    : 'border-border/50 hover:border-primary/50'
                            )}
                        >
                            {isSelected && (
                                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold rounded-bl-lg z-10 flex items-center gap-1">
                                    <Check className="w-3 h-3" /> {quantity} Selected
                                </div>
                            )}

                            <CardHeader className="pb-4">
                                <div className="p-3 w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                                    <Ticket className="w-6 h-6" />
                                </div>
                                <CardTitle className="text-xl">{ticket.name}</CardTitle>
                                <CardDescription className="line-clamp-2 min-h-[2.5rem]">{ticket.description}</CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-4 pb-6">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-bold">
                                        {ticket.price === 0 ? "Free" : `${ticket.currency} ${ticket.price.toLocaleString()}`}
                                    </span>
                                </div>

                                <div className="space-y-2 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-green-500" />
                                        <span>Full Event Access</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-green-500" />
                                        <span>Networking Sessions</span>
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="pt-0">
                                <div className="flex items-center justify-between w-full bg-background/50 rounded-lg p-1 border border-border/50">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                                        onClick={() => updateQuantity(ticket.id, -1)}
                                        disabled={quantity === 0}
                                    >
                                        <Minus className="w-4 h-4" />
                                    </Button>
                                    <span className="font-bold text-lg w-8 text-center tabular-nums">
                                        {quantity}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                                        onClick={() => updateQuantity(ticket.id, 1)}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-6">
                <div className="flex flex-col items-center sm:items-start text-sm">
                    <span className="text-muted-foreground">Total Summary</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-foreground">
                            {currency} {totalPrice.toLocaleString()}
                        </span>
                        <span className="text-muted-foreground">
                            for {totalTickets} ticket{totalTickets !== 1 ? 's' : ''}
                        </span>
                    </div>
                </div>

                <Button
                    size="lg"
                    disabled={totalTickets === 0}
                    onClick={handleRegister}
                    className="w-full sm:w-auto gap-2 px-8 shadow-lg shadow-primary/20 min-w-[200px]"
                >
                    Proceed to Registration <ArrowRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
