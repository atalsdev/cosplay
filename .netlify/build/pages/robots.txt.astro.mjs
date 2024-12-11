export { renderers } from '../renderers.mjs';

const languages = ["en", "fr", "de", "es", "it"];
const GET = async ({ site }) => {
  if (!site) {
    throw new Error("Site URL is not defined");
  }
  const robotsTxt = `
User-agent: *
Allow: /

# Sitemaps
Sitemap: ${new URL("sitemap.xml", site).href}
${languages.map((lang) => `Sitemap: ${new URL(`sitemap_products_${lang}.xml`, site).href}
Sitemap: ${new URL(`sitemap_collections_${lang}.xml`, site).href}`).join("\n")}

# Crawl-delay
Crawl-delay: 10

# Disallow patterns
Disallow: /api/
Disallow: /admin/
Disallow: /private/
Disallow: /*?*

# Allow patterns
${languages.map((lang) => `Allow: /${lang}/products/
Allow: /${lang}/collections/`).join("\n")}
Allow: /blog/
Allow: /shop/
Allow: /about
Allow: /contact

# Host
Host: ${site}
`;
  return new Response(robotsTxt.trim(), {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=3600"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
