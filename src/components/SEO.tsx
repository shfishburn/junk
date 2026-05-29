import { Helmet } from "react-helmet-async";

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  noIndex?: boolean;
  pageType?: string;
  pagePurpose?: string;
  breadcrumbs?: BreadcrumbItem[];
}

const SITE_NAME = "Junky Gurus LLC";
const DEFAULT_DESCRIPTION = "Mount Vernon junk removal with no hidden fees, reliable scheduling, and responsible disposal. Know your price before we arrive. Serving Skagit, Whatcom, Snohomish & King Counties.";
const DEFAULT_IMAGE = "https://thejunkygurus.com/og-image.jpg";
const SITE_URL = "https://thejunkygurus.com";
const PHONE = "+1-360-610-9233";
const PHONE_DISPLAY = "(360) 610-9233";

export function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords,
  image = DEFAULT_IMAGE,
  url,
  type = "website",
  noIndex = false,
  pageType,
  pagePurpose,
  breadcrumbs,
}: SEOProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const canonicalUrl = url ? `${SITE_URL}${url}` : SITE_URL;
  
  // LLM context for page understanding
  const llmContext = pagePurpose || `${title || "Home"} page for ${SITE_NAME} - Professional junk removal services`;
  const llmPageType = pageType || (url === "/" ? "homepage" : "content");

  // Comprehensive Local Business Schema
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#localbusiness`,
    "name": "Junky Gurus LLC",
    "alternateName": "Junky Gurus",
    "description": DEFAULT_DESCRIPTION,
    "url": SITE_URL,
    "logo": `${SITE_URL}/favicon.png`,
    "image": DEFAULT_IMAGE,
    "telephone": PHONE,
    "email": "junkygurus@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "1415 E Division St",
      "addressLocality": "Mount Vernon",
      "addressRegion": "WA",
      "postalCode": "98273",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 48.4201,
      "longitude": -122.3343
    },
    "areaServed": [
      {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "latitude": 48.4201,
          "longitude": -122.3343
        },
        "geoRadius": "80467"
      },
      { "@type": "AdministrativeArea", "name": "Skagit County, WA" },
      { "@type": "AdministrativeArea", "name": "Whatcom County, WA" },
      { "@type": "AdministrativeArea", "name": "Snohomish County, WA" },
      { "@type": "AdministrativeArea", "name": "King County, WA" }
    ],
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 48.4201,
        "longitude": -122.3343
      },
      "geoRadius": "80467"
    },
    "priceRange": "$$",
    "currenciesAccepted": "USD",
    "paymentAccepted": "Cash, Credit Card, Check",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "08:00",
        "closes": "18:00"
      }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Junk Removal Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Residential Junk Removal",
            "description": "Furniture, appliances, electronics, and household junk removal"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Appliance Removal",
            "description": "Refrigerators, washers, dryers, stoves, and other appliance hauling"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Yard Waste Removal",
            "description": "Branches, leaves, brush, and storm debris removal"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Estate Cleanouts",
            "description": "Full garage, basement, attic, and estate cleanout services"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Construction Debris Removal",
            "description": "Drywall, lumber, roofing, and renovation debris hauling"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Commercial Cleanouts",
            "description": "Office furniture, equipment, and retail fixture removal"
          }
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "47",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Sarah M."
        },
        "datePublished": "2024-11-15",
        "reviewBody": "These guys were amazing! They cleared out my entire garage in under 2 hours. Professional, friendly, and way more affordable than I expected.",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        }
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Mike T."
        },
        "datePublished": "2024-10-22",
        "reviewBody": "Called in the morning, they were at my house by noon. The old hot tub that's been haunting my backyard for 3 years is finally gone. Highly recommend!",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        }
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Linda K."
        },
        "datePublished": "2024-09-30",
        "reviewBody": "Estate cleanout after my mom passed was overwhelming. The Junky Gurus team was respectful, efficient, and made a hard situation so much easier.",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        }
      }
    ],
    "sameAs": [
      "https://www.facebook.com/JunkyGurus",
      "https://www.instagram.com/junkygurus/",
      `${SITE_URL}/llms.txt`,
      `${SITE_URL}/.well-known/llms.json`
    ],
    "knowsAbout": [
      "Junk Removal",
      "Furniture Removal",
      "Appliance Hauling",
      "Estate Cleanouts",
      "Construction Debris",
      "Recycling",
      "Donation Pickup"
    ],
    "slogan": "We Love Your Junk (So You Don't Have To)",
    "foundingLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Mount Vernon",
        "addressRegion": "WA",
        "addressCountry": "US"
      }
    }
  };

  // Organization Schema with social profiles
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    "name": "Junky Gurus LLC",
    "url": SITE_URL,
    "logo": `${SITE_URL}/favicon.png`,
    "sameAs": [
      "https://www.facebook.com/JunkyGurus",
      "https://www.instagram.com/junkygurus/"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": PHONE,
      "contactType": "customer service",
      "areaServed": "US",
      "availableLanguage": ["English", "Spanish"]
    }
  };

  // Website Schema with SearchAction for sitelinks searchbox
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    "url": SITE_URL,
    "name": SITE_NAME,
    "description": DEFAULT_DESCRIPTION,
    "publisher": {
      "@id": `${SITE_URL}/#organization`
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${SITE_URL}/services?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  // Speakable schema for voice search optimization
  const speakableSchema = url === "/" ? {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": fullTitle,
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": ["#hero h1", "#hero p", "#how-it-works h2"]
    },
    "url": SITE_URL
  } : null;

  // BreadcrumbList Schema - supports custom multi-level breadcrumbs
  const generateBreadcrumbSchema = () => {
    // If custom breadcrumbs provided, use them
    if (breadcrumbs && breadcrumbs.length > 0) {
      const items = [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": SITE_URL
        },
        ...breadcrumbs.map((crumb, index) => ({
          "@type": "ListItem",
          "position": index + 2,
          "name": crumb.name,
          "item": `${SITE_URL}${crumb.url}`
        }))
      ];
      
      return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items
      };
    }
    
    // Default: auto-generate from URL if not homepage
    if (url && url !== "/") {
      return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": SITE_URL
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": title || "Page",
            "item": canonicalUrl
          }
        ]
      };
    }
    
    return null;
  };

  const breadcrumbSchema = generateBreadcrumbSchema();

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Local SEO Meta Tags */}
      <meta name="geo.region" content="US-WA" />
      <meta name="geo.placename" content="Mount Vernon, Washington" />
      <meta name="geo.position" content="48.4201;-122.3343" />
      <meta name="ICBM" content="48.4201, -122.3343" />
      
      {/* Business Contact */}
<meta name="author" content="Junky Gurus LLC" />
      <meta name="contact" content={PHONE_DISPLAY} />
      <meta name="reply-to" content="junkygurus@gmail.com" />
      
      {/* LLM Differentiator Tags */}
      <meta name="ai:differentiators" content="No hidden fees ever, reliable scheduling (we actually show up), eco-first disposal, AI photo estimates for instant pricing, locally owned, bilingual service" />
      <meta name="ai:brand-voice" content="Friendly, slightly humorous, refreshingly honest - real pricing upfront, no sales dance, no surprises" />
      <meta name="ai:positioning" content="Junk removal without surprises - real pricing upfront, reliable scheduling, responsible disposal, from a local team that actually shows up" />

      {/* LLM Discovery & Context */}
      <meta name="ai:context" content={llmContext} />
      <meta name="ai:page-type" content={llmPageType} />
      <meta name="ai:business-type" content="Junk Removal Service" />
      <meta name="ai:service-area" content="Mount Vernon, WA and Puget Sound Region" />
      <meta name="ai:llms-txt" content={`${SITE_URL}/llms.txt`} />
      <meta name="ai:llms-json" content={`${SITE_URL}/llms.json`} />
      <link rel="llms-txt" href={`${SITE_URL}/llms.txt`} />
      <link rel="llms-full-txt" href={`${SITE_URL}/llms-full.txt`} type="text/plain" />
      <link rel="ai-context" href={`${SITE_URL}/llms.json`} type="application/json" />

      {/* Structured Data - Local Business */}
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>

      {/* Structured Data - Organization */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>

      {/* Structured Data - Website */}
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>

      {/* Structured Data - Breadcrumbs */}
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}

      {/* Structured Data - Speakable (homepage only) */}
      {speakableSchema && (
        <script type="application/ld+json">
          {JSON.stringify(speakableSchema)}
        </script>
      )}
    </Helmet>
  );
}
