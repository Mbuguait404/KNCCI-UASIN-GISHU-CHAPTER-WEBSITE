import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";
import { SEOHead } from "@/components/seo/seo-head";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactSubmissionSchema, type InsertContactSubmission } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
    Mail,
    Phone,
    MapPin,
    Clock,
    Send,
    Loader2,
    Facebook,
    Twitter,
    Linkedin,
    Instagram,
    MessageSquare,
    Building2,
    Globe
} from "lucide-react";

export default function ContactPage() {
    const { toast } = useToast();

    const form = useForm<InsertContactSubmission>({
        resolver: zodResolver(insertContactSubmissionSchema),
        defaultValues: {
            name: "",
            email: "",
            subject: "",
            message: "",
        },
    });

    const contactMutation = useMutation({
        mutationFn: async (data: InsertContactSubmission) => {
            return apiRequest("POST", "/api/contact", data);
        },
        onSuccess: () => {
            toast({
                title: "Message Sent!",
                description: "We've received your message and will get back to you soon.",
            });
            form.reset();
        },
        onError: (error: Error) => {
            toast({
                title: "Submission failed",
                description: error.message || "Please try again later.",
                variant: "destructive",
            });
        },
    });

    const onSubmit = (data: InsertContactSubmission) => {
        contactMutation.mutate(data);
    };

    const contactInfo = [
        {
            icon: MapPin,
            title: "Our Office",
            content: "Daima Towers, M2 Room 9, Eldoret, Kenya",
            color: "bg-blue-500/10 text-blue-500",
        },
        {
            icon: Phone,
            title: "Phone Number",
            content: "+254 740 853 372",
            link: "tel:+254740853372",
            color: "bg-green-500/10 text-green-500",
        },
        {
            icon: Mail,
            title: "Email Address",
            content: "events@uasingishuchamber.co.ke",
            link: "mailto:events@uasingishuchamber.co.ke",
            color: "bg-purple-500/10 text-purple-500",
        },
        {
            icon: Clock,
            title: "Working Hours",
            content: "Mon - Fri: 8:00 AM - 5:00 PM",
            color: "bg-orange-500/10 text-orange-500",
        },
    ];

    const socials = [
        { icon: Facebook, href: "https://www.facebook.com/p/Uasin-Gishu-Chamber-100070349883626/", label: "Facebook" },
        { icon: Twitter, href: "https://x.com/kenya_chamber", label: "Twitter" },
        { icon: Linkedin, href: "#", label: "LinkedIn" },
        { icon: Instagram, href: "https://www.instagram.com/p/DTPWs3DiDtP/", label: "Instagram" },
    ];

    return (
        <div className="min-h-screen bg-background">
            <SEOHead
                title="Contact Us | KNCCI Uasin Gishu"
                description="Get in touch with the Kenya National Chamber of Commerce & Industry, Uasin Gishu Chapter. We're here to help with your business inquiries."
            />
            <Navigation />

            <main className="pt-20">
                {/* Hero Section */}
                <section className="relative py-24 lg:py-32 overflow-hidden bg-slate-950">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2070"
                            alt="Contact Hero"
                            className="w-full h-full object-cover opacity-40"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-slate-950" />
                    </div>

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="max-w-3xl">
                            <motion.span
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-block px-4 py-1.5 mb-6 text-primary font-bold text-xs uppercase tracking-[0.2em] bg-primary/10 rounded-full border border-primary/20"
                            >
                                Contact Us
                            </motion.span>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-8 tracking-tight"
                            >
                                Let's <span className="text-primary italic">Connect</span> & Build Together
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl"
                            >
                                Have questions about membership, events, or partnerships? Our team is ready to support your business journey in Uasin Gishu County.
                            </motion.p>
                        </div>
                    </div>
                </section>

                {/* Contact Info Grid */}
                <section className="py-24 bg-background relative">
                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-3 gap-12">

                            {/* Left Side: Contact Info & Socials */}
                            <div className="lg:col-span-1 space-y-8">
                                <div>
                                    <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
                                    <p className="text-muted-foreground mb-8">
                                        Choose your preferred way to reach us. We aim to respond to all inquiries within 24 hours.
                                    </p>
                                </div>

                                <div className="grid gap-6">
                                    {contactInfo.map((info, idx) => (
                                        <motion.div
                                            key={info.title}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="flex items-start gap-5 p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 group"
                                        >
                                            <div className={`w-12 h-12 rounded-xl ${info.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                                                <info.icon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg mb-1">{info.title}</h3>
                                                {info.link ? (
                                                    <a href={info.link} className="text-muted-foreground hover:text-primary transition-colors">
                                                        {info.content}
                                                    </a>
                                                ) : (
                                                    <p className="text-muted-foreground">{info.content}</p>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="pt-4">
                                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                                        <MessageSquare className="w-5 h-5 text-primary" />
                                        Follow Our Socials
                                    </h3>
                                    <div className="flex gap-4">
                                        {socials.map((social) => (
                                            <a
                                                key={social.label}
                                                href={social.href}
                                                className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 text-primary border border-primary/10 shadow-sm"
                                                aria-label={social.label}
                                            >
                                                <social.icon className="w-5 h-5" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Contact Form */}
                            <div className="lg:col-span-2">
                                <Card className="p-8 md:p-12 rounded-[2rem] border-border/50 shadow-2xl shadow-primary/5 overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
                                    <div className="relative z-10">
                                        <div className="mb-10">
                                            <h3 className="text-2xl font-bold mb-2">Send us a Message</h3>
                                            <p className="text-muted-foreground">Fill out the form below and we'll get back to you shortly.</p>
                                        </div>

                                        <Form {...form}>
                                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <FormField
                                                        control={form.control}
                                                        name="name"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Full Name</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="John Doe" className="h-12 bg-muted/30 border-border/50 focus:border-primary/50 rounded-xl" {...field} />
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
                                                                    <Input placeholder="john@example.com" className="h-12 bg-muted/30 border-border/50 focus:border-primary/50 rounded-xl" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>

                                                <FormField
                                                    control={form.control}
                                                    name="subject"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Subject</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="How can we help?" className="h-12 bg-muted/30 border-border/50 focus:border-primary/50 rounded-xl" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="message"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Your Message</FormLabel>
                                                            <FormControl>
                                                                <Textarea
                                                                    placeholder="Write your message here..."
                                                                    className="min-h-[160px] bg-muted/30 border-border/50 focus:border-primary/50 rounded-xl resize-none"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <Button
                                                    type="submit"
                                                    size="lg"
                                                    className="w-full h-14 rounded-xl text-lg font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all duration-300"
                                                    disabled={contactMutation.isPending}
                                                >
                                                    {contactMutation.isPending ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                            Sending Message...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Send className="mr-2 h-5 w-5" />
                                                            Send Message
                                                        </>
                                                    )}
                                                </Button>
                                            </form>
                                        </Form>
                                    </div>
                                </Card>
                            </div>

                        </div>
                    </div>
                </section>

                {/* Map Section */}
                <section className="py-24 bg-muted/30 relative overflow-hidden">
                    <div className="container mx-auto px-4">
                        <div className="mb-12 text-center">
                            <span className="text-primary font-bold text-sm uppercase tracking-widest block mb-4">Location</span>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Visit Our Office</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                We are located at the heart of Eldoret City. Feel free to stop by for a professional consultation.
                            </p>
                        </div>

                        <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-background bg-background h-[500px] relative group">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.508546194!2d35.2697!3d0.5143!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1781017e8c33a92d%3A0xe3e6392095861183!2sDaima%20Towers%2C%20Eldoret!5e0!3m2!1sen!2ske!4v1700000000000!5m2!1sen!2ske"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="filter grayscale group-hover:grayscale-0 transition-all duration-500"
                            />
                            <div className="absolute bottom-8 left-8 right-8 md:right-auto md:w-80">
                                <Card className="p-6 backdrop-blur-xl bg-background/80 border-border/50 shadow-2xl">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                                            <Building2 className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold">KNCCI Uasin Gishu</h4>
                                            <p className="text-xs text-muted-foreground">Eldoret Chapter Office</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                        Daima Towers, M2 Room 9<br />
                                        Eldoret, Kenya
                                    </p>
                                    <Button variant="outline" className="px-0 h-auto mt-4 text-primary font-bold flex items-center gap-1 group/btn" asChild>
                                        <a href="https://maps.google.com/?q=Daima+Towers+Eldoret" target="_blank" rel="noopener noreferrer">
                                            Get Directions <Globe className="w-3.5 h-3.5 group-hover/btn:rotate-12 transition-transform" />
                                        </a>
                                    </Button>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>

            </main>
            <Footer />
        </div>
    );
}
