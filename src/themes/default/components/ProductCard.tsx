import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../../../store/cart';

// Define European language to currency mapping
const currencyMapping = {
  'fr': { symbol: '€', currency: 'EUR', rate: 1.17 }, // GBP to EUR
  'it': { symbol: '€', currency: 'EUR', rate: 1.17 },
  'de': { symbol: '€', currency: 'EUR', rate: 1.17 },
  'es': { symbol: '€', currency: 'EUR', rate: 1.17 },
  'en': { symbol: '£', currency: 'GBP', rate: 1 },
  // Add more languages as needed
};

const translations = {
  en: {
    addToCart: 'Add to Cart'
  },
  fr: {
    addToCart: 'Ajouter au panier'
  },
  es: {
    addToCart: 'Añadir al carrito'
  },
  de: {
    addToCart: 'In den Warenkorb'
  },
  nl: {
    addToCart: 'In winkelwagen'
  },
  it: {
    addToCart: 'Aggiungi al carrello'
  },
  pt: {
    addToCart: 'Adicionar ao carrinho'
  },
  pl: {
    addToCart: 'Dodaj do koszyka'
  },
  ru: {
    addToCart: 'Добавить в корзину'
  },
  ja: {
    addToCart: 'カートに追加'
  },
  ko: {
    addToCart: '장바구니에 담기'
  },
  zh: {
    addToCart: '添加到购物车'
  },
  ar: {
    addToCart: 'أضف إلى السلة'
  },
  tr: {
    addToCart: 'Sepete Ekle'
  },
  sv: {
    addToCart: 'Lägg i varukorgen'
  },
  da: {
    addToCart: 'Læg i kurv'
  },
  fi: {
    addToCart: 'Lisää ostoskoriin'
  },
  no: {
    addToCart: 'Legg i handlekurv'
  },
  cs: {
    addToCart: 'Přidat do košíku'
  },
  hu: {
    addToCart: 'Kosárba tesz'
  }
};

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  image: string;
  imageAlt: string;
  description: string;
  handle: string;
  lang: string;
}

export default function ProductCard({ id, title, price, image, imageAlt, description, handle, lang }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id,
      title,
      price,
      quantity: 1,
      image,
    });
  };

  // Get currency info based on language
  const currencyInfo = currencyMapping[lang as keyof typeof currencyMapping] || currencyMapping.en;
  
  // Convert price if needed (price is already in GBP)
  const displayPrice = (price * currencyInfo.rate).toFixed(2);
  const buttonText = translations[lang as keyof typeof translations]?.addToCart || translations.en.addToCart;

  return (
    <a 
      href={`/${lang}/products/${handle}`}
      className="group flex flex-col h-full bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img 
          src={image} 
          alt={imageAlt} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          width="400"
          height="400"
        />
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-grow p-4 space-y-3">
        {/* Title */}
        <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-500 line-clamp-2 flex-grow">
          {description}
        </p>

        {/* Price and Button Container */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
          {/* Price */}
          <div className="text-xl font-bold text-gray-900">
            {currencyInfo.symbol}{displayPrice}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 
                     bg-blue-600 text-white text-sm font-medium rounded-lg
                     hover:bg-blue-700 active:bg-blue-800
                     transition-colors duration-200 ease-in-out
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label={buttonText}
          >
            <ShoppingCart size={18} className="flex-shrink-0" />
            <span className="whitespace-nowrap">{buttonText}</span>
          </button>
        </div>
      </div>
    </a>
  );
}