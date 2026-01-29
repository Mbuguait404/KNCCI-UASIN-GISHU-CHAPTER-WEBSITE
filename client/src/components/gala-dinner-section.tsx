import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  Users,
  Ticket,
  Building2,
  Tag,
} from "lucide-react";
import { staticGalaDinner } from "@/data/static-data";

function formatPrice(currency: string, amount: number) {
  return `${currency} ${amount.toLocaleString()}`;
}

export function GalaDinnerSection() {
  const gala = staticGalaDinner;
  const savings = gala.priceNonMember - gala.priceMember;

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

          {/* Pricing – intuitive tier cards */}
          <div className="mb-16">
            <p className="text-center text-sm font-medium text-muted-foreground uppercase tracking-wider mb-6 flex items-center justify-center gap-2">
              <Tag className="w-4 h-4" />
              Gala dinner ticket
            </p>
            <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <Card
                className="relative overflow-hidden border-2 border-border bg-card hover:border-primary/30 hover-elevate transition-colors"
                data-testid="card-gala-non-member"
              >
                <div className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-muted mb-4">
                    <Ticket className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">General admission</p>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums">
                    {formatPrice(gala.currency, gala.priceNonMember)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">Non-members</p>
                </div>
              </Card>
              <Card
                className="relative overflow-hidden border-2 border-primary/50 bg-primary/5 hover:border-primary hover-elevate transition-colors"
                data-testid="card-gala-member"
              >
                <Badge
                  className="absolute top-3 right-3 bg-primary text-primary-foreground border-0 shadow-sm"
                  variant="secondary"
                >
                  Member rate
                </Badge>
                <div className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 mb-4">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-sm font-medium text-primary mb-1">KNCCI members</p>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums">
                    {formatPrice(gala.currency, gala.priceMember)}
                  </p>
                  <p className="text-xs text-secondary font-medium mt-2 flex items-center justify-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    Save {formatPrice(gala.currency, savings)}
                  </p>
                </div>
              </Card>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4 max-w-md mx-auto">
              One ticket per person. Show your KNCCI membership at registration to get the member rate.
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
