import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Linkedin, Twitter, Globe } from "lucide-react";
import type { Speaker } from "@shared/schema";

function SpeakerCard({ speaker, onClick }: { speaker: Speaker; onClick: () => void }) {
  const initials = speaker.name.split(" ").map(n => n[0]).join("").slice(0, 2);
  
  return (
    <Card
      className="group overflow-visible p-6 border border-border bg-card cursor-pointer hover-elevate active-elevate-2"
      onClick={onClick}
      data-testid={`card-speaker-${speaker.id}`}
    >
      <div className="flex flex-col items-center text-center">
        <Avatar className="w-24 h-24 mb-4 border-2 border-primary/20">
          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-xl font-semibold text-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        <h3 className="text-lg font-semibold text-foreground mb-1" data-testid={`text-speaker-name-${speaker.id}`}>
          {speaker.name}
        </h3>
        <p className="text-sm text-primary font-medium mb-1" data-testid={`text-speaker-title-${speaker.id}`}>
          {speaker.title}
        </p>
        <p className="text-sm text-muted-foreground" data-testid={`text-speaker-org-${speaker.id}`}>
          {speaker.organization}
        </p>
        <p className="mt-4 text-sm text-muted-foreground line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {speaker.bio}
        </p>
      </div>
    </Card>
  );
}

function SpeakerSkeleton() {
  return (
    <Card className="p-6 border border-border bg-card">
      <div className="flex flex-col items-center text-center">
        <Skeleton className="w-24 h-24 rounded-full mb-4" />
        <Skeleton className="h-5 w-32 mb-2" />
        <Skeleton className="h-4 w-24 mb-1" />
        <Skeleton className="h-4 w-28" />
      </div>
    </Card>
  );
}

export function SpeakersSection() {
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);

  const { data: speakers = [], isLoading, isError } = useQuery<Speaker[]>({
    queryKey: ["/api/speakers"],
  });

  return (
    <section
      id="speakers"
      className="py-20 sm:py-28 bg-accent/30"
      data-testid="section-speakers"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Featured Speakers
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6" data-testid="text-speakers-title">
            Learn from Industry Leaders
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Our distinguished speakers bring decades of experience and insights 
            from across diverse industries and sectors.
          </p>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SpeakerSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Unable to load speakers. Please try again later.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {speakers.map((speaker) => (
              <SpeakerCard
                key={speaker.id}
                speaker={speaker}
                onClick={() => setSelectedSpeaker(speaker)}
              />
            ))}
          </div>
        )}

        <Dialog open={!!selectedSpeaker} onOpenChange={() => setSelectedSpeaker(null)}>
          <DialogContent className="max-w-lg">
            {selectedSpeaker && (
              <>
                <DialogHeader>
                  <div className="flex items-start gap-4">
                    <Avatar className="w-20 h-20 border-2 border-primary/20">
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-xl font-semibold">
                        {selectedSpeaker.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <DialogTitle className="text-xl font-bold" data-testid="text-modal-speaker-name">
                        {selectedSpeaker.name}
                      </DialogTitle>
                      <p className="text-primary font-medium mt-1" data-testid="text-modal-speaker-title">
                        {selectedSpeaker.title}
                      </p>
                      <p className="text-muted-foreground text-sm" data-testid="text-modal-speaker-org">
                        {selectedSpeaker.organization}
                      </p>
                    </div>
                  </div>
                </DialogHeader>
                <div className="mt-4">
                  <p className="text-foreground leading-relaxed" data-testid="text-modal-speaker-bio">
                    {selectedSpeaker.bio}
                  </p>
                  <div className="flex gap-2 mt-6">
                    <button className="p-2 rounded-md bg-accent hover-elevate" data-testid="button-speaker-linkedin">
                      <Linkedin className="w-5 h-5 text-muted-foreground" />
                    </button>
                    <button className="p-2 rounded-md bg-accent hover-elevate" data-testid="button-speaker-twitter">
                      <Twitter className="w-5 h-5 text-muted-foreground" />
                    </button>
                    <button className="p-2 rounded-md bg-accent hover-elevate" data-testid="button-speaker-website">
                      <Globe className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
