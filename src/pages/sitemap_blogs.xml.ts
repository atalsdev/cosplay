// src/pages/sitemap_blogs.xml.ts
import type { APIRoute } from 'astro';
import { fetchBlogPosts } from '../utils/shopifyAPI';

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    throw new Error('Site URL is not defined');
  }

  try {
    const posts = await fetchBlogPosts();

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${posts.map(post => `
    <url>
      <loc>${new URL(`/blog/${post.handle}`, site).href}</loc>
      <lastmod>${new Date(post.published_at).toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.7</priority>
    </url>
  `).join('')}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error('Error generating blog sitemap:', error);
    return new Response('Error generating blog sitemap', { status: 500 });
  }
};