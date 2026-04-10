'use client';

import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCartStore, type CartItem } from '@/store/cartStore';

interface AddToCartButtonProps {
  product: Omit<CartItem, 'quantity'>;
  className?: string;
  disabled?: boolean;
  disabledLabel?: string;
}

export default function AddToCartButton({
  product,
  className = '',
  disabled = false,
  disabledLabel = 'Out of Stock',
}: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    if (disabled) {
      return;
    }

    addItem(product);
    
    // Show "Added!" feedback for 2 seconds
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 w-full ${
        disabled
          ? 'bg-gray-300 text-gray-600 cursor-not-allowed shadow-none'
          : isAdded
          ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
          : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700'
      } ${disabled ? '' : 'text-white shadow-md hover:shadow-lg'} font-semibold py-2 sm:py-3 rounded-lg transition-all duration-200 ${className}`}
    >
      <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
      <span>{disabled ? disabledLabel : isAdded ? 'Added to Cart!' : 'Add to Cart'}</span>
    </button>
  );
}
