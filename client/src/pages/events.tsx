import { useEffect, useMemo, useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowRight, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { SEOHead } from "@/components/seo/seo-head";
import { websiteContentService } from "@/services/website-content-service";
import type { WebsiteEventContent } from "@/types/content";

export default function EventsPage() {
  const [events, setEvents] = useState<WebsiteEventContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      try {
        const data = await websiteContentService.getEvents();
        setEvents(data);
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    void loadEvents();
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(events.map((event) => event.category).filter(Boolean))),
    [events],
  );

  const filteredEvents = useMemo(
    () =>
      events.filter((event) => {
        const matchesSearch =
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
        return matchesSearch && matchesCategory;
      }),
    [events, searchQuery, selectedCategory],
  );

  const upcomingEvents = filteredEvents.filter((event) => !event.isPast);
  const pastEvents = filteredEvents.filter((event) => event.isPast);
  const featuredEvent = upcomingEvents.find((event) => event.featured) || upcomingEvents[0];
  const sideEvents = featuredEvent
    ? upcomingEvents.filter((event) => event._id !== featuredEvent._id)
    : [];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Events | KNCCI Uasin Gishu"
        description="Stay updated with our upcoming summits, exhibitions, networking mixers, and business workshops in Uasin Gishu County."
      />
      <Navigation />

      <main className="pt-20">
        <section className="border-b border-border bg-slate-50 py-20 dark:bg-slate-900/40">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <span className="mb-4 block text-sm font-bold uppercase tracking-widest text-primary">Connect & Grow</span>
              <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-6xl">
                Our <span className="text-primary">Events</span>
              </h1>
              <p className="text-xl leading-relaxed text-muted-foreground">
                From high-level international summits to local networking mixers, we host events that drive your business forward.
              </p>
            </div>

            <div className="mx-auto mt-12 max-w-5xl">
              <div className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-2 shadow-xl md:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search events..."
                    className="h-14 rounded-xl border-none pl-12 text-lg focus-visible:ring-0"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                  />
                </div>
                <div className="hidden h-10 w-px self-center bg-border md:block" />
                <div className="flex items-center gap-2 px-4">
                  <Filter className="h-5 w-5 text-muted-foreground" />
                  <select
                    value={selectedCategory}
                    onChange={(event) => setSelectedCategory(event.target.value)}
                    className="h-14 rounded-xl bg-transparent text-sm font-semibold outline-none"
                  >
                    <option value="all">All categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="container mx-auto px-4 py-24 text-center text-muted-foreground">
            Loading events...
          </div>
        ) : (
          <>
            <section className="py-24">
              <div className="container mx-auto px-4">
                <div className="mb-12 flex items-center justify-between">
                  <h2 className="text-3xl font-bold italic">Upcoming Events</h2>
                  <div className="h-1.5 w-24 rounded-full bg-primary" />
                </div>

                {featuredEvent ? (
                  <div className="grid gap-10 lg:grid-cols-12">
                    <motion.div
                      className="group lg:col-span-8"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                    >
                      <Link href={`/events/${featuredEvent.slug}`}>
                        <div className="relative h-[500px] cursor-pointer overflow-hidden rounded-[2.5rem] shadow-2xl">
                          <img
                            src={featuredEvent.image}
                            alt={featuredEvent.title}
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                          <div className="absolute bottom-10 left-10 right-10 text-white">
                            <Badge className="mb-4 rounded-full border-none bg-primary px-4 py-1.5 text-sm font-bold uppercase tracking-widest text-white hover:bg-primary">
                              Featured Event
                            </Badge>
                            <h3 className="mb-4 text-3xl font-extrabold tracking-tight transition-colors group-hover:text-primary md:text-5xl">
                              {featuredEvent.title}
                            </h3>
                            <p className="mb-6 max-w-2xl text-xl font-light leading-relaxed text-slate-200 opacity-90">
                              {featuredEvent.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-6">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-primary" />
                                <span className="font-medium">{featuredEvent.date}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-primary" />
                                <span className="font-medium">{featuredEvent.location}</span>
                              </div>
                              <div className="ml-auto hidden translate-x-4 items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 sm:flex">
                                Details <ArrowRight className="h-4 w-4" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>

                    <div className="flex flex-col gap-6 lg:col-span-4">
                      {sideEvents.map((event, idx) => (
                        <motion.div
                          key={event._id}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1 }}
                        >
                          <Link href={`/events/${event.slug}`}>
                            <Card className="group cursor-pointer overflow-hidden border-border/50 transition-all duration-300 hover:shadow-xl">
                              <div className="relative h-48">
                                <img src={event.image} alt={event.title} className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0" />
                                <div className="absolute right-4 top-4">
                                  <Badge variant="secondary" className="bg-white/80 backdrop-blur-md dark:bg-black/80">{event.category}</Badge>
                                </div>
                              </div>
                              <CardContent className="p-6">
                                <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-tighter text-primary">
                                  <Calendar className="h-3.5 w-3.5" />
                                  {event.date}
                                </div>
                                <h4 className="mb-2 text-xl font-bold transition-colors group-hover:text-primary">{event.title}</h4>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <MapPin className="h-4 w-4" />
                                  {event.location}
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-3xl border border-dashed border-border px-6 py-16 text-center text-muted-foreground">
                    No upcoming events match your filters right now.
                  </div>
                )}
              </div>
            </section>

            <section className="bg-slate-50 py-24 dark:bg-slate-900/30">
              <div className="container mx-auto px-4">
                <div className="mb-12 flex items-center justify-between">
                  <h2 className="text-3xl font-bold italic">Past Events</h2>
                  <div className="h-1.5 w-24 rounded-full bg-primary" />
                </div>

                {pastEvents.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {pastEvents.map((event, idx) => (
                      <motion.div
                        key={event._id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.08 }}
                      >
                        <Link href={`/events/${event.slug}`}>
                          <Card className="group cursor-pointer overflow-hidden border-border/50 transition-all duration-300 hover:shadow-xl">
                            <div className="relative h-56">
                              <img src={event.image} alt={event.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                              <div className="absolute bottom-4 left-4 right-4">
                                <Badge variant="secondary" className="mb-3 bg-white/90 dark:bg-black/80">
                                  {event.category}
                                </Badge>
                                <h3 className="text-xl font-bold text-white">{event.title}</h3>
                              </div>
                            </div>
                            <CardContent className="space-y-3 p-5">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4 text-primary" />
                                {event.date}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4 text-primary" />
                                {event.location}
                              </div>
                              <p className="line-clamp-2 text-sm text-muted-foreground">{event.description}</p>
                            </CardContent>
                          </Card>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-3xl border border-dashed border-border bg-background px-6 py-16 text-center text-muted-foreground">
                    No past events match your filters right now.
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
