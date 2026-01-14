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

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <SpeakersSection />
        <ProgramSection />
        <VenueSection />
        <NearbyHotelsSection />
        <RegistrationSection />
        <GallerySection />
        <PartnersSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
}
