"use client";
import { useState, useEffect, useRef } from "react";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineLoading3Quarters,
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlineDown,
} from "react-icons/ai";
import { BASE_URL } from "@/lib/api";
import api from "@/lib/api";

export default function Page() {
  const [activeTab, setActiveTab] = useState("overview");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Refund request states
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [refundLoading, setRefundLoading] = useState(false);
  const [refundError, setRefundError] = useState("");
  const [refundSuccess, setRefundSuccess] = useState("");
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [manualSessionId, setManualSessionId] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const clearPasswordFields = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmNewPassword(false);
  };

  const resetForm = () => {
    clearPasswordFields();
    setError("");
    setSuccess("");
    setRefundError("");
    setRefundSuccess("");
    setSelectedCourse("");
    setRefundReason("");
    setManualSessionId("");
    setShowManualInput(false);
  };

  // Fetch enrolled courses for refund dropdown
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (activeTab !== "request-refund") return;

      setLoadingCourses(true);
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("login-accessToken")
            : null;

        if (!token) {
          setRefundError("You must be logged in to request a refund.");
          setLoadingCourses(false);
          return;
        }

        const response = await api.get("/student/dashboard");
        
        console.log("=== FETCHING ENROLLED COURSES ===");
        console.log("Full API Response:", JSON.stringify(response, null, 2));
        console.log("Response Status:", response.status);
        console.log("Response Data:", response.data);
        console.log("Response Data.data:", response.data?.data);
        
        const enrolledCoursesData =
          response?.data?.data?.enrolledCourses || [];

        console.log("Enrolled courses data (array):", enrolledCoursesData);
        console.log("Number of enrolled courses:", enrolledCoursesData.length);
        
        if (enrolledCoursesData.length > 0) {
          console.log("First course full structure:", JSON.stringify(enrolledCoursesData[0], null, 2));
        }

        // Format courses for dropdown
        const formattedCourses = enrolledCoursesData
          .filter((course) => course?.mission?._id && course?.mission?.title)
          .map((course) => {
            // Try multiple paths to find sessionId
            // paymentInfo.referenceId is the Stripe Checkout Session ID
            const sessionId = 
              course.paymentInfo?.referenceId ||  // This is the Stripe session ID!
              course.order?.sessionId || 
              course.order?.paymentSessionId || 
              course.order?.payment?.sessionId ||
              course.paymentInfo?.sessionId ||
              course.payment?.sessionId ||
              course.sessionId ||
              course.paymentSessionId;

            const orderId = course.order?._id || course.orderId || course.order;

            console.log("Course data:", {
              title: course.mission?.title,
              orderId,
              sessionId,
              order: course.order,
              paymentInfo: course.paymentInfo,
            });

            return {
              id: course.mission._id,
              title: course.mission.title,
              enrolledCourseId: course._id,
              orderId: orderId,
              sessionId: sessionId,
              fullCourseData: course, // Store full data for debugging
            };
          });

        console.log("Formatted courses:", formattedCourses);
        setEnrolledCourses(formattedCourses);
      } catch (err) {
        console.error("Error fetching enrolled courses:", err);
        setRefundError(
          "Failed to load your courses. Please refresh the page and try again."
        );
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchEnrolledCourses();
  }, [activeTab]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleRefundRequest = async (e) => {
    e.preventDefault();
    
    console.log("=== REFUND REQUEST CLICKED ===");
    console.log("Selected Course ID:", selectedCourse);
    console.log("Refund Reason:", refundReason);
    console.log("Manual SessionId:", manualSessionId);
    console.log("Show Manual Input:", showManualInput);
    console.log("All Enrolled Courses:", enrolledCourses);
    
    setRefundError("");
    setRefundSuccess("");

    if (!selectedCourse) {
      console.log("❌ No course selected");
      setRefundError("Please select a course to request a refund for.");
      return;
    }

    if (!refundReason || refundReason.trim().length < 10) {
      console.log("❌ Invalid refund reason");
      setRefundError(
        "Please provide a reason for the refund (at least 10 characters)."
      );
      return;
    }

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("login-accessToken")
        : null;

    if (!token) {
      console.log("❌ No authentication token");
      setRefundError("You must be logged in to request a refund.");
      return;
    }

    console.log("✅ Validation passed, starting refund request...");
    setRefundLoading(true);

    try {
      const selectedCourseData = enrolledCourses.find(
        (course) => course.id === selectedCourse
      );

      if (!selectedCourseData) {
        setRefundError("Selected course data not found. Please try again.");
        setRefundLoading(false);
        return;
      }

      // Get sessionId - first try manual input, then from data
      let sessionId = manualSessionId.trim() || selectedCourseData.sessionId;
      
      console.log("Selected course data:", selectedCourseData);
      console.log("Manual sessionId:", manualSessionId);
      console.log("Initial sessionId from data:", selectedCourseData.sessionId);

      // If sessionId is not available, try to fetch it from order details
      if (!sessionId && selectedCourseData.orderId) {
        try {
          console.log("Fetching order details for orderId:", selectedCourseData.orderId);
          // Try to fetch order details to get sessionId
          const orderResponse = await api.get(
            `/mission-orders/${selectedCourseData.orderId}`
          );

          console.log("Order response:", orderResponse.data);

          if (orderResponse.data) {
            const orderData = orderResponse.data;
            sessionId = 
              orderData?.data?.sessionId || 
              orderData?.data?.paymentSessionId || 
              orderData?.data?.payment?.sessionId ||
              orderData?.data?.stripeSessionId ||
              orderData?.sessionId ||
              orderData?.paymentSessionId ||
              orderData?.payment?.sessionId ||
              orderData?.stripeSessionId;
            
            console.log("SessionId from order:", sessionId);
          }
        } catch (orderErr) {
          console.error("Error fetching order details:", orderErr);
          console.error("Order error response:", orderErr.response?.data);
          // Continue to try other methods
        }
      }

      // If still no sessionId, try to get it from the full course data
      if (!sessionId && selectedCourseData.fullCourseData) {
        const fullData = selectedCourseData.fullCourseData;
        sessionId = 
          fullData.paymentInfo?.referenceId ||  // This is the Stripe session ID!
          fullData.order?.sessionId ||
          fullData.order?.paymentSessionId ||
          fullData.order?.payment?.sessionId ||
          fullData.order?.stripeSessionId ||
          fullData.paymentInfo?.sessionId ||
          fullData.payment?.sessionId ||
          fullData.sessionId ||
          fullData.paymentSessionId ||
          fullData.stripeSessionId;
        
        console.log("SessionId from full course data:", sessionId);
      }

      // If still no sessionId, try to fetch user's orders and match by orderId
      if (!sessionId && selectedCourseData.orderId) {
        try {
          console.log("Attempting to fetch user orders to find sessionId");
          // Try to get orders for the user
          const ordersResponse = await api.get("/mission-orders");
          const orders = ordersResponse?.data?.data || ordersResponse?.data || [];
          
          console.log("User orders:", orders);
          
          // Find the order that matches our orderId
          const matchingOrder = Array.isArray(orders) 
            ? orders.find(order => 
                order._id === selectedCourseData.orderId || 
                order.id === selectedCourseData.orderId
              )
            : null;
          
          if (matchingOrder) {
            console.log("Found matching order:", matchingOrder);
            sessionId = 
              matchingOrder.sessionId ||
              matchingOrder.paymentSessionId ||
              matchingOrder.payment?.sessionId ||
              matchingOrder.stripeSessionId;
            console.log("SessionId from matching order:", sessionId);
          }
        } catch (ordersErr) {
          console.error("Error fetching user orders:", ordersErr);
        }
      }

      if (!sessionId) {
        console.error("No sessionId found. Course data:", selectedCourseData);
        setRefundError(
          "Unable to retrieve payment session information automatically. Please enter your payment session ID manually or contact support for assistance."
        );
        setShowManualInput(true);
        setRefundLoading(false);
        return;
      }

      console.log("✅ Using sessionId for refund:", sessionId);

      // Verify the payment session exists before submitting refund
      try {
        console.log("=== VERIFYING PAYMENT SESSION ===");
        console.log("Verifying sessionId:", sessionId);
        const sessionResponse = await api.get(`/payment/session/${sessionId}`);
        console.log("✅ Payment session verified successfully");
        console.log("Payment session response:", JSON.stringify(sessionResponse.data, null, 2));
        // Session exists and is valid, proceed with refund
      } catch (sessionErr) {
        console.error("❌ Error verifying payment session:", sessionErr);
        console.error("Session error response:", sessionErr.response?.data);
        console.error("Session error status:", sessionErr.response?.status);
        // If session doesn't exist or is invalid, show error
        if (sessionErr.response?.status === 404) {
          setRefundError(
            "Payment session not found. Please contact support for assistance."
          );
          setRefundLoading(false);
          return;
        }
        // For other errors, continue with refund request (backend will handle validation)
        console.log("⚠️ Continuing with refund despite session verification error");
      }

      console.log("=== SUBMITTING REFUND REQUEST ===");
      const refundPayload = {
        sessionId: sessionId,
        reason: refundReason.trim(),
      };
      console.log("Refund request payload:", JSON.stringify(refundPayload, null, 2));
      
      const response = await api.post("/payment/refund", refundPayload);
      
      console.log("✅ Refund request submitted successfully");
      console.log("Refund response status:", response.status);
      console.log("Refund response data:", JSON.stringify(response.data, null, 2));

      setRefundSuccess(
        response?.data?.message ||
          "Refund request submitted successfully. We'll review your request and get back to you soon."
      );
      setSelectedCourse("");
      setRefundReason("");
      setManualSessionId("");
      setShowManualInput(false);
    } catch (err) {
      console.error("=== REFUND REQUEST ERROR ===");
      console.error("Error object:", err);
      console.error("Error message:", err.message);
      console.error("Error response:", err.response);
      console.error("Error response data:", err.response?.data);
      console.error("Error response status:", err.response?.status);
      console.error("Error response headers:", err.response?.headers);
      
      if (err.response) {
        // Server responded with error status
        if (err.response.status === 401) {
          setRefundError(
            err.response?.data?.message || "Your session has expired. Please log in again."
          );
        } else {
          setRefundError(
            err.response?.data?.message ||
              "Failed to submit refund request. Please try again."
          );
        }
      } else if (err.request) {
        // Request was made but no response received
        setRefundError(
          "Network error. Please check your connection and try again."
        );
      } else {
        // Error setting up the request
        setRefundError(
          "An error occurred. Please try again."
        );
      }
    } finally {
      setRefundLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("login-accessToken")
        : null;

    if (!token) {
      setError("You must be logged in to change your password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmNewPassword,
        }),
      });

      let data = {};
      try {
        data = await response.json();
      } catch (_err) {
        data = {};
      }

      if (!response.ok) {
        if (response.status === 401) {
          setError(
            data.message || "Your session has expired. Please log in again."
          );
          return;
        }

        setError(
          data.message || "Failed to change password. Please try again."
        );
        return;
      }

      setSuccess(data.message || "Password changed successfully.");
      clearPasswordFields();
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectedCourseTitle = enrolledCourses.find(
    (course) => course.id === selectedCourse
  )?.title || "-- Select a course --";

  return (
    <div className="p-3 xs:p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 h-full w-full bg-[var(--foreground)] overflow-x-hidden scrollbar-hide">
      <div className="mb-4 xs:mb-5 sm:mb-6 md:mb-7 lg:mb-8">
        <h1 className="text-xl xs:text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-1 xs:mb-2">
          Security Settings
        </h1>
        <p className="text-[var(--text)] text-xs xs:text-sm sm:text-sm md:text-base lg:text-lg">
          Manage your account security and password
        </p>
      </div>

      <div className="flex gap-1 xs:gap-2 sm:gap-2 md:gap-3 lg:gap-4 mb-4 xs:mb-5 sm:mb-6 md:mb-7 lg:mb-8 flex-wrap overflow-x-auto pb-2 -mx-3 xs:-mx-4 sm:-mx-5 md:-mx-6 lg:-mx-8 xl:-mx-10 px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 scrollbar-hide">
        <button
          onClick={() => {
            setActiveTab("overview");
            resetForm();
          }}
          className={`px-3 xs:px-4 sm:px-5 md:px-6 lg:px-7 xl:px-8 py-2 xs:py-2.5 sm:py-2.5 md:py-3 lg:py-3.5 xl:py-4 text-xs xs:text-sm sm:text-sm md:text-base lg:text-lg font-semibold transition-all duration-300 border-b-2 whitespace-nowrap min-w-fit ${
            activeTab === "overview"
              ? "border-[var(--mutant-color)] text-[var(--mutant-color)]"
              : "border-transparent text-[var(--text)] hover:text-[var(--text-light-2)]"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => {
            setActiveTab("change-password");
            resetForm();
          }}
          className={`px-3 xs:px-4 sm:px-5 md:px-6 lg:px-7 xl:px-8 py-2 xs:py-2.5 sm:py-2.5 md:py-3 lg:py-3.5 xl:py-4 text-xs xs:text-sm sm:text-sm md:text-base lg:text-lg font-semibold transition-all duration-300 border-b-2 whitespace-nowrap min-w-fit ${
            activeTab === "change-password"
              ? "border-[var(--mutant-color)] text-[var(--mutant-color)]"
              : "border-transparent text-[var(--text)] hover:text-[var(--text-light-2)]"
          }`}
        >
          Change Password
        </button>
        <button
          onClick={() => {
            setActiveTab("request-refund");
            resetForm();
          }}
          className={`px-3 xs:px-4 sm:px-5 md:px-6 lg:px-7 xl:px-8 py-2 xs:py-2.5 sm:py-2.5 md:py-3 lg:py-3.5 xl:py-4 text-xs xs:text-sm sm:text-sm md:text-base lg:text-lg font-semibold transition-all duration-300 border-b-2 whitespace-nowrap min-w-fit ${
            activeTab === "request-refund"
              ? "border-[var(--mutant-color)] text-[var(--mutant-color)]"
              : "border-transparent text-[var(--text)] hover:text-[var(--text-light-2)]"
          }`}
        >
          Request Refund
        </button>
      </div>

      <div className="w-full max-w-full xs:max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto">
        {activeTab === "overview" && (
          <div className="space-y-4 xs:space-y-5 sm:space-y-6 md:space-y-7 lg:space-y-8">
            <div className="w-full bg-[var(--card)] rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 transition-all duration-300">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 xs:gap-4 sm:gap-4 md:gap-5 lg:gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-2 md:gap-3 mb-1.5 xs:mb-2 sm:mb-2 md:mb-3">
                    <span className="text-xl xs:text-2xl sm:text-2xl md:text-3xl lg:text-4xl flex-shrink-0">🔐</span>
                    <h2 className="text-base xs:text-lg sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-semibold text-white break-words">
                      Change Password
                    </h2>
                  </div>
                  <p className="text-[var(--text)] text-xs xs:text-sm sm:text-sm md:text-base lg:text-lg break-words">
                    Update your password regularly to keep your lab secure and
                    protect your research notes.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setActiveTab("change-password");
                    resetForm();
                  }}
                  className="w-full sm:w-auto px-4 xs:px-5 sm:px-6 md:px-7 lg:px-8 py-2.5 xs:py-3 sm:py-3 md:py-3.5 lg:py-4 btn text-white rounded-lg xs:rounded-[10px] font-semibold text-xs xs:text-sm sm:text-sm md:text-base lg:text-lg mt-3 sm:mt-0 flex-shrink-0"
                >
                  Change Password
                </button>
              </div>
            </div>

            <div className="w-full bg-[var(--card)] rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 transition-all duration-300">
              <div className="flex items-start gap-2 xs:gap-2.5 sm:gap-3 md:gap-3 lg:gap-4">
                <span className="text-xl xs:text-2xl sm:text-2xl md:text-3xl lg:text-4xl flex-shrink-0">🔒</span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base xs:text-lg sm:text-lg md:text-xl lg:text-xl xl:text-2xl font-semibold text-white mb-1.5 xs:mb-2 sm:mb-2 md:mb-3 break-words">
                    Two-Factor Authentication
                  </h3>
                  <p className="text-[var(--text)] text-xs xs:text-sm sm:text-sm md:text-base lg:text-lg mb-3 xs:mb-3.5 sm:mb-3.5 md:mb-4 break-words">
                    Add an extra layer of security to your account
                  </p>
                  <span className="text-xs xs:text-sm sm:text-sm md:text-base lg:text-lg text-[var(--text-light)] italic">
                    Coming soon...
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full bg-[var(--card)] rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 transition-all duration-300">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 xs:gap-4 sm:gap-4 md:gap-5 lg:gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-2 md:gap-3 mb-1.5 xs:mb-2 sm:mb-2 md:mb-3">
                    <span className="text-xl xs:text-2xl sm:text-2xl md:text-3xl lg:text-4xl flex-shrink-0">💰</span>
                    <h2 className="text-base xs:text-lg sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-semibold text-white break-words">
                      Request Refund
                    </h2>
                  </div>
                  <p className="text-[var(--text)] text-xs xs:text-sm sm:text-sm md:text-base lg:text-lg break-words">
                    Request a refund for a purchased course if you're not
                    satisfied with your purchase.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setActiveTab("request-refund");
                    resetForm();
                  }}
                  className="w-full sm:w-auto px-4 xs:px-5 sm:px-6 md:px-7 lg:px-8 py-2.5 xs:py-3 sm:py-3 md:py-3.5 lg:py-4 btn text-white rounded-lg xs:rounded-[10px] font-semibold text-xs xs:text-sm sm:text-sm md:text-base lg:text-lg mt-3 sm:mt-0 flex-shrink-0"
                >
                  Request Refund
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "change-password" && (
          <div className="w-full bg-[var(--card)] rounded-lg xs:rounded-xl p-4 xs:p-5 sm:p-6 md:p-7 lg:p-9 xl:p-12">
            <div className="mb-4 xs:mb-5 sm:mb-6 md:mb-7 lg:mb-8">
              <h2 className="text-lg xs:text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-1.5 xs:mb-2 sm:mb-2 md:mb-3 break-words">
                Change Your Password
              </h2>
              <p className="text-xs xs:text-sm sm:text-sm md:text-base lg:text-lg text-[var(--text)] break-words">
                Enter your current password and choose a new, secure password.
              </p>
            </div>

            {success && (
              <div className="mb-4 xs:mb-5 sm:mb-6 md:mb-7 lg:mb-8 p-3 xs:p-3.5 sm:p-4 md:p-4.5 lg:p-5 bg-[var(--success)]/20 rounded-lg xs:rounded-[10px] flex items-start gap-2 xs:gap-2.5 sm:gap-3 md:gap-3.5 lg:gap-4 animate-in fade-in duration-300">
                <AiOutlineCheckCircle className="text-[var(--success)] text-lg xs:text-xl sm:text-xl md:text-xl lg:text-2xl flex-shrink-0 mt-0.5" />
                <p className="text-[var(--success)] text-xs xs:text-sm sm:text-sm md:text-base lg:text-lg break-words">{success}</p>
              </div>
            )}

            {error && (
              <div className="mb-4 xs:mb-5 sm:mb-6 md:mb-7 lg:mb-8 p-3 xs:p-3.5 sm:p-4 md:p-4.5 lg:p-5 bg-[var(--error)]/20 rounded-lg xs:rounded-[10px] flex items-start gap-2 xs:gap-2.5 sm:gap-3 md:gap-3.5 lg:gap-4 animate-in fade-in duration-300">
                <AiOutlineCloseCircle className="text-[var(--error)] text-lg xs:text-xl sm:text-xl md:text-xl lg:text-2xl flex-shrink-0 mt-0.5" />
                <p className="text-[var(--error)] text-xs xs:text-sm sm:text-sm md:text-base lg:text-lg break-words">{error}</p>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4 xs:space-y-5 sm:space-y-6 md:space-y-7 lg:space-y-8">
              <div>
                <label className="block text-xs xs:text-sm sm:text-sm md:text-base lg:text-lg font-semibold text-white mb-1.5 xs:mb-2 sm:mb-2 md:mb-3">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your current password"
                    required
                    className="w-full px-3 xs:px-4 sm:px-4 md:px-5 lg:px-6 py-2.5 xs:py-3 sm:py-3 md:py-3.5 lg:py-4 xl:py-5 text-sm sm:text-sm md:text-base lg:text-lg bg-[var(--accent)] rounded-lg xs:rounded-[10px] text-white placeholder-[var(--text-light)] focus:outline-none transition-all pr-10 xs:pr-11 sm:pr-12 md:pr-13 lg:pr-14"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 xs:right-4 sm:right-4 md:right-5 lg:right-6 top-1/2 -translate-y-1/2 text-[var(--text)] hover:text-white transition-colors p-1"
                  >
                    {showCurrentPassword ? (
                      <AiOutlineEyeInvisible className="text-lg xs:text-xl sm:text-xl md:text-xl lg:text-2xl" />
                    ) : (
                      <AiOutlineEye className="text-lg xs:text-xl sm:text-xl md:text-xl lg:text-2xl" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs xs:text-sm sm:text-sm md:text-base lg:text-lg font-semibold text-white mb-1.5 xs:mb-2 sm:mb-2 md:mb-3">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter a new password"
                    required
                    className="w-full px-3 xs:px-4 sm:px-4 md:px-5 lg:px-6 py-2.5 xs:py-3 sm:py-3 md:py-3.5 lg:py-4 xl:py-5 text-sm sm:text-sm md:text-base lg:text-lg bg-[var(--accent)] rounded-lg xs:rounded-[10px] text-white placeholder-[var(--text-light)] focus:outline-none transition-all pr-10 xs:pr-11 sm:pr-12 md:pr-13 lg:pr-14"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 xs:right-4 sm:right-4 md:right-5 lg:right-6 top-1/2 -translate-y-1/2 text-[var(--text)] hover:text-white transition-colors p-1"
                  >
                    {showNewPassword ? (
                      <AiOutlineEyeInvisible className="text-lg xs:text-xl sm:text-xl md:text-xl lg:text-2xl" />
                    ) : (
                      <AiOutlineEye className="text-lg xs:text-xl sm:text-xl md:text-xl lg:text-2xl" />
                    )}
                  </button>
                </div>
                <p className="text-xs xs:text-xs sm:text-xs md:text-sm lg:text-base text-[var(--text-light)] mt-1 xs:mt-1.5 sm:mt-1.5 md:mt-2 break-words">
                  Use at least 8 characters with a mix of letters, numbers, and
                  symbols.
                </p>
              </div>

              <div>
                <label className="block text-xs xs:text-sm sm:text-sm md:text-base lg:text-lg font-semibold text-white mb-1.5 xs:mb-2 sm:mb-2 md:mb-3">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmNewPassword ? "text" : "password"}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Re-enter your new password"
                    required
                    className="w-full px-3 xs:px-4 sm:px-4 md:px-5 lg:px-6 py-2.5 xs:py-3 sm:py-3 md:py-3.5 lg:py-4 xl:py-5 text-sm sm:text-sm md:text-base lg:text-lg bg-[var(--accent)] rounded-lg xs:rounded-[10px] text-white placeholder-[var(--text-light)] focus:outline-none transition-all pr-10 xs:pr-11 sm:pr-12 md:pr-13 lg:pr-14"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmNewPassword(!showConfirmNewPassword)
                    }
                    className="absolute right-3 xs:right-4 sm:right-4 md:right-5 lg:right-6 top-1/2 -translate-y-1/2 text-[var(--text)] hover:text-white transition-colors p-1"
                  >
                    {showConfirmNewPassword ? (
                      <AiOutlineEyeInvisible className="text-lg xs:text-xl sm:text-xl md:text-xl lg:text-2xl" />
                    ) : (
                      <AiOutlineEye className="text-lg xs:text-xl sm:text-xl md:text-xl lg:text-2xl" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={
                  loading ||
                  !currentPassword ||
                  !newPassword ||
                  !confirmNewPassword
                }
                className="w-full px-4 xs:px-5 sm:px-6 md:px-7 lg:px-8 py-2.5 xs:py-3 sm:py-3 md:py-3.5 lg:py-4 btn text-white rounded-lg xs:rounded-[10px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs xs:text-sm sm:text-sm md:text-base lg:text-lg"
              >
                {loading ? (
                  <>
                    <AiOutlineLoading3Quarters className="animate-spin text-xl" />
                    Updating password...
                  </>
                ) : (
                  <>Change Password</>
                )}
              </button>
            </form>
          </div>
        )}

        {activeTab === "request-refund" && (
          <div className="w-full bg-[var(--card)] rounded-lg xs:rounded-xl p-4 xs:p-5 sm:p-6 md:p-7 lg:p-9 xl:p-12">
            <div className="mb-4 xs:mb-5 sm:mb-6 md:mb-7 lg:mb-8">
              <h2 className="text-lg xs:text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-1.5 xs:mb-2 sm:mb-2 md:mb-3 break-words">
                Request a Refund
              </h2>
              <p className="text-xs xs:text-sm sm:text-sm md:text-base lg:text-lg text-[var(--text)] break-words">
                Select a course and provide a reason for your refund request.
                Our team will review your request and get back to you.
              </p>
            </div>

            {refundSuccess && (
              <div className="mb-4 xs:mb-5 sm:mb-6 md:mb-7 lg:mb-8 p-3 xs:p-3.5 sm:p-4 md:p-4.5 lg:p-5 bg-[var(--success)]/20 rounded-lg xs:rounded-[10px] flex items-start gap-2 xs:gap-2.5 sm:gap-3 md:gap-3.5 lg:gap-4 animate-in fade-in duration-300">
                <AiOutlineCheckCircle className="text-[var(--success)] text-lg xs:text-xl sm:text-xl md:text-xl lg:text-2xl flex-shrink-0 mt-0.5" />
                <p className="text-[var(--success)] text-xs xs:text-sm sm:text-sm md:text-base lg:text-lg break-words">{refundSuccess}</p>
              </div>
            )}

            {refundError && (
              <div className="mb-4 xs:mb-5 sm:mb-6 md:mb-7 lg:mb-8 p-3 xs:p-3.5 sm:p-4 md:p-4.5 lg:p-5 bg-[var(--error)]/20 rounded-lg xs:rounded-[10px] flex items-start gap-2 xs:gap-2.5 sm:gap-3 md:gap-3.5 lg:gap-4 animate-in fade-in duration-300">
                <AiOutlineCloseCircle className="text-[var(--error)] text-lg xs:text-xl sm:text-xl md:text-xl lg:text-2xl flex-shrink-0 mt-0.5" />
                <p className="text-[var(--error)] text-xs xs:text-sm sm:text-sm md:text-base lg:text-lg break-words">{refundError}</p>
              </div>
            )}

            <form onSubmit={handleRefundRequest} className="space-y-4 xs:space-y-5 sm:space-y-6 md:space-y-7 lg:space-y-8">
              <div>
                <label className="block text-xs xs:text-sm sm:text-sm md:text-base lg:text-lg font-semibold text-white mb-1.5 xs:mb-2 sm:mb-2 md:mb-3">
                  Select Course
                </label>
                {loadingCourses ? (
                  <div className="w-full px-3 xs:px-4 sm:px-4 md:px-5 lg:px-6 py-2.5 xs:py-3 sm:py-3 md:py-3.5 lg:py-4 xl:py-5 bg-[var(--accent)] rounded-lg xs:rounded-[10px] flex items-center justify-center gap-2">
                    <AiOutlineLoading3Quarters className="animate-spin text-lg xs:text-xl sm:text-xl md:text-xl lg:text-2xl text-[var(--text)]" />
                    <span className="text-xs xs:text-sm sm:text-sm md:text-base lg:text-lg text-[var(--text)]">Loading courses...</span>
                  </div>
                ) : enrolledCourses.length === 0 ? (
                  <div className="w-full px-3 xs:px-4 sm:px-4 md:px-5 lg:px-6 py-2.5 xs:py-3 sm:py-3 md:py-3.5 lg:py-4 xl:py-5 bg-[var(--accent)] rounded-lg xs:rounded-[10px] text-xs xs:text-sm sm:text-sm md:text-base lg:text-lg text-[var(--text-light)] text-center break-words">
                    No enrolled courses found. You need to purchase a course
                    before requesting a refund.
                  </div>
                ) : (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full px-3 xs:px-4 sm:px-4 md:px-5 lg:px-6 py-2.5 xs:py-3 sm:py-3 md:py-3.5 lg:py-4 xl:py-5 text-sm sm:text-sm md:text-base lg:text-lg bg-[var(--accent)] rounded-lg xs:rounded-[10px] text-white focus:outline-none transition-all flex items-center justify-between hover:bg-[var(--accent)]/90"
                    >
                      <span className={selectedCourse ? "text-white" : "text-[var(--text-light)]"}>
                        {selectedCourseTitle}
                      </span>
                      <AiOutlineDown
                        className={`text-[var(--text)] transition-transform duration-200 flex-shrink-0 ml-2 ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute z-50 mt-2 w-full bg-[var(--accent)] rounded-lg xs:rounded-[10px] shadow-xl border border-[var(--card)]/50 max-h-[300px] overflow-y-auto scrollbar-hide">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCourse("");
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 xs:px-4 sm:px-4 md:px-5 lg:px-6 py-2.5 xs:py-3 sm:py-3 md:py-3.5 lg:py-4 text-sm sm:text-sm md:text-base lg:text-lg transition-colors ${
                            !selectedCourse
                              ? "bg-[var(--mutant-color)]/20 text-[var(--mutant-color)]"
                              : "text-[var(--text-light)] hover:bg-[var(--card)] hover:text-white"
                          }`}
                        >
                          -- Select a course --
                        </button>
                        {enrolledCourses.map((course) => (
                          <button
                            key={course.id}
                            type="button"
                            onClick={() => {
                              setSelectedCourse(course.id);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 xs:px-4 sm:px-4 md:px-5 lg:px-6 py-2.5 xs:py-3 sm:py-3 md:py-3.5 lg:py-4 text-sm sm:text-sm md:text-base lg:text-lg transition-colors border-t border-[var(--card)]/30 first:border-t-0 ${
                              selectedCourse === course.id
                                ? "bg-[var(--mutant-color)]/20 text-[var(--mutant-color)]"
                                : "text-[var(--text-light)] hover:bg-[var(--card)] hover:text-white"
                            }`}
                          >
                            {course.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {!showManualInput && enrolledCourses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowManualInput(true)}
                    className="mt-2 text-xs xs:text-sm sm:text-sm text-[var(--mutant-color)] hover:underline break-words"
                  >
                    Can't find payment session? Enter it manually
                  </button>
                )}
              </div>

              {showManualInput && (
                <div>
                  <label className="block text-xs xs:text-sm sm:text-sm md:text-base lg:text-lg font-semibold text-white mb-1.5 xs:mb-2 sm:mb-2 md:mb-3">
                    Payment Session ID (Optional)
                    <span className="text-xs xs:text-xs text-[var(--text-light)] ml-1 xs:ml-2 block xs:inline">
                      If payment session ID is not found automatically
                    </span>
                  </label>
                  <input
                    type="text"
                    value={manualSessionId}
                    onChange={(e) => setManualSessionId(e.target.value)}
                    placeholder="Enter your payment session ID (e.g., cs_test_...)"
                    className="w-full px-3 xs:px-4 sm:px-4 md:px-5 lg:px-6 py-2.5 xs:py-3 sm:py-3 md:py-3.5 lg:py-4 xl:py-5 text-sm sm:text-sm md:text-base lg:text-lg bg-[var(--accent)] rounded-lg xs:rounded-[10px] text-white placeholder-[var(--text-light)] focus:outline-none transition-all"
                  />
                  <p className="text-xs xs:text-xs sm:text-xs md:text-sm lg:text-base text-[var(--text-light)] mt-1 xs:mt-1.5 sm:mt-1.5 md:mt-2 break-words">
                    You can find your payment session ID in your email receipt or payment confirmation.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs xs:text-sm sm:text-sm md:text-base lg:text-lg font-semibold text-white mb-1.5 xs:mb-2 sm:mb-2 md:mb-3">
                  Reason for Refund
                </label>
                <textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="Please explain why you're requesting a refund (minimum 10 characters)..."
                  required
                  rows={5}
                  minLength={10}
                  className="w-full px-3 xs:px-4 sm:px-4 md:px-5 lg:px-6 py-2.5 xs:py-3 sm:py-3 md:py-3.5 lg:py-4 xl:py-5 text-sm sm:text-sm md:text-base lg:text-lg bg-[var(--accent)] rounded-lg xs:rounded-[10px] text-white placeholder-[var(--text-light)] focus:outline-none transition-all resize-none"
                />
                <p className="text-xs xs:text-xs sm:text-xs md:text-sm lg:text-base text-[var(--text-light)] mt-1 xs:mt-1.5 sm:mt-1.5 md:mt-2 break-words">
                  Please provide a detailed reason for your refund request. This
                  helps us improve our services.
                </p>
              </div>

              <button
                type="submit"
                disabled={
                  refundLoading ||
                  !selectedCourse ||
                  !refundReason ||
                  refundReason.trim().length < 10 ||
                  loadingCourses ||
                  enrolledCourses.length === 0 ||
                  (!manualSessionId.trim() && showManualInput)
                }
                className="w-full px-4 xs:px-5 sm:px-6 md:px-7 lg:px-8 py-2.5 xs:py-3 sm:py-3 md:py-3.5 lg:py-4 btn text-white rounded-lg xs:rounded-[10px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs xs:text-sm sm:text-sm md:text-base lg:text-lg"
              >
                {refundLoading ? (
                  <>
                    <AiOutlineLoading3Quarters className="animate-spin text-xl" />
                    Submitting request...
                  </>
                ) : (
                  <>Submit Refund Request</>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
