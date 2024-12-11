import type { APIRoute } from 'astro';
import { getAllTranslatedProducts } from '../lib/shopify';

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
  return ['en', 'fr', 'de', 'es', 'it'].map(lang => ({ params: { lang } }));
};

export const GET: APIRoute = async ({ params, site }) => {
  if (!site) {
    throw new Error('Site URL is not defined');
  }

  const lang = params.lang;

  try {
    // Fetch translated products for the specific language
    const products = await getAllTranslatedProducts(lang.toUpperCase());
    const lastmod = new Date().toISOString();
    
    const urlBlocks = products.map(({ node: product }) => {
      // Get only the first image
      const firstImage = product.images.edges[0]?.node;
      
      return `<url>
    <loc>${new URL(`${lang}/products/${product.handle}`, site).href}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>${firstImage ? `
    <image:image>
      <image:loc>${escapeXml(firstImage.url)}</image:loc>
      <image:title>${escapeXml(product.title)}</image:title>
    </image:image>` : ''}
</url>`;
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlBlocks.join('\n')}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error('Error generating products sitemap:', error);
    return new Response('Error generating products sitemap', { status: 500 });
  }
}; 