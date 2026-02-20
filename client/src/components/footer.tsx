import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { insertNewsletterSchema, type InsertNewsletter } from "@shared/schema";
import {
  Mail,
  Phone,
  MapPin,
  Loader2,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Globe,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { Link } from "wouter";

const footerSections = [
  {
    title: "Chamber",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Who We Are", href: "/about#who-we-are" },
      { label: "Chairman's Word", href: "/about#chairman-message" },
      { label: "Board of Directors", href: "/board" },
      { label: "Our Services", href: "/#services" },
    ],
  },
  {
    title: "Activities",
    links: [
      { label: "Our Work", href: "/work" },
      { label: "Upcoming Events", href: "/events" },
      { label: "Media Gallery", href: "/gallery" },
      { label: "Latest News", href: "/blog" },
      { label: "Partner Network", href: "/#partners" },
    ],
  },
  {
    title: "Commerce",
    links: [
      { label: "Marketplace", href: "/marketplace" },
      { label: "Member Directory", href: "/member-directory" },
      { label: "Become a Member", href: "/membership" },
      { label: "Trade Facilitation", href: "/about#trade" },
      { label: "Contact Support", href: "/contact" },
    ],
  },
];

const socialLinks = [
  { icon: Facebook, href: "https://www.facebook.com/p/Uasin-Gishu-Chamber-100070349883626/", label: "Facebook" },
  { icon: Twitter, href: "https://x.com/kenya_chamber", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "https://www.instagram.com/p/DTPWs3DiDtP/", label: "Instagram" },
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

  return (
    <footer
      id="footer"
      className="bg-slate-950 text-white relative overflow-hidden"
      data-testid="section-footer"
    >
      {/* Decorative pulse background */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container mx-auto px-4 pt-20 pb-12 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
          {/* Brand Column */}
          <div className="space-y-8">
            <Link href="/">
              <a className="inline-block transition-transform hover:scale-105 duration-300">
                <img
                  src="/UG_chapter_logo-removebg-preview.png"
                  alt="KNCCI Uasin Gishu"
                  className="h-16 sm:h-20 w-auto object-contain filter drop-shadow-lg"
                  data-testid="footer-logo-image"
                />
              </a>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm" data-testid="text-footer-description">
              The Kenya National Chamber of Commerce & Industry, Uasin Gishu Chapter, is dedicated to fostering a prosperous business environment through advocacy, networking, and trade facilitation.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300 group"
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="w-4 h-4 text-slate-400 group-hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Columns */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-8">
              <h4 className="text-sm font-bold uppercase tracking-widest text-white/90 border-l-2 border-primary pl-4">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={`${section.title}-${link.label}`}>
                    <Link href={link.href}>
                      <a className="text-slate-400 hover:text-primary text-sm flex items-center gap-2 group transition-colors">
                        <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-primary transition-transform group-hover:translate-x-1" />
                        {link.label}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Strip */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 py-10 border-y border-slate-900 mb-10">
          <div className="flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Location</p>
              <p className="text-xs text-slate-300">Daima Towers, M2 Room 9, Eldoret</p>
            </div>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Phone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Phone</p>
              <a href="tel:+254740853372" className="text-xs text-slate-300 hover:text-white">+254 740 853 372</a>
            </div>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Email</p>
              <a href="mailto:info@uasingishuchamber.co.ke" className="text-xs text-slate-300 hover:text-white">info@uasingishuchamber.co.ke</a>
            </div>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Website</p>
              <a href="https://uasingishuchamber.co.ke" className="text-xs text-slate-300 hover:text-white" target="_blank" rel="noopener noreferrer">uasingishuchamber.co.ke</a>
            </div>
          </div>
        </div>

        {/* Newsletter & Bottom Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
            <div className="hidden sm:block">
              <p className="text-sm font-bold">Stay Connected</p>
              <p className="text-xs text-slate-500">Subscribe for trade updates</p>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex gap-2 w-full sm:w-auto"
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
                          placeholder="Email address"
                          className="h-10 bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 min-w-[200px] rounded-full focus:border-primary/50 transition-all"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={subscribeMutation.isPending}
                  className="h-10 bg-primary text-primary-foreground rounded-full px-6 hover:shadow-lg hover:shadow-primary/20 transition-all"
                >
                  {subscribeMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Join"
                  )}
                </Button>
              </form>
            </Form>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-8 text-[11px] text-slate-500 uppercase font-bold tracking-widest">
            <p>&copy; {new Date().getFullYear()} KNCCI Uasin Gishu</p>
            <a href="https://the-cube.co.ke/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-2">
              Designed by The Cube Innovation Hub <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

