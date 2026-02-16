import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { insertSponsorRequestSchema, type InsertSponsorRequest } from "@shared/schema";
import { cn } from "@/lib/utils";
import { Check, TrendingUp, Users, Mic, Building2, Loader2, Send, CheckCircle2, CreditCard, Smartphone, Copy, Presentation, LayoutGrid, UtensilsCrossed, Sparkles } from "lucide-react";
import { SEOHead } from "@/components/seo/seo-head";
import { Helmet } from "react-helmet-async";
import { RegistrationDialog } from "@/components/registration-dialog";
import { useRegistration } from "@/contexts/registration-context";
import { staticEvent } from "@/data/static-data";
import { partnershipPackages } from "@/data/partnership-data";

const benefits = [
  {
    icon: TrendingUp,
    title: "Brand Visibility & Media Exposure",
    items: [
      "Brand Enhancement: Packages are tailored to enhance brand visibility through media coverage ranging from 'Basic' to 'High' depending on the tier",
      "Branding Opportunities: Sponsors receive branding opportunities at the venue, ranging from 'Minimum' for lower tiers to 'Unlimited' for Platinum sponsors",
      "Recognition: Partners are recognized by the Master of Ceremony during the event",
      "Amplified Visibility: The event promises amplified visibility for participating businesses, targeting over 10,000 visitors",
    ],
  },
  {
    icon: Mic,
    title: "Direct Engagement & Thought Leadership",
    items: [
      "Speaking Opportunities: Sponsors can present directly to the audience. Presentation slots range from 5 minutes (Bronze) to 45 minutes (Platinum)",
      "Exhibition Space: Partners are allocated specific display areas to showcase products and solutions. Spaces range from 3×3 meters to 12×3 meters",
    ],
  },
  {
    icon: Users,
    title: "Exclusive Networking & Access",
    items: [
      "Gala Dinner & Cocktail Access: Sponsors receive entry to exclusive side events, the Gala Dinner, and the Cocktail party",
      "Platinum: Corporate dinner table for 10",
      "Gold: Corporate dinner table for 8",
      "Silver/Bronze/Brass: Specific number of dinner cards (1 to 5)",
      "High-Level Connections: The summit attracts diverse stakeholders, including International Delegates, Policy Makers, Principal Secretaries, Ambassadors, and County Governments, facilitating high-level B2B networking",
    ],
  },
  {
    icon: Building2,
    title: "Strategic Business Benefits",
    items: [
      "KNCCI Membership: Platinum, Gold, Silver, and Bronze packages include membership to the Kenya National Chamber of Commerce and Industry (KNCCI)",
      "Investment Leads: The event is designed to help identify key investment prospects and potential partnerships within Eldoret's growing economy",
      "Policy Influence: Partners can participate in dialogue with policymakers to help shape an enabling business environment",
    ],
  },
];

const TIER_OPTIONS = ["Platinum", "Gold", "Silver", "Bronze", "Brass"] as const;

export default function Partnership() {
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
  const pageUrl = `${siteUrl}/partnership`;
  const { toast } = useToast();
  const { isOpen, closeRegistration } = useRegistration();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sponsorForm = useForm<InsertSponsorRequest>({
    resolver: zodResolver(insertSponsorRequestSchema),
    defaultValues: {
      organization: "",
      contactName: "",
      email: "",
      phone: "",
      tier: undefined,
      message: "",
    },
  });

  const sponsorMutation = useMutation({
    mutationFn: async (data: InsertSponsorRequest) => {
      return apiRequest("POST", "/api/sponsor-requests", data);
    },
    onSuccess: () => {
      toast({
        title: "Request submitted",
        description: "Thank you for your interest in becoming a sponsor. We will contact you shortly.",
      });
      sponsorForm.reset();
      setSelectedTier(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Submission failed",
        description: error.message || "Please try again or contact us directly.",
        variant: "destructive",
      });
    },
  });

  const onSponsorSubmit = (data: InsertSponsorRequest) => {
    sponsorMutation.mutate(data);
  };

  const selectPackage = (tier: string) => {
    const newSelection = selectedTier === tier ? null : tier;
    setSelectedTier(newSelection);
    sponsorForm.setValue("tier", newSelection ? (newSelection as InsertSponsorRequest["tier"]) : undefined);
    if (newSelection) {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Partnership packages schema
  const offersSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Partnership Packages - Eldoret International Business Summit 2026",
    description: "Choose from Platinum, Gold, Silver, Bronze, and Brass partnership packages for The Eldoret International Business Summit 2026",
    itemListElement: partnershipPackages.map((pkg, index) => ({
      "@type": "Offer",
      position: index + 1,
      name: `${pkg.tier} Partnership Package`,
      description: pkg.description ?? `Partnership package including ${pkg.presentation} presentation, ${pkg.exhibitionSpace} exhibition space, ${pkg.dinnerCards} dinner cards, and ${pkg.branding} branding opportunities`,
      price: pkg.value.replace(/,/g, ""),
      priceCurrency: "KES",
      availability: "https://schema.org/InStock",
      category: "Business Partnership",
    })),
  };

  return (
    <>
      <SEOHead
        title="Partnership Opportunities - Eldoret International Business Summit 2026"
        description="Become a partner or sponsor of The Eldoret International Business Summit 2026. Choose from Platinum, Gold, Silver, Bronze, or Brass packages. Enhance your brand visibility, engage with business leaders, and access exclusive networking opportunities."
        keywords={[
          "Business Partnership Kenya",
          "Event Sponsorship Eldoret",
          "KNCCI Partnership",
          "Business Summit Sponsorship",
          "Corporate Partnership Kenya",
          "Event Sponsorship Packages",
        ]}
        canonicalUrl={pageUrl}
        type="website"
      />
      <Helmet>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(offersSchema) }}
        />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main>
        <section className="py-20 sm:py-28 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                Partnership Opportunities
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
                Become a Partner
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Join us in shaping the future of business in Eldoret and beyond. Choose a partnership package that aligns with your business goals.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-28 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  Partnership Packages
                </h2>
                <p className="text-muted-foreground">
                  All prices are in Kenyan Shillings (KES)
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Click a package to select and view details
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mb-12">
                {partnershipPackages.map((pkg) => {
                  const isSelected = selectedTier === pkg.tier;
                  return (
                    <Card
                      key={pkg.tier}
                      className={cn(
                        "cursor-pointer border-2 transition-all duration-300 hover-elevate overflow-hidden",
                        "bg-gradient-to-b from-background to-muted/30",
                        "hover:border-primary/40 hover:shadow-lg",
                        isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background border-primary shadow-lg"
                      )}
                      onClick={() => selectPackage(pkg.tier)}
                    >
                      <div className={cn(
                        "h-1.5 w-full bg-gradient-to-r opacity-80",
                        pkg.color
                      )} />
                      <CardHeader className="p-5 pb-3">
                        <div className="flex items-center justify-between gap-2">
                          <Badge className={`bg-gradient-to-br ${pkg.color} ${pkg.textColor} border-0 font-semibold shadow-sm`}>
                            {pkg.tier}
                          </Badge>
                          {isSelected && (
                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" aria-hidden />
                          )}
                        </div>
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
                  );
                })}
              </div>

              {selectedTier && (() => {
                const pkg = partnershipPackages.find((p) => p.tier === selectedTier);
                if (!pkg) return null;
                return (
                  <Card className="mb-12 border-2 border-primary/20 bg-gradient-to-b from-primary/5 to-transparent overflow-hidden">
                    <div className={cn("h-1 w-full bg-gradient-to-r", pkg.color)} />
                    <CardHeader className="pb-2">
                      <Badge className={`bg-gradient-to-br ${pkg.color} ${pkg.textColor} border-0 font-semibold w-fit shadow-sm`}>
                        {selectedTier} Package
                      </Badge>
                    </CardHeader>
                    <CardContent className="pt-0 pb-6">
                      <p className="text-muted-foreground leading-relaxed">
                        {pkg.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })()}

              {/* Sponsor sign-up / request form */}
              <div id="sponsor-form" ref={formRef} className="mb-12">
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                    Request to become a sponsor
                  </h2>
                  <p className="text-muted-foreground">
                    Submit your details and preferred tier. Our team will get in touch to discuss next steps.
                  </p>
                  {selectedTier && (
                    <p className="mt-3 text-sm text-primary font-medium">
                      Selected package: {selectedTier}
                    </p>
                  )}
                </div>
                <div className="grid lg:grid-cols-2 gap-8 items-start">
                <Card className="p-6 sm:p-8 border border-border">
                  <Form {...sponsorForm}>
                    <form onSubmit={sponsorForm.handleSubmit(onSponsorSubmit)} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField
                          control={sponsorForm.control}
                          name="organization"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Organization / Company</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Your company name" data-testid="input-sponsor-organization" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={sponsorForm.control}
                          name="contactName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contact name</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Full name" data-testid="input-sponsor-contact" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField
                          control={sponsorForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input {...field} type="email" placeholder="you@company.com" data-testid="input-sponsor-email" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={sponsorForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone</FormLabel>
                              <FormControl>
                                <Input {...field} type="tel" placeholder="+254 700 000 000" data-testid="input-sponsor-phone" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={sponsorForm.control}
                        name="tier"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Partnership tier of interest</FormLabel>
                            <Select
                              onValueChange={(val) => {
                                field.onChange(val);
                                setSelectedTier(val ?? null);
                              }}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger data-testid="select-sponsor-tier">
                                  <SelectValue placeholder="Select a tier" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {TIER_OPTIONS.map((tier) => (
                                  <SelectItem key={tier} value={tier}>
                                    {tier}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={sponsorForm.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message (optional)</FormLabel>
                            <FormControl>
                              <Textarea {...field} placeholder="Tell us about your goals or questions..." className="min-h-[100px]" data-testid="input-sponsor-message" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full bg-primary text-primary-foreground"
                        disabled={sponsorMutation.isPending}
                        data-testid="button-sponsor-submit"
                      >
                        {sponsorMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Submit sponsor request
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </Card>

                {/* Payment Information */}
                <Card className="p-6 sm:p-8 border border-border bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20 lg:sticky lg:top-24">
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <h3 className="font-bold text-lg text-primary">Payment Information</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    After submitting your request, please make payment using one of the methods below. Include your organization name as the payment reference.
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* M-Pesa Paybill */}
                    <div className="bg-background border border-border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Smartphone className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-semibold text-foreground">M-Pesa Paybill</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Paybill Number:</span>
                          <div className="flex items-center gap-2">
                            <code className="text-sm font-mono font-bold text-foreground bg-muted px-2 py-1 rounded">7056475</code>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText("7056475");
                                toast({ title: "Copied!", description: "Paybill number copied to clipboard" });
                              }}
                              className="text-primary hover:text-primary/80 transition-colors"
                              title="Copy paybill number"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          M-Pesa → Pay Bill → <strong>7056475</strong> → Account: <strong>Your Organization Name</strong>
                        </p>
                      </div>
                    </div>

                    {/* Bank Transfer */}
                    <div className="bg-background border border-border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <CreditCard className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-semibold text-foreground">Bank Transfer</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Bank:</span>
                          <span className="text-sm font-semibold text-foreground">KCB Bank</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Account Number:</span>
                          <div className="flex items-center gap-2">
                            <code className="text-sm font-mono font-bold text-foreground bg-muted px-2 py-1 rounded">1181182263</code>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText("1181182263");
                                toast({ title: "Copied!", description: "Account number copied to clipboard" });
                              }}
                              className="text-primary hover:text-primary/80 transition-colors"
                              title="Copy account number"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Transfer to KCB Bank Account: <strong>1181182263</strong>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-muted-foreground">
                        <strong className="text-foreground">Note:</strong> Include your organization name as the payment reference.
                        Payment confirmation will be sent via email within 24 hours after we receive your payment.
                      </p>
                    </div>
                  </div>
                </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-28 bg-accent/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                  Why Partner With Us
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mt-4 mb-6">
                  Benefits of Partnership
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                  Becoming a partner or sponsor offers benefits designed to increase visibility, foster connections, and provide direct business engagement.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {benefits.map((benefit, index) => (
                  <Card key={index} className="p-6 border border-border bg-card hover-elevate">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <benefit.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-foreground mb-4">
                          {benefit.title}
                        </h3>
                        <ul className="space-y-3">
                          {benefit.items.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center mt-0.5">
                                <Check className="w-3 h-3 text-secondary" />
                              </div>
                              <span className="text-sm text-muted-foreground leading-relaxed">
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      
      <RegistrationDialog
        isOpen={isOpen}
        onOpenChange={closeRegistration}
        event={staticEvent}
      />
    </div>
    </>
  );
}
