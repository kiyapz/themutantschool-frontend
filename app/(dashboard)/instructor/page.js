"use client";
import Image from "next/image";
import { FaArrowUp } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useState } from "react";

import SingleValueChart from "./_components/InstructorgraphSingleValueChart";
import Link from "next/link";
import { useContext, useEffect } from "react";
import { InstructorContext } from "./_components/context/InstructorContex";
import profilebase from "./profile/_components/profilebase";



const data = [
  {
    id: 1,
    sub: "Active Missions",
    qunatity: 12,
  },
  {
    id: 2,
    sub: "Total Recruits",
    qunatity: 248,
  },
  {
    id: 3,
    sub: "Total Revenue",
    qunatity: "$4,285",
  },
  {
    id: 4,
    sub: "Ratings",
    qunatity: 4.8,
  },
];

const studentcourse = [
  {
    id: 1,
    name: "Kabir Usman",
    purpose: " left a comment",
    time: "2 hours ago",
  },
  {
    id: 2,
    name: "Kabir Usman",
    purpose: " left a comment",
    time: "2 hours ago",
  },
  {
    id: 3,
    name: "Kabir Usman",
    purpose: " left a comment",
    time: "2 hours ago",
  },
  {
    id: 4,
    name: "Kabir Usman",
    purpose: " left a comment",
    time: "2 hours ago",
  },
  {
    id: 5,
    name: "Kabir Usman",
    purpose: " left a comment",
    time: "2 hours ago",
  },
  {
    id: 6,
    name: "Kabir Usman",
    purpose: " left a comment",
    time: "2 hours ago",
  },
  {
    id: 7,
    name: "Kabir Usman",
    purpose: " left a comment",
    time: "2 hours ago",
  },
];

const Mission = [
  {
    id: 1,
    purpose: "Design Principles: Beginners",
    type: "course",
    recruits: 500,
    revenue: "$2500",
    rating: 4.5,
  },
  {
    id: 2,
    purpose: "Design Principles: Beginners",
    type: "",
    recruits: 500,
    revenue: "$2500",
    rating: 5,
  },
  {
    id: 3,
    purpose: "Design Principles: Beginners",
    type: "course",
    recruits: 500,
    revenue: "$2500",
    rating: 3.5,
  },
  {
    id: 4,
    purpose: "Design Principles: Beginners",
    type: "",
    recruits: 500,
    revenue: "$2500",
    rating: 1.5,
  },
];

const studetcourse = [
  {
    id: 1,
    purpose: "Design Principles: Beginners",
    type: "course",
    recruits: 500,
    revenue: "$2500",
    rating: 4.5,
    progress: 50,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcST1X_KXRZTcaSF3D_INaAnaZY0OyJ70jbYyw&s",
  },
  {
    id: 2,
    purpose: "Design Principles: Beginners",
    type: "",
    recruits: 500,
    revenue: "$2500",
    rating: 5,
    progress: 100,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQy26vJHT36wsJbtLIYECQYK3ypBjoguRpMQA&s",
  },
  {
    id: 3,
    purpose: "Design Principles: Beginners",
    type: "course",
    recruits: 500,
    revenue: "$2500",
    rating: 3.5,
    progress: 80,
    image:
      "https://theadminbar.com/wp-content/uploads/2025/04/What-you-need-to-know-about-Figma.webp",
  },
  {
    id: 4,
    purpose: "Design Principles: Beginners",
    type: "",
    recruits: 500,
    revenue: "$2500",
    rating: 1.5,
    progress: 20,
    image:
      "https://www.psdly.to/wp-content/uploads/2025/04/Udemy-Figma-Crash-Course-Learn-UI-Design-Step-by-Step.jpg",
  },
];

export default function InstructorDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  const { setUserProfile, userProfile, setUserUpdatedValue } =
    useContext(InstructorContext);

  
  async function checkAuthAndFetchProfile() {
    try {
      setIsLoading(true);

      const storedUser = localStorage.getItem("USER");
      const accessToken = localStorage.getItem("login-accessToken");

      if (!storedUser || !accessToken) {
        console.log("No authentication found, redirecting to login");
        router.push("/login");
        return;
      }

      let parsedUser;
      try {
        parsedUser = JSON.parse(storedUser);
      } catch (parseError) {
        console.log("Invalid user data in localStorage, redirecting to login");
        localStorage.removeItem("USER");
        localStorage.removeItem("login-accessToken");
        router.push("/login");
        return;
      }

      if (!parsedUser._id) {
        console.log("Invalid user data structure, redirecting to login");
        localStorage.removeItem("USER");
        localStorage.removeItem("login-accessToken");
        router.push("/login");
        return;
      }

      const response = await profilebase.get(
        `/user-profile/${parsedUser._id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("User profile fetched successfully:", response.data.data);
      setUserProfile(response.data.data);
      setAuthChecked(true);
    } catch (error) {
      console.error("Failed to load user profile:", error);

      // If it's a 401 or 403 error, redirect to login
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log("Authentication failed, redirecting to login");
        localStorage.removeItem("USER");
        localStorage.removeItem("login-accessToken");
        router.push("/login");
        return;
      }

      // For other errors, still set auth as checked but show error
      setAuthChecked(true);
    } finally {
      setIsLoading(false);
    }
  }

  // Update user values when profile is loaded
  useEffect(() => {
    if (userProfile) {
      setUserUpdatedValue({
        firstName: userProfile.firstName || "",
        lastName: userProfile.lastName || "",
        username: userProfile.username || "",
        email: userProfile.email || "",
        bio: userProfile.profile?.bio || "",
        facebook: userProfile.profile?.socialLinks?.facebook || "",
        linkedin: userProfile.profile?.socialLinks?.linkedin || "",
        website: userProfile.profile?.socialLinks?.website || "",
        Twitter: userProfile.profile?.socialLinks?.twitter || "",
        url: userProfile.profile?.avatar?.url || "",
        publicId: userProfile.profile?.avatar?.publicId || "", // Fixed: was mapped to youtube
        instagram: userProfile.profile?.socialLinks?.instagram || "",
        Headline: userProfile.profile?.headline || "", // Fixed: was userProfile.Headline
        ExpertiseTags: userProfile.ExpertiseTags || [],
        gender: userProfile.gender || "",
        Phone: userProfile.phoneNumber || "",
        role: userProfile.role || "",
        nationality: userProfile.nationality || "",
        preferredLanguage: userProfile.preferredLanguage || "",
        dateOfBirth: userProfile.dateOfBirth || "",
      });
    }
  }, [userProfile, setUserUpdatedValue]);

  // Check auth and fetch profile on component mount
  useEffect(() => {
    checkAuthAndFetchProfile();
  }, []);

  // Show loading state while checking authentication
  if (isLoading || !authChecked) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#604196] mx-auto mb-4"></div>
          <p className="text-[var(--text)]">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-10 w-full ">
      <div className="h-fit w-full">
        <div className="hidden sm:flex h-fit justify-between w-full">
          <div>
            <p className="text-[var(--background)] font-[600] leading-[40px] text-[42px] ">
              Dashboard
            </p>
            <p className="text-[var(--text)] text-[12px] xl:text-[15px] leading-[40px] ">
              Welcome to your management dashboard
              
            </p>
          </div>
          <div>
            <Link href="/instructor/myMissions/createnewmission">
              <button className="bg-[#604196] flex items-center justify-center gap-1 font-[700] text-[15px] leading-[30px] h-[57.02px] rounded-[10px] w-[216.75px] ">
                <span>
                  <Image
                    src={"/images/instructordasbord/Vector (13).png"}
                    alt="save icon"
                    width={13.64}
                    height={17.73}
                  />
                </span>
                Launch New Mission
              </button>
            </Link>
          </div>
        </div>

        <div className="h-fit grid gap-5 xl:grid-cols-2">
          <div className="grid grid-cols-2 gap-3 h-full">
            {data.map((items) => (
              <div
                key={items.id}
                className="py px bg-[#0F0F0F] gap-5 flex flex-col justify-center rounded-[17px]"
              >
                <p className="text-[14px] leading-[150%] sm:text-[20px] text-[#C7C7C7] sm:leading-[40px] ">
                  {items.sub}
                </p>
                <p className="font-[600] text-[41px] leaning-[150%] sm:text-[66px] text-[var(--background)] sm:leading-[40px] ">
                  {items.qunatity}
                </p>
              </div>
            ))}
          </div>
          <div className="hidden sm:flex flex-col gap-3 ">
            <div className="w-full py bg-[#0F0F0F] rounded-[16px] flexcenter h-[288px]">
              <SingleValueChart />
            </div>
            <div className="w-full flex items-center justify-between ">
              <div>
                <div className="relative py px bg-[#0F0F0F] gap-5 flex flex-col justify-between rounded-[17px]">
                  <p className="h-[30px] absolute top-[20px] right-[-50px] w-[56px] bg-[#2C2C2C] rounded-[6px] text-[#66CB9F] font-[700] text-[12px] leading-[16px] flexcenter ">
                    +12%
                  </p>
                  <p className="font-[600] text-[41px] leaning-[150%] sm:text-[66px] text-[var(--background)] sm:leading-[40px] ">
                    25.500
                  </p>
                  <p className="text-[14px] leading-[150%] sm:text-[20px] text-[#C7C7C7] sm:leading-[40px] ">
                    Course Engagement
                  </p>
                </div>
              </div>
              <div className="flexcenter px py">
                <div className="h-[46px] rounded-[6px] flexcenter bg-[#4C6FFF] w-[46px] ">
                  <FaArrowUp size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t-[1px] border-[#4B4B4B]"></div>

      <div className="h-fit gap-5 w-full grid xl:grid-cols-5">
        <div
          style={{ padding: "10px" }}
          className="xl:col-span-2 px py bg-[#0F0F0F] rounded-[20px] w-full h-full"
        >
          <div
            style={{ marginBottom: "25px" }}
            className="h-[40px] w-full flex items-center justify-between "
          >
            <p className="font-[700] text-[20px] leading-[40px] text-[var(--background)] ">
              Recent Activities
            </p>
            <p className="text-[#208045] font-[500] text-[15px] leading-[40px] ">
              View All
            </p>
          </div>

          <div className="w-full h-[450px] flex-1 flex flex-col gap-10 overflow-auto scrollbar-hide">
            {studentcourse.slice(0, 4).map((el, i) => (
              <div
                key={el.id}
                className="h-[112px] flex items-center gap-5 w-full rounded-[15px] bg-[#0F0F0F] "
              >
                <div className="h-[63px] w-[63px] rounded-full bg-pink-100 "></div>
                <div>
                  <p className="font-[500] text-[18px] leading-[40px] ">
                    {el.name}
                    <span className="font-[400] text-[var(--text)] ">
                      {el.purpose}
                    </span>
                  </p>
                  <p className="text-[#774A82] text-[15px] leading-[40px] font-[500] ">
                    {el.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="xl:col-span-3 h-fit bg-[#0F0F0F] rounded-[20px] ">
          <div
            style={{ marginBottom: "25px" }}
            className="xl:col-span-2 px py w-full h-fit"
          >
            <div className="h-[40px] w-full flex items-center justify-between ">
              <p className="font-[700] text-[20px] leading-[40px] text-[var(--background)] ">
                Top Performing Missions
              </p>
              <p className="text-[#208045] font-[500] text-[15px] leading-[40px] ">
                View All
              </p>
            </div>

            <div className="w-full h-[450px] flex-1 flex flex-col gap-1 overflow-auto scrollbar-hide">
              <div className="grid grid-cols-5">
                <div className="col-span-2 text-[#7C7C7C] font-[600] text-[11px] sm:text-[13px] leading-[40px] ">
                  Mission
                </div>
                <div className="col-span-1 text-[#7C7C7C] font-[600] text-[11px] sm:text-[13px] leading-[40px] ">
                  Recruits
                </div>
                <div className="col-span-1 text-[#7C7C7C] font-[600] text-[11px] sm:text-[13px] leading-[40px] ">
                  Revenue
                </div>
                <div className="col-span-1 text-[#7C7C7C] font-[600] text-[11px] sm:text-[13px] leading-[40px] ">
                  Rating
                </div>
              </div>

              <div className="flex flex-col gap-5">
                {Mission.map((el, i) => (
                  <div
                    key={el.id}
                    className="border-t-[1px] h-fit border-[#3C3C3C]"
                  >
                    <div className="grid py h-fit rounded-[15px] bg-[#0F0F0F] grid-cols-5">
                      <div className="col-span-2 ">
                        <div className="flex items-center gap-2">
                          <div className="h-[45.59px] sm:h-[62px] w-[45.59px] sm:w-[62px] bg-pink-100 rounded-[10px] "></div>
                          <div>
                            <p className="font-[700] text-[12px] leading-[20px] sm:text-[16px] sm:leadig-[20px] ">
                              {el.purpose}
                            </p>
                            <p className="font-[700] text-[12px] leading-[20px] sm:text-[16px] sm:leadig-[20px] ">
                              {el.type}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-1 self-center text-[#7C7C7C] font-[600] text-[11px] sm:text-[13px] leading-[40px] ">
                        {el.recruits}
                      </div>
                      <div className="col-span-1 self-center text-[#7C7C7C] font-[600] text-[11px] sm:text-[13px] leading-[40px] ">
                        {el.revenue}
                      </div>
                      <div className="col-span-1 self-center w-fit ">
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                              key={star}
                              size={8}
                              color={star <= el.rating ? "#EFDB3F" : "#E5E7EB"}
                            />
                          ))}
                        </div>
                        <p className="text-[#7C7C7C] text-center font-[600] text-[13px] leading-[40px] ">
                          {el.rating}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{ marginBottom: "20px" }}
        className="h-fit w-full flex flex-col gap-3 "
      >
        <div
          style={{ marginBottom: "25px" }}
          className="h-[40px] w-full flex items-center justify-between "
        >
          <p className="font-[700] text-[20px] leading-[40px] text-[var(--background)] ">
            Active Missions
          </p>
          <p className="text-[#208045] font-[500] text-[15px] leading-[40px] ">
            View All
          </p>
        </div>

        <div className="w-full flexcenter h-fit">
          <div className="flex scrollbar-hide py w-[350px] sm:w-[500px] xl:w-[1000px] overflow-auto gap-4 pb-2">
            {studetcourse.slice(0, 4).map((el) => (
              <div
                key={el.id}
                className="min-w-[300px] flex flex-col sm:min-w-[410.14px] h-[447.91px] bg-[#1C1124] rounded-[20px] p-4 shrink-0"
              >
                <div
                  style={{ backgroundImage: `url(${el.image})` }}
                  className="h-[173.34px] bg-cover bg-center rounded-t-[20px] w-full "
                ></div>
                <div className="px w-full flex-1 flex flex-col justify-between py">
                  <div className="flex flex-col gap-3">
                    <div className="w-full flex items-center justify-between">
                      <button className="bg-[#393D4E] rounded-[5px] px text-[#ABABAB] font-[500] text-[13px] leading-[25px] ">
                        Design
                      </button>

                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            size={10}
                            color={star <= el.rating ? "#EFDB3F" : "#E5E7EB"}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[#E8EDF6] font-[600] text-[15px] sm:text-[27px] leading-[35px] ">
                        {el.purpose}:
                      </p>
                      <p className="text-[#E8EDF6] font-[600] text-[27px] leading-[35px] ">
                        {el.type}
                      </p>
                    </div>
                  </div>

                  <div className="w-full self-end ">
                    <div className="w-full flex items-center justify-between">
                      <p className="text-[#767E8F] font-[400] text-[10px] leading-[20px] ">
                        Recruit Progress
                      </p>
                      <p className="text-sm text-right mt-1 text-gray-800">
                        {el.progress}%
                      </p>
                    </div>

                    <div>
                      <div className="w-full max-w-md">
                        <div className="w-full bg-[#000000] rounded-full h-[8px] overflow-hidden">
                          <div
                            className="h-full bg-[#4F3457] transition-all duration-200"
                            style={{ width: `${el.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center w-full justify-between">
                      <div>
                        <p>
                          <span>24 </span>Recruits
                        </p>
                      </div>
                      <p>{`>`}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
