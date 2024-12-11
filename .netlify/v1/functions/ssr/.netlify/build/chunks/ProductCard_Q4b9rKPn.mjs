import { jsxs, jsx } from 'react/jsx-runtime';
import 'react';
import { ShoppingCart } from 'lucide-react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isProcessing: false,
      setIsOpen: (open) => set({ isOpen: open }),
      setProcessing: (processing) => set({ isProcessing: processing }),
      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          if (existingItem) {
            return {
              items: state.items.map(
                (i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
              isOpen: true
            };
          }
          return {
            items: [...state.items, { ...item, quantity: 1 }],
            isOpen: true
          };
        });
      },
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id)
        }));
      },
      updateQuantity: (id, quantity) => {
        if (quantity === 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map(
            (item) => item.id === id ? { ...item, quantity } : item
          )
        }));
      },
      clearCart: () => set({ items: [] }),
      total: () => {
        const items = get().items;
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      }
    }),
    {
      name: "cart-storage",
      skipHydration: true
    }
  )
);

function ProductCard({ id, title, price, image, description, handle, lang = "en" }) {
  const addItem = useCartStore((state) => state.addItem);
  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem({
      id,
      title,
      price,
      quantity: 1,
      image
    });
  };
  return /* @__PURE__ */ jsxs(
    "a",
    {
      href: `/${lang}/products/${handle}`,
      className: "group bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:-translate-y-1",
      children: [
        /* @__PURE__ */ jsx("div", { className: "aspect-square overflow-hidden", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: image,
            alt: title,
            className: "w-full h-full object-cover transition-transform group-hover:scale-105"
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold group-hover:text-blue-600 transition-colors", children: title }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600 mt-2 text-sm line-clamp-2", children: description }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-xl font-bold", children: [
              "$",
              price.toFixed(2)
            ] }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: handleAddToCart,
                className: "bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors",
                children: [
                  /* @__PURE__ */ jsx(ShoppingCart, { size: 20 }),
                  "Add to Cart"
                ]
              }
            )
          ] })
        ] })
      ]
    }
  );
}

export { ProductCard as P, useCartStore as u };
