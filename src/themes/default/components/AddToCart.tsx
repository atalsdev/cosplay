import React, { useEffect, useRef } from 'react';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { useCartStore } from '../../../store/cart';
import addToCartContent from './addToCartContent.json';

interface Variant {
  id: string;
  title: string;
  image?: {
    id: string;
    altText?: string;
  };
  price: {
    amount: string;
    currencyCode: string;
  };
  selectedOptions: {
    name: string;
    value: string;
  }[];
  availableForSale: boolean;
}

interface Product {
  id: string;
  title: string;
  variants: Variant[];
  options: {
    name: string;
    values: string[];
  }[];
  image: string;
  images: {
    id: string;
    url: string;
    altText?: string;
  }[];
}

interface AddToCartProps {
  product: Product;
  language: string;
}

const colorMap: Record<string, { color: string; border?: boolean }> = {
  'Black': { color: '#000000' },
  'White': { color: '#FFFFFF', border: true },
  'Red': { color: '#FF0000' },
  'Blue': { color: '#0066FF' },
  'Navy': { color: '#000080' },
  'Green': { color: '#008000' },
  'Yellow': { color: '#FFD700' },
  'Orange': { color: '#FFA500' },
  'Purple': { color: '#800080' },
  'Pink': { color: '#FFC0CB' },
  'Brown': { color: '#8B4513' },
  'Gray': { color: '#808080' },
  'Beige': { color: '#F5F5DC', border: true },
  'Burgundy': { color: '#800020' },
  'Olive': { color: '#808000' },
  'Teal': { color: '#008080' },
  'Gold': { color: '#FFD700' },
  'Silver': { color: '#C0C0C0', border: true },
  'Charcoal': { color: '#36454F' },
  'Cream': { color: '#FFFDD0', border: true },
  'Ash': { color: '#B2BEB5' },
  'Royal Blue': { color: '#4169E1' },
  'Safety Green': { color: '#30B21A' },
  'Pale Pink': { color: '#FFE4E1' },
  'Sand': { color: '#C2B280', border: true },
  'Denim Blue': { color: '#1560BD' },
  'Smoke': { color: '#738276' },
  'City Green': { color: '#4E6E58' },
  'Kelly Green': { color: '#4CBB17' },
  'Independence Red': { color: '#B22222' },
  'Green Apple': { color: '#8DB600' },
  'Dark Heather': { color: '#555555' },
  'Sport Grey': { color: '#A8A8A8' },
  'Indigo Blue': { color: '#3F51B5' },
  'Irish Green': { color: '#009E60' },  
  'Light Blue': { color: '#ADD8E6' },
  'Light Pink': { color: '#FFB6C1' },
  'Dark Grey Heather': { color: '#4A4A4A' },
  'Evergreen': { color: '#115740' },
  'Team Purple': { color: '#6B3FA0' },
  'Maroon': { color: '#800000' },
  'Heather Red': { color: '#C26E6E' },
  'True Royal': { color: '#2B4B9B' },
  'Leaf': { color: '#71BC78' },
  'Forest Green': { color: '#228B22' },
  'Royal': { color: '#4169E1' },
  'Sapphire': { color: '#0F52BA' },
  'Tennessee Orange': { color: '#FF8200' },
  'Antique Cherry Red': { color: '#CD5C5C' },
  'Heliconia': { color: '#FF69B4' },
  'Lilac': { color: '#C8A2C8' },
  'Azalea': { color: '#F7C6C7' },
  'Cobalt': { color: '#0047AB' },
  'Garnet': { color: '#733635' },
  'Heather Mint': { color: '#B0E0E6' }, // Example color code
  'Pebble Brown': { color: '#A0522D' }, // Example color code
  'Deep Heather': { color: '#696969' }, // Example color code
  'Aqua': { color: '#00FFFF' },
  'Electric Green': { color: '#00FF00' },
  'Ash Grey': { color: '#B2BEB5' },
  'Ice Grey': { color: '#D3D3D3' },
  'Cornsilk': { color: '#FFF8DC', border: true },
  'Daisy': { color: '#FFFF8D', border: true },
  'Carolina Blue': { color: '#4B9CD3' },
  'Heather Navy': { color: '#34495E' } 
};

const safeAreaStyles = `
  @supports(padding: env(safe-area-inset-bottom)) {
    .h-safe-area-inset-bottom {
      height: env(safe-area-inset-bottom);
    }
  }
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = safeAreaStyles;
  document.head.appendChild(style);
}

export default function AddToCart({ product, language }: AddToCartProps) {
  const [selectedOptions, setSelectedOptions] = React.useState<Record<string, string>>({});
  const [selectedVariant, setSelectedVariant] = React.useState<Variant | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showStickyButtons, setShowStickyButtons] = React.useState(false);
  const addToCartRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky buttons when main add to cart is not visible
        setShowStickyButtons(!entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: '-100px 0px 0px 0px' // Adjust this value to control when the sticky buttons appear
      }
    );

    if (addToCartRef.current) {
      observer.observe(addToCartRef.current);
    }

    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (product.options.length > 0) {
      const initialOptions: Record<string, string> = {};
      product.options.forEach(option => {
        initialOptions[option.name] = option.values[0];
      });
      setSelectedOptions(initialOptions);
    }
  }, [product.options]);

  React.useEffect(() => {
    console.log('Finding variant with options:', selectedOptions);
    const matchingVariant = product.variants.find(variant =>
      variant.selectedOptions.every(
        option => selectedOptions[option.name] === option.value
      )
    );
    console.log('Found variant:', matchingVariant);
    setSelectedVariant(matchingVariant || null);

    if (matchingVariant?.image?.id) {
      console.log('Variant has image:', matchingVariant.image);
      const matchingImage = product.images.find(img => img.id === matchingVariant.image.id);
      if (matchingImage) {
        console.log('Found matching image:', matchingImage);
        window.dispatchEvent(new CustomEvent('variantImageChange', {
          detail: {
            imageUrl: matchingImage.url,
            imageId: matchingImage.id
          }
        }));
      }
    }
  }, [selectedOptions, product.variants, product.images]);

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({
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
          title: `${product.title} - ${selectedVariant.selectedOptions.map(opt => opt.value).join(' / ')}`,
          price: parseFloat(selectedVariant.price.amount),
          quantity: 1,
          image: product.image,
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
          title: `${product.title} - ${selectedVariant.selectedOptions.map(opt => opt.value).join(' / ')}`,
          price: parseFloat(selectedVariant.price.amount),
          quantity: 1,
          image: product.image,
        });
        // Redirect to checkout
        window.location.href = '/checkout';
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getColorStyle = (colorName: string) => {
    const normalizedColorName = Object.keys(colorMap).find(
      key => key.toLowerCase() === colorName.toLowerCase()
    );
    const colorInfo = normalizedColorName ? colorMap[normalizedColorName] : { color: colorName };
    return {
      backgroundColor: colorInfo.color,
      border: colorInfo.border ? '1px solid #e2e8f0' : 'none',
    };
  };

  const translations = addToCartContent[language] || addToCartContent['en'];

  return (
    <div className="space-y-8">
      {/* Options Selection Area */}
      <div className="space-y-8 pb-24 md:pb-0" ref={addToCartRef}>
        {product.options.map((option) => (
          <div key={option.name} className="space-y-4">
            <label className="block text-sm font-medium uppercase tracking-wide">
              {option.name}
            </label>
            <div className="flex flex-wrap gap-3">
              {option.values.map((value) => {
                const isSelected = selectedOptions[option.name] === value;
                
                if (option.name.toLowerCase() === 'color' || option.name.toLowerCase() === 'colour') {
                  return (
                    <button
                      key={value}
                      onClick={() => handleOptionChange(option.name, value)}
                      className={`w-8 h-8 rounded-full relative transition-all duration-200 ${
                        isSelected 
                          ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' 
                          : 'hover:scale-105'
                      }`}
                      style={getColorStyle(value)}
                      title={value}
                    >
                    </button>
                  );
                }

                return (
                  <button
                    key={value}
                    onClick={() => handleOptionChange(option.name, value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                      ${isSelected 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {selectedVariant && (
          <div className="flex items-baseline justify-between mb-6">
            <div className="text-3xl font-bold text-gray-900">
              {selectedVariant.price.currencyCode} {parseFloat(selectedVariant.price.amount).toFixed(2)}
            </div>
            {selectedVariant.availableForSale ? (
              <span className="text-sm font-medium text-green-600">In Stock</span>
            ) : (
              <span className="text-sm font-medium text-red-600">Out of Stock</span>
            )}
          </div>
        )}

        {/* Main Add to Cart Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleAddToCart}
            disabled={!selectedVariant?.availableForSale || isLoading}
            className="w-full bg-gray-900 text-white px-5 py-3 rounded-full text-base font-semibold 
                     hover:bg-gray-800 transition-all duration-200 
                     disabled:bg-gray-300 disabled:cursor-not-allowed 
                     flex items-center justify-center gap-2 
                     transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>{translations.processing}</span>
              </>
            ) : (
              <>
                <ShoppingCart size={18} />
                <span>{translations.addToCart}</span>
              </>
            )}
          </button>

          <button
            onClick={handleBuyNow}
            disabled={!selectedVariant?.availableForSale || isLoading}
            className="w-full bg-blue-600 text-white px-5 py-3 rounded-full text-base font-semibold 
                     hover:bg-blue-700 transition-all duration-200 
                     disabled:bg-gray-300 disabled:cursor-not-allowed 
                     flex items-center justify-center gap-2
                     transform hover:scale-[1.02] active:scale-[0.98]
                     shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>{translations.processing}</span>
              </>
            ) : (
              <span>{translations.buyNow}</span>
            )}
          </button>
        </div>
      </div>

      {/* Sticky Buttons Container for Mobile */}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden z-50 transition-transform duration-300 ${
          showStickyButtons ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="max-w-7xl mx-auto space-y-3">
          {/* Sticky Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!selectedVariant?.availableForSale || isLoading}
            className="w-full bg-gray-900 text-white px-5 py-3 rounded-full text-base font-semibold 
                     hover:bg-gray-800 transition-all duration-200 
                     disabled:bg-gray-300 disabled:cursor-not-allowed 
                     flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>{translations.processing}</span>
              </>
            ) : (
              <>
                <ShoppingCart size={18} />
                <span>{translations.addToCart}</span>
              </>
            )}
          </button>

          {/* Additional Info */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span>{translations.secureTransaction}</span>
          </div>
        </div>

        {/* Safe Area Spacing for Mobile */}
        <div className="h-safe-area-inset-bottom" />
      </div>
    </div>
  );
}