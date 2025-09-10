"use client";
import DropDown from "@/components/Dropdown";
import { FaSearch } from "react-icons/fa";
import { FaClock } from "react-icons/fa";
import { AiFillStar } from "react-icons/ai";
import { useState, useMemo, useEffect } from "react";
import axios from "axios";

const ITEMS_PER_PAGE = 9;

export default function Mission() {
  const [clickedButtons, setClickedButtons] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const [course, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const res = await axios.get(
          "https://themutantschool-backend.onrender.com/api/mission",
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setMissions(res.data.data);
        console.log(res.data.data, "missionssssssssssssssssssss");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch missions");
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, []);

  const options = [
    { label: "Design", value: "Design" },
    { label: "Code", value: "Code" },
    { label: "Growth Hacking", value: "Growth Hacking" },
  ];

  const optionsintencity = [
    { label: "Beginner", value: "Beginner" },
    { label: "Intermediate", value: "Intermediate" },
    { label: "Expert", value: "Expert" },
  ];

  const [powerDiscipline, setPowerDiscipline] = useState("");
  const [mutationIntensity2, setMutationIntensity2] = useState([]);
  const [mutationIntensity3, setMutationIntensity3] = useState([]);
  const [mutationIntensity4, setMutationIntensity4] = useState("");
  const [mutationIntensity5, setMutationIntensity5] = useState("");

  const optionss = [
    { label: "Telepathy", value: "telepathy" },
    { label: "Telekinesis", value: "telekinesis" },
    { label: "Shape Shifting", value: "shapeshifting" },
    { label: "Super Strength", value: "superstrength" },
  ];

  const optionsIntensity = [
    { label: "Beginner", value: "Beginner" },
    { label: "Intermediate", value: "Intermediate" },
    { label: "Expert", value: "Expert" },
  ];

  const optionsIntensity2 = [
    { label: "0hr - 2hrs", value: "0hr - 2hrs" },
    { label: "3hrs - 5hrs", value: "3hrs - 5hrs" },
    { label: "5hrs - 10hrs", value: "5hrs - 10hrs" },
    { label: "11hrs - more", value: "11hrs - more" },
  ];

  const optionsIntensity3 = [
    { label: "Free", value: "Free" },
    { label: "$1 - $100", value: "$1 - $100" },
    { label: "$101 - $400", value: "$101 - $400" },
  ];

  const optionsIntensity4 = [
    { label: "3.0 < ", value: "3.0 < " },
    { label: "3.5 <", value: "3.5 <" },
    { label: "4.0 <", value: "4.0 <" },
    { label: "4.5 <", value: "4.5 <" },
  ];

  const mapDurationToRange = (estimatedDuration) => {
    if (estimatedDuration == null) return null;
    const valueString = String(estimatedDuration);
    const numberMatch = valueString.match(/(\d+(?:\.\d+)?)/);
    if (!numberMatch) return null;
    const hours = parseFloat(numberMatch[1]);
    if (Number.isNaN(hours)) return null;
    if (hours <= 2) return "0hr - 2hrs";
    if (hours <= 5) return "3hrs - 5hrs";
    if (hours <= 10) return "5hrs - 10hrs";
    return "11hrs - more";
  };

 

  // Filter and sort courses based on selected criteria
  const filteredAndSortedCourses = useMemo(() => {
    let filtered = course.filter((c) => {
      const searchBlob = `${(c.description || "").toLowerCase()} ${(
        c.title || ""
      ).toLowerCase()} ${(c.name || "").toLowerCase()} ${(
        c.category || ""
      ).toLowerCase()}`;

      const matchesSearch =
        searchTerm === "" || searchBlob.includes(searchTerm.toLowerCase());

      const matchesCategory =
        powerDiscipline === "" || c.category === powerDiscipline;

      const levelValue = (c.level || c.difficulty || "").trim();
      const matchesLevel =
        mutationIntensity2.length === 0 ||
        (levelValue && mutationIntensity2.includes(levelValue));

      const durationRange = mapDurationToRange(c.estimatedDuration);
      const matchesDuration =
        mutationIntensity3.length === 0 ||
        (durationRange && mutationIntensity3.includes(durationRange));

      const priceNumber = Number(c.price);
      const isFree = Boolean(c.isFree) || priceNumber === 0;
      const matchesPrice =
        mutationIntensity4 === "" ||
        (mutationIntensity4 === "Free" && isFree) ||
        (mutationIntensity4 === "$1 - $100" &&
          !isFree &&
          priceNumber > 0 &&
          priceNumber <= 100) ||
        (mutationIntensity4 === "$101 - $400" &&
          !isFree &&
          priceNumber > 100 &&
          priceNumber <= 400);

      const ratingNumber = Number(c.averageRating || c.rating || 0);
      const matchesRating =
        mutationIntensity5 === "" ||
        (mutationIntensity5 === "3.0 < " && ratingNumber > 3.0) ||
        (mutationIntensity5 === "3.5 <" && ratingNumber > 3.5) ||
        (mutationIntensity5 === "4.0 <" && ratingNumber > 4.0) ||
        (mutationIntensity5 === "4.5 <" && ratingNumber > 4.5);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLevel &&
        matchesDuration &&
        matchesPrice &&
        matchesRating
      );
    });

    if (sortBy === "Most Popular") {
      filtered = filtered.sort(
        (a, b) =>
          Number(b.averageRating || b.rating || 0) -
          Number(a.averageRating || a.rating || 0)
      );
    } else if (sortBy === "Recent") {
      filtered = filtered.sort((a, b) => {
        const dateA = Date.parse(a.createdAt || a.updatedAt || 0) || 0;
        const dateB = Date.parse(b.createdAt || b.updatedAt || 0) || 0;
        if (dateB !== dateA) return dateB - dateA;
        const idA = String(a._id || a.id || "");
        const idB = String(b._id || b.id || "");
        return idB.localeCompare(idA);
      });
    } else if (sortBy === "Free") {
      filtered = filtered.sort((a, b) => {
        const valA = a.isFree ? 0 : Number(a.price) || Infinity;
        const valB = b.isFree ? 0 : Number(b.price) || Infinity;
        return valA - valB;
      });
    }

    return filtered;
  }, [
    searchTerm,
    powerDiscipline,
    mutationIntensity2,
    mutationIntensity3,
    mutationIntensity4,
    mutationIntensity5,
    sortBy,
    course,
  ]);

  const handleButtonClick = (courseId) => {
    setClickedButtons((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(courseId)) {
        newSet.delete(courseId);
      } else {
        newSet.add(courseId);
      }
      return newSet;
    });
  };

  const [currentPage, setCurrentPage] = useState(1);

  const addToCart = (mission) => {
    try {
      const existing = JSON.parse(localStorage.getItem("CART_ITEMS") || "[]");
      const authorRaw = mission.author || mission.instructor || null;
      const authorName =
        typeof authorRaw === "object" && authorRaw !== null
          ? authorRaw.username ||
            (authorRaw.firstName && authorRaw.lastName
              ? `${authorRaw.firstName} ${authorRaw.lastName}`
              : authorRaw.firstName || authorRaw.lastName || authorRaw.email) ||
            "The Mutant School"
          : authorRaw || "The Mutant School";
      const item = {
        id: mission._id,
        title: mission.description || mission.title || "Mission",
        by: authorName,
        price: mission.isFree ? 0 : Number(mission.price) || 0,
        image:
          (mission && mission.thumbnail && mission.thumbnail.url) ||
          "/images/Rectangle 120.png",
      };
      const alreadyInCart = existing.some((x) => x.id === item.id);
      if (!alreadyInCart) {
        existing.push(item);
        localStorage.setItem("CART_ITEMS", JSON.stringify(existing));
        try {
          window.dispatchEvent(new CustomEvent("cart:changed"));
        } catch (e) {}
      }
    } catch (e) {}
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredAndSortedCourses]);

  const totalPages = Math.ceil(
    filteredAndSortedCourses.length / ITEMS_PER_PAGE
  );

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredAndSortedCourses.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="w-screen h-full bg-white flexcenter ">
      <div className="max-w-[1800px] w-full  ">
        {/* Herosection */}
        <div
          style={{
            backgroundImage: "url('/images/Rectangle 120.png')",
          }}
          className="h-screen relative z-20 flex items-center justify-center flex-col w-full bg-cover bg-center"
        >
          <div
            style={{ paddingTop: "10%" }}
            className="max-w-[336.97px] relative herosection-mb flexcenter flex-col gap-5 sm:max-w-[852.48px] w-full px-4"
          >
            <div className="relative z-40">
              <h2 className="text-[#E2E2E2] Xirod text-[24px] leading-[28px] xs:text-[32px] xs:leading-[36px] sm:text-[40px] sm:leading-[44px] md:text-[51px] md:leading-[57px] text-center">
                Choose Your Next
              </h2>
              <h2 className="text-[#E2E2E2] Xirod text-[24px] leading-[28px] xs:text-[32px] xs:leading-[36px] sm:text-[40px] sm:leading-[44px] md:text-[51px] md:leading-[57px] text-center">
                Mutation Mission
              </h2>
            </div>

            <p className="font-[500] text-[12px] xs:text-[14px] relative z-40 sm:text-[17px] leading-[14px] sm:leading-[24px] md:leading-[28px] text-[#CDE98D] text-center px-2">
              EVERY MISSION IS A TEST. EVERY SKILL IS A POWER WAITING TO AWAKEN
            </p>
          </div>
        </div>

        {/* main */}
        <div
          style={{ margin: "auto" }}
          className="w-full max-w-[330px] sm:max-w-[1400px] mx-auto"
        >
          {/* search btn */}
          <div
            style={{ paddingTop: "60px" }}
            className="w-full grid bg-white  gap-5 sm:gap-0 xl:grid-cols-3"
          >
            <div className=""></div>
            <div className="col-span-2 flex flex-col gap-5 xl:gap-0 sm:flex-row px-4 sm:px-6 md:px-8 xl:px-0 items-center w-full justify-between">
              <p className="font-[700]  text-[20px] xs:text-[25px] md:text-[30px] xxl:text-[37px] leading-[24px] text-black text-center xl:text-left">
                All Missions
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-2   w-full sm:w-auto">
                <div
                  style={{ padding: "0 15px" }}
                  className="border-[#C0C0C0] border text-black rounded-[38px] flex items-center h-[47.15px] w-full sm:max-w-[350px] md:max-w-[400px] lg:max-w-[446.1px]"
                >
                  <FaSearch className="text-[#CCCCCC] flex-shrink-0" />
                  <input
                    style={{ padding: "7px" }}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={`"Search Missions… Try "Growth hacking", "Figma", "Python""`}
                    className="w-full h-full outline-none placeholder-[#B6B6B6] font-[700] text-black text-[8px] xs:text-[10px] leading-[30px]"
                  />
                </div>
                <div
                  className="border-[#C0C0C0] text-[#B6B6B6] font-[500] leading-[30px] text-[10px] flexcenter border rounded-[38px] h-[47.15px] w-full sm:w-[120px] md:w-[150px] lg:w-[175.72px] relative cursor-pointer"
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                >
                  Sort by :
                  <span className="text-black"> {sortBy || "Default"}</span>
                  {showSortDropdown && (
                    <div
                      style={{ padding: "2px" }}
                      className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#C0C0C0]  rounded-[10px] shadow-lg z-50"
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
          <div
            style={{ padding: "15px" }}
            className="grid xl:grid-cols-3 gap-5 w-full min-h-screen bg-white text-black "
          >
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
                      label="Mutation Intensity (Checkbox)"
                      options={optionsIntensity}
                      value={mutationIntensity2}
                      onChange={setMutationIntensity2}
                      type="checkbox"
                    />
                  </div>

                  <div className="border-b-[1px] border-gray-300">
                    <DropDown
                      label="Mutation Intensity (Checkbox Multi)"
                      options={optionsIntensity2}
                      value={mutationIntensity3}
                      onChange={setMutationIntensity3}
                      type="checkbox"
                    />
                  </div>

                  <div className="border-b-[1px] border-gray-300">
                    <DropDown
                      label="Mutation Intensity (Radio)"
                      options={optionsIntensity3}
                      value={mutationIntensity4}
                      onChange={setMutationIntensity4}
                      type="radio"
                    />
                  </div>

                  <div>
                    <DropDown
                      label="Mutation Intensity (Radio 2)"
                      options={optionsIntensity4}
                      value={mutationIntensity5}
                      onChange={setMutationIntensity5}
                      type="radio"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="col-span-2">
              {currentItems.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                  <p className="text-[#6D6D6D] text-lg">
                    {loading ? "loading..." : "No missions found"}
                  </p>
                </div>
              ) : (
                <div className="w-full flex items-center flex-col  sm:grid md:grid-cols-3  gap-5 ">
                  {currentItems.map((course, i) => (
                    <div
                      key={course._id}
                      className="h-[516.72px] w-full max-w-[340.81px] border-[#A6A6A6] rounded-[20px] shadow-md "
                    >
                      <div
                        style={{
                          backgroundImage: `url(${course.thumbnail.url})`,
                        }}
                        className="h-[294.71px] w-full bg-pink-100 rounded-t-[20px] bg-cover bg-center"
                      ></div>

                      <div
                        className="flex flex-col  justify-between flex-1 h-[222.01px]  "
                        style={{ padding: "20px" }}
                      >
                        <div>
                          <div className="flex items-center justify-between w-full">
                            <p
                              style={{ marginBottom: "3px", padding: "0 10px" }}
                              className="w-fit h-[22.94px] border border-[#A6A6A6] text-[#A6A6A6] flexcenter font-[500] leading-[25px] text-[10px]  rounded-[5px]"
                            >
                              {course.category}
                            </p>
                            <p className="w-[53.75px] flexcenter h-[22.94px] bg-[#D3D3D3] text-black font-[600] text-[8px] leading-[28px] rounded-[30px]">
                              <AiFillStar className="text-[#FFA100] w-[12.19px]  " />
                              <span>{course.averageRating}</span>
                            </p>
                          </div>
                          <p className="text-[#292929] font-[700] text-[20px] leading-[23px] ">
                            {course.description}
                          </p>
                          <p className="text-[#288C4F] font-[800] text-[15px] leading-[28px]">
                            {" "}
                            ${course.isFree ? "Free" : course.price}
                          </p>
                        </div>

                        <div className="">
                          <p className="text-[#5C5C5C] font-[500] flex items-center gap-1 text-[10px] leading-[28px]">
                            <FaClock className="w-[12.19px] mr-1" />
                            <span>{course.estimatedDuration}</span>
                          </p>
                          <button
                            onClick={() => {
                              handleButtonClick(course._id);
                              addToCart(course);
                            }}
                            className={`${
                              clickedButtons.has(course._id)
                                ? "bg-[#7343B3] text-white"
                                : "bg-[#C1C1C1] text-black"
                            } font-[700] cursor-pointer h-[42.52px] w-[138.44px] rounded-[8px] text-[13px] leading-[28px] transition-colors duration-200`}
                          >
                            Enter Mission
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* pagination button */}
              {totalPages > 1 && (
                <div className="flex items-center gap-3 h-fit justify-center">
                  {/* Previous button */}
                  <p>
                    <span
                      onClick={
                        currentPage > 1
                          ? () => setCurrentPage(currentPage - 1)
                          : undefined
                      }
                      className={`text-[20.5px] ${
                        currentPage > 1
                          ? "text-[#6D6D6D] cursor-pointer hover:text-[#7343B3]"
                          : "text-[#CCCCCC] cursor-not-allowed"
                      }`}
                    >
                      {`<`}
                    </span>
                  </p>

                  {/* Page numbers */}
                  <div className="flex justify-center mt-6 gap-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        style={{ margin: "20px 0" }}
                        key={i}
                        className={`sm:h-[60px] h-[20px] w-[20px] flexcenter cursor-pointer sm:w-[60px] h-[20px] w-[20px] flexcenter font-[700] text-[10px] sm:text-[18px] leading-[30px] rounded-full transition-all duration-200 ${
                          currentPage === i + 1
                            ? "bg-[#7343B3] text-white shadow-sm shadow-[#7C38FF]"
                            : "bg-white text-[#6D6D6D] hover:bg-[#F5F5F5]"
                        }`}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  {/* Next button */}
                  <p>
                    <span
                      onClick={
                        currentPage < totalPages
                          ? () => setCurrentPage(currentPage + 1)
                          : undefined
                      }
                      className={`text-[20.5px] ${
                        currentPage < totalPages
                          ? "text-[#6D6D6D] cursor-pointer hover:text-[#7343B3]"
                          : "text-[#CCCCCC] cursor-not-allowed"
                      }`}
                    >
                      {`>`}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
