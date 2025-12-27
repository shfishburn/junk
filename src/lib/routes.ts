// Centralized route configuration for sitemap generation and SEO
// Add new routes here and the sitemap will automatically update

export interface SiteRoute {
  path: string;
  priority: number;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  exclude?: boolean; // Exclude from sitemap (e.g., admin routes)
}

export const siteRoutes: SiteRoute[] = [
  // Main pages
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/services', priority: 0.9, changefreq: 'monthly' },
  { path: '/pricing', priority: 0.9, changefreq: 'monthly' },
  { path: '/ai-estimator', priority: 0.9, changefreq: 'weekly' },
  { path: '/book', priority: 0.8, changefreq: 'weekly' },
  { path: '/service-area', priority: 0.8, changefreq: 'monthly' },
  { path: '/contact', priority: 0.8, changefreq: 'monthly' },
  { path: '/about', priority: 0.7, changefreq: 'monthly' },
  { path: '/faq', priority: 0.7, changefreq: 'monthly' },
  
  // Specialty pages
  { path: '/referrals', priority: 0.6, changefreq: 'monthly' },
  { path: '/bingo', priority: 0.6, changefreq: 'monthly' },
  { path: '/discounts', priority: 0.7, changefreq: 'monthly' },
  
  // Spanish version
  { path: '/espanol', priority: 0.8, changefreq: 'monthly' },
  
  // City landing pages
  { path: '/junk-removal-burlington-wa', priority: 0.8, changefreq: 'monthly' },
  { path: '/junk-removal-anacortes-wa', priority: 0.8, changefreq: 'monthly' },
  { path: '/junk-removal-sedro-woolley-wa', priority: 0.8, changefreq: 'monthly' },
  { path: '/junk-removal-bellingham-wa', priority: 0.8, changefreq: 'monthly' },
  
  // Legal pages
  { path: '/privacy-policy', priority: 0.3, changefreq: 'yearly' },
  { path: '/terms-and-conditions', priority: 0.3, changefreq: 'yearly' },
  
  // LLM/AI discovery files
  { path: '/llms.txt', priority: 0.3, changefreq: 'monthly' },
  { path: '/llms.json', priority: 0.3, changefreq: 'monthly' },
  
  // Admin routes (excluded from sitemap)
  { path: '/admin', priority: 0, changefreq: 'never', exclude: true },
  { path: '/admin/login', priority: 0, changefreq: 'never', exclude: true },
  { path: '/admin/bookings', priority: 0, changefreq: 'never', exclude: true },
  { path: '/admin/calendar', priority: 0, changefreq: 'never', exclude: true },
  { path: '/admin/hazmat-requests', priority: 0, changefreq: 'never', exclude: true },
];

// Get only public routes for sitemap
export const getPublicRoutes = (): SiteRoute[] => {
  return siteRoutes.filter(route => !route.exclude);
};

// Base URL for the site
export const SITE_BASE_URL = 'https://thejunkygurus.com';
