import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { Product } from "@workspace/api-client-react/src/generated/api.schemas";

export interface CartItem {
  product: Product;
  quantity: number;
  cutOption: string | null;
  note: string | null;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: number, cutOption: string | null) => void;
  updateQuantity: (productId: number, cutOption: string | null, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "arthur_herron_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load cart from storage", e);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addItem = useCallback((newItem: CartItem) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.product.id === newItem.product.id && i.cutOption === newItem.cutOption
      );
      if (existingIndex >= 0) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + newItem.quantity,
          note: newItem.note || next[existingIndex].note,
        };
        return next;
      }
      return [...prev, newItem];
    });
  }, []);

  const removeItem = useCallback((productId: number, cutOption: string | null) => {
    setItems((prev) => prev.filter((i) => !(i.product.id === productId && i.cutOption === cutOption)));
  }, []);

  const updateQuantity = useCallback((productId: number, cutOption: string | null, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, cutOption);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId && i.cutOption === cutOption ? { ...i, quantity } : i
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0), [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
