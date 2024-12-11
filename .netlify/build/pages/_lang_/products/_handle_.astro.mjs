/* empty css                                        */
import { c as createAstro, a as createComponent, r as renderTemplate, b as addAttribute, e as renderHead, d as renderComponent, f as renderSlot, m as maybeRenderHead, u as unescapeHTML, F as Fragment$1 } from '../../../chunks/astro/server_ClggX69v.mjs';
import 'kleur/colors';
import { _ as __variableDynamicImportRuntimeHelper } from '../../../chunks/dynamic-import-helper_uMTE3ehW.mjs';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import React, { useEffect } from 'react';
import { Minus, Plus, Trash2, Loader2, ShoppingCart, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { u as useCartStore, P as ProductCard } from '../../../chunks/ProductCard_Q4b9rKPn.mjs';
/* empty css                                          */
import { e as getTranslatedProductByHandle } from '../../../chunks/shopify_Chij06od.mjs';
import 'clsx';
import $$BaseHead from '../../../chunks/BaseHead_KC5MSlO9.mjs';
export { renderers } from '../../../renderers.mjs';

function Cart({ onCheckout }) {
  const { items, removeItem, updateQuantity, total, isProcessing, setProcessing } = useCartStore();
  const handleCheckout = async () => {
    try {
      setProcessing(true);
      const totalAmount = total();
      onCheckout?.();
      window.location.href = `https://digivast.store/source.php?productname=cart&price=${totalAmount}`;
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setProcessing(false);
    }
  };
  if (items.length === 0) {
    return /* @__PURE__ */ jsx("div", { className: "flex-1 flex items-center justify-center p-4", children: /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "Your cart is empty" }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-full", children: [
    /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto p-4", children: items.map((item) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 border-b py-4", children: [
      /* @__PURE__ */ jsx("img", { src: item.image, alt: item.title, className: "w-16 h-16 object-cover rounded" }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold", children: item.title }),
        /* @__PURE__ */ jsxs("p", { className: "text-gray-600", children: [
          "$",
          item.price.toFixed(2)
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => updateQuantity(item.id, Math.max(0, item.quantity - 1)),
            className: "p-1 hover:bg-gray-100 rounded disabled:opacity-50",
            disabled: isProcessing,
            children: /* @__PURE__ */ jsx(Minus, { size: 16 })
          }
        ),
        /* @__PURE__ */ jsx("span", { children: item.quantity }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => updateQuantity(item.id, item.quantity + 1),
            className: "p-1 hover:bg-gray-100 rounded disabled:opacity-50",
            disabled: isProcessing,
            children: /* @__PURE__ */ jsx(Plus, { size: 16 })
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => removeItem(item.id),
          className: "p-2 text-red-500 hover:bg-red-50 rounded disabled:opacity-50",
          disabled: isProcessing,
          children: /* @__PURE__ */ jsx(Trash2, { size: 20 })
        }
      )
    ] }, item.id)) }),
    /* @__PURE__ */ jsxs("div", { className: "border-t p-4 bg-gray-50", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4", children: [
        /* @__PURE__ */ jsx("span", { className: "text-lg font-semibold", children: "Total:" }),
        /* @__PURE__ */ jsxs("span", { className: "text-xl font-bold", children: [
          "$",
          total().toFixed(2)
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleCheckout,
          disabled: isProcessing,
          className: "w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",
          children: isProcessing ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Loader2, { size: 20, className: "animate-spin" }),
            "Processing..."
          ] }) : "Proceed to Checkout"
        }
      )
    ] })
  ] });
}

function Header() {
  const { isOpen, setIsOpen, items } = useCartStore();
  const siteName = process.env.PUBLIC_SITE_NAME || "Drivi";
  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);
  return /* @__PURE__ */ jsxs("header", { className: "bg-white shadow-sm sticky top-0 z-[100]", children: [
    /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between h-16", children: [
      /* @__PURE__ */ jsx("a", { href: "/", className: "text-2xl font-bold", children: siteName }),
      /* @__PURE__ */ jsxs("nav", { className: "hidden md:flex space-x-8", children: [
        /* @__PURE__ */ jsx("a", { href: "/collections", className: "text-gray-700 hover:text-black", children: "Collections" }),
        /* @__PURE__ */ jsx("a", { href: "/helmets", className: "text-gray-700 hover:text-black", children: "Helmets" }),
        /* @__PURE__ */ jsx("a", { href: "/jackets", className: "text-gray-700 hover:text-black", children: "Jackets" }),
        /* @__PURE__ */ jsx("a", { href: "/accessories", className: "text-gray-700 hover:text-black", children: "Accessories" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-4", children: /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setIsOpen(!isOpen),
          className: "text-gray-700 hover:text-black relative",
          children: [
            /* @__PURE__ */ jsx(ShoppingCart, { size: 24 }),
            items.length > 0 && /* @__PURE__ */ jsx("span", { className: "absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center", children: items.length })
          ]
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `fixed inset-y-0 right-0 w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-[200] ${isOpen ? "translate-x-0" : "translate-x-full"}`,
        children: /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col", children: [
          /* @__PURE__ */ jsx("div", { className: "p-4 border-b", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold", children: "Shopping Cart" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setIsOpen(false),
                className: "text-gray-500 hover:text-gray-700",
                children: "✕"
              }
            )
          ] }) }),
          /* @__PURE__ */ jsx(Cart, { onCheckout: () => setIsOpen(false) })
        ] })
      }
    ),
    isOpen && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 bg-black bg-opacity-50 z-[150]",
        onClick: () => setIsOpen(false)
      }
    )
  ] });
}

const $$Astro$6 = createAstro("https://perfectmotoride.com");
const $$Layoutp = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$Layoutp;
  const theme = process.env.THEME || "default";
  await __variableDynamicImportRuntimeHelper((/* #__PURE__ */ Object.assign({"../themes/bikes/components/BaseHead.astro": () => import('../../../chunks/BaseHead_CKooDfkN.mjs'),"../themes/default/components/BaseHead.astro": () => import('../../../chunks/BaseHead_KC5MSlO9.mjs')})), `../themes/${theme}/components/BaseHead.astro`, 5);
  const { default: Footer } = await __variableDynamicImportRuntimeHelper((/* #__PURE__ */ Object.assign({"../themes/bikes/components/Footer.astro": () => import('../../../chunks/Footer_B_jpGy1Q.mjs'),"../themes/default/components/Footer.astro": () => import('../../../chunks/Footer_Cf_EUjYB.mjs')})), `../themes/${theme}/components/Footer.astro`, 5);
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title}</title><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}>${renderHead()}</head> <body class="min-h-screen flex flex-col"> ${renderComponent($$result, "Header", Header, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/med/Desktop/stores/cosplay/src/themes/default/components/Header", "client:component-export": "default" })} ${renderSlot($$result, $$slots["default"])} ${renderComponent($$result, "Footer", Footer, {})} </body></html>`;
}, "/Users/med/Desktop/stores/cosplay/src/layouts/Layoutp.astro", void 0);

const en$4 = {
	addToCart: "Add to Cart",
	buyNow: "Buy Now",
	processing: "Processing...",
	inStock: "In Stock",
	outOfStock: "Out of Stock",
	secureTransaction: "Secure transaction"
};
const fr$4 = {
	addToCart: "Ajouter au panier",
	buyNow: "Acheter maintenant",
	processing: "Traitement...",
	inStock: "En stock",
	outOfStock: "Rupture de stock",
	secureTransaction: "Transaction sécurisée"
};
const de$4 = {
	addToCart: "In den Warenkorb",
	buyNow: "Jetzt kaufen",
	processing: "Verarbeitung...",
	inStock: "Auf Lager",
	outOfStock: "Nicht auf Lager",
	secureTransaction: "Sichere Transaktion"
};
const addToCartContent = {
	en: en$4,
	fr: fr$4,
	de: de$4
};

const colorMap = {
  "Black": { color: "#000000" },
  "White": { color: "#FFFFFF", border: true },
  "Red": { color: "#FF0000" },
  "Blue": { color: "#0066FF" },
  "Navy": { color: "#000080" },
  "Green": { color: "#008000" },
  "Yellow": { color: "#FFD700" },
  "Orange": { color: "#FFA500" },
  "Purple": { color: "#800080" },
  "Pink": { color: "#FFC0CB" },
  "Brown": { color: "#8B4513" },
  "Gray": { color: "#808080" },
  "Beige": { color: "#F5F5DC", border: true },
  "Burgundy": { color: "#800020" },
  "Olive": { color: "#808000" },
  "Teal": { color: "#008080" },
  "Gold": { color: "#FFD700" },
  "Silver": { color: "#C0C0C0", border: true },
  "Charcoal": { color: "#36454F" },
  "Cream": { color: "#FFFDD0", border: true },
  "Ash": { color: "#B2BEB5" },
  "Royal Blue": { color: "#4169E1" },
  "Safety Green": { color: "#30B21A" },
  "Pale Pink": { color: "#FFE4E1" },
  "Sand": { color: "#C2B280", border: true },
  "Denim Blue": { color: "#1560BD" },
  "Smoke": { color: "#738276" },
  "City Green": { color: "#4E6E58" },
  "Kelly Green": { color: "#4CBB17" },
  "Independence Red": { color: "#B22222" },
  "Green Apple": { color: "#8DB600" },
  "Dark Heather": { color: "#555555" },
  "Sport Grey": { color: "#A8A8A8" },
  "Indigo Blue": { color: "#3F51B5" },
  "Irish Green": { color: "#009E60" },
  "Light Blue": { color: "#ADD8E6" },
  "Light Pink": { color: "#FFB6C1" },
  "Dark Grey Heather": { color: "#4A4A4A" },
  "Evergreen": { color: "#115740" },
  "Team Purple": { color: "#6B3FA0" },
  "Maroon": { color: "#800000" },
  "Heather Red": { color: "#C26E6E" },
  "True Royal": { color: "#2B4B9B" },
  "Leaf": { color: "#71BC78" },
  "Forest Green": { color: "#228B22" },
  "Royal": { color: "#4169E1" },
  "Sapphire": { color: "#0F52BA" },
  "Tennessee Orange": { color: "#FF8200" },
  "Antique Cherry Red": { color: "#CD5C5C" },
  "Heliconia": { color: "#FF69B4" },
  "Lilac": { color: "#C8A2C8" },
  "Azalea": { color: "#F7C6C7" },
  "Cobalt": { color: "#0047AB" },
  "Garnet": { color: "#733635" },
  "Heather Mint": { color: "#B0E0E6" },
  // Example color code
  "Pebble Brown": { color: "#A0522D" },
  // Example color code
  "Deep Heather": { color: "#696969" },
  // Example color code
  "Aqua": { color: "#00FFFF" },
  "Electric Green": { color: "#00FF00" },
  "Ash Grey": { color: "#B2BEB5" },
  "Ice Grey": { color: "#D3D3D3" },
  "Cornsilk": { color: "#FFF8DC", border: true },
  "Daisy": { color: "#FFFF8D", border: true },
  "Carolina Blue": { color: "#4B9CD3" },
  "Heather Navy": { color: "#34495E" }
};
function AddToCart({ product, language }) {
  const [selectedOptions, setSelectedOptions] = React.useState({});
  const [selectedVariant, setSelectedVariant] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const addItem = useCartStore((state) => state.addItem);
  React.useEffect(() => {
    if (product.options.length > 0) {
      const initialOptions = {};
      product.options.forEach((option) => {
        initialOptions[option.name] = option.values[0];
      });
      setSelectedOptions(initialOptions);
    }
  }, [product.options]);
  React.useEffect(() => {
    console.log("Finding variant with options:", selectedOptions);
    const matchingVariant = product.variants.find(
      (variant) => variant.selectedOptions.every(
        (option) => selectedOptions[option.name] === option.value
      )
    );
    console.log("Found variant:", matchingVariant);
    setSelectedVariant(matchingVariant || null);
    if (matchingVariant?.image?.id) {
      console.log("Variant has image:", matchingVariant.image);
      const matchingImage = product.images.find((img) => img.id === matchingVariant.image.id);
      if (matchingImage) {
        console.log("Found matching image:", matchingImage);
        window.dispatchEvent(new CustomEvent("variantImageChange", {
          detail: {
            imageUrl: matchingImage.url,
            imageId: matchingImage.id
          }
        }));
      }
    }
  }, [selectedOptions, product.variants, product.images]);
  const handleOptionChange = (optionName, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: value
    }));
  };
  const handleAddToCart = async () => {
    if (selectedVariant && selectedVariant.availableForSale) {
      setIsLoading(true);
      try {
        addItem({
          id: selectedVariant.id,
          title: `${product.title} - ${selectedVariant.selectedOptions.map((opt) => opt.value).join(" / ")}`,
          price: parseFloat(selectedVariant.price.amount),
          quantity: 1,
          image: product.image
        });
      } finally {
        setIsLoading(false);
      }
    }
  };
  const handleBuyNow = async () => {
    if (selectedVariant && selectedVariant.availableForSale) {
      setIsLoading(true);
      try {
        await addItem({
          id: selectedVariant.id,
          title: `${product.title} - ${selectedVariant.selectedOptions.map((opt) => opt.value).join(" / ")}`,
          price: parseFloat(selectedVariant.price.amount),
          quantity: 1,
          image: product.image
        });
        window.location.href = "/checkout";
      } finally {
        setIsLoading(false);
      }
    }
  };
  const getColorStyle = (colorName) => {
    const normalizedColorName = Object.keys(colorMap).find(
      (key) => key.toLowerCase() === colorName.toLowerCase()
    );
    const colorInfo = normalizedColorName ? colorMap[normalizedColorName] : { color: colorName };
    return {
      backgroundColor: colorInfo.color,
      border: colorInfo.border ? "1px solid #e2e8f0" : "none"
    };
  };
  const translations = addToCartContent[language] || addToCartContent["en"];
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8 relative z-10", children: [
    product.options.map((option) => /* @__PURE__ */ jsxs("div", { className: "space-y-4 relative", children: [
      /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium uppercase tracking-wide", children: option.name }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-3 relative z-20", children: option.values.map((value) => {
        const isSelected = selectedOptions[option.name] === value;
        if (option.name.toLowerCase() === "color" || option.name.toLowerCase() === "colour") {
          return /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleOptionChange(option.name, value),
              className: `w-8 h-8 rounded-full relative transition-all duration-200 z-30 ${isSelected ? "ring-2 ring-offset-2 ring-blue-500 scale-110" : "hover:scale-105"}`,
              style: getColorStyle(value),
              title: value
            },
            value
          );
        }
        return /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleOptionChange(option.name, value),
            className: `px-4 py-2 rounded-full text-sm font-medium transition-colors relative z-30
                    ${isSelected ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900 hover:bg-gray-200"}`,
            children: value
          },
          value
        );
      }) })
    ] }, option.name)),
    selectedVariant && /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between mb-6 relative z-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-3xl font-bold text-gray-900", children: [
        selectedVariant.price.currencyCode,
        " ",
        parseFloat(selectedVariant.price.amount).toFixed(2)
      ] }),
      selectedVariant.availableForSale ? /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-green-600", children: "In Stock" }) : /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-red-600", children: "Out of Stock" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 relative z-10", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleAddToCart,
          disabled: !selectedVariant?.availableForSale || isLoading,
          className: "w-full bg-gray-900 text-white px-5 py-3 rounded-full text-base font-semibold \n                   hover:bg-gray-800 transition-all duration-200 \n                   disabled:bg-gray-300 disabled:cursor-not-allowed \n                   flex items-center justify-center gap-2 \n                   transform hover:scale-[1.02] active:scale-[0.98]\n                   relative z-20",
          children: isLoading ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Loader2, { className: "animate-spin", size: 20 }),
            /* @__PURE__ */ jsx("span", { children: translations.processing })
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(ShoppingCart, { size: 18 }),
            /* @__PURE__ */ jsx("span", { children: translations.addToCart })
          ] })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleBuyNow,
          disabled: !selectedVariant?.availableForSale || isLoading,
          className: "w-full bg-blue-600 text-white px-5 py-3 rounded-full text-base font-semibold \n                   hover:bg-blue-700 transition-all duration-200 \n                   disabled:bg-gray-300 disabled:cursor-not-allowed \n                   flex items-center justify-center gap-2\n                   transform hover:scale-[1.02] active:scale-[0.98]\n                   shadow-lg hover:shadow-xl\n                   relative z-20",
          children: isLoading ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Loader2, { className: "animate-spin", size: 20 }),
            /* @__PURE__ */ jsx("span", { children: translations.processing })
          ] }) : /* @__PURE__ */ jsx("span", { children: translations.buyNow })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center justify-center gap-2 text-xs text-gray-600 relative z-10", children: [
        /* @__PURE__ */ jsx(
          "svg",
          {
            className: "w-4 h-4",
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24",
            children: /* @__PURE__ */ jsx(
              "path",
              {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: "2",
                d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              }
            )
          }
        ),
        /* @__PURE__ */ jsx("span", { children: translations.secureTransaction })
      ] })
    ] })
  ] });
}

const en$3 = {
	title: "Size Chart for",
	measurementTips: "Measurement Tips",
	charts: {
		clothing: {
			headers: [
				"Size",
				"Chest (A)",
				"Width (B)",
				"Length (C)"
			],
			tips: [
				"Chest: Measure around the fullest part of your chest",
				"Width: Measure across the shoulders from arm to arm",
				"Length: Measure from the highest point of the shoulder to the bottom hem"
			]
		},
		shoes: {
			headers: [
				"US",
				"UK",
				"EU",
				"CM"
			],
			tips: [
				"Measure your foot length in the evening (feet swell during the day)",
				"Stand while measuring for accurate sizing",
				"Add 0.5cm for comfort fit"
			]
		},
		gloves: {
			headers: [
				"Size",
				"Palm Width",
				"Length",
				"Circumference"
			],
			tips: [
				"Measure around your palm at its widest point",
				"Measure from wrist to tip of middle finger",
				"Choose larger size if between sizes"
			]
		},
		helmets: {
			headers: [
				"Size",
				"Head Circumference",
				"Hat Size"
			],
			tips: [
				"Measure around your head about 1 inch above your eyebrows",
				"Take multiple measurements for accuracy",
				"Consider hair volume when measuring"
			]
		}
	}
};
const fr$3 = {
	title: "Guide des tailles pour",
	measurementTips: "Conseils de mesure",
	charts: {
		clothing: {
			headers: [
				"Taille",
				"Poitrine (A)",
				"Largeur (B)",
				"Longueur (C)"
			],
			tips: [
				"Poitrine : Mesurez autour de la partie la plus large de votre poitrine",
				"Largeur : Mesurez d'une épaule à l'autre",
				"Longueur : Mesurez du point le plus haut de l'épaule jusqu'au bas"
			]
		},
		shoes: {
			headers: [
				"US",
				"UK",
				"EU",
				"CM"
			],
			tips: [
				"Mesurez vos pieds le soir (les pieds gonflent pendant la journée)",
				"Restez debout pendant la mesure",
				"Ajoutez 0,5 cm pour plus de confort"
			]
		}
	}
};
const de$3 = {
	title: "Größentabelle für",
	measurementTips: "Messhinweise",
	charts: {
		clothing: {
			headers: [
				"Größe",
				"Brust (A)",
				"Breite (B)",
				"Länge (C)"
			],
			tips: [
				"Brust: Messen Sie um den breitesten Teil Ihrer Brust",
				"Breite: Messen Sie von Schulter zu Schulter",
				"Länge: Messen Sie vom höchsten Punkt der Schulter bis zum Saum"
			]
		}
	}
};
const sizeChartContent = {
	en: en$3,
	fr: fr$3,
	de: de$3
};

const $$Astro$5 = createAstro("https://perfectmotoride.com");
const $$SizeChart = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$SizeChart;
  const { productTitle, language = "en" } = Astro2.props;
  const commonSizes = {
    clothing: [
      ["S", "26.5 inch", "20 inch", "23.98 inch"],
      ["M", "27.48 inch", "21.97 inch", "24.29 inch"],
      ["L", "28.46 inch", "23.98 inch", "24.37 inch"],
      ["XL", "29.53 inch", "24.99 inch", "24.80 inch"],
      ["2XL", "30 inch", "27.95 inch", "25 inch"]
    ],
    shoes: [
      ["6", "5", "38", "23.5"],
      ["7", "6", "39", "24.1"],
      ["8", "7", "40", "24.8"],
      ["9", "8", "41", "25.4"],
      ["10", "9", "42", "26"]
    ]
    // ... other size arrays
  };
  function getProductType(title) {
    const title_lower = title.toLowerCase();
    if (title_lower.includes("shirt") || title_lower.includes("hoodie") || title_lower.includes("jacket") || title_lower.includes("sweater") || title_lower.includes("vest")) {
      return "clothing";
    }
    return null;
  }
  const content = sizeChartContent[language] || sizeChartContent["en"];
  const productType = getProductType(productTitle);
  const chartContent = productType && content.charts[productType];
  return renderTemplate`${chartContent && renderTemplate`${maybeRenderHead()}<div class="border-t pt-8"><h2 class="text-2xl font-bold mb-6 flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>${content.title}${productType.charAt(0).toUpperCase() + productType.slice(1)}</h2><div class="overflow-x-auto bg-white rounded-xl shadow-sm"><table class="min-w-full divide-y divide-gray-200"><thead class="bg-gray-50"><tr>${chartContent.headers.map((header) => renderTemplate`<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">${header}</th>`)}</tr></thead><tbody class="bg-white divide-y divide-gray-200">${commonSizes[productType].map((sizeRow) => renderTemplate`<tr class="hover:bg-gray-50 transition-colors">${sizeRow.map((cell) => renderTemplate`<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${cell}</td>`)}</tr>`)}</tbody></table></div><div class="mt-4 bg-blue-50 rounded-xl p-4 text-sm text-blue-700"><h3 class="font-semibold mb-2">${content.measurementTips}</h3><ul class="list-disc list-inside space-y-1">${chartContent.tips.map((tip) => renderTemplate`<li>${tip}</li>`)}</ul></div></div>`}`;
}, "/Users/med/Desktop/stores/cosplay/src/components/SizeChart.astro", void 0);

const en$2 = {
	title: "Customer Reviews",
	verifiedPurchase: "Verified Purchase",
	monthsAgo: "month ago",
	monthsAgoPlural: "months ago",
	ratingLabel: "Rated {rating} out of 5 stars",
	reviews: [
		{
			name: "Sarah M.",
			rating: 5,
			date: "1",
			verified: true,
			comment: "Great product! The quality is excellent and it fits perfectly. The material is comfortable and the design is exactly as shown in the pictures. Would definitely recommend!"
		},
		{
			name: "Michael R.",
			rating: 4,
			date: "2",
			verified: true,
			comment: "Very satisfied with this purchase. Good quality material and comfortable fit. Shipping was fast and the product matches the description perfectly."
		},
		{
			name: "David K.",
			rating: 5,
			date: "3",
			verified: true,
			comment: "Exceeded my expectations! The fit is perfect and the quality is outstanding. Will definitely buy more from this brand."
		}
	]
};
const fr$2 = {
	title: "Avis Clients",
	verifiedPurchase: "Achat Vérifié",
	monthsAgo: "mois",
	monthsAgoPlural: "mois",
	ratingLabel: "Noté {rating} sur 5 étoiles",
	reviews: [
		{
			name: "Sophie M.",
			rating: 5,
			date: "1",
			verified: true,
			comment: "Excellent produit ! La qualité est exceptionnelle et la taille est parfaite. Le matériau est confortable et le design est exactement comme sur les photos. Je recommande vivement !"
		},
		{
			name: "Michel R.",
			rating: 4,
			date: "2",
			verified: true,
			comment: "Très satisfait de cet achat. Matériau de bonne qualité et ajustement confortable. Livraison rapide et produit conforme à la description."
		},
		{
			name: "David K.",
			rating: 5,
			date: "3",
			verified: true,
			comment: "Au-delà de mes attentes ! L'ajustement est parfait et la qualité est exceptionnelle. J'achèterai certainement d'autres produits de cette marque."
		}
	]
};
const de$2 = {
	title: "Kundenbewertungen",
	verifiedPurchase: "Verifizierter Kauf",
	monthsAgo: "Monat",
	monthsAgoPlural: "Monate",
	ratingLabel: "Bewertet mit {rating} von 5 Sternen",
	reviews: [
		{
			name: "Sarah M.",
			rating: 5,
			date: "1",
			verified: true,
			comment: "Tolles Produkt! Die Qualität ist ausgezeichnet und die Passform perfekt. Das Material ist angenehm und das Design entspricht genau den Bildern. Sehr empfehlenswert!"
		}
	]
};
const reviewsContent = {
	en: en$2,
	fr: fr$2,
	de: de$2
};

const $$Astro$4 = createAstro("https://perfectmotoride.com");
const $$Reviews = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$Reviews;
  const { language = "en" } = Astro2.props;
  const content = reviewsContent[language] || reviewsContent["en"];
  function formatDate(months, content2) {
    const monthCount = parseInt(months);
    return `${months} ${monthCount === 1 ? content2.monthsAgo : content2.monthsAgoPlural}`;
  }
  return renderTemplate`${maybeRenderHead()}<div class="border-t pt-8" id="reviews"> <h2 class="text-2xl font-bold mb-6 flex items-center gap-2"> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path> </svg> ${content.title} </h2> <div class="space-y-6"> ${content.reviews.map((review) => renderTemplate`<div class="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"> <div class="flex items-center justify-between mb-4"> <div class="flex items-center gap-4"> <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"> <span class="text-blue-600 font-semibold">${review.name[0]}</span> </div> <div> <div class="font-medium text-gray-900">${review.name}</div> <div class="text-sm text-gray-500 flex items-center gap-2"> ${formatDate(review.date, content)} ${review.verified && renderTemplate`<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"> ${content.verifiedPurchase} </span>`} </div> </div> </div> <div class="flex text-yellow-400"${addAttribute(content.ratingLabel.replace("{rating}", review.rating.toString()), "aria-label")}> ${"\u2605".repeat(review.rating)} ${"\u2606".repeat(5 - review.rating)} </div> </div> <p class="text-gray-700">${review.comment}</p> </div>`)} </div> </div>`;
}, "/Users/med/Desktop/stores/cosplay/src/components/Reviews.astro", void 0);

const en$1 = {
	title: "Common Questions",
	faqs: [
		{
			q: "How does this product fit?",
			a: "Our products follow a regular fit design that's true to size."
		},
		{
			q: "What's your return policy?",
			a: "We offer 30-day returns for unworn items."
		},
		{
			q: "How long is shipping?",
			a: "Standard shipping takes 3-5 business days."
		}
	]
};
const fr$1 = {
	title: "Questions Fréquentes",
	faqs: [
		{
			q: "Comment taille ce produit ?",
			a: "Nos produits suivent une coupe régulière fidèle à la taille."
		},
		{
			q: "Quelle est votre politique de retour ?",
			a: "Nous offrons des retours sous 30 jours."
		},
		{
			q: "Combien de temps pour la livraison ?",
			a: "La livraison standard prend 3-5 jours."
		}
	]
};
const de$1 = {
	title: "Häufige Fragen",
	faqs: [
		{
			q: "Wie fällt dieses Produkt aus?",
			a: "Unsere Produkte haben eine reguläre Passform, die größengetreu ausfällt."
		},
		{
			q: "Wie ist Ihre Rückgabepolitik?",
			a: "Wir bieten 30 Tage Rückgaberecht für ungetragene Artikel."
		},
		{
			q: "Wie lange dauert der Versand?",
			a: "Die Standardlieferung dauert 3-5 Werktage."
		}
	]
};
const faqContent = {
	en: en$1,
	fr: fr$1,
	de: de$1
};

const $$Astro$3 = createAstro("https://perfectmotoride.com");
const $$ProductFAQ = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$ProductFAQ;
  const { productTitle, language } = Astro2.props;
  const content = faqContent[language] || faqContent.en;
  return renderTemplate`${maybeRenderHead()}<div class="bg-white border border-gray-100 rounded-xl p-6 shadow-sm"> <h3 class="text-xl font-bold text-gray-900 mb-4">${content.title}</h3> <div class="space-y-4"> ${content.faqs.map((faq) => renderTemplate`<div class="border-b border-gray-100 last:border-0 pb-4 last:pb-0"> <h4 class="font-medium text-gray-900 mb-2">${faq.q}</h4> <p class="text-gray-600">${faq.a}</p> </div>`)} </div> </div>`;
}, "/Users/med/Desktop/stores/cosplay/src/components/ProductFAQ.astro", void 0);

const en = {
	title: "Product Details",
	categories: {
		jacket: {
			specs: [
				{
					label: "Material",
					value: "50% cotton/50% polyester"
				},
				{
					label: "Weight",
					value: "7.8 oz (midweight)"
				},
				{
					label: "Origin",
					value: "Made in U.S.A."
				},
				{
					label: "Care",
					value: "Machine washable"
				}
			]
		},
		shoes: {
			specs: [
				{
					label: "Upper Material",
					value: "Premium leather"
				},
				{
					label: "Sole",
					value: "Rubber outsole"
				},
				{
					label: "Origin",
					value: "Made in Italy"
				},
				{
					label: "Care",
					value: "Clean with leather cleaner"
				}
			]
		},
		helmet: {
			specs: [
				{
					label: "Shell Material",
					value: "Polycarbonate"
				},
				{
					label: "Safety Rating",
					value: "DOT/ECE certified"
				},
				{
					label: "Weight",
					value: "1500g ±50g"
				},
				{
					label: "Ventilation",
					value: "Advanced airflow system"
				}
			]
		}
	}
};
const fr = {
	title: "Détails du Produit",
	categories: {
		jacket: {
			specs: [
				{
					label: "Matériau",
					value: "50% coton/50% polyester"
				},
				{
					label: "Poids",
					value: "220g (poids moyen)"
				},
				{
					label: "Origine",
					value: "Fabriqué aux États-Unis"
				},
				{
					label: "Entretien",
					value: "Lavable en machine"
				}
			]
		},
		shoes: {
			specs: [
				{
					label: "Matériau Supérieur",
					value: "Cuir premium"
				},
				{
					label: "Semelle",
					value: "Caoutchouc"
				},
				{
					label: "Origine",
					value: "Fabriqué en Italie"
				},
				{
					label: "Entretien",
					value: "Nettoyer avec un nettoyant pour cuir"
				}
			]
		}
	}
};
const de = {
	title: "Produktdetails",
	categories: {
		jacket: {
			specs: [
				{
					label: "Material",
					value: "50% Baumwolle/50% Polyester"
				},
				{
					label: "Gewicht",
					value: "220g (mittelgewicht)"
				},
				{
					label: "Herkunft",
					value: "Hergestellt in USA"
				},
				{
					label: "Pflege",
					value: "Maschinenwaschbar"
				}
			]
		}
	}
};
const specsContent = {
	en: en,
	fr: fr,
	de: de
};

const $$Astro$2 = createAstro("https://perfectmotoride.com");
const $$ProductSpecs = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$ProductSpecs;
  const { productTitle, language = "en" } = Astro2.props;
  function getProductCategory(title) {
    const title_lower = title.toLowerCase();
    if (title_lower.includes("jacket") || title_lower.includes("coat")) {
      return "jacket";
    }
    if (title_lower.includes("shoe") || title_lower.includes("boot")) {
      return "shoes";
    }
    if (title_lower.includes("helmet")) {
      return "helmet";
    }
    return "jacket";
  }
  const content = specsContent[language] || specsContent.en;
  const category = getProductCategory(productTitle);
  const specs = content.categories[category]?.specs || specsContent.en.categories[category]?.specs || specsContent.en.categories.jacket.specs;
  return renderTemplate`${maybeRenderHead()}<div class="bg-white border border-gray-100 rounded-xl p-6 shadow-sm"> <h3 class="text-xl font-bold text-gray-900 mb-4">${content.title}</h3> <dl class="grid grid-cols-1 md:grid-cols-2 gap-4"> ${specs.map((spec) => renderTemplate`<div class="flex items-center gap-2"> <dt class="font-medium text-gray-700">${spec.label}:</dt> <dd class="text-gray-600">${spec.value}</dd> </div>`)} </dl> </div>`;
}, "/Users/med/Desktop/stores/cosplay/src/components/ProductSpecs.astro", void 0);

const $$Astro$1 = createAstro("https://perfectmotoride.com");
const $$KeyFeatures = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$KeyFeatures;
  const { productTitle, language = "en" } = Astro2.props;
  const features = {
    en: {
      title: "Key Features",
      jacket: [
        "Premium quality materials",
        "Comfortable classic fit",
        "Kangaroo-style pocket",
        "Adjustable hood",
        "Ribbed cuffs",
        "Durable stitching"
      ],
      shoes: [
        "Premium leather upper",
        "Cushioned insole",
        "Anti-slip rubber sole",
        "Breathable design",
        "Reinforced heel",
        "Water-resistant"
      ]
    },
    fr: {
      title: "Caract\xE9ristiques Principales",
      jacket: [
        "Mat\xE9riaux de qualit\xE9 premium",
        "Coupe classique confortable",
        "Poche kangourou",
        "Capuche ajustable",
        "Poignets c\xF4tel\xE9s",
        "Coutures durables"
      ],
      shoes: [
        "Dessus en cuir premium",
        "Semelle int\xE9rieure rembourr\xE9e",
        "Semelle antid\xE9rapante",
        "Design respirant",
        "Talon renforc\xE9",
        "R\xE9sistant \xE0 l'eau"
      ]
    },
    de: {
      title: "Hauptmerkmale",
      jacket: [
        "Premium-Qualit\xE4tsmaterialien",
        "Komfortable klassische Passform",
        "K\xE4nguru-Tasche",
        "Verstellbare Kapuze",
        "Gerippte B\xFCndchen",
        "Strapazierf\xE4hige N\xE4hte"
      ],
      shoes: [
        "Premium-Leder-Obermaterial",
        "Gepolsterte Einlegesohle",
        "Rutschfeste Gummisohle",
        "Atmungsaktives Design",
        "Verst\xE4rkte Ferse",
        "Wasserabweisend"
      ]
    }
  };
  const currentLang = features[language] || features.en;
  const getProductType = (title) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("jacket") || lowerTitle.includes("hoodie") || lowerTitle.includes("veste")) return "jacket";
    if (lowerTitle.includes("shoe") || lowerTitle.includes("boot") || lowerTitle.includes("chaussure")) return "shoes";
    return "jacket";
  };
  const productType = getProductType(productTitle);
  const featureList = currentLang[productType] || features.en[productType];
  return renderTemplate`${maybeRenderHead()}<div class="bg-white border border-gray-100 rounded-xl p-6 shadow-sm"> <h3 class="text-xl font-bold text-gray-900 mb-4">${currentLang.title}</h3> <ul class="grid grid-cols-1 md:grid-cols-2 gap-4"> ${featureList.map((feature) => renderTemplate`<li class="flex items-center gap-2"> <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path> </svg> <span>${feature}</span> </li>`)} </ul> </div>`;
}, "/Users/med/Desktop/stores/cosplay/src/components/KeyFeatures.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _b;
const $$Astro = createAstro("https://perfectmotoride.com");
const $$handle = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$handle;
  const { lang, handle } = Astro2.params;
  const supportedLanguages = ["en", "fr", "de", "es", "it"];
  let product;
  let relatedProducts;
  let error;
  console.log(`🔍 Fetching product: ${handle} in language: ${lang}`);
  try {
    const { product: translatedProduct, relatedProducts: translatedRelated } = await getTranslatedProductByHandle(handle, lang);
    if (!translatedProduct) {
      console.error(`❌ No product found for ${handle} in ${lang}`);
      error = `Product not available in ${lang}`;
    } else {
      console.log(`✅ Successfully fetched ${lang} version`);
      product = translatedProduct;
      relatedProducts = translatedRelated;
    }
    if (!product) {
      error = "Product not found";
      console.error(`❌ Product not found: ${handle}`);
      return new Response(null, {
        status: 404,
        statusText: "Product not found"
      });
    }
    const images = product?.images?.edges?.map((edge) => edge.node) || [];
    const variants = product?.variants?.edges?.map((edge) => ({
      ...edge.node,
      availableForSale: true
    })) || [];
    const options = product?.options || [];
    if (images.length === 0) {
      console.error(`❌ No images found for product: ${handle}`);
      error = "Product images not available";
    }
    if (variants.length === 0) {
      console.error(`❌ No variants available for product: ${handle}`);
      console.log("Product data:", JSON.stringify(product, null, 2));
      error = "Product variants not available";
    }
    if (error) {
      return new Response(null, {
        status: 404,
        statusText: error
      });
    }
    product.processedImages = images;
    product.processedVariants = variants;
    product.processedOptions = options;
  } catch (e) {
    console.error(`❌ Error processing product:`, {
      handle,
      language: lang,
      error: e.message,
      stack: e.stack,
      productData: product
    });
    return new Response(null, {
      status: 404,
      statusText: `Failed to process product: ${e.message}`
    });
  }
  if (!product || !product.processedImages || !product.processedVariants) {
    console.error(`❌ Invalid processed data structure:`, {
      product,
      hasImages: !!product?.processedImages,
      hasVariants: !!product?.processedVariants
    });
    return new Response(null, {
      status: 404,
      statusText: "Invalid processed data"
    });
  }
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.title,
    "description": product.description,
    "image": product.processedImages.map((img) => img.url),
    "sku": product.id,
    "offers": product.processedVariants.map((variant) => ({
      "@type": "Offer",
      "price": variant.price.amount,
      "priceCurrency": variant.price.currencyCode,
      "availability": variant.availableForSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    })),
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.7",
      "reviewCount": "3"
    },
    "review": [
      {
        "@type": "Review",
        "author": "Sarah M.",
        "datePublished": "2024-02-15",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        }
      }
    ]
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${Astro2.url.origin}/${lang}`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Products",
        "item": `${Astro2.url.origin}/${lang}/products`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.title,
        "item": Astro2.url.href
      }
    ]
  };
  const alternateUrls = supportedLanguages.map((l) => ({
    lang: l,
    url: `${Astro2.url.origin}/${l}/products/${handle}`
  }));
  const metaDescription = `Buy ${product.title} - ${product.description.slice(0, 150).replace(/[^\w\s-]/g, "").trim()}...`;
  const processProductData = (rawProduct) => {
    const processedVariants = rawProduct.variants.edges.map((edge) => ({
      ...edge.node,
      selectedOptions: edge.node.selectedOptions,
      image: edge.node.image ? {
        id: edge.node.image.id,
        altText: edge.node.image.altText
      } : null
    }));
    const processedImages = rawProduct.images.edges.map((edge) => ({
      id: edge.node.id,
      url: edge.node.url,
      altText: edge.node.altText || rawProduct.title
    }));
    return {
      id: rawProduct.id,
      title: rawProduct.title,
      variants: processedVariants,
      options: rawProduct.options,
      image: processedImages[0]?.url,
      images: processedImages
    };
  };
  const processedProduct = product ? processProductData(product) : null;
  console.log("Processed product data:", {
    variants: processedProduct?.variants.length,
    images: processedProduct?.images.length,
    options: processedProduct?.options
  });
  return renderTemplate(_b || (_b = __template(["<html", " data-astro-cid-jyoeztup> <head>", '<!-- Additional SEO Meta Tags --><meta name="robots" content="index, follow"><meta name="format-detection" content="telephone=no"><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-capable" content="yes"><!-- Open Graph Product Specific --><meta property="og:price:amount"', '><meta property="og:price:currency"', '><meta property="product:availability"', "><!-- Language variants -->", '<link rel="alternate" hreflang="x-default"', '><!-- Additional Schema Markup --><script type="application/ld+json">', '</script><script type="application/ld+json">', '</script><!-- Mobile Optimization --><link rel="preload" as="image"', ">", '<!-- PWA Tags --><meta name="theme-color" content="#ffffff"><link rel="manifest" href="/manifest.json">', "</head> <body data-astro-cid-jyoeztup> ", '   <div class="fixed right-4 top-1/2 transform -translate-y-1/2 space-y-4 floating-buttons" data-astro-cid-jyoeztup> <!-- Your floating buttons here --> </div></body></html>'])), addAttribute(lang, "lang"), renderComponent($$result, "BaseHead", $$BaseHead, { "title": product.seo?.title || `${product.title} | RidWear`, "description": product.seo?.description || metaDescription, "image": product.processedImages[0].url, "article": false, "data-astro-cid-jyoeztup": true }), addAttribute(product.processedVariants[0].price.amount, "content"), addAttribute(product.processedVariants[0].price.currencyCode, "content"), addAttribute(product.processedVariants[0].availableForSale ? "in stock" : "out of stock", "content"), alternateUrls.map(({ lang: lang2, url }) => renderTemplate`<link rel="alternate"${addAttribute(lang2, "hreflang")}${addAttribute(url, "href")}>`), addAttribute(`${Astro2.url.origin}/en/products/${handle}`, "href"), unescapeHTML(JSON.stringify(productSchema)), unescapeHTML(JSON.stringify(breadcrumbSchema)), addAttribute(product.processedImages[0].url, "href"), product.processedImages.slice(1).map((img) => renderTemplate`<link rel="prefetch" as="image"${addAttribute(img.url, "href")}>`), renderHead(), renderComponent($$result, "Layout", $$Layoutp, { "title": `${product.title} | RidWear`, "data-astro-cid-jyoeztup": true }, { "default": ($$result2) => renderTemplate`  <nav aria-label="Breadcrumb" class="max-w-7xl mx-auto px-4 py-4" data-astro-cid-jyoeztup> <ol class="flex items-center space-x-2 text-sm text-gray-600" data-astro-cid-jyoeztup> <li data-astro-cid-jyoeztup> <a${addAttribute(`/${lang}`, "href")} class="hover:text-blue-600" data-astro-cid-jyoeztup>Home</a> </li> <li data-astro-cid-jyoeztup> <span class="mx-2" data-astro-cid-jyoeztup>/</span> <a${addAttribute(`/${lang}/products`, "href")} class="hover:text-blue-600" data-astro-cid-jyoeztup>Products</a> </li> <li data-astro-cid-jyoeztup> <span class="mx-2" data-astro-cid-jyoeztup>/</span> <span class="text-gray-900" data-astro-cid-jyoeztup>${product.title}</span> </li> </ol> </nav> <main class="max-w-7xl mx-auto px-4 py-12" data-astro-cid-jyoeztup> <div class="grid grid-cols-1 lg:grid-cols-2 gap-12" data-astro-cid-jyoeztup> <!-- Image Gallery --> <div class="space-y-4 lg:sticky lg:top-24 lg:self-start" data-astro-cid-jyoeztup> <div class="relative bg-gray-50 rounded-2xl overflow-hidden" data-astro-cid-jyoeztup> <div class="aspect-square" data-astro-cid-jyoeztup> <img id="mainImage"${addAttribute(product.processedImages[0].url, "src")}${addAttribute(product.processedImages[0].altText, "alt")} class="w-full h-full object-contain" data-astro-cid-jyoeztup> </div> ${product.processedImages.length > 1 && renderTemplate`${renderComponent($$result2, "Fragment", Fragment$1, { "data-astro-cid-jyoeztup": true }, { "default": ($$result3) => renderTemplate` <button id="prevImage" class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-colors" aria-label="Previous image" data-astro-cid-jyoeztup> ${renderComponent($$result3, "ChevronLeft", ChevronLeft, { "size": 24, "data-astro-cid-jyoeztup": true })} </button> <button id="nextImage" class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-colors" aria-label="Next image" data-astro-cid-jyoeztup> ${renderComponent($$result3, "ChevronRight", ChevronRight, { "size": 24, "data-astro-cid-jyoeztup": true })} </button> ` })}`} </div> ${product.processedImages.length > 1 && renderTemplate`<div class="flex gap-2 overflow-x-auto pb-2" data-astro-cid-jyoeztup> ${product.processedImages.map((image, index) => renderTemplate`<button class="flex-none w-20 aspect-square rounded-lg overflow-hidden bg-gray-50 hover:opacity-75 transition-opacity"${addAttribute(image.url, "data-image-url")}${addAttribute(image.id, "data-image-id")}${addAttribute(index, "data-image-index")} data-astro-cid-jyoeztup> <img${addAttribute(image.url, "src")}${addAttribute(image.altText, "alt")} class="w-full h-full object-cover" data-astro-cid-jyoeztup> </button>`)} </div>`} </div> <!-- Product Info --> <div class="space-y-8 relative" style="z-index: 50;" data-astro-cid-jyoeztup> <div data-astro-cid-jyoeztup> <h1 class="text-3xl font-bold mb-2" data-astro-cid-jyoeztup>${product.title}</h1> <div class="flex items-center gap-2 text-sm text-gray-600" data-astro-cid-jyoeztup> <div class="flex items-center" data-astro-cid-jyoeztup>
★★★★☆
<span class="ml-1" data-astro-cid-jyoeztup>4.0</span> </div> <span data-astro-cid-jyoeztup>•</span> <a href="#reviews" class="hover:text-blue-500" data-astro-cid-jyoeztup>42 Reviews</a> </div> </div> ${renderComponent($$result2, "AddToCart", AddToCart, { "client:load": true, "product": processedProduct, "language": lang, "client:component-hydration": "load", "client:component-path": "/Users/med/Desktop/stores/cosplay/src/themes/default/components/AddToCart", "client:component-export": "default", "data-astro-cid-jyoeztup": true })} <!-- Add debug output in development --> ${false} <!-- Product Description - Optimized for Dynamic Content --> <div class="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-sm" data-astro-cid-jyoeztup> <h2 class="text-2xl font-bold mb-4 text-gray-900 flex items-center gap-2" data-astro-cid-jyoeztup> ${renderComponent($$result2, "Info", Info, { "className": "w-6 h-6 text-blue-600", "data-astro-cid-jyoeztup": true })}
Product Details
</h2> <div class="
                  text-gray-700 
                  [&>p]:mb-6 
                  [&>p]:leading-relaxed 
                  [&>p]:text-base

                  [&>h2]:text-xl 
                  [&>h2]:font-bold 
                  [&>h2]:text-gray-900 
                  [&>h2]:mt-10 
                  [&>h2]:mb-6
                  [&>h2]:pb-2
                  [&>h2]:border-b
                  [&>h2]:border-gray-200

                  [&>h3]:text-xl 
                  [&>h3]:font-semibold 
                  [&>h3]:text-gray-800 
                  [&>h3]:mt-8 
                  [&>h3]:mb-4
                  [&>h3]:flex
                  [&>h3]:items-center
                  [&>h3]:gap-2

                  [&>h4]:text-lg 
                  [&>h4]:font-semibold 
                  [&>h4]:text-gray-800 
                  [&>h4]:mt-6 
                  [&>h4]:mb-3

                  [&>ul]:list-disc 
                  [&>ul]:ml-6 
                  [&>ul]:mb-6 
                  [&>ul>li]:mb-2
                  [&>ul>li]:text-gray-700

                  [&>ol]:list-decimal 
                  [&>ol]:ml-6 
                  [&>ol]:mb-6 
                  [&>ol>li]:mb-2
                  [&>ol>li]:text-gray-700

                  [&>strong]:font-bold
                  [&>strong]:text-gray-900

                  [&>em]:italic
                  
                  [&>a]:text-blue-600 
                  [&>a]:underline 
                  [&>a]:font-medium
                  [&>a:hover]:text-blue-800

                  [&>blockquote]:pl-4 
                  [&>blockquote]:border-l-4 
                  [&>blockquote]:border-gray-200 
                  [&>blockquote]:italic
                  [&>blockquote]:text-gray-600
                  [&>blockquote]:my-6

                  [&>img]:rounded-lg
                  [&>img]:shadow-md
                  [&>img]:my-4

                  [&>table]:w-full
                  [&>table]:border-collapse
                  [&>table]:mb-6
                  [&>table]:bg-white
                  [&>table]:shadow-sm
                  [&>table]:rounded-lg
                  [&>table]:overflow-hidden
                  [&>table]:border
                  [&>table]:border-gray-200

                  [&>table>thead]:bg-gray-50
                  [&>table>thead>tr]:border-b
                  [&>table>thead>tr]:border-gray-200

                  [&>table>thead>tr>th]:px-6
                  [&>table>thead>tr>th]:py-3
                  [&>table>thead>tr>th]:text-left
                  [&>table>thead>tr>th]:font-semibold
                  [&>table>thead>tr>th]:text-gray-900
                  [&>table>thead>tr>th]:text-sm
                  [&>table>thead>tr>th]:uppercase
                  [&>table>thead>tr>th]:tracking-wider

                  [&>table>tbody>tr]:border-b
                  [&>table>tbody>tr]:border-gray-200
                  [&>table>tbody>tr]:last:border-b-0
                  [&>table>tbody>tr:hover]:bg-gray-50

                  [&>table>tbody>tr>td]:px-6
                  [&>table>tbody>tr>td]:py-4
                  [&>table>tbody>tr>td]:text-sm
                  [&>table>tbody>tr>td]:text-gray-700
                  [&>table>tbody>tr>td]:whitespace-normal

                  [&>table>tbody>tr>td:first-child]:font-medium
                  [&>table>tbody>tr>td:first-child]:text-gray-900

                  [&>table>tfoot]:bg-gray-50
                  [&>table>tfoot>tr]:border-t
                  [&>table>tfoot>tr]:border-gray-200
                  [&>table>tfoot>tr>td]:px-6
                  [&>table>tfoot>tr>td]:py-3
                  [&>table>tfoot>tr>td]:text-sm
                  [&>table>tfoot>tr>td]:font-semibold

                  [&>*:first-child]:mt-0
                  [&>*:last-child]:mb-0
                " data-astro-cid-jyoeztup>${unescapeHTML(product.descriptionHtml)}</div> </div> <!-- Key Features List --> ${renderComponent($$result2, "KeyFeatures", $$KeyFeatures, { "productTitle": product.title, "language": lang, "data-astro-cid-jyoeztup": true })} <!-- Product Specifications --> ${renderComponent($$result2, "ProductSpecs", $$ProductSpecs, { "productTitle": product.title, "language": lang, "data-astro-cid-jyoeztup": true })} <!-- Size Chart Component --> ${renderComponent($$result2, "SizeChart", $$SizeChart, { "productTitle": product.title, "language": lang, "data-astro-cid-jyoeztup": true })} <!-- Reviews Component --> ${renderComponent($$result2, "Reviews", $$Reviews, { "language": lang, "data-astro-cid-jyoeztup": true })} <!-- Product FAQ Component --> ${renderComponent($$result2, "ProductFAQ", $$ProductFAQ, { "productTitle": product.title, "language": lang, "data-astro-cid-jyoeztup": true })} </div> </div> <!-- Related Products --> <div class="mt-16 border-t pt-16" data-astro-cid-jyoeztup> <h2 class="text-2xl font-bold mb-8" data-astro-cid-jyoeztup>Related Products</h2> <div class="grid grid-cols-1 md:grid-cols-4 gap-6" data-astro-cid-jyoeztup> ${relatedProducts.map((product2) => renderTemplate`${renderComponent($$result2, "ProductCard", ProductCard, { "client:load": true, "id": product2.node.id, "title": product2.node.title, "price": parseFloat(product2.node.priceRange.minVariantPrice.amount), "image": product2.node.images.edges[0]?.node.url, "description": product2.node.description, "handle": product2.node.handle, "lang": lang, "client:component-hydration": "load", "client:component-path": "/Users/med/Desktop/stores/cosplay/src/themes/default/components/ProductCard", "client:component-export": "default", "data-astro-cid-jyoeztup": true })}`)} </div> </div> </main> ` }));
}, "/Users/med/Desktop/stores/cosplay/src/pages/[lang]/products/[handle].astro", void 0);
const $$file = "/Users/med/Desktop/stores/cosplay/src/pages/[lang]/products/[handle].astro";
const $$url = "/[lang]/products/[handle]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$handle,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
