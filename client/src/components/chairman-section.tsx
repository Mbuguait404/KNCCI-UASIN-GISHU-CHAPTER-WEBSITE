import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export function ChairmanSection() {
    return (
        <section id="chairman-message" className="py-24 bg-background relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 transform translate-x-1/4 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    {/* Image Column */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="w-full lg:w-2/5 relative"
                    >
                        <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl aspect-[4/5] bg-muted">
                            {/* Note: User should replace this with the actual image of the Chairman */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                                <div className="text-white">
                                    <p className="text-sm font-semibold uppercase tracking-widest opacity-80 mb-1">Chairman</p>
                                    <h3 className="text-2xl font-bold">Willy K. Kenei</h3>
                                </div>
                            </div>
                            <img
                                src="https://solby.sfo3.digitaloceanspaces.com/1771437540021-kenei.jpeg"
                                alt="Willy K. Kenei - Chairman"
                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                            />
                        </div>

                        {/* Decorative frames */}
                        <div className="absolute -top-6 -left-6 w-32 h-32 border-l-4 border-t-4 border-primary/20 rounded-tl-3xl -z-10" />
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 border-r-4 border-b-4 border-secondary/20 rounded-br-3xl -z-10" />
                    </motion.div>

                    {/* Content Column */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="w-full lg:w-3/5"
                    >
                        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-xl mb-8">
                            <Quote className="w-8 h-8 text-primary fill-primary/20" />
                        </div>

                        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-8 leading-tight">
                            A Word From Our <span className="text-primary italic">Chairman</span>
                        </h2>

                        <div className="space-y-6 text-lg text-muted-foreground leading-relaxed italic">
                            <p>
                                "On behalf of the Kenya National Chamber of Commerce and Industry (KNCCI) Uasin Gishu Chapter,
                                I extend our deepest gratitude for your unwavering support and patronage. Your commitment has been
                                the cornerstone of our progress, and we eagerly anticipate further collaboration to foster economic
                                growth and nation-building together. Our success is intrinsically linked to your success; therefore,
                                we invite you to join us in creating a dynamic business environment that benefits all."
                            </p>
                            <p>
                                "Your invaluable support has been crucial in helping us achieve our mandate, and for this,
                                we are profoundly grateful. As the voice of the business community in Kenya, KNCCI will continue
                                to advocate for your business needs and interests. We strongly encourage all businesses to
                                register as members of the Kenya National Chamber of Commerce and Industry. Together, we can
                                drive economic success and create a thriving business ecosystem."
                            </p>
                        </div>

                        <div className="mt-12 flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="h-px w-12 bg-primary hidden sm:block" />
                            <div>
                                <h4 className="text-xl font-bold text-foreground">WILLY K. KENEI</h4>
                                <p className="text-primary font-medium">Chairman, KNCCI Uasin Gishu Chapter</p>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
