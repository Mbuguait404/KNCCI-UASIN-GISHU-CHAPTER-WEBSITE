import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Users, Shield } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

const tableData = [
  { package: "Standard Booth", memberPrice: "KES 30,000", nonMemberPrice: "KES 40,000" },
  { package: "Corner Booth", memberPrice: "KES 35,000", nonMemberPrice: "KES 45,000" },
];

export function ExhibitionRatesSection() {
  return (
    <section
      id="exhibition"
      className="py-20 sm:py-28 bg-gradient-to-br from-primary/5 to-secondary/5"
      data-testid="section-exhibition"
    >
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          className="max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Exhibition Opportunities
          </span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6"
            data-testid="text-exhibition-title"
          >
            Exhibition Rates
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Showcase your products and services to thousands of business leaders, government
            officials, and decision-makers at the Eldoret International Business Summit 2026.
          </p>
        </motion.div>

        {/* Pricing Table */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="border border-border overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-3 bg-muted/50 border-b border-border">
              <div className="px-6 py-5 text-left font-bold text-lg text-foreground border-r border-border">
                Package
              </div>
              <div className="px-6 py-5 text-center font-bold text-lg border-r border-border flex flex-col items-center">
                <div className="flex items-center gap-2 text-primary">
                  <Shield className="h-5 w-5" />
                  <span>KNCCI Member</span>
                </div>
                <span className="text-xs font-normal text-muted-foreground mt-1">Exclusive pricing</span>
              </div>
              <div className="px-6 py-5 text-center font-bold text-lg flex flex-col items-center">
                <div className="flex items-center gap-2 text-foreground">
                  <Users className="h-5 w-5 text-secondary" />
                  <span>Non-Member</span>
                </div>
                <span className="text-xs font-normal text-muted-foreground mt-1">Standard rates</span>
              </div>
            </div>

            {/* Table Body */}
            {tableData.map((row, index) => (
              <div
                key={index}
                className={`grid grid-cols-3 bg-card ${
                  index !== tableData.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className="px-6 py-6 text-left border-r border-border">
                  <span className="font-semibold text-foreground text-lg">{row.package}</span>
                </div>
                <div className="px-6 py-6 text-center border-r border-border bg-primary/5">
                  <span className="text-2xl sm:text-3xl font-bold text-primary">
                    {row.memberPrice}
                  </span>
                </div>
                <div className="px-6 py-6 text-center bg-muted/30">
                  <span className="text-2xl sm:text-3xl font-bold text-foreground">
                    {row.nonMemberPrice}
                  </span>
                </div>
              </div>
            ))}
          </Card>

          {/* Table Note */}
          <p className="text-center text-muted-foreground text-sm mt-4">
            All prices include standard 3x3m exhibition booth space and listed amenities
          </p>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="inline-block p-10 sm:p-14 border border-border bg-card max-w-3xl">
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Ready to Exhibit?
            </h3>
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
              Secure your exhibition space today and connect with thousands of potential customers
              at Kenya&apos;s premier business summit!
            </p>
            <Link href="/exhibition-booking">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30"
                data-testid="button-book-exhibition"
              >
                Request Exhibition Space
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
