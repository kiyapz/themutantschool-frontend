"use client";
import { useEffect, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [purchasedCourse, setPurchasedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPurchasedCourse = async () => {
      try {
        const sessionId =
          searchParams.get("session_id") || searchParams.get("sessionId");
        console.log("Session ID:", sessionId);

        const token = localStorage.getItem("login-accessToken");
        if (!token) {
          setError("Please log in to view your purchase");
          setLoading(false);
          return;
        }

        // Try to fetch the latest purchased course from student breakdown
        // Add a small delay to allow backend processing
        setTimeout(async () => {
          try {
            const response = await axios.get(
              "https://themutantschool-backend.onrender.com/api/student/breakdown",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            const purchasedCourses = response?.data?.data || [];
            if (purchasedCourses.length > 0) {
              // Get the most recent purchase (first in the array)
              setPurchasedCourse(purchasedCourses[0]);
            } else {
              // No courses found yet, but don't show error - just show generic success
              console.log(
                "No purchased courses found yet, showing generic success"
              );
            }
          } catch (err) {
            console.error("Error fetching purchased course:", err);
            // Don't set error, just show generic success message
            console.log(
              "Failed to fetch course details, showing generic success"
            );
          } finally {
            setLoading(false);
          }
        }, 2000); // 2 second delay to allow backend processing
      } catch (err) {
        console.error("Error in fetchPurchasedCourse:", err);
        setLoading(false);
      }
    };

    fetchPurchasedCourse();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center -mt-48">
        <div
          className="animate-spin rounded-full h-16 w-16 border-b-2 mb-4"
          style={{ borderColor: "var(--success)" }}
        ></div>
        <p style={{ color: "var(--text)" }}>Processing your purchase...</p>
        <p className="text-sm mt-2" style={{ color: "var(--text)" }}>
          This may take a few moments
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center -mt-48">
        <div
          className="h-[130px] w-[130px] flex items-center justify-center rounded-full mb-6"
          style={{ backgroundColor: "var(--error)" }}
        >
          <span className="text-white text-4xl">⚠️</span>
        </div>
        <h1
          className="text-2xl font-semibold mb-2"
          style={{ color: "var(--error)" }}
        >
          Error
        </h1>
        <p className="mb-6" style={{ color: "var(--text)" }}>
          {error}
        </p>
        <Link
          href="/dashboard/student/student-dashboard/(missions)"
          className="px-6 py-2 rounded-lg transition-colors font-semibold"
          style={{
            backgroundColor: "var(--success)",
            color: "white",
          }}
          onMouseEnter={(e) =>
            (e.target.style.backgroundColor = "var(--success-soft)")
          }
          onMouseLeave={(e) =>
            (e.target.style.backgroundColor = "var(--success)")
          }
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center -mt-48">
      <div
        className="h-[130px] w-[130px] flex items-center justify-center rounded-full mb-6"
        style={{ backgroundColor: "var(--success)" }}
      >
        <span className="text-white text-4xl">✓</span>
      </div>

      <h1
        className="text-3xl font-bold mb-2"
        style={{ color: "var(--success)" }}
      >
        Payment Successful!
      </h1>
      <p
        className="mb-8 text-center max-w-md"
        style={{ color: "var(--text-light-2)" }}
      >
        Thank you for your purchase. Your order has been confirmed successfully.
      </p>

      {/* Display purchased course if available */}
      {purchasedCourse ? (
        <div
          className="rounded-lg p-6 mb-8 max-w-md w-full"
          style={{ backgroundColor: "var(--card)" }}
        >
          <h2 className="text-xl font-semibold mb-4 text-white">
            Your New Course
          </h2>
          <div className="flex items-center space-x-4">
            <img
              src={
                purchasedCourse.thumbnail?.url ||
                "https://files.ably.io/ghost/prod/2023/12/choosing-the-best-javascript-frameworks-for-your-next-project.png"
              }
              alt={purchasedCourse.missionTitle}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-1">
                {purchasedCourse.missionTitle || "Web Development Mastery"}
              </h3>
              <p className="text-sm" style={{ color: "var(--text)" }}>
                {purchasedCourse.progress?.length || 0} Capsules • Ready to
                start
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="rounded-lg p-6 mb-8 max-w-md w-full"
          style={{ backgroundColor: "var(--card)" }}
        >
          <h2 className="text-xl font-semibold mb-4 text-white">
            Course Access
          </h2>
          <p className="text-sm" style={{ color: "var(--text)" }}>
            Your course is being processed and will be available in your
            dashboard shortly.
          </p>
        </div>
      )}

      {/* Start Course Button */}
      <Link
        href="/dashboard/student/student-dashboard/(missions)"
        className="px-8 py-3 rounded-lg transition-colors font-semibold text-lg"
        style={{
          backgroundColor: "var(--success)",
          color: "white",
        }}
        onMouseEnter={(e) =>
          (e.target.style.backgroundColor = "var(--success-soft)")
        }
        onMouseLeave={(e) =>
          (e.target.style.backgroundColor = "var(--success)")
        }
      >
        Start Your Course
      </Link>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex flex-col items-center justify-center -mt-48">
          <div
            className="animate-spin rounded-full h-16 w-16 border-b-2 mb-4"
            style={{ borderColor: "var(--success)" }}
          ></div>
          <p style={{ color: "var(--text)" }}>Loading...</p>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
