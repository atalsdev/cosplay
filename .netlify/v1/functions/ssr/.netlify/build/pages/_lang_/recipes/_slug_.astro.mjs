/* empty css                                        */
import { _ as __variableDynamicImportRuntimeHelper } from '../../../chunks/dynamic-import-helper_uMTE3ehW.mjs';
import { c as createAstro, a as createComponent, r as renderTemplate, d as renderComponent, e as renderHead, b as addAttribute, u as unescapeHTML, F as Fragment } from '../../../chunks/astro/server_ClggX69v.mjs';
import 'kleur/colors';
import { f as fetchBlogPost } from '../../../chunks/shopifyAPI_BI9PaGhW.mjs';
/* empty css                                        */
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro("https://perfectmotoride.com");
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const theme = process.env.THEME || "default";
  const { default: BaseHead } = await __variableDynamicImportRuntimeHelper((/* #__PURE__ */ Object.assign({})), `../../../components/${theme}/BaseHead.astro`, 6);
  const { default: Header } = await __variableDynamicImportRuntimeHelper((/* #__PURE__ */ Object.assign({})), `../../../components/${theme}/Header.astro`, 6);
  const { default: Footer } = await __variableDynamicImportRuntimeHelper((/* #__PURE__ */ Object.assign({})), `../../../components/${theme}/Footer.astro`, 6);
  const { slug } = Astro2.params;
  const post = await fetchBlogPost(slug);
  if (!post) {
    return Astro2.redirect("/404");
  }
  const formattedDate = new Date(post.published_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  const defaultDescription = post.body_html.replace(/<[^>]*>/g, "").slice(0, 160);
  const metaTitle = post.metafields?.title_tag || `${post.title} | Blog`;
  const metaDescription = post.metafields?.description_tag || defaultDescription;
  return renderTemplate`<html lang="en"> <head>${renderComponent($$result, "BaseHead", BaseHead, { "title": metaTitle, "description": metaDescription, "image": post.image?.src, "article": true, "publishedTime": post.published_at })}${renderHead()}</head> <body> ${renderComponent($$result, "Header", Header, {})} <main class="pt-20"> <article class="max-w-4xl mx-auto px-4 py-12"> ${post.image?.src && renderTemplate`<img${addAttribute(post.image.src, "src")}${addAttribute(post.image.alt || post.title, "alt")} class="w-full aspect-[16/9] object-cover rounded-lg mb-8">`} <header class="mb-8"> <h1 class="text-4xl md:text-5xl font-bold mb-4">${post.title}</h1> <div class="flex items-center gap-4 text-gray-600"> <time${addAttribute(post.published_at, "datetime")}>${formattedDate}</time> ${post.author && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate` <span>•</span> <span>${post.author}</span> ` })}`} </div> </header> <div class="prose prose-lg max-w-none">${unescapeHTML(post.body_html)}</div> ${post.tags && post.tags.length > 0 && renderTemplate`<div class="mt-8 pt-8 border-t"> <div class="flex flex-wrap gap-2"> ${post.tags.map((tag) => renderTemplate`<span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"> ${tag} </span>`)} </div> </div>`} </article> </main> ${renderComponent($$result, "Footer", Footer, {})} </body></html>`;
}, "/Users/med/Desktop/stores/cosplay/src/pages/[lang]/recipes/[slug].astro", void 0);
const $$file = "/Users/med/Desktop/stores/cosplay/src/pages/[lang]/recipes/[slug].astro";
const $$url = "/[lang]/recipes/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
