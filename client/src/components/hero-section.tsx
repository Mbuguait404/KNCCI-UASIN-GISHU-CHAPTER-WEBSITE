import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";
import { staticEvent } from "@/data/static-data";
import { Event } from "@shared/schema";
import { useRegistration } from "@/contexts/registration-context";

interface CountdownValues {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(targetDate: Date): CountdownValues & { isOver: boolean } {
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
        <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white tabular-nums" data-testid={`countdown-${label.toLowerCase()}`}>
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

export function HeroSection({ event: propEvent }: HeroSectionProps) {
  const event = propEvent || staticEvent;
  const { openRegistration } = useRegistration();

  // Remove "4th Edition" and variations from event name for display
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
    // Parse date string and create date at 9 AM local time
    // Handle both YYYY-MM-DD and ISO strings
    const dateStr = event.date.includes('T') ? event.date.split('T')[0] : event.date;
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day, 9, 0, 0);
  }, [event?.date]);

  const [timeLeft, setTimeLeft] = useState<(CountdownValues & { isOver: boolean }) | null>(null);

  useEffect(() => {
    if (!eventDate) {
      setTimeLeft(null);
      return;
    }

    // Calculate immediately
    const initialTimeLeft = calculateTimeLeft(eventDate);
    setTimeLeft(initialTimeLeft);

    // Then update every second
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
      className="relative h-screen flex items-center justify-center overflow-hidden"
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

      {/* Vignette Overlay - darker at center, lighter towards edges for better text contrast */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 80% at center, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.6) 35%, rgba(0, 0, 0, 0.35) 70%, rgba(0, 0, 0, 0.15) 100%)',
        }}
      />

      <div className="relative z-10 container mx-auto px-4 text-center h-full flex flex-col justify-center">
        <div className="max-w-4xl mx-auto w-full space-y-6 sm:space-y-8 animate-fade-in-up">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full px-4 py-1.5 text-primary-foreground text-xs sm:text-sm font-bold tracking-wider uppercase">
              Uasin Gishu County Chapter
            </div>

            <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight px-2 drop-shadow-2xl" data-testid="text-event-name">
              Kenya National Chamber of <br className="hidden md:block" />
              Commerce & Industry <br />
              <span className="text-primary">Uasin Gishu Chapter</span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed px-4 font-medium drop-shadow-lg" data-testid="text-event-subtitle">
              The Voice of Business and the Champion for Economic Transformation in Uasin Gishu County
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              onClick={() => openRegistration()}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
              data-testid="button-register-hero"
            >
              Become a Member
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection("#who-we-are")}
              className="w-full sm:w-auto border-white/40 text-white bg-white/10 hover:bg-white/20 backdrop-blur-md text-lg px-8 py-6 transition-all hover:scale-105 active:scale-95"
              data-testid="button-about-hero"
            >
              Explore Our Work
            </Button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer" onClick={() => scrollToSection("#about")}>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1.5">
            <div className="w-1.5 h-3 bg-white/60 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
