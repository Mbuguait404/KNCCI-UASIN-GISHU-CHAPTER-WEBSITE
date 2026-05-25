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
                                drive economic success, unlock new business opportunities, expand networks, and create a
                                thriving business ecosystem for all stakeholders."
                            </p>
                            <p>
                                "Eldoret continues to present immense opportunities in agro-processing, manufacturing, logistics, exports, ICT, sports economy, and real estate development. This growth is further strengthened by national development frameworks such as the <strong>County Aggregation and Industrial Parks (CAIPs)</strong> programme, a flagship government initiative under the Bottom-Up Economic Transformation Agenda (BETA). The programme is designed to establish structured county-based hubs that bring together aggregation, storage, processing, and value addition facilities for agricultural and industrial products. It aims to reduce post-harvest losses, support MSMEs, increase farmer incomes, and accelerate agro-industrialisation at the county level."
                            </p>
                            <p>
                                "In addition, the establishment and expansion of industrial parks across the region are accelerating value addition, job creation, and SME growth, while providing a structured environment for manufacturing and light industry to thrive. Further, the presence and active role of the Export Processing Zones Authority (EPZA) continues to enhance export-oriented investment opportunities, attracting both local and international investors into value-added production and global trade integration."
                            </p>
                            <p>
                                "Ongoing developments such as the expansion of Eldoret International Airport, and supporting logistics infrastructure are further opening doors for investors, SMEs, farmers, exporters, transporters, and young entrepreneurs. Collectively, these initiatives are reinforcing Eldoret's position as a key commercial, industrial, and investment hub within Kenya and the broader East African region."
                            </p>
                            <p>
                                "In line with this vision, KNCCI Uasin Gishu Chapter will host the Eldoret International
                                Business Summit 2026 from 23rd-25th July 2026, bringing together business leaders, investors,
                                innovators, policymakers, entrepreneurs, and development partners from across Kenya and beyond.
                                The summit will provide a platform for networking, investment engagement, exhibitions, trade
                                partnerships, and showcasing the economic potential of Eldoret and the wider North Rift region."
                            </p>
                            <p>
                                "During the same period, the Chapter will also host the Innovation Challenge 2026, an initiative
                                aimed at identifying, nurturing, and supporting innovative ideas and emerging enterprises with
                                the potential to create jobs, solve local challenges, and drive sustainable economic growth.
                                We warmly invite businesses, institutions, organizations, innovators, and individuals to
                                participate, partner, exhibit, and support these transformative initiatives as we work together
                                to build a stronger and more competitive business community."
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
