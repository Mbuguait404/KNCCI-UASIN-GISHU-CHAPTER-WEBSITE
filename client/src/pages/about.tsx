import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";
import { WhoWeAre } from "@/components/who-we-are";
import { ChairmanSection } from "@/components/chairman-section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    CheckCircle2,
    Target,
    Eye,
    Award,
    ArrowRight,
    Users2,
    Building,
    Globe2,
    FileCheck,
    Briefcase,
    History,
    TrendingUp,
    ShieldCheck
} from "lucide-react";
import { Link } from "wouter";
import { SEOHead } from "@/components/seo/seo-head";

export default function AboutPage() {
    const strategicGoals = [
        "Strengthen the membership base and enhance communication",
        "Strengthen trade policy and advocacy",
        "Enhance trade promotion and facilitation services",
        "Nurture entrepreneurship culture",
        "Strengthen networking and partnerships",
        "Strengthen the institutional capacity of the Chamber",
        "Strengthen National and County programs and events"
    ];

    const functions = [
        "Promote, coordinate, and protect the commercial and industrial interests of its members and Kenya in general.",
        "Promote trade within and outside Kenya.",
        "Establish and organize finance trade and industrial exhibitions and displays either on its own or in participation with other persons or organizations.",
        "Foster social unity and promote the welfare of the commercial and industrial community.",
        "Promote, support, or oppose legislation and ineffective bureaucratic measures that may be put in place by the government for the interest of the members.",
        "Collect and disseminate statistically sound information and other materials to its members.",
        "Establish commercial exchanges, new rooms, libraries, and other facilities that may be beneficial to its members.",
        "Provide facilities for the study, inquiry, and research into commercial and industrial matters and publish materials and journals among others for the benefit of its members."
    ];

    return (
        <div className="min-h-screen bg-background">
            <SEOHead
                title="About Us | KNCCI Uasin Gishu"
                description="Learn about the mission, vision, and functions of the Kenya National Chamber of Commerce and Industry (KNCCI) Uasin Gishu Chapter."
            />
            <Navigation />

            <main className="pt-20">
                {/* Header section */}
                <section className="py-20 bg-slate-50 dark:bg-slate-900/40 border-b border-border">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto text-center">
                            <motion.span
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-primary font-bold text-sm uppercase tracking-widest block mb-4"
                            >
                                Get to know about us
                            </motion.span>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight"
                            >
                                About <span className="text-primary">Us</span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto"
                            >
                                The Voice of Business and the Champion for Economic Transformation in Uasin Gishu County.
                            </motion.p>
                        </div>
                    </div>
                </section>

                {/* Mission & Vision Section */}
                <section className="py-24 bg-background">
                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <span className="text-primary font-bold text-sm uppercase tracking-widest mb-4 block">Our Foundation</span>
                                <h2 className="text-3xl md:text-4xl font-bold mb-8">Our Mission Statement</h2>

                                <div className="space-y-8">
                                    <div className="flex gap-6 p-6 rounded-2xl bg-primary/5 border border-primary/10">
                                        <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center flex-shrink-0 text-white shadow-lg shadow-primary/20">
                                            <Eye className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2 text-primary uppercase tracking-wide">Vision</h3>
                                            <p className="text-muted-foreground text-lg italic leading-relaxed">
                                                "A vibrant and prosperous business community."
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-6 p-6 rounded-2xl bg-secondary/5 border border-secondary/10">
                                        <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0 text-white shadow-lg shadow-secondary/20">
                                            <Target className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2 text-secondary uppercase tracking-wide">Mission</h3>
                                            <p className="text-muted-foreground text-lg italic leading-relaxed">
                                                "To facilitate and promote a sustainable business environment for growth and expansion."
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="relative"
                            >
                                <div className="relative rounded-3xl overflow-hidden shadow-2xl z-10 border-8 border-background">
                                    <img
                                        src="https://solby.sfo3.digitaloceanspaces.com/1769687104735-WhatsApp%20Image%202026-01-27%20at%2009.10.55%20(1).jpeg"
                                        alt="KNCCI Office Environment"
                                        className="w-full h-auto object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                    <div className="absolute bottom-6 left-6 right-6 text-white">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Award className="w-8 h-8 text-primary" />
                                            <span className="font-bold uppercase tracking-wider text-sm">Best Chapter 2019</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
                                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl" />
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Home page "Who We Are" content relocated here */}
                <WhoWeAre />

                {/* Detailed Membership Info Section */}
                <section className="py-24 bg-gradient-to-br from-secondary/5 to-primary/5 relative overflow-hidden">
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-chart-4/10 text-chart-4 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                                    <Users2 className="w-3.5 h-3.5" />
                                    Membership Excellence
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold mb-6 italic">Growing Together</h2>
                                <div className="prose prose-lg dark:prose-invert">
                                    <p className="text-xl text-muted-foreground leading-relaxed mb-6">
                                        KNCCI Uasin Gishu chapter has a diverse membership base of <span className="text-foreground font-bold font-serif italic underline decoration-primary/50 text-3xl mx-1">6,500</span> that includes large corporations, SMEs, and individual entrepreneurs.
                                    </p>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Membership is open to all businesses operating in Uasin Gishu, and it offers various categories of membership to suit different types of businesses and industries. Whether you are a solo entrepreneur starting out or a large-scale manufacturing plant, there is a place for you in our vibrant community.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-6 mt-10">
                                    <div className="p-4 rounded-xl bg-background shadow-sm border border-border">
                                        <div className="text-3xl font-bold text-primary mb-1 italic">47</div>
                                        <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">National Chapters</div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-background shadow-sm border border-border">
                                        <div className="text-3xl font-bold text-secondary mb-1 italic">CIPE</div>
                                        <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Supported Center</div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className="grid grid-cols-2 gap-4"
                            >
                                <div className="space-y-4 pt-12">
                                    <div className="rounded-2xl overflow-hidden shadow-lg transform translate-y-4">
                                        <img src="https://solby.sfo3.digitaloceanspaces.com/1769687104798-WhatsApp%20Image%202026-01-27%20at%2009.11.09%20(2).jpeg" alt="Business Collaboration" className="w-full h-auto" />
                                    </div>
                                    <div className="rounded-2xl overflow-hidden shadow-lg border-4 border-primary/20">
                                        <img src="https://solby.sfo3.digitaloceanspaces.com/1769497085040-WhatsApp%20Image%202026-01-27%20at%2009.10.56.jpeg" alt="Business Meeting" className="w-full h-auto" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="rounded-2xl overflow-hidden shadow-lg bg-primary/10 aspect-square flex items-center justify-center p-8">
                                        <div className="text-center">
                                            <TrendingUp className="w-16 h-16 text-primary mx-auto mb-4" />
                                            <span className="block text-2xl font-bold italic">Unprecedented Growth</span>
                                        </div>
                                    </div>
                                    <div className="rounded-2xl overflow-hidden shadow-lg transform -translate-y-8">
                                        <img src="https://solby.sfo3.digitaloceanspaces.com/1769687104848-WhatsApp%20Image%202026-01-27%20at%2009.11.09%20(4).jpeg" alt="Team Workshop" className="w-full h-auto" />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                <ChairmanSection />

                {/* Strategic Goals Section */}
                <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="max-w-3xl mx-auto text-center mb-20">
                            <span className="text-primary font-bold text-sm uppercase tracking-widest block mb-4">The Road Ahead</span>
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">Our Strategic Goals</h2>
                            <div className="h-1.5 w-24 bg-primary mx-auto rounded-full" />
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {strategicGoals.map((goal, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex gap-5 p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 transition-all duration-300 group"
                                >
                                    <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                                        <CheckCircle2 className="w-6 h-6 text-primary group-hover:text-white" />
                                    </div>
                                    <p className="text-lg font-medium text-slate-200 group-hover:text-white transition-colors leading-relaxed">
                                        {goal}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Certificate of Origin Section */}
                <section className="py-24 bg-background border-b border-border">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto rounded-[3rem] overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 shadow-2xl border border-border flex flex-col lg:flex-row">
                            <div className="p-12 lg:w-3/5">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                                    <FileCheck className="w-3.5 h-3.5" />
                                    Export Facilitation
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold mb-6">The Certificate of Origin</h2>
                                <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                                    KNCCI-Uasin Gishu supports exporters to obtain the <span className="text-foreground font-semibold underline decoration-primary/30">Ordinary Certificate of Origin (COO)</span>.
                                </p>
                                <div className="space-y-4 mb-10">
                                    <div className="flex gap-3 items-start">
                                        <div className="mt-1.5 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                                        <p className="text-muted-foreground">Certifies that goods are wholly obtained, produced, manufactured, or processed in Kenya.</p>
                                    </div>
                                    <div className="flex gap-3 items-start">
                                        <div className="mt-1.5 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                                        <p className="text-muted-foreground">Issuance by Chambers of Commerce is an accepted practice worldwide.</p>
                                    </div>
                                    <div className="flex gap-3 items-start">
                                        <div className="mt-1.5 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                                        <p className="text-muted-foreground">Essential document for cross-border trade and tariff benefits.</p>
                                    </div>
                                </div>
                                <Button size="lg" className="rounded-full px-8 shadow-xl shadow-primary/20 hover:scale-105 transition-transform" asChild>
                                    <a href="https://cmis.kenyachamber.or.ke/" target="_blank" rel="noopener noreferrer">Apply for COO Today <ArrowRight className="ml-2 w-4 h-4" /></a>
                                </Button>
                            </div>
                            <div className="lg:w-2/5 relative min-h-[400px]">
                                <img
                                    src="https://solby.sfo3.digitaloceanspaces.com/1769497085219-WhatsApp%20Image%202026-01-27%20at%2009.11.03.jpeg"
                                    alt="International Trade Document"
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-24 h-24 rounded-full bg-white/90 shadow-2xl flex items-center justify-center animate-pulse">
                                        <Globe2 className="w-12 h-12 text-primary" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Functions of KNCCI List */}
                <section className="py-24 bg-background">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto text-center mb-16">
                            <span className="text-primary font-bold text-sm uppercase tracking-widest block mb-4">What We Do</span>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Functions of KNCCI</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                As the leading business organization, we perform several critical functions to ensure the prosperity and protection of our members' interests.
                            </p>
                        </div>

                        <div className="max-w-6xl mx-auto">
                            <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                                {functions.map((func, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: idx % 2 === 0 ? -10 : 10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        className="flex gap-4 p-5 rounded-2xl bg-background border border-border shadow-sm hover:shadow-md transition-shadow group"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                            <span className="text-sm font-bold">{idx + 1}</span>
                                        </div>
                                        <p className="text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">
                                            {func}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 relative overflow-hidden">
                    <div className="absolute inset-0 bg-slate-900 pointer-events-none">
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                    </div>
                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="max-w-4xl mx-auto text-white"
                        >
                            <div className="w-20 h-20 bg-white/20 rounded-3xl backdrop-blur-md flex items-center justify-center mx-auto mb-10 shadow-lg">
                                <ShieldCheck className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-3xl md:text-5xl font-extrabold mb-8 tracking-tight">Become a part of the vibrant business community today</h2>
                            <p className="text-xl md:text-2xl text-white/90 mb-12 italic opacity-80 leading-relaxed font-light">
                                Join 6,500+ businesses and start benefiting from advocacy, networking, and expert trade facilitation services.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                <Button size="lg" variant="default" className="rounded-full px-12 h-16 text-lg font-bold shadow-2xl hover:scale-105 transition-transform" asChild>
                                    <Link href="/membership">Be a Member Now <Users2 className="ml-2 w-5 h-5" /></Link>
                                </Button>
                                <Button size="lg" variant="destructive" className="rounded-full px-12 h-16 text-lg font-bold border-2 border-white bg-transparent text-white hover:bg-white hover:text-primary transition-all duration-300" asChild>
                                    <Link href="/contact">Learn More <Briefcase className="ml-2 w-5 h-5" /></Link>
                                </Button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Decorative shapes */}
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                </section>
            </main>

            <Footer />
        </div>
    );
}
