/**
 * Example usage of the HotelsMap component
 * 
 * This file demonstrates how to use the HotelsMap component in your application.
 * 
 * IMPORTANT: Before using this component, you need to install the required dependencies:
 * 
 * npm install react-leaflet leaflet
 * npm install --save-dev @types/leaflet
 * 
 * The component automatically imports the Leaflet CSS, so no additional CSS imports are needed.
 */

import { HotelsMap } from "./hotels-map";

export function HotelsMapExample() {
  return (
    <section className="py-20 sm:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Nearby Hotels
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
              Find Your Stay
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Explore hotels near the event venue in Eldoret
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
