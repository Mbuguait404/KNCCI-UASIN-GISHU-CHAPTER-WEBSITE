import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  Users,
  ShieldCheck,
  Award,
  Store,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { staticEvent } from "@/data/static-data";
import { Event } from "@shared/schema";
import { useLocation } from "wouter";
import { useRegistration } from "@/contexts/registration-context";
import { useMembership } from "@/contexts/membership-context";

interface CountdownValues {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(
  targetDate: Date,
): CountdownValues & { isOver: boolean } {
  const now = new Date().getTime();
  const target = targetDate.getTime();
  const difference = target - now;

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((difference % (1000 * 60)) / 1000),
    isOver: false,
  };
}

function CountdownBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-2 sm:p-3 min-w-[50px] sm:min-w-[60px]">
        <span
          className="text-xl sm:text-2xl md:text-3xl font-bold text-white tabular-nums"
          data-testid={`countdown-${label.toLowerCase()}`}
        >
          {value.toString().padStart(2, "0")}
        </span>
      </div>
      <span className="text-[10px] sm:text-xs text-white/80 mt-1 uppercase tracking-wider font-bold">
        {label}
      </span>
    </div>
  );
}

interface HeroSectionProps {
  event?: Event;
}

const memberBenefits = [
  { icon: Users, text: "Manage your membership & business profile" },
  { icon: TrendingUp, text: "Access exclusive trade leads & opportunities" },
  { icon: Award, text: "Register for summits with member discounts" },
  { icon: Store, text: "Showcase products on the marketplace" },
];

const heroStats = [
  { value: "6,500+", label: "Businesses" },
  { value: "North Rift", label: "Region" },
  { value: "Est. 1965", label: "Founded" },
];

function HeroBenefitsCard({ onJoin }: { onJoin: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="hidden lg:block flex-shrink-0"
    >
      <div
        className="overflow-hidden border border-white/[0.12]"
        style={{
          background: "rgba(10,10,10,0.44)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          borderRadius: "2rem",
          boxShadow:
            "0 32px 64px -12px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.07)",
          width: "340px",
        }}
      >
        {/* Card header */}
        <div
          className="px-6 pt-6 pb-4"
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            background: "rgba(255,255,255,0.025)",
          }}
        >
          <div className="flex items-center gap-2 mb-2.5">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span className="text-[9px] font-extrabold text-primary uppercase tracking-[0.22em]">
              Secure Member Portal
            </span>
          </div>
          <p className="text-white font-extrabold text-[18px] leading-snug">
            Unlock Your Chamber{" "}
            <span className="text-primary italic">Benefits</span>
          </p>
          <p className="text-white/50 text-[11px] mt-1 font-medium">
            Join the largest business network in Uasin Gishu
          </p>
        </div>

        {/* Benefits checklist */}
        <div className="px-6 py-4 space-y-3.5">
          {memberBenefits.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.65 + i * 0.09 }}
              className="flex items-center gap-3 group cursor-default"
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                style={{
                  background: "hsl(var(--primary) / 0.14)",
                  border: "1px solid hsl(var(--primary) / 0.24)",
                }}
              >
                <item.icon className="w-3 h-3 text-primary" />
              </div>
              <span className="text-[12.5px] font-semibold text-white/80 group-hover:text-white/95 transition-colors leading-snug">
                {item.text}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Stats row */}
        <div
          className="mx-6 mb-4 grid grid-cols-3 gap-1 py-3.5"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.07)",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {heroStats.map((stat, i) => (
            <div key={i} className="text-center px-1">
              <p className="text-white font-extrabold text-[15px] leading-none">
                {stat.value}
              </p>
              <p className="text-white/42 text-[9px] font-bold mt-1 uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="px-6 pb-6">
          <Button
            onClick={onJoin}
            className="w-full h-12 font-bold text-sm shadow-xl shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-transform"
            style={{ borderRadius: "14px" }}
          >
            Join the Chamber Today
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export function HeroSection({ event: propEvent }: HeroSectionProps) {
  const event = propEvent || staticEvent;
  const [, setLocation] = useLocation();
  const { openRegistration } = useRegistration();
  const { openMembership } = useMembership();

  const displayName = useMemo(() => {
    if (!event?.name) return "";
    return event.name
      .replace(/\s*4th\s+Edition\s*/gi, " ")
      .replace(/\s*4TH\s+EDITION\s*/gi, " ")
      .replace(/\s*4th\s+edition\s*/gi, " ")
      .replace(/\s+/g, " ")
      .trim();
  }, [event?.name]);

  const eventDate = useMemo(() => {
    if (!event?.date) return null;
    const dateStr = event.date.includes("T")
      ? event.date.split("T")[0]
      : event.date;
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day, 9, 0, 0);
  }, [event?.date]);

  const [timeLeft, setTimeLeft] = useState<
    (CountdownValues & { isOver: boolean }) | null
  >(null);

  useEffect(() => {
    if (!eventDate) {
      setTimeLeft(null);
      return;
    }

    const initialTimeLeft = calculateTimeLeft(eventDate);
    setTimeLeft(initialTimeLeft);

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(eventDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [eventDate]);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const formatDate = (dateStr: string, endDateStr: string) => {
    try {
      const start = new Date(dateStr);
      const end = new Date(endDateStr);
      const startMonth = start.toLocaleDateString("en-US", { month: "long" });
      const startDay = start.getDate();
      const endDay = end.getDate();
      const year = start.getFullYear();
      return `${startMonth} ${startDay}-${endDay}, ${year}`;
    } catch (e) {
      return dateStr;
    }
  };

  const getDayCount = (startDate: string, endDate: string) => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    } catch (e) {
      return 3;
    }
  };

  return (
    <section
      id="home"
      className="relative h-[100dvh] flex flex-col overflow-hidden"
      data-testid="section-hero"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://solby.sfo3.digitaloceanspaces.com/1770897937932-WhatsApp%20Image%202026-02-12%20at%2015.03.53.jpeg"
          alt="The Eldoret International Business Summit 2026 - Business networking and exhibition activities"
          className="h-full w-full object-cover"
          loading="eager"
          fetchPriority="high"
          width={1920}
          height={1080}
        />
      </div>

      {/* Directional overlay — darkest on left for text legibility, fades right */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(115deg, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.72) 38%, rgba(0,0,0,0.38) 65%, rgba(0,0,0,0.16) 100%)",
        }}
      />

      {/* Ambient orbs (from login page concept) */}
      <div
        className="absolute top-[-8%] left-[-4%] w-[38%] h-[42%] rounded-full pointer-events-none"
        style={{ background: "hsl(var(--primary) / 0.12)", filter: "blur(110px)" }}
      />
      <div
        className="absolute bottom-[-10%] right-[-5%] w-[32%] h-[36%] rounded-full pointer-events-none"
        style={{ background: "hsl(var(--primary) / 0.16)", filter: "blur(95px)" }}
      />

      {/* Two-column main content */}
      <div className="relative z-10 flex-1 min-h-0 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-14">
          <div className="grid lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_360px] gap-8 xl:gap-14 items-center">

            {/* Left column — branding, text, CTAs, social proof */}
            <motion.div
              initial={{ opacity: 0, x: -22 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-5 sm:space-y-6"
            >
              {/* Badge pill (like login page) */}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.15em] border"
                style={{
                  background: "hsl(var(--primary) / 0.15)",
                  color: "hsl(var(--primary))",
                  borderColor: "hsl(var(--primary) / 0.28)",
                }}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Voice of Business in Uasin Gishu
              </motion.div>

              {/* Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.22 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-[2.8rem] xl:text-[3.2rem] font-extrabold text-white leading-[1.1] tracking-tight drop-shadow-2xl"
                data-testid="text-event-name"
              >
                Kenya National Chamber of{" "}
                <br className="hidden sm:block" />
                Commerce & Industry
                <br />
                <span className="text-primary italic">Uasin Gishu Chapter</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.36 }}
                className="text-base sm:text-lg text-white/80 max-w-lg leading-relaxed font-medium drop-shadow-md"
                data-testid="text-event-subtitle"
              >
                Join us in building a vibrant and prosperous business community
                in Kenya.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.50 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <Button
                  size="lg"
                  onClick={openMembership}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-7 font-bold shadow-xl shadow-primary/25 hover:scale-105 active:scale-95 transition-transform gap-2"
                  data-testid="button-register-hero"
                >
                  Become a Member
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setLocation("/marketplace")}
                  className="border-white/35 text-white bg-white/10 hover:bg-white/20 backdrop-blur-md px-7 font-bold transition-all hover:scale-105 active:scale-95 gap-2"
                  data-testid="button-marketplace-hero"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Explore Marketplace
                </Button>
              </motion.div>

              {/* Social proof — like login page's avatar stack */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.72 }}
                className="flex items-center gap-4 pt-1"
              >
                <div className="flex -space-x-2.5">
                  {[0.15, 0.20, 0.25, 0.30].map((opacity, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white/25"
                      style={{ background: `rgba(255,255,255,${opacity})` }}
                    />
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-white/25 bg-primary text-primary-foreground text-[9px] flex items-center justify-center font-extrabold">
                    +6k
                  </div>
                </div>
                <p className="text-sm font-semibold text-white/60">
                  6,500+ registered businesses
                </p>
              </motion.div>
            </motion.div>

            {/* Right column — glass benefits card (desktop only) */}
            <HeroBenefitsCard onJoin={openMembership} />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="relative z-10 flex justify-center py-3 flex-none">
        <div
          className="animate-bounce cursor-pointer"
          onClick={() => scrollToSection("#about")}
        >
          <div className="w-5 h-8 border-2 border-white/30 rounded-full flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-white/60 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
