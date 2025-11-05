"use client";
import DropDown from "@/components/Dropdown";
import { FaSearch } from "react-icons/fa";
import { FaClock } from "react-icons/fa";
import { AiFillStar } from "react-icons/ai";
import { useState, useMemo, useEffect } from "react";
import { useCart } from "@/components/mutantcart/CartContext";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

const ITEMS_PER_PAGE = 10;

// Filter options
const options = [
  { label: "Design", value: "design" },
  { label: "Code", value: "code" },
  { label: "Growth Hacking", value: "growth-hacking" },
];

const optionsIntensity = [
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Expert", value: "expert" },
];

const optionsIntensity2 = [
  { label: "0hr - 2hrs", value: "0-2" },
  { label: "3hrs - 5hrs", value: "3-5" },
  { label: "5hrs - 10hrs", value: "5-10" },
  { label: "11hrs - more", value: "11+" },
];

const optionsIntensity3 = [
  { label: "Free", value: "free" },
  { label: "$1 - $100", value: "1-100" },
  { label: "$101 - $400", value: "101-400" },
];

const optionsIntensity4 = [
  { label: "3.0 <", value: "3.0" },
  { label: "3.5 <", value: "3.5" },
  { label: "4.0 <", value: "4.0" },
  { label: "4.5 <", value: "4.5" },
];

export default function Mission() {
  const { setCartItems } = useCart();
  const [clickedButtons, setClickedButtons] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [powerDiscipline, setPowerDiscipline] = useState("");

  // Filter states
  const [selectedLevels, setSelectedLevels] = useState([]); // For mutationIntensity (Checkbox)
  const [selectedDurations, setSelectedDurations] = useState([]); // For duration ranges (Checkbox Multi)
  const [selectedPrice, setSelectedPrice] = useState(""); // For price range (Radio)
  const [selectedRating, setSelectedRating] = useState(""); // For rating filter (Radio)

  const [course, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalMissions, setTotalMissions] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Seed category from URL (?category=...)
  useEffect(() => {
    const cat = searchParams?.get("category");
    if (cat) {
      setPowerDiscipline(cat);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        setLoading(true);
        let url = `https://themutantschool-backend.onrender.com/api/mission?page=${currentPage}&limit=${ITEMS_PER_PAGE}`;

        // Only add search term to backend API (backend handles search)
        if (searchTerm.trim()) {
          url += `&search=${encodeURIComponent(searchTerm.trim())}`;
        }

        const res = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        setMissions(res.data.data);
        setTotalMissions(res.data.totalMissions);
        setTotalPages(res.data.totalPages);
        console.log("Fetched missions:", res.data.data.length);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch missions");
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
    // Keep all dependencies to maintain consistent array size (React requirement)
    // Filters are applied client-side in the useMemo below, not in the API call
  }, [
    currentPage,
    searchTerm,
    powerDiscipline,
    selectedLevels,
    selectedDurations,
    selectedPrice,
    selectedRating,
  ]);

  useEffect(() => {
    const fetchCartItems = async () => {
      console.log("[Missions Page] Fetching initial cart items...");
      const token = localStorage.getItem("login-accessToken");
      const guestCartId = localStorage.getItem("guest-cart-id");

      if (!token && !guestCartId) {
        console.log(
          "[Missions Page] No token or guest cart, skipping cart fetch."
        );
        return;
      }

      try {
        let res;

        if (!token && guestCartId) {
          // Fetch guest cart
          console.log("[Missions Page] Fetching guest cart...");
          res = await axios.get(
            `https://themutantschool-backend.onrender.com/api/guest/cart?cartId=${guestCartId}`
          );
        } else if (token) {
          // Fetch authenticated user cart
          res = await axios.get(
            "https://themutantschool-backend.onrender.com/api/mission-cart",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }

        if (res?.data && (res.data.cart || res.data.data)) {
          const cartMissionIds = new Set(
            (res.data.cart?.missions || res.data.data || []).map((entry) => {
              return entry?.mission?._id || entry?.missionId || entry?._id;
            })
          );
          console.log(
            "[Missions Page] Cart contains mission IDs:",
            Array.from(cartMissionIds)
          );
          setClickedButtons(cartMissionIds);
          // Also seed global cart items minimally for count
          const minimalItems = (
            res.data.cart?.missions ||
            res.data.data ||
            []
          ).map((entry) => ({
            id: entry?.mission?._id || entry?.missionId || entry?._id,
          }));
          setCartItems(minimalItems);
        }
      } catch (err) {
        // Gracefully handle errors - cart is not critical for viewing missions
        if (err.response?.status === 404) {
          console.log(
            "[Missions Page] No cart found (404). This is normal for new users."
          );
          // Clear invalid cart IDs
          if (guestCartId) {
            localStorage.removeItem("guest-cart-id");
          }
        } else {
          console.error(
            "[Missions Page] Failed to fetch cart items:",
            err.message
          );
        }
        // Don't show error to user - empty cart is fine
      }
    };

    fetchCartItems();
  }, [setCartItems]);

  const mapDurationToRange = (estimatedDuration) => {
    if (estimatedDuration == null) return null;
    const valueString = String(estimatedDuration);
    const numberMatch = valueString.match(/(\d+(?:\.\d+)?)/);
    if (!numberMatch) return null;
    const hours = parseFloat(numberMatch[1]);
    if (Number.isNaN(hours)) return null;
    if (hours <= 2) return "0-2";
    if (hours <= 5) return "3-5";
    if (hours <= 10) return "5-10";
    return "11+";
  };

  // Function to create URL-friendly slug from course title
  const createSlug = (title) => {
    if (!title) return "";
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters except spaces and hyphens
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .trim(); // Remove leading/trailing spaces
  };

  // Apply client-side filtering to missions
  const filteredCourses = useMemo(() => {
    let filtered = [...course];

    // Filter by Power Discipline (category)
    if (powerDiscipline) {
      filtered = filtered.filter((mission) => {
        const category = mission.category?.toLowerCase() || "";
        return category === powerDiscipline.toLowerCase();
      });
    }

    // Filter by Difficulty Level (mutationIntensity)
    if (selectedLevels.length > 0) {
      filtered = filtered.filter((mission) => {
        const intensity = mission.mutationIntensity?.toLowerCase() || "";
        return selectedLevels.some(
          (level) => level.toLowerCase() === intensity
        );
      });
    }

    // Filter by Duration
    if (selectedDurations.length > 0) {
      filtered = filtered.filter((mission) => {
        const durationRange = mapDurationToRange(mission.estimatedDuration);
        return selectedDurations.includes(durationRange);
      });
    }

    // Filter by Price Range
    if (selectedPrice) {
      filtered = filtered.filter((mission) => {
        const price = Number(mission.price) || 0;
        const isFree = mission.isFree || price === 0;

        if (selectedPrice === "free") {
          return isFree;
        } else if (selectedPrice === "1-100") {
          return !isFree && price >= 1 && price <= 100;
        } else if (selectedPrice === "101-400") {
          return !isFree && price >= 101 && price <= 400;
        }
        return true;
      });
    }

    // Filter by Rating
    if (selectedRating) {
      filtered = filtered.filter((mission) => {
        const rating = Number(mission.averageRating || mission.rating || 0);
        const minRating = parseFloat(selectedRating);
        return rating >= minRating;
      });
    }

    return filtered;
  }, [
    course,
    powerDiscipline,
    selectedLevels,
    selectedDurations,
    selectedPrice,
    selectedRating,
  ]);

  // Sort filtered courses based on selected criteria
  const sortedCourses = useMemo(() => {
    let sorted = [...filteredCourses];

    if (sortBy === "Most Popular") {
      sorted = sorted.sort(
        (a, b) =>
          Number(b.averageRating || b.rating || 0) -
          Number(a.averageRating || a.rating || 0)
      );
    } else if (sortBy === "Recent") {
      sorted = sorted.sort((a, b) => {
        const dateA = Date.parse(a.createdAt || a.updatedAt || 0) || 0;
        const dateB = Date.parse(b.createdAt || b.updatedAt || 0) || 0;
        if (dateB !== dateA) return dateB - dateA;
        const idA = String(a._id || a.id || "");
        const idB = String(b._id || b.id || "");
        return idB.localeCompare(idA);
      });
    } else if (sortBy === "Free") {
      sorted = sorted.sort((a, b) => {
        const valA = a.isFree ? 0 : Number(a.price) || Infinity;
        const valB = b.isFree ? 0 : Number(b.price) || Infinity;
        return valA - valB;
      });
    }

    return sorted;
  }, [sortBy, filteredCourses]);

  const handleAddToCart = async (missionId) => {
    console.log(
      `%c[Add to Cart] Button clicked for missionId: ${missionId}`,
      `color: var(--mutant-color); font-weight: bold;`
    );

    if (clickedButtons.has(missionId)) {
      console.log(
        `[Add to Cart] Mission ${missionId} already in cart. Redirecting to cart page.`
      );
      router.push("/cart");
      return;
    }

    const token = localStorage.getItem("login-accessToken");

    try {
      let response;

      // GUEST USER FLOW - using the same approach as mission detail page
      if (!token || token === "undefined" || token === "null") {
        console.log(
          `[Add to Cart] Guest user adding mission ${missionId} to cart`
        );
        const storedGuestCartId = localStorage.getItem("guest-cart-id");

        // Use existing guest cart ID or create a new one
        const apiUrl = storedGuestCartId
          ? `https://themutantschool-backend.onrender.com/api/guest/cart/${missionId}?cartId=${storedGuestCartId}`
          : `https://themutantschool-backend.onrender.com/api/guest/cart/${missionId}`;

        response = await axios.post(
          apiUrl,
          {},
          {
            headers: {
              "Content-Type": "application/json",
            },
            timeout: 10000,
          }
        );

        console.log("[Add to Cart] Guest cart response:", response);

        // Save the guest cart ID if this is the first item
        if (response.data?.success && response.data?.cartId) {
          localStorage.setItem("guest-cart-id", response.data.cartId);
        }
      } else {
        // AUTHENTICATED USER FLOW
        console.log(
          `[Add to Cart] Sending POST request for missionId: ${missionId}`
        );
        response = await axios.post(
          `https://themutantschool-backend.onrender.com/api/mission-cart/${missionId}`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      console.log("[Add to Cart] API Response:", response.data);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to add to cart");
      }

      setClickedButtons((prev) => new Set(prev).add(missionId));
      // Increment global cart (minimal add) and persist via context
      setCartItems((prev) => {
        const prevArray = Array.isArray(prev) ? prev : [];
        const exists = prevArray.some((x) => x.id === missionId);
        const next = exists ? prevArray : [...prevArray, { id: missionId }];
        return next;
      });
      console.log(
        "[Add to Cart] UI state updated. Broadcasting cart:changed event."
      );
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("cart:changed"));
      }
    } catch (err) {
      console.error(
        "[Add to Cart] API Error:",
        err.response?.data || err.message,
        "\nFull error object:",
        err
      );

      // Check if the error is specifically because the mission is already in the cart
      if (
        err.response?.status === 400 &&
        err.response?.data?.message?.trim() === "Mission already in cart"
      ) {
        setClickedButtons((prev) => new Set(prev).add(missionId));
        setError("This mission is already in your cart.");
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        // Authentication error - only redirect if user was supposed to be logged in
        const token = localStorage.getItem("login-accessToken");
        if (token) {
          localStorage.removeItem("login-accessToken");
          setError("Session expired. Please log in again.");
          setTimeout(() => router.push("/auth/login"), 1500);
        } else {
          setError("Failed to add to cart. Please try again.");
        }
      } else {
        setError(
          err.response?.data?.message || "Failed to add mission to cart."
        );
      }
      setTimeout(() => setError(null), 5000);
    }
  };

  // Reset to page 1 when filters or search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    powerDiscipline,
    selectedLevels,
    selectedDurations,
    selectedPrice,
    selectedRating,
  ]);

  console.log(course.thumbnail?.url, "course.thumbnail.url");
  return (
    <div className="w-screen h-full bg-black flexcenter ">
      <div className=" w-full  ">
        {error && (
          <div className="fixed top-20 right-5 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-50">
            {error}
          </div>
        )}
        {/* Herosection */}
        <div
          style={{
            backgroundImage: "url('/images/Rectangle 120.png')",
          }}
          className="min-h-screen bg-black relative z-20 flex items-center justify-center flex-col w-full bg-cover bg-center py-20"
        >
          <div className="max-w-[336.97px] relative flexcenter flex-col gap-5 sm:max-w-[852.48px] w-full px-4">
            <div className="relative z-40">
              <h2 className="text-[var(--text-light-2)] Xirod text-[24px] leading-[28px] xs:text-[32px] xs:leading-[36px] sm:text-[40px] sm:leading-[44px] md:text-[51px] md:leading-[57px] text-center">
                Choose Your Next
              </h2>
              <h2 className="text-[var(--text-light-2)] Xirod text-[24px] leading-[28px] xs:text-[32px] xs:leading-[36px] sm:text-[40px] sm:leading-[44px] md:text-[51px] md:leading-[57px] text-center">
                Mutation Mission
              </h2>
            </div>

            <p className="font-[500] text-[12px] xs:text-[14px] relative z-40 sm:text-[17px] leading-[14px] sm:leading-[24px] md:leading-[28px] text-[var(--info)] text-center px-2">
              EVERY MISSION IS A TEST. EVERY SKILL IS A POWER WAITING TO AWAKEN
            </p>
          </div>
        </div>

        {/* main */}
        <div style={{ padding: "30px" }} className="bg-white py-16">
          <div
            style={{ margin: "auto" }}
            className="w-full max-w-[330px] sm:max-w-[1400px] mx-auto"
          >
            {/* search btn */}
            <div className="w-full grid bg-white  gap-5 sm:gap-0">
              <div className=""></div>
              <div
                style={{ marginBottom: "20px" }}
                className="col-span-2 flex flex-col gap-5 xl:gap-0 sm:flex-row px-4 sm:px-6 md:px-8 xl:px-0 items-center w-full justify-between"
              >
                <p className="font-[700]  text-[20px] xs:text-[25px] md:text-[30px] xxl:text-[37px] leading-[24px] text-black text-center xl:text-left">
                  All Missions
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-2   w-full sm:w-auto">
                  <div
                    style={{ padding: "0 15px" }}
                    className="border-[var(--coco-color)] border text-black rounded-[38px] flex items-center h-[47.15px] w-full sm:max-w-[350px] md:max-w-[400px] lg:max-w-[446.1px]"
                  >
                    <FaSearch className="text-[var(--gray-300)] flex-shrink-0" />
                    <input
                      style={{ padding: "7px" }}
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder={`"Search Missions… Try "Growth hacking", "Figma", "Python""`}
                      className="w-full h-full outline-none placeholder-[var(--gray-350)] font-[700] text-black text-[8px] xs:text-[10px] leading-[30px]"
                    />
                  </div>
                  <div
                    className="border-[var(--coco-color)] text-[var(--gray-350)] font-[500] leading-[30px] text-[10px] flexcenter border rounded-[38px] h-[47.15px] w-full sm:w-[120px] md:w-[150px] lg:w-[175.72px] relative cursor-pointer"
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                  >
                    Sort by :
                    <span className="text-black"> {sortBy || "Default"}</span>
                    {showSortDropdown && (
                      <div
                        style={{ padding: "2px" }}
                        className="absolute top-full left-0 right-0 mt-1 bg-white border border-[var(--coco-color)]  rounded-[10px] shadow-lg z-50"
                      >
                        <div
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-[10px] text-[10px]"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSortBy("Most Popular");
                            setShowSortDropdown(false);
                          }}
                        >
                          Most Popular
                        </div>
                        <div
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-[10px]"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSortBy("Recent");
                            setShowSortDropdown(false);
                          }}
                        >
                          Recent
                        </div>
                        <div
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-[10px]"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSortBy("Free");
                            setShowSortDropdown(false);
                          }}
                        >
                          Free
                        </div>
                        <div
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-[10px]"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSortBy("");
                            setShowSortDropdown(false);
                          }}
                        >
                          Default
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* values */}
            <div className="grid xl:grid-cols-3 gap-5 w-full min-h-screen bg-white text-black">
              {/* Desktop sidebar - hidden on small screens */}
              <div className="p-6 max-w-4xl mx-auto">
                <div className="hidden xl:flex flex-col gap-5">
                  <div
                    style={{ padding: "10px" }}
                    className="p-4 shadow-sm rounded-[20px] "
                  >
                    <DropDown
                      label="Choose Your Power Discipline"
                      options={options}
                      value={powerDiscipline}
                      onChange={setPowerDiscipline}
                      type="text"
                    />
                  </div>

                  <div
                    style={{ padding: "10px" }}
                    className="h-fit  rounded-[20px]  grid w-full shadow-sm"
                  >
                    <div className="border-b-[1px] border-gray-300">
                      <DropDown
                        label="Difficulty Level"
                        options={optionsIntensity}
                        value={selectedLevels}
                        onChange={setSelectedLevels}
                        type="checkbox"
                      />
                    </div>

                    <div className="border-b-[1px] border-gray-300">
                      <DropDown
                        label="Duration"
                        options={optionsIntensity2}
                        value={selectedDurations}
                        onChange={setSelectedDurations}
                        type="checkbox"
                      />
                    </div>

                    <div className="border-b-[1px] border-gray-300">
                      <DropDown
                        label="Price Range"
                        options={optionsIntensity3}
                        value={selectedPrice}
                        onChange={setSelectedPrice}
                        type="radio"
                      />
                    </div>

                    <div>
                      <DropDown
                        label="Rating"
                        options={optionsIntensity4}
                        value={selectedRating}
                        onChange={setSelectedRating}
                        type="radio"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Main content */}
              <div className="col-span-2">
                {sortedCourses.length === 0 ? (
                  <div className="flex items-center justify-center h-64">
                    <p className="text-[var(--gray-450)] text-lg">
                      {loading ? "loading..." : "No missions found"}
                    </p>
                  </div>
                ) : (
                  <div className="w-full sm:grid md:grid-cols-3 gap-5 ">
                    {sortedCourses.map((course, i) => (
                      <div
                        key={course._id}
                        className="h-[516.72px] w-full max-w-[340.81px] border-[var(--gray-400)] rounded-[20px] shadow-md cursor-pointer"
                      >
                        <div
                          style={{
                            backgroundImage: `url(${course.thumbnail.url})`,
                          }}
                          onClick={() => {
                            const titleSlug = createSlug(course.title);
                            console.log(
                              "Navigating to mission:",
                              course._id,
                              "with slug:",
                              titleSlug
                            );
                            router.push(`/mission/${titleSlug}`);
                          }}
                          className="h-[294.71px] w-full bg-[#2A2A2A] rounded-t-[20px] bg-cover bg-center"
                        ></div>

                        <div
                          className="flex flex-col  justify-between flex-1 h-[222.01px]  "
                          style={{ padding: "20px" }}
                        >
                          <div>
                            <div className="flex items-center justify-between w-full">
                              <p
                                style={{
                                  marginBottom: "3px",
                                  padding: "0 10px",
                                }}
                                className="w-fit h-[22.94px] border border-[var(--gray-400)] text-[var(--gray-400)] flexcenter font-[500] leading-[25px] text-[10px]  rounded-[5px]"
                              >
                                {course.category}
                              </p>
                              <p className="w-[53.75px] flexcenter h-[22.94px] bg-[var(--gray-200)] text-black font-[600] text-[8px] leading-[28px] rounded-[30px]">
                                <AiFillStar className="text-[var(--warning-strong)] w-[12.19px]  " />
                                <span>{course.averageRating}</span>
                              </p>
                            </div>
                            <p
                              onClick={() => {
                                const titleSlug = createSlug(course.title);
                                console.log(
                                  "Navigating to mission:",
                                  course._id,
                                  "with slug:",
                                  titleSlug
                                );
                                router.push(`/mission/${titleSlug}`);
                              }}
                              className="text-[var(--gray-800-ish)] ibm-plex-mono-bold font-[700] text-[20px] leading-[23px] "
                            >
                              {course.title}
                            </p>
                            <p className="text-[var(--green-strong)] font-[800] text-[15px] leading-[28px]">
                              {" "}
                              ${course.isFree ? "Free" : course.price}
                            </p>
                          </div>

                          <div className="">
                            <p className="text-[var(--gray-500)] font-[500] flex items-center gap-1 text-[10px] leading-[28px]">
                              <FaClock className="w-[12.19px] mr-1" />
                              <span>{course.estimatedDuration}</span>
                            </p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(course._id);
                              }}
                              className={`${
                                clickedButtons.has(course._id)
                                  ? " bg-[var(--mutant-color)] text-white"
                                  : "bg-[#C1C1C1] text-[#2A2A2A] "
                              } font-[700] cursor-pointer h-[42.52px] w-[138.44px] rounded-[8px] sm:text-[13px] sm:leading-[28px] transition-colors duration-200`}
                            >
                              {clickedButtons.has(course._id)
                                ? "View in Cart"
                                : "Add to cart"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* pagination button */}
                {totalPages > 1 && (
                  <div className="flex items-center gap-3 h-fit justify-center mt-6">
                    <button
                      onClick={() =>
                        currentPage > 1 && setCurrentPage((prev) => prev - 1)
                      }
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded ${
                        currentPage === 1
                          ? "text-[var(--gray-300)] cursor-not-allowed"
                          : "text-[var(--gray-450)] hover:text-[var(--mutant-color)]"
                      }`}
                    >
                      &lt;
                    </button>

                    <div className="flex gap-2">
                      {Array.from({ length: totalPages }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`sm:h-[60px] h-[20px] w-[20px] flexcenter cursor-pointer sm:w-[60px] 
                            font-[700] text-[10px] sm:text-[18px] leading-[30px] rounded-full transition-all duration-200 
                            ${
                              currentPage === i + 1
                                ? "bg-[var(--mutant-color)] text-white shadow-sm shadow-[var(--purple-glow)]"
                                : "bg-white text-[var(--gray-450)] hover:bg-[var(--gray-100)]"
                            }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() =>
                        currentPage < totalPages &&
                        setCurrentPage((prev) => prev + 1)
                      }
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded ${
                        currentPage === totalPages
                          ? "text-[var(--gray-300)] cursor-not-allowed"
                          : "text-[var(--gray-450)] hover:text-[var(--mutant-color)]"
                      }`}
                    >
                      &gt;
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
