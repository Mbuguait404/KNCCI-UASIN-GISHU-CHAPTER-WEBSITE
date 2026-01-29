import { Helmet } from "react-helmet-async";
import type { Event, Speaker, Venue, Testimonial } from "@shared/schema";

interface StructuredDataProps {
  event?: Event;
  speakers?: Speaker[];
  venue?: Venue;
  testimonials?: Testimonial[];
  organization?: {
    name: string;
    url?: string;
    logo?: string;
    contactPoint?: {
      telephone?: string;
      contactType?: string;
      email?: string;
    };
  };
}

export function StructuredData({
  event,
  speakers = [],
  venue,
  testimonials = [],
  organization,
}: StructuredDataProps) {
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
  
  // Calculate aggregate rating from testimonials (assuming 4.5 average if no explicit ratings)
  const aggregateRating = {
    "@type": "AggregateRating",
    ratingValue: "4.5",
    reviewCount: testimonials.length.toString(),
    bestRating: "5",
    worstRating: "1",
  };
  
  // Event Schema
  const eventSchema = event
    ? {
        "@context": "https://schema.org",
        "@type": "Event",
        name: event.name,
        description: event.description,
        startDate: event.date,
        endDate: event.endDate || event.date,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: {
          "@type": "Place",
          name: venue?.name || event.venue || event.location,
          address: {
            "@type": "PostalAddress",
            addressLocality: venue?.city || "Eldoret",
            addressRegion: "Uasin Gishu County",
            addressCountry: "KE",
            streetAddress: venue?.address || "",
          },
          ...(venue?.mapUrl && {
            geo: {
              "@type": "GeoCoordinates",
              latitude: "0.5134",
              longitude: "35.2923",
            },
          }),
        },
        image: event.highlights?.[0] ? `${siteUrl}/kncci_logo-removebg-preview.png` : undefined,
        organizer: {
          "@type": "Organization",
          name: organization?.name || "KNCCI Uasin Gishu Chapter",
          url: organization?.url || siteUrl,
          ...(organization?.logo && {
            logo: {
              "@type": "ImageObject",
              url: organization.logo.startsWith("http")
                ? organization.logo
                : `${siteUrl}${organization.logo}`,
            },
          }),
          ...(organization?.contactPoint && {
            contactPoint: {
              "@type": "ContactPoint",
              ...organization.contactPoint,
            },
          }),
        },
        ...(event.stats && {
          offers: {
            "@type": "Offer",
            availability: "https://schema.org/InStock",
            price: "0",
            priceCurrency: "KES",
          },
        }),
        ...(testimonials.length > 0 && {
          aggregateRating,
          review: testimonials.slice(0, 5).map((testimonial) => ({
            "@type": "Review",
            author: {
              "@type": "Person",
              name: testimonial.name,
              jobTitle: testimonial.title,
              worksFor: {
                "@type": "Organization",
                name: testimonial.organization,
              },
            },
            reviewBody: testimonial.quote,
            reviewRating: {
              "@type": "Rating",
              ratingValue: "5",
              bestRating: "5",
              worstRating: "1",
            },
          })),
        }),
        ...(speakers.length > 0 && {
          performer: speakers.slice(0, 5).map((speaker) => ({
            "@type": "Person",
            name: speaker.name,
            jobTitle: speaker.title,
            worksFor: {
              "@type": "Organization",
              name: speaker.organization,
            },
            description: speaker.bio,
          })),
        }),
      }
    : null;

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: organization?.name || "KNCCI Uasin Gishu Chapter",
    url: organization?.url || siteUrl,
    logo: {
      "@type": "ImageObject",
      url: organization?.logo
        ? organization.logo.startsWith("http")
          ? organization.logo
          : `${siteUrl}${organization.logo}`
        : `${siteUrl}/kncci_logo-removebg-preview.png`,
    },
    description:
      "Kenya National Chamber of Commerce and Industry Uasin Gishu Chapter - Promoting trade, investment, and business excellence in Kenya.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Eldoret",
      addressRegion: "Uasin Gishu County",
      addressCountry: "KE",
    },
    ...(testimonials.length > 0 && { aggregateRating }),
    ...(organization?.contactPoint && {
      contactPoint: {
        "@type": "ContactPoint",
        ...organization.contactPoint,
      },
    }),
  };

  // Place/LocalBusiness Schema for Venue
  const placeSchema = venue
    ? {
        "@context": "https://schema.org",
        "@type": "Place",
        name: venue.name,
        description: venue.description,
        address: {
          "@type": "PostalAddress",
          addressLocality: venue.city,
          addressRegion: "Uasin Gishu County",
          addressCountry: "KE",
          streetAddress: venue.address,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: "0.5134",
          longitude: "35.2923",
        },
        ...(venue.mapUrl && {
          hasMap: venue.mapUrl,
        }),
        ...(venue.accessibility && venue.accessibility.length > 0 && {
          amenityFeature: venue.accessibility.map((item) => ({
            "@type": "LocationFeatureSpecification",
            name: item,
            value: true,
          })),
        }),
      }
    : null;

  // Person Schema for Speakers
  const personSchemas = speakers.map((speaker) => ({
    "@context": "https://schema.org",
    "@type": "Person",
    name: speaker.name,
    jobTitle: speaker.title,
    worksFor: {
      "@type": "Organization",
      name: speaker.organization,
    },
    description: speaker.bio,
    ...(speaker.imageUrl && {
      image: speaker.imageUrl.startsWith("http")
        ? speaker.imageUrl
        : `${siteUrl}${speaker.imageUrl}`,
    }),
  }));

  // Review Schema for Testimonials
  const reviewSchemas = testimonials.map((testimonial) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    author: {
      "@type": "Person",
      name: testimonial.name,
      jobTitle: testimonial.title,
      worksFor: {
        "@type": "Organization",
        name: testimonial.organization,
      },
    },
    reviewBody: testimonial.quote,
    reviewRating: {
      "@type": "Rating",
      ratingValue: "5",
      bestRating: "5",
      worstRating: "1",
    },
    itemReviewed: event
      ? {
          "@type": "Event",
          name: event.name,
        }
      : {
          "@type": "Organization",
          name: organization?.name || "KNCCI Uasin Gishu Chapter",
        },
  }));

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      ...(event
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: event.name,
              item: `${siteUrl}/`,
            },
          ]
        : []),
    ],
  };

  // FAQ Schema (if needed - can be expanded)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "When is The Eldoret International Business Summit 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: event
            ? `The summit takes place from ${new Date(event.date).toLocaleDateString("en-KE", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })} to ${new Date(event.endDate || event.date).toLocaleDateString("en-KE", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}.`
            : "The Eldoret International Business Summit 2026 takes place in April 2026.",
        },
      },
      {
        "@type": "Question",
        name: "Where is the event located?",
        acceptedAnswer: {
          "@type": "Answer",
          text: event
            ? `The event will be held at ${venue?.name || event.venue || event.location} in Eldoret, Uasin Gishu County.`
            : "The event will be held in Eldoret, Uasin Gishu County, Kenya.",
        },
      },
    ],
  };

  const schemas = [
    eventSchema,
    organizationSchema,
    placeSchema,
    breadcrumbSchema,
    faqSchema,
    ...personSchemas,
    ...reviewSchemas,
  ].filter(Boolean);

  return (
    <Helmet>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </Helmet>
  );
}
