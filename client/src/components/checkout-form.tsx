import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, ArrowLeft, Mail, User, Building } from "lucide-react";
import type { HardcodedTicketType } from "@/data/registration-data";
import { motion } from "framer-motion";

const formSchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    organization: z.string().optional(),
});

interface CheckoutFormProps {
    quantities: Record<string, number>;
    ticketTypes: HardcodedTicketType[];
    onBack: () => void;
    onSubmit: (data: z.infer<typeof formSchema>) => void;
    isSubmitting: boolean;
}

const inputVariants = {
    focus: { 
        scale: 1.01, 
        boxShadow: "0 0 0 3px hsl(var(--primary) / 0.2)",
        transition: { duration: 0.2 } 
    },
    blur: { 
        scale: 1, 
        boxShadow: "0 0 0 0px hsl(var(--primary) / 0)",
        transition: { duration: 0.2 } 
    }
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }
    }
};

const buttonVariants = {
    tap: { scale: 0.96 },
    hover: { scale: 1.02 }
};

const summaryItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: { delay: i * 0.08, duration: 0.3 }
    })
};

export function CheckoutForm({ quantities, ticketTypes, onBack, onSubmit, isSubmitting }: CheckoutFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            organization: "",
        },
    });

    const selectedTickets = ticketTypes.filter(t => quantities[t.id]);
    const totalPrice = selectedTickets.reduce((sum, t) => sum + (t.price * quantities[t.id]), 0);
    const currency = selectedTickets[0]?.currency || 'KES';

    return (
        <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Card className="p-6 bg-white dark:bg-card border border-border shadow-lg">
                    <h4 className="text-lg font-bold text-foreground mb-4">Order Summary</h4>
                    <div className="text-sm space-y-2">
                        {selectedTickets.map((ticket, i) => (
                            <motion.div 
                                key={ticket.id} 
                                className="flex justify-between items-center py-1"
                                custom={i}
                                variants={summaryItemVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                <span className="text-muted-foreground">
                                    {quantities[ticket.id]}x <span className="text-foreground font-medium">{ticket.name}</span>
                                </span>
                                <span className="font-medium">{currency} {(ticket.price * quantities[ticket.id]).toLocaleString()}</span>
                            </motion.div>
                        ))}
                        <motion.div 
                            className="border-t pt-3 mt-3 flex justify-between font-bold text-lg"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <span>Total</span>
                            <motion.span
                                key={totalPrice}
                                className="text-primary"
                                initial={{ scale: 1.1 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                {currency} {totalPrice.toLocaleString()}
                            </motion.span>
                        </motion.div>
                    </div>
                </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
                <Card className="p-8 bg-white dark:bg-card border-0 shadow-2xl">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-foreground">First Name</FormLabel>
                                            <FormControl>
                                                <motion.div
                                                    className="relative"
                                                    variants={inputVariants}
                                                    whileFocus="focus"
                                                >
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors" />
                                                    <Input 
                                                        placeholder="John" 
                                                        className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                                        {...field} 
                                                    />
                                                </motion.div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-foreground">Last Name</FormLabel>
                                            <FormControl>
                                                <motion.div
                                                    className="relative"
                                                    variants={inputVariants}
                                                    whileFocus="focus"
                                                >
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors" />
                                                    <Input 
                                                        placeholder="Doe" 
                                                        className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                                        {...field} 
                                                    />
                                                </motion.div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-foreground">Email Address</FormLabel>
                                        <FormControl>
                                            <motion.div
                                                className="relative"
                                                variants={inputVariants}
                                                whileFocus="focus"
                                            >
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors" />
                                                <Input 
                                                    type="email" 
                                                    placeholder="john@example.com" 
                                                    className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                                    {...field} 
                                                />
                                            </motion.div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-foreground">Phone Number</FormLabel>
                                        <FormControl>
                                            <motion.div 
                                                className="relative flex items-center"
                                                variants={inputVariants}
                                                whileFocus="focus"
                                            >
                                                <div className="flex w-full">
                                                    <span className="inline-flex items-center px-3 py-2 text-sm text-muted-foreground bg-muted border border-r-0 border-input rounded-l-md">
                                                        +254
                                                    </span>
                                                    <Input 
                                                        type="tel" 
                                                        placeholder="712 345 678" 
                                                        className="rounded-l-none pl-3 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                                        {...field} 
                                                    />
                                                </div>
                                            </motion.div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="organization"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-foreground">Organization (Optional)</FormLabel>
                                        <FormControl>
                                            <motion.div
                                                className="relative"
                                                variants={inputVariants}
                                                whileFocus="focus"
                                            >
                                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors" />
                                                <Input 
                                                    placeholder="Company Name" 
                                                    className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                                    {...field} 
                                                />
                                            </motion.div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <motion.div 
                                className="flex gap-4 pt-4"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <motion.div
                                    variants={buttonVariants}
                                    whileTap="tap"
                                    whileHover="hover"
                                    className="flex-shrink-0"
                                >
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        onClick={onBack} 
                                        disabled={isSubmitting}
                                        className="px-6 transition-all duration-200 hover:bg-muted"
                                    >
                                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                                    </Button>
                                </motion.div>
                                
                                <motion.div
                                    variants={buttonVariants}
                                    whileTap="tap"
                                    whileHover="hover"
                                    className="flex-1"
                                >
                                    <Button 
                                        type="submit" 
                                        size="lg"
                                        className="w-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200" 
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <motion.div 
                                                className="flex items-center justify-center"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                            >
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                    className="mr-2"
                                                >
                                                    <Loader2 className="h-4 w-4" />
                                                </motion.div>
                                                Processing...
                                            </motion.div>
                                        ) : (
                                            "Complete Registration"
                                        )}
                                    </Button>
                                </motion.div>
                            </motion.div>
                        </form>
                    </Form>
                </Card>
            </motion.div>
        </motion.div>
    );
}
