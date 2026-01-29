import { Helmet } from "react-helmet-async";
import type { Event } from "@shared/schema";

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  event?: Event;
  keywords?: string[];
  author?: string;
  noindex?: boolean;
  canonicalUrl?: string;
}

const defaultImage = "/kncci_logo-removebg-preview.png";
const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
const siteName = "KNCCI Uasin Gishu Chapter";

export function SEOHead({
  title,
  description,
  image = defaultImage,
  url,
  type = "website",
  event,
  keywords = [],
  author = "KNCCI Uasin Gishu Chapter",
  noindex = false,
  canonicalUrl,
}: SEOHeadProps) {
  const fullTitle = title
    ? `${title} | ${siteName}`
    : `${siteName} - Eldoret International Business Summit 2026`;
  
  const fullDescription =
    description ||
    event?.description ||
    "Join The Eldoret International Business Summit 2026 - Gateway to Africa's Trade and Economic Future. Three days of networking, workshops, and policy discussions in Eldoret, The City of Champions.";
  
  const fullUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const fullImage = image.startsWith("http") ? image : `${siteUrl}${image}`;
  const canonical = canonicalUrl || fullUrl;

  // Default keywords
  const defaultKeywords = [
    "KNCCI",
    "Kenya National Chamber of Commerce and Industry",
    "Eldoret",
    "Business Summit",
    "Uasin Gishu",
    "Kenya Business",
    "Trade",
    "Investment",
    "Networking",
    "Business Conference",
    "East Africa",
  ];

  const allKeywords = [...defaultKeywords, ...keywords].join(", ");

  // Event-specific data
  const eventStartDate = event?.date ? new Date(event.date).toISOString() : undefined;
  const eventEndDate = event?.endDate ? new Date(event.endDate).toISOString() : undefined;
  const eventLocation = event?.location || event?.venue;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={allKeywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />

      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_KE" />
      {eventStartDate && <meta property="og:updated_time" content={eventStartDate} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:image:alt" content={fullTitle} />

      {/* Event-specific meta tags */}
      {event && (
        <>
          <meta name="event:start_time" content={eventStartDate} />
          {eventEndDate && <meta name="event:end_time" content={eventEndDate} />}
          {eventLocation && <meta name="event:location" content={eventLocation} />}
        </>
      )}

      {/* Geographic targeting */}
      <meta name="geo.region" content="KE-44" />
      <meta name="geo.placename" content="Eldoret" />
      <meta name="geo.position" content="0.5134;35.2923" />
      <meta name="ICBM" content="0.5134, 35.2923" />

      {/* Mobile optimization */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content={siteName} />
      <meta name="theme-color" content="#1a1a1a" />
    </Helmet>
  );
}
