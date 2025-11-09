"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";

const CartContext = createContext({
  cartItems: [],
  setCartItems: () => {},
  cartCount: 0,
  setCartCount: () => {},
  refreshCart: () => {},
  isGuest: false,
  setIsGuest: () => {},
  guestCartId: null,
  setGuestCartId: () => {},
  guestEmail: "",
  setGuestEmail: () => {},
});

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [isGuest, setIsGuest] = useState(false);
  const [guestCartId, setGuestCartId] = useState(null);
  const [guestEmail, setGuestEmail] = useState("");

  // Determine if user is a guest or authenticated user
  useEffect(() => {
    const token = localStorage.getItem("login-accessToken");
    const storedGuestCartId = localStorage.getItem("guest-cart-id");
    const storedGuestEmail = localStorage.getItem("guest-email");

    if (!token && storedGuestCartId) {
      setIsGuest(true);
      setGuestCartId(storedGuestCartId);
      if (storedGuestEmail) {
        setGuestEmail(storedGuestEmail);
      }
    } else {
      setIsGuest(false);
    }
  }, []);

  // Save guest cart ID whenever it changes
  useEffect(() => {
    if (isGuest && guestCartId) {
      localStorage.setItem("guest-cart-id", guestCartId);
    }
  }, [isGuest, guestCartId]);

  // Save guest email whenever it changes
  useEffect(() => {
    if (isGuest && guestEmail) {
      localStorage.setItem("guest-email", guestEmail);
    }
  }, [isGuest, guestEmail]);

  // Fetch cart from backend only
  const fetchCartFromBackend = async () => {
    try {
      const token = localStorage.getItem("login-accessToken");
      const storedUser = localStorage.getItem("USER");
      const storedGuestCartId = localStorage.getItem("guest-cart-id");

      // Guest cart flow
      if (!token && storedGuestCartId) {
        try {
          console.log("[CartContext] Fetching guest cart:", storedGuestCartId);
          const response = await axios.get(
            `https://themutantschool-backend.onrender.com/api/guest/cart?cartId=${storedGuestCartId}`
          );
          console.log("[CartContext] Guest cart response:", response);

          if (response.data?.success && response.data?.cart) {
            setIsGuest(true);
            setGuestCartId(response.data.cart._id || storedGuestCartId);

            const cartItemsData = response.data.cart.missions || [];
            const filteredItems = cartItemsData.filter(
              (entry) => entry?.mission
            );
            const mappedItems = filteredItems.map((entry) => {
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
            return;
          }
        } catch (guestError) {
          console.log(
            "[CartContext] Guest cart fetch failed:",
            guestError.message
          );
          // If guest cart fetch fails, we'll reset it
          localStorage.removeItem("guest-cart-id");
          setIsGuest(false);
          setGuestCartId(null);
          setCartItems([]);
          setCartCount(0);
          return;
        }
      }

      // Authenticated user flow
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
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("[CartContext] Auth cart response:", response);

      if (response.status === 200 && response.data.cart) {
        const cartItemsData = response.data.cart.missions || [];
        const filteredItems = cartItemsData.filter((entry) => entry?.mission);
        const mappedItems = filteredItems.map((entry) => {
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
      }
    } catch (error) {
      // Silently handle errors to prevent "mission not found" on non-mission pages
      console.log(
        "[CartContext] Cart fetch failed (this is normal on non-mission pages):",
        error.message
      );

      // Handle specific error cases silently
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log("[CartContext] Authentication error, clearing cart");
        localStorage.removeItem("login-accessToken");
        localStorage.removeItem("USER");
      }

      // Don't throw error, just set empty cart silently
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
      isGuest,
      setIsGuest,
      guestCartId,
      setGuestCartId,
      guestEmail,
      setGuestEmail,
    }),
    [cartItems, cartCount, isGuest, guestCartId, guestEmail]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
