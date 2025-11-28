"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to personal information page
    router.push("/affiliate/profile/personal-information");
  }, [router]);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#0A0A0A" }}
    >
      <div className="w-8 h-8 border-2 border-t-transparent border-[#7343B3] rounded-full animate-spin"></div>
    </div>
  );
}
