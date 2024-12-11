/* empty css                                     */
import { _ as __variableDynamicImportRuntimeHelper } from '../../chunks/dynamic-import-helper_uMTE3ehW.mjs';
import { c as createAstro, a as createComponent, r as renderTemplate, b as addAttribute, e as renderHead, f as renderSlot, d as renderComponent, m as maybeRenderHead } from '../../chunks/astro/server_ClggX69v.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                                    */
import { P as ProductCard } from '../../chunks/ProductCard_Q4b9rKPn.mjs';
import { c as getPaginatedTranslatedProducts } from '../../chunks/shopify_Chij06od.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro$1 = createAstro("https://perfectmotoride.com");
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="description" content="Astro description"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title}</title>${renderHead()}</head> <body> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "/Users/med/Desktop/stores/cosplay/src/layouts/Layout.astro", void 0);

const $$Astro = createAstro("https://perfectmotoride.com");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const theme = process.env.THEME || "default";
  await __variableDynamicImportRuntimeHelper((/* #__PURE__ */ Object.assign({"../../../themes/bikes/components/BaseHead.astro": () => import('../../chunks/BaseHead_CKooDfkN.mjs'),"../../../themes/default/components/BaseHead.astro": () => import('../../chunks/BaseHead_KC5MSlO9.mjs')})), `../../../themes/${theme}/components/BaseHead.astro`, 7);
  const { default: Header } = await __variableDynamicImportRuntimeHelper((/* #__PURE__ */ Object.assign({"../../../themes/bikes/components/Header.astro": () => import('../../chunks/Header_DyU7FO4r.mjs'),"../../../themes/default/components/Header.astro": () => import('../../chunks/Header_BLbG_n_A.mjs')})), `../../../themes/${theme}/components/Header.astro`, 7);
  const { default: Footer } = await __variableDynamicImportRuntimeHelper((/* #__PURE__ */ Object.assign({"../../../themes/bikes/components/Footer.astro": () => import('../../chunks/Footer_B_jpGy1Q.mjs'),"../../../themes/default/components/Footer.astro": () => import('../../chunks/Footer_Cf_EUjYB.mjs')})), `../../../themes/${theme}/components/Footer.astro`, 7);
  const page = Number(Astro2.url.searchParams.get("page")) || 1;
  const PRODUCTS_PER_PAGE = 20;
  const { lang } = Astro2.params;
  const { products, pagination } = await getPaginatedTranslatedProducts(page, PRODUCTS_PER_PAGE, lang);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Collections | RidWear" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", Header, {})} ${maybeRenderHead()}<main class="max-w-7xl mx-auto px-4 pb-8 pt-[100px]"> <h1 class="text-3xl font-bold mb-8">Our Collections</h1> <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"> ${products.map((product) => {
    const price = product.node.variants?.edges?.[0]?.node?.price?.amount || product.node.priceRange?.minVariantPrice?.amount || "0";
    const imageUrl = product.node.images?.edges?.[0]?.node?.url || "";
    return renderTemplate`${renderComponent($$result2, "ProductCard", ProductCard, { "client:load": true, "id": product.node.id, "title": product.node.title, "price": parseFloat(price), "image": imageUrl, "description": product.node.description, "handle": product.node.handle, "lang": lang, "client:component-hydration": "load", "client:component-path": "/Users/med/Desktop/stores/cosplay/src/themes/default/components/ProductCard", "client:component-export": "default" })}`;
  })} </div> <!-- Pagination --> <div class="flex justify-center items-center gap-4 mt-12"> ${pagination.hasPreviousPage && renderTemplate`<a${addAttribute(`/${lang}/collections?page=${page - 1}`, "href")} class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
Previous
</a>`} <span class="text-gray-600">
Page ${pagination.currentPage} of ${pagination.totalPages} </span> ${pagination.hasNextPage && renderTemplate`<a${addAttribute(`/${lang}/collections?page=${page + 1}`, "href")} class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
Next
</a>`} </div> <div class="text-center text-sm text-gray-500 mt-4">
Showing ${(page - 1) * PRODUCTS_PER_PAGE + 1} - ${Math.min(page * PRODUCTS_PER_PAGE, pagination.totalProducts)}
of ${pagination.totalProducts} products
</div> </main> ${renderComponent($$result2, "Footer", Footer, {})} ` })}`;
}, "/Users/med/Desktop/stores/cosplay/src/pages/[lang]/collections/index.astro", void 0);
const $$file = "/Users/med/Desktop/stores/cosplay/src/pages/[lang]/collections/index.astro";
const $$url = "/[lang]/collections";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
