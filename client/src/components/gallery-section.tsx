import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { websiteContentService } from "@/services/website-content-service";
import type { WebsiteGalleryItem } from "@/types/content";

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
  onClick,
}: {
  image: WebsiteGalleryItem;
  index: number;
  onClick: () => void;
}) {
  const gradient = gradientColors[index % gradientColors.length];
  const hasImage = image.url && image.url.trim() !== "";

  return (
    <div
      className="group relative cursor-pointer overflow-hidden rounded-lg hover-elevate"
      onClick={onClick}
      data-testid={`card-gallery-${image._id}`}
    >
      <div className={`relative aspect-square bg-gradient-to-br ${gradient}`}>
        {hasImage ? (
          <img
            src={image.url}
            alt={`${image.eventName} ${image.year} - ${image.alt}`}
            className="h-full w-full object-cover"
            loading="lazy"
            width={400}
            height={400}
            decoding="async"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="p-4 text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                <span className="text-lg font-bold text-foreground">{index + 1}</span>
              </div>
              <p className="text-xs text-muted-foreground">{image.alt}</p>
            </div>
          </div>
        )}
      </div>
      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/0 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div>
          <p className="font-semibold text-white" data-testid={`text-gallery-name-${image._id}`}>{image.eventName}</p>
          <p className="text-sm text-white/70" data-testid={`text-gallery-year-${image._id}`}>{image.year}</p>
        </div>
      </div>
    </div>
  );
}

export function GallerySection() {
  const [galleryImages, setGalleryImages] = useState<WebsiteGalleryItem[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const items = await websiteContentService.getGallery();
        setGalleryImages(items.slice(0, 8));
      } catch {
        setGalleryImages([]);
      }
    };

    void loadGallery();
  }, []);

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
      className="bg-accent/30 py-20 sm:py-28"
      data-testid="section-gallery"
    >
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Event Gallery
          </span>
          <h2 className="mt-4 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl" data-testid="text-gallery-title">
            Moments from Past Events
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Explore highlights from our previous events and get a glimpse of what
            to expect at KNCCI Uasin Gishu gatherings.
          </p>
        </div>

        {galleryImages.length > 0 ? (
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {galleryImages.map((image, index) => (
              <GalleryCard
                key={image._id}
                image={image}
                index={index}
                onClick={() => openLightbox(index)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border px-6 py-12 text-center text-muted-foreground">
            Gallery images will appear here once they are added by the admin team.
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href="/gallery">
            <Button size="lg" className="rounded-full px-8 font-bold">
              View Full Gallery
            </Button>
          </Link>
        </div>

        <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
          <DialogContent className="max-w-4xl border-0 bg-black/95 p-0">
            <div className="relative">
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-4 top-4 z-10 text-white hover:bg-white/20"
                onClick={() => setLightboxOpen(false)}
                data-testid="button-close-lightbox"
              >
                <X className="h-5 w-5" />
              </Button>

              {currentImage && (
                <>
                  <div className="relative flex aspect-video items-center justify-center bg-black">
                    {currentImage.url && currentImage.url.trim() !== "" ? (
                      <>
                        <img
                          src={currentImage.url}
                          alt={`${currentImage.eventName} ${currentImage.year} - ${currentImage.alt}`}
                          className="h-full w-full object-contain"
                          data-testid="image-lightbox"
                          loading="eager"
                          fetchPriority="high"
                          width={1200}
                          height={800}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6">
                          <p className="mb-1 text-2xl font-bold text-white" data-testid="text-lightbox-name">{currentImage.eventName}</p>
                          <p className="text-white/70" data-testid="text-lightbox-year">{currentImage.year}</p>
                          <p className="mt-2 text-sm text-white/60">{currentImage.alt}</p>
                        </div>
                      </>
                    ) : (
                      <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradientColors[currentIndex % gradientColors.length]}`}>
                        <div className="text-center text-white">
                          <p className="mb-2 text-2xl font-bold" data-testid="text-lightbox-name">{currentImage.eventName}</p>
                          <p className="text-white/70" data-testid="text-lightbox-year">{currentImage.year}</p>
                          <p className="mt-4 text-sm text-white/50">{currentImage.alt}</p>
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
                      <ChevronLeft className="h-6 w-6" />
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
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </div>

                  <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                    {galleryImages.map((_, index) => (
                      <button
                        key={index}
                        className={`h-2 w-2 rounded-full transition-colors ${
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
