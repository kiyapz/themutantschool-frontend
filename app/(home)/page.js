"use client";
import { Clock, Star, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "@/components/mutantcart/CartContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setCartItems } = useCart();
  const [clickedButtons, setClickedButtons] = useState(new Set());
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const res = await axios.get(
          "https://themutantschool-backend.onrender.com/api/mission"
        );
        setMissions(res.data.data.slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch missions:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchCartItems = async () => {
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
        if (res.data && res.data.data) {
          const cartMissionIds = new Set(
            (res.data.cart?.missions || res.data.data || []).map((entry) => {
              return entry?.mission?._id || entry?.missionId || entry?._id;
            })
          );
          setClickedButtons(cartMissionIds);
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
        console.error("Failed to fetch cart items on home page:", err);
      }
    };

    fetchMissions();
    fetchCartItems();
  }, [setCartItems]);

  const handleAddToCart = async (missionId) => {
    const token = localStorage.getItem("login-accessToken");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    if (clickedButtons.has(missionId)) {
      router.push("/mutantcart");
      return;
    }

    try {
      await axios.post(
        `https://themutantschool-backend.onrender.com/api/mission-cart/${missionId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setClickedButtons((prev) => new Set(prev).add(missionId));
      setCartItems((prev) => {
        const prevArray = Array.isArray(prev) ? prev : [];
        const exists = prevArray.some((x) => x.id === missionId);
        const next = exists ? prevArray : [...prevArray, { id: missionId }];
        return next;
      });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("cart:changed"));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add mission to cart.");
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <div className="flex flex-col gap-20 items-center ">
      {error && (
        <div className="fixed top-20 right-5 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-50">
          {error}
        </div>
      )}
      {/* Herosection */}
      <div
        style={{
          backgroundImage: "url('/images/Mask group (17).png')",
        }}
        className="h-screen flex items-center justify-center flex-col w-full bg-cover bg-center"
      >
        <div
          style={{ paddingTop: "10%" }}
          className="max-w-[376.97px]   herosection-mb flexcenter flex-col gap-5  sm:max-w-[1750.59px]  w-full  px-4"
        >
          <div className="relative z-40">
            <h2 className="Xirod text-[30px] sm:text-[40px] leading-[30px] sm:leading-[42px] text-center  ">
              YOU AIN’T{" "}
            </h2>
            <h2 className="text-white   sm:bg-gradient-to-r from-[#7CD668] via-[#BDE75D] to-[#F5FFDF] bg-clip-text sm:text-transparent Xirod text-[30px] leading-[30px] sm:text-[40px] sm:leading-[42px] text-center ">
              LIKE THE{" "}
              <span className="bg-gradient-to-r from-[#7CD668] via-[#BDE75D] to-[#F5FFDF] bg-clip-text text-transparent Xirod">
                OTHERS
              </span>
            </h2>
          </div>

          <p className="Xirod text-[14px]  relative z-40 sm:text-[18px] leading-[14px] sm:leading-[70px] sm:text-[var(--info)] text-center ">
            MUTANT GENE DETECTED
          </p>
          <Link href="/missions">
            <div
              style={{ marginTop: "40px" }}
              className="flexcenter relative cursor-pointer z-40 h-[70px] w-fit evolution-button"
            >
              <div className="evolution-button-inner flexcenter h-full w-full">
                <p className="font-[700] text-[17px] leading-[70px] ">
                  START YOUR EVOLUTION
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* main section */}
      <div
        style={{ padding: "20px" }}
        className=" w-full max-w-[1440px] gap-10 sm:gap-0 flex flex-col sm:flex-row items-center justify-between "
      >
        <p className="font-[400] text-[23px] w-full Xirod max-w-[301.56px] xl:text-[45px] leading-[27px] sm:leading-[52px] ">
          Most Wanted Missions
        </p>
        <Link href="/missions">
          <button className="font-[700] cursor-pointer bg-white text-[20px] xl:text-[28px] text-black leading-[40px] xl:leading-[80px] w-[268.47px] xl:w-[380.2px] h-[83.92px] rounded-[17px] ">
            Explore More Missions
          </button>
        </Link>
      </div>

      {/* courses */}

      <div
        style={{ padding: "0 20px" }}
        className="max-w-[350px] sm:max-w-[1440px] w-full h-fit "
      >
        <div className="w-full grid sm:grid-cols-3 gap-6  ">
          {loading
            ? // Skeleton loader
              [1, 2, 3].map((_, i) => (
                <div
                  key={i}
                  className="h-[529px] rounded-[20px] bg-[#0B1021] overflow-hidden"
                >
                  <div className="h-[195px] bg-gray-700 animate-pulse rounded-t-[20px]"></div>
                  <div
                    style={{ padding: "20px" }}
                    className="flex flex-col justify-between h-[334px] p-5"
                  >
                    <div className="flex flex-col gap-5">
                      <div className="flex w-full items-center justify-between">
                        <div className="h-8 w-1/4 bg-gray-700 animate-pulse rounded"></div>
                        <div className="h-8 w-1/4 bg-gray-700 animate-pulse rounded-full"></div>
                      </div>
                      <div>
                        <div className="h-8 w-3/4 bg-gray-700 animate-pulse rounded mb-2"></div>
                        <div className="h-8 w-1/2 bg-gray-700 animate-pulse rounded"></div>
                        <div className="flex items-center gap-4 mt-3">
                          <div className="h-5 w-1/3 bg-gray-700 animate-pulse rounded"></div>
                          <div className="h-5 w-1/3 bg-gray-700 animate-pulse rounded"></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="h-10 w-1/4 bg-gray-700 animate-pulse rounded"></div>
                      <div className="h-12 w-1/3 bg-gray-700 animate-pulse rounded-[10px]"></div>
                    </div>
                  </div>
                </div>
              ))
            : // Real mission data
              missions.map((mission) => (
                <div
                  key={mission._id}
                  className="h-[529px] rounded-[20px] bg-[#0B1021] overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  <div
                    className="h-[195px] rounded-t-[20px] bg-cover bg-center relative"
                    style={{
                      backgroundImage: `url(${
                        mission.thumbnail?.url ||
                        "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=200&fit=crop"
                      })`,
                    }}
                  >
                    <div
                      style={{ backgroundColor: "#71C7E7" }} // Default or dynamic bg color
                      className={`absolute  h-[33.69px] text-[#350053] font-[900] text-[9px] leading-[10px] w-[70%] left-0 flexcenter rounded-br-[20px] top-0 `}
                    >
                      {mission.level || "BEGINNER"} - MUTANT PRO LEVEL
                    </div>
                  </div>

                  <div
                    style={{ padding: "20px" }}
                    className="flex flex-col justify-between h-[334px] p-5"
                  >
                    <div className="flex flex-col gap-5">
                      <div className="flex w-full items-center justify-between">
                        <span
                          style={{ padding: "0 8px" }}
                          className="bg-[#393D4E] rounded-[8px] text-[#ABABAB] font-medium text-sm px-3 py-2"
                        >
                          {mission.category || "Design"}
                        </span>
                        <div
                          style={{ padding: "0 8px" }}
                          className="bg-[#D3D3D3] rounded-full px-3 py-1 flex items-center gap-1"
                        >
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-gray-800 font-medium text-sm">
                            {mission.averageRating || 4.5}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-[#E8EDF6] font-semibold text-2xl leading-tight">
                          {mission.title || "Mission Title"}
                        </h3>
                        <h4 className="text-[#E8EDF6] font-semibold text-2xl leading-tight">
                          {mission.subtitle || ""}
                        </h4>
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center gap-1 text-[#6B6B6B]">
                            <Clock className="w-4 h-4" />
                            <span className="font-medium text-sm">
                              {mission.estimatedDuration || "5hr"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-[#6B6B6B]">
                            <User className="w-4 h-4" />
                            <span className="font-medium text-sm">
                              {mission.studentsEnrolled || 0} students
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#C314FF] to-[#6654BC] font-[600] text-[27px] leading-[35px] ">
                          $ {mission.price || "50"}
                        </p>
                      </div>
                      <button
                        onClick={() => handleAddToCart(mission._id)}
                        style={{ padding: "0 8px" }}
                        className={`${
                          clickedButtons.has(mission._id)
                            ? "bg-gray-500 text-white"
                            : "bg-[#08E595]"
                        } px-6 py-2 rounded-[10px] font-medium transition-all duration-200 cursor-pointer hover:shadow-lg`}
                      >
                        {clickedButtons.has(mission._id)
                          ? "View in Cart"
                          : "Enter Mission"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>

      {/* CHOOSE MUTANT SECTION */}

      <div
        style={{ backgroundImage: `url("/images/Rectangle 158.png")` }}
        className=" h-[230vh] sm:h-[65vh] xl:h-[120vh] w-full relative max-w-[1400px]  bg-center bg-cover pb-[100px]" // 👈 Added bottom padding
      >
        <div className="absolute flexcenter  w-full h-fit bg-[rgba(0,0,0,0.6)] z-20 pt-[80px]">
          <div className="w-[70%] h-fit flex flex-col items-center gap-15 ">
            <div className="flexcenter flex-col">
              <p className="max-w-[488px] text-center font-[400] sm:text-[45px] leading-[45px] Xirod">
                Choose your Mutation
              </p>
              <p className="text-center text-[#9F9F9F] sm:text-[18px] sm:leading-[35px] font-[600] ">
                Get ahead of them with top demand skills
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 w-full mt-10">
              <div className="h-[410px] flex flex-col items-center justify-center gap-10 rounded-[22px] bg-gradient-to-b from-[#1B1F2E] to-[#559463]">
                <Image
                  src={"/images/Group 55.png"}
                  width={33.39}
                  height={23.48}
                  alt="social-icon"
                />

                <p className="text-white text-xl">Design</p>
              </div>

              <div className="h-[410px] flex flex-col items-center justify-center gap-10 rounded-[22px] bg-gradient-to-b from-[#1B1F2E] to-[#559463] sm:relative -top-6">
                <Image
                  src={"/images/Vector (18).png"}
                  width={33.39}
                  height={23.48}
                  alt="social-icon"
                />

                <p className="text-white text-xl">Code</p>
              </div>

              <div className="h-[410px] flex flex-col items-center justify-center gap-10 rounded-[22px] bg-gradient-to-b from-[#1B1F2E] to-[#559463]">
                <Image
                  src={"/images/python logo.png"}
                  width={33.39}
                  height={23.48}
                  alt="social-icon"
                />

                <p className="text-white text-xl">Marketing</p>
              </div>
            </div>

            <button
              style={{ padding: "5px 20px" }}
              className="font-[800] sm:leading-[80px] bg-white rounded-[10px] sm:text-[27px] text-black mt-10"
            >
              Explore More Powers
            </button>
          </div>
        </div>
      </div>

      {/* WHAT AWAITS SECTION */}
      <div className="w-full h-auto px-4 sm:px-8 py-16 bg-black">
        <div
          style={{ padding: "0 20px" }}
          className="w-full max-w-[1440px] mx-auto flex flex-col items-center gap-10"
        >
          <p className="w-full max-w-[692.47px] text-[28px] leading-[38px] sm:text-[45px] sm:leading-[60px] font-[400] text-center text-white">
            What Awaits Inside The{" "}
            <span className="text-[#BDE75D]">Mutation</span> Lab?
          </p>

          <div className="w-full max-w-[1200px] mx-auto grid grid-cols-1 xl:grid-cols-3 gap-4 items-center">
            {/* Left Side (2 stacked images) */}
            <div className="hidden xl:flex flex-col gap-4 xl:col-span-2">
              <div
                style={{
                  backgroundImage: `url("/images/Mask group (10).png")`,
                }}
                className="bg-center bg-cover bg-no-repeat w-full rounded-[12px] min-h-[200px] sm:min-h-[300px]"
              ></div>
              <div
                style={{ backgroundImage: `url("/images/Mask group (8).png")` }}
                className="bg-center bg-cover bg-no-repeat w-full rounded-[12px] min-h-[200px] sm:min-h-[300px]"
              ></div>
            </div>

            {/* Right Side (single tall image) */}
            <div
              style={{ backgroundImage: `url("/images/Mask group (9).png")` }}
              className="bg-center bg-cover bg-no-repeat w-full rounded-[12px] min-h-[420px] sm:min-h-full"
            ></div>
          </div>
        </div>
      </div>

      <div
        style={{ backgroundImage: `url("/images/group.png")` }}
        className="w-full max-w-[1440px] bg-cover bg-center flexcenter h-[90vh]  "
      >
        <div className="flexcenter flex-col gap-5">
          <p className="font-[400] text-center sm:leading-[117%] sm:text-[55px] ">
            STILL HUMANS?
          </p>
          <p className="text-[#909090] text-center max-w-[484.03px] w-full font-[600] sm:text-[30px] sm:leading-[36px] ">
            Courses are just the beginning. The transformation is what you came
            for.
          </p>
          <button
            style={{ padding: "6px 25px" }}
            className=" btn w-fit rounded-[20px] "
          >
            Choose Your First Power
          </button>
        </div>
      </div>
    </div>
  );
}
