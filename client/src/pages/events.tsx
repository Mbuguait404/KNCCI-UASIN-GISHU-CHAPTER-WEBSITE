import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, ArrowRight, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { SEOHead } from "@/components/seo/seo-head";
import { staticEvent } from "@/data/static-data";

export default function EventsPage() {
    const upcomingEvents = [
        {
            id: staticEvent.id,
            title: staticEvent.name,
            date: "April 23-25, 2026",
            location: staticEvent.venue,
            image: "https://images.unsplash.com/photo-1540575861501-7ad05823c9f5?auto=format&fit=crop&q=80&w=2070",
            category: "Summit",
            description: staticEvent.subtitle,
            featured: true
        },
        {
            id: "monthly-mixer-may",
            title: "May Business Networking Mixer",
            date: "May 15, 2026",
            location: "Boma Inn, Eldoret",
            image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=2069",
            category: "Networking",
            description: "Our monthly gathering for business leaders to connect and share insights.",
            featured: false
        },
        {
            id: "agribusiness-expo",
            title: "North Rift Agribusiness Expo",
            date: "June 10-12, 2026",
            location: "Eldoret Showground",
            image: "https://images.unsplash.com/photo-1595113316349-9fa4ee24f884?auto=format&fit=crop&q=80&w=2072",
            category: "Exhibition",
            description: "Showcasing the latest in agricultural technology and value addition.",
            featured: false
        }
    ];

    const pastEvents = [
        {
            title: "Chamber Business Awards 2025",
            date: "December 20, 2025",
            location: "Eka Hotel, Eldoret",
            category: "Awards"
        },
        {
            title: "SME Digital Transformation Workshop",
            date: "November 5, 2025",
            location: "KVDA Plaza",
            category: "Workshop"
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            <SEOHead
                title="Events | KNCCI Uasin Gishu"
                description="Stay updated with our upcoming summits, exhibitions, networking mixers, and business workshops in Uasin Gishu County."
            />
            <Navigation />

            <main className="pt-20">
                {/* Header section */}
                <section className="py-20 bg-slate-50 dark:bg-slate-900/40 border-b border-border">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto text-center">
                            <span className="text-primary font-bold text-sm uppercase tracking-widest block mb-4">Connect & Grow</span>
                            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">Our <span className="text-primary">Events</span></h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                From high-level international summits to local networking mixers, we host events that drive your business forward.
                            </p>
                        </div>

                        {/* Filter/Search Bar */}
                        <div className="mt-12 max-w-5xl mx-auto">
                            <div className="flex flex-col md:flex-row gap-4 p-2 bg-background rounded-2xl shadow-xl border border-border">
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input
                                        placeholder="Search events..."
                                        className="pl-12 h-14 border-none focus-visible:ring-0 text-lg rounded-xl"
                                    />
                                </div>
                                <div className="h-10 w-px bg-border hidden md:block self-center" />
                                <Button variant="ghost" className="h-14 px-8 rounded-xl font-semibold gap-2">
                                    <Filter className="w-5 h-5" />
                                    Category
                                </Button>
                                <Button size="lg" className="h-14 px-10 rounded-xl font-bold">
                                    Find Events
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Upcoming Events */}
                <section className="py-24">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-3xl font-bold italic">Upcoming Events</h2>
                            <div className="w-24 h-1.5 bg-primary rounded-full" />
                        </div>

                        <div className="grid lg:grid-cols-12 gap-10">
                            {/* Featured Event (First in list) */}
                            <motion.div
                                className="lg:col-span-8 group"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <Link href="/">
                                    <div className="relative h-[500px] rounded-[2.5rem] overflow-hidden cursor-pointer shadow-2xl">
                                        <img
                                            src={upcomingEvents[0].image}
                                            alt={upcomingEvents[0].title}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                                        <div className="absolute bottom-10 left-10 right-10 text-white">
                                            <Badge className="mb-4 bg-primary hover:bg-primary border-none text-white px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest">
                                                Featured Event
                                            </Badge>
                                            <h3 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight group-hover:text-primary transition-colors">
                                                {upcomingEvents[0].title}
                                            </h3>
                                            <p className="text-xl text-slate-200 mb-6 max-w-2xl opacity-90 leading-relaxed font-light">
                                                {upcomingEvents[0].description}
                                            </p>
                                            <div className="flex flex-wrap gap-6 items-center">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-5 h-5 text-primary" />
                                                    <span className="font-medium">{upcomingEvents[0].date}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-5 h-5 text-primary" />
                                                    <span className="font-medium">{upcomingEvents[0].location}</span>
                                                </div>
                                                <div className="ml-auto hidden sm:flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
                                                    Details <ArrowRight className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>

                            {/* Smaller upcoming events */}
                            <div className="lg:col-span-4 flex flex-col gap-6">
                                {upcomingEvents.slice(1).map((event, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1 }}
                                    >
                                        <Card className="overflow-hidden border-border/50 group cursor-pointer hover:shadow-xl transition-all duration-300">
                                            <div className="relative h-48">
                                                <img src={event.image} alt={event.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                                <div className="absolute top-4 right-4">
                                                    <Badge variant="secondary" className="backdrop-blur-md bg-white/80 dark:bg-black/80">{event.category}</Badge>
                                                </div>
                                            </div>
                                            <CardContent className="p-6">
                                                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-tighter mb-2">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {event.date}
                                                </div>
                                                <h4 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{event.title}</h4>
                                                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                                    <MapPin className="w-4 h-4" />
                                                    {event.location}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}

                                <Button variant="outline" className="mt-4 rounded-xl h-14 border-primary text-primary hover:bg-primary/5 font-bold" asChild>
                                    <Link href="/contact">Host an Event with Us</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Past Events / Highlights */}
                <section className="py-24 bg-slate-50 dark:bg-slate-900/40">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto">
                            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-4">
                                <div className="text-center md:text-left">
                                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Past <span className="italic">Highlights</span></h2>
                                    <p className="text-muted-foreground text-lg">A look back at our recent activities and successful summits.</p>
                                </div>
                                <Button variant="ghost" className="text-primary font-bold text-lg p-0 h-auto hover:bg-transparent" asChild>
                                    <Link href="/gallery">View Photo Gallery <ArrowRight className="ml-2 w-5 h-5" /></Link>
                                </Button>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {pastEvents.map((event, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        className="p-8 rounded-3xl bg-background border border-border shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <Badge variant="outline" className="mb-4 text-xs font-bold uppercase tracking-widest border-primary/30 text-primary">
                                            {event.category}
                                        </Badge>
                                        <h3 className="text-xl font-bold mb-4 leading-tight">{event.title}</h3>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                                <Calendar className="w-4 h-4" />
                                                {event.date}
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                                <MapPin className="w-4 h-4" />
                                                {event.location}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                {/* Visual Placeholder for more */}
                                <div className="p-8 rounded-3xl border-2 border-dashed border-border flex flex-col items-center justify-center text-center opacity-50">
                                    <span className="text-sm font-medium mb-2">More event highlights available in our media center</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Calendar Subscription Section */}
                <section className="py-24">
                    <div className="container mx-auto px-4">
                        <div className="max-w-5xl mx-auto rounded-[3rem] bg-slate-900 text-white overflow-hidden flex flex-col lg:flex-row relative">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
                            <div className="p-12 lg:w-3/5">
                                <h2 className="text-3xl md:text-4xl font-bold mb-6 italic">Never Miss an Opportunity</h2>
                                <p className="text-slate-300 text-lg mb-10 leading-relaxed">
                                    Subscribe to our business events calendar to get local and international trade events directly synced to your personal calendar.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button className="h-14 px-8 rounded-xl font-bold bg-primary text-white" size="lg">
                                        Subscribe with Google
                                    </Button>
                                    <Button variant="outline" className="h-14 px-8 rounded-xl font-bold border-white/20 text-white hover:bg-white/10" size="lg">
                                        iCal / Outlook
                                    </Button>
                                </div>
                            </div>
                            <div className="lg:w-2/5 relative min-h-[300px]">
                                <img
                                    src="https://images.unsplash.com/photo-1506784919140-58709ee2840a?auto=format&fit=crop&q=80&w=1000"
                                    alt="Calendar"
                                    className="absolute inset-0 w-full h-full object-cover grayscale opacity-40"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Calendar className="w-24 h-24 text-primary/80 animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
