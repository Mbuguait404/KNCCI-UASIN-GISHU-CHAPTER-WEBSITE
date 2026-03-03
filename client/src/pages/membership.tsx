import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/seo/seo-head";
import { MembershipForm } from "@/components/membership-form";
import {
  Users,
  Megaphone,
  FileText,
  GraduationCap,
  Eye,
  Briefcase,
  Percent,
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
        <main className="pt-20">
          {/* Header section */}
          <section className="py-20 bg-slate-50 dark:bg-slate-900/40 border-b border-border">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <span className="text-primary font-bold text-sm uppercase tracking-widest block mb-4">The Chamber Network</span>
                  <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
                    Grow Your <span className="text-primary">Business</span> Together
                  </h1>
                  <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
                    Become a part of the most influential business network in Uasin Gishu. Access exclusive resources, advocacy, and growth opportunities.
                  </p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Membership Benefits */}
          <section className="py-16 sm:py-24 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-4">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold italic mb-4">Membership <span className="text-primary">Benefits</span></h2>
                    <div className="w-24 h-1.5 bg-primary rounded-full" />
                  </div>
                  <p className="text-lg text-muted-foreground font-medium max-w-md">
                    Unlock exclusive opportunities and resources designed to scale your business.
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

                {/* Membership Application Form */}
                <div id="apply-form" className="max-w-4xl mx-auto scroll-mt-24 pt-24">
                  <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Join <span className="text-primary italic">Now</span></h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                      Fill out the form below to become a member of the KNCCI Uasin Gishu Chapter and start growing your business today.
                    </p>
                  </div>
                  <MembershipForm />
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
