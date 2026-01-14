import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Mic2, Users, Wrench, Coffee, HandshakeIcon } from "lucide-react";
import type { Session } from "@shared/schema";

const typeConfig = {
  keynote: { icon: Mic2, color: "bg-primary text-primary-foreground" },
  panel: { icon: Users, color: "bg-secondary text-secondary-foreground" },
  workshop: { icon: Wrench, color: "bg-chart-3 text-white" },
  networking: { icon: HandshakeIcon, color: "bg-chart-4 text-white" },
  break: { icon: Coffee, color: "bg-muted text-muted-foreground" },
};

function SessionCard({ session }: { session: Session }) {
  const config = typeConfig[session.type];
  const Icon = config.icon;

  return (
    <Card
      className="p-4 border border-border bg-card hover-elevate"
      data-testid={`card-session-${session.id}`}
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0 text-right w-20">
          <span className="text-sm font-medium text-foreground" data-testid={`text-session-time-${session.id}`}>
            {session.time.split(" - ")[0]}
          </span>
          <span className="block text-xs text-muted-foreground">{session.time.split(" - ")[1]}</span>
        </div>
        <div className="flex-grow">
          <div className="flex items-start gap-3">
            <div className={`flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center ${config.color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-grow min-w-0">
              <h4 className="font-semibold text-foreground" data-testid={`text-session-title-${session.id}`}>
                {session.title}
              </h4>
              {session.speaker && (
                <p className="text-sm text-muted-foreground mt-1" data-testid={`text-session-speaker-${session.id}`}>
                  {session.speaker}
                </p>
              )}
            </div>
            <Badge variant="outline" className="flex-shrink-0 capitalize text-xs" data-testid={`badge-session-type-${session.id}`}>
              {session.type}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}

function SessionSkeleton() {
  return (
    <Card className="p-4 border border-border bg-card">
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-20">
          <Skeleton className="h-4 w-12 mb-1" />
          <Skeleton className="h-3 w-10" />
        </div>
        <div className="flex-grow">
          <div className="flex items-start gap-3">
            <Skeleton className="w-8 h-8 rounded-md" />
            <div className="flex-grow">
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-5 w-16" />
          </div>
        </div>
      </div>
    </Card>
  );
}

export function ProgramSection() {
  const { data: schedule = [], isLoading, isError } = useQuery<Session[]>({
    queryKey: ["/api/schedule"],
  });

  const days = [1, 2, 3];
  const dayLabels = ["Day 1 - April 23", "Day 2 - April 24", "Day 3 - April 25"];

  return (
    <section
      id="program"
      className="py-20 sm:py-28 bg-background"
      data-testid="section-program"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Event Schedule
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6" data-testid="text-program-title">
            Three Days of Excellence
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A carefully curated program featuring keynotes, panels, workshops, 
            and networking opportunities designed to maximize your experience.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {Object.entries(typeConfig).map(([type, config]) => (
            <div key={type} className="flex items-center gap-2" data-testid={`legend-${type}`}>
              <div className={`w-6 h-6 rounded flex items-center justify-center ${config.color}`}>
                <config.icon className="w-3 h-3" />
              </div>
              <span className="text-sm text-muted-foreground capitalize">{type}</span>
            </div>
          ))}
        </div>

        {isLoading ? (
          <div className="max-w-4xl mx-auto space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <SessionSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Unable to load schedule. Please try again later.</p>
          </div>
        ) : (
          <Tabs defaultValue="1" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              {days.map((day, index) => (
                <TabsTrigger key={day} value={day.toString()} data-testid={`tab-day-${day}`}>
                  <span className="hidden sm:inline">{dayLabels[index]}</span>
                  <span className="sm:hidden">Day {day}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            {days.map((day) => (
              <TabsContent key={day} value={day.toString()} className="space-y-4">
                {schedule
                  .filter((session) => session.day === day)
                  .map((session) => (
                    <SessionCard key={session.id} session={session} />
                  ))}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </section>
  );
}
