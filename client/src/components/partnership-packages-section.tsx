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
    title: "Economic Diplomacy",
    description: "We engage in economic diplomacy to foster international trade relations and create favorable business environments for our members.",
  },
  {
    title: "Government Representation",
    description: "We represent business interests to county and national government bodies, ensuring policies support private sector growth.",
  },
  {
    title: "Export Promotion Activities",
    description: "We organize initiatives to help local businesses access international markets and expand their export capabilities.",
  },
  {
    title: "Trade Facilitation",
    description: "We streamline trade processes, reduce barriers, and provide essential documentation support for cross-border commerce.",
  },
  {
    title: "County Trade Investment",
    description: "We promote investment opportunities within Uasin Gishu County and attract both local and foreign investors.",
  },
  {
    title: "Business Information Services",
    description: "We provide timely market intelligence, industry reports, and business data to support informed decision-making.",
  },
  {
    title: "Internal Trade Promotion",
    description: "We champion local trade by connecting businesses within the county and promoting intra-regional commerce.",
  },
  {
    title: "Training and Consultancy",
    description: "We offer specialized training programs and consultancy services to build capacity and enhance business competitiveness.",
  },
  {
    title: "Business Forums/Events",
    description: "We host forums, exhibitions, and networking events to create platforms for business collaboration and knowledge sharing.",
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
                  <span className="text-lg font-semibold text-foreground">{objective.title}</span>
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
