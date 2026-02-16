import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { GalaDinnerSection } from "../components/gala-dinner-section";
import { NearbyHotelsSection } from "@/components/nearby-hotels-section";
import { RegistrationSection } from "@/components/registration-section";
import { PartnersSection } from "@/components/partners-section";
import { ExhibitionRatesSection } from "@/components/exhibition-rates-section";
import { PartnershipPackagesSection } from "@/components/partnership-packages-section";
import { GallerySection } from "@/components/gallery-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { Footer } from "@/components/footer";
import { SEOHead } from "@/components/seo/seo-head";
import { StructuredData } from "@/components/seo/structured-data";
import { staticEvent, staticSpeakers, staticVenue, staticTestimonials } from "@/data/static-data";
import { Event } from "@shared/schema";
import { RegistrationDialog } from "@/components/registration-dialog";
import { useRegistration } from "@/contexts/registration-context";

export default function Home() {
  const { isOpen, closeRegistration } = useRegistration();

  // Use static event - no API fetch
  const displayEvent: Event = staticEvent;

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
          <HeroSection event={displayEvent} />
          <AboutSection />
          <PartnershipPackagesSection />
          <ExhibitionRatesSection />
          {/* <SpeakersSection />
        <ProgramSection /> */}
          {/* <VenueSection /> */}
          <GalaDinnerSection />
          <NearbyHotelsSection />
          <RegistrationSection />
          <GallerySection />
          <PartnersSection />
          <TestimonialsSection />
        </main>
        <Footer />

        <RegistrationDialog
          isOpen={isOpen}
          onOpenChange={closeRegistration}
          event={displayEvent}
        />
      </div>
    </>
  );
}
