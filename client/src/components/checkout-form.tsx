import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, ArrowLeft, Phone } from "lucide-react";
import { TicketType } from "@/lib/ticketing";

const formSchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    organization: z.string().optional(),
});

interface CheckoutFormProps {
    quantities: Record<string, number>;
    ticketTypes: TicketType[];
    onBack: () => void;
    onSubmit: (data: z.infer<typeof formSchema>) => void;
    isSubmitting: boolean;
}

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
        <div className="space-y-6">
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <h4 className="font-semibold">Order Summary</h4>
                <div className="text-sm space-y-1">
                    {selectedTickets.map(ticket => (
                        <div key={ticket.id} className="flex justify-between">
                            <span>{quantities[ticket.id]}x {ticket.name}</span>
                            <span>{currency} {(ticket.price * quantities[ticket.id]).toLocaleString()}</span>
                        </div>
                    ))}
                    <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>{currency} {totalPrice.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John" {...field} />
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
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Doe" {...field} />
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
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="john@example.com" {...field} />
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
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <span className="absolute left-9 top-2.5 text-sm text-muted-foreground font-medium">+254</span>
                                        <Input type="tel" placeholder="712 345 678" className="pl-20" {...field} />
                                    </div>
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
                                <FormLabel>Organization (Optional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Company Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex gap-4 pt-4">
                        <Button type="button" variant="outline" onClick={onBack} disabled={isSubmitting}>
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back
                        </Button>
                        <Button type="submit" className="flex-1" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                                </>
                            ) : (
                                "Complete Registration"
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
