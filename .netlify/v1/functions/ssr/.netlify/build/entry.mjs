import { renderers } from './renderers.mjs';
import { s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CvSoi7hX.mjs';
import { manifest } from './manifest_BvxC_k-e.mjs';
import { createExports } from '@astrojs/netlify/ssr-function.js';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/about.astro.mjs');
const _page2 = () => import('./pages/blog/_slug_.astro.mjs');
const _page3 = () => import('./pages/blog.astro.mjs');
const _page4 = () => import('./pages/contact.astro.mjs');
const _page5 = () => import('./pages/reviews.astro.mjs');
const _page6 = () => import('./pages/robots.txt.astro.mjs');
const _page7 = () => import('./pages/sitemap_blogs.xml.astro.mjs');
const _page8 = () => import('./pages/sitemap_collections.xml.astro.mjs');
const _page9 = () => import('./pages/sitemap_pages.xml.astro.mjs');
const _page10 = () => import('./pages/sitemap_products.xml.astro.mjs');
const _page11 = () => import('./pages/sitemap.xml.astro.mjs');
const _page12 = () => import('./pages/sitemap_collections__lang_.xml.astro.mjs');
const _page13 = () => import('./pages/sitemap_products__lang_.xml.astro.mjs');
const _page14 = () => import('./pages/_lang_/blog/_slug_.astro.mjs');
const _page15 = () => import('./pages/_lang_/blog.astro.mjs');
const _page16 = () => import('./pages/_lang_/catalog.astro.mjs');
const _page17 = () => import('./pages/_lang_/collections.astro.mjs');
const _page18 = () => import('./pages/_lang_/collections/_---collections_.astro.mjs');
const _page19 = () => import('./pages/_lang_/products/_handle_.astro.mjs');
const _page20 = () => import('./pages/_lang_/recipes/_slug_.astro.mjs');
const _page21 = () => import('./pages/_lang_/recipes.astro.mjs');
const _page22 = () => import('./pages/_lang_/_---slug_.astro.mjs');
const _page23 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/about.astro", _page1],
    ["src/pages/blog/[slug].astro", _page2],
    ["src/pages/blog/index.astro", _page3],
    ["src/pages/contact.astro", _page4],
    ["src/pages/reviews.astro", _page5],
    ["src/pages/robots.txt.ts", _page6],
    ["src/pages/sitemap_blogs.xml.ts", _page7],
    ["src/pages/sitemap_collections.xml.ts", _page8],
    ["src/pages/sitemap_pages.xml.ts", _page9],
    ["src/pages/sitemap_products.xml.ts", _page10],
    ["src/pages/sitemap.xml.ts", _page11],
    ["src/pages/sitemap_collections_[lang].xml.ts", _page12],
    ["src/pages/sitemap_products_[lang].xml.ts", _page13],
    ["src/pages/[lang]/blog/[slug].astro", _page14],
    ["src/pages/[lang]/blog/index.astro", _page15],
    ["src/pages/[lang]/catalog/index.astro", _page16],
    ["src/pages/[lang]/collections/index.astro", _page17],
    ["src/pages/[lang]/collections/[...collections].astro", _page18],
    ["src/pages/[lang]/products/[handle].astro", _page19],
    ["src/pages/[lang]/recipes/[slug].astro", _page20],
    ["src/pages/[lang]/recipes/index.astro", _page21],
    ["src/pages/[lang]/[...slug].astro", _page22],
    ["src/pages/index.astro", _page23]
]);
const serverIslandMap = new Map();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "1ad71f07-4ddf-473b-bd56-dfc7a8bb7359"
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (_start in serverEntrypointModule) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
