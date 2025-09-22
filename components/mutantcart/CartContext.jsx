"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";

const CartContext = createContext({
  cartItems: [],
  setCartItems: () => {},
  cartCount: 0,
  setCartCount: () => {},
  refreshCart: () => {},
});

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // Fetch cart from backend only
  const fetchCartFromBackend = async () => {
    try {
      const token = localStorage.getItem("login-accessToken");
      const storedUser = localStorage.getItem("USER");

      if (!token || !storedUser) {
        setCartItems([]);
        setCartCount(0);
        return;
      }

      // Only fetch cart for students
      const user = JSON.parse(storedUser);
      if (user.role !== "student") {
        setCartItems([]);
        setCartCount(0);
        return;
      }

      const response = await axios.get(
        "https://themutantschool-backend.onrender.com/api/mission-cart",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const cartItemsData = response.data.cart.missions || [];
      const mappedItems = cartItemsData.map((entry) => {
        const mission = entry?.mission || {};
        return {
          id: mission._id || entry?._id,
          image: mission.thumbnail?.url || "/images/placeholder.png",
          title: mission.title || "",
          by: "The Mutant School",
          price:
            typeof mission.price === "number"
              ? mission.price
              : Number(mission.price) || 0,
        };
      });

      setCartItems(mappedItems);
      setCartCount(mappedItems.length);
    } catch (error) {
      console.error("[CartContext] Error fetching cart:", error);

      // Handle specific error cases
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log("[CartContext] Authentication error, clearing cart");
        localStorage.removeItem("login-accessToken");
        localStorage.removeItem("USER");
      } else if (error.response?.status === 500) {
        console.log("[CartContext] Server error, will retry on next render");
      }

      // Don't throw error, just set empty cart
      setCartItems([]);
      setCartCount(0);
    }
  };

  // Initialize cart from backend on mount
  useEffect(() => {
    fetchCartFromBackend();
  }, []);

  // Listen for cart changes from other components
  useEffect(() => {
    const onCartChanged = () => {
      console.log("[CartContext] Cart changed event received, refreshing...");
      fetchCartFromBackend();
    };

    window.addEventListener("cart:changed", onCartChanged);
    return () => {
      window.removeEventListener("cart:changed", onCartChanged);
    };
  }, []);

  const value = useMemo(
    () => ({
      cartItems,
      setCartItems,
      cartCount,
      setCartCount,
      refreshCart: fetchCartFromBackend,
    }),
    [cartItems, cartCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
