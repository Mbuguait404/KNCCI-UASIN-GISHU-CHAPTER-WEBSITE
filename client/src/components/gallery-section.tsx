import { useState } from "react";
import { staticGallery } from "@/data/static-data";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryImage } from "@shared/schema";

const gradientColors = [
  "from-primary/30 to-secondary/30",
  "from-secondary/30 to-chart-4/30",
  "from-chart-4/30 to-primary/30",
  "from-chart-3/30 to-primary/30",
  "from-primary/30 to-chart-3/30",
  "from-secondary/30 to-primary/30",
  "from-chart-4/30 to-secondary/30",
  "from-primary/30 to-chart-4/30",
];

function GalleryCard({ 
  image, 
  index,
  onClick 
}: { 
  image: GalleryImage; 
  index: number;
  onClick: () => void;
}) {
  const gradient = gradientColors[index % gradientColors.length];
  const hasImage = image.url && image.url.trim() !== "";
  
  return (
    <div
      className="group relative overflow-hidden rounded-lg cursor-pointer hover-elevate"
      onClick={onClick}
      data-testid={`card-gallery-${image.id}`}
    >
      <div className={`aspect-square bg-gradient-to-br ${gradient} relative`}>
        {hasImage ? (
          <img
            src={image.url}
            alt={`${image.eventName} ${image.year} - ${image.alt}`}
            className="w-full h-full object-cover"
            loading="lazy"
            width={400}
            height={400}
            decoding="async"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center p-4">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-lg font-bold text-foreground">{index + 1}</span>
              </div>
              <p className="text-xs text-muted-foreground">{image.alt}</p>
            </div>
          </div>
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
        <div>
          <p className="text-white font-semibold" data-testid={`text-gallery-name-${image.id}`}>{image.eventName}</p>
          <p className="text-white/70 text-sm" data-testid={`text-gallery-year-${image.id}`}>{image.year}</p>
        </div>
      </div>
    </div>
  );
}


export function GallerySection() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const galleryImages = staticGallery;

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const currentImage = galleryImages[currentIndex];

  return (
    <section
      id="gallery"
      className="py-20 sm:py-28 bg-accent/30"
      data-testid="section-gallery"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Event Gallery
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6" data-testid="text-gallery-title">
            Moments from Past Events
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Explore highlights from our previous events and get a glimpse of what 
            to expect at The Eldoret International Business Summit 2026.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {galleryImages.map((image, index) => (
              <GalleryCard
                key={image.id}
                image={image}
                index={index}
                onClick={() => openLightbox(index)}
              />
            ))}
        </div>

        <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
          <DialogContent className="max-w-4xl p-0 bg-black/95 border-0">
            <div className="relative">
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
                onClick={() => setLightboxOpen(false)}
                data-testid="button-close-lightbox"
              >
                <X className="w-5 h-5" />
              </Button>
              
              {currentImage && (
                <>
                  <div className="aspect-video flex items-center justify-center relative bg-black">
                    {currentImage.url && currentImage.url.trim() !== "" ? (
                      <>
                        <img
                          src={currentImage.url}
                          alt={`${currentImage.eventName} ${currentImage.year} - ${currentImage.alt}`}
                          className="w-full h-full object-contain"
                          data-testid="image-lightbox"
                          loading="eager"
                          fetchPriority="high"
                          width={1200}
                          height={800}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6">
                          <p className="text-2xl font-bold text-white mb-1" data-testid="text-lightbox-name">{currentImage.eventName}</p>
                          <p className="text-white/70" data-testid="text-lightbox-year">{currentImage.year}</p>
                          <p className="text-sm text-white/60 mt-2">{currentImage.alt}</p>
                        </div>
                      </>
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${gradientColors[currentIndex % gradientColors.length]} flex items-center justify-center`}>
                        <div className="text-center text-white">
                          <p className="text-2xl font-bold mb-2" data-testid="text-lightbox-name">{currentImage.eventName}</p>
                          <p className="text-white/70" data-testid="text-lightbox-year">{currentImage.year}</p>
                          <p className="text-sm text-white/50 mt-4">{currentImage.alt}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="absolute inset-y-0 left-0 flex items-center">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="ml-4 text-white hover:bg-white/20"
                      onClick={goPrev}
                      data-testid="button-prev-image"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </Button>
                  </div>
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="mr-4 text-white hover:bg-white/20"
                      onClick={goNext}
                      data-testid="button-next-image"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </Button>
                  </div>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {galleryImages.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentIndex ? "bg-white" : "bg-white/30"
                        }`}
                        onClick={() => setCurrentIndex(index)}
                        data-testid={`button-dot-${index}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
