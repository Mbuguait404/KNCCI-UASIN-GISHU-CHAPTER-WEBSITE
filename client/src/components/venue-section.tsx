import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Car, Accessibility, Building2 } from "lucide-react";
import type { Venue } from "@shared/schema";

export function VenueSection() {
  const { data: venue, isLoading, isError } = useQuery<Venue>({
    queryKey: ["/api/venue"],
  });

  if (isError) {
    return (
      <section id="venue" className="py-20 sm:py-28 bg-accent/30" data-testid="section-venue">
        <div className="container mx-auto px-4 text-center py-12">
          <p className="text-muted-foreground">Unable to load venue information. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="venue"
      className="py-20 sm:py-28 bg-accent/30"
      data-testid="section-venue"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Event Location
          </span>
          {isLoading ? (
            <>
              <Skeleton className="h-12 w-64 mx-auto mt-4 mb-6" />
              <Skeleton className="h-6 w-3/4 mx-auto" />
            </>
          ) : venue ? (
            <>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6" data-testid="text-venue-name">
                {venue.name}, {venue.city}
              </h2>
              {venue.description && (
                <p className="text-lg text-muted-foreground leading-relaxed" data-testid="text-venue-description">
                  {venue.description}
                </p>
              )}
            </>
          ) : null}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="space-y-6">
            {isLoading ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="p-6 border border-border bg-card">
                    <div className="flex items-start gap-4">
                      <Skeleton className="w-12 h-12 rounded-lg" />
                      <div className="flex-1">
                        <Skeleton className="h-6 w-24 mb-2" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4 mt-1" />
                      </div>
                    </div>
                  </Card>
                ))}
              </>
            ) : venue ? (
              <>
                <Card className="p-6 border border-border bg-card">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Address
                      </h3>
                      <p className="text-muted-foreground" data-testid="text-venue-address">
                        {venue.name}<br />
                        {venue.address}<br />
                        {venue.city}, Kenya
                      </p>
                    </div>
                  </div>
                </Card>

                {venue.parking && (
                  <Card className="p-6 border border-border bg-card">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                        <Car className="w-6 h-6 text-secondary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          Parking
                        </h3>
                        <p className="text-muted-foreground" data-testid="text-venue-parking">
                          {venue.parking}
                        </p>
                      </div>
                    </div>
                  </Card>
                )}

                {venue.accessibility && venue.accessibility.length > 0 && (
                  <Card className="p-6 border border-border bg-card">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-chart-4/10 flex items-center justify-center">
                        <Accessibility className="w-6 h-6 text-chart-4" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          Accessibility
                        </h3>
                        <ul className="text-muted-foreground space-y-1" data-testid="list-venue-accessibility">
                          {venue.accessibility.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                )}

                {venue.nearbyHotels && venue.nearbyHotels.length > 0 && (
                  <Card className="p-6 border border-border bg-card">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-chart-3/10 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-chart-3" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          Nearby Hotels
                        </h3>
                        <ul className="text-muted-foreground space-y-1" data-testid="list-venue-hotels">
                          {venue.nearbyHotels.map((hotel, index) => (
                            <li key={index}>{hotel}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                )}
              </>
            ) : null}
          </div>

          <div className="space-y-6">
            {isLoading ? (
              <Card className="overflow-hidden border border-border">
                <Skeleton className="aspect-video" />
                <div className="p-4 bg-card">
                  <Skeleton className="h-[300px]" />
                </div>
              </Card>
            ) : venue ? (
              <Card className="overflow-hidden border border-border">
                <div className="aspect-video bg-gradient-to-br from-muted to-accent flex items-center justify-center">
                  <div className="text-center p-8">
                    <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h4 className="font-semibold text-foreground mb-2" data-testid="text-venue-card-name">
                      {venue.name}
                    </h4>
                    <p className="text-sm text-muted-foreground" data-testid="text-venue-card-address">
                      {venue.address}, {venue.city}
                    </p>
                  </div>
                </div>
                {venue.mapEmbedUrl && (
                  <div className="p-4 bg-card">
                    <iframe
                      src={venue.mapEmbedUrl}
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Venue Location Map"
                      className="rounded-md"
                      data-testid="map-venue"
                    />
                  </div>
                )}
              </Card>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
