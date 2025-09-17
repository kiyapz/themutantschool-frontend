"use client";
import { useEffect, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";

function PaymentCancelContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sessionId, setSessionId] = useState(null);
  const [orderInfo, setOrderInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderInfo = async () => {
      try {
        const sid =
          searchParams.get("session_id") || searchParams.get("sessionId");
        console.log("Payment Cancel - Session ID:", sid);
        setSessionId(sid);

        if (sid) {
          const token = localStorage.getItem("login-accessToken");
          if (token) {
            // Try to fetch order information from the session
            try {
              const response = await axios.get(
                `https://themutantschool-backend.onrender.com/api/payment/session/${sid}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                }
              );

              if (response.data && response.data.order) {
                setOrderInfo(response.data.order);
              }
            } catch (err) {
              console.log("Could not fetch order details:", err);
              // Fallback to default values
              setOrderInfo({
                amount: 300.25,
                currency: "USD",
                orderId: sid || "HMT-16006833",
              });
            }
          } else {
            // Fallback to default values if no token
            setOrderInfo({
              amount: 300.25,
              currency: "USD",
              orderId: sid || "HMT-16006833",
            });
          }
        } else {
          // Fallback to default values if no session ID
          setOrderInfo({
            amount: 300.25,
            currency: "USD",
            orderId: "HMT-16006833",
          });
        }
      } catch (err) {
        console.error("Error fetching order info:", err);
        // Fallback to default values
        setOrderInfo({
          amount: 300.25,
          currency: "USD",
          orderId: "HMT-16006833",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrderInfo();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="h-[100vh] xl:h-[120vh] overflow-y-auto flex flex-col items-center justify-center gap-4">
        <div
          className="animate-spin rounded-full h-16 w-16 border-b-2 mb-4"
          style={{ borderColor: "var(--error)" }}
        ></div>
        <p style={{ color: "var(--text)" }}>Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="h-[100vh] xl:h-[120vh] overflow-y-auto flex flex-col items-center justify-center gap-4">
      <div
        className=" sm:h-[130px] sm:w-[130px] h-[100px] w-[100px] flex items-center justify-center rounded-full mb-6"
        style={{ backgroundColor: "#FFB8B8" }}
      >
        <span className="text-[#FF0000] text-4xl">✕</span>
      </div>

      <h1
        className="sm:text-[35px] leading-[32px] font-[700] mb-2"
        style={{ color: "var(--error)" }}
      >
        Payment Failed!
      </h1>
      <p
        className="mb-6 sm:mb-8 text-center font-[500] leading-[20px] sm:leading-[32px] text-[14px] sm:text-[20px] px-4 "
        style={{ color: "var(--text-light-2)", padding: "0px 20px" }}
      >
        Unfortunately, this transaction could not be processed. Please check
        your payment details
      </p>

      {/* Order Information */}
      <div
        className="rounded-lg p-6 mb-8 max-w-[330px] sm:max-w-[488px]  w-full"
        style={{
          backgroundColor: "var(--card)",

          padding: "20px",
        }}
      >
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-[12px] sm:text-[14px] text-white">
              ORDER ID:
            </span>
            <span
              className="text-[10px] sm:text-[12px] break-all text-right max-w-[60%]"
              style={{ color: "var(--text)" }}
            >
              {orderInfo?.orderId || sessionId || "HMT-16006833"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-[12px] sm:text-[14px] text-white">
              AMOUNT:
            </span>
            <span
              className="text-[10px] sm:text-[12px] text-right"
              style={{ color: "var(--text)" }}
            >
              {orderInfo?.currency || "$"}
              {orderInfo?.amount || "300.25"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-[12px] sm:text-[14px] font-[700] text-white">
              DATE:
            </span>
            <span
              className="text-[10px] sm:text-[12px] break-words text-right max-w-[60%]"
              style={{ color: "var(--text)" }}
            >
              {new Date()
                .toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
                .toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col max-w-[330px] sm:max-w-[488px] w-full gap-3 sm:gap-4 px-4 sm:px-0">
        <Link
          href="/mutantcart"
          className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-colors font-semibold text-center text-[16px] sm:text-lg"
          style={{
            backgroundColor: "var(--error)",
            color: "white",
            minHeight: "50px",
            height: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseEnter={(e) =>
            (e.target.style.backgroundColor = "var(--error)")
          }
          onMouseLeave={(e) =>
            (e.target.style.backgroundColor = "var(--error)")
          }
        >
          Retry Payment
        </Link>

        <Link
          href="/missions"
          className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-colors text-center font-semibold text-[16px] sm:text-lg border-2"
          style={{
            borderColor: "var(--primary)",
            color: "var(--primary)",
            backgroundColor: "transparent",
            minHeight: "50px",
            height: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
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
          Browse Missions
        </Link>
      </div>

      {/* Help text */}
      <p
        className="text-[12px] sm:text-sm mt-4 sm:mt-6 text-center max-w-md px-4 sm:px-0"
        style={{ color: "var(--text)", padding: "0px 20px" }}
      >
        Need help? Contact our support team or try a different payment method.
      </p>
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
            style={{ borderColor: "var(--error)" }}
          ></div>
          <p style={{ color: "var(--text)" }}>Loading...</p>
        </div>
      }
    >
      <PaymentCancelContent />
    </Suspense>
  );
}
