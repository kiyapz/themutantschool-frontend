"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { FaClock } from "react-icons/fa";
import { AiFillStar } from "react-icons/ai";
import { useCart } from "@/components/mutantcart/CartContext";
import { useRouter } from "next/navigation";

export default function MissionDetails() {
  const params = useParams();
  const { id } = params;
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { cartItems, setCartItems } = useCart();
  const router = useRouter();
  const [isInCart, setIsInCart] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { month: "short", day: "numeric", year: "numeric" };
    return new Date(dateString)
      .toLocaleDateString("en-US", options)
      .replace(",", "")
      .toLowerCase();
  };

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        // Prevent accessing labs or hall of mutants through mission route
        if (id === "the-lab" || id === "hall-of-the-mutants") {
          router.push(`/${id}`);
          return;
        }

        console.log("Fetching all missions");
        const response = await axios.get(
          "https://themutantschool-backend.onrender.com/api/mission",
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("API Response:", response);

        if (response.data && response.data.data) {
          const missions = response.data.data;
          const currentMission = missions.find((m) => m._id === id);

          if (currentMission) {
            setMission(currentMission);
            console.log("Found mission:", currentMission);
          } else {
            console.error("Mission not found in array");
            setError("Mission not found");
          }
        } else {
          console.error("Invalid API response format:", response.data);
          setError("Invalid mission data received");
        }
      } catch (err) {
        console.error("Failed to fetch missions:", err);
        console.error("Error details:", err.response?.data || err.message);
        setError(
          `Failed to load mission details: ${
            err.response?.data?.message || err.message
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMissions();
    } else {
      console.error("No mission ID provided");
      setError("No mission ID provided");
      setLoading(false);
    }
  }, [id, router]);

  // Check if mission is in cart
  useEffect(() => {
    const checkCart = async () => {
      const token = localStorage.getItem("login-accessToken");
      if (!token) return;

      try {
        const res = await axios.get(
          "https://themutantschool-backend.onrender.com/api/mission-cart",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data && res.data.cart) {
          const cartMissionIds = new Set(
            (res.data.cart.missions || []).map((entry) => {
              return entry?.mission?._id || entry?.missionId || entry?._id;
            })
          );
          setIsInCart(cartMissionIds.has(id));
        }
      } catch (err) {
        console.error("Failed to fetch cart items:", err);
      }
    };

    checkCart();
  }, [id]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("login-accessToken");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    if (isInCart) {
      router.push("/cart");
      return;
    }

    try {
      const response = await axios.post(
        `https://themutantschool-backend.onrender.com/api/mission-cart/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsInCart(true);
      setCartItems((prev) => {
        const prevArray = Array.isArray(prev) ? prev : [];
        const exists = prevArray.some((x) => x.id === id);
        return exists ? prevArray : [...prevArray, { id }];
      });

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("cart:changed"));
      }
    } catch (err) {
      console.error("Failed to add to cart:", err);
      setError("Failed to add mission to cart");
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-white">Loading mission details...</div>
      </div>
    );
  }

  if (error || !mission) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center">
        <div className="text-red-500 mb-4">{error || "Mission not found"}</div>
        <button
          onClick={() => router.push("/missions")}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Back to Missions
        </button>
      </div>
    );
  }

  // Ensure mission has all required properties with defaults
  const safeData = {
    title: mission.title || "Mission Title",
    description: mission.description || "No description available",
    instructor: {
      name: mission.instructor
        ? `${mission.instructor.firstName} ${mission.instructor.lastName}`
        : "Instructor",
    },
    category: mission.category || "General",
    estimatedDuration: mission.estimatedDuration || "Self-paced",
    price: mission.isFree ? "Free" : mission.price || "99.99",
    thumbnail: mission.thumbnail || { url: null },
    skillLevel: mission.skillLevel || "All levels",
    bio: mission.bio || "No bio available",
    shortDescription: mission.shortDescription || "",
    certificateAvailable: mission.certificateAvailable || false,
    tags: Array.isArray(mission.tags) ? mission.tags.join(", ") : "",
    averageRating: mission.averageRating || 0,
    createdAt: formatDate(mission.createdAt),
    updatedAt: formatDate(mission.updatedAt),
  };

  return (
    <div
      style={{ marginTop: "100px" }}
      className="bg-black min-h-screen text-white"
    >
      {/* Hero section with mission title and author */}
      <div
        style={{
          padding: "64px 32px 32px 32px",
          margin: "0 auto",
          backgroundImage: "url('/images/Rectangle 120.png')",
        }}
        className="max-w-[1400px] mx-auto"
      >
        <div style={{ gap: "32px" }} className="flex flex-col md:flex-row ">
          {/* Left side - Mission info */}
          <div className="w-full md:w-1/2">
            <h1
              style={{ marginBottom: "8px" }}
              className="text-[24px] md:text-[32px] font-[700] text-[var(--text-light-2)]"
            >
              {safeData.title}
            </h1>
            <div
              style={{ marginBottom: "16px" }}
              className="flex flex-col gap-2"
            >
              <p className="text-[var(--purple-glow)]">{safeData.bio}</p>
              <p className="text-[var(--purple-glow)]">
                Instructor : {safeData.instructor.name}
              </p>
            </div>
            <p
              style={{ marginBottom: "24px" }}
              className="text-[var(--gray-300)]"
            >
              {safeData.description}
            </p>

            <div
              style={{ marginBottom: "16px", gap: "8px" }}
              className="flex flex-wrap items-center"
            >
              <span
                style={{ padding: "4px 12px" }}
                className="bg-[#FFEE00] rounded-[20px] text-black text-[12px]"
              >
                {safeData.skillLevel}
              </span>
              <span
                style={{ padding: "4px 12px" }}
                className="bg-[#7D7D7D] text-black rounded-[20px] text-[12px]"
              >
                {safeData.category}
              </span>
              <span
                style={{ padding: "4px 12px" }}
                className="bg-[var(--gray-800)] rounded-[20px] text-[12px] flex items-center"
              >
                <FaClock style={{ marginRight: "4px" }} />
                {safeData.estimatedDuration}
              </span>

              {safeData.certificateAvailable && (
                <span
                  style={{ padding: "4px 12px" }}
                  className="bg-[var(--green-strong)] rounded-[20px] text-[12px]"
                >
                  Certificate Available
                </span>
              )}
            </div>

            <div
              style={{ gap: "4px", marginBottom: "16px" }}
              className="flex items-center"
            >
              <AiFillStar className="text-[var(--warning-strong)] text-[10px]" />
              <span className="text-[var(--text-light-2) text-[10px]">
                {safeData.averageRating.toFixed(1)}
              </span>
              <span className="text-[var(--text-light-2)] text-[10px]">
                Created: {safeData.createdAt}
              </span>
              <span className="text-[var(--text-light-2)] text-[10px]">
                Last Updated: {safeData.updatedAt}
              </span>
            </div>

            <div
              style={{ marginBottom: "24px", gap: "16px" }}
              className="flex items-center"
            >
              <button
                onClick={handleAddToCart}
                style={{ padding: "8px 24px" }}
                className={`rounded-[8px] ${
                  isInCart
                    ? "bg-[var(--purple-glow)] hover:bg-[var(--purple-glow-hover)]"
                    : "bg-[var(--mutant-color)] hover:bg-[var(--mutant-color-hover)]"
                } transition-colors text-[var(--text-light-2)] btn`}
              >
                {isInCart ? "View in cart" : "Add to cart"}
              </button>
              <div className="text-[24px] font-[700] text-[var(--text-light-2)]">
                ${safeData.price}
              </div>
            </div>
          </div>

          {/* Right side - Mission image */}
          <div className="w-full md:w-1/2 relative rounded-[12px] border border-[var(--gray-800)] overflow-hidden">
            {safeData.thumbnail?.url ? (
              <img
                src={safeData.thumbnail?.url}
                alt={safeData.title}
                className="w-full md:h-[400px] object-cover rounded-[12px]"
                onError={(e) => {
                  if (!e.target.getAttribute("data-error-handled")) {
                    console.log("Image failed to load, using fallback");
                    e.target.setAttribute("data-error-handled", "true");
                    e.target.src = "/images/default-course.jpg";
                  }
                }}
              />
            ) : (
              <div
                style={{ height: "300px" }}
                className="w-full md:h-[400px] bg-[var(--gray-800)] rounded-[12px] flex items-center justify-center"
              >
                <p className="text-[var(--gray-400)]">No image available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* What you'll learn section */}
      <div style={{ padding: "40px 32px", backgroundColor: "white" }}>
        <div
          style={{ maxWidth: "1400px", margin: "0 auto", padding: "54px" }}
          className="border border-[#CACACA] rounded-[20px]"
        >
          <h2
            style={{ marginBottom: "24px" }}
            className="sm:text-[46px] font-[800] text-[#8B4CC2] "
          >
            What you&apos;ll learn?
          </h2>
          <ul className="grid grid-cols-1 gap-4">
            <li className="flex items-start gap-2">
              <span className="text-[#000000]">•</span>
              <span className="text-black">
                Understand the basics of Javascript and how it powers modern
                websites.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#000000]">•</span>
              <span className="text-black">
                Work with variables, data types, functions, and operators.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#000000]">•</span>
              <span className="text-black">
                Learn ES6+ features like arrow functions and modules.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#000000]">•</span>
              <span className="text-black">
                Debug Javascript code and use dev tools.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* This Mission includes section */}
      <div style={{ padding: "40px 32px", backgroundColor: "white" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <h2
            style={{ marginBottom: "24px" }}
            className="sm:text-[46px] font-[700] text-black"
          >
            This Mission includes:
          </h2>
          <div
            style={{ gap: "24px" }}
            className="grid grid-cols-1 sm:grid-cols-2 "
          >
            <div style={{ gap: "12px" }} className="flex items-center">
              <div
                style={{ width: "40px", height: "40px" }}
                className="flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-black"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z"
                  />
                </svg>
              </div>
              <div className="text-black">{safeData.estimatedDuration}</div>
            </div>
            <div style={{ gap: "12px" }} className="flex items-center">
              <div
                style={{ width: "40px", height: "40px" }}
                className="flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-black"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
              </div>
              <div className="text-black">Certificate on completion</div>
            </div>
            <div style={{ gap: "12px" }} className="flex items-center">
              <div
                style={{ width: "40px", height: "40px" }}
                className="flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-black"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
              </div>
              <div className="text-black">2 Downloadable resources</div>
            </div>
            <div style={{ gap: "12px" }} className="flex items-center">
              <div
                style={{ width: "40px", height: "40px" }}
                className="flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-black"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
                  />
                </svg>
              </div>
              <div className="text-black">Access on PC and mobile</div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Levels */}
      <div style={{ padding: "40px 32px", backgroundColor: "white" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <h2
            style={{ marginBottom: "24px" }}
            className=" sm:text-[46px] font-[800] text-black"
          >
            Course Levels:
          </h2>
          <div style={{ gap: "16px" }} className="flex flex-col">
            <div>
              <div
                style={{ padding: "16px 8px" }}
                className="flex items-center justify-between border border-[#CACACA] rounded-[12px] p-4"
              >
                <h3 className="font-[600] text-black">
                  Understand the basics of Javascript and how it powers modern
                  websites.
                </h3>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-black"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </div>
            </div>
            <div>
              <div
                style={{ padding: "16px 8px" }}
                className="flex items-center justify-between border border-[#CACACA] rounded-[12px] p-4"
              >
                <h3 className="font-[600] text-black">
                  Work with variables, data types, functions, and operators.
                </h3>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-black"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </div>
            </div>
            <div>
              <div
                style={{ padding: "16px 8px" }}
                className="flex items-center justify-between border border-[#CACACA] rounded-[12px] p-4"
              >
                <h3 className="font-[600] text-black">
                  Learn ES6+ features like arrow functions and modules.
                </h3>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-black"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </div>
            </div>
            <div>
              <div
                style={{ padding: "16px 8px" }}
                className="flex items-center justify-between border border-[#CACACA] rounded-[12px] p-4"
              >
                <h3 className="font-[600] text-black">
                  Debug Javascript code and use dev tools.
                </h3>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-black"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
