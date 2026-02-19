import { Card } from "@/components/ui/card";
import { Users, Shield, Handshake } from "lucide-react";
import { motion } from "framer-motion";

export function WhoWeAre() {
    const content = [
        {
            title: "Membership",
            icon: <Users className="w-6 h-6 text-primary" />,
            bgColor: "bg-primary/10",
            description:
                "KNCCI Uasin Gishu chapter has a diverse membership base of 6500 that includes large corporations, SMEs, and individual entrepreneurs. Membership is open to all businesses operating in Uasin Gishu, offering various categories to suit different types of businesses and industries.",
        },
        {
            title: "Governance",
            icon: <Shield className="w-6 h-6 text-secondary" />,
            bgColor: "bg-secondary/10",
            description:
                "The KNCCI is governed by a board of directors elected by its members. The board is responsible for setting the strategic direction of the organization and overseeing its operations. Day-to-day activities are managed by a professional secretariat headed by a CEO.",
        },
        {
            title: "Strategic Partnerships",
            icon: <Handshake className="w-6 h-6 text-chart-4" />,
            bgColor: "bg-chart-4/10",
            description:
                "KNCCI collaborates with various local and international organizations, government bodies, and stakeholders to advance the interests of its members and promote economic growth in Kenya. These partnerships leverage resources, knowledge, and networks for the benefit of the business community.",
        },
    ];

    return (
        <section id="who-we-are" className="py-20 sm:py-28 bg-gradient-to-br from-primary/5 to-secondary/5 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl opacity-50" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-1.5 mb-4 text-primary font-bold text-xs uppercase tracking-[0.2em] bg-primary/10 rounded-full border border-primary/20"
                    >
                        Our Organization
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mt-4 mb-6 tracking-tight"
                    >
                        Who We Are
                    </motion.h2>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ duration: 0.8, ease: "circOut" }}
                        viewport={{ once: true }}
                        className="h-1.5 w-24 bg-gradient-to-r from-primary to-primary/50 mx-auto rounded-full"
                    />
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {content.map((item, index) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="h-full"
                        >
                            <Card className="h-full p-8 border border-white/10 dark:border-white/5 bg-background/50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2 relative overflow-hidden flex flex-col">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -mr-16 -mt-16 rounded-full" />

                                <div className={`w-16 h-16 rounded-2xl ${item.bgColor} flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-inner`}>
                                    <div className="transform transition-transform duration-500 group-hover:scale-110">
                                        {item.icon}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors duration-300">
                                    {item.title}
                                </h3>

                                <p className="text-muted-foreground leading-relaxed text-[1.05rem] flex-grow">
                                    {item.description}
                                </p>

                                <div className="mt-8 pt-6 border-t border-border/50 flex items-center gap-2 text-primary font-semibold text-sm opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                                    <span>Explore Details</span>
                                    <div className="w-4 h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
