import React, { useEffect, useState } from 'react';
import { ShoppingCart, Globe } from 'lucide-react';
import Cart from './Cart';
import { useCartStore } from '../../../store/cart';

interface HeaderProps {
  siteName: string;
  menuConfig: {
    [key: string]: {
      [key: string]: {
        items: Array<{
          label: string;
          href: string;
        }>;
      };
    };
  };
  languages: {
    [key: string]: string;
  };
  projectType: string;
  currentPath: string;
}

export default function Header({ 
  siteName, 
  menuConfig, 
  languages, 
  projectType, 
  currentPath 
}: HeaderProps) {
  // Extract initial language from current path
  const getInitialLanguage = () => {
    const pathLang = currentPath.split('/')[1]; // Get language from URL path
    return languages[pathLang] ? pathLang : 'en'; // Fallback to 'en' if invalid
  };

  const { isOpen, setIsOpen, items } = useCartStore();
  const [language, setLanguage] = useState(getInitialLanguage());
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  // Update language when URL changes
  useEffect(() => {
    const pathLang = currentPath.split('/')[1];
    if (languages[pathLang] && pathLang !== language) {
      setLanguage(pathLang);
    }
  }, [currentPath]);

  // Get current menu items based on language and project type
  const getCurrentMenuItems = () => {
    const langContent = menuConfig[language] || menuConfig.en;
    return langContent[projectType] || langContent.default;
  };

  const currentMenuItems = getCurrentMenuItems();

  // Handle language change with path update
  const changeLanguage = (newLang: string) => {
    const currentLang = language;
    setLanguage(newLang);
    setShowLanguageMenu(false);
    
    // Update URL to new language
    const newPath = currentPath.replace(`/${currentLang}/`, `/${newLang}/`);
    window.location.href = newPath;
    
    localStorage.setItem('preferred-language', newLang);
  };

  // Get home URL with current language
  const getHomeUrl = () => `/${language}`;

  // Hydrate the store
  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <a href={getHomeUrl()} className="text-2xl font-bold">{siteName}</a>
          
          <nav className="hidden md:flex space-x-8">
            {currentMenuItems.items.map((item, index) => (
              <a 
                key={index}
                href={item.href}
                className="text-gray-700 hover:text-black"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="flex items-center space-x-2 text-gray-700 hover:text-black"
              >
                <Globe size={20} />
                <span className="text-sm">{languages[language]}</span>
              </button>

              {showLanguageMenu && (
                <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-50">
                  {Object.entries(languages).map(([code, name]) => (
                    <button
                      key={code}
                      onClick={() => changeLanguage(code)}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        language === code ? 'bg-gray-100' : 'hover:bg-gray-50'
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Button */}
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