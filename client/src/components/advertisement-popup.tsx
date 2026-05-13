import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { advertisementService } from "@/services/advertisement-service";
import type { Advertisement } from "@/types/advertisement";

const AD_DISMISS_KEY = "kncci_ad_dismissed";
const IS_DEV = import.meta.env.DEV;

const DEV_FALLBACK_AD: Advertisement = {
  _id: "dev-fallback-ad",
  tenantId: "69e37354ae0d3b8019eb1625",
  title: "Eldoret International Business Summit 2026",
  badgeText: "Featured Event",
  description:
    "Join 5000+ business leaders, 200+ speakers, and 200+ exhibitors at the flagship trade summit in Eldoret. July 23–25, 2026.",
  imageUrl:
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
  ctaLabel: "Register Now",
  ctaUrl: "/events",
  openInNewTab: false,
  placement: "homepage",
  priority: 1,
  isActive: true,
  dismissible: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export function AdvertisementPopup() {
  const [ad, setAd] = useState<Advertisement | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dismissedId = localStorage.getItem(AD_DISMISS_KEY);

    advertisementService
      .getActivePopup()
      .then((data) => {
        if (IS_DEV) {
          console.log("[Advertisement] CMS response:", data);
          console.log("[Advertisement] Dismissed ID:", dismissedId);
        }

        if (data && data._id !== dismissedId) {
          setAd(data);
          setTimeout(() => setOpen(true), 1500);
        } else if (!data && IS_DEV) {
          // Dev fallback so designers can see the popup without CMS data
          console.log("[Advertisement] No active CMS ad found, using dev fallback.");
          if (DEV_FALLBACK_AD._id !== dismissedId) {
            setAd(DEV_FALLBACK_AD);
            setTimeout(() => setOpen(true), 1500);
          }
        }
      })
      .catch((err) => {
        if (IS_DEV) {
          console.error("[Advertisement] Failed to fetch:", err);
          // Dev fallback when CMS is unreachable (CORS, network, etc.)
          console.log("[Advertisement] Using dev fallback due to error.");
          if (DEV_FALLBACK_AD._id !== dismissedId) {
            setAd(DEV_FALLBACK_AD);
            setTimeout(() => setOpen(true), 1500);
          }
        }
      });
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleDismiss = () => {
    if (ad) {
      localStorage.setItem(AD_DISMISS_KEY, ad._id);
    }
    setOpen(false);
  };

  if (!ad) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-4xl p-0 overflow-hidden gap-0 border-0 rounded-[2rem] bg-white/95 dark:bg-slate-950/95 shadow-[0_35px_120px_-35px_rgba(15,23,42,0.65)] backdrop-blur-xl">
        <div className="relative grid md:grid-cols-[1.15fr_0.85fr]">
          {/* Dismiss button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-slate-950/55 text-white backdrop-blur-md transition-colors hover:bg-slate-950/75"
            aria-label="Dismiss advertisement"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Image */}
          {ad.imageUrl && (
            <div className="relative min-h-[240px] overflow-hidden bg-slate-950 md:min-h-[440px]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.3),transparent_35%),linear-gradient(135deg,rgba(15,23,42,0.1),rgba(15,23,42,0.7))]" />
              <img
                src={ad.imageUrl}
                alt={ad.title}
                className="relative z-10 h-full w-full object-contain p-4 md:p-6"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-24 bg-gradient-to-r from-transparent to-white/90 dark:to-slate-950/90 md:block" />
            </div>
          )}

          {/* Content */}
          <div className="relative flex flex-col justify-center bg-white px-6 py-7 dark:bg-slate-950 md:px-8 md:py-10">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent md:left-0 md:right-auto md:top-8 md:h-[calc(100%-4rem)] md:w-px md:bg-gradient-to-b" />
            <div className="space-y-5 md:pl-4">
              {ad.badgeText && (
                <span className="inline-flex w-fit items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-primary">
                  {ad.badgeText}
                </span>
              )}

              <div className="space-y-3">
                <DialogTitle className="text-2xl font-black leading-tight tracking-tight text-foreground md:text-[2rem]">
                  {ad.title}
                </DialogTitle>
                <DialogDescription className="text-sm leading-7 text-slate-600 dark:text-slate-300 md:text-[15px]">
                  {ad.description}
                </DialogDescription>
              </div>

              {ad.ctaUrl && (
                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <Button asChild className="h-11 rounded-xl px-6 text-sm font-bold shadow-lg shadow-primary/20">
                    <a
                      href={ad.ctaUrl}
                      target={ad.openInNewTab ? "_blank" : "_self"}
                      rel={ad.openInNewTab ? "noopener noreferrer" : undefined}
                      onClick={handleDismiss}
                    >
                      {ad.ctaLabel || "Learn More"}
                    </a>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 rounded-xl border-border/50 px-6 text-sm font-bold"
                    onClick={handleDismiss}
                  >
                    Maybe later
                  </Button>
                </div>
              )}

              <button
                onClick={handleDismiss}
                className="w-fit pt-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Don&apos;t show this again
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
