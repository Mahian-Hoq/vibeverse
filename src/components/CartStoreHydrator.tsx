'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';

/**
 * Component that handles cart store rehydration on client mount
 * Wraps the app to ensure hydration happens before store access
 */
export function CartStoreHydrator() {
  useEffect(() => {
    // Manually trigger rehydration since we use skipHydration: true
    useCartStore.persist.rehydrate();
  }, []);

  return null;
}
