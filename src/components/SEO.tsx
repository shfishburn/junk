import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  noIndex?: boolean;
}

const SITE_NAME = "Junky Gurus LLC";
const DEFAULT_DESCRIPTION = "Professional junk removal in Mount Vernon, WA and the North Sound. Honest pricing, responsible disposal. Serving Skagit, Whatcom, Snohomish & King Counties.";
const DEFAULT_IMAGE = "https://junkygurus.com/og-image.jpg";
const SITE_URL = "https://junkygurus.com";

export function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords,
  image = DEFAULT_IMAGE,
  url,
  type = "website",
  noIndex = false,
}: SEOProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const canonicalUrl = url ? `${SITE_URL}${url}` : SITE_URL;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Junky Gurus LLC",
    "description": DEFAULT_DESCRIPTION,
    "url": SITE_URL,
    "telephone": "+1-360-610-9233",
    "email": "info@junkygurus.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Mount Vernon",
      "addressRegion": "WA",
      "addressCountry": "US"
    },
    "areaServed": [
      { "@type": "County", "name": "Skagit County" },
      { "@type": "County", "name": "Whatcom County" },
      { "@type": "County", "name": "Snohomish County" },
      { "@type": "County", "name": "King County" }
    ],
    "priceRange": "$$",
    "openingHours": "Mo-Sa 08:00-18:00",
    "sameAs": []
  };

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

      {/* Additional SEO */}
      <meta name="geo.region" content="US-WA" />
      <meta name="geo.placename" content="Mount Vernon" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}
