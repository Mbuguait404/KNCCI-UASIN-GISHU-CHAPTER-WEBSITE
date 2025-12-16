import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import type { Testimonial } from "@shared/schema";

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const { data: testimonials = [], isLoading, isError } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  useEffect(() => {
    if (!isAutoPlaying || testimonials.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, testimonials.length]);

  const goNext = () => {
    if (testimonials.length === 0) return;
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goPrev = () => {
    if (testimonials.length === 0) return;
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section
      id="testimonials"
      className="py-20 sm:py-28 bg-background"
      data-testid="section-testimonials"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6" data-testid="text-testimonials-title">
            What Attendees Say
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Hear from past attendees about their experience at KNCCI events 
            and the impact on their businesses.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <Card className="p-8 sm:p-12 border border-border bg-card">
              <div className="flex flex-col items-center">
                <Skeleton className="h-24 w-3/4 mb-8" />
                <Skeleton className="w-16 h-16 rounded-full mb-4" />
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-4 w-28" />
              </div>
            </Card>
          ) : isError ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Unable to load testimonials. Please try again later.</p>
            </div>
          ) : currentTestimonial ? (
            <Card className="p-8 sm:p-12 border border-border bg-card relative overflow-visible">
              <Quote className="absolute top-6 left-6 w-12 h-12 text-primary/10" />
              
              <div className="relative z-10">
                <blockquote className="text-lg sm:text-xl text-foreground leading-relaxed mb-8 text-center" data-testid="text-testimonial-quote">
                  "{currentTestimonial.quote}"
                </blockquote>
                
                <div className="flex flex-col items-center">
                  <Avatar className="w-16 h-16 mb-4 border-2 border-primary/20">
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-lg font-semibold text-foreground">
                      {currentTestimonial.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <p className="font-semibold text-foreground" data-testid="text-testimonial-name">
                      {currentTestimonial.name}
                    </p>
                    <p className="text-sm text-primary" data-testid="text-testimonial-title">
                      {currentTestimonial.title}
                    </p>
                    <p className="text-sm text-muted-foreground" data-testid="text-testimonial-org">
                      {currentTestimonial.organization}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 mt-8">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={goPrev}
                  data-testid="button-prev-testimonial"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <div className="flex gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentIndex ? "bg-primary" : "bg-muted"
                      }`}
                      onClick={() => {
                        setIsAutoPlaying(false);
                        setCurrentIndex(index);
                      }}
                      data-testid={`button-testimonial-dot-${index}`}
                    />
                  ))}
                </div>
                
                <Button
                  size="icon"
                  variant="outline"
                  onClick={goNext}
                  data-testid="button-next-testimonial"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ) : null}
        </div>
      </div>
    </section>
  );
}
