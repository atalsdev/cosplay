import type { APIRoute } from 'astro';
import { getAllCollections } from '../lib/shopify';

// Helper function to escape XML special characters
function escapeXml(unsafe: string): string {
  return unsafe?.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  }) || '';
}

export const prerender = true;

export const getStaticPaths = () => {
  return ['', 'en', 'fr', 'de', 'es', 'it'].map(lang => ({ params: { lang: lang || 'default' } }));
};

export const GET: APIRoute = async ({ params, site }) => {
  if (!site) {
    throw new Error('Site URL is not defined');
  }

  const lang = params.lang === 'default' ? 'en' : params.lang;
  const isDefaultRoute = params.lang === 'default';

  try {
    const collections = await getAllCollections();
    const lastmod = new Date().toISOString();

    const urlBlocks = collections.map(({ node: collection }) => {
      // Create URL based on whether it's default route or language-specific
      const collectionUrl = isDefaultRoute
        ? new URL(`collections/${collection.handle}`, site).href
        : new URL(`${lang}/collections/${collection.handle}`, site).href;

      return `<url>
    <loc>${collectionUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
</url>`;
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