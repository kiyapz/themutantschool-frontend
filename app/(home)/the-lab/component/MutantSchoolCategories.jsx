"use client";
import Image from "next/image";
import React, { useState, useMemo } from "react";
import { BASE_URL } from "@/lib/api";
import { useRouter } from "next/navigation";

const Categories = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const itemsPerPage = 3;
  const router = useRouter();

  // Fetch missions once (client-side)
  React.useEffect(() => {
    const fetchAllMissions = async () => {
      try {
        setLoading(true);
        const PER_PAGE = 50;

        const firstRes = await fetch(`${BASE_URL}/mission?page=1&limit=${PER_PAGE}`, {
          headers: { "Content-Type": "application/json" },
        });
        const firstJson = await firstRes.json();
        if (!firstRes.ok) throw new Error(firstJson?.message || "Failed to fetch missions");

        const missionsAccumulator = Array.isArray(firstJson?.data) ? [...firstJson.data] : [];
        const totalPages = Number(firstJson?.totalPages || 1);

        if (totalPages > 1) {
          const pageRequests = [];
          for (let p = 2; p <= totalPages; p += 1) {
            pageRequests.push(
              fetch(`${BASE_URL}/mission?page=${p}&limit=${PER_PAGE}`, {
                headers: { "Content-Type": "application/json" },
              })
                .then((r) => r.json())
                .catch(() => ({}))
            );
          }
          const pages = await Promise.all(pageRequests);
          pages.forEach((j) => {
            if (Array.isArray(j?.data)) missionsAccumulator.push(...j.data);
          });
        }

        setMissions(missionsAccumulator);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllMissions();
  }, []);

  // Map categories to soft background/text colors
  const colorPalette = {
    design: { bg: "bg-orange-100", text: "text-orange-800" },
    code: { bg: "bg-purple-200", text: "text-purple-800" },
    "growth hacking": { bg: "bg-blue-100", text: "text-blue-800" },
    marketing: { bg: "bg-green-100", text: "text-green-800" },
    technology: { bg: "bg-indigo-100", text: "text-indigo-800" },
    education: { bg: "bg-amber-100", text: "text-amber-800" },
    health: { bg: "bg-rose-100", text: "text-rose-800" },
    environment: { bg: "bg-emerald-100", text: "text-emerald-800" },
    social: { bg: "bg-cyan-100", text: "text-cyan-800" },
    programming: { bg: "bg-purple-100", text: "text-purple-800" },
  };

  // Build categories from missions
  const allCategories = useMemo(() => {
    const unique = new Map();

    // Seed baseline categories so they always show
    const baseCategoryTitles = [
      "Programming",
      "Technology",
      "Education",
      "Health",
      "Environment",
      "Social",
    ];
    for (const raw of baseCategoryTitles) {
      const key = raw.toLowerCase();
      if (!unique.has(key)) {
        const colors = colorPalette[key] || { bg: "bg-slate-100", text: "text-slate-800" };
        unique.set(key, {
          title: raw,
          image: "/api/placeholder/300/200",
          bgColor: colors.bg,
          textColor: colors.text,
        });
      }
    }
    for (const m of missions) {
      const raw = (m.category || "").trim();
      if (!raw) continue;
      const key = raw.toLowerCase();
      if (!unique.has(key)) {
        const colors = colorPalette[key] || { bg: "bg-slate-100", text: "text-slate-800" };
        unique.set(key, {
          title: raw,
          image: "/api/placeholder/300/200",
          bgColor: colors.bg,
          textColor: colors.text,
        });
      }
    }
    return Array.from(unique.values());
  }, [missions]);

  // Filter categories based on search term
  const filteredCategories = useMemo(() => {
    if (!searchTerm) return allCategories;
    return allCategories.filter((category) =>
      category.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allCategories]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCategories = filteredCategories.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePrevious = () => {
    handlePageChange(currentPage - 1);
  };

  const handleNext = () => {
    handlePageChange(currentPage + 1);
  };

  return (
    <div className="w-full bg-white" style={{ padding: "40px 60px" }}>
      {/* Header */}
      <div
        className="flex justify-between items-center flex-col sm:flex-row gap-4"
        style={{ marginBottom: "32px" }}
      >
        <h1 className=" font-[700] text-black text-[43px]">Categories</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              style={{ padding: "0 15px 0 40px" }}
              type="text"
              placeholder="Scan for power categories…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-[#C0C0C0] outline-none rounded-[38px] bg-[#F9F9F9] text-black placeholder-[#B6B6B6] font-[700] text-[10px] leading-[30px] w-[351.9072265625px]"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#B6B6B6]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Search Results Info */}
      {searchTerm && (
        <div className="mb-4">
          <p className="text-gray-600 text-sm">
            {filteredCategories.length} result
            {filteredCategories.length !== 1 ? "s" : ""} found for "{searchTerm}
            "
          </p>
        </div>
      )}

      {/* Categories Grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        style={{ marginBottom: "40px" }}
      >
        {currentCategories.length > 0 ? (
          currentCategories.map((category, index) => (
            <div
              key={index}
              onClick={() => router.push(`/missions?category=${encodeURIComponent(category.title)}`)}
              className={`${category.bgColor} flex rounded-2xl overflow-hidden cursor-pointer transition-transform hover:scale-105 hover:shadow-lg h-[529px] w-full`}
              style={{ padding: "24px" }}
            >
              {/* Category Title */}
              <div className="flex justify-between items-center self-end w-full">
                <h3
                  className={`text-[50px] font-[700] leading-[50px] ${category.textColor} max-w-[250px] line-clamp-2`}
                >
                  {category.title}
                </h3>
                <div>
                  <Image
                    src={"/images/Vector (23).png"}
                    width={20}
                    height={20}
                    alt="category"
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">
              No categories found matching your search.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{ margin: "0 auto" }}
          className="flex justify-center items-center space-x-2 w-full max-w-[424px] mx-auto"
        >
          {/* Previous Button */}
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              currentPage === 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            }`}
          >
            <svg
              className="w-4 h-4 rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Page Numbers */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = index + 1;
            } else if (currentPage <= 3) {
              pageNum = index + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + index;
            } else {
              pageNum = currentPage - 2 + index;
            }

            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  currentPage === pageNum
                    ? "bg-purple-600 text-white"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              currentPage === totalPages
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      )}

      
    </div>
  );
};

export default Categories;
