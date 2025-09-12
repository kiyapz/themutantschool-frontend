"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId =
    searchParams.get("sessionId") || searchParams.get("session_id");

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-center">
      <h1 className="text-2xl font-semibold mb-2 text-green-400">
        Checkout Successful!
      </h1>
      <p className="text-gray-400 mb-6">
        Your payment session has been created. Thank you for your purchase.
      </p>
      {sessionId && (
        <div className="text-sm text-gray-500 bg-[#0F0F10] rounded p-2 inline-block">
          Session ID: {sessionId}
        </div>
      )}
      <div className="mt-8">
        <Link
          href="/student/student-dashboard"
          className="text-blue-500 hover:text-blue-400 underline"
        >
          Go to your dashboard
        </Link>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
