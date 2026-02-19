import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";
import {
    ShieldCheck,
    BarChart3,
    Users2,
    GraduationCap,
    Lightbulb,
    ArrowRight,
    Target,
    LineChart,
    Handshake,
    Globe2
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { SEOHead } from "@/components/seo/seo-head";

export default function WorkPage() {
    const pillars = [
        {
            title: "Policy Advocacy & Business Reforms",
            icon: <ShieldCheck className="w-8 h-8" />,
            description: "We work closely with county and national governments to champion for business-friendly policies and a conducive environment for private sector growth.",
            features: [
                "Government Liaison",
                "Public-Private Dialogue",
                "Legislative Lobbying",
                "Regulatory Reform Advocacy"
            ],
            color: "blue"
        },
        {
            title: "Trade Promotion & Market Access",
            icon: <Globe2 className="w-8 h-8" />,
            description: "Opening doors for local businesses to reach national, regional (EAC, COMESA), and international markets through trade missions and exhibitions.",
            features: [
                "Trade Missions",
                "Export Documentation Support",
                "Market Intelligence Reports",
                "Business Matchmaking"
            ],
            color: "emerald"
        },
        {
            title: "Capacity Building & Training",
            icon: <GraduationCap className="w-8 h-8" />,
            description: "Equipping our members with the skills and knowledge needed to scale their operations and remain competitive in a changing global economy.",
            features: [
                "Skills Development Workshops",
                "Digital Transformation Training",
                "Financial Literacy Programs",
                "Entrepreneurship Mentorship"
            ],
            color: "amber"
        },
        {
            title: "Economic Development Initiatives",
            icon: <LineChart className="w-8 h-8" />,
            description: "Driving large-scale economic transformation through strategic projects that attract investment and create jobs within Uasin Gishu County.",
            features: [
                "Investment Promotion",
                "SME Support Centers",
                "Industrial Park Facilitation",
                "Local Content Advocacy"
            ],
            color: "purple"
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            <SEOHead
                title="Our Work | KNCCI Uasin Gishu"
                description="Discover the core pillars of KNCCI Uasin Gishu's work, including policy advocacy, trade promotion, capacity building, and economic development."
            />
            <Navigation />

            <main className="pt-20">
                {/* Hero Section */}
                <section className="relative py-24 lg:py-36 overflow-hidden bg-slate-900">
                    <div className="absolute inset-0">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=2071')] bg-cover bg-center opacity-20" />
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 to-slate-900" />
                    </div>

                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-3xl mx-auto"
                        >
                            <span className="inline-block px-4 py-1.5 mb-6 text-primary font-bold text-xs uppercase tracking-[0.2em] bg-primary/10 rounded-full border border-primary/20">
                                Impacting Business
                            </span>
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-8 tracking-tight">
                                Our <span className="text-primary italic">Pillars</span> of Impact
                            </h1>
                            <p className="text-xl text-slate-300 leading-relaxed mb-10">
                                At KNCCI Uasin Gishu, we are dedicated to creating a vibrant and prosperous business environment through five core strategic initiatives.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Button size="lg" className="rounded-full" asChild>
                                    <Link href="/about">Learn our Story <ArrowRight className="ml-2 w-4 h-4" /></Link>
                                </Button>
                                <Button size="lg" variant="outline" className="rounded-full text-white border-white/20 hover:bg-white/10">
                                    View Strategic Plan
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Impact Pillars Grid */}
                <section className="py-24 bg-background">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                            {pillars.map((pillar, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <Card className="h-full group hover:shadow-2xl transition-all duration-500 border-border/50 overflow-hidden bg-white dark:bg-slate-900/50">
                                        <div className="p-8 lg:p-10">
                                            <div className={`w-16 h-16 rounded-2xl mb-8 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3 duration-500
                        ${pillar.color === 'blue' ? 'bg-blue-500/10 text-blue-500' :
                                                    pillar.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-500' :
                                                        pillar.color === 'amber' ? 'bg-amber-500/10 text-amber-500' : 'bg-purple-500/10 text-purple-500'}
                      `}>
                                                {pillar.icon}
                                            </div>
                                            <h3 className="text-2xl lg:text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                                                {pillar.title}
                                            </h3>
                                            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                                                {pillar.description}
                                            </p>

                                            <div className="space-y-4">
                                                <h4 className="font-bold text-sm uppercase tracking-widest text-foreground/70">Key Focus Areas:</h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {pillar.features.map((feature, fIdx) => (
                                                        <div key={fIdx} className="flex items-center gap-2 group/item">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                            <span className="text-sm font-medium text-muted-foreground group-hover/item:text-foreground transition-colors">{feature}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Global Impact / Networking Section */}
                <section className="py-24 bg-slate-50 dark:bg-slate-900/40 border-y border-border">
                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                                    <Handshake className="w-3.5 h-3.5" />
                                    Strategic Alliances
                                </div>
                                <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
                                    Driving <span className="text-primary italic">Networking & Partnerships</span>
                                </h2>
                                <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                                    We believe that progress happens through collaboration. KNCCI Uasin Gishu serves as the primary bridge between the private sector, government agencies, and international development partners.
                                </p>

                                <div className="space-y-6">
                                    {[
                                        "Connecting local SMEs with multinational corporations",
                                        "Facilitating partnerships with financial institutions for credit access",
                                        "Working with regional bodies to harmonize trade regulations",
                                        "Hosting high-level networking forums and business summits"
                                    ].map((text, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                                <ShieldCheck className="w-4 h-4" />
                                            </div>
                                            <p className="text-lg text-muted-foreground">{text}</p>
                                        </div>
                                    ))}
                                </div>

                                <Button size="lg" className="mt-12 rounded-full px-10" asChild>
                                    <Link href="/contact">Partner with Us</Link>
                                </Button>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="relative"
                            >
                                <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-background">
                                    <img
                                        src="https://images.unsplash.com/photo-1517245327032-96a18e20e599?auto=format&fit=crop&q=80&w=2070"
                                        alt="Business Networking"
                                        className="w-full h-auto"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent mix-blend-multiply" />
                                </div>
                                {/* Decorative Stats */}
                                <div className="absolute -bottom-10 -right-6 md:right-10 bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl border border-border z-20">
                                    <div className="text-center">
                                        <div className="text-4xl font-extrabold text-primary mb-1">100+</div>
                                        <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Strategic Partners</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="py-24 relative overflow-hidden bg-primary">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                    <div className="container mx-auto px-4 relative z-10 text-center text-white">
                        <h2 className="text-3xl md:text-5xl font-extrabold mb-8 tracking-tight">Support Our Initiatives</h2>
                        <p className="max-w-2xl mx-auto text-xl text-white/90 mb-12 leading-relaxed">
                            Whether you're a business looking for advocacy or a partner looking to drive impact, there's a place for you in our mission.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Button size="lg" variant="secondary" className="rounded-full px-12 h-16 text-lg font-bold" asChild>
                                <Link href="/membership">Join the Chamber</Link>
                            </Button>
                            <Button size="lg" variant="outline" className="rounded-full px-12 h-16 text-lg font-bold border-2 border-white bg-transparent text-white hover:bg-white hover:text-primary transition-all duration-300" asChild>
                                <Link href="/partnership">Explore Partnerships</Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
