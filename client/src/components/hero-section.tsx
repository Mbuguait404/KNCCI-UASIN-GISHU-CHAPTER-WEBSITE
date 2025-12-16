import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, MapPin } from "lucide-react";
import type { Event } from "@shared/schema";

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
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 sm:p-4 min-w-[60px] sm:min-w-[80px]">
        <span className="text-2xl sm:text-4xl font-bold text-white tabular-nums" data-testid={`countdown-${label.toLowerCase()}`}>
          {value.toString().padStart(2, "0")}
        </span>
      </div>
      <span className="text-xs sm:text-sm text-white/80 mt-2 uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

export function HeroSection() {
  const { data: event, isLoading, isError } = useQuery<Event>({
    queryKey: ["/api/event"],
  });

  const eventDate = useMemo(() => {
    if (!event?.date) return null;
    return new Date(`${event.date}T09:00:00`);
  }, [event?.date]);

  const [timeLeft, setTimeLeft] = useState<(CountdownValues & { isOver: boolean }) | null>(null);

  useEffect(() => {
    if (!eventDate) {
      setTimeLeft(null);
      return;
    }
    
    setTimeLeft(calculateTimeLeft(eventDate));
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
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      data-testid="section-hero"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

      <div className="relative z-10 container mx-auto px-4 text-center py-24 sm:py-32">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
          {isLoading ? (
            <>
              <Skeleton className="h-10 w-48 mx-auto bg-white/10" />
              <Skeleton className="h-16 w-full max-w-2xl mx-auto bg-white/10" />
              <Skeleton className="h-8 w-3/4 mx-auto bg-white/10" />
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Skeleton className="h-6 w-40 bg-white/10" />
                <Skeleton className="h-6 w-40 bg-white/10" />
              </div>
              <div className="pt-8">
                <Skeleton className="h-4 w-32 mx-auto mb-4 bg-white/10" />
                <div className="flex justify-center gap-3 sm:gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex flex-col items-center">
                      <Skeleton className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg bg-white/10" />
                      <Skeleton className="h-3 w-12 mt-2 bg-white/10" />
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : isError ? (
            <div className="text-white text-center">
              <p className="text-xl">Unable to load event information.</p>
              <p className="text-white/60 mt-2">Please try again later.</p>
            </div>
          ) : event ? (
            <>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white/90 text-sm">
                <Calendar className="w-4 h-4" />
                <span data-testid="text-event-date">{formatDate(event.date, event.endDate)}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight" data-testid="text-event-name">
                {event.name}
              </h1>

              <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed" data-testid="text-event-subtitle">
                {event.subtitle}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 text-white/80">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span data-testid="text-event-venue">{event.venue}, {event.location}</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-white/40 hidden sm:block" />
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-secondary" />
                  <span data-testid="text-event-duration">{getDayCount(event.date, event.endDate)} Days of Excellence</span>
                </div>
              </div>

              {event.highlights && event.highlights.length > 0 && (
                <div className="flex flex-wrap justify-center gap-3 pt-4">
                  {event.highlights.slice(0, 3).map((highlight, index) => (
                    <div 
                      key={index}
                      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white/90 text-sm"
                      data-testid={`badge-highlight-${index}`}
                    >
                      {highlight}
                    </div>
                  ))}
                </div>
              )}

              {timeLeft && (
                !timeLeft.isOver ? (
                  <div className="pt-8">
                    <p className="text-sm text-white/60 uppercase tracking-wider mb-4">
                      Event Starts In
                    </p>
                    <div className="flex justify-center gap-3 sm:gap-6">
                      <CountdownBlock value={timeLeft.days} label="Days" />
                      <CountdownBlock value={timeLeft.hours} label="Hours" />
                      <CountdownBlock value={timeLeft.minutes} label="Minutes" />
                      <CountdownBlock value={timeLeft.seconds} label="Seconds" />
                    </div>
                  </div>
                ) : (
                  <div className="pt-8">
                    <div className="inline-flex items-center gap-2 bg-secondary/20 border border-secondary/30 rounded-full px-6 py-3">
                      <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                      <span className="text-white font-medium" data-testid="text-event-status">Event In Progress</span>
                    </div>
                  </div>
                )
              )}
            </>
          ) : null}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Button
              size="lg"
              onClick={() => scrollToSection("#registration")}
              className="w-full sm:w-auto bg-primary text-primary-foreground text-lg px-8 py-6"
              data-testid="button-register-hero"
            >
              Register for Event
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection("#program")}
              className="w-full sm:w-auto border-white/30 text-white bg-white/5 backdrop-blur-sm text-lg px-8 py-6"
              data-testid="button-program-hero"
            >
              View Program
            </Button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1">
            <div className="w-1.5 h-3 bg-white/60 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}
