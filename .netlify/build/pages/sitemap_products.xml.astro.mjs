import { a as getAllProducts } from '../chunks/shopify_Chij06od.mjs';
export { renderers } from '../renderers.mjs';

const languages = ["en", "fr", "de", "es", "it"];
function escapeXml(unsafe) {
  return unsafe?.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  }) || "";
}
const GET = async ({ site }) => {
  if (!site) {
    throw new Error("Site URL is not defined");
  }
  try {
    const products = await getAllProducts();
    const lastmod = (/* @__PURE__ */ new Date()).toISOString();
    const urlBlocks = products.map(({ node: product }) => {
      const urls = languages.map(
        (lang) => `<url>
    <loc>${new URL(`${lang}/products/${product.handle}`, site).href}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
    ${product.images.edges.map(({ node: image }) => `
    <image:image>
      <image:loc>${escapeXml(image.url)}</image:loc>
      <image:title>${escapeXml(image.altText)}</image:title>
    </image:image>`).join("")}
</url>`
      );
      return urls.join("\n");
    });
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlBlocks.join("\n")}
</urlset>`;
    return new Response(sitemap, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600"
      }
    });
  } catch (error) {
    console.error("Error generating products sitemap:", error);
    return new Response("Error generating products sitemap", { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
