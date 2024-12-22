import type { APIRoute } from 'astro';

const languages = ['en', 'fr', 'de', 'es', 'it'];

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    throw new Error('Site URL is not defined');
  }

  const lastmod = new Date().toISOString();

  const mainSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
              xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
              xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                                http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <!-- Static Pages Sitemap -->
  <sitemap>
    <loc>${new URL('sitemap_pages.xml', site).href}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>

  <!-- Default (non-language prefixed) Sitemaps -->
  <sitemap>
    <loc>${new URL('sitemap_products_default.xml', site).href}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${new URL('sitemap_collections_default.xml', site).href}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>

  <!-- Products Sitemaps by Language -->
  ${languages.map(lang => `<sitemap>
    <loc>${new URL(`sitemap_products_${lang}.xml`, site).href}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`).join('\n  ')}

  <!-- Collections Sitemaps by Language -->
  ${languages.map(lang => `<sitemap>
    <loc>${new URL(`sitemap_collections_${lang}.xml`, site).href}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`).join('\n  ')}

  <!-- Blog Sitemap -->
  <sitemap>
    <loc>${new URL('sitemap_blogs.xml', site).href}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
</sitemapindex>`;

  return new Response(mainSitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};