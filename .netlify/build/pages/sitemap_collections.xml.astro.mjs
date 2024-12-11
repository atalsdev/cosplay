import { g as getAllCollections } from '../chunks/shopify_Chij06od.mjs';
export { renderers } from '../renderers.mjs';

const languages = ["en", "fr", "de", "es", "it"];
const GET = async ({ site }) => {
  if (!site) {
    throw new Error("Site URL is not defined");
  }
  try {
    const collections = await getAllCollections("EN");
    const lastmod = (/* @__PURE__ */ new Date()).toISOString();
    const urlBlocks = collections.map(({ node: collection }) => {
      const urls = languages.map(
        (lang) => `<url>
    <loc>${new URL(`${lang}/collections/${collection.handle}`, site).href}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
</url>`
      );
      return urls.join("\n");
    });
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlBlocks.join("\n")}
</urlset>`;
    return new Response(sitemap, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600"
      }
    });
  } catch (error) {
    console.error("Error generating collections sitemap:", error);
    return new Response("Error generating collections sitemap", { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
