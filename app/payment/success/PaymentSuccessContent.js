"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function PaymentSuccessContent() {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // Retrieve guest credentials from localStorage
    const guestUser = localStorage.getItem("guest-username");
    const guestPass = localStorage.getItem("guest-password");

    if (guestUser && guestPass) {
      setUsername(guestUser);
      setPassword(guestPass);
    }

    if (sessionId) {
      // You can optionally verify the session with your backend here
      console.log("Payment successful with session ID:", sessionId);

      // Clear guest cart and session data from localStorage
      localStorage.removeItem("guest-cart-id");
      localStorage.removeItem("guest-email");
      localStorage.removeItem("guest-session-id");

      // Dispatch a cart change event to update the navbar icon
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("cart:changed"));
      }
    } else {
      setError(
        "No session ID found. Your payment may not have been processed correctly."
      );
    }

    setIsLoading(false);
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center text-center">
        <div>
          <h1 className="text-3xl font-bold text-red-500 mb-4">
            Payment Error
          </h1>
          <p className="text-gray-400 mb-8">{error}</p>
          <Link
            href="/missions"
            className="px-6 py-2 bg-[#844CDC] text-white rounded hover:bg-[#6a3ab0] transition-colors"
          >
            Explore Missions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-[#131313] p-8 rounded-lg border-2 border-[#844CDC] shadow-xl text-center">
        <h1 className="text-4xl font-bold text-[#844CDC] mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-300 mb-6">
          Welcome to The Mutant School! Your mission access has been granted.
        </p>

        {username && password ? (
          <div className="bg-[#0A0A0A] p-6 rounded border border-gray-700 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              Your Guest Account Credentials
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              Please save these credentials. You will need them to log in and
              access your courses.
            </p>
            <div className="space-y-3 text-left">
              <div className="flex justify-between items-center bg-[#232323] p-3 rounded">
                <span className="text-gray-400">Username:</span>
                <span className="font-mono text-lg">{username}</span>
              </div>
              <div className="flex justify-between items-center bg-[#232323] p-3 rounded">
                <span className="text-gray-400">Password:</span>
                <span className="font-mono text-lg">{password}</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-yellow-400 my-4">
            Could not retrieve guest credentials. Please check your email.
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                `Username: ${username}\nPassword: ${password}`
              );
              alert("Credentials copied to clipboard!");
            }}
            className="w-full sm:w-auto px-6 py-3 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Copy Credentials
          </button>
          <Link
            href="/auth/login"
            className="w-full sm:w-auto px-10 py-3 bg-[#844CDC] text-white font-bold rounded hover:bg-[#6a3ab0] transition-colors"
          >
            Login Now
          </Link>
        </div>
      </div>
    </div>
  );
}
