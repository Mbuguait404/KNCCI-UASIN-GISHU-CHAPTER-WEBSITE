import { Building2, Globe } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "@/components/ui/button";

export function LocationSection() {
    return (
        <section
            id="location"
            className="bg-background"
            data-testid="section-location"
        >
            {/* Map Section */}
            <section className="py-24 bg-gradient-to-br from-primary/5 to-secondary/5 relative overflow-hidden">
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
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.6571012210875!2d35.289277!3d0.5150754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x178101f7621d3ed5%3A0x60dc9d828e2da34!2sKNCCI%20Uasin%20Gishu%20Chamber!5e0!3m2!1sen!2ske!4v1771439323231!5m2!1sen!2ske"
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

        </section>
    );
}
