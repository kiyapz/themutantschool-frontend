"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

export default function Page() {
  return (
    <div className="h-screen flex flex-col items-center justify-center -mt-48">
      <h1 className="text-2xl font-semibold mb-2 text-green-400 ">
        Checkout Successful
      </h1>
      <p>Your payment session has been created. Thank you for your purchase.</p>
    </div>
  );
}
