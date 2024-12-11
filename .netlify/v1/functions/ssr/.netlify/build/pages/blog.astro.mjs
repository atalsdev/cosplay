/* empty css                                  */
import { _ as __variableDynamicImportRuntimeHelper } from '../chunks/dynamic-import-helper_uMTE3ehW.mjs';
import { a as createComponent, r as renderTemplate, d as renderComponent, e as renderHead, b as addAttribute } from '../chunks/astro/server_ClggX69v.mjs';
import 'kleur/colors';
import { a as fetchBlogPosts } from '../chunks/shopifyAPI_BI9PaGhW.mjs';
import { ArrowRight } from 'lucide-react';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const theme = process.env.THEME || "default";
  const { default: BaseHead } = await __variableDynamicImportRuntimeHelper((/* #__PURE__ */ Object.assign({"../../themes/bikes/components/BaseHead.astro": () => import('../chunks/BaseHead_CKooDfkN.mjs'),"../../themes/default/components/BaseHead.astro": () => import('../chunks/BaseHead_KC5MSlO9.mjs')})), `../../themes/${theme}/components/BaseHead.astro`, 6);
  const { default: Header } = await __variableDynamicImportRuntimeHelper((/* #__PURE__ */ Object.assign({"../../themes/bikes/components/Header.astro": () => import('../chunks/Header_DyU7FO4r.mjs'),"../../themes/default/components/Header.astro": () => import('../chunks/Header_BLbG_n_A.mjs')})), `../../themes/${theme}/components/Header.astro`, 6);
  const { default: Footer } = await __variableDynamicImportRuntimeHelper((/* #__PURE__ */ Object.assign({"../../themes/bikes/components/Footer.astro": () => import('../chunks/Footer_B_jpGy1Q.mjs'),"../../themes/default/components/Footer.astro": () => import('../chunks/Footer_Cf_EUjYB.mjs')})), `../../themes/${theme}/components/Footer.astro`, 6);
  const posts = await fetchBlogPosts();
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };
  return renderTemplate`<html lang="en"> <head>${renderComponent($$result, "BaseHead", BaseHead, { "title": "Blog | Latest Posts", "description": "Read our latest articles about motorcycle gear, riding tips, and industry news." })}${renderHead()}</head> <body> ${renderComponent($$result, "Header", Header, {})} <main class="pt-20"> <div class="max-w-7xl mx-auto px-4 py-12"> <h1 class="text-4xl md:text-5xl font-bold mb-12">Latest Posts</h1> ${posts.length > 0 ? renderTemplate`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> ${posts.map((post) => renderTemplate`<article class="group"> <a${addAttribute(`/blog/${post.handle}`, "href")} class="block"> <div class="relative overflow-hidden rounded-lg mb-4"> <img${addAttribute(post.image?.src || "/images/placeholder.jpg", "src")}${addAttribute(post.image?.alt || post.title, "alt")} class="w-full aspect-[16/9] object-cover transition-transform duration-300 group-hover:scale-105"> </div> <h2 class="text-xl font-semibold mb-2 group-hover:text-primary transition-colors"> ${post.title} </h2> <div class="flex items-center justify-between"> <time class="text-sm text-gray-500"> ${formatDate(post.published_at)} </time> <span class="text-primary group-hover:translate-x-1 transition-transform"> ${renderComponent($$result, "ArrowRight", ArrowRight, { "className": "w-5 h-5" })} </span> </div> </a> </article>`)} </div>` : renderTemplate`<div class="text-center py-12"> <p class="text-gray-600">No posts available at the moment. Check back soon!</p> </div>`} </div> </main> ${renderComponent($$result, "Footer", Footer, {})} </body></html>`;
}, "/Users/med/Desktop/stores/cosplay/src/pages/blog/index.astro", void 0);
const $$file = "/Users/med/Desktop/stores/cosplay/src/pages/blog/index.astro";
const $$url = "/blog";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
