import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, Star } from "lucide-react";
import type { Event } from "@shared/schema";

export function AboutSection() {
  const { data: event, isLoading, isError } = useQuery<Event>({
    queryKey: ["/api/event"],
  });

  if (isError) {
    return (
      <section id="about" className="py-20 sm:py-28 bg-background" data-testid="section-about">
        <div className="container mx-auto px-4 text-center py-12">
          <p className="text-muted-foreground">Unable to load event information. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="about"
      className="py-20 sm:py-28 bg-background"
      data-testid="section-about"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            About The Event
          </span>
          {isLoading ? (
            <>
              <Skeleton className="h-12 w-3/4 mx-auto mt-4 mb-6" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-5/6 mx-auto" />
            </>
          ) : event ? (
            <>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6" data-testid="text-about-title">
                {event.name}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed" data-testid="text-about-description">
                {event.description}
              </p>
            </>
          ) : null}
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-6 border border-border bg-card">
                <div className="flex gap-4">
                  <Skeleton className="w-12 h-12 rounded-lg flex-shrink-0" />
                  <div className="flex-1">
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : event?.highlights && event.highlights.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {event.highlights.map((highlight, index) => (
              <Card
                key={index}
                className="p-6 border border-border bg-card hover-elevate"
                data-testid={`card-highlight-${index}`}
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Star className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex items-center">
                    <p className="text-foreground font-medium">
                      {highlight}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : null}

        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="p-8 bg-gradient-to-br from-card to-accent/30 border border-border">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Why Attend?
                </h3>
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Skeleton className="w-5 h-5 rounded-full" />
                        <Skeleton className="h-4 w-48" />
                      </div>
                    ))}
                  </div>
                ) : event?.highlights ? (
                  <ul className="space-y-3">
                    {event.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-center gap-3" data-testid={`reason-${index}`}>
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                          <Check className="w-3 h-3 text-secondary-foreground" />
                        </div>
                        <span className="text-foreground">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
              <div className="relative">
                {isLoading ? (
                  <Skeleton className="aspect-video rounded-lg" />
                ) : event?.stats ? (
                  <div className="aspect-video rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-border">
                    <div className="text-center p-6">
                      <div className="text-4xl font-bold text-foreground" data-testid="stat-attendees">{event.stats.attendees}</div>
                      <div className="text-muted-foreground">Expected Attendees</div>
                      <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-primary" data-testid="stat-speakers">{event.stats.speakers}</div>
                          <div className="text-xs text-muted-foreground">Speakers</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-secondary" data-testid="stat-sessions">{event.stats.sessions}</div>
                          <div className="text-xs text-muted-foreground">Sessions</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
