import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { ChairmanSection } from "@/components/chairman-section";
import { MarketplaceSection } from "@/components/marketplace-section";
import { ServicesSection } from "@/components/services-section";
import { LocationSection } from "@/components/location-section";
import { RegistrationSection } from "@/components/registration-section";
import { PartnersSection } from "@/components/partners-section";
import { SponsorsSection } from "@/components/sponsors-section";
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
import { Link } from "wouter";
import { GraduationCap, ArrowRight } from "lucide-react";

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
          <ChairmanSection />
          <MarketplaceSection />
          <PartnershipPackagesSection />
          {/* <SpeakersSection />
        <ProgramSection /> */}
          {/* <VenueSection /> */}
          <ServicesSection />

          {/* Student Attachment CTA */}
          <section className="py-16 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-y border-primary/10">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center flex-shrink-0 border border-primary/20">
                    <GraduationCap className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold tracking-tight">Student Attachment Programme</h2>
                    <p className="text-muted-foreground mt-1 max-w-lg">
                      University students can apply for industrial attachment with verified KNCCI member businesses in Uasin Gishu County.
                    </p>
                  </div>
                </div>
                <Link href="/attachment" className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-8 py-4 rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-105 whitespace-nowrap flex-shrink-0">
                  Apply Now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>

          <RegistrationSection />
          <LocationSection />
          <GallerySection />
          <PartnersSection />
          <SponsorsSection />
          {/* <ExhibitionRatesSection /> */}
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
