import { c as createAstro, a as createComponent, r as renderTemplate, d as renderComponent, u as unescapeHTML, b as addAttribute } from './astro/server_ClggX69v.mjs';
import 'kleur/colors';
import { g as generateCanonicalURL, a as generateSchema, $ as $$ViewTransitions } from './seo_BkppZmBc.mjs';
/* empty css                            */

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://perfectmotoride.com");
const $$BaseHead = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BaseHead;
  const {
    title,
    description,
    image = "/images/social-card.jpg",
    article = false,
    publishedTime,
    modifiedTime
  } = Astro2.props;
  const canonicalURL = generateCanonicalURL(Astro2.url.pathname);
  const schema = generateSchema(Astro2.props, Astro2.url.pathname);
  return renderTemplate(_a || (_a = __template(['<!-- Global Metadata --><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"', '><!-- Canonical URL --><link rel="canonical"', "><!-- Primary Meta Tags --><title>", '</title><meta name="title"', '><meta name="description"', '><!-- Open Graph / Facebook --><meta property="og:type"', '><meta property="og:url"', '><meta property="og:title"', '><meta property="og:description"', '><meta property="og:image"', ">", "", '<!-- Twitter --><meta property="twitter:card" content="summary_large_image"><meta property="twitter:url"', '><meta property="twitter:title"', '><meta property="twitter:description"', '><meta property="twitter:image"', '><!-- Schema.org --><script type="application/ld+json">', '<\/script><!-- Fonts --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">', ""])), addAttribute(Astro2.generator, "content"), addAttribute(canonicalURL, "href"), title, addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(article ? "article" : "website", "content"), addAttribute(canonicalURL, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(new URL(image, canonicalURL), "content"), article && publishedTime && renderTemplate`<meta property="article:published_time"${addAttribute(publishedTime, "content")}>`, article && modifiedTime && renderTemplate`<meta property="article:modified_time"${addAttribute(modifiedTime, "content")}>`, addAttribute(canonicalURL, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(new URL(image, canonicalURL), "content"), unescapeHTML(schema), renderComponent($$result, "ViewTransitions", $$ViewTransitions, {}));
}, "/Users/med/Desktop/stores/cosplay/src/themes/default/components/BaseHead.astro", void 0);

const $$file = "/Users/med/Desktop/stores/cosplay/src/themes/default/components/BaseHead.astro";
const $$url = undefined;

export { $$BaseHead as default, $$file as file, $$url as url };
