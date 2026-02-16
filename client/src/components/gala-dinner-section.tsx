import { Card } from "@/components/ui/card";
import {
  Award,
  Users,
  Ticket,
  Tag,
} from "lucide-react";
import { staticGalaDinner } from "@/data/static-data";
import { useRegistration } from "@/contexts/registration-context";

function formatPrice(currency: string, amount: number) {
  return `${currency} ${amount.toLocaleString()}`;
}

export function GalaDinnerSection() {
  const gala = staticGalaDinner;
  const { openRegistration } = useRegistration();

  return (
    <section
      id="gala-dinner"
      className="py-20 sm:py-28 bg-gradient-to-br from-slate-900/5 via-background to-slate-900/5 dark:from-slate-900/20 dark:to-slate-900/20"
      data-testid="section-gala-dinner"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Exclusive Evening
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6" data-testid="text-gala-title">
              {gala.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
              {gala.subtitle}
            </p>
            <p className="text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              {gala.description}
            </p>
          </div>

          {/* Pricing – ticket options */}
          <div className="mb-16">
            <p className="text-center text-sm font-medium text-muted-foreground uppercase tracking-wider mb-6 flex items-center justify-center gap-2">
              <Tag className="w-4 h-4" />
              Gala dinner ticket
            </p>
            <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {gala.pricingTiers.map((tier, index) => (
                <Card
                  key={index}
                  className="relative overflow-hidden border-2 border-primary/50 bg-primary/5 hover:border-primary hover-elevate transition-colors cursor-pointer"
                  data-testid={`card-gala-ticket-${index}`}
                  onClick={openRegistration}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openRegistration();
                    }
                  }}
                >
                  <div className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 mb-4">
                      <Ticket className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-primary mb-1">{tier.label}</p>
                    <p className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums">
                      {formatPrice(gala.currency, tier.price)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">Per person</p>
                  </div>
                </Card>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4 max-w-md mx-auto">
              One ticket per person. Book early to lock in the early bird rate.
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-foreground mb-6 text-center flex items-center justify-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Evening Highlights
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {gala.highlights.map((highlight, index) => (
                <Card
                  key={index}
                  className="p-4 border border-border bg-card hover-elevate flex items-start gap-3"
                  data-testid={`card-gala-highlight-${index}`}
                >
                  <Users className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">{highlight}</p>
                </Card>
              ))}
            </div>
          </div>

          <Card className="p-6 bg-primary/5 border-primary/20 text-center">
            <p className="text-foreground font-medium">
              Add a gala ticket when you register for the summit. Sponsor tiers (Platinum, Gold, Silver) include reserved corporate tables—contact us for table bookings.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}
