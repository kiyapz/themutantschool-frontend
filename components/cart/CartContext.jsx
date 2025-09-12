"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext({
  cartItems: [],
  setCartItems: () => {},
  cartCount: 0,
  setCartCount: () => {},
});

export function CartProvider({ children }) {
  const [cartItems, _setCartItems] = useState([]);
  const [cartCount, _setCartCount] = useState(0);

  // Initialize from localStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem("CART_ITEMS");
        const initial = raw ? JSON.parse(raw) : [];
        const normalized = Array.isArray(initial) ? initial : [];
        _setCartItems(normalized);
        _setCartCount(normalized.length);
      }
    } catch (_) {
      // ignore malformed localStorage
    }
  }, []);

  // Accept array or functional updater, persist to localStorage, and keep count in sync
  const setCartItems = (itemsOrUpdater) => {
    _setCartItems((previousItems) => {
      const computed =
        typeof itemsOrUpdater === "function"
          ? itemsOrUpdater(previousItems)
          : itemsOrUpdater;
      const next = Array.isArray(computed) ? computed : [];
      _setCartCount(next.length);
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("CART_ITEMS", JSON.stringify(next));
        }
      } catch (_) {
        // ignore persistence errors
      }
      return next;
    });
  };

  const setCartCount = (countOrUpdater) => {
    if (typeof countOrUpdater === "function") {
      _setCartCount((prev) => {
        const next = Number(countOrUpdater(prev)) || 0;
        return next < 0 ? 0 : next;
      });
    } else {
      const next = Number(countOrUpdater) || 0;
      _setCartCount(next < 0 ? 0 : next);
    }
  };

  // Listen for cross-tab or external updates
  useEffect(() => {
    const syncFromStorage = () => {
      try {
        const raw = localStorage.getItem("CART_ITEMS");
        const items = raw ? JSON.parse(raw) : [];
        const normalized = Array.isArray(items) ? items : [];
        _setCartItems(normalized);
        _setCartCount(normalized.length);
      } catch (_) {
        // ignore
      }
    };

    const onCartChanged = () => syncFromStorage();
    window.addEventListener("cart:changed", onCartChanged);
    const onStorage = (e) => {
      if (e.key === "CART_ITEMS") syncFromStorage();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("cart:changed", onCartChanged);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const value = useMemo(
    () => ({ cartItems, setCartItems, cartCount, setCartCount }),
    [cartItems, cartCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
