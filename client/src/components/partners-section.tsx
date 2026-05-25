import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const sponsors = [
  {
    id: 1,
    name: "Financial Sector Deepening Kenya",
    logoUrl:
      "https://www.kenyachamber.or.ke/wp-content/uploads/2019/09/partners-logos-fsd.jpg",
    website: "https://www.fsdkenya.org/",
  },
  {
    id: 2,
    name: "Council of Governors",
    logoUrl:
      "https://www.kenyachamber.or.ke/wp-content/uploads/2019/09/partners-logos-cog.jpg",
    website: "https://cog.go.ke/",
  },
  {
    id: 3,
    name: "Center for International Private Enterprise",
    logoUrl:
      "https://www.kenyachamber.or.ke/wp-content/uploads/2019/09/partners-logos-cipe.jpg",
    website: "https://www.cipe.org/",
  },
  {
    id: 4,
    name: "ETIMOS Foundation",
    logoUrl:
      "https://www.kenyachamber.or.ke/wp-content/uploads/2019/09/partners-logos-etimos.jpg",
  },
  {
    id: 5,
    name: "Business Advocacy Fund",
    logoUrl:
      "https://www.kenyachamber.or.ke/wp-content/uploads/2019/09/partners-logos-baf.jpg",
  },
  {
    id: 6,
    name: "International Finance Corporation",
    logoUrl:
      "https://www.kenyachamber.or.ke/wp-content/uploads/2019/09/partners-logos-wbg.jpg",
    website: "https://www.ifc.org/",
  },
  {
    id: 7,
    name: "United Nations Development Programme",
    logoUrl:
      "https://www.kenyachamber.or.ke/wp-content/uploads/2019/09/partners-logos-undp.jpg",
    website: "https://www.undp.org/",
  },
  {
    id: 8,
    name: "Kenya Revenue Authority",
    logoUrl:
      "https://www.kenyachamber.or.ke/wp-content/uploads/2019/09/partners-logos-kra.jpg",
    website: "https://www.kra.go.ke/",
  },
  {
    id: 9,
    name: "Kenya Bankers Association",
    logoUrl:
      "https://www.kenyachamber.or.ke/wp-content/uploads/2019/09/partners-logos-kba.jpg",
    website: "https://www.kba.co.ke/",
  },
  {
    id: 10,
    name: "Dubuy",
    logoUrl:
      "https://www.kenyachamber.or.ke/wp-content/uploads/2021/02/DUBUY.png",
  },
  {
    id: 11,
    name: "Amref Health Africa",
    logoUrl:
      "https://www.kenyachamber.or.ke/wp-content/uploads/2021/02/Amref-Logo.webp",
    website: "https://amref.org/",
  },
  {
    id: 12,
    name: "Sidian Bank",
    logoUrl:
      "https://www.kenyachamber.or.ke/wp-content/uploads/2021/02/sidianbank.png",
    website: "https://sidianbank.co.ke/",
  },
  {
    id: 13,
    name: "Egyptian Exporters Association",
    logoUrl:
      "https://www.kenyachamber.or.ke/wp-content/uploads/2021/02/EGYPTIAN-EXPORTERS-ASSOCIATION.gif",
  },
  {
    id: 14,
    name: "French Chamber of Commerce",
    logoUrl:
      "https://www.kenyachamber.or.ke/wp-content/uploads/2021/02/FRENCH-CHAMBER-OF-COMMERCE.jpg",
  },
  {
    id: 15,
    name: "UNHCR",
    logoUrl:
      "https://www.kenyachamber.or.ke/wp-content/uploads/2021/02/UNHCR.png",
    website: "https://www.unhcr.org/",
  },
  {
    id: 16,
    name: "Ethiad Credit Insurance",
    logoUrl:
      "https://www.kenyachamber.or.ke/wp-content/uploads/2021/02/ETIHAD-CREDIT-INSURANCE.jpg",
  },
  {
    id: 17,
    name: "Chambre de Commerce Rabat",
    logoUrl:
      "https://www.kenyachamber.or.ke/wp-content/uploads/2021/02/Chambre-de-Commerce-dIndustrie-et-de-Services-de-la-region-de-Rabat.jpg",
  },
  {
    id: 18,
    name: "Algerian Chamber of Commerce",
    logoUrl:
      "https://www.kenyachamber.or.ke/wp-content/uploads/2021/02/Algerian-Chamber-of-Commerce-and-Industry.jpg",
  },
  {
    id: 19,
    name: "Eldobase Chemists Ltd",
    logoUrl: "/sponsors/eldobase.png",
    website: "https://www.eldobase.co.ke/",
  },
  {
    id: 20,
    name: "The Cube Innovation Hub",
    logoUrl: "/sponsors/the-cube.png",
    website: "https://the-cube.co.ke/",
  },
  {
    id: 21,
    name: "The Grand Empire Hotel",
    logoUrl: "/sponsors/grand-empire-hotel.png",
    website: "https://www.thegrandempirehotel.co.ke/",
  },
];

function SponsorLogo({ sponsor }: { sponsor: (typeof sponsors)[number] }) {
  const initials = sponsor.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 3);
  const Card = sponsor.website ? "a" : "div";

  return (
    <Card
      className="group relative flex min-h-[130px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-border/30 bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_18px_34px_rgba(236,37,44,0.14)]"
      data-testid={`card-sponsor-${sponsor.id}`}
      {...(sponsor.website
        ? ({
            href: sponsor.website,
            target: "_blank",
            rel: "noopener noreferrer",
          } as any)
        : {})}
    >
      <div className="flex flex-col items-center gap-2 w-full">
        <div className="relative h-14 w-full max-w-[130px] flex items-center justify-center">
          <img
            src={sponsor.logoUrl}
            alt={sponsor.name}
            className="max-h-full max-w-full object-contain opacity-75 grayscale transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
            loading="lazy"
          />
        </div>
        <p className="text-center text-[10px] font-medium text-muted-foreground leading-tight line-clamp-2 transition-colors group-hover:text-foreground">
          {sponsor.name}
        </p>
      </div>
    </Card>
  );
}

export function PartnersSection() {
  return (
    <section
      id="partners"
      className="py-20 sm:py-28 bg-background"
      data-testid="section-partners"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          {/* <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Our Partners
          </span> */}
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6"
            data-testid="text-partners-title"
          >
            Trusted by Leading Organizations
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We are proud to be supported by these distinguished organizations
            that share our vision for Kenya's economic growth.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 max-w-6xl mx-auto">
          {sponsors.map((sponsor) => (
            <SponsorLogo key={sponsor.id} sponsor={sponsor} />
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-6">
            Interested in becoming a partner or sponsor?
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground"
                data-testid="button-become-partner"
              >
                Become a Partner
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
