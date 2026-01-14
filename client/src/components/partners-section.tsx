import { staticPartners } from "@/data/static-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import type { Partner } from "@shared/schema";

const tierColors = {
  platinum: "from-slate-300 to-slate-100",
  gold: "from-amber-300 to-amber-100",
  silver: "from-gray-300 to-gray-100",
  bronze: "from-orange-300 to-orange-100",
};

const tierLabels = {
  platinum: "Platinum Partners",
  gold: "Gold Partners",
  silver: "Silver Partners",
  bronze: "Bronze Partners",
};

function PartnerLogo({ partner }: { partner: Partner }) {
  const initials = partner.name.split(" ").map(w => w[0]).join("").slice(0, 3);
  
  return (
    <Card
      className="group p-6 border border-border bg-card hover-elevate flex items-center justify-center aspect-video"
      data-testid={`card-partner-${partner.id}`}
    >
      <div className={`w-full h-full rounded-md bg-gradient-to-br ${tierColors[partner.tier]} opacity-50 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center`}>
        <span className="text-2xl font-bold text-slate-700 dark:text-slate-800" data-testid={`text-partner-initials-${partner.id}`}>
          {initials}
        </span>
      </div>
    </Card>
  );
}


export function PartnersSection() {
  const partners = staticPartners;

  const tiers = ["platinum", "gold", "silver", "bronze"] as const;

  return (
    <section
      id="partners"
      className="py-20 sm:py-28 bg-background"
      data-testid="section-partners"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Our Partners
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6" data-testid="text-partners-title">
            Partnering for Success
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We are grateful to our partners and sponsors whose support makes this 
            event possible and drives Kenya's business community forward.
          </p>
        </div>

        <>
            {tiers.map((tier) => {
              const tierPartners = partners.filter(p => p.tier === tier);
              if (tierPartners.length === 0) return null;
              
              return (
                <div key={tier} className="mb-12" data-testid={`tier-${tier}`}>
                  <h3 className="text-center text-lg font-semibold text-muted-foreground mb-6 uppercase tracking-wider" data-testid={`text-tier-label-${tier}`}>
                    {tierLabels[tier]}
                  </h3>
                  <div className={`grid gap-6 max-w-5xl mx-auto ${
                    tier === "platinum" 
                      ? "grid-cols-2 md:grid-cols-2" 
                      : tier === "gold"
                        ? "grid-cols-2 md:grid-cols-3"
                        : "grid-cols-2 md:grid-cols-4"
                  }`}>
                    {tierPartners.map((partner) => (
                      <PartnerLogo key={partner.id} partner={partner} />
                    ))}
                  </div>
                </div>
              );
            })}
        </>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-6">
            Interested in becoming a partner or sponsor?
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/partnership">
              <Button size="lg" className="bg-primary text-primary-foreground" data-testid="button-become-partner">
                Become a Partner
              </Button>
            </Link>
            <a
              href="#footer"
              className="text-primary font-semibold hover:underline"
              data-testid="link-partnership"
            >
              Contact us for partnership opportunities
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
