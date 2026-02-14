import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/seo/seo-head";
import {
  Users,
  Megaphone,
  FileText,
  GraduationCap,
  Eye,
  Briefcase,
  Percent,
  ExternalLink,
} from "lucide-react";

const membershipData = {
  organization: {
    name: "Kenya National Chamber of Commerce & Industry",
    acronym: "KNCCI",
    slogan: "Growing your Business together",
  },
  document_title: "Membership Benefits",
  tagline: "Why join?",
  benefits: [
    {
      category: "Networking Opportunities",
      description:
        "KNCCI offers a platform for networking with other business professionals, industry leaders, and potential clients. Networking can lead to new business partnerships, collaborations, and opportunities for growth.",
      icon: Users,
    },
    {
      category: "Business Advocacy",
      description:
        "The chamber advocates for policies and regulations that support economic growth and a conducive business environment. Members can benefit from the chamber's advocacy efforts aimed at creating a more favorable business climate.",
      icon: Megaphone,
    },
    {
      category: "Access to Information",
      description:
        "Members receive access to valuable industry information, market insights, research reports, and updates on government policies and regulations that could impact their businesses. This information can help members make informed decisions and stay ahead of industry trends.",
      icon: FileText,
    },
    {
      category: "Training and Workshops",
      description:
        "KNCCI often organizes seminars, workshops, and training sessions on various business-related topics such as marketing, finance, technology, and legal issues. These educational opportunities can enhance members' skills and knowledge, ultimately improving their business operations.",
      icon: GraduationCap,
    },
    {
      category: "Visibility and Branding",
      description:
        "Membership in the chamber can enhance a business's credibility and visibility. Members often receive exposure through chamber events, publications, and online platforms, helping to boost their brand recognition and reputation.",
      icon: Eye,
    },
    {
      category: "Business Services",
      description:
        "The chamber may offer members access to services such as business consultations, mentorship, and guidance on navigating regulatory hurdles. These services can be particularly helpful for startups and small businesses.",
      icon: Briefcase,
    },
    {
      category: "Discounts and Deals",
      description:
        "Some chambers have partnerships with other businesses that offer exclusive discounts, deals, and offers to chamber members. This can lead to cost savings on various business-related services and products. Subsidized rates on the Certificate of Origin.",
      icon: Percent,
    },
  ],
};

const MEMBERSHIP_FORM_URL = "https://forms.gle/22EEiMTGzu7o9C6PA";

export default function Membership() {
  return (
    <>
      <SEOHead
        title="Become a KNCCI Member | Kenya National Chamber of Commerce & Industry"
        description="Join KNCCI Uasin Gishu Chapter. Access networking opportunities, business advocacy, training, visibility, and exclusive member benefits. Grow your business together."
        keywords={[
          "KNCCI Membership",
          "Kenya Chamber of Commerce",
          "Business Membership Eldoret",
          "Uasin Gishu Chamber",
          "Join KNCCI",
        ]}
        canonicalUrl={
          typeof window !== "undefined" ? `${window.location.origin}/membership` : ""
        }
      />
      <div className="min-h-screen bg-background">
        <Navigation />
        <main>
          {/* Hero */}
          <section className="py-20 sm:py-28 bg-gradient-to-br from-primary/10 via-background to-kncci-green/10">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                  {membershipData.organization.acronym} Uasin Gishu Chapter
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-2">
                  {membershipData.organization.name}
                </h1>
                <p className="text-xl text-kncci-green dark:text-kncci-green font-medium">
                  {membershipData.organization.slogan}
                </p>
              </div>
            </div>
          </section>

          {/* Membership Benefits */}
          <section className="py-16 sm:py-24 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12 border-b border-border pb-6">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-kncci-green">
                    {membershipData.document_title}
                  </h2>
                  <p className="text-lg text-muted-foreground font-medium">
                    {membershipData.tagline}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                  {membershipData.benefits.map((benefit, index) => {
                    const Icon = benefit.icon;
                    return (
                      <Card
                        key={index}
                        className="border-2 border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 overflow-hidden group"
                      >
                        <div className="h-1 w-full bg-gradient-to-r from-primary/60 to-kncci-green/60 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                              <Icon className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-bold text-lg text-foreground mb-2">
                                {benefit.category}
                              </h3>
                              <p className="text-muted-foreground text-sm leading-relaxed">
                                {benefit.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* CTA - Apply Now */}
                <Card className="max-w-2xl mx-auto border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-kncci-green/5">
                  <CardContent className="p-8 sm:p-10 text-center">
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      Ready to join?
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Take the first step towards becoming a KNCCI member. Fill out
                      the membership application form and unlock exclusive benefits
                      for your business.
                    </p>
                    <Button
                      size="lg"
                      className="gap-2"
                      asChild
                    >
                      <a
                        href={MEMBERSHIP_FORM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Apply for Membership
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                    <p className="text-xs text-muted-foreground mt-4">
                      You will be redirected to the official KNCCI membership form
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
