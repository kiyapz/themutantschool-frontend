"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const sid = searchParams.get("session_id") || searchParams.get("sessionId");
    if (sid) {
      const target = `/missions/checkout-success?sessionId=${encodeURIComponent(
        sid
      )}`;
      router.replace(target);
    }
  }, [router, searchParams]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-center">
      <h1 className="text-2xl font-semibold mb-2">Finalizing payment...</h1>
      <p className="text-gray-400">Please wait, redirecting to success.</p>
    </div>
  );
}
