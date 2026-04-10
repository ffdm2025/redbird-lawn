// src/lib/schema.ts
// Builds LocalBusiness JSON-LD schema from canonical NAP constants.
// NEVER hard-code phone, name, or address here — always import from constants.ts.
import { NAP, SITE_URL, SOCIAL } from './constants';

export function buildLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
    "@id": `${SITE_URL}/#business`,
    "name": NAP.name,
    "url": SITE_URL,
    "telephone": NAP.phone,
    "email": NAP.email,
    "image": `${SITE_URL}/og-image.png`,
    "priceRange": "$$",
    "description": "Residential lawn care services in Wentzville, MO and surrounding areas including O'Fallon, Lake Saint Louis, Troy, and Foristell.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": NAP.address.city,
      "addressRegion": NAP.address.state,
      "postalCode": NAP.address.zip,
      "addressCountry": NAP.address.country
    },
    "areaServed": [
      { "@type": "City", "name": "Wentzville, MO" },
      { "@type": "City", "name": "O'Fallon, MO" },
      { "@type": "City", "name": "Lake Saint Louis, MO" },
      { "@type": "City", "name": "Troy, MO" },
      { "@type": "City", "name": "Foristell, MO" }
    ],
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "08:00",
        "closes": "18:00"
      }
    ],
    "sameAs": [
      SOCIAL.facebook,
      SOCIAL.gbp
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": "3",
      "bestRating": "5"
    }
  } as const;
}

export interface ArticleSchemaProps {
  title: string;
  excerpt: string;
  slug: string;
  datePublished: Date;
  dateModified?: Date;
  authorName?: string;
}

export function buildArticleSchema(props: ArticleSchemaProps) {
  const { title, excerpt, slug, datePublished, dateModified, authorName = 'Alberto Murillo' } = props;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": excerpt,
    "url": `${SITE_URL}/blog/${slug}`,
    "datePublished": datePublished.toISOString(),
    "dateModified": (dateModified ?? datePublished).toISOString(),
    "author": {
      "@type": "Person",
      "name": authorName,
      "jobTitle": "Owner",
      "worksFor": {
        "@type": "LocalBusiness",
        "@id": `${SITE_URL}/#business`,
        "name": NAP.name,
      },
      "knowsAbout": [
        "lawn care",
        "lawn mowing",
        "turfgrass management",
        "residential landscaping",
        "cool-season grass maintenance"
      ],
    },
    "publisher": {
      "@type": "Organization",
      "name": NAP.name,
      "url": SITE_URL,
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${slug}`,
    },
    "about": {
      "@type": "Thing",
      "name": "Lawn Care",
      "sameAs": "https://en.wikipedia.org/wiki/Lawn"
    },
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": [".prose h2", ".prose p:first-of-type"]
    },
  } as const;
}

export function buildFAQSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How much does lawn mowing cost in Wentzville?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Every yard is different. Lot size, grass type, and frequency all factor into the price. Redbird Lawn Service provides free, no-obligation quotes so you know exactly what to expect before we ever show up. No surprises on your bill."
        }
      },
      {
        "@type": "Question",
        "name": "Do you require contracts?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Redbird Lawn Service believes in earning your business every week, not locking you in. Whether you need weekly service or a one-time cleanup, there is no contract and no cancellation fee."
        }
      },
      {
        "@type": "Question",
        "name": "What areas do you serve?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Redbird Lawn Service serves residential homes in Wentzville, O'Fallon, Lake Saint Louis, Troy, and Foristell. If you are in St. Charles County and are unsure whether we cover your neighborhood, call (314) 497-6152 and we will let you know right away."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need to provide any equipment?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Redbird Lawn Service brings all professional-grade equipment to every job. Mowers, trimmers, edgers, blowers. All you need to do is let us know when to show up."
        }
      },
      {
        "@type": "Question",
        "name": "How much does sod installation cost in Wentzville?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Cost depends on yard size, soil condition, and sod variety. Most residential sod jobs in the Wentzville area run between $1 to $2 per square foot installed, including soil prep and cleanup. Redbird Lawn Service provides free on-site estimates so you know the exact price before any work begins."
        }
      },
      {
        "@type": "Question",
        "name": "How long does new sod take to establish?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "In warm weather (May through August), new sod typically roots in 10 to 14 days. In cooler fall temperatures, it can take 3 to 4 weeks. Redbird Lawn Service provides a post-install care guide with watering instructions to help your new lawn establish quickly."
        }
      }
    ]
  } as const;
}

export function buildServiceSchema() {
  const services = [
    {
      name: "Weekly Lawn Mowing in Wentzville, MO",
      description: "Professional weekly mowing service including mow to optimal height for grass type, edge along driveways, walkways, and beds, blow clippings off hard surfaces, and visual inspection for lawn issues.",
    },
    {
      name: "Trimming and Edging Service in Wentzville, MO",
      description: "Sharp, clean lines around fence lines, trees, flower beds, and tight corners. Includes string trimming, rotary edging along all hard surfaces, and debris cleanup.",
    },
    {
      name: "Mulch and Bed Maintenance in Wentzville, MO",
      description: "Weed pulling, bed re-edging, fresh mulch installation at 2 to 3 inch depth, shrub trimming, and debris haul-away for residential properties.",
    },
    {
      name: "Seasonal Lawn Cleanup in Wentzville, MO",
      description: "Spring and fall cleanup services including leaf removal, dethatching, aeration, final mow, gutter blowout, and debris haul-away.",
    },
    {
      name: "Sod Installation in Wentzville, MO",
      description: "Professional sod installation including old lawn removal, soil grading and leveling, compost amendment, fresh sod laying with seamless seams, sod rolling, and post-install care guidance.",
    },
  ];

  return services.map((service) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.name,
    "description": service.description,
    "provider": {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/#business`,
      "name": NAP.name,
    },
    "areaServed": {
      "@type": "City",
      "name": "Wentzville",
      "containedInPlace": {
        "@type": "State",
        "name": "Missouri"
      }
    },
    "serviceType": "Lawn Care",
  }));
}
