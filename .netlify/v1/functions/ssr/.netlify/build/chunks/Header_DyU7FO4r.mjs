import { c as createAstro, a as createComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute, d as renderComponent } from './astro/server_ClggX69v.mjs';
import 'kleur/colors';
import { Globe, Menu } from 'lucide-react';
import { g as getLangFromUrl, a as getLocalizedPath } from './i18n_C4Sccx09.mjs';

const $$Astro = createAstro("https://perfectmotoride.com");
const $$Header = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Header;
  const navigation = [
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog" },
    { name: "Reviews", href: "/reviews" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" }
  ];
  const languages = [
    { code: "en", name: "English" },
    { code: "fr", name: "Français" },
    { code: "es", name: "Español" },
    { code: "it", name: "Italiano" },
    { code: "de", name: "Deutsch" },
    { code: "nl", name: "Nederlands" },
    { code: "pt", name: "Português" }
  ];
  const currentPath = Astro2.url.pathname;
  const currentLang = getLangFromUrl(Astro2.url);
  const siteName = process.env.PUBLIC_SITE_NAME || "MotoPalnet";
  const localizedNavigation = navigation.map((item) => ({
    ...item,
    href: `/${currentLang}${item.href === "/" ? "" : item.href}`
  }));
  return renderTemplate`${maybeRenderHead()}<header class="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200"> <nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top"> <div class="flex h-16 items-center justify-between"> <div class="flex items-center"> <a${addAttribute(`/${currentLang}`, "href")} class="flex items-center"> <span class="text-xl font-bold text-gray-900">${siteName}</span> </a> </div> <div class="hidden md:flex items-center space-x-8"> ${localizedNavigation.map((item) => renderTemplate`<a${addAttribute(item.href, "href")} class="text-base font-medium text-gray-600 hover:text-gray-900 transition-colors"> ${item.name} </a>`)} </div> <div class="flex items-center gap-4"> <!-- Language Switcher --> <div class="relative group"> <button type="button" class="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"> ${renderComponent($$result, "Globe", Globe, { "className": "h-5 w-5" })} <span class="hidden md:inline-block">${languages.find((lang) => lang.code === currentLang)?.name}</span> </button> <div class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"> <div class="py-1" role="menu" aria-orientation="vertical"> ${languages.map((lang) => renderTemplate`<a${addAttribute(getLocalizedPath(currentPath, lang.code), "href")}${addAttribute(`block px-4 py-2 text-sm ${currentLang === lang.code ? "bg-gray-100 text-gray-900" : "text-gray-700"} hover:bg-gray-50`, "class")} role="menuitem"> ${lang.name} </a>`)} </div> </div> </div> <a${addAttribute(`/${currentLang}/account`, "href")} class="hidden md:inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-colors">
Sign In
</a> <div class="relative md:hidden"> <button type="button" id="mobile-menu-button" class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100" aria-expanded="false"> <span class="sr-only">Open menu</span> ${renderComponent($$result, "Menu", Menu, { "className": "h-6 w-6", "aria-hidden": "true" })} </button> <div id="mobile-menu-dropdown" class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden"> <div class="py-1" role="menu" aria-orientation="vertical"> ${localizedNavigation.map((item) => renderTemplate`<a${addAttribute(item.href, "href")} class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem"> ${item.name} </a>`)} </div> </div> </div> </div> </div> </nav> </header> `;
}, "/Users/med/Desktop/stores/cosplay/src/themes/bikes/components/Header.astro", void 0);
const $$file = "/Users/med/Desktop/stores/cosplay/src/themes/bikes/components/Header.astro";
const $$url = void 0;

export { $$Header as default, $$file as file, $$url as url };
