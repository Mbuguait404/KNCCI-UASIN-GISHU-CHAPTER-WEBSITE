import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { SpeakersSection } from "@/components/speakers-section";
import { ProgramSection } from "@/components/program-section";
import { VenueSection } from "@/components/venue-section";
import { NearbyHotelsSection } from "@/components/nearby-hotels-section";
import { RegistrationSection } from "@/components/registration-section";
import { PartnersSection } from "@/components/partners-section";
import { GallerySection } from "@/components/gallery-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { Footer } from "@/components/footer";
import { SEOHead } from "@/components/seo/seo-head";
import { StructuredData } from "@/components/seo/structured-data";
import { staticEvent, staticSpeakers, staticVenue, staticTestimonials } from "@/data/static-data";

export default function Home() {
  return (
    <>
      <SEOHead
        title={staticEvent.name}
        description={staticEvent.description}
        event={staticEvent}
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
        event={staticEvent}
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
          <HeroSection />
          <AboutSection />
          {/* <SpeakersSection />
        <ProgramSection /> */}
          {/* <VenueSection /> */}
          <NearbyHotelsSection />
          <RegistrationSection />
          <GallerySection />
          <PartnersSection />
          <TestimonialsSection />
        </main>
        <Footer />
      </div>
    </>
  );
}
