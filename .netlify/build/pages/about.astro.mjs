/* empty css                                  */
import { c as createAstro, a as createComponent } from '../chunks/astro/server_ClggX69v.mjs';
import 'kleur/colors';
import 'clsx';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://perfectmotoride.com");
const $$About = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$About;
  return Astro2.redirect("/en/about");
}, "/Users/med/Desktop/stores/cosplay/src/pages/about.astro", void 0);

const $$file = "/Users/med/Desktop/stores/cosplay/src/pages/about.astro";
const $$url = "/about";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$About,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
