import { useEffect, useMemo, useState } from "react";
import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { SEOHead } from "@/components/seo/seo-head";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  ArrowLeft,
  Share2,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { websiteContentService } from "@/services/website-content-service";
import type { WebsiteEventContent } from "@/types/content";

export default function EventDetail() {
  const [, params] = useRoute("/events/:id");
  const eventId = params?.id;
  const [event, setEvent] = useState<WebsiteEventContent | null>(null);
  const [events, setEvents] = useState<WebsiteEventContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [eventId]);

  useEffect(() => {
    if (!eventId) return;

    const loadEvent = async () => {
      setLoading(true);
      try {
        const [eventData, eventsData] = await Promise.all([
          websiteContentService.getEvent(eventId),
          websiteContentService.getEvents(),
        ]);
        setEvent(eventData);
        setEvents(eventsData);
      } catch {
        setEvent(null);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    void loadEvent();
  }, [eventId]);

  const relatedEvents = useMemo(() => {
    if (!event) return [];
    return events.filter((candidate) => candidate.slug !== event.slug && !candidate.isPast).slice(0, 3);
  }, [event, events]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        <main className="flex flex-grow items-center justify-center p-4 text-muted-foreground">
          Loading event...
        </main>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        <main className="flex flex-grow items-center justify-center p-4">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Calendar className="h-10 w-10" />
            </div>
            <h1 className="mb-4 text-3xl font-bold">Event not found</h1>
            <p className="mb-8 text-lg text-muted-foreground">
              The event you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
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

  const registrationHref = event.registrationLink || "/contact";
  const isExternalRegistration = /^https?:\/\//i.test(registrationHref);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${event.title} | KNCCI Events`}
        description={event.description}
      />

      <Navigation />

      <main className="pb-16 pt-24">
        <header className="relative overflow-hidden py-12 md:py-20">
          <div className="pointer-events-none absolute inset-0 bg-primary/5" />
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

          <div className="container mx-auto max-w-6xl px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/events">
                <Button variant="ghost" className="mb-8 gap-2 pl-0 font-bold text-primary transition-all hover:bg-transparent hover:text-primary">
                  <ArrowLeft className="h-4 w-4" /> Back to Events
                </Button>
              </Link>

              <div className="mb-6 flex flex-wrap items-center gap-4">
                <Badge className="border-none bg-primary px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary-foreground">
                  {event.category}
                </Badge>
                {event.featured && (
                  <Badge variant="outline" className="border-primary px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                    Featured Event
                  </Badge>
                )}
              </div>

              <h1 className="mb-8 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
                {event.title}
              </h1>

              <div className="mb-10 grid gap-6 md:grid-cols-3">
                <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">Date & Time</p>
                    <p className="text-lg font-bold">{event.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">Location</p>
                    <p className="text-lg font-bold">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Share2 className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">Share Event</p>
                    <div className="flex gap-3">
                      <button className="text-sm font-bold text-muted-foreground transition-colors hover:text-primary">Twitter</button>
                      <button className="text-sm font-bold text-muted-foreground transition-colors hover:text-primary">LinkedIn</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="h-16 rounded-xl px-10 text-lg font-bold shadow-xl shadow-primary/20" asChild>
                  {isExternalRegistration ? (
                    <a href={registrationHref} target="_blank" rel="noreferrer">
                      Register for this Event
                    </a>
                  ) : (
                    <Link href={registrationHref}>Register for this Event</Link>
                  )}
                </Button>
                <Button variant="outline" size="lg" className="h-16 rounded-xl px-10 text-lg font-bold border-2">
                  Add to Calendar
                </Button>
              </div>
            </motion.div>
          </div>
        </header>

        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7 }}
                className="relative mb-12 aspect-video overflow-hidden rounded-[2.5rem] border-b-8 border-primary bg-muted shadow-2xl"
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-full w-full object-cover"
                />
              </motion.div>

              <div className="prose prose-lg max-w-none dark:prose-invert">
                <h2 className="mb-6 text-3xl font-bold">
                  About the <span className="italic text-primary">Event</span>
                </h2>
                <p className="mb-8 text-xl leading-relaxed text-muted-foreground">
                  {event.longDescription || event.description}
                </p>

                {event.content && (
                  <div
                    className="mb-12 rounded-3xl border border-border/50 bg-card/50 p-8"
                    dangerouslySetInnerHTML={{ __html: event.content }}
                  />
                )}

                {event.agenda && event.agenda.length > 0 && (
                  <section className="mt-12">
                    <div className="mb-8 flex items-center gap-3">
                      <Clock className="h-8 w-8 text-primary" />
                      <h2 className="mb-0 text-3xl font-bold">
                        Event <span className="italic">Agenda</span>
                      </h2>
                    </div>
                    <div className="space-y-4">
                      {event.agenda.map((agendaItem, index) => (
                        <div key={`${agendaItem.time}-${index}`} className="grid gap-4 rounded-2xl border border-border/50 bg-card p-5 md:grid-cols-[180px_1fr]">
                          <div className="text-lg font-bold text-primary">{agendaItem.time}</div>
                          <div className="text-muted-foreground">{agendaItem.activity}</div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>

            <aside className="lg:col-span-4">
              <div className="sticky top-28 space-y-8">
                <div className="rounded-3xl border border-border/50 bg-card p-6 shadow-sm">
                  <h3 className="text-2xl font-bold">Event Snapshot</h3>
                  <Separator className="my-5" />
                  <div className="space-y-4 text-sm text-muted-foreground">
                    <div className="flex items-start gap-3">
                      <Calendar className="mt-0.5 h-4 w-4 text-primary" />
                      <div>
                        <p className="font-semibold text-foreground">Date</p>
                        <p>{event.date}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                      <div>
                        <p className="font-semibold text-foreground">Venue</p>
                        <p>{event.location}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {relatedEvents.length > 0 && (
                  <div className="rounded-3xl border border-border/50 bg-card p-6 shadow-sm">
                    <h3 className="text-2xl font-bold">Related Events</h3>
                    <Separator className="my-5" />
                    <div className="space-y-5">
                      {relatedEvents.map((relatedEvent) => (
                        <Link key={relatedEvent._id} href={`/events/${relatedEvent.slug}`}>
                          <a className="group block">
                            <div className="flex gap-4">
                              <img
                                src={relatedEvent.image}
                                alt={relatedEvent.title}
                                className="h-20 w-24 rounded-2xl object-cover"
                              />
                              <div className="min-w-0">
                                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-primary">
                                  {relatedEvent.category}
                                </p>
                                <h4 className="line-clamp-2 font-bold transition-colors group-hover:text-primary">
                                  {relatedEvent.title}
                                </h4>
                                <p className="mt-1 text-sm text-muted-foreground">{relatedEvent.date}</p>
                              </div>
                            </div>
                          </a>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-6">
                      <Link href="/events">
                        <Button variant="outline" className="w-full rounded-full">
                          More Events <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
