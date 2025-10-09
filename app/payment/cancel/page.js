"use client";
import Link from "next/link";

export default function PaymentCancel() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#131313] p-8 rounded-lg border-2 border-yellow-500 shadow-xl text-center">
        <h1 className="text-3xl font-bold text-yellow-500 mb-4">
          Payment Cancelled
        </h1>
        <p className="text-gray-300 mb-8">
          Your payment was not completed. Your cart has been saved, and you can
          try again at any time.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/cart"
            className="w-full sm:w-auto px-6 py-3 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Return to Cart
          </Link>
          <Link
            href="/missions"
            className="w-full sm:w-auto px-6 py-3 bg-[#844CDC] text-white font-bold rounded hover:bg-[#6a3ab0] transition-colors"
          >
            Explore Missions
          </Link>
        </div>
      </div>
    </div>
  );
}
