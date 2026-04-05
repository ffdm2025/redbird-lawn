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
      "streetAddress": NAP.address.street,
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
      SOCIAL.facebook
    ]
  } as const;
}
