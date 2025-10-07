"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function StudentDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the student missions page
    router.push("/student/student-dashboard/student-mission");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-full">
      <LoadingSpinner size="large" color="mutant" />
    </div>
  );
}
