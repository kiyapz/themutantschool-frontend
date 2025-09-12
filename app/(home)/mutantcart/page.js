"use client";
import { useEffect, useState } from "react";
import ShoppingCart from "@/components/cart/ShoppingCart";
import { useCart } from "@/components/cart/CartContext";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Page() {
  const { setCartItems } = useCart();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCartAndMissions = async () => {
      console.log("[Cart Page] Starting to fetch cart and mission data...");
      const token = localStorage.getItem("login-accessToken");
      if (!token) {
        console.log("[Cart Page] No token found. Redirecting to login.");
        router.push("/auth/login");
        return;
      }

      try {
        // Fetch cart items
        console.log("[Cart Page] Fetching cart items from API...");
        const cartRes = await axios.get(
          "https://themutantschool-backend.onrender.com/api/mission-cart",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const cartItemsData = cartRes.data.cart.missions || [];
        console.log(cartItemsData, "cartItemsData 000000000000");

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
        setCartItems(mappedItems);
        localStorage.setItem("CART_ITEMS", JSON.stringify(mappedItems));
        setError(null);
        setIsLoading(false);

        // Fetch missions (example endpoint, adjust as needed)
        // console.log("[Cart Page] Fetching missions from API...");
        // const missionsRes = await axios.get(
        //   "https://themutantschool-backend.onrender.com/api/missions",
        //   {
        //     headers: { Authorization: `Bearer ${token}` },
        //   }
        // );
        // const missionsData = missionsRes.data.data || [];
        // console.log("[Cart Page] Received missions data:", missionsData);

        // // ✅ You might want to store both in state
        // setCartItems(cartItemsData);
        // setMissions(missionsData);
      } catch (error) {
        console.error("[Cart Page] Error fetching data:", error);
        setError("Failed to load cart items.");
        setIsLoading(false);
        // Optional: handle unauthorized (token expired)
        // if (error.response?.status === 401) {
        // router.push("/auth/login");
        // }
      }
    };

    fetchCartAndMissions();
  }, [router]);

  const handleRemove = async (missionId) => {
    console.log(
      `%c[Remove from Cart] Button clicked for missionId: ${missionId}`,
      "color: #F87171; font-weight: bold;"
    );
    const token = localStorage.getItem("login-accessToken");
    if (!token) {
      console.log("[Remove from Cart] No token found.");
      return;
    }

    const originalItems = [...items];
    const updatedItems = items.filter((item) => item.id !== missionId);
    setItems(updatedItems);
    setCartItems(updatedItems);
    localStorage.setItem("CART_ITEMS", JSON.stringify(updatedItems));

    try {
      console.log(
        `[Remove from Cart] Sending DELETE request for missionId: ${missionId}`
      );
      await axios.delete(
        `https://themutantschool-backend.onrender.com/api/mission-cart/${missionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(
        `[Remove from Cart] Successfully removed missionId: ${missionId}. Firing cart:changed event.`
      );
      window.dispatchEvent(new CustomEvent("cart:changed"));
    } catch (err) {
      console.error(
        "[Remove from Cart] API Error:",
        err.response?.data || err.message
      );
      setError("Failed to remove item.");
      setItems(originalItems);
      localStorage.setItem("CART_ITEMS", JSON.stringify(originalItems));
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

    const firstItem = items[0];
    const missionId = firstItem.id;

    try {
      const orderResponse = await axios.post(
        "https://themutantschool-backend.onrender.com/api/mission-orders",
        { missionId, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const orderId = orderResponse.data.order?._id;
      console.log("[Proceed] Created orderId:", orderId);
      if (!orderId) throw new Error("Failed to create order.");

      const paymentResponse = await axios.post(
        `https://themutantschool-backend.onrender.com/api/payment/create-session/order/${orderId}`,
        { currency: "NGN" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const sessionId = paymentResponse.data.sessionId;
      const redirectUrl =
        paymentResponse.data.url || paymentResponse.data.redirectUrl;
      console.log("[Proceed] Payment session created:", {
        sessionId,
        redirectUrl,
        data: paymentResponse.data,
      });
      if (!sessionId) {
        throw new Error("Failed to create payment session.");
      }
      if (redirectUrl) {
        window.location.href = redirectUrl;
        return;
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Payment failed. Please try again."
      );
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
    <main style={{ marginTop: "120px" }} className="min-h-screen px pt-[120px]">
      <ShoppingCart
        items={items}
        onRemove={handleRemove}
        onCheckout={handleCheckout}
      />
    </main>
  );
}
