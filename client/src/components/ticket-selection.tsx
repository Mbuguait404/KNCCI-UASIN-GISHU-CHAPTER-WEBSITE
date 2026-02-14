import { HARDCODED_TICKET_TYPES } from "@/data/registration-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ticket, Check, ArrowRight, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface TicketSelectionProps {
    eventId: string;
    quantities: Record<string, number>;
    onQuantitiesChange: (quantities: Record<string, number>) => void;
    onProceed: () => void;
}

// Ticket types are hardcoded - no loading/error states

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.08,
            duration: 0.4,
            ease: [0.25, 0.1, 0.25, 1]
        }
    })
};

const quantityVariants = {
    initial: { scale: 1 },
    animate: { scale: [1, 1.3, 1] },
};

const buttonVariants = {
    tap: { scale: 0.92 },
    hover: { scale: 1.05 }
};

const checkmarkVariants = {
    unchecked: { scale: 0, rotate: -180 },
    checked: { 
        scale: 1, 
        rotate: 0,
        transition: { type: "spring", stiffness: 300, damping: 20 }
    }
};

export function TicketSelection({ eventId, quantities, onQuantitiesChange, onProceed }: TicketSelectionProps) {
    const ticketTypes = HARDCODED_TICKET_TYPES;

    const updateQuantity = (id: string, delta: number) => {
        const current = quantities[id] || 0;
        const newQuantity = Math.max(0, current + delta);

        if (newQuantity > 10) return;

        const next = { ...quantities, [id]: newQuantity };
        if (newQuantity === 0) {
            delete next[id];
        }
        onQuantitiesChange(next);
    };

    const totalTickets = Object.values(quantities).reduce((sum, q) => sum + q, 0);
    const totalPrice = ticketTypes.reduce((sum, ticket) => {
        return sum + (ticket.price * (quantities[ticket.id] || 0));
    }, 0);
    const currency = ticketTypes[0]?.currency || 'KES';

    return (
        <div className="space-y-6">
            <motion.div 
                className="text-center space-y-2 mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <h3 className="text-2xl font-bold tracking-tight">Select Your Access Pass</h3>
                <p className="text-muted-foreground">Choose the tickets that best suit your participation needs.</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ticketTypes.map((ticket, index) => {
                    const quantity = quantities[ticket.id] || 0;
                    const isSelected = quantity > 0;

                    return (
                        <motion.div
                            key={ticket.id}
                            custom={index}
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div
                                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Card
                                    className={cn(
                                        "relative overflow-hidden border border-border bg-card cursor-pointer transition-shadow duration-300",
                                        isSelected 
                                            ? "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-lg" 
                                            : "hover:shadow-lg"
                                    )}
                                    onClick={(e) => {
                                        if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.card-click-area')) {
                                            // Toggle selection: if selected, deselect; if not selected, select
                                            if (isSelected) {
                                                updateQuantity(ticket.id, -quantity); // Deselect by setting to 0
                                            } else {
                                                updateQuantity(ticket.id, 1);
                                            }
                                        }
                                    }}
                                >
                                    {/* Selection Indicator */}
                                    <motion.div 
                                        className={cn(
                                            "absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center z-10",
                                            isSelected 
                                                ? "bg-primary border-primary" 
                                                : "border-muted-foreground/30 bg-background"
                                        )}
                                        animate={isSelected ? "checked" : "unchecked"}
                                        variants={checkmarkVariants}
                                    >
                                        <AnimatePresence>
                                            {isSelected && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    exit={{ scale: 0 }}
                                                    transition={{ type: "spring", stiffness: 400 }}
                                                >
                                                    <Check className="w-4 h-4 text-primary-foreground" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>

                                    <CardHeader className="pb-3 card-click-area">
                                        <div className="flex items-start gap-4">
                                            <motion.div 
                                                className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center"
                                                whileHover={{ rotate: 10, scale: 1.1 }}
                                                transition={{ type: "spring", stiffness: 400 }}
                                            >
                                                <Ticket className="w-6 h-6 text-primary" />
                                            </motion.div>
                                            <div className="flex-1 pr-8">
                                                <CardTitle className="text-lg font-semibold text-foreground">
                                                    {ticket.name}
                                                </CardTitle>
                                                <CardDescription className="line-clamp-2 mt-1">
                                                    {ticket.description}
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        {/* Price Display */}
                                        <div className="flex items-baseline gap-1 card-click-area">
                                            {ticket.price === 0 ? (
                                                <span className="text-3xl font-bold text-secondary">Free</span>
                                            ) : (
                                                <>
                                                    <span className="text-sm text-muted-foreground font-medium">{ticket.currency}</span>
                                                    <motion.span 
                                                        className="text-3xl font-bold text-foreground"
                                                        key={ticket.price}
                                                        initial={{ scale: 1.1 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ type: "spring", stiffness: 300 }}
                                                    >
                                                        {ticket.price.toLocaleString()}
                                                    </motion.span>
                                                </>
                                            )}
                                        </div>

                                        {/* Benefits */}
                                        <div className="space-y-2 text-sm">
                                            <motion.div 
                                                className="flex items-center gap-2"
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 + 0.2 }}
                                            >
                                                <motion.div 
                                                    className="w-4 h-4 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0"
                                                    whileHover={{ scale: 1.2 }}
                                                >
                                                    <Check className="w-2.5 h-2.5 text-secondary" />
                                                </motion.div>
                                                <span className="text-muted-foreground">Full Event Access</span>
                                            </motion.div>
                                            <motion.div 
                                                className="flex items-center gap-2"
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 + 0.3 }}
                                            >
                                                <motion.div 
                                                    className="w-4 h-4 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0"
                                                    whileHover={{ scale: 1.2 }}
                                                >
                                                    <Check className="w-2.5 h-2.5 text-secondary" />
                                                </motion.div>
                                                <span className="text-muted-foreground">Networking Sessions</span>
                                            </motion.div>
                                            {ticket.price > 0 && (
                                                <motion.div 
                                                    className="flex items-center gap-2"
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.05 + 0.4 }}
                                                >
                                                    <motion.div 
                                                        className="w-4 h-4 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0"
                                                        whileHover={{ scale: 1.2 }}
                                                    >
                                                        <Check className="w-2.5 h-2.5 text-secondary" />
                                                    </motion.div>
                                                    <span className="text-muted-foreground">Gala Dinner Access</span>
                                                </motion.div>
                                            )}
                                        </div>

                                        {/* Quantity Controls */}
                                        <motion.div 
                                            className={cn(
                                                "flex items-center justify-between w-full rounded-lg p-2 border transition-colors duration-200",
                                                isSelected 
                                                    ? "bg-primary/5 border-primary/30" 
                                                    : "bg-muted/50 border-border"
                                            )}
                                            animate={{
                                                backgroundColor: isSelected ? "hsl(var(--primary) / 0.05)" : "hsl(var(--muted) / 0.5)",
                                                borderColor: isSelected ? "hsl(var(--primary) / 0.3)" : "hsl(var(--border))"
                                            }}
                                        >
                                            <motion.div
                                                variants={buttonVariants}
                                                whileTap="tap"
                                                whileHover="hover"
                                            >
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-md border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        updateQuantity(ticket.id, -1);
                                                    }}
                                                    disabled={quantity === 0}
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </Button>
                                            </motion.div>
                                            <div className="flex flex-col items-center">
                                                <motion.span 
                                                    className="font-bold text-xl w-10 text-center tabular-nums text-foreground"
                                                    key={quantity}
                                                    variants={quantityVariants}
                                                    initial="initial"
                                                    animate="animate"
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    {quantity}
                                                </motion.span>
                                                <AnimatePresence>
                                                    {isSelected && (
                                                        <motion.span 
                                                            className="text-[10px] uppercase tracking-wider text-primary font-semibold"
                                                            initial={{ opacity: 0, y: -5 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -5 }}
                                                        >
                                                            Selected
                                                        </motion.span>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                            <motion.div
                                                variants={buttonVariants}
                                                whileTap="tap"
                                                whileHover="hover"
                                            >
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-md border-border hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        updateQuantity(ticket.id, 1);
                                                    }}
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </Button>
                                            </motion.div>
                                        </motion.div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Total Summary */}
            <motion.div 
                className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border pt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
            >
                <div className="flex flex-col items-center sm:items-start text-sm">
                    <span className="text-muted-foreground font-medium">Total Summary</span>
                    <div className="flex items-baseline gap-2">
                        <motion.span 
                            className="text-2xl font-bold text-foreground"
                            key={totalPrice}
                            initial={{ scale: 1.2, color: "#000" }}
                            animate={{ scale: 1, color: "inherit" }}
                            transition={{ duration: 0.2 }}
                        >
                            {currency} {totalPrice.toLocaleString()}
                        </motion.span>
                        <span className="text-muted-foreground">
                            for {totalTickets} ticket{totalTickets !== 1 ? 's' : ''}
                        </span>
                    </div>
                </div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Button
                        size="lg"
                        disabled={totalTickets === 0}
                        onClick={onProceed}
                        className="w-full sm:w-auto gap-2 px-8 shadow-lg shadow-primary/20 min-w-[200px] hover:shadow-xl hover:shadow-primary/30 transition-all"
                    >
                        Proceed to Registration 
                        <motion.div
                            animate={{ x: [0, 4, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <ArrowRight className="w-4 h-4" />
                        </motion.div>
                    </Button>
                </motion.div>
            </motion.div>
        </div>
    );
}
