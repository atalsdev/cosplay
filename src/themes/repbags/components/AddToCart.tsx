import React from 'react';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { useCartStore } from '../../../store/cart';

interface Variant {
  id: string;
  title: string;
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
}

interface AddToCartProps {
  product: Product;
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
  'Denim Blue': { color: '#1560BD' }
};


export default function AddToCart({ product }: AddToCartProps) {
  const [selectedOptions, setSelectedOptions] = React.useState<Record<string, string>>({});
  const [selectedVariant, setSelectedVariant] = React.useState<Variant | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const addItem = useCartStore((state) => state.addItem);

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
    const matchingVariant = product.variants.find(variant =>
      variant.selectedOptions.every(
        option => selectedOptions[option.name] === option.value
      )
    );
    setSelectedVariant(matchingVariant || null);
  }, [selectedOptions, product.variants]);

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

  return (
    <div className="space-y-8">
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
                    <span className="sr-only">{value}</span>
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
        <div className="text-2xl font-bold">
          {selectedVariant.price.currencyCode} {parseFloat(selectedVariant.price.amount).toFixed(2)}
        </div>
      )}

      <button
        onClick={handleAddToCart}
        disabled={!selectedVariant?.availableForSale || isLoading}
        className="w-full bg-blue-500 text-white px-6 py-4 rounded-full text-lg font-semibold hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" size={24} />
            Processing...
          </>
        ) : (
          'Buy Now'
        )}
      </button>
    </div>
  );
}