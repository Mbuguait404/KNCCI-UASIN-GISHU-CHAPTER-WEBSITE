import { useEffect } from "react";
import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { SEOHead } from "@/components/seo/seo-head";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { upcomingEvents } from "@/data/events-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Calendar,
    MapPin,
    ArrowLeft,
    Share2,
    Clock,
    CheckCircle2,
    ArrowRight
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function EventDetail() {
    const [, params] = useRoute("/events/:id");
    const eventId = params?.id;
    const event = upcomingEvents.find((e) => e.id === eventId);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [eventId]);

    if (!event) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Navigation />
                <main className="flex-grow flex items-center justify-center p-4">
                    <div className="text-center max-w-md">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                            <Calendar className="w-10 h-10" />
                        </div>
                        <h1 className="text-3xl font-bold mb-4">Event not found</h1>
                        <p className="text-muted-foreground mb-8 text-lg">The event you're looking for doesn't exist or has been moved.</p>
                        <Link href="/events">
                            <Button size="lg" className="rounded-xl px-10">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
                            </Button>
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <SEOHead
                title={`${event.title} | KNCCI Events`}
                description={event.description}
            />

            <Navigation />

            <main className="pt-24 pb-16">
                {/* Hero Header */}
                <header className="py-12 md:py-20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="container mx-auto px-4 max-w-6xl relative">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Link href="/events">
                                <Button variant="ghost" className="mb-8 pl-0 hover:bg-transparent text-primary hover:text-primary transition-all font-bold gap-2">
                                    <ArrowLeft className="h-4 w-4" /> Back to Events
                                </Button>
                            </Link>

                            <div className="flex flex-wrap items-center gap-4 mb-6">
                                <Badge className="px-4 py-1.5 text-xs uppercase tracking-widest bg-primary text-primary-foreground border-none font-bold">
                                    {event.category}
                                </Badge>
                                {event.featured && (
                                    <Badge variant="outline" className="px-4 py-1.5 text-xs uppercase tracking-widest border-primary text-primary font-bold">
                                        Featured Event
                                    </Badge>
                                )}
                            </div>

                            <h1 className="text-4xl md:text-6xl font-extrabold mb-8 leading-tight tracking-tight">
                                {event.title}
                            </h1>

                            <div className="grid md:grid-cols-3 gap-6 mb-10">
                                <div className="flex items-center gap-4 p-5 bg-card border border-border/50 rounded-2xl shadow-sm">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                        <Calendar className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Date & Time</p>
                                        <p className="font-bold text-lg">{event.date}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-5 bg-card border border-border/50 rounded-2xl shadow-sm">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                        <MapPin className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Location</p>
                                        <p className="font-bold text-lg">{event.location}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-5 bg-card border border-border/50 rounded-2xl shadow-sm">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                        <Share2 className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Share Event</p>
                                        <div className="flex gap-3">
                                            <button className="text-muted-foreground hover:text-primary transition-colors font-bold text-sm">Twitter</button>
                                            <button className="text-muted-foreground hover:text-primary transition-colors font-bold text-sm">LinkedIn</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <Button size="lg" className="h-16 px-10 rounded-xl font-bold text-lg shadow-xl shadow-primary/20" asChild>
                                    <Link href={event.registrationLink || "/contact"}>Register for this Event</Link>
                                </Button>
                                <Button variant="outline" size="lg" className="h-16 px-10 rounded-xl font-bold text-lg border-2">
                                    Add to Calendar
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </header>

                {/* Main Content Area */}
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Media and Content */}
                        <div className="lg:col-span-8">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.7 }}
                                className="rounded-[2.5rem] overflow-hidden shadow-2xl border-b-8 border-primary mb-12 bg-muted aspect-video relative"
                            >
                                <img
                                    src={event.image}
                                    alt={event.title}
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>

                            <div className="prose prose-lg dark:prose-invert max-w-none">
                                <h2 className="text-3xl font-bold mb-6">About the <span className="text-primary italic">Event</span></h2>
                                <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                                    {event.longDescription || event.description}
                                </p>

                                {event.content && (
                                    <div
                                        className="bg-card/50 border border-border/50 p-8 rounded-3xl mb-12"
                                        dangerouslySetInnerHTML={{ __html: event.content }}
                                    />
                                )}

                                {event.agenda && (
                                    <section className="mt-12">
                                        <div className="flex items-center gap-3 mb-8">
                                            <Clock className="w-8 h-8 text-primary" />
                                            <h2 className="text-3xl font-bold mb-0">Event <span className="italic">Agenda</span></h2>
                                        </div>
                                        <div className="space-y-4">
                                            {event.agenda.map((item, idx) => (
                                                <div key={idx} className="flex gap-6 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-border/40 group hover:border-primary/30 transition-colors">
                                                    <div className="font-bold text-primary min-w-[100px]">{item.time}</div>
                                                    <div className="font-semibold text-lg">{item.activity}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <aside className="lg:col-span-4 space-y-8">
                            <div className="p-8 rounded-[2rem] bg-slate-900 text-white shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
                                <h3 className="text-2xl font-bold mb-6 italic">Why Attend?</h3>
                                <ul className="space-y-4">
                                    {[
                                        "Network with industry leaders",
                                        "Gain insights from experts",
                                        "Discover new opportunities",
                                        "Access exclusive resources",
                                        "Professional development"
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                            <span className="text-slate-300 font-medium">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Separator className="my-8 bg-white/10" />
                                <div className="space-y-4">
                                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Organized by</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-lg p-1">
                                            <img src="/logo-mini.png" alt="KNCCI" className="w-full h-full object-contain" />
                                        </div>
                                        <p className="font-bold">KNCCI Uasin Gishu Chapter</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 rounded-[2rem] bg-card border border-border shadow-sm">
                                <h3 className="text-xl font-bold mb-6">Location Information</h3>
                                <div className="aspect-square rounded-2xl bg-muted overflow-hidden mb-6 border border-border/50">
                                    {/* Placeholder for map */}
                                    <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 bg-slate-50 dark:bg-slate-900">
                                        <MapPin className="w-12 h-12 text-primary/40 mb-4" />
                                        <p className="text-sm font-bold text-muted-foreground">{event.location}</p>
                                        <Button variant="outline" className="text-primary font-bold">Open in Google Maps</Button>
                                    </div>w
                                </div>
                                <div className="space-y-4">
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        Need help finding the venue or looking for nearby accommodation? Contact our events team.
                                    </p>
                                    <Button variant="outline" className="w-full rounded-xl font-bold h-12" asChild>
                                        <Link href="/contact">Contact Support</Link>
                                    </Button>
                                </div>
                            </div>

                            <div className="p-8 rounded-[2rem] bg-primary/5 border border-primary/10">
                                <h3 className="text-xl font-bold mb-4">Subscribe Updates</h3>
                                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                                    Get notified about upcoming business events and trade summits in Uasin Gishu.
                                </p>
                                <div className="space-y-3">
                                    <Button className="w-full rounded-xl font-bold h-12 bg-primary text-white">Subscribe Now</Button>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>

                {/* Related Events */}
                <section className="mt-24 pt-24 border-t border-border">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-3xl font-bold italic">Other Upcoming Events</h2>
                            <Link href="/events">
                                <Button variant="ghost" className="text-primary font-bold gap-2">
                                    View All <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {upcomingEvents.filter(e => e.id !== event.id).slice(0, 3).map((relatedEvent, idx) => (
                                <motion.div
                                    key={relatedEvent.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <Link href={`/events/${relatedEvent.id}`}>
                                        <div className="group cursor-pointer">
                                            <div className="relative h-64 rounded-3xl overflow-hidden mb-6 shadow-lg">
                                                <img
                                                    src={relatedEvent.image}
                                                    alt={relatedEvent.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                <div className="absolute top-4 right-4">
                                                    <Badge className="bg-white/90 backdrop-blur-sm text-black border-none font-bold">
                                                        {relatedEvent.category}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-tighter mb-2">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {relatedEvent.date}
                                            </div>
                                            <h4 className="text-xl font-bold group-hover:text-primary transition-colors">{relatedEvent.title}</h4>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
