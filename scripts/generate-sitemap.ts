// Runs before `vite dev` and `vite build` (predev/prebuild hooks); writes public/sitemap.xml.
// Source of truth for routes is src/lib/routes.ts — keep all route changes there.

import { writeFileSync } from "fs";
import { resolve } from "path";
import { getPublicRoutes, SITE_BASE_URL } from "../src/lib/routes";

function generateSitemap() {
  const today = new Date().toISOString().split("T")[0];

  const urls = getPublicRoutes().map((route) =>
    [
      `  <url>`,
      `    <loc>${SITE_BASE_URL}${route.path}</loc>`,
      `    <lastmod>${today}</lastmod>`,
      `    <changefreq>${route.changefreq}</changefreq>`,
      `    <priority>${route.priority.toFixed(1)}</priority>`,
      `  </url>`,
    ].join("\n"),
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
    ``,
  ].join("\n");
}

const output = generateSitemap();
writeFileSync(resolve("public/sitemap.xml"), output);
console.log(`sitemap.xml written (${getPublicRoutes().length} entries)`);