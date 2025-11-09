"use client";
import { useEffect, useState, useCallback } from "react";
import ShoppingCart from "@/components/mutantcart/ShoppingCart";
import { useCart } from "@/components/mutantcart/CartContext";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Page() {
  const {
    setCartItems,
    setCartCount,
    isGuest,
    guestCartId,
    guestEmail,
    setGuestEmail,
  } = useCart();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const router = useRouter();

  // Fetch cart items from backend only
  const fetchCartItems = useCallback(async () => {
    console.log("[Cart Page] Fetching cart items from backend...");
    const token = localStorage.getItem("login-accessToken");
    const storedGuestCartId = localStorage.getItem("guest-cart-id");

    // GUEST USER FLOW
    if (!token && storedGuestCartId) {
      try {
        setIsLoading(true);
        console.log("[Cart Page] Fetching guest cart:", storedGuestCartId);
        const cartRes = await axios.get(
          `https://themutantschool-backend.onrender.com/api/guest/cart?cartId=${storedGuestCartId}`
        );
        console.log("[Cart Page] Guest cart response:", cartRes);

        if (cartRes.data?.success && cartRes.data?.cart) {
          const cartItemsData = cartRes.data.cart.missions || [];
          const filteredItems = cartItemsData.filter((entry) => entry?.mission);
          console.log("[Cart Page] Backend guest cart data:", cartItemsData);

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

          setItems(mappedItems);
          setCartItems(mappedItems);
          setCartCount(mappedItems.length);
          setError(null);
        } else {
          console.error(
            "[Cart Page] Invalid guest cart response:",
            cartRes.data
          );
          setError("Failed to load cart items.");
        }
      } catch (error) {
        console.error("[Cart Page] Error fetching guest cart:", error);

        // Clear invalid guest cart and show empty cart (not an error)
        if (error.response?.status === 404) {
          console.log(
            "[Cart Page] Guest cart not found. Clearing cart ID and showing empty cart."
          );
          localStorage.removeItem("guest-cart-id");
          setItems([]);
          setCartItems([]);
          setCartCount(0);
          setError(null); // Don't show error for empty cart
        } else {
          setError("Failed to load cart items.");
        }
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // AUTHENTICATED USER FLOW
    if (!token) {
      console.log("[Cart Page] No token found. Checking for guest cart...");
      const localCartItems = JSON.parse(
        localStorage.getItem("cart-items") || "[]"
      );

      if (localCartItems.length > 0) {
        setItems(localCartItems);
        setCartItems(localCartItems);
        setCartCount(localCartItems.length);
        setIsLoading(false);
        return;
      }

      console.log("[Cart Page] No guest cart found. Showing empty cart.");
      setItems([]);
      setCartItems([]);
      setCartCount(0);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get(
        "https://themutantschool-backend.onrender.com/api/mission-cart",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("[Cart Page] Auth cart response:", response);
      if (response.status === 200 && response.data.cart) {
        const cartItemsData = response.data.cart.missions || [];
        const filteredItems = cartItemsData.filter((entry) => entry?.mission);
        console.log("[Cart Page] Backend cart data:", cartItemsData);

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

        setItems(mappedItems);
        setCartItems(mappedItems); // Update context (backend-only)
        setCartCount(mappedItems.length);
        setError(null);
      } else {
        console.log("[Cart Page] Error fetching authenticated cart:", response);
        setError("Failed to load cart items.");
      }
    } catch (error) {
      console.log("[Cart Page] Error fetching cart:", error);
      setError("Failed to load cart items.");
      // Don't redirect to login on unauthorized errors
      // Just show the error message
    } finally {
      setIsLoading(false);
    }
  }, [setCartCount, setCartItems]);

  useEffect(() => {
    fetchCartItems();

    // Check if we have a stored email
    const storedGuestEmail = localStorage.getItem("guest-email");
    if (storedGuestEmail && storedGuestEmail.includes("@")) {
      setGuestEmail(storedGuestEmail);
      setEmailInput(storedGuestEmail);
    }
  }, [fetchCartItems, setGuestEmail]);

  // Auto-dismiss error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

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
    const storedGuestCartId = localStorage.getItem("guest-cart-id");

    // GUEST USER FLOW
    if (!token && storedGuestCartId) {
      try {
        // Remove from guest cart
        const response = await axios.delete(
          `https://themutantschool-backend.onrender.com/api/guest/cart/${missionId}?cartId=${storedGuestCartId}`
        );
        console.log("[Remove from Cart] Guest API response:", response);

        if (response.data.success) {
          console.log(
            `[Remove from Cart] Successfully removed missionId: ${missionId} from guest cart`
          );

          // Refresh cart from backend to get updated state
          await fetchCartItems();

          // Fire cart changed event for other components
          window.dispatchEvent(new CustomEvent("cart:changed"));
        } else {
          console.error(
            "[Remove from Cart] Guest API Error response:",
            response.data
          );
          setError("Failed to remove item. Please try again.");
        }
      } catch (err) {
        console.log(
          "[Remove from Cart] Guest API Error:",
          err.response?.data || err.message
        );
        setError("Failed to remove item. Please try again.");
      }
      return;
    }

    // AUTHENTICATED USER FLOW
    if (!token) {
      console.log("[Remove from Cart] No token found.");
      return;
    }

    try {
      // Remove from backend first
      const response = await axios.delete(
        `https://themutantschool-backend.onrender.com/api/mission-cart/${missionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("[Remove from Cart] Auth API response:", response);
      if (response.status === 200) {
        const updatedItems = items.filter((item) => item.id !== missionId);
        setItems(updatedItems);

        // Refresh cart from backend to get updated state
        await fetchCartItems();

        // Fire cart changed event for other components
        window.dispatchEvent(new CustomEvent("cart:changed"));
      } else {
        console.log("[Remove from Cart] API Error response:", response.data);
        setError("Failed to remove item. Please try again.");
      }
    } catch (err) {
      console.error(
        "[Remove from Cart] API Error:",
        err.response?.data || err.message
      );
      setError("Failed to remove item. Please try again.");
    }
  };

  const handleGuestEmailSubmit = async (e) => {
    e.preventDefault();

    if (!emailInput || !emailInput.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    // Email is valid, proceed directly to checkout
    const storedGuestCartId = localStorage.getItem("guest-cart-id");
    if (storedGuestCartId) {
      setIsProcessing(true); // Set processing state
      proceedToGuestCheckout(storedGuestCartId, emailInput);
    } else {
      setError("Could not find your cart. Please try adding an item again.");
    }
  };

  // Actual function to proceed with guest checkout
  const proceedToGuestCheckout = async (guestCartId, email) => {
    try {
      console.log(
        "[Guest Checkout] Starting checkout process for guest email:",
        email,
        "with cartId:",
        guestCartId
      );

      console.log(
        "[Guest Checkout] Cart contains items:",
        items.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price,
        }))
      );

      // Prepare request payload
      const requestPayload = {
        email: email,
        cartId: guestCartId,
      };

      console.log(
        "%c[Guest Checkout] Sending request to backend:",
        "color: blue; font-weight: bold"
      );
      console.log(
        "URL:",
        "https://themutantschool-backend.onrender.com/api/guest/checkout"
      );
      console.log("Method:", "POST");
      console.log("Payload:", JSON.stringify(requestPayload, null, 2));

      // Direct checkout initialization with email and cartId
      const checkoutResponse = await axios.post(
        "https://themutantschool-backend.onrender.com/api/guest/checkout",
        requestPayload
      );

      // Log the full response for debugging
      console.log(
        "[Guest Checkout] Full API response from backend:[[[[[[[[[[[[[",
        checkoutResponse
      );
      console.log(
        "[Guest Checkout] Received response from backend:",
        checkoutResponse
      );

      if (checkoutResponse.data.success) {
        // Store guest credentials if provided by the API
        if (checkoutResponse.data.username) {
          console.log("[Guest Checkout] Storing guest credentials:", {
            username: checkoutResponse.data.username,
            email: checkoutResponse.data.email,
            password: checkoutResponse.data.password,
          });

          // Save credentials to sessionStorage for later use
          const guestCredentials = {
            username: checkoutResponse.data.username,
            email: checkoutResponse.data.email,
            password: checkoutResponse.data.password,
          };
          sessionStorage.setItem(
            "guest-credentials",
            JSON.stringify(guestCredentials)
          );

          // Log the stored credentials
          console.log(
            "Stored guest credentials in sessionStorage:",
            guestCredentials
          );

          // Display credentials in console for user to see
          console.log(
            "%c[IMPORTANT] Guest Account Details",
            "color: green; font-weight: bold; font-size: 16px"
          );
          console.log(
            "%cUsername: " + checkoutResponse.data.username,
            "color: blue; font-weight: bold"
          );
          console.log(
            "%cEmail: " + checkoutResponse.data.email,
            "color: blue; font-weight: bold"
          );
          console.log(
            "%cUse these details to access your purchased courses later!",
            "color: red"
          );
        }

        // Check for Stripe redirect URL
        const sessionUrl = checkoutResponse.data.url;
        if (sessionUrl) {
          console.log(
            "[Guest Checkout] Redirecting to payment page:",
            sessionUrl
          );

          // Store session ID if provided
          if (checkoutResponse.data.sessionId) {
            localStorage.setItem(
              "guest-session-id",
              checkoutResponse.data.sessionId
            );
          }

          window.location.href = sessionUrl;
        } else {
          throw new Error("No payment URL received from server.");
        }
      } else {
        throw new Error(
          checkoutResponse.data.message || "Checkout failed with unknown error"
        );
      }
    } catch (err) {
      console.error(
        "%c[Guest Checkout] ❌ Error occurred:",
        "color: red; font-weight: bold; font-size: 14px",
        err
      );

      // Log detailed error information
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error(
          "%c[Guest Checkout] Backend Error Details:",
          "color: orange; font-weight: bold"
        );
        console.error("Status Code:", err.response.status);
        console.error("Status Text:", err.response.statusText);
        console.error(
          "Response Data:",
          JSON.stringify(err.response.data, null, 2)
        );
        console.error("Response Headers:", err.response.headers);

        // Try to extract specific error message from backend
        if (err.response.data?.message) {
          console.error(
            "%cBackend Error Message:",
            "color: red; font-weight: bold",
            err.response.data.message
          );
        }
        if (err.response.data?.error) {
          console.error(
            "%cBackend Error Details:",
            "color: red; font-weight: bold",
            err.response.data.error
          );
        }
      } else if (err.request) {
        // The request was made but no response was received
        console.error("[Guest Checkout] No response received from server:");
        console.error(err.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("[Guest Checkout] Request setup error:", err.message);
      }

      // Provide user-friendly error messages
      let errorMessage = "Failed to proceed with checkout. Please try again.";

      if (err.response?.status === 500) {
        errorMessage =
          "Server error occurred. Please try again in a moment or contact support.";
      } else if (err.response?.status === 400) {
        errorMessage =
          err.response?.data?.message ||
          "Invalid checkout request. Please check your cart.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      setError(errorMessage);
      setIsProcessing(false);
    }
  };

  const handleCheckout = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setError(null);

    // Check if there are items in cart
    if (!Array.isArray(items) || items.length === 0) {
      setError("Your cart is empty.");
      setIsProcessing(false);
      return;
    }

    const token = localStorage.getItem("login-accessToken");
    const storedGuestCartId = localStorage.getItem("guest-cart-id");

    // GUEST USER FLOW
    if (!token && storedGuestCartId) {
      // If we have a stored guest email, proceed directly to checkout
      const storedGuestEmail = localStorage.getItem("guest-email");

      if (storedGuestEmail && storedGuestEmail.includes("@")) {
        proceedToGuestCheckout(storedGuestCartId, storedGuestEmail);
      } else {
        // Email is required but we're now handling this in the UI with disabled button
        setError("Please enter your email before proceeding to checkout");
        setIsProcessing(false);
      }
      return;
    }

    // AUTHENTICATED USER FLOW
    if (!token) {
      // We're showing the guest email field in the cart UI now
      setError("Please enter your email before proceeding to checkout");
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
        {},
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
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const sessionId = paymentResponse.data.sessionId;
      const redirectUrl = paymentResponse.data.url;

      console.log("[Checkout] Payment session created:", {
        fullResponse: paymentResponse.data,
      });

      if (!redirectUrl) {
        throw new Error("No payment URL received from server.");
      }

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

  // Only show error page if there's a critical error (not for empty cart)
  if (error && items.length === 0 && !isLoading) {
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
      style={{ margin: "auto", position: "relative" }}
      className="min-h-screen px pt-[120px] w-screen flex justify-center overflow-x-auto"
    >
      {error && (
        <div className="fixed top-20 right-5 bg-red-500 text-white px-6 py-3 rounded-md shadow-lg z-50 max-w-md">
          {error}
        </div>
      )}
      <ShoppingCart
        items={items}
        onRemove={handleRemove}
        onCheckout={handleCheckout}
        isGuest={
          !localStorage.getItem("login-accessToken") &&
          localStorage.getItem("guest-cart-id")
        }
        guestEmail={guestEmail}
        onGuestEmailChange={setEmailInput}
        onGuestEmailSubmit={handleGuestEmailSubmit}
        emailInputValue={emailInput}
        emailError={error}
        isProcessing={isProcessing}
      />
    </main>
  );
}
