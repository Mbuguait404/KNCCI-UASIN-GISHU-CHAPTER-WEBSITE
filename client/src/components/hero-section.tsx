import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";
import { staticEvent } from "@/data/static-data";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

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
      <span className="text-[10px] sm:text-xs text-white/80 mt-1 uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

export function HeroSection() {
  const event = staticEvent;
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const carouselImages = [
    "https://solby.sfo3.digitaloceanspaces.com/1769497085012-WhatsApp%20Image%202026-01-27%20at%2009.11.08.jpeg",
    "https://solby.sfo3.digitaloceanspaces.com/1769497085040-WhatsApp%20Image%202026-01-27%20at%2009.10.56.jpeg",
    "https://solby.sfo3.digitaloceanspaces.com/1769497085219-WhatsApp%20Image%202026-01-27%20at%2009.11.03.jpeg",
  ];

  const eventDate = useMemo(() => {
    if (!event?.date) return null;
    // Parse date string and create date at 9 AM local time
    const [year, month, day] = event.date.split('-').map(Number);
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

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Auto-play carousel
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [api]);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const formatDate = (dateStr: string, endDateStr: string) => {
    const start = new Date(dateStr);
    const end = new Date(endDateStr);
    const startMonth = start.toLocaleDateString("en-US", { month: "long" });
    const startDay = start.getDate();
    const endDay = end.getDate();
    const year = start.getFullYear();
    return `${startMonth} ${startDay}-${endDay}, ${year}`;
  };

  const getDayCount = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  return (
    <section
      id="home"
      className="relative h-screen flex items-center justify-center overflow-hidden"
      data-testid="section-hero"
    >
      {/* Carousel Background */}
      <div className="absolute inset-0">
        <Carousel setApi={setApi} className="h-full w-full">
          <CarouselContent className="h-full">
            {carouselImages.map((image, index) => (
              <CarouselItem key={index} className="h-full pl-0">
                <div className="h-full w-full">
                  <img
                    src={image}
                    alt={`The Eldoret International Business Summit 2026 - Event scene ${index + 1} showcasing business networking, speakers, and exhibition activities`}
                    className="h-full w-full object-cover"
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : "auto"}
                    width={1920}
                    height={1080}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Dark Blue Overlay - darker in center, fades out towards edges */}
      <div className="absolute inset-0" 
           style={{
             background: 'radial-gradient(ellipse 90% 70% at center, rgba(30, 58, 138, 0.75) 0%, rgba(30, 64, 175, 0.55) 40%, rgba(30, 58, 138, 0.35) 70%, rgba(30, 58, 138, 0.15) 100%)'
           }} />
      
      {/* Additional subtle overlay for text area in center */}
      <div className="absolute inset-0" 
           style={{
             background: 'radial-gradient(ellipse 80% 60% at center, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.25) 40%, rgba(0, 0, 0, 0.1) 70%, transparent 100%)'
           }} />

      <div className="relative z-10 container mx-auto px-4 text-center h-full flex flex-col justify-center">
        <div className="max-w-4xl mx-auto w-full space-y-3 sm:space-y-4 animate-fade-in-up">
          {event && (
            <>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5 text-white/90 text-xs sm:text-sm">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                <span data-testid="text-event-date">{formatDate(event.date, event.endDate)}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight px-2" data-testid="text-event-name">
                {event.name}
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed px-2" data-testid="text-event-subtitle">
                {event.subtitle}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-white/80 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                  <span data-testid="text-event-venue">{event.venue} • {event.location}</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-white/40 hidden sm:block" />
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-secondary" />
                  <span data-testid="text-event-duration">{getDayCount(event.date, event.endDate)} {event.tagline}</span>
                </div>
              </div>

              {event.highlights && event.highlights.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2">
                  {event.highlights.slice(0, 3).map((highlight, index) => (
                    <div 
                      key={index}
                      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5 text-white/90 text-xs sm:text-sm"
                      data-testid={`badge-highlight-${index}`}
                    >
                      {highlight}
                    </div>
                  ))}
                </div>
              )}

              {eventDate && (
                timeLeft ? (
                  !timeLeft.isOver ? (
                    <div className="pt-2 sm:pt-3">
                      <p className="text-[10px] sm:text-xs text-white/60 uppercase tracking-wider mb-2 sm:mb-3">
                        Event Starts In
                      </p>
                      <div className="flex justify-center gap-2 sm:gap-3 md:gap-4">
                        <CountdownBlock value={timeLeft.days} label="Days" />
                        <CountdownBlock value={timeLeft.hours} label="Hours" />
                        <CountdownBlock value={timeLeft.minutes} label="Minutes" />
                        <CountdownBlock value={timeLeft.seconds} label="Seconds" />
                      </div>
                    </div>
                  ) : (
                    <div className="pt-2 sm:pt-3">
                      <div className="inline-flex items-center gap-2 bg-secondary/20 border border-secondary/30 rounded-full px-4 py-2 sm:px-6 sm:py-3">
                        <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                        <span className="text-white font-medium text-sm sm:text-base" data-testid="text-event-status">Event In Progress</span>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="pt-2 sm:pt-3">
                    <p className="text-[10px] sm:text-xs text-white/60 uppercase tracking-wider mb-2 sm:mb-3">
                      Event Starts In
                    </p>
                    <div className="flex justify-center gap-2 sm:gap-3 md:gap-4">
                      <CountdownBlock value={0} label="Days" />
                      <CountdownBlock value={0} label="Hours" />
                      <CountdownBlock value={0} label="Minutes" />
                      <CountdownBlock value={0} label="Seconds" />
                    </div>
                  </div>
                )
              )}
            </>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 sm:pt-5">
            <Button
              size="lg"
              onClick={() => scrollToSection("#registration")}
              className="w-full sm:w-auto bg-primary text-primary-foreground text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-5"
              data-testid="button-register-hero"
            >
              Register for Event
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection("#program")}
              className="w-full sm:w-auto border-white/30 text-white bg-white/5 backdrop-blur-sm text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-5"
              data-testid="button-program-hero"
            >
              View Program
            </Button>
          </div>
        </div>

        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1">
            <div className="w-1.5 h-2 sm:h-3 bg-white/60 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}
