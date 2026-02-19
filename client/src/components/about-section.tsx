import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Building2, Mic, Users, Handshake, UtensilsCrossed, GraduationCap, Download } from "lucide-react";
import { staticEvent } from "@/data/static-data";

export function AboutSection() {
  const event = staticEvent;

  return (
    <section
      id="about"
      className="py-20 sm:py-28 bg-background"
      data-testid="section-about"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            About Us
          </span>
          {event && (
            <>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6" data-testid="text-about-title">
                {event.name}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed" data-testid="text-about-description">
                {event.description}
              </p>
              <Button
                variant="outline"
                size="lg"
                className="gap-2.5 mt-6 border-primary bg-primary/5 hover:border-primary/40 hover:bg-transparent transition-colors shadow-sm"
                asChild
              >
                <a href="/kncci%20concept%20note.pptx" download="KNCCI Concept Note.pptx">
                  <Download className="w-4 h-4" />
                  Download Concept Note
                </a>
              </Button>
            </>
          )}
        </div>

        <div className="mt-16 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              What We Offer
            </span>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mt-4 mb-6">
              Explore Our Objectives
            </h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 border border-border bg-card hover-elevate">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">Advocacy</h4>
                  <p className="text-sm text-muted-foreground">We advocate for business-friendly policies to enhance growth and economic development.</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border border-border bg-card hover-elevate">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Mic className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">Business Support Services</h4>
                  <p className="text-sm text-muted-foreground">We offer support services to help businesses grow and achieve their objectives.</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border border-border bg-card hover-elevate">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-chart-4/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-chart-4" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">Training & Capacity Building</h4>
                  <p className="text-sm text-muted-foreground">We provide training programs to enhance skills and business competitiveness.</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border border-border bg-card hover-elevate">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-chart-3/10 flex items-center justify-center">
                  <Handshake className="w-6 h-6 text-chart-3" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">Networking Sessions</h4>
                  <p className="text-sm text-muted-foreground">Opportunities to forge collaborations.</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border border-border bg-card hover-elevate">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-chart-1/10 flex items-center justify-center">
                  <UtensilsCrossed className="w-6 h-6 text-chart-1" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">Networking Opportunitiesr</h4>
                  <p className="text-sm text-muted-foreground">We create networking opportunities to connect businesses and foster collaborations.</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border border-border bg-card hover-elevate">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">Trade Promotion</h4>
                  <p className="text-sm text-muted-foreground">We promote trade locally and internationally to boost business success.</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="p-8 bg-gradient-to-br from-card to-accent/30 border border-border">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Why Join Us?
                </h3>
                {event?.highlights && (
                  <ul className="space-y-3">
                    {event.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-center gap-3" data-testid={`reason-${index}`}>
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                          <Check className="w-3 h-3 text-secondary-foreground" />
                        </div>
                        <span className="text-foreground">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="relative">
                {event?.stats && (
                  <div className="rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 border border-border p-6">
                    <h4 className="text-lg font-semibold text-foreground mb-4 text-center">Our Reach & Impact</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {event.stats.visitors && (
                        <div className="text-center">
                          <div className="text-2xl sm:text-3xl font-bold text-foreground" data-testid="stat-visitors">{event.stats.visitors}</div>
                          <div className="text-xs sm:text-sm text-muted-foreground mt-1">Active Members</div>
                        </div>
                      )}
                      {event.stats.exhibitors && (
                        <div className="text-center">
                          <div className="text-2xl sm:text-3xl font-bold text-primary" data-testid="stat-exhibitors">{event.stats.exhibitors}</div>
                          <div className="text-xs sm:text-sm text-muted-foreground mt-1">KNCCI Chapters</div>
                        </div>
                      )}
                      {event.stats.delegates && (
                        <div className="text-center">
                          <div className="text-2xl sm:text-3xl font-bold text-secondary" data-testid="stat-delegates">{event.stats.delegates}</div>
                          <div className="text-xs sm:text-sm text-muted-foreground mt-1">Strategic Partners</div>
                        </div>
                      )}
                      {event.stats.participatingNations && (
                        <div className="text-center">
                          <div className="text-2xl sm:text-3xl font-bold text-chart-4" data-testid="stat-nations">{event.stats.participatingNations}</div>
                          <div className="text-xs sm:text-sm text-muted-foreground mt-1">Sectors Represented</div>
                        </div>
                      )}
                      {event.stats.speakers && (
                        <div className="text-center">
                          <div className="text-2xl sm:text-3xl font-bold text-chart-3" data-testid="stat-speakers">{event.stats.speakers}</div>
                          <div className="text-xs sm:text-sm text-muted-foreground mt-1">Business Mentors</div>
                        </div>
                      )}
                      {event.stats.sessions && (
                        <div className="text-center">
                          <div className="text-2xl sm:text-3xl font-bold text-chart-1" data-testid="stat-sessions">{event.stats.sessions}</div>
                          <div className="text-xs sm:text-sm text-muted-foreground mt-1">Years of Excellence</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
