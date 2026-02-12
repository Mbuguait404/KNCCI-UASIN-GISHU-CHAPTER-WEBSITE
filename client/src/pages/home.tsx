import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { GalaDinnerSection } from "../components/gala-dinner-section";
import { NearbyHotelsSection } from "@/components/nearby-hotels-section";
import { RegistrationSection } from "@/components/registration-section";
import { PartnersSection } from "@/components/partners-section";
import { ExhibitionRatesSection } from "@/components/exhibition-rates-section";
import { GallerySection } from "@/components/gallery-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { Footer } from "@/components/footer";
import { SEOHead } from "@/components/seo/seo-head";
import { StructuredData } from "@/components/seo/structured-data";
import { staticEvent, staticSpeakers, staticVenue, staticTestimonials } from "@/data/static-data";
import { useQuery } from "@tanstack/react-query";
import { ticketing } from "@/lib/ticketing";
import { Event } from "@shared/schema";
import { RegistrationDialog } from "@/components/registration-dialog";
import { useState } from "react";

export default function Home() {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  const { data: apiEvents } = useQuery({
    queryKey: ["events"],
    queryFn: ticketing.getEvents
  });

  const apiEvent = apiEvents?.[0];

  // Map API event to Schema Event
  const displayEvent: Event = apiEvent ? {
    ...staticEvent, // Fallback to static data for missing fields
    id: apiEvent.id,
    name: apiEvent.title,
    description: apiEvent.description,
    date: apiEvent.startDateTime,
    endDate: apiEvent.endDateTime,
    location: apiEvent.location.city,
    venue: apiEvent.location.name,
    // Keep static highlights/stats if API doesn't provide them yet
  } : staticEvent;

  return (
    <>
      <SEOHead
        title={displayEvent.name}
        description={displayEvent.description}
        event={displayEvent}
        keywords={[
          "Eldoret International Business Summit",
          "Business Conference Kenya",
          "Trade Summit Africa",
          "KNCCI Events",
          "Uasin Gishu Business",
          "Kenya Trade Expo",
        ]}
        canonicalUrl={typeof window !== "undefined" ? window.location.origin : ""}
      />
      <StructuredData
        event={displayEvent}
        speakers={staticSpeakers}
        venue={staticVenue}
        testimonials={staticTestimonials}
        organization={{
          name: "KNCCI Uasin Gishu Chapter",
          url: typeof window !== "undefined" ? window.location.origin : "",
          logo: "/kncci_logo-removebg-preview.png",
        }}
      />
      <div className="min-h-screen bg-background">
        <Navigation />
        <main>
          <HeroSection
            event={displayEvent}
            onRegister={() => setIsRegistrationOpen(true)}
          />
          <AboutSection />
          {/* <SpeakersSection />
        <ProgramSection /> */}
          {/* <VenueSection /> */}
          <GalaDinnerSection />
          <NearbyHotelsSection />

          {/* Reuse RegistrationSection but maybe link it to modal too? 
              For now keeping as is, but could replace with just the section */}
          <RegistrationSection />

          <GallerySection />
          <PartnersSection />
          <ExhibitionRatesSection />
          <TestimonialsSection />
        </main>
        <Footer />

        <RegistrationDialog
          isOpen={isRegistrationOpen}
          onOpenChange={setIsRegistrationOpen}
          event={displayEvent}
        />
      </div>
    </>
  );
}
