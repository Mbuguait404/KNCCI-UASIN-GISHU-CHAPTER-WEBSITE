import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check, TrendingUp, Users, Mic, Building2 } from "lucide-react";
import { Link } from "wouter";
import { SEOHead } from "@/components/seo/seo-head";
import { Helmet } from "react-helmet-async";

const partnershipPackages = [
  {
    tier: "Platinum",
    value: "2,000,000",
    presentation: "45-Min",
    exhibitionSpace: "12×3",
    dinnerCards: "5 (Corp Table)",
    branding: "Unlimited",
    color: "from-slate-300 to-slate-100",
    textColor: "text-slate-700 dark:text-slate-800",
  },
  {
    tier: "Gold",
    value: "1,000,000",
    presentation: "25-Min",
    exhibitionSpace: "9×3",
    dinnerCards: "3 (Corp Table)",
    branding: "Limited",
    color: "from-amber-300 to-amber-100",
    textColor: "text-amber-700 dark:text-amber-800",
  },
  {
    tier: "Silver",
    value: "500,000",
    presentation: "10-Min",
    exhibitionSpace: "6×3",
    dinnerCards: "1 (Corp Table)",
    branding: "Limited",
    color: "from-gray-300 to-gray-100",
    textColor: "text-gray-700 dark:text-gray-800",
  },
  {
    tier: "Bronze",
    value: "250,000",
    presentation: "5-Min",
    exhibitionSpace: "3×3",
    dinnerCards: "5 Cards",
    branding: "Minimum",
    color: "from-orange-300 to-orange-100",
    textColor: "text-orange-700 dark:text-orange-800",
  },
  {
    tier: "Brass",
    value: "100,000",
    presentation: "N/A",
    exhibitionSpace: "3×3",
    dinnerCards: "3 Cards",
    branding: "Minimum",
    color: "from-yellow-300 to-yellow-100",
    textColor: "text-yellow-700 dark:text-yellow-800",
  },
];

const benefits = [
  {
    icon: TrendingUp,
    title: "Brand Visibility & Media Exposure",
    items: [
      "Brand Enhancement: Packages are tailored to enhance brand visibility through media coverage ranging from 'Basic' to 'High' depending on the tier",
      "Branding Opportunities: Sponsors receive branding opportunities at the venue, ranging from 'Minimum' for lower tiers to 'Unlimited' for Platinum sponsors",
      "Recognition: Partners are recognized by the Master of Ceremony during the event",
      "Amplified Visibility: The event promises amplified visibility for participating businesses, targeting over 10,000 visitors",
    ],
  },
  {
    icon: Mic,
    title: "Direct Engagement & Thought Leadership",
    items: [
      "Speaking Opportunities: Sponsors can present directly to the audience. Presentation slots range from 5 minutes (Bronze) to 45 minutes (Platinum)",
      "Exhibition Space: Partners are allocated specific display areas to showcase products and solutions. Spaces range from 3×3 meters to 12×3 meters",
    ],
  },
  {
    icon: Users,
    title: "Exclusive Networking & Access",
    items: [
      "Gala Dinner & Cocktail Access: Sponsors receive entry to exclusive side events, the Gala Dinner, and the Cocktail party",
      "Platinum: Corporate dinner table for 10",
      "Gold: Corporate dinner table for 8",
      "Silver/Bronze/Brass: Specific number of dinner cards (1 to 5)",
      "High-Level Connections: The summit attracts diverse stakeholders, including International Delegates, Policy Makers, Principal Secretaries, Ambassadors, and County Governments, facilitating high-level B2B networking",
    ],
  },
  {
    icon: Building2,
    title: "Strategic Business Benefits",
    items: [
      "KNCCI Membership: Platinum, Gold, Silver, and Bronze packages include membership to the Kenya National Chamber of Commerce and Industry (KNCCI)",
      "Investment Leads: The event is designed to help identify key investment prospects and potential partnerships within Eldoret's growing economy",
      "Policy Influence: Partners can participate in dialogue with policymakers to help shape an enabling business environment",
    ],
  },
];

export default function Partnership() {
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
  const pageUrl = `${siteUrl}/partnership`;

  // Partnership packages schema
  const offersSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Partnership Packages - Eldoret International Business Summit 2026",
    description: "Choose from Platinum, Gold, Silver, Bronze, and Brass partnership packages for The Eldoret International Business Summit 2026",
    itemListElement: partnershipPackages.map((pkg, index) => ({
      "@type": "Offer",
      position: index + 1,
      name: `${pkg.tier} Partnership Package`,
      description: `Partnership package including ${pkg.presentation} presentation, ${pkg.exhibitionSpace} exhibition space, ${pkg.dinnerCards} dinner cards, and ${pkg.branding} branding opportunities`,
      price: pkg.value.replace(/,/g, ""),
      priceCurrency: "KES",
      availability: "https://schema.org/InStock",
      category: "Business Partnership",
    })),
  };

  return (
    <>
      <SEOHead
        title="Partnership Opportunities - Eldoret International Business Summit 2026"
        description="Become a partner or sponsor of The Eldoret International Business Summit 2026. Choose from Platinum, Gold, Silver, Bronze, or Brass packages. Enhance your brand visibility, engage with business leaders, and access exclusive networking opportunities."
        keywords={[
          "Business Partnership Kenya",
          "Event Sponsorship Eldoret",
          "KNCCI Partnership",
          "Business Summit Sponsorship",
          "Corporate Partnership Kenya",
          "Event Sponsorship Packages",
        ]}
        canonicalUrl={pageUrl}
        type="website"
      />
      <Helmet>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(offersSchema) }}
        />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main>
        <section className="py-20 sm:py-28 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                Partnership Opportunities
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
                Become a Partner
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Join us in shaping the future of business in Eldoret and beyond. Choose a partnership package that aligns with your business goals.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-28 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  Partnership Packages
                </h2>
                <p className="text-muted-foreground">
                  All prices are in Kenyan Shillings (KES)
                </p>
              </div>

              <div className="overflow-x-auto mb-12">
                <Card className="border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-semibold">Package</TableHead>
                        <TableHead className="font-semibold">Value (KES)</TableHead>
                        <TableHead className="font-semibold">Presentation</TableHead>
                        <TableHead className="font-semibold">Exhibition Space</TableHead>
                        <TableHead className="font-semibold">Dinner Cards</TableHead>
                        <TableHead className="font-semibold">Branding</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {partnershipPackages.map((pkg) => (
                        <TableRow key={pkg.tier}>
                          <TableCell>
                            <Badge className={`bg-gradient-to-br ${pkg.color} ${pkg.textColor} border-0 font-semibold`}>
                              {pkg.tier}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-semibold">{pkg.value}</TableCell>
                          <TableCell>{pkg.presentation}</TableCell>
                          <TableCell>{pkg.exhibitionSpace}</TableCell>
                          <TableCell>{pkg.dinnerCards}</TableCell>
                          <TableCell>{pkg.branding}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </div>

              <div className="text-center mb-12">
                <Link href="#footer">
                  <Button size="lg" className="bg-primary text-primary-foreground" data-testid="button-contact">
                    Contact Us to Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-28 bg-accent/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                  Why Partner With Us
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mt-4 mb-6">
                  Benefits of Partnership
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                  Becoming a partner or sponsor offers benefits designed to increase visibility, foster connections, and provide direct business engagement.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {benefits.map((benefit, index) => (
                  <Card key={index} className="p-6 border border-border bg-card hover-elevate">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <benefit.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-foreground mb-4">
                          {benefit.title}
                        </h3>
                        <ul className="space-y-3">
                          {benefit.items.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center mt-0.5">
                                <Check className="w-3 h-3 text-secondary" />
                              </div>
                              <span className="text-sm text-muted-foreground leading-relaxed">
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                ))}
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
