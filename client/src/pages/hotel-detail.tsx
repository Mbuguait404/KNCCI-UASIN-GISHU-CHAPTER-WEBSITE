import { useRoute } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Star, MapPin, Phone, Mail, Globe, Check } from "lucide-react";
import { Link } from "wouter";
import { hotelsData } from "@/components/hotels-map";
import { SEOHead } from "@/components/seo/seo-head";
import { Helmet } from "react-helmet-async";

export default function HotelDetail() {
  const [match, params] = useRoute<{ id: string }>("/hotels/:id");
  const hotel = hotelsData.find(h => h.id === params?.id);

  if (!hotel) {
    return (
      <>
        <SEOHead
          title="Hotel Not Found - Eldoret International Business Summit 2026"
          description="The hotel you're looking for doesn't exist."
          noindex={true}
        />
        <div className="min-h-screen bg-background">
          <Navigation />
          <main className="py-20 sm:py-28">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-3xl font-bold text-foreground mb-4">Hotel Not Found</h1>
              <p className="text-muted-foreground mb-6">The hotel you're looking for doesn't exist.</p>
              <Link href="/#hotels">
                <Button>Back to Hotels</Button>
              </Link>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
  const pageUrl = `${siteUrl}/hotels/${hotel.id}`;
  const ratingValue = parseFloat(hotel.rating) || 4.5;

  // LodgingBusiness schema for hotel
  const hotelSchema = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: hotel.name,
    description: hotel.description,
    image: hotel.image,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Eldoret",
      addressRegion: "Uasin Gishu County",
      addressCountry: "KE",
      streetAddress: hotel.location,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: hotel.coordinates[0].toString(),
      longitude: hotel.coordinates[1].toString(),
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: ratingValue.toString(),
      bestRating: "5",
      worstRating: "1",
    },
    telephone: "+254740853372",
    email: "events@uasingishuchamber.co.ke",
    url: "https://www.uasingishuchamber.co.ke",
  };

  return (
    <>
      <SEOHead
        title={`${hotel.name} - Recommended Hotel for Eldoret Business Summit 2026`}
        description={`${hotel.name} in Eldoret - ${hotel.description}. Rated ${hotel.rating}/5. Perfect accommodation for attendees of The Eldoret International Business Summit 2026.`}
        keywords={[
          hotel.name,
          "Eldoret Hotels",
          "Business Summit Accommodation",
          "Hotels near Rupaz Center Eldoret",
          "Eldoret Kenya Hotels",
        ]}
        canonicalUrl={pageUrl}
        image={hotel.image}
      />
      <Helmet>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelSchema) }}
        />
      </Helmet>
      <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        {/* Hero Section with Image */}
        <section className="relative h-[400px] sm:h-[500px] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={hotel.image}
              alt={hotel.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://via.placeholder.com/1200x500?text=Hotel";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>
          <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-8">
            <Link href="/#hotels">
              <Button variant="ghost" className="mb-6 text-white hover:bg-white/20" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Hotels
              </Button>
            </Link>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-white font-semibold text-sm">{hotel.rating}</span>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              {hotel.name}
            </h1>
            <div className="flex items-center gap-2 text-white/90">
              <MapPin className="w-5 h-5" />
              <p className="text-lg">{hotel.location}</p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20 sm:py-28 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                  <Card className="p-6 border border-border bg-card">
                    <h2 className="text-2xl font-bold text-foreground mb-4">About</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {hotel.description}
                    </p>
                  </Card>

                  <Card className="p-6 border border-border bg-card">
                    <h2 className="text-2xl font-bold text-foreground mb-4">Location</h2>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-foreground">Address</p>
                          <p className="text-muted-foreground">{hotel.location}</p>
                        </div>
                      </div>
                      <div className="aspect-video rounded-lg overflow-hidden border border-border">
                        <iframe
                          src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.5!2d${hotel.coordinates[1]}!3d${hotel.coordinates[0]}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMCDQsDMxJzEyLjAiTiAzNcKwMTYnMTIuMCJF!5e0!3m2!1sen!2ske!4v1640000000000!5m2!1sen!2ske`}
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          className="w-full h-full"
                        />
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  <Card className="p-6 border border-border bg-card">
                    <h3 className="text-xl font-bold text-foreground mb-4">Quick Info</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                        <div>
                          <p className="font-semibold text-foreground">Rating</p>
                          <p className="text-muted-foreground">{hotel.rating} / 5.0</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-semibold text-foreground">Location</p>
                          <p className="text-muted-foreground text-sm">Eldoret, Kenya</p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 border border-border bg-card">
                    <h3 className="text-xl font-bold text-foreground mb-4">Contact</h3>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <a href="tel:+254740853372">
                          <Phone className="w-4 h-4 mr-2" />
                          Call Hotel
                        </a>
                      </Button>
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <a href="mailto:events@uasingishuchamber.co.ke">
                          <Mail className="w-4 h-4 mr-2" />
                          Email Inquiry
                        </a>
                      </Button>
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <a href="https://www.uasingishuchamber.co.ke" target="_blank" rel="noopener noreferrer">
                          <Globe className="w-4 h-4 mr-2" />
                          Visit Website
                        </a>
                      </Button>
                    </div>
                  </Card>

                  <Card className="p-6 border border-border bg-card bg-gradient-to-br from-primary/5 to-secondary/5">
                    <h3 className="text-xl font-bold text-foreground mb-4">Event Benefits</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Close to event venue</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Special rates for attendees</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Conference facilities available</span>
                      </li>
                    </ul>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
    </>
  );
}
