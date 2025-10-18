"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, usePathname } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { FaClock } from "react-icons/fa";
import { AiFillStar } from "react-icons/ai";
import { FaPlay, FaPause } from "react-icons/fa";
import { useCart } from "@/components/mutantcart/CartContext";
import { useRouter } from "next/navigation";
import { decodeId, encodeId } from "@/lib/idUtils";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useNotification } from "@/context/NotificationContext";

export default function MissionDetails() {
  const params = useParams();
  const { slug } = params;
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {
    cartItems,
    setCartItems,
    isGuest,
    setIsGuest,
    guestCartId,
    setGuestCartId,
  } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const { showNotification } = useNotification();
  const [isInCart, setIsInCart] = useState(false);
  const [openLevels, setOpenLevels] = useState([]);
  const [instructorProfile, setInstructorProfile] = useState(null);

  // Video player states
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { month: "short", day: "numeric", year: "numeric" };
    return new Date(dateString)
      .toLocaleDateString("en-US", options)
      .replace(",", "")
      .toLowerCase();
  };

  // Function to convert YouTube URL to embed URL
  const getYoutubeEmbedUrl = (url) => {
    if (!url) return "";

    // If it's already an embed URL, return it
    if (url.includes("embed")) {
      return url;
    }

    // Extract video ID from YouTube URL
    let videoId = "";

    // Handle youtube.com/watch?v= format
    if (url.includes("youtube.com/watch")) {
      const urlParams = new URLSearchParams(url.split("?")[1]);
      videoId = urlParams.get("v");
    }
    // Handle youtu.be/ format
    else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    }

    // Return embed URL if we found a video ID
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // If all else fails, return the original URL
    return url;
  };

  // Fetch instructor profile data
  const fetchInstructorProfile = async (instructorId) => {
    if (!instructorId) return;

    try {
      console.log("Fetching instructor profile for ID:", instructorId);

      // Try to get a token if available, but don't require it
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("login-accessToken")
          : null;

      // Make the request with or without the token
      const response = await axios.get(
        `https://themutantschool-backend.onrender.com/api/mission/${mission._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          timeout: 8000, // 8 second timeout
        }
      );

      // The mission data should already contain the instructor info we need
      if (
        response.data &&
        response.data.data &&
        response.data.data.instructor
      ) {
        console.log(
          "Instructor data from mission:",
          response.data.data.instructor
        );
        // Just use the instructor data that's already in the mission
        setInstructorProfile({
          profile: {
            avatar:
              response.data.data.instructor.profileImage ||
              response.data.data.instructor.avatar ||
              response.data.data.instructor.profile?.avatar,
          },
        });
      }
    } catch (error) {
      // Handle specific error cases
      if (error.response) {
        if (error.response.status === 401) {
          console.log(
            "Authentication required for instructor profile. Using available data."
          );
          // Just use the instructor data we already have in the mission object
        } else {
          console.error(
            `Error ${error.response.status} fetching instructor profile:`,
            error.response.data
          );
        }
      } else if (error.request) {
        console.error(
          "No response received for instructor profile request:",
          error.request
        );
      } else {
        console.error(
          "Error setting up instructor profile request:",
          error.message
        );
      }
    }
  };

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        let routeParam = slug;

        // Prevent accessing labs or hall of mutants through mission route
        if (routeParam === "the-lab" || routeParam === "hall-of-the-mutants") {
          router.push(`/${routeParam}`);
          return;
        }

        // Helper function to create a URL-friendly slug from a title
        const createSlug = (title) => {
          if (!title) return "";
          return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
            .replace(/\s+/g, "-") // Replace spaces with hyphens
            .replace(/-+/g, "-"); // Replace multiple hyphens with a single one
        };

        // First, try to fetch all missions to find one with matching title slug
        console.log("Searching for mission with slug:", routeParam);

        // Try to get all missions and find the one with matching title slug
        const allMissionsResponse = await axios.get(
          `https://themutantschool-backend.onrender.com/api/mission?limit=1000`, // Get a large number to find the mission
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!allMissionsResponse.data || !allMissionsResponse.data.data) {
          throw new Error("No missions found");
        }

        // Find mission with matching title slug
        const matchingMission = allMissionsResponse.data.data.find(
          (mission) => {
            const missionSlug = createSlug(mission.title);
            return missionSlug === routeParam;
          }
        );

        if (!matchingMission) {
          throw new Error("Mission not found with the given slug");
        }

        console.log("Found matching mission:", matchingMission._id);

        // Now fetch the full mission details using the ID
        const response = await axios.get(
          `https://themutantschool-backend.onrender.com/api/mission/${matchingMission._id}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("API Response:", response);

        if (response.data && response.data.data) {
          const missionData = response.data.data;
          setMission(missionData);
          console.log("Found mission:", missionData);

          // Use instructor data from mission response
          if (missionData.instructor) {
            // Instead of fetching instructor profile separately, use what we have
            setInstructorProfile({
              profile: {
                avatar:
                  response.data.data.instructor.profileImage ||
                  response.data.data.instructor.avatar ||
                  response.data.data.instructor.profile?.avatar,
              },
            });
            console.log(
              "Using instructor data from mission:",
              response.data.data.instructor
            );
          }
        } else {
          console.error(
            "Mission not found or invalid API response format:",
            response.data
          );
          setError("Mission not found");
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

    if (slug) {
      fetchMissions();
    } else {
      console.error("No mission slug/ID provided");
      setError("No mission ID provided");
      setLoading(false);
    }
  }, [slug, router]);

  // Check if mission is in cart
  useEffect(() => {
    const checkCart = async () => {
      try {
        const token = localStorage.getItem("login-accessToken");
        if (!token || !mission?._id) {
          console.log("Not checking cart: No token or mission ID");
          return; // Ensure mission and its ID are available
        }

        // Validate token format before using it
        if (!token.trim() || token === "undefined" || token === "null") {
          console.log("Invalid token format, skipping cart check");
          localStorage.removeItem("login-accessToken"); // Clear invalid token
          return;
        }

        console.log("Checking if mission is in cart:", mission._id);

        try {
          const res = await axios.get(
            "https://themutantschool-backend.onrender.com/api/mission-cart",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log("Cart API response:", res.status);

          // Check for successful response and valid data structure
          if (
            res.data &&
            res.data.cart &&
            Array.isArray(res.data.cart.missions)
          ) {
            const cartMissionIds = new Set(
              res.data.cart.missions
                .map((entry) => {
                  return entry?.mission?._id || entry?.missionId || entry?._id;
                })
                .filter(Boolean) // Filter out undefined/null values
            );

            setIsInCart(cartMissionIds.has(mission._id)); // Use mission._id here
            console.log("Mission in cart:", cartMissionIds.has(mission._id));
          } else if (res.data && Array.isArray(res.data.data)) {
            // Alternative data structure
            const cartMissionIds = new Set(
              res.data.data
                .map((entry) => {
                  return entry?.mission?._id || entry?.missionId || entry?._id;
                })
                .filter(Boolean)
            );

            setIsInCart(cartMissionIds.has(mission._id));
            console.log(
              "Mission in cart (alt format):",
              cartMissionIds.has(mission._id)
            );
          } else {
            console.log("Cart data not in expected format:", res.data);
          }
        } catch (apiError) {
          // Handle authentication errors
          if (
            apiError.response?.status === 401 ||
            apiError.response?.status === 403
          ) {
            console.log("Authentication error checking cart, clearing token");
            localStorage.removeItem("login-accessToken");
          } else {
            console.error("Failed to fetch cart items:", apiError.message);
          }

          // Don't set any error state - cart checking is not critical functionality
        }
      } catch (err) {
        console.error("Error in checkCart function:", err);
      }
    };

    checkCart();
  }, [mission?._id]); // Depend on mission._id

  const handleAddToCart = async () => {
    try {
      // If mission is already in cart, show a notification instead of redirecting
      if (isInCart) {
        console.log("Mission already in cart.");
        showNotification("This mission is already in your cart.", "info");
        return;
      }

      // Verify mission ID is available
      if (!mission?._id) {
        console.error("Mission ID is not available to add to cart.");
        showNotification(
          "Mission data not fully loaded. Cannot add to cart.",
          "error"
        );
        return;
      }

      // Get token and check if we're in guest mode
      const token = localStorage.getItem("login-accessToken");
      const storedGuestCartId = localStorage.getItem("guest-cart-id");

      // Show loading state
      setLoading(true);

      // GUEST USER FLOW
      if (!token || token === "undefined" || token === "null") {
        try {
          console.log(`Guest user adding mission ${mission._id} to cart`);

          // Use existing guest cart ID or create a new one
          const apiUrl = storedGuestCartId
            ? `https://themutantschool-backend.onrender.com/api/guest/cart/${mission._id}?cartId=${storedGuestCartId}`
            : `https://themutantschool-backend.onrender.com/api/guest/cart/${mission._id}`;

          const response = await axios.post(
            apiUrl,
            {},
            { headers: { "Content-Type": "application/json" }, timeout: 10000 }
          );

          console.log("Guest cart response:", response);

          // Save the guest cart ID if this is the first item
          if (response.data?.success && response.data?.cartId) {
            // Update context with guest cart info
            setGuestCartId(response.data.cartId);
            setIsGuest(true);
          }

          // Update UI to show mission is in cart
          setIsInCart(true);

          // Update cart items in context
          setCartItems((prev) => {
            const prevArray = Array.isArray(prev) ? prev : [];
            const exists = prevArray.some((x) => x.id === mission._id);
            return exists
              ? prevArray
              : [
                  ...prevArray,
                  {
                    id: mission._id,
                    title: mission.title,
                    price: mission.price,
                    image: mission.thumbnail?.url,
                  },
                ];
          });

          // Broadcast cart change event
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("cart:changed"));
          }

          showNotification("Added to cart!", "success");
        } catch (guestError) {
          // Check if the error is specifically because the mission is already in the cart
          if (
            guestError.response?.status === 400 &&
            guestError.response?.data?.message?.trim() ===
              "Mission already in cart"
          ) {
            setIsInCart(true); // Sync local state
            showNotification("This mission is already in your cart.", "info");
          } else {
            console.error("Failed to add to guest cart:", guestError);
            showNotification(
              guestError.response?.data?.message ||
                "Failed to add to cart. Please try again.",
              "error"
            );
          }
        } finally {
          setLoading(false);
        }
        return;
      }

      // AUTHENTICATED USER FLOW
      try {
        console.log(
          `Adding mission ${mission._id} to cart for authenticated user`
        );

        const response = await axios.post(
          `https://themutantschool-backend.onrender.com/api/mission-cart/${mission._id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            timeout: 10000, // 10 second timeout
          }
        );

        console.log("Add to cart response:", response);

        // Update UI to show mission is in cart
        setIsInCart(true);

        // Update cart items in context
        setCartItems((prev) => {
          const prevArray = Array.isArray(prev) ? prev : [];
          const exists = prevArray.some((x) => x.id === mission._id);
          return exists ? prevArray : [...prevArray, { id: mission._id }];
        });

        // Broadcast cart change event
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("cart:changed"));
        }

        showNotification("Added to cart!", "success");
      } catch (apiError) {
        console.error("Failed to add to cart:", apiError);

        // Check for specific "already in cart" error
        if (
          apiError.response?.status === 400 &&
          apiError.response?.data?.message?.trim() === "Mission already in cart"
        ) {
          setIsInCart(true);
          showNotification("This mission is already in your cart.", "info");
        } else if (
          apiError.response?.status === 401 ||
          apiError.response?.status === 403
        ) {
          localStorage.removeItem("login-accessToken");
          showNotification(
            "Authentication failed. Please login again.",
            "error"
          );
          setTimeout(() => router.push("/auth/login"), 1500);
        } else if (apiError.code === "ECONNABORTED") {
          showNotification("Request timed out. Please try again.", "error");
        } else {
          showNotification(
            apiError.response?.data?.message || "Failed to add mission to cart",
            "error"
          );
        }
      } finally {
        setLoading(false);
      }
    } catch (err) {
      console.error("Unexpected error in handleAddToCart:", err);
      showNotification("An unexpected error occurred", "error");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center">
        <LoadingSpinner size="xlarge" color="mutant" />
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

  // Debug instructor data
  console.log("Mission instructor data:", mission.instructor);
  console.log("Instructor profile data:", mission.instructor?.profile);
  console.log("Instructor avatar data:", mission.instructor?.profile?.avatar);
  console.log("Fetched instructor profile:", instructorProfile);
  console.log("All instructor fields:", {
    image: mission.instructor?.image,
    profileImage: mission.instructor?.profileImage,
    avatar: mission.instructor?.avatar,
    profilePicture: mission.instructor?.profilePicture,
    profileAvatar: mission.instructor?.profile?.avatar,
    profileImageUrl: mission.instructor?.profileImage?.url,
    avatarUrl: mission.instructor?.avatar?.url,
    profilePictureUrl: mission.instructor?.profilePicture?.url,
    profileAvatarUrl: mission.instructor?.profile?.avatar?.url,
    fetchedProfileAvatar: instructorProfile?.profile?.avatar?.url,
  });

  // Ensure mission has all required properties with defaults
  const safeData = {
    title: mission.title || "Mission Title",
    description: mission.description || "No description available",
    instructor: {
      name: mission.instructor
        ? `${mission.instructor.firstName} ${mission.instructor.lastName}`
        : "Instructor",
      image:
        instructorProfile?.profile?.avatar?.url ||
        mission.instructor?.profile?.avatar?.url ||
        mission.instructor?.profileImage?.url ||
        mission.instructor?.image ||
        mission.instructor?.avatar?.url ||
        mission.instructor?.profilePicture?.url ||
        null,
      firstName: mission.instructor?.firstName || "",
      lastName: mission.instructor?.lastName || "",
    },
    category: mission.category || "General",
    estimatedDuration: mission.estimatedDuration || "Self-paced",
    price: mission.isFree ? "Free" : mission.price || "99.99",
    thumbnail: mission.thumbnail || { url: null },
    video: mission.video || { url: null },
    skillLevel: mission.skillLevel || "All levels",
    bio: mission.bio || "No bio available",
    shortDescription: mission.shortDescription || "",
    certificateAvailable: mission.certificateAvailable !== false,
    tags: Array.isArray(mission.tags) ? mission.tags.join(", ") : "",
    averageRating: mission.averageRating || 0,
    createdAt: formatDate(mission.createdAt),
    updatedAt: formatDate(mission.updatedAt),
    learningOutcomes: Array.isArray(mission.learningOutcomes)
      ? mission.learningOutcomes
      : [],
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
        <div style={{ gap: "32px" }} className="flex flex-col md:flex-row">
          {/* Right side - Mission image or video - appears first on mobile */}
          <div className="w-full md:w-1/2 relative rounded-[12px] overflow-hidden order-first md:order-last">
            {safeData.video?.url ? (
              <div className="relative w-full md:h-[400px]">
                {/* Check if it's a YouTube video */}
                {(typeof safeData.video === "object" &&
                  safeData.video.type === "embed") ||
                safeData.video.url.includes("youtube.com") ||
                safeData.video.url.includes("youtu.be") ? (
                  <div className="w-full h-full aspect-video">
                    <iframe
                      src={getYoutubeEmbedUrl(safeData.video.url)}
                      title={safeData.title}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  // For direct video URLs
                  <div
                    className="relative w-full h-full"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    <video
                      ref={videoRef}
                      src={safeData.video.url}
                      controls
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover"
                      poster={safeData.thumbnail?.url || ""}
                      controlsList="nodownload"
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onEnded={() => setIsPlaying(false)}
                    />
                    {/* Play button - shown when video is not playing */}
                    {!isPlaying && (
                      <div
                        className="absolute inset-0 flex items-center justify-center cursor-pointer"
                        onClick={() => {
                          if (videoRef.current) {
                            videoRef.current.play();
                          }
                        }}
                      >
                        <div className="w-20 h-20 rounded-full bg-black bg-opacity-50 flex items-center justify-center transition-transform hover:scale-110">
                          <FaPlay className="h-10 w-10 text-white ml-2" />
                        </div>
                      </div>
                    )}

                    {/* Pause button - shown only when video is playing AND hovering */}
                    {isPlaying && isHovering && (
                      <div
                        className="absolute inset-0 flex items-center justify-center cursor-pointer"
                        onClick={() => {
                          if (videoRef.current) {
                            videoRef.current.pause();
                          }
                        }}
                      >
                        <div className="w-20 h-20 rounded-full bg-black bg-opacity-50 flex items-center justify-center transition-transform hover:scale-110">
                          <FaPause className="h-10 w-10 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : safeData.thumbnail?.url ? (
              <div className="w-full md:h-[400px] relative">
                <Image
                  src={safeData.thumbnail?.url}
                  alt={safeData.title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    if (!e.target.getAttribute("data-error-handled")) {
                      console.log("Image failed to load, using fallback");
                      e.target.setAttribute("data-error-handled", "true");
                      e.target.src = "/images/default-course.jpg";
                    }
                  }}
                />
              </div>
            ) : (
              <div className="w-full md:h-[400px] bg-[var(--gray-800)] flex items-center justify-center">
                <p className="text-[var(--gray-400)]">No media available</p>
              </div>
            )}
          </div>

          {/* Left side - Mission info - appears second on mobile */}
          <div className="w-full md:w-1/2 order-last md:order-first">
            {/* Instructor details - comes first */}
            <div
              style={{ marginBottom: "16px" }}
              className="flex items-center gap-3"
            >
              {safeData.instructor.image ? (
                <div className="w-12 h-12 rounded-full border-2 border-[var(--purple-glow)] relative overflow-hidden">
                  <Image
                    src={safeData.instructor.image}
                    alt={safeData.instructor.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      if (!e.target.getAttribute("data-error-handled")) {
                        e.target.setAttribute("data-error-handled", "true");
                        e.target.src = "/images/default-avatar.jpg";
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-[var(--purple-glow)] flex items-center justify-center text-black font-semibold text-lg">
                  {safeData.instructor.firstName?.charAt(0) || ""}
                  {safeData.instructor.lastName?.charAt(0) || ""}
                </div>
              )}
              <div>
                <p className="text-[var(--purple-glow)] font-semibold text-sm">
                  {safeData.instructor.name}
                </p>
                <p className="text-[var(--gray-300)] text-xs">
                  Course Instructor
                </p>
              </div>
            </div>

            {/* Mission title */}
            <h1
              style={{ marginBottom: "8px" }}
              className="text-[24px] md:text-[32px] font-[700] text-[var(--text-light-2)]"
            >
              {safeData.title}
            </h1>

            {/* Short bio summary */}
            <p
              style={{ marginBottom: "16px" }}
              className="text-[var(--purple-glow)] text-sm"
            >
              {safeData.bio}
            </p>
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
        </div>
      </div>

      {/* What you'll learn section */}
      <div
        style={{ padding: "40px 10px", backgroundColor: "white" }}
        className="overflow-x-hidden"
      >
        <div
          style={{ maxWidth: "1400px", margin: "0 auto", width: "100%" }}
          className="border-0 sm:border border-[#CACACA] rounded-[12px] sm:rounded-[20px] p-3 sm:p-8 md:p-10 lg:p-14"
        >
          <h2
            style={{ marginBottom: "14px" }}
            className="text-[28px] sm:text-[38px] md:text-[46px] font-[800] text-[#8B4CC2] text-center sm:text-left"
          >
            What you&apos;ll learn?
          </h2>
          <ul className="grid grid-cols-1 gap-4 sm:gap-5 w-full">
            {safeData.learningOutcomes.length > 0 ? (
              safeData.learningOutcomes.map((outcome, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 sm:gap-3 w-full"
                >
                  <span className="text-[#8B4CC2] flex-shrink-0 text-base sm:text-lg pt-0.5">
                    •
                  </span>
                  <span className="text-black break-words text-sm sm:text-base max-w-[calc(100%-20px)]">
                    {outcome}
                  </span>
                </li>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500 text-sm sm:text-base px-2">
                Learning outcomes will be displayed here once they are added to
                this course.
              </div>
            )}
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
            {safeData.certificateAvailable && (
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
            )}
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
            className="sm:text-[46px] font-[800] text-black"
          >
            Course Levels:
          </h2>
          <div style={{ gap: "16px" }} className="flex flex-col">
            {mission.levels && mission.levels.length > 0 ? (
              mission.levels
                .sort((a, b) => a.order - b.order)
                .map((level, index) => (
                  <div key={level._id} className="transition-all duration-300">
                    <div
                      onClick={() => {
                        if (openLevels.includes(level._id)) {
                          setOpenLevels(
                            openLevels.filter((id) => id !== level._id)
                          );
                        } else {
                          setOpenLevels([...openLevels, level._id]);
                        }
                      }}
                      style={{ padding: "16px 8px" }}
                      className="flex items-center justify-between border border-[#CACACA] rounded-[12px] p-4 cursor-pointer hover:bg-gray-50"
                    >
                      <div>
                        <h3 className="font-[600] text-black">
                          {level.title || `Level ${index + 1}`}
                        </h3>
                        <p className="text-gray-500 text-sm mt-1">
                          {level.estimatedTime || "Self-paced"} •{" "}
                          {level.capsules?.length || 0}{" "}
                          {level.capsules?.length === 1 ? "lesson" : "lessons"}
                        </p>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className={`w-6 h-6 text-black transition-transform duration-300 ${
                          openLevels.includes(level._id) ? "rotate-180" : ""
                        }`}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    </div>
                    {/* Level Dropdown Content */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        openLevels.includes(level._id)
                          ? "max-h-[500px] opacity-100 mt-2"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="bg-gray-50 rounded-lg p-4 ml-4 border-l-2 border-[#8B4CC2]">
                        <ul className="space-y-3">
                          {level.capsules && level.capsules.length > 0 ? (
                            level.capsules
                              .sort((a, b) => a.order - b.order)
                              .map((capsule) => (
                                <li key={capsule._id} className="flex gap-3">
                                  <div className="flex items-center h-6">
                                    <div className="w-2 h-2 rounded-full bg-[#8B4CC2]"></div>
                                  </div>
                                  <div>
                                    <p className="text-gray-800 font-medium">
                                      {capsule.title}
                                    </p>
                                    {capsule.description && (
                                      <p className="text-gray-600 text-sm mt-0.5">
                                        {capsule.description}
                                      </p>
                                    )}
                                    {capsule.duration && (
                                      <p className="text-gray-500 text-xs mt-0.5">
                                        Duration: {capsule.duration}
                                      </p>
                                    )}
                                  </div>
                                </li>
                              ))
                          ) : (
                            <li className="text-gray-500">
                              No lessons available in this level.
                            </li>
                          )}
                        </ul>

                        {level.quiz && (
                          <div className="mt-4 pt-3 border-t border-gray-200">
                            <div className="flex items-center">
                              <span className="font-medium">
                                Level Quiz: {level.quiz.title}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No course levels available for this mission.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
