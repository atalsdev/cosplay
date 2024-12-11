import { c as createAstro, a as createComponent, r as renderTemplate, b as addAttribute } from './astro/server_ClggX69v.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                            */

const $$Astro = createAstro("https://perfectmotoride.com");
const $$ViewTransitions = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ViewTransitions;
  const { fallback = "animate" } = Astro2.props;
  return renderTemplate`<meta name="astro-view-transitions-enabled" content="true"><meta name="astro-view-transitions-fallback"${addAttribute(fallback, "content")}>`;
}, "/Users/med/Desktop/stores/cosplay/node_modules/astro/components/ViewTransitions.astro", void 0);

function generateCanonicalURL(pathname) {
  const siteUrl = "https://ridwear.com";
  return `${siteUrl}${pathname}`;
}
function generateSchema(props, pathname) {
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RidWear",
    url: generateCanonicalURL("/"),
    description: "Your ultimate destination for motorcycle gear, reviews, and community."
  };
  if (props.article) {
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: props.title,
      description: props.description,
      image: props.image,
      datePublished: props.publishedTime,
      dateModified: props.modifiedTime || props.publishedTime,
      publisher: {
        "@type": "Organization",
        name: "RidWear",
        logo: {
          "@type": "ImageObject",
          url: generateCanonicalURL("/images/logo.png")
        }
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": generateCanonicalURL(pathname)
      }
    });
  }
  if (pathname.startsWith("/shop")) {
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Store",
      name: "RidWear Store",
      description: props.description,
      url: generateCanonicalURL(pathname),
      image: props.image,
      priceRange: "$$$"
    });
  }
  return JSON.stringify(baseSchema);
}

export { $$ViewTransitions as $, generateSchema as a, generateCanonicalURL as g };
