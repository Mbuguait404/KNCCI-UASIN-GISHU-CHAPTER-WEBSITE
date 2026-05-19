import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { SellerApplyDialog } from "@/components/seller-apply-dialog";
import { ShoppingBag, Store, Users, TrendingUp, Globe, ShieldCheck, ArrowRight, Check } from "lucide-react";

const marketplaceBenefits = [
  {
    icon: Store,
    title: "Showcase Your Business",
    description: "Create a verified business profile and showcase your products and services to thousands of potential buyers.",
  },
  {
    icon: Users,
    title: "Connect With Buyers",
    description: "Access a curated network of verified businesses, suppliers, and customers actively looking for what you offer.",
  },
  {
    icon: TrendingUp,
    title: "Grow Your Revenue",
    description: "Expand your market reach beyond Uasin Gishu with tools designed to drive sales and increase visibility.",
  },
  {
    icon: Globe,
    title: "Local & Global Reach",
    description: "Tap into both local county markets and international trade opportunities through our marketplace platform.",
  },
  {
    icon: ShieldCheck,
    title: "Verified & Trusted",
    description: "All marketplace participants are KNCCI-verified members, ensuring trust and credibility in every transaction.",
  },
  {
    icon: ShoppingBag,
    title: "One-Stop Business Hub",
    description: "From products to services, find everything your business needs in one centralized digital marketplace.",
  },
];

export function MarketplaceSection() {
  const [isSellerDialogOpen, setIsSellerDialogOpen] = useState(false);

  return (
    <section id="marketplace" className="py-20 sm:py-28 bg-slate-50 dark:bg-slate-900/40 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/4" />
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 translate-x-1/4" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-bold text-sm uppercase tracking-widest block mb-4"
          >
            Digital Commerce
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold mb-6 tracking-tight text-foreground"
          >
            KNCCI <span className="text-primary">Marketplace</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto"
          >
            Discover Kenya's premier business marketplace connecting verified sellers with ready buyers. 
            Whether you're looking to showcase your products, find trusted suppliers, or expand your customer base — 
            the KNCCI Marketplace is your gateway to limitless business opportunities.
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16"
        >
          <Card className="p-8 border-2 border-border bg-card relative overflow-hidden">
            <div className="relative z-10">
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                For Members
              </div>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold text-foreground">KES 20,000</span>
                <span className="text-muted-foreground">/year</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Full marketplace access exclusively for KNCCI members. List unlimited products and services.
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  "Unlimited product listings",
                  "Verified business badge",
                  "Priority search placement",
                  "Access to buyer leads",
                  "Member-only networking events",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/profile">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Get Started <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="p-8 border-2 border-primary bg-card relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
              NON-MEMBER
            </div>
            <div className="relative z-10">
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                For Non-Members
              </div>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold text-foreground">KES 30,000</span>
                <span className="text-muted-foreground">/year</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Marketplace access for non-members. List your products and connect with our business community.
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  "Up to 50 product listings",
                  "Standard business profile",
                  "Search visibility",
                  "Basic analytics dashboard",
                  "Email support",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={() => setIsSellerDialogOpen(true)}
              >
                Apply as Seller <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {marketplaceBenefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full p-6 hover:shadow-xl transition-all duration-300 border-border bg-card group hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <SellerApplyDialog isOpen={isSellerDialogOpen} onOpenChange={setIsSellerDialogOpen} />
    </section>
  );
}
