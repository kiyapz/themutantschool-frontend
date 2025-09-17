"use client";
import { useEffect, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [purchasedCourse, setPurchasedCourse] = useState(null);
  const [orderInfo, setOrderInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionId =
          searchParams.get("session_id") || searchParams.get("sessionId");
        console.log("Payment Success - Session ID:", sessionId);

        const token = localStorage.getItem("login-accessToken");
        if (!token) {
          setError("Please log in to view your purchase");
          setLoading(false);
          return;
        }

        // Set default order info
        setOrderInfo({
          amount: 390.25,
          currency: "USD",
          orderId: sessionId || "MTN2203-01",
        });

        // Try to fetch order information if session ID is available
        if (sessionId) {
          try {
            const orderResponse = await axios.get(
              `https://themutantschool-backend.onrender.com/api/payment/session/${sessionId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (
              orderResponse.data?.success &&
              typeof orderResponse.data?.data?.amount === "number"
            ) {
              // Amount from API is in cents, convert to dollars
              const newAmount = (orderResponse.data.data.amount / 100).toFixed(
                2
              );
              setOrderInfo((prevInfo) => ({ ...prevInfo, amount: newAmount }));
            } else if (orderResponse.data && orderResponse.data.order) {
              // Fallback to existing logic if the new structure isn't present
              setOrderInfo(orderResponse.data.order);
            }
          } catch (err) {
            console.log("Could not fetch order details:", err);
          }
        }

        // Try to fetch the latest purchased course from student breakdown
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
              setPurchasedCourse(purchasedCourses[0]);
            }
          } catch (err) {
            console.error("Error fetching purchased course:", err);
          } finally {
            setLoading(false);
          }
        }, 2000);
      } catch (err) {
        console.error("Error in fetchData:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <div
          className="animate-spin rounded-full h-16 w-16 border-b-2 mb-4"
          style={{ borderColor: "var(--success)" }}
        ></div>
        <p style={{ color: "var(--text)" }}>Processing your purchase...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
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
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div
      className="min-h-[180vh] flex flex-col justify-center items-center overflow-auto"
      style={{
        paddingLeft: "1rem",
        paddingRight: "1rem",
      }}
    >
      <div
        className="max-w-2xl w-full"
        style={{ marginLeft: "auto", marginRight: "auto" }}
      >
        {/* Success Header */}
        <div className="text-center" style={{ marginBottom: "1.5rem" }}>
          <div
            className="h-[80px] w-[80px] flex items-center justify-center rounded-full"
            style={{
              backgroundColor: "var(--success)",
              marginBottom: "1rem",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <span className="text-white text-3xl">✓</span>
          </div>

          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--success)", marginBottom: "0.75rem" }}
          >
            Payment Successful!
          </h1>
          <p
            className="text-sm max-w-lg text-center"
            style={{
              color: "var(--text-light-2)",
              marginBottom: "1.5rem",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Thank you for your purchase. Your order has been confirmed
            successfully.
          </p>
        </div>

        {/* Order Summary Card */}
        <div
          className="rounded-xl"
          style={{
            backgroundColor: "var(--card)",
            padding: "1.25rem",
            marginBottom: "1rem",
          }}
        >
          <h2
            className="text-lg font-bold text-white text-center"
            style={{ marginBottom: "1rem" }}
          >
            Order Summary
          </h2>

          {purchasedCourse ? (
            <>
              <div className="flex items-center">
                <img
                  src={
                    purchasedCourse.thumbnail?.url ||
                    "https://files.ably.io/ghost/prod/2023/12/choosing-the-best-javascript-frameworks-for-your-next-project.png"
                  }
                  alt={purchasedCourse.missionTitle}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1" style={{ marginLeft: "1rem" }}>
                  <h3
                    className="text-base font-semibold text-white"
                    style={{ marginBottom: "0.25rem" }}
                  >
                    {purchasedCourse.missionTitle || "JavaScript Fundamentals"}
                  </h3>
                  <p className="text-xs" style={{ color: "var(--text)" }}>
                    The Mutant School
                  </p>
                </div>
              </div>
              <hr
                className="border-t border-gray-700"
                style={{ marginTop: "1rem", marginBottom: "1rem" }}
              />
              <div className="flex justify-between items-center text-sm">
                <p style={{ color: "var(--text-light-2)" }}>Total paid</p>
                <p
                  className="font-semibold"
                  style={{ color: "var(--success)" }}
                >
                  ${orderInfo?.amount || "390.25"}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="text-center">
                <div
                  className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center"
                  style={{
                    marginLeft: "auto",
                    marginRight: "auto",
                    marginBottom: "0.75rem",
                  }}
                >
                  <span className="text-lg">📚</span>
                </div>
                <h3
                  className="text-base font-semibold text-white"
                  style={{ marginBottom: "0.25rem" }}
                >
                  Course Access
                </h3>
                <p
                  className="text-xs"
                  style={{ color: "var(--text)", marginBottom: "0.25rem" }}
                >
                  The Mutant School
                </p>
              </div>
              <hr
                className="border-t border-gray-700"
                style={{ marginTop: "1rem", marginBottom: "1rem" }}
              />
              <div className="flex justify-between items-center text-sm">
                <p style={{ color: "var(--text-light-2)" }}>Total paid</p>
                <p
                  className="font-semibold"
                  style={{ color: "var(--success)" }}
                >
                  ${orderInfo?.amount || "390.25"}
                </p>
              </div>
            </>
          )}
        </div>

        <div className="text-center" style={{ marginBottom: "1.5rem" }}>
          <p
            className="text-xs tracking-widest"
            style={{ color: "var(--text-light-2)" }}
          >
            ORDER ID: {orderInfo?.orderId || "MTN2203-01"}
          </p>
        </div>

        {/* Start Mutation Button */}
        <div className="text-center" style={{ marginBottom: "1.5rem" }}>
          <Link
            href="/dashboard/student/student-dashboard/(missions)"
            className="inline-block rounded-xl transition-colors font-bold text-base"
            style={{
              backgroundColor: "var(--primary)",
              color: "white",
              paddingLeft: "2rem",
              paddingRight: "2rem",
              paddingTop: "0.75rem",
              paddingBottom: "0.75rem",
            }}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = "var(--primary-light)")
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "var(--primary)")
            }
          >
            Start Mutation
          </Link>
        </div>

        {/* Recommended Missions Section */}
        <div style={{ marginBottom: "1rem" }}>
          <div
            className="flex justify-between items-center"
            style={{ marginBottom: "1rem" }}
          >
            <h2 className="text-lg font-bold text-white">
              Recommended Missions
            </h2>
            <Link
              href="/missions"
              className="rounded-lg border-2 transition-colors font-semibold text-sm"
              style={{
                borderColor: "var(--primary)",
                color: "var(--primary)",
                backgroundColor: "transparent",
                paddingLeft: "1rem",
                paddingRight: "1rem",
                paddingTop: "0.25rem",
                paddingBottom: "0.25rem",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "var(--primary)";
                e.target.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.color = "var(--primary)";
              }}
            >
              Explore More
            </Link>
          </div>

          {/* Course Cards */}
          <div
            className="grid grid-cols-1 sm:grid-cols-3"
            style={{ gap: "0.75rem" }}
          >
            {[1, 2, 3].map((index) => (
              <div
                key={index}
                className="rounded-lg"
                style={{
                  backgroundColor: "var(--card)",
                  padding: "0.75rem",
                }}
              >
                <div
                  className="w-full h-20 bg-gray-700 rounded-lg flex items-center justify-center"
                  style={{ marginBottom: "0.75rem" }}
                >
                  <span className="text-lg">🎯</span>
                </div>
                <h3
                  className="text-sm font-semibold text-white"
                  style={{ marginBottom: "0.5rem" }}
                >
                  Design Principles: Beginners Course
                </h3>
                <div className="flex justify-between items-center">
                  <span
                    className="text-sm font-bold"
                    style={{ color: "var(--success)" }}
                  >
                    $50
                  </span>
                  <Link
                    href="/missions"
                    className="rounded-lg text-xs font-semibold transition-colors"
                    style={{
                      backgroundColor: "var(--success)",
                      color: "white",
                      paddingLeft: "0.75rem",
                      paddingRight: "0.75rem",
                      paddingTop: "0.25rem",
                      paddingBottom: "0.25rem",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "var(--success-soft)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "var(--success)")
                    }
                  >
                    Enter Mission
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex flex-col items-center justify-center">
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
