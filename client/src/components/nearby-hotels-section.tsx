import { HotelsMap } from "./hotels-map";

export function NearbyHotelsSection() {
  return (
    <section
      id="hotels"
      className="py-20 sm:py-28 bg-background"
      data-testid="section-hotels"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Accommodation
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6" data-testid="text-hotels-title">
              Nearby Hotels
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Explore hotels near the event venue in Eldoret. Click on any marker to view hotel details and make a reservation.
            </p>
          </div>

          {/* Map Component */}
          <div className="rounded-lg overflow-hidden border border-border shadow-lg">
            <HotelsMap height="600px" />
          </div>
        </div>
      </div>
    </section>
  );
}
