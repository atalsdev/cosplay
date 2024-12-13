import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../../store/cart';

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  image: string;
  description: string;
  handle: string;
}

export default function ProductCard({ id, title, price, image, description, handle }: ProductCardProps) {
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

  return (
    <a 
      href={`/products/${handle}`}
      className="group bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:-translate-y-1"
    >
      <div className="aspect-square overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors">{title}</h3>
        <p className="text-gray-600 mt-2 text-sm line-clamp-2">{description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold">${price.toFixed(2)}</span>
          <button
            onClick={handleAddToCart}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <ShoppingCart size={20} />
            Add to Cart
          </button>
        </div>
      </div>
    </a>
  );
}