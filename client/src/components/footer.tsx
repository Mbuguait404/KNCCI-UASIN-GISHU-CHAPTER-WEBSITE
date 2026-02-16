import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { insertNewsletterSchema, type InsertNewsletter } from "@shared/schema";
import { Mail, Phone, MapPin, Loader2, Facebook, Twitter, Linkedin, Instagram, Youtube, Globe, ExternalLink } from "lucide-react";

const quickLinks = [
  { label: "About KNCCI", href: "#about" },
  { label: "Events", href: "#program" },
  { label: "Speakers", href: "#speakers" },
  { label: "Venue", href: "#venue" },
  { label: "Gallery", href: "#gallery" },
  { label: "Partners", href: "#partners" },
];

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export function Footer() {
  const { toast } = useToast();
  
  const form = useForm<InsertNewsletter>({
    resolver: zodResolver(insertNewsletterSchema),
    defaultValues: {
      email: "",
    },
  });

  const subscribeMutation = useMutation({
    mutationFn: async (data: InsertNewsletter) => {
      return apiRequest("POST", "/api/newsletter", data);
    },
    onSuccess: () => {
      toast({
        title: "Successfully subscribed!",
        description: "You'll receive updates about our upcoming events.",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Subscription failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertNewsletter) => {
    subscribeMutation.mutate(data);
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer
      id="footer"
      className="bg-slate-900 text-white py-16"
      data-testid="section-footer"
    >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img 
                src="/UG_chapter_logo-removebg-preview.png" 
                alt="KNCCI - Kenya National Chamber of Commerce and Industry, Uasin Gishu Chapter" 
                className="h-14 sm:h-16 w-auto object-contain"
                data-testid="footer-logo-image"
                width={200}
                height={64}
                loading="lazy"
              />
              {/* <div>
                <span className="font-bold text-xl" data-testid="text-footer-logo">KNCCI</span>
                <span className="text-xs block text-white/60 -mt-0.5">
                  Kenya National Chamber of Commerce and Industry
                </span>
              </div> */}
            </div>
            <p className="text-white/70 mb-6 max-w-md leading-relaxed" data-testid="text-footer-description">
              The Kenya National Chamber of Commerce and Industry is the voice of business 
              in Kenya, dedicated to promoting trade, investment, and enterprise development 
              for sustainable economic growth.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                  aria-label={social.label}
                  data-testid={`link-social-${social.label.toLowerCase()}`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-white/70 hover:text-white transition-colors"
                    data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-6">Contact us</h4>
            <p className="text-white/60 text-sm mb-4">
              For inquiries and sponsorships:
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-white/70" data-testid="text-address">
                  Daima Towers, M2 Room 9<br />
                  Eldoret
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a 
                  href="tel:+254740853372" 
                  className="text-white/70 hover:text-white transition-colors"
                  data-testid="link-phone"
                >
                  +254 740 853 372
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a 
                  href="mailto:events@uasingishuchamber.co.ke" 
                  className="text-white/70 hover:text-white transition-colors"
                  data-testid="link-email"
                >
                  events@uasingishuchamber.co.ke
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-primary flex-shrink-0" />
                <a 
                  href="https://www.uasingishuchamber.co.ke" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors"
                  data-testid="link-website"
                >
                  www.uasingishuchamber.co.ke
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h4 className="font-semibold mb-2">Stay Updated</h4>
              <p className="text-white/60 text-sm">
                Subscribe to our newsletter for event updates and business insights.
              </p>
            </div>
            <Form {...form}>
              <form 
                onSubmit={form.handleSubmit(onSubmit)} 
                className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="Enter your email"
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/40 min-w-[280px]"
                          data-testid="input-newsletter-email"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive-foreground" />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={subscribeMutation.isPending}
                  className="bg-primary text-primary-foreground"
                  data-testid="button-subscribe"
                >
                  {subscribeMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/50">
            <p data-testid="text-copyright">
              &copy; {new Date().getFullYear()} Kenya National Chamber of Commerce and Industry. All rights reserved.
            </p>
            <a
              href="https://the-cube.co.ke/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors border border-white/10 text-xs"
            >
              <span>Built by The Cube Innovation Hub</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
