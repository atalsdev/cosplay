/* empty css                                        */
import { _ as __variableDynamicImportRuntimeHelper } from '../../../chunks/dynamic-import-helper_uMTE3ehW.mjs';
import { c as createAstro, a as createComponent, r as renderTemplate, d as renderComponent, b as addAttribute, e as renderHead, u as unescapeHTML } from '../../../chunks/astro/server_ClggX69v.mjs';
import 'kleur/colors';
import { d as getCollectionByHandle, g as getAllCollections } from '../../../chunks/shopify_Chij06od.mjs';
import { ArrowRight } from 'lucide-react';
/* empty css                                               */
export { renderers } from '../../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://perfectmotoride.com");
async function getStaticPaths() {
  const paths = [];
  for (const lang of languages) {
    const collections = await getAllCollections(lang);
    const collectionPaths = collections.map(({ node }) => ({
      params: {
        lang,
        collections: node.handle
      },
      props: {
        collection: node
      }
    }));
    paths.push(...collectionPaths);
  }
  return paths;
}
const $$ = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$;
  const theme = process.env.THEME || "default";
  const languages2 = ["en", "fr", "de", "es", "it"];
  const baseUrl = "https://perfectmotoride.com";
  const storeName = "RidWear";
  const { default: BaseHead } = await __variableDynamicImportRuntimeHelper((/* #__PURE__ */ Object.assign({"../../../themes/bikes/components/BaseHead.astro": () => import('../../../chunks/BaseHead_CKooDfkN.mjs'),"../../../themes/default/components/BaseHead.astro": () => import('../../../chunks/BaseHead_KC5MSlO9.mjs')})), `../../../themes/${theme}/components/BaseHead.astro`, 7);
  const { default: Header } = await __variableDynamicImportRuntimeHelper((/* #__PURE__ */ Object.assign({"../../../themes/bikes/components/Header.astro": () => import('../../../chunks/Header_DyU7FO4r.mjs'),"../../../themes/default/components/Header.astro": () => import('../../../chunks/Header_BLbG_n_A.mjs')})), `../../../themes/${theme}/components/Header.astro`, 7);
  const { default: Footer } = await __variableDynamicImportRuntimeHelper((/* #__PURE__ */ Object.assign({"../../../themes/bikes/components/Footer.astro": () => import('../../../chunks/Footer_B_jpGy1Q.mjs'),"../../../themes/default/components/Footer.astro": () => import('../../../chunks/Footer_Cf_EUjYB.mjs')})), `../../../themes/${theme}/components/Footer.astro`, 7);
  const { lang, collections: handle } = Astro2.params;
  const collection = await getCollectionByHandle(handle, lang?.toUpperCase());
  const generateSEOTitle = (collection2) => {
    if (collection2.seo?.title) return collection2.seo.title;
    const templates = {
      en: `Shop ${collection2.title} | ${storeName} - Premium Motorcycle Gear`,
      fr: `Achetez ${collection2.title} | ${storeName} - Équipement Moto Premium`,
      de: `${collection2.title} kaufen | ${storeName} - Premium Motorradausrüstung`,
      es: `Compra ${collection2.title} | ${storeName} - Equipo Premium para Motos`,
      it: `Acquista ${collection2.title} | ${storeName} - Abbigliamento Moto Premium`
    };
    return templates[lang] || templates.en;
  };
  const generateSEODescription = (collection2) => {
    if (collection2.seo?.description) return collection2.seo.description;
    const templates = {
      en: `Discover our premium ${collection2.title.toLowerCase()} collection. High-quality motorcycle gear designed for riders who demand the best. Shop now at ${storeName}.`,
      fr: `Découvrez notre collection premium ${collection2.title.toLowerCase()}. Équipement moto de haute qualité conçu pour les motards exigeants. Achetez maintenant chez ${storeName}.`,
      de: `Entdecken Sie unsere Premium ${collection2.title.toLowerCase()} Kollektion. Hochwertige Motorradausrüstung für anspruchsvolle Fahrer. Jetzt bei ${storeName} kaufen.`,
      es: `Descubre nuestra colección premium de ${collection2.title.toLowerCase()}. Equipo de moto de alta calidad diseñado para motociclistas exigentes. Compra ahora en ${storeName}.`,
      it: `Scopri la nostra collezione premium ${collection2.title.toLowerCase()}. Abbigliamento moto di alta qualità progettato per motociclisti esigenti. Acquista ora su ${storeName}.`
    };
    return templates[lang] || templates.en;
  };
  const seoTitle = generateSEOTitle(collection);
  const seoDescription = generateSEODescription(collection);
  const formatPrice = (amount, currencyCode) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode
    }).format(parseFloat(amount));
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${baseUrl}/${lang}`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Collections",
        "item": `${baseUrl}/${lang}/catalog`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": collection.title,
        "item": `${baseUrl}/${lang}/collections/${handle}`
      }
    ]
  };
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": collection.title,
    "description": seoDescription,
    "image": collection.image?.url,
    "url": `${baseUrl}/${lang}/collections/${handle}`,
    "numberOfItems": collection.products.edges.length,
    "hasPart": collection.products.edges.map(({ node: product }) => ({
      "@type": "Product",
      "name": product.title,
      "description": product.seo?.description || product.description,
      "image": product.images?.edges[0]?.node?.url,
      "url": `${baseUrl}/${lang}/products/${product.handle}`,
      "offers": {
        "@type": "Offer",
        "price": product.variants.edges[0]?.node?.price?.amount,
        "priceCurrency": product.variants.edges[0]?.node?.price?.currencyCode,
        "availability": "https://schema.org/InStock"
      }
    }))
  };
  return renderTemplate(_a || (_a = __template(["<html", " data-astro-cid-iy3ujeja> <head>", "<!-- Hreflang tags -->", '<link rel="alternate" hreflang="x-default"', '><!-- Schema.org markup --><script type="application/ld+json">', '</script><script type="application/ld+json">', "</script>", "</head> <body data-astro-cid-iy3ujeja> ", ' <div class="min-h-screen bg-gray-50" data-astro-cid-iy3ujeja> <main class="max-w-7xl mx-auto px-4 pt-24 pb-16" data-astro-cid-iy3ujeja>  <nav class="flex mb-8 text-sm" aria-label="Breadcrumb" data-astro-cid-iy3ujeja> <ol class="flex items-center space-x-2" data-astro-cid-iy3ujeja> <li data-astro-cid-iy3ujeja> <a', ' class="text-gray-500 hover:text-gray-700" data-astro-cid-iy3ujeja>Home</a> </li> <li class="text-gray-400" data-astro-cid-iy3ujeja>/</li> <li data-astro-cid-iy3ujeja> <a', ' class="text-gray-500 hover:text-gray-700" data-astro-cid-iy3ujeja>Collections</a> </li> <li class="text-gray-400" data-astro-cid-iy3ujeja>/</li> <li class="text-gray-900 font-medium" data-astro-cid-iy3ujeja>', '</li> </ol> </nav>  <header class="text-center mb-16" data-astro-cid-iy3ujeja> ', " ", " ", ' </header>  <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6" data-astro-cid-iy3ujeja> ', " </div>  ", " </main> </div> ", "  </body> </html>"])), addAttribute(lang, "lang"), renderComponent($$result, "BaseHead", BaseHead, { "title": seoTitle, "description": seoDescription, "image": collection.image?.url, "data-astro-cid-iy3ujeja": true }), languages2.map((language) => renderTemplate`<link rel="alternate"${addAttribute(language, "hreflang")}${addAttribute(`${baseUrl}/${language}/collections/${handle}`, "href")}>`), addAttribute(`${baseUrl}/en/collections/${handle}`, "href"), unescapeHTML(JSON.stringify(breadcrumbSchema)), unescapeHTML(JSON.stringify(collectionSchema)), renderHead(), renderComponent($$result, "Header", Header, { "data-astro-cid-iy3ujeja": true }), addAttribute(`/${lang}`, "href"), addAttribute(`/${lang}/catalog`, "href"), collection.title, collection.image && renderTemplate`<div class="relative h-[300px] mb-8 rounded-2xl overflow-hidden" data-astro-cid-iy3ujeja> <img${addAttribute(collection.image.url, "src")}${addAttribute(collection.image.altText || collection.title, "alt")} class="w-full h-full object-cover" data-astro-cid-iy3ujeja> <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" data-astro-cid-iy3ujeja></div> <h1 class="absolute bottom-8 left-0 right-0 text-4xl font-bold text-white px-4" data-astro-cid-iy3ujeja> ${collection.title} </h1> </div>`, !collection.image && renderTemplate`<h1 class="text-4xl font-bold text-gray-900 mb-4" data-astro-cid-iy3ujeja>${collection.title}</h1>`, collection.description && renderTemplate`<p class="text-lg text-gray-600 max-w-2xl mx-auto" data-astro-cid-iy3ujeja> ${collection.description} </p>`, collection.products.edges.map(({ node: product }) => {
    const firstVariant = product.variants.edges[0]?.node;
    const price = firstVariant?.price;
    return renderTemplate`<a${addAttribute(`/${lang}/products/${product.handle}`, "href")} class="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100" data-astro-cid-iy3ujeja> <div class="aspect-[3/4] overflow-hidden bg-gray-100" data-astro-cid-iy3ujeja> ${product.images?.edges[0]?.node ? renderTemplate`<img${addAttribute(product.images.edges[0].node.url, "src")}${addAttribute(product.images.edges[0].node.altText || product.title, "alt")} class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" data-astro-cid-iy3ujeja>` : renderTemplate`<div class="w-full h-full flex items-center justify-center bg-gray-50" data-astro-cid-iy3ujeja> <span class="text-gray-400" data-astro-cid-iy3ujeja>No image available</span> </div>`} </div> <div class="p-4" data-astro-cid-iy3ujeja> <h2 class="text-lg font-medium mb-2 text-gray-900 group-hover:text-blue-600 transition-colors" data-astro-cid-iy3ujeja> ${product.title} </h2> <div class="flex items-center justify-between mt-2" data-astro-cid-iy3ujeja> ${price && renderTemplate`<span class="text-sm font-medium text-gray-900" data-astro-cid-iy3ujeja> ${formatPrice(price.amount, price.currencyCode)} </span>`} <span class="text-blue-600 group-hover:translate-x-1 transition-transform duration-300" data-astro-cid-iy3ujeja> ${renderComponent($$result, "ArrowRight", ArrowRight, { "className": "w-5 h-5", "data-astro-cid-iy3ujeja": true })} </span> </div> </div> </a>`;
  }), collection.products.edges.length === 0 && renderTemplate`<div class="text-center py-16 bg-white rounded-2xl shadow-sm" data-astro-cid-iy3ujeja> <div class="max-w-md mx-auto" data-astro-cid-iy3ujeja> <h2 class="text-2xl font-semibold text-gray-900 mb-2" data-astro-cid-iy3ujeja>No Products Found</h2> <p class="text-gray-600" data-astro-cid-iy3ujeja>
No products available in this collection at the moment. Please check back soon!
</p> </div> </div>`, renderComponent($$result, "Footer", Footer, { "data-astro-cid-iy3ujeja": true }));
}, "/Users/med/Desktop/stores/cosplay/src/pages/[lang]/collections/[...collections].astro", void 0);
const $$file = "/Users/med/Desktop/stores/cosplay/src/pages/[lang]/collections/[...collections].astro";
const $$url = "/[lang]/collections/[...collections]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
