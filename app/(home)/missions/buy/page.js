"use client";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

function BuyPageContent() {
  const searchParams = useSearchParams();
  const missionId = searchParams.get("missionId");
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!missionId) {
      setLoading(false);
      setError("No mission ID provided.");
      return;
    }

    const fetchMission = async () => {
      try {
        const response = await axios.get(
          "https://themutantschool-backend.onrender.com/api/mission"
        );
        const allMissions = response.data.data || [];
        const currentMission = allMissions.find((m) => m._id === missionId);

        if (currentMission) {
          setMission(currentMission);
        } else {
          setError("Mission not found.");
        }
      } catch (err) {
        setError("Failed to fetch mission data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMission();
  }, [missionId]);

  const handleCheckout = async () => {
    console.log("Starting checkout process...");
    setIsProcessing(true);
    setError(null); // Clear previous errors

    const token = localStorage.getItem("login-accessToken");
    console.log("Retrieved auth token:", token ? "Found" : "Not Found");

    if (!token) {
      setError(
        "You must be logged in to purchase a mission. Redirecting to login..."
      );
      setIsProcessing(false);
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 2000);
      return;
    }

    if (!mission || !mission._id) {
      setError("Mission data is not available. Cannot proceed.");
      setIsProcessing(false);
      return;
    }

    console.log("Proceeding with mission ID:", mission._id);

    try {
      // 1. Create an order
      console.log("Step 1: Creating order...");
      const orderPayload = { missionId: mission._id, quantity: 1 };
      console.log("Order payload:", orderPayload);

      const orderResponse = await axios.post(
        "https://themutantschool-backend.onrender.com/api/mission-orders",
        orderPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Order creation response:", orderResponse.data);
      const orderId = orderResponse.data.data?._id;

      if (!orderId) {
        throw new Error("Order ID not found in API response.");
      }
      console.log("Order created successfully with ID:", orderId);

      // 2. Create a payment session
      console.log("Step 2: Creating payment session for order ID:", orderId);
      const paymentResponse = await axios.post(
        `https://themutantschool-backend.onrender.com/api/payment/create-session/order/${orderId}`,
        { currency: "NGN" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Payment session response:", paymentResponse.data);
      const sessionId = paymentResponse.data.sessionId;

      if (sessionId) {
        console.log("Payment session created successfully with ID:", sessionId);
        window.location.href = `/missions/checkout-success?sessionId=${sessionId}`;
      } else {
        throw new Error("Session ID not found in API response.");
      }
    } catch (err) {
      console.error("💥 Checkout error:", err.response || err);
      const apiErrorMessage = err.response?.data?.message;
      setError(
        apiErrorMessage || "An unexpected error occurred during checkout."
      );
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-400">Loading mission...</div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-400">{error}</div>;
  }

  if (!mission) {
    return (
      <div className="text-center py-8 text-gray-400">
        Mission details not available.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-2">Buy a Mission</h1>
      <p className="text-gray-400 mb-6">
        Review your mission and proceed to purchase.
      </p>

      <div className="rounded-lg border border-gray-800 bg-[var(--panel-bg-dark)] p-4 mb-6">
        <img
          src={mission.thumbnail?.url || "/images/placeholder.png"}
          alt={mission.title}
          className="h-48 w-full object-cover bg-[var(--panel-bg-darker)] rounded mb-3"
        />
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white font-medium">{mission.title}</div>
            <div className="text-sm text-gray-400">
              {mission.capsules?.length || 0} Capsules • 1 Quiz •{" "}
              {mission.xp || 0} XP
            </div>
          </div>
          <div className="text-right">
            <div className="text-white font-semibold">
              ${mission.isFree ? "0.00" : mission.price}
            </div>
            <div className="text-xs text-gray-500">Price</div>
          </div>
        </div>
      </div>

      <button
        onClick={handleCheckout}
        disabled={isProcessing}
        className="w-full rounded bg-blue-600 text-white py-2.5 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed"
      >
        {isProcessing ? "Processing..." : "Proceed to checkout"}
      </button>

      <div className="mt-4 text-center">
        <Link
          href="/missions"
          className="text-blue-500 hover:text-blue-400 underline"
        >
          Back to missions
        </Link>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-8 text-gray-400">Loading...</div>
      }
    >
      <BuyPageContent />
    </Suspense>
  );
}
