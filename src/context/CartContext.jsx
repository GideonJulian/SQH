"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

const CART_STORAGE_KEY = "sqh_cart_items";

function getItemKey(product, size = "") {
  return `${product.id}:${size || "default"}`;
}

export function getPriceValue(price) {
  if (typeof price === "number") {
    return price;
  }

  return Number(String(price).replace(/[^0-9.]/g, "")) || 0;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product, options = {}) => {
    const size = options.size || product.sizes?.[0] || "OS";
    const quantity = options.quantity || 1;
    const itemKey = getItemKey(product, size);

    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.key === itemKey);

      if (existingItem) {
        return currentItems.map((item) =>
          item.key === itemKey
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }

      return [
        ...currentItems,
        {
          key: itemKey,
          id: product.id,
          title: product.title,
          price: product.price,
          src: product.src,
          category: product.category,
          size,
          quantity,
        },
      ];
    });
  };

  const updateQuantity = (key, quantity) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.key === key ? { ...item, quantity: Math.max(1, quantity) } : item,
      ),
    );
  };

  const removeFromCart = (key) => {
    setItems((currentItems) => currentItems.filter((item) => item.key !== key));
  };

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const subtotal = items.reduce(
    (total, item) => total + getPriceValue(item.price) * item.quantity,
    0,
  );

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      addToCart,
      updateQuantity,
      removeFromCart,
    }),
    [items, itemCount, subtotal],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
