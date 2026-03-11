'use client';

import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useHydration } from '@/hooks/useHydration';

export default function CartWidget() {
  const isHydrated = useHydration();
  const totalItems = useCartStore((state) => state.getTotalItems());

  // Don't render until hydrated to prevent mismatches
  if (!isHydrated) {
    return (
      <Link href="/cart" className="relative hover:opacity-80 transition-opacity">
        <ShoppingCart className="w-6 h-6 text-gray-700" />
      </Link>
    );
  }

  return (
    <Link href="/cart" className="relative hover:opacity-80 transition-opacity">
      <ShoppingCart className="w-6 h-6 text-gray-700" />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </Link>
  );
}
