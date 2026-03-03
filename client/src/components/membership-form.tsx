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
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, Send, Building2, User, Phone, Mail, MapPin, Briefcase, CreditCard } from "lucide-react";

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

export function MembershipForm() {
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
                className="w-full max-w-2xl mx-auto"
            >
                <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-kncci-green/5 text-center p-8 sm:p-12 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-kncci-green/10 rounded-full -ml-16 -mb-16 blur-3xl" />

                    <CardContent className="space-y-6 relative z-10">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-10 h-10 text-primary" />
                        </div>
                        <h2 className="text-3xl font-bold text-foreground">Application Submitted!</h2>
                        <p className="text-lg text-muted-foreground">
                            Thank you for your interest in joining KNCCI Uasin Gishu Chapter. We have received your application and will review it shortly.
                        </p>
                        <div className="bg-background/80 backdrop-blur-sm border border-border p-6 rounded-2xl text-left space-y-4 shadow-sm">
                            <h3 className="font-bold text-primary flex items-center gap-2">
                                <CreditCard className="w-5 h-5" />
                                Next Steps: Payment Details
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                To complete your application, please make the subscription payment using the details below:
                            </p>
                            <div className="space-y-3">
                                <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                                    <p className="text-xs font-semibold text-primary uppercase">MPESA PAYBILL</p>
                                    <p className="text-lg font-bold">7056475</p>
                                    <p className="text-xs text-muted-foreground">Account: Your Name/Business Name</p>
                                </div>
                                <div className="p-3 bg-kncci-green/5 rounded-lg border border-kncci-green/10">
                                    <p className="text-xs font-semibold text-kncci-green uppercase">KCB ACCOUNT</p>
                                    <p className="text-lg font-bold">1181182263</p>
                                    <p className="text-xs text-muted-foreground">Name: KNCCI UASIN GISHU COUNTY</p>
                                </div>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => setIsSubmitted(false)}
                            className="mt-4"
                        >
                            Fill another form
                        </Button>
                    </CardContent>
                </Card>
            </motion.div>
        );
    }

    return (
        <Card className="w-full max-w-3xl mx-auto border-2 border-border shadow-2xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary via-kncci-green to-primary animate-gradient-x" />
            <CardHeader className="bg-background pb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Briefcase className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl sm:text-3xl font-bold">Membership application</CardTitle>
                </div>
                <CardDescription className="text-base text-muted-foreground leading-relaxed">
                    Welcome to KNCCI Uasin Gishu Chapter! Join our esteemed organization to gain access to a vast network of business professionals, exclusive resources, and valuable opportunities.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6 sm:p-10">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid sm:grid-cols-2 gap-6">
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
                                                <Input placeholder="First and last name" {...field} className="h-11 focus-visible:ring-primary/30" />
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
                                                    <Input placeholder="Enter Personal/Business Contact" {...field} className="pl-10 h-11 focus-visible:ring-primary/30" />
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
                                                <Input placeholder="Enter Business Name" {...field} className="h-11 focus-visible:ring-primary/30" />
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
                                                <SelectContent>
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

                            <div className="grid sm:grid-cols-2 gap-6">
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
                                                <SelectContent>
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
                                                <SelectContent>
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
                                By submitting this form, you agree to become an active participant in our dynamic community.
                            </p>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
