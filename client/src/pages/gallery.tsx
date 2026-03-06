import { useState, useMemo } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEOHead } from "@/components/seo/seo-head";
import { staticGallery } from "@/data/static-data";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, Filter, Calendar, Camera } from "lucide-react";
import type { GalleryImage } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

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
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="group relative overflow-hidden rounded-2xl cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            onClick={onClick}
        >
            <div className={`aspect-[4/5] sm:aspect-square bg-gradient-to-br ${gradient} relative`}>
                {hasImage ? (
                    <img
                        src={image.url}
                        alt={`${image.eventName} ${image.year} - ${image.alt}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center p-4">
                            <Camera className="w-8 h-8 mx-auto mb-2 text-primary/40" />
                            <p className="text-xs text-muted-foreground">{image.alt}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Overlay with info */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <span className="inline-block px-2 py-0.5 rounded-full bg-primary/20 backdrop-blur-md text-[10px] font-bold text-primary-foreground uppercase tracking-widest mb-2 border border-white/10">
                        {image.year}
                    </span>
                    <h3 className="text-white font-bold text-lg leading-tight uppercase tracking-tight">{image.eventName}</h3>
                    <p className="text-white/70 text-sm mt-1 line-clamp-2 italic">"{image.alt}"</p>
                </motion.div>
            </div>

            {/* Year badge (visible by default) */}
            <div className="absolute top-4 right-4 z-10">
                <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20 text-xs font-medium">
                    {image.year}
                </span>
            </div>
        </motion.div>
    );
}

export default function GalleryPage() {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [filterYear, setFilterYear] = useState<string | "all">("all");
    const [filterEvent, setFilterEvent] = useState<string | "all">("all");

    const years = useMemo(() => {
        const uniqueYears = Array.from(new Set(staticGallery.map(img => img.year))).sort((a, b) => b.localeCompare(a));
        return uniqueYears;
    }, []);

    const eventNames = useMemo(() => {
        const uniqueEvents = Array.from(new Set(staticGallery.map(img => img.eventName))).sort();
        return uniqueEvents;
    }, []);

    const filteredImages = useMemo(() => {
        return staticGallery.filter(img => {
            const matchesYear = filterYear === "all" || img.year === filterYear;
            const matchesEvent = filterEvent === "all" || img.eventName === filterEvent;
            return matchesYear && matchesEvent;
        });
    }, [filterYear, filterEvent]);

    const openLightbox = (image: GalleryImage) => {
        const index = filteredImages.findIndex(img => img.id === image.id);
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
                    {/* Header section */}
                    <section className="py-20 bg-slate-50 dark:bg-slate-900/40 border-b border-border">
                        <div className="container mx-auto px-4">
                            <div className="max-w-4xl mx-auto text-center">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <span className="text-primary font-bold text-sm uppercase tracking-widest block mb-4">Visual History</span>
                                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
                                        Event <span className="text-primary">Gallery</span>
                                    </h1>
                                    <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                                        A collection of moments reflecting our commitment to business growth and economic transformation.
                                    </p>
                                </motion.div>
                            </div>

                            {/* Filter Bar - Matches Events/Marketplace Style */}
                            <div className="mt-12 max-w-5xl mx-auto">
                                <div className="flex flex-col lg:flex-row gap-4 p-2 bg-background rounded-2xl shadow-xl border border-border">
                                    <div className="flex items-center gap-3 px-4 py-2 lg:py-0 border-b lg:border-b-0 lg:border-r border-border">
                                        <Camera className="w-5 h-5 text-primary" />
                                        <span className="font-bold text-xs uppercase tracking-wider text-muted-foreground whitespace-nowrap">Filter Gallery</span>
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-4 flex-1">
                                        {/* Year Filter */}
                                        <div className="relative flex-1">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                                            <select
                                                value={filterYear}
                                                onChange={(e) => setFilterYear(e.target.value)}
                                                className="w-full pl-12 pr-10 h-14 bg-transparent border-none focus:ring-0 text-lg rounded-xl appearance-none cursor-pointer"
                                            >
                                                <option value="all">All Years</option>
                                                {years.map(year => (
                                                    <option key={year} value={year}>{year}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <ChevronRight className="w-4 h-4 text-muted-foreground rotate-90" />
                                            </div>
                                        </div>

                                        <div className="h-10 w-px bg-border hidden md:block self-center" />

                                        {/* Event Filter */}
                                        <div className="relative flex-1">
                                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                                            <select
                                                value={filterEvent}
                                                onChange={(e) => setFilterEvent(e.target.value)}
                                                className="w-full pl-12 pr-10 h-14 bg-transparent border-none focus:ring-0 text-lg rounded-xl appearance-none cursor-pointer"
                                            >
                                                <option value="all">All Events</option>
                                                {eventNames.map(event => (
                                                    <option key={event} value={event}>{event}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <ChevronRight className="w-4 h-4 text-muted-foreground rotate-90" />
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="h-14 px-8 rounded-xl font-bold border-primary text-primary hover:bg-primary/5"
                                        onClick={() => { setFilterYear("all"); setFilterEvent("all"); }}
                                    >
                                        Reset Filters
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="container mx-auto px-4 py-24">

                        {/* Gallery Grid */}
                        <AnimatePresence mode="popLayout">
                            {filteredImages.length > 0 ? (
                                <motion.div
                                    layout
                                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
                                >
                                    {filteredImages.map((image, index) => (
                                        <GalleryCard
                                            key={image.id}
                                            image={image}
                                            index={index}
                                            onClick={() => openLightbox(image)}
                                        />
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="py-32 text-center"
                                >
                                    <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Camera className="w-10 h-10 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-foreground mb-2">No images found</h3>
                                    <p className="text-muted-foreground">Try adjusting your filters to find what you're looking for.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </main>

                <Footer />

                {/* Lightbox */}
                <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
                    <DialogContent className="max-w-6xl p-0 bg-black/95 border-0 rounded-none sm:rounded-3xl overflow-hidden">
                        <div className="relative group">
                            <Button
                                size="icon"
                                variant="ghost"
                                className="absolute top-6 right-6 z-20 text-white hover:bg-white/20 bg-black/40 backdrop-blur-md rounded-full transition-transform hover:scale-110"
                                onClick={() => setLightboxOpen(false)}
                            >
                                <X className="w-6 h-6" />
                            </Button>

                            <div className="flex flex-col md:flex-row min-h-[50vh] md:h-[80vh]">
                                {/* Image Container */}
                                <div className="flex-1 relative bg-black flex items-center justify-center p-4">
                                    {currentImage && (
                                        <motion.div
                                            key={currentImage.id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="relative w-full h-full flex items-center justify-center"
                                        >
                                            {currentImage.url ? (
                                                <img
                                                    src={currentImage.url}
                                                    alt={currentImage.alt}
                                                    className="max-w-full max-h-full object-contain shadow-2xl"
                                                />
                                            ) : (
                                                <div className={`w-full h-full rounded-2xl bg-gradient-to-br ${gradientColors[currentIndex % gradientColors.length]} flex items-center justify-center`}>
                                                    <Camera className="w-20 h-20 text-white/20" />
                                                </div>
                                            )}

                                            {/* Controls Overlay */}
                                            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 pointer-events-none">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="pointer-events-auto h-12 w-12 text-white hover:bg-white/20 bg-black/40 backdrop-blur-md rounded-full transition-transform hover:scale-110"
                                                    onClick={goPrev}
                                                >
                                                    <ChevronLeft className="w-8 h-8" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="pointer-events-auto h-12 w-12 text-white hover:bg-white/20 bg-black/40 backdrop-blur-md rounded-full transition-transform hover:scale-110"
                                                    onClick={goNext}
                                                >
                                                    <ChevronRight className="w-8 h-8" />
                                                </Button>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Info Panel (Sidebar Desktop / Bottom Mobile) */}
                                {currentImage && (
                                    <div className="w-full md:w-80 bg-background/5 p-8 backdrop-blur-xl border-t md:border-t-0 md:border-l border-white/10 flex flex-col justify-between">
                                        <div>
                                            <div className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary-foreground text-xs font-bold uppercase tracking-widest mb-4">
                                                {currentImage.year}
                                            </div>
                                            <h2 className="text-2xl font-bold text-white mb-4 leading-tight uppercase tracking-tight">
                                                {currentImage.eventName}
                                            </h2>
                                            <div className="h-1 w-12 bg-primary rounded-full mb-6" />
                                            <p className="text-white/70 italic text-lg leading-relaxed">
                                                "{currentImage.alt}"
                                            </p>
                                        </div>

                                        <div className="mt-8 pt-8 border-t border-white/10">
                                            <p className="text-white/40 text-xs uppercase tracking-widest font-bold mb-4">
                                                Image {currentIndex + 1} of {filteredImages.length}
                                            </p>
                                            <div className="grid grid-cols-5 gap-2">
                                                {filteredImages.slice(Math.max(0, currentIndex - 2), Math.min(filteredImages.length, currentIndex + 3)).map((img, i) => (
                                                    <div
                                                        key={img.id}
                                                        onClick={() => setCurrentIndex(filteredImages.indexOf(img))}
                                                        className={cn(
                                                            "aspect-square rounded-md overflow-hidden cursor-pointer border-2 transition-all",
                                                            filteredImages.indexOf(img) === currentIndex ? "border-primary scale-110" : "border-transparent opacity-50 hover:opacity-100"
                                                        )}
                                                    >
                                                        <img src={img.url} className="w-full h-full object-cover" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}
