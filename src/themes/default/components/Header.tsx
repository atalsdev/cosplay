import React, { useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import Cart from './Cart';
import { useCartStore } from '../../../store/cart';

export default function Header() {
  const { isOpen, setIsOpen, items } = useCartStore();
  const siteName = import.meta.env.PUBLIC_SITE_NAME || 'Drivi';

  // Hydrate the store after mount
  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="text-2xl font-bold">{siteName}</a>
          
          <nav className="hidden md:flex space-x-8">
            <a href="/collections" className="text-gray-700 hover:text-black">Collections</a>
            <a href="/helmets" className="text-gray-700 hover:text-black">Helmets</a>
            <a href="/jackets" className="text-gray-700 hover:text-black">Jackets</a>
            <a href="/accessories" className="text-gray-700 hover:text-black">Accessories</a>
          </nav>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-gray-700 hover:text-black relative"
            >
              <ShoppingCart size={24} />
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      
      <div 
        className={`fixed inset-y-0 right-0 w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-[200] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Shopping Cart</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          </div>
          <Cart onCheckout={() => setIsOpen(false)} />
        </div>
      </div>
      
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[150]"
          onClick={() => setIsOpen(false)}
        />
      )}
    </header>
  );
}