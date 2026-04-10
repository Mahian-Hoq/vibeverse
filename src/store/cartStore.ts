import { create } from 'zustand';
import { persist, PersistStorage, StorageValue } from 'zustand/middleware';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image_url: string;
  selectedColor?: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string, selectedColor?: string) => void;
  updateQuantity: (id: string, quantity: number, selectedColor?: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

// Custom storage with retry logic and error handling
const createRobustStorage = (): PersistStorage<CartStore> => {
  let isWriting = false;
  const writeQueue: Array<() => void> = [];

  const processQueue = async () => {
    if (isWriting || writeQueue.length === 0) return;
    isWriting = true;
    try {
      const task = writeQueue.shift();
      if (task) {
        await new Promise((resolve) => {
          task();
          // Use setTimeout to ensure write completes before next
          setTimeout(resolve, 10);
        });
      }
    } catch (error) {
      console.debug('Write error (non-blocking):', error);
    } finally {
      isWriting = false;
      // Process next item in queue
      if (writeQueue.length > 0) {
        setTimeout(processQueue, 0);
      }
    }
  };

  return {
    getItem: (name: string) => {
      try {
        const item = localStorage.getItem(name);
        return item ? JSON.parse(item) : null;
      } catch (error) {
        console.debug('Storage read error (non-blocking):', error);
        return null;
      }
    },
    setItem: (name: string, value: StorageValue<CartStore>) => {
      writeQueue.push(() => {
        try {
          localStorage.setItem(name, JSON.stringify(value));
        } catch (error) {
          console.debug('Storage write error (non-blocking):', error);
        }
      });
      processQueue();
    },
    removeItem: (name: string) => {
      writeQueue.push(() => {
        try {
          localStorage.removeItem(name);
        } catch (error) {
          console.debug('Storage remove error (non-blocking):', error);
        }
      });
      processQueue();
    },
  };
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.id === product.id && item.selectedColor === product.selectedColor
          );

          if (existingItem) {
            // Item already exists, increment quantity
            return {
              items: state.items.map((item) =>
                item.id === product.id && item.selectedColor === product.selectedColor
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          } else {
            // New item, add to cart with quantity 1
            return {
              items: [...state.items, { ...product, quantity: 1 }],
            };
          }
        });
      },

      removeItem: (id, selectedColor) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.id === id && item.selectedColor === selectedColor)
          ),
        }));
      },

      updateQuantity: (id, quantity, selectedColor) => {
        if (quantity <= 0) {
          get().removeItem(id, selectedColor);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id && item.selectedColor === selectedColor ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'cart-storage',
      skipHydration: true,
      storage: createRobustStorage(),
      merge: (persistedState: unknown, currentState: CartStore) => {
        return {
          ...currentState,
          ...(persistedState as Partial<CartStore>),
        };
      },
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.debug('Cart rehydration error (non-blocking):', (error as Error).message);
        }
      },
    }
  )
);
