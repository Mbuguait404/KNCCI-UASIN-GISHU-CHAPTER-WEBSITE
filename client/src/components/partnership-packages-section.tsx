import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Plus, Minus } from "lucide-react";
import { type PartnershipPackage } from "@/data/partnership-data";
import { PartnershipModal } from "@/components/partnership-modal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const objectives = [
  {
    title: "Trade Facilitation Services",
    description: "We streamline trade processes, reduce barriers, and provide essential documentation support for cross-border commerce.",
  },
  {
    title: "Visibility and Credibility",
    description: "We enhance the visibility and credibility of our members in both local and international markets.",
  },
  {
    title: "Promotion of Foreign Direct Investments and Joint Ventures",
    description: "We promote foreign direct investments and facilitate joint ventures to drive economic growth.",
  },
  {
    title: "Promote Youth, Women and Persons with Disabilities Enterprise Development",
    description: "We champion enterprise development among youth, women, and persons with disabilities through targeted programs.",
  },
  {
    title: "Undertake Annual Budget and Tax Seminars",
    description: "We organize annual budget and tax seminars to keep businesses informed on fiscal policies and compliance.",
  },
  {
    title: "Informal Businesses Formalization",
    description: "We support informal businesses in transitioning to formal status, unlocking access to finance and government services.",
  },
  {
    title: "Trade and Industrial Policies Interventions",
    description: "We advocate for trade and industrial policies that create a conducive environment for business growth.",
  },
  {
    title: "Enterprise Development Support and Consulting Services",
    description: "We provide enterprise development support and consulting services to build capacity and enhance competitiveness.",
  },
  {
    title: "County Trade and Investment Services",
    description: "We promote investment opportunities within Uasin Gishu County and attract both local and foreign investors.",
  },
  {
    title: "Trade Disputes Settlement and Arbitration Services",
    description: "We offer trade dispute settlement and arbitration services to resolve business conflicts efficiently.",
  },
  {
    title: "Business Networking Services",
    description: "We create networking opportunities to connect businesses and foster strategic collaborations.",
  },
  {
    title: "Finance and Technical Support Services",
    description: "We provide finance and technical support services to help businesses scale and innovate.",
  },
  {
    title: "Trade and Investment Information Dissemination",
    description: "We disseminate trade and investment information to keep members informed of market opportunities.",
  },
  {
    title: "Government Representation",
    description: "We represent business interests to county and national government bodies, ensuring policies support private sector growth.",
  },
  {
    title: "Issuing Certificates of Origin",
    description: "We issue Certificates of Origin and other essential trade documentation to facilitate international trade.",
  },
];

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


      <div className="mt-16 max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            What We Offer
          </span>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mt-4 mb-6">
            Explore Our Objectives
          </h3>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-3">
          {objectives.map((objective, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-0 rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow"
            >
              <AccordionTrigger className="px-6 py-5 text-left hover:no-underline group [&>svg]:hidden">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded bg-slate-800 dark:bg-slate-200 flex items-center justify-center">
                    <Plus className="w-4 h-4 text-white dark:text-slate-800 group-data-[state=open]:hidden" />
                    <Minus className="w-4 h-4 text-white dark:text-slate-800 hidden group-data-[state=open]:block" />
                  </div>
                  <span className="text-base sm:text-lg font-semibold text-foreground">{objective.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-5 pl-[4.5rem]">
                <p className="text-muted-foreground leading-relaxed">{objective.description}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
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
