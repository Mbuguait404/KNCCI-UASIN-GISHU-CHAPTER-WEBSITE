import { Card } from "@/components/ui/card";
import {
    ShieldCheck,
    Globe2,
    Users2,
    GraduationCap,
    Presentation,
    BarChart3,
    ArrowRight,
    FileCheck2,
    Scale
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

const services = [
    {
        title: "Policy Advocacy & Reforms",
        description: "Championing business-friendly policies and representing members' interests to County and National governments.",
        icon: Scale,
        color: "bg-secondary/10 text-secondary",
    },
    {
        title: "Trade Facilitation",
        description: "Expert assistance with Certificates of Origin and essential trade documentation for international markets.",
        icon: FileCheck2,
        color: "bg-primary/10 text-primary",
    },
    {
        title: "Market Access & Global Trade",
        description: "Connecting local businesses to international markets and providing export readiness support.",
        icon: Globe2,
        color: "bg-secondary/10 text-secondary",
    },
    {
        title: "Business Networking",
        description: "Exclusive B2B platforms, networking dinners, and high-level forums for strategic partnerships.",
        icon: Users2,
        color: "bg-primary/10 text-primary",
    },
    {
        title: "Capacity Building",
        description: "Specialized training, workshops, and mentorship programs to enhance business leadership and skills.",
        icon: GraduationCap,
        color: "bg-secondary/10 text-secondary",
    },
    {
        title: "Trade Fairs & Exhibitions",
        description: "Organizing premier business expos and trade fairs to showcase local innovation and products.",
        icon: Presentation,
        color: "bg-primary/10 text-primary",
    },
    {
        title: "Economic Intelligence",
        description: "Providing statistically sound market information and industry insights for informed decision making.",
        icon: BarChart3,
        color: "bg-secondary/10 text-secondary",
    },
    {
        title: "Member Support Services",
        description: "Dedicated institutional support and business advisory for growth and sustainability.",
        icon: ShieldCheck,
        color: "bg-primary/10 text-primary",
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
    },
};

export function ServicesSection() {
    return (
        <section
            id="services"
            className="py-24 bg-slate-50 dark:bg-slate-900/40 relative overflow-hidden"
        >
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-primary font-bold text-sm uppercase tracking-widest block mb-4"
                    >
                        Our Core Offerings
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-bold mb-6 tracking-tight text-foreground"
                    >
                        KNCCI <span className="text-primary">Services</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-muted-foreground leading-relaxed"
                    >
                        We empower businesses in Uasin Gishu County through advocacy, trade facilitation, and strategic networking.
                        Our mission is to create a vibrant and prosperous environment where every business can thrive.
                    </motion.p>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {services.map((service, index) => (
                        <motion.div key={index} variants={itemVariants}>
                            <Card className="h-full p-6 hover:shadow-xl transition-all duration-300 border-border bg-card group hover:-translate-y-1">
                                <div className={`w-12 h-12 rounded-xl ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <service.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                                    {service.title}
                                </h3>
                                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                                    {service.description}
                                </p>
                                <div className="mt-auto pt-4 border-t border-border/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link href="/about" className="inline-flex items-center text-xs font-bold text-primary uppercase tracking-wider group-hover:gap-2 transition-all">
                                        Learn More <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="mt-16 bg-primary rounded-[2rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-primary/20"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-center md:text-left">
                            <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to Grow Your Business?</h3>
                            <p className="text-white/80 max-w-xl text-lg">
                                Join 6,500+ businesses and start benefiting from our advocacy, networking, and trade facilitation services today.
                            </p>
                        </div>
                        <Link href="/membership">
                            <a className="inline-flex items-center justify-center rounded-full bg-white text-primary font-bold px-8 py-4 hover:bg-slate-100 transition-colors shadow-lg shadow-black/10 whitespace-nowrap">
                                Join the Chamber <Users2 className="ml-2 w-5 h-5" />
                            </a>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
