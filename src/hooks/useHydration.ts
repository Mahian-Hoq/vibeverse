import { useEffect, useState } from 'react';

/**
 * Hook to ensure Zustand store is properly hydrated before rendering
 * Prevents hydration mismatches and concurrent write errors
 */
export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}
