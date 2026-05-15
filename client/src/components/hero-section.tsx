import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import {
  Users,
  ShieldCheck,
  Globe,
  Award,
  Store,
  TrendingUp,
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

const chamberBenefits = [
  {
    icon: Users,
    title: "Elite Networking",
    description: "Connect with 5,000+ business leaders",
  },
  {
    icon: Award,
    title: "Exclusive Events",
    description: "Summit, gala & B2B matchmaking",
  },
  {
    icon: Globe,
    title: "Trade Facilitation",
    description: "Certificate of Origin & advocacy",
  },
];

const marketplaceBenefits = [
  {
    icon: Store,
    title: "Digital Storefront",
    description: "Showcase products & services",
  },
  {
    icon: ShieldCheck,
    title: "Verified Trust",
    description: "Trade with KNCCI-verified members",
  },
  {
    icon: TrendingUp,
    title: "Market Expansion",
    description: "Reach local & global buyers",
  },
];

function BenefitCard({
  benefit,
  accent,
}: {
  benefit: {
    icon: React.ElementType;
    title: string;
    description: string;
  };
  accent: string;
}) {
  return (
    <div className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg p-2 sm:p-2.5 text-left transition-all duration-300 cursor-default flex-shrink-0 w-[150px] sm:w-[170px]">
      <benefit.icon
        className={`w-3.5 h-3.5 ${accent} mb-1 group-hover:scale-110 transition-transform duration-300`}
      />
      <p className="text-[11px] font-bold text-white/90 mb-0.5 leading-tight">
        {benefit.title}
      </p>
      <p className="text-[9px] sm:text-[10px] text-white/60 leading-snug">
        {benefit.description}
      </p>
    </div>
  );
}

function ScrollingCardsPanel({
  label,
  accentBg,
  accentText,
  benefits,
  direction = "left",
  delay = 0,
}: {
  label: string;
  accentBg: string;
  accentText: string;
  benefits: { icon: React.ElementType; title: string; description: string }[];
  direction?: "left" | "right";
  delay?: number;
}) {
  const items = [...benefits, ...benefits, ...benefits];
  const trackClass =
    direction === "left" ? "animate-marquee-left" : "animate-marquee-right";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-black/30 backdrop-blur-md border border-white/10 rounded-xl sm:rounded-2xl p-2 sm:p-3 overflow-hidden"
    >
      <div className="flex items-center gap-1.5 mb-1.5 px-0.5">
        <div className={`w-1.5 h-1.5 rounded-full ${accentBg}`} />
        <span
          className={`text-[9px] sm:text-[10px] font-bold ${accentText} uppercase tracking-widest`}
        >
          {label}
        </span>
      </div>
      <div className="overflow-hidden">
        <div className={`flex gap-2 ${trackClass}`}>
          {items.map((benefit, index) => (
            <BenefitCard key={index} benefit={benefit} accent={accentText} />
          ))}
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
      {/* Static Background Image */}
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

      {/* Vignette Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at center, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.6) 35%, rgba(0, 0, 0, 0.35) 70%, rgba(0, 0, 0, 0.15) 100%)",
        }}
      />

      {/* Main Content - centered in available space */}
      <div className="relative z-10 flex-1 min-h-0 flex flex-col items-center justify-center px-4">
        <div className="max-w-3xl mx-auto w-full text-center space-y-4 sm:space-y-5">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-[1.12] tracking-tight px-2 drop-shadow-2xl"
            data-testid="text-event-name"
          >
            Kenya National Chamber of <br className="hidden sm:block" />
            Commerce & Industry <br />
            <span className="text-primary">Uasin Gishu Chapter</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="text-sm sm:text-base md:text-lg text-white/85 max-w-xl mx-auto leading-relaxed px-4 font-medium drop-shadow-md"
            data-testid="text-event-subtitle"
          >
            Join us in building a vibrant and prosperous business community in
            Kenya.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 pt-1"
          >
            <Button
              size="sm"
              onClick={openMembership}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground text-sm px-5 py-4 sm:px-6 sm:py-5 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
              data-testid="button-register-hero"
            >
              Become a Member
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setLocation("/marketplace")}
              className="w-full sm:w-auto border-white/40 text-white bg-white/10 hover:bg-white/20 backdrop-blur-md text-sm px-5 py-4 sm:px-6 sm:py-5 transition-all hover:scale-105 active:scale-95 gap-2"
              data-testid="button-marketplace-hero"
            >
              <ShoppingBag className="w-4 h-4" />
              Explore Marketplace
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Scrolling Benefits Panels */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-3 sm:px-4 pb-2 sm:pb-3 space-y-2 flex-none">
        <ScrollingCardsPanel
          label="Chamber Membership"
          accentBg="bg-primary"
          accentText="text-primary"
          benefits={chamberBenefits}
          direction="left"
          delay={0.7}
        />
        <ScrollingCardsPanel
          label="Marketplace"
          accentBg="bg-secondary"
          accentText="text-secondary"
          benefits={marketplaceBenefits}
          direction="right"
          delay={0.9}
        />
      </div>

      {/* Scroll Indicator */}
      <div className="relative z-10 flex justify-center py-2 flex-none">
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
