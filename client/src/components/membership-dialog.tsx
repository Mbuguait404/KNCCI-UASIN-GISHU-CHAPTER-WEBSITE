import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { MembershipForm } from "./membership-form";
import { Briefcase, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MembershipDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function MembershipDialog({ isOpen, onOpenChange }: MembershipDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-4xl max-h-[95vh] p-0 overflow-hidden flex flex-col bg-background z-[100]">
                <DialogHeader className="p-6 pb-2 shrink-0 border-b bg-muted/30">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Briefcase className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold">Become a Member</DialogTitle>
                                <DialogDescription className="text-sm">
                                    Join KNCCI Uasin Gishu Chapter and grow your business network.
                                </DialogDescription>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <ScrollArea className="flex-1 overflow-y-auto">
                    <div className="p-6">
                        <MembershipDialogForm onComplete={() => onOpenChange(false)} />
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}

// Internal version of the form specifically for the modal
// We reuse the logic but might want to tweak the UI (e.g. no outer Card)
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMembershipApplicationSchema, type InsertMembershipApplication } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Send, Building2, User, Phone, Mail, MapPin, CreditCard, Smartphone, Copy } from "lucide-react";
import { CardContent } from "@/components/ui/card";

const businessClasses = [
    "Agriculture / Livestock",
    "Transport Industry",
    "Health / Medical",
    "Import / Export",
    "Retail / Wholesalers",
    "Professional Services / Consultancy",
    "Public Owned Utilities / Real Estate Dev",
    "Media / Advertisement / Entertainment",
    "Research & Development",
    "Information Technology",
    "Education",
    "Banking / Finance",
    "Hotels / Home Stay Accommodation",
    "Manufacturing / Packaging",
    "Equipment / Assorted",
    "Construction",
    "Tourism and Hospitality",
];

const subscriptionFees = [
    { label: "Sole Proprietor (Sub-Urban) (Kshs. 3,000)", value: "Sole Proprietor (Sub-Urban) (Kshs. 3,000)" },
    { label: "Sole Proprietor (Urban) (Kshs. 6,000)", value: "Sole Proprietor (Urban) (Kshs. 6,000)" },
    { label: "Partnership (Kshs. 8,000)", value: "Partnership (Kshs. 8,000)" },
    { label: "Business Associates/Groups (Kshs 8,000)", value: "Business Associates/Groups (Kshs 8,000)" },
    { label: "SME Private Limited Company (Kshs. 12,000)", value: "SME Private Limited Company (Kshs. 12,000)" },
    { label: "Hotels (Ksh. 15,000)", value: "Hotels (Ksh. 15,000)" },
    { label: "Travel and Education Agencies (Kshs. 25,000)", value: "Travel and Education Agencies (Kshs. 25,000)" },
    { label: "Local Private Limited Companies (Kshs. 25,000)", value: "Local Private Limited Companies (Kshs. 25,000)" },
    { label: "Large Corporates (Kshs 50,000)", value: "Large Corporates (Kshs 50,000)" },
    { label: "State Corporations (Kshs 100,000)", value: "State Corporations (Kshs 100,000)" },
    { label: "International Organization (Kshs. 100,000)", value: "International Organization (Kshs. 100,000)" },
    { label: "Patron Members (Kshs. 100,000)", value: "Patron Members (Kshs. 100,000)" },
];

function MembershipDialogForm({ onComplete }: { onComplete: () => void }) {
    const { toast } = useToast();
    const [isSubmitted, setIsSubmitted] = useState(false);

    const form = useForm<InsertMembershipApplication>({
        resolver: zodResolver(insertMembershipApplicationSchema),
        defaultValues: {
            name: "",
            businessName: "",
            contact: "",
            email: "",
            location: "",
            subCounty: "",
            businessClass: "",
            subscriptionFee: "",
        },
    });

    const mutation = useMutation({
        mutationFn: async (data: InsertMembershipApplication) => {
            await api.post("/membership-applications", data);
        },
        onSuccess: () => {
            setIsSubmitted(true);
            toast({
                title: "Application Received",
                description: "Your membership application has been submitted successfully.",
            });
        },
        onError: (error) => {
            toast({
                title: "Submission Failed",
                description: error instanceof Error ? error.message : "Failed to submit application. Please try again.",
                variant: "destructive",
            });
        },
    });

    const onSubmit = (data: InsertMembershipApplication) => {
        mutation.mutate(data);
    };

    if (isSubmitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6 py-8"
            >
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">Application Submitted!</h2>
                <p className="text-lg text-muted-foreground">
                    Thank you for your interest in joining KNCCI Uasin Gishu Chapter.
                </p>
                <div className="bg-muted/50 border border-border p-6 rounded-2xl text-left space-y-4 shadow-sm max-w-2xl mx-auto">
                    <h3 className="font-bold text-primary flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Final Step: Payment
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Please complete your application by paying the subscription fee using any of the methods below:
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="p-4 bg-background rounded-xl border border-border shadow-sm space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-green-500/10 rounded-md">
                                    <Smartphone className="w-4 h-4 text-green-600" />
                                </div>
                                <p className="text-xs font-bold text-green-600 uppercase tracking-wider">MPESA PAYBILL</p>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <p className="text-xl font-bold">7056475</p>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 hover:bg-primary/10"
                                        onClick={() => {
                                            navigator.clipboard.writeText("7056475");
                                            toast({ title: "Copied!", description: "Paybill number copied" });
                                        }}
                                    >
                                        <Copy className="w-3.5 h-3.5 text-primary" />
                                    </Button>
                                </div>
                                <p className="text-[10px] text-muted-foreground uppercase">Account: Your Name</p>
                            </div>
                        </div>

                        <div className="p-4 bg-background rounded-xl border border-border shadow-sm space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-blue-500/10 rounded-md">
                                    <Building2 className="w-4 h-4 text-blue-600" />
                                </div>
                                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">KCB BANK</p>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <p className="text-xl font-bold">1181182263</p>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 hover:bg-primary/10"
                                        onClick={() => {
                                            navigator.clipboard.writeText("1181182263");
                                            toast({ title: "Copied!", description: "Account number copied" });
                                        }}
                                    >
                                        <Copy className="w-3.5 h-3.5 text-primary" />
                                    </Button>
                                </div>
                                <p className="text-[10px] text-muted-foreground uppercase">Name: KNCCI UASIN GISHU</p>
                            </div>
                        </div>
                    </div>
                </div>
                <Button variant="outline" onClick={onComplete} className="mt-8">
                    Close Window
                </Button>
            </motion.div>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid sm:grid-cols-2 gap-8">
                    {/* Personal Info */}
                    <div className="space-y-6">
                        <div className="text-sm font-bold text-primary flex items-center gap-2 border-b border-primary/10 pb-2">
                            <User className="w-4 h-4" />
                            Applicant Information
                        </div>

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} className="h-11 focus-visible:ring-primary/30" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input placeholder="name@example.com" {...field} className="pl-10 h-11 focus-visible:ring-primary/30" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="contact"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input placeholder="0700 000 000" {...field} className="pl-10 h-11 focus-visible:ring-primary/30" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Business Info */}
                    <div className="space-y-6">
                        <div className="text-sm font-bold text-kncci-green flex items-center gap-2 border-b border-kncci-green/10 pb-2">
                            <Building2 className="w-4 h-4" />
                            Business Details
                        </div>

                        <FormField
                            control={form.control}
                            name="businessName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Business Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Company Ltd" {...field} className="h-11 focus-visible:ring-primary/30" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Business Location</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input placeholder="Town/Street" {...field} className="pl-10 h-11 focus-visible:ring-primary/30" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="subCounty"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sub County</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="h-11 focus:ring-primary/30">
                                                <SelectValue placeholder="Select Sub County" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="z-[110]">
                                            <SelectItem value="Turbo">Turbo</SelectItem>
                                            <SelectItem value="Kesses">Kesses</SelectItem>
                                            <SelectItem value="Moiben">Moiben</SelectItem>
                                            <SelectItem value="Kapseret">Kapseret</SelectItem>
                                            <SelectItem value="Ainabkoi">Ainabkoi</SelectItem>
                                            <SelectItem value="Soy">Soy</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-border pb-2">
                        <CreditCard className="w-4 h-4" />
                        Membership Classification
                    </div>

                    <div className="grid sm:grid-cols-2 gap-8">
                        <FormField
                            control={form.control}
                            name="businessClass"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Business Class / Sector</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="h-11 focus:ring-primary/30">
                                                <SelectValue placeholder="Select Sector" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="z-[110]">
                                            {businessClasses.map((cls) => (
                                                <SelectItem key={cls} value={cls}>
                                                    {cls}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="subscriptionFee"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Annual Subscription Category</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="h-11 focus:ring-primary/30">
                                                <SelectValue placeholder="Select Category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="z-[110]">
                                            {subscriptionFees.map((fee) => (
                                                <SelectItem key={fee.value} value={fee.value}>
                                                    {fee.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="pt-6 border-t border-border">
                    <Button
                        type="submit"
                        className="w-full h-12 text-lg font-bold transition-all hover:shadow-xl active:scale-[0.98]"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Submitting Application...
                            </>
                        ) : (
                            <>
                                Submit Application
                                <Send className="ml-2 h-5 w-5" />
                            </>
                        )}
                    </Button>
                    <p className="text-center text-xs text-muted-foreground mt-4">
                        By submitting, you agree to the terms of membership.
                    </p>
                </div>
            </form>
        </Form>
    );
}
