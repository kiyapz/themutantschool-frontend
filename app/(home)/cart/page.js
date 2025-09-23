"use client";
import { useEffect, useState, useCallback } from "react";
import ShoppingCart from "@/components/mutantcart/ShoppingCart";
import { useCart } from "@/components/mutantcart/CartContext";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Page() {
  const { setCartItems, setCartCount } = useCart();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  // Fetch cart items from backend only
  const fetchCartItems = useCallback(async () => {
    console.log("[Cart Page] Fetching cart items from backend...");
    const token = localStorage.getItem("login-accessToken");
    if (!token) {
      console.log("[Cart Page] No token found. Redirecting to login.");
      router.push("/auth/login");
      return;
    }

    try {
      setIsLoading(true);
      const cartRes = await axios.get(
        "https://themutantschool-backend.onrender.com/api/mission-cart",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const cartItemsData = cartRes.data.cart.missions || [];
      console.log("[Cart Page] Backend cart data:", cartItemsData);

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

      setItems(mappedItems);
      setCartItems(mappedItems); // Update context (backend-only)
      setCartCount(mappedItems.length);
      setError(null);
    } catch (error) {
      console.error("[Cart Page] Error fetching cart:", error);
      setError("Failed to load cart items.");
      if (error.response?.status === 401) {
        router.push("/auth/login");
      }
    } finally {
      setIsLoading(false);
    }
  }, [router, setCartCount, setCartItems]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  // Handle Stripe localization errors
  useEffect(() => {
    const handleGlobalError = (event) => {
      if (event.error?.message?.includes("Cannot find module './en'")) {
        console.warn(
          "Stripe localization error caught, but payment should still work"
        );
        event.preventDefault();
      }
    };

    window.addEventListener("error", handleGlobalError);
    window.addEventListener("unhandledrejection", handleGlobalError);

    return () => {
      window.removeEventListener("error", handleGlobalError);
      window.removeEventListener("unhandledrejection", handleGlobalError);
    };
  }, []);

  const handleRemove = async (missionId) => {
    console.log(`[Remove from Cart] Removing missionId: ${missionId}`);
    const token = localStorage.getItem("login-accessToken");
    if (!token) {
      console.log("[Remove from Cart] No token found.");
      return;
    }

    try {
      // Remove from backend first
      await axios.delete(
        `https://themutantschool-backend.onrender.com/api/mission-cart/${missionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(
        `[Remove from Cart] Successfully removed missionId: ${missionId}`
      );

      // Refresh cart from backend to get updated state
      await fetchCartItems();

      // Fire cart changed event for other components
      window.dispatchEvent(new CustomEvent("cart:changed"));
    } catch (err) {
      console.error(
        "[Remove from Cart] API Error:",
        err.response?.data || err.message
      );
      setError("Failed to remove item. Please try again.");
    }
  };

  const handleCheckout = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setError(null);

    const token = localStorage.getItem("login-accessToken");
    if (!token) {
      setError("You must be logged in to proceed. Redirecting...");
      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
      setIsProcessing(false);
      return;
    }

    if (!Array.isArray(items) || items.length === 0) {
      setError("Your cart is empty.");
      setIsProcessing(false);
      return;
    }

    try {
      console.log(
        "[Checkout] Creating order for items:",
        items.map((item) => item.id)
      );

      const orderResponse = await axios.post(
        "https://themutantschool-backend.onrender.com/api/mission-orders",
        { missionId: items.map((item) => item.id), quantity: items.length },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const orderId =
        orderResponse.data.order?._id || orderResponse.data.data?._id;
      console.log("[Checkout] Created orderId:", orderId);
      if (!orderId)
        throw new Error("Failed to create order - no order ID returned.");

      console.log("[Checkout] Creating payment session for order:", orderId);
      const paymentResponse = await axios.post(
        `https://themutantschool-backend.onrender.com/api/payment/create-session/order/${orderId}`,
        {
          currency: "USD",
          locale: "en",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const sessionId = paymentResponse.data.sessionId;
      const redirectUrl =
        paymentResponse.data.url || paymentResponse.data.redirectUrl;

      console.log("[Checkout] Payment session created:", {
        sessionId,
        redirectUrl,
        fullResponse: paymentResponse.data,
      });

      if (!redirectUrl) {
        throw new Error("No payment URL received from server.");
      }

      // DON'T clear cart here - let backend handle it after successful payment
      console.log("[Checkout] Redirecting to payment:", redirectUrl);

      try {
        window.location.href = redirectUrl;
      } catch (redirectError) {
        console.error("[Checkout] Redirect failed:", redirectError);
        setError("Failed to redirect to payment. Please try again.");
      }
    } catch (err) {
      console.error("[Checkout] Full error:", err);
      console.error("[Checkout] Error response:", err.response?.data);

      let errorMessage = "Payment failed. Please try again.";

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <main
        style={{ marginTop: "120px" }}
        className="min-h-screen px pt-[120px] flex items-center justify-center"
      >
        <div className="text-white">Loading your cart...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main
        style={{ marginTop: "120px" }}
        className="min-h-screen px pt-[120px] flex items-center justify-center"
      >
        <div className="text-red-500">{error}</div>
      </main>
    );
  }

  return (
    <main
      style={{ margin: "auto" }}
      className="min-h-screen px pt-[120px] w-screen flex justify-center overflow-x-auto"
    >
      <ShoppingCart
        items={items}
        onRemove={handleRemove}
        onCheckout={handleCheckout}
      />
    </main>
  );
}
