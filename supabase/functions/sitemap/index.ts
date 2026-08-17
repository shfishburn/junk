import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Route configuration embedded in edge function
// Keep in sync with src/lib/routes.ts
interface SiteRoute {
  path: string;
  priority: number;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  exclude?: boolean;
}

const siteRoutes: SiteRoute[] = [
  // Main pages
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/services', priority: 0.9, changefreq: 'monthly' },
  { path: '/pricing', priority: 0.9, changefreq: 'monthly' },
  { path: '/free-estimate', priority: 0.9, changefreq: 'weekly' },
  { path: '/book', priority: 0.8, changefreq: 'weekly' },
  { path: '/service-area', priority: 0.8, changefreq: 'monthly' },
  { path: '/contact', priority: 0.8, changefreq: 'monthly' },
  { path: '/about', priority: 0.7, changefreq: 'monthly' },
  { path: '/faq', priority: 0.7, changefreq: 'monthly' },
  { path: '/gallery', priority: 0.6, changefreq: 'monthly' },
  
  // Specialty pages
  { path: '/discounts', priority: 0.7, changefreq: 'monthly' },
  
  // Spanish version
  { path: '/espanol', priority: 0.8, changefreq: 'monthly' },
  
  // City landing pages
  { path: '/junk-removal-burlington-wa', priority: 0.8, changefreq: 'monthly' },
  { path: '/junk-removal-anacortes-wa', priority: 0.8, changefreq: 'monthly' },
  { path: '/junk-removal-sedro-woolley-wa', priority: 0.8, changefreq: 'monthly' },
  { path: '/junk-removal-bellingham-wa', priority: 0.8, changefreq: 'monthly' },
  { path: '/junk-removal-mount-vernon-wa', priority: 0.8, changefreq: 'monthly' },
  { path: '/junk-removal-la-conner-wa', priority: 0.8, changefreq: 'monthly' },
  { path: '/junk-removal-bow-wa', priority: 0.8, changefreq: 'monthly' },
  { path: '/junk-removal-concrete-wa', priority: 0.8, changefreq: 'monthly' },
  { path: '/junk-removal-stanwood-wa', priority: 0.8, changefreq: 'monthly' },
  { path: '/junk-removal-marysville-wa', priority: 0.8, changefreq: 'monthly' },
  
  // Legal pages
  { path: '/privacy-policy', priority: 0.3, changefreq: 'yearly' },
  { path: '/terms-and-conditions', priority: 0.3, changefreq: 'yearly' },
];

const SITE_BASE_URL = 'https://thejunkygurus.com';

function generateSitemap(): string {
  const publicRoutes = siteRoutes.filter(route => !route.exclude);
  
  const urlEntries = publicRoutes.map(route => {
    const loc = route.path === '/' 
      ? SITE_BASE_URL + '/'
      : SITE_BASE_URL + route.path;
    
    return `  <url>
    <loc>${loc}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority.toFixed(1)}</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

function generateSitemapIndex(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_BASE_URL}/sitemap.xml</loc>
  </sitemap>
</sitemapindex>`;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const isIndex = url.pathname.includes('sitemap_index') || url.searchParams.get('type') === 'index';
    
    if (isIndex) {
      console.log('Generating sitemap index...');
      const sitemapIndex = generateSitemapIndex();
      return new Response(sitemapIndex, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }
    
    console.log('Generating dynamic sitemap...');
    const sitemap = generateSitemap();
    console.log(`Generated sitemap with ${siteRoutes.filter(r => !r.exclude).length} URLs`);

    return new Response(sitemap, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate sitemap' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
