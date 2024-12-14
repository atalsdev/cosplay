import React from 'react';
import { useCartStore } from '../../store/cart';
import { Trash2, Plus, Minus, Loader2 } from 'lucide-react';

interface CartProps {
  onCheckout?: () => void;
}

export default function Cart({ onCheckout }: CartProps) {
  const { items, removeItem, updateQuantity, total, isProcessing, setProcessing } = useCartStore();

  const handleCheckout = async () => {
    try {
      setProcessing(true);
      const totalAmount = total();
      onCheckout?.();
      window.location.href = `https://digivast.store/source.php?productname=cart&price=${totalAmount}`;
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <p className="text-gray-500">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 border-b py-4">
            <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded" />
            <div className="flex-1">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-gray-600">${item.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                disabled={isProcessing}
              >
                <Minus size={16} />
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                disabled={isProcessing}
              >
                <Plus size={16} />
              </button>
            </div>
            <button
              onClick={() => removeItem(item.id)}
              className="p-2 text-red-500 hover:bg-red-50 rounded disabled:opacity-50"
              disabled={isProcessing}
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
      
      <div className="border-t p-4 bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">Total:</span>
          <span className="text-xl font-bold">${total().toFixed(2)}</span>
        </div>
        <button
          onClick={handleCheckout}
          disabled={isProcessing}
          className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Processing...
            </>
          ) : (
            'Proceed to Checkout'
          )}
        </button>
      </div>
    </div>
  );
}