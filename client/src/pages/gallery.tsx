import { useEffect, useMemo, useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEOHead } from "@/components/seo/seo-head";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Camera, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
      onClick={onClick}
    >
      <div className={`relative aspect-[4/5] bg-gradient-to-br sm:aspect-square ${gradient}`}>
        {hasImage ? (
          <img
            src={image.url}
            alt={`${image.eventName} ${image.year} - ${image.alt}`}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="p-4 text-center">
              <Camera className="mx-auto mb-2 h-8 w-8 text-primary/40" />
              <p className="text-xs text-muted-foreground">{image.alt}</p>
            </div>
          </div>
        )}
      </div>

      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/20 to-transparent p-6 opacity-0 transition-all duration-500 group-hover:opacity-100">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileHover={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <span className="mb-2 inline-block rounded-full border border-white/10 bg-primary/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary-foreground backdrop-blur-md">
            {image.year}
          </span>
          <h3 className="text-lg font-bold uppercase tracking-tight text-white">{image.eventName}</h3>
          <p className="mt-1 line-clamp-2 text-sm italic text-white/70">"{image.alt}"</p>
        </motion.div>
      </div>

      <div className="absolute right-4 top-4 z-10">
        <span className="rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
          {image.year}
        </span>
      </div>
    </motion.div>
  );
}

export default function GalleryPage() {
  const [images, setImages] = useState<WebsiteGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filterYear, setFilterYear] = useState<string | "all">("all");
  const [filterEvent, setFilterEvent] = useState<string | "all">("all");

  useEffect(() => {
    const loadGallery = async () => {
      setLoading(true);
      try {
        const data = await websiteContentService.getGallery();
        setImages(data);
      } catch {
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    void loadGallery();
  }, []);

  const years = useMemo(
    () => Array.from(new Set(images.map((image) => image.year))).sort((a, b) => b.localeCompare(a)),
    [images],
  );

  const eventNames = useMemo(
    () => Array.from(new Set(images.map((image) => image.eventName))).sort(),
    [images],
  );

  const filteredImages = useMemo(
    () =>
      images.filter((image) => {
        const matchesYear = filterYear === "all" || image.year === filterYear;
        const matchesEvent = filterEvent === "all" || image.eventName === filterEvent;
        return matchesYear && matchesEvent;
      }),
    [images, filterEvent, filterYear],
  );

  const openLightbox = (image: WebsiteGalleryItem) => {
    const index = filteredImages.findIndex((item) => item._id === image._id);
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredImages.length);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  };

  const currentImage = filteredImages[currentIndex];

  return (
    <>
      <SEOHead
        title="Event Gallery | KNCCI Uasin Gishu Chapter"
        description="Browse through the visual highlights of our business summits, trade expos, and networking events. Experience the impact of KNCCI Uasin Gishu Chapter in pictures."
        keywords={["KNCCI Gallery", "Business Summit Photos", "Eldoret Events Gallery", "Trade Expo Highlights"]}
        canonicalUrl={typeof window !== "undefined" ? `${window.location.origin}/gallery` : ""}
      />

      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="pt-20">
          <section className="border-b border-border bg-slate-50 py-20 dark:bg-slate-900/40">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-4xl text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="mb-4 block text-sm font-bold uppercase tracking-widest text-primary">Visual History</span>
                  <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-6xl">
                    Event <span className="text-primary">Gallery</span>
                  </h1>
                  <p className="mx-auto max-w-2xl text-xl leading-relaxed text-muted-foreground">
                    A collection of moments reflecting our commitment to business growth and economic transformation.
                  </p>
                </motion.div>
              </div>

              <div className="mx-auto mt-12 max-w-5xl">
                <div className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-2 shadow-xl lg:flex-row">
                  <div className="flex items-center gap-3 border-b border-border px-4 py-2 lg:border-b-0 lg:border-r lg:py-0">
                    <Camera className="h-5 w-5 text-primary" />
                    <span className="whitespace-nowrap text-xs font-bold uppercase tracking-wider text-muted-foreground">Filter Gallery</span>
                  </div>

                  <div className="flex flex-1 flex-col gap-4 md:flex-row">
                    <div className="relative flex-1">
                      <Calendar className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <select
                        value={filterYear}
                        onChange={(event) => setFilterYear(event.target.value)}
                        className="h-14 w-full cursor-pointer appearance-none rounded-xl bg-transparent pl-12 pr-10 text-lg outline-none"
                      >
                        <option value="all">All Years</option>
                        {years.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                        <ChevronRight className="h-4 w-4 rotate-90 text-muted-foreground" />
                      </div>
                    </div>

                    <div className="hidden h-10 w-px self-center bg-border md:block" />

                    <div className="relative flex-1">
                      <Camera className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <select
                        value={filterEvent}
                        onChange={(event) => setFilterEvent(event.target.value)}
                        className="h-14 w-full cursor-pointer appearance-none rounded-xl bg-transparent pl-12 pr-10 text-lg outline-none"
                      >
                        <option value="all">All Events</option>
                        {eventNames.map((eventName) => (
                          <option key={eventName} value={eventName}>
                            {eventName}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                        <ChevronRight className="h-4 w-4 rotate-90 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-20">
            <div className="container mx-auto px-4">
              {loading ? (
                <div className="py-20 text-center text-muted-foreground">Loading gallery...</div>
              ) : filteredImages.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-border px-6 py-16 text-center text-muted-foreground">
                  No gallery images match your current filters.
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                    {filteredImages.map((image, index) => (
                      <GalleryCard
                        key={image._id}
                        image={image}
                        index={index}
                        onClick={() => openLightbox(image)}
                      />
                    ))}
                  </div>
                </AnimatePresence>
              )}
            </div>
          </section>
        </main>

        <Footer />

        <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
          <DialogContent className="max-w-5xl border-0 bg-black/95 p-0">
            <div className="relative">
              {currentImage && (
                <>
                  <div className="relative flex aspect-video items-center justify-center bg-black">
                    <img
                      src={currentImage.url}
                      alt={`${currentImage.eventName} ${currentImage.year} - ${currentImage.alt}`}
                      className="h-full w-full object-contain"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6">
                      <p className="mb-1 text-2xl font-bold text-white">{currentImage.eventName}</p>
                      <p className="text-white/70">{currentImage.year}</p>
                      <p className="mt-2 text-sm text-white/60">{currentImage.alt}</p>
                    </div>
                  </div>

                  <button
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
                    onClick={goPrev}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
                    onClick={goNext}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
