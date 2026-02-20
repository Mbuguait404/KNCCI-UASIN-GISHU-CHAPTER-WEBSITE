import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Presentation, LayoutGrid, UtensilsCrossed, Sparkles, ArrowRight, Building2, GraduationCap, Handshake, Mic, Users } from "lucide-react";
import { partnershipPackages, type PartnershipPackage } from "@/data/partnership-data";
import { PartnershipModal } from "@/components/partnership-modal";
import { cn } from "@/lib/utils";

export function PartnershipPackagesSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PartnershipPackage | null>(null);

  const openModal = (pkg: PartnershipPackage) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };

  return (
    <section
      id="partnership-packages"
      className="py-20 sm:py-28 bg-gradient-to-br from-primary/5 to-secondary/5"
      data-testid="section-partnership-packages"
    >


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


      {/* <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Partnership Opportunities
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 mt-4">
              Partnership Packages
            </h2>
            <p className="text-muted-foreground">
              All prices are in Kenyan Shillings (KES).{" "}
              <Link href="/partnership" className="text-primary hover:underline font-medium">
                View full details
              </Link>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Click a package to create a partnership request
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mb-12">
            {partnershipPackages.map((pkg) => (
              <Card
                key={pkg.tier}
                role="button"
                tabIndex={0}
                onClick={() => openModal(pkg)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openModal(pkg);
                  }
                }}
                className={cn(
                  "border-2 transition-all duration-300 overflow-hidden cursor-pointer h-full",
                  "bg-gradient-to-b from-background to-muted/30",
                  "hover:border-primary/40 hover:shadow-lg"
                )}
              >
                <div className={cn("h-1.5 w-full bg-gradient-to-r opacity-80", pkg.color)} />
                <CardHeader className="p-5 pb-3">
                  <Badge
                    className={`bg-gradient-to-br ${pkg.color} ${pkg.textColor} border-0 font-semibold shadow-sm w-fit`}
                  >
                    {pkg.tier}
                  </Badge>
                  <p className="text-2xl font-bold text-foreground mt-3 tracking-tight">{pkg.value}</p>
                  <p className="text-xs text-muted-foreground font-medium">KES</p>
                </CardHeader>
                <CardContent className="p-5 pt-0 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Presentation className="w-3.5 h-3.5 text-primary/70 flex-shrink-0" />
                    <span>{pkg.presentation}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <LayoutGrid className="w-3.5 h-3.5 text-primary/70 flex-shrink-0" />
                    <span>{pkg.exhibitionSpace} m</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <UtensilsCrossed className="w-3.5 h-3.5 text-primary/70 flex-shrink-0" />
                    <span>{pkg.dinnerCards}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Sparkles className="w-3.5 h-3.5 text-primary/70 flex-shrink-0" />
                    <span>{pkg.branding}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link href="/partnership">
              <Button size="lg" className="bg-primary text-primary-foreground gap-2">
                View Full Partnership Details
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div> */}

      <PartnershipModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        selectedPackage={selectedPackage}
      />
    </section>
  );
}
