import type { APIRoute } from 'astro';
import { getAllCollections } from '../lib/shopify';

const languages = ['en', 'fr', 'de', 'es', 'it'];

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    throw new Error('Site URL is not defined');
  }

  try {
    // Fetch collections for English (we just need the handles)
    const collections = await getAllCollections('EN');
    const lastmod = new Date().toISOString();
    
    const urlBlocks = collections.map(({ node: collection }) => {
      const urls = languages.map(lang => 
        `<url>
    <loc>${new URL(`${lang}/collections/${collection.handle}`, site).href}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
</url>`
      );
      return urls.join('\n');
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlBlocks.join('\n')}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error('Error generating collections sitemap:', error);
    return new Response('Error generating collections sitemap', { status: 500 });
  }
};