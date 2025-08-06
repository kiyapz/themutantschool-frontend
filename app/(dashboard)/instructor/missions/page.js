"use client";
import { FiClock, FiChevronDown } from "react-icons/fi";
import { MdMenuBook } from "react-icons/md";
import { FaTag, FaMoneyBillWave, FaStar } from "react-icons/fa";
import { useState, useMemo, useEffect, useContext } from "react";
import Sidebuttons from "./_components/Sidebuttons";
import profilebase from "../profile/_components/profilebase";
import Link from "next/link";
import { InstructorContext } from "../_components/context/InstructorContex";

export default function FilterableCoursesDashboard() {
  // const [courses, setMission] = useState([]);
    const { courses, setMission } = useContext(InstructorContext);

  useEffect(() => {
    console.log("use effect for fetching missions");

    const storedUser = localStorage.getItem("USER");
    const parsedUser = JSON.parse(storedUser);
    const id = parsedUser._id;

    async function getAllMission() {
      try {
        const response = await profilebase.get(`instructor/report/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "login-accessToken"
            )}`,
          },
        });

        if (response.status === 401) {
          console.log("Unauthorized access. Please log in again.");

          const refreshToken = localStorage.getItem("login-refreshToken");
          // make a reques to get new token
          const getToken = await profilebase.post(
            "auth/refresh-token",
            { refreshToken },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem(
                  "login-accessToken"
                )}`,
              },
            }
          );

          if (getToken.status === 200) {
            localStorage.setItem(
              "login-accessToken",
              getToken.data.accessToken
            );
            console.log("Access token refreshed successfully.");

            return getAllMission();
          }
        }

        console.log("fetched mission response", response.data.missions);
        setMission(response.data.missions);
      } catch (error) {
        console.log("Error fetching missions:", error);
      }
    }
    getAllMission();
  }, [setMission]);

  const [filters, setFilters] = useState({
    duration: null,
    category: null,
    price: null,
    level: null,
    sortBy: "popularity",
  });

  
  const filterOptions = {
    duration: [
      { label: "24 hours", value: "24 hours" },
      { label: "12 hours", value: "12 hours" },
      { label: "6 hours", value: "6 hours" },
    ],
    category: [
      { label: "Programming", value: "Programming" },
      { label: "Design", value: "Design" },
      { label: "Education", value: "Education" },
    ],
    price: [
      { label: "Free", value: "free" },
      { label: "Paid", value: "paid" },
    ],
    level: [
      { label: "Beginner", value: "Beginner" },
      { label: "Intermediate", value: "Intermediate" },
      { label: "Advanced", value: "Advanced" },
      { label: "Expert", value: "Expert" },
    ],
    sortBy: [
      { label: "Title", value: "title" },
      { label: "Rating", value: "rating" },
      { label: "Price", value: "price" },
      { label: "Created Date", value: "createdAt" },
    ],
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  
  const filteredCourses = useMemo(() => {
    let filtered = courses.filter((course) => {
      return (
        (!filters.duration || course.estimatedDuration === filters.duration) &&
        (!filters.category || course.category === filters.category) &&
        (!filters.price ||
          (filters.price === "free" && course.isFree) ||
          (filters.price === "paid" && !course.isFree)) &&
        (!filters.level || course.skillLevel === filters.level)
      );
    });

  
    switch (filters.sortBy) {
      case "rating":
        filtered.sort(
          (a, b) => (b.averageRating || 0) - (a.averageRating || 0)
        );
        break;
      case "price":
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "createdAt":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default: // title
        filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    return filtered;
  }, [courses, filters]);

  const stats = useMemo(() => {
    const total = courses.length;
    const published = courses.filter((c) => c.isPublished === true).length;
    const draft = courses.filter((c) => c.isPublished === false).length;

    return { total, published, draft };
  }, [courses]);

  return (
    <div className="flex flex-col h-full gap-10 w-full bg-black text-white min-h-screen p-6">
      {/* Header */}
      <div className="h-fit w-full flex flex-col gap-5 sm:gap-10">
        <div className="flex flex-col sm:flex-row h-fit justify-between w-full">
          <div>
            <p
              style={{ marginTop: "10px " }}
              className="text-purple-400 font-[600] sm:leading-[40px] leading-[150%] text-[17px] sm:text-[42px]"
            >
              My Missions
            </p>
            <p className="text-gray-400 text-[13px] xl:text-[15px] leading-[40px]">
              Here you see all your uploaded courses ({filteredCourses.length}{" "}
              of {courses.length})
            </p>
          </div>
          <div className="hidden sm:block">
            <Link
              className="hidden sm:block"
              href="/instructor/myMissions/createnewmission"
            >
              <button className="bg-[#604196] hidden sm:block flex items-center cursor-pointer justify-center gap-1 font-[700] text-[15px] leading-[30px] h-[57.02px] rounded-[10px] w-[216.75px] hover:bg-[#7052a8] transition-colors">
                Launch New Mission
              </button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 sm:flex-col sm:gap-5 xl:gap-0 xl:flex-row h-fit sm:justify-between w-full">
          <div className=" sm:grid grid-cols-4 xl:flex items-center gap-3">
            <Sidebuttons
              icons={<FiClock />}
              text="Duration"
              flex=" hidden sm:flex"
              width="sm:w-full xl:w-fit"
              items={filterOptions.duration}
              onSelect={(value) => handleFilterChange("duration", value)}
              selectedValue={filters.duration}
            />
            <Sidebuttons
              icons={<MdMenuBook />}
              text="Category"
              flex=" hidden sm:flex"
              width="sm:w-full"
              items={filterOptions.category}
              onSelect={(value) => handleFilterChange("category", value)}
              selectedValue={filters.category}
            />
            <Sidebuttons
              icons={<FaTag />}
              text="Price"
              flex=" hidden sm:flex"
              width="sm:w-full xl:w-fit"
              items={filterOptions.price}
              onSelect={(value) => handleFilterChange("price", value)}
              selectedValue={filters.price}
            />
            <Sidebuttons
              icons={<FaMoneyBillWave />}
              text="Level"
              width="sm:w-full xl:w-fit"
              items={filterOptions.level}
              onSelect={(value) => handleFilterChange("level", value)}
              selectedValue={filters.level}
            />
          </div>
          <div className="sm:grid sm:w-full xl:block xl:w-fit">
            <Sidebuttons
              icons={<FiClock />}
              text="Sort By"
              width="sm:w-full xl:w-fit"
              items={filterOptions.sortBy}
              onSelect={(value) => handleFilterChange("sortBy", value)}
              selectedValue={filters.sortBy}
            />
          </div>
        </div>

       
      </div>

      {/* Course Grid */}
      <div className="w-full h-fit flexcenter p-4">
        <div className="grid gap-5 sm:grid-cols-2 w-full xl:grid-cols-3">
          {filteredCourses.map((el) => (
            <Link href={`/instructor/myMissions/${el._id}`} key={el._id}>
              <div
                key={el._id}
                className="max-w-[380.5px] w-full flex flex-col sm:max-w-[410.14px] h-[447.91px] bg-[#1C1124] rounded-[20px] p-4 shrink-0"
              >
                <div
                  style={{ backgroundImage: `url(${el.thumbnail.url})` }}
                  className="h-[173.34px] bg-cover bg-center rounded-t-[20px] w-full "
                ></div>
                <div className="px w-full flex-1 flex flex-col justify-between py">
                  <div className="flex flex-col gap-3">
                    <div className="w-full flex items-center justify-between">
                      <button className="bg-[#393D4E] rounded-[5px] px text-[#ABABAB] font-[500] text-[13px] leading-[25px] ">
                        {el.category}
                      </button>

                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            size={10}
                            color={
                              star <= el.averageRating ? "#EFDB3F" : "#E5E7EB"
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[#E8EDF6] font-[600] text-[15px] sm:text-[27px] leading-[35px] ">
                        {el.title} :
                      </p>
                      <p className="text-[#E8EDF6] font-[600] text-[15px] max-w-[80%] ">
                        {el.shortDescription}
                      </p>
                      <p className="text-[#ABABAB] text-[12px] mt-1">
                        {el.estimatedDuration} • {el.skillLevel} •{" "}
                        {el.isFree ? "Free" : `$${el.price}`}
                      </p>
                    </div>
                  </div>

                  <div className="w-full self-end ">
                    <div className="w-full flex items-center justify-between">
                      <p className="text-[#767E8F] font-[400] text-[10px] leading-[20px] ">
                        Recruit Progress
                      </p>
                      <p className="text-[10px] text-right mt-1 text-[#767E8F]">
                        {el.isPublished ? "100%" : "50%"}
                      </p>
                    </div>

                    <div>
                      <div className="w-full max-w-md">
                        <div className="w-full bg-[#000000] rounded-full h-[8px] overflow-hidden">
                          <div
                            className="h-full bg-[#4F3457] transition-all duration-200"
                            style={{ width: el.isPublished ? "100%" : "50%" }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center w-full justify-between">
                      <div>
                        <p>
                          <span>{el.reviews?.length || 0}</span>Recruits
                        </p>
                      </div>
                      <p>{`>`}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            No courses found matching your filters.
          </p>
          <button
            style={{ padding: "10px 20px" }}
            onClick={() =>
              setFilters({
                duration: null,
                category: null,
                price: null,
                level: null,
                sortBy: "title",
              })
            }
            className="mt-4 bg-[#604196] px-6 py-2 rounded-lg hover:bg-[#7052a8] transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
