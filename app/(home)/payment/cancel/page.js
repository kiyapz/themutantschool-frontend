"use client";
import Link from "next/link";

export default function Page() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-center">
      <h1 className="text-2xl font-semibold mb-2 text-red-400">
        Payment canceled
      </h1>
      <p className="text-gray-400 mb-6">
        Your checkout was canceled. You can return to your cart and try again.
      </p>
      <div className="mt-4">
        <Link
          href="/mutantcart"
          className="text-blue-500 hover:text-blue-400 underline"
        >
          Back to cart
        </Link>
      </div>
    </div>
  );
}
