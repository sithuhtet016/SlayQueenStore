import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartItem = {
  productId: number;
  variantId?: number;
  quantity: number;
};

export type CartContextValue = {
  items: CartItem[];
  cartCount: number;
  addToCart: (productId: number, variantId?: number, quantity?: number) => void;
  updateQuantity: (
    productId: number,
    variantId: number | undefined,
    quantity: number
  ) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

function loadCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem("cart");
    if (!stored) return [];
    const parsed = JSON.parse(stored) as CartItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => ({
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity ?? 1,
    }));
  } catch (_e) {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => loadCartFromStorage());

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (
    productId: number,
    variantId?: number,
    quantity: number = 1
  ) => {
    setItems((prev) => {
      const next = [...prev];
      const existingIndex = next.findIndex(
        (item) => item.productId === productId && item.variantId === variantId
      );

      if (existingIndex >= 0) {
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
      } else {
        next.push({ productId, variantId, quantity });
      }

      return next;
    });
  };

  const updateQuantity = useCallback(
    (productId: number, variantId: number | undefined, quantity: number) => {
      setItems((prev) => {
        // Remove item when quantity <= 0
        if (quantity <= 0) {
          return prev.filter(
            (item) =>
              !(item.productId === productId && item.variantId === variantId)
          );
        }

        const next = [...prev];
        const index = next.findIndex(
          (item) => item.productId === productId && item.variantId === variantId
        );

        if (index >= 0) {
          next[index] = { ...next[index], quantity };
          return next;
        }

        next.push({ productId, variantId, quantity });
        return next;
      });
    },
    []
  );

  const cartCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  );

  const clearCart = useCallback(() => {
    setItems([]);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("cart");
    }
  }, []);

  const value = useMemo(
    () => ({ items, cartCount, addToCart, updateQuantity, clearCart }),
    [items, cartCount, updateQuantity, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
