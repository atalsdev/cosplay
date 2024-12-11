export { renderers } from '../renderers.mjs';

const staticPages = [
  {
    url: "/",
    lastmod: /* @__PURE__ */ new Date(),
    changefreq: "daily",
    priority: 1
  },
  {
    url: "/about",
    lastmod: /* @__PURE__ */ new Date(),
    changefreq: "monthly",
    priority: 0.8
  },
  {
    url: "/contact",
    lastmod: /* @__PURE__ */ new Date(),
    changefreq: "monthly",
    priority: 0.8
  },
  {
    url: "/shop",
    lastmod: /* @__PURE__ */ new Date(),
    changefreq: "daily",
    priority: 0.9
  },
  {
    url: "/blog",
    lastmod: /* @__PURE__ */ new Date(),
    changefreq: "daily",
    priority: 0.9
  }
];
const GET = async ({ site }) => {
  if (!site) {
    throw new Error("Site URL is not defined");
  }
  const pagesXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map((page) => `
    <url>
      <loc>${new URL(page.url, site).href}</loc>
      <lastmod>${page.lastmod.toISOString()}</lastmod>
      <changefreq>${page.changefreq}</changefreq>
      <priority>${page.priority}</priority>
    </url>
  `).join("")}
</urlset>`;
  return new Response(pagesXml, {
    headers: {
      "Content-Type": "application/xml",
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
