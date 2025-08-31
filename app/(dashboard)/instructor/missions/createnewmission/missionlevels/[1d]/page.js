"use client";

import { useParams, useRouter } from "next/navigation";
import MutationProcess from "../_components/MutationProcess";
import { FiDownload, FiSave, FiEdit, FiTrash2 } from "react-icons/fi";
import { FaLessThan } from "react-icons/fa";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const actions = [
  { text: "Delete", icon: <FiTrash2 /> },
  { text: "Edit", icon: <FiEdit /> },
  { text: "Publish", icon: null },
];

export default function Page() {
  const params = useParams();
  const router = useRouter();

  const [levels, setLevels] = useState([]);
  const [buttonAction, setbuttonAction] = useState("Publish");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Expect your route folder to be: .../missionlevels/[id]/page.js
  // If it's [1d] right now, rename it to [id]
  const { id } = params || {};

  // --- Token refresh, memoized so callers stay stable ---
  const refreshAuthToken = useCallback(async () => {
    try {
      const refreshToken =
        typeof window !== "undefined"
          ? localStorage.getItem("refreshToken")
          : null;
      if (!refreshToken) {
        console.warn("No refresh token found");
        router.push("/Login");
        return null;
      }

      const response = await fetch("/api/auth/refresh-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) throw new Error("Failed to refresh token");

      const data = await response.json();

      localStorage.setItem("login-accessToken", data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }
      return data.accessToken;
    } catch (err) {
      console.error("Token refresh failed:", err);
      localStorage.removeItem("login-accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("USER");
      router.push("/Login");
      return null;
    }
  }, [router]);

  // --- Authenticated GET wrapper, memoized ---
  const makeAuthenticatedRequest = useCallback(
    async (url, options = {}) => {
      const accessToken =
        typeof window !== "undefined"
          ? localStorage.getItem("login-accessToken")
          : null;

      if (!accessToken) {
        console.warn("No access token found");
        router.push("/Login");
        return null;
      }

      try {
        const response = await axios.get(url, {
          ...options,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            ...options.headers,
          },
        });
        return response;
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          console.log("Token expired, attempting to refresh...");
          const newAccessToken = await refreshAuthToken();
          if (newAccessToken) {
            const retry = await axios.get(url, {
              ...options,
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${newAccessToken}`,
                ...options.headers,
              },
            });
            return retry;
          }
        }
        throw err;
      }
    },
    [refreshAuthToken, router]
  );

  useEffect(() => {
    let isMounted = true;

    const fetchMissionLevels = async () => {
      try {
        setLoading(true);
        setError(null);

        const storedMissionId =
          typeof window !== "undefined"
            ? localStorage.getItem("missionId")
            : null;

        if (!storedMissionId) {
          console.log("Missing missionId in localStorage");
          router.push("/instructor/myMissions/createnewmission");
          return;
        }

        const response = await makeAuthenticatedRequest(
          `https://themutantschool-backend.onrender.com/api/mission-level/mission/${storedMissionId}`
        );

        if (isMounted && response?.data?.data) {
          setLevels(response.data.data);
        }
      } catch (err) {
        console.error("Error retrieving mission data:", err);
        if (isMounted) setError("Failed to load mission data");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMissionLevels();
    return () => {
      isMounted = false;
    };
  }, [makeAuthenticatedRequest, router]);

  if (loading) {
    return (
      <div className="p-5 text-white">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 text-white">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  const responseLevel = levels.find((el) => el._id === id);

  if (!responseLevel) {
    return (
      <div className="p-5 text-white">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Mission level not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 text-white">
      <div className="w-full flex items-center justify-between">
        <div>
          <p className=" text-[25px]  xl:text-[42px] font-[600] leading-[40px] flex items-center gap-2">
            <Link
              className="cursor-pointer"
              href="/instructor/myMissions/createnewmission"
            >
              <span>
                <FaLessThan />
              </span>
            </Link>
            {` ${responseLevel.title}`}
          </p>
          <p className="text-[var(--link-color)] font-[500] text-[14px] leading-[57px]">
            Mission: Web Development Mastery .
            <span>{`Level ${responseLevel.level}: ${responseLevel.title}`}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          {actions.map((el, idx) => (
            <button
              style={{ padding: "15px" }}
              onClick={() => setbuttonAction(el.text)}
              key={idx}
              className={`flex items-center gap-2 px-4 py-2 rounded-[10px] text-white font-medium ${
                buttonAction === el.text ? "bg-[#604196]" : "bg-[#292929]"
              }`}
            >
              {el.icon}
              {el.text}
            </button>
          ))}
        </div>
      </div>

      <div className="grid xl:grid-cols-3 w-full gap-10">
        <div
          className="xl:col-span-2 gap-10 flex flex-col bg-[var(--black-bg)] rounded-[20px]"
          style={{ padding: "20px" }}
        >
          <div>
            <p className="text-[42px] font-[600] leading-[40px]">{`Capsule: ${responseLevel.title}`}</p>
            <p className="text-[var(--link-color)] font-[500] text-[14px] leading-[57px]">
              Duration: 25 Minutes .{" "}
              <span>
                Difficulty: Intermediate . Last Edited: Today, 2:30 PM
              </span>
            </p>

            <div className="flex flex-col gap-5">
              <div className="w-full h-[438px] rounded-[30px] bg-[#604196]" />

              <div className="flex flex-col gap-5">
                <h1 className="text-[27px] leading-[57px] font-[600] text-[var(--sidebar-hovercolor)]">
                  Capsule summary
                </h1>

                <p className="text-[16px]">
                  {responseLevel.description ||
                    `Welcome to your first step into the web! In this lesson, you'll uncover the building blocks of every website: HTML tags. Learn how to structure content using tags like <html>, <head>, <body>, <h1>–<h6>, <p>, <a>, <img>, and more. Discover how these magical brackets tell browsers what to display and how to organize it. Whether you're creating mutant mission logs or super-powered portfolios, mastering tags is your gateway to the web.`}
                </p>

                <h2 className="text-[16px]">{`By the end of this lesson, you'll be able to:`}</h2>
                <ul
                  style={{ paddingLeft: "30px" }}
                  className="text-[16px] list-disc pl-5"
                >
                  <li>Identify common HTML tags and their purposes</li>
                  <li>Understand how tags nest and interact</li>
                  <li>Build a simple web page with proper structure</li>
                </ul>

                <p className="text-[16px]">
                  Your journey to becoming a web sorcerer starts here!
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <p className="text-[var(--sidebar-hovercolor)] text-[27px] leading-[57px] font-[600]">
              Attachments
            </p>

            <div
              style={{ paddingLeft: "10px", paddingRight: "10px" }}
              className="bg-[var(--button-background)] w-full h-[73.64px] rounded-[12px] flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <p>
                  <FiSave className="text-[#818181]" />
                </p>
                <p>HTML Tag 101 summary.pdf</p>
              </div>
              <div>
                <FiDownload className="text-[#818181]" />
              </div>
            </div>

            <div
              style={{ paddingLeft: "10px", paddingRight: "10px" }}
              className="bg-[var(--button-background)] w-full h-[73.64px] rounded-[12px] flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <p>
                  <FiSave className="text-[#818181]" />
                </p>
                <p>HTML Tag 101 class.mov</p>
              </div>
              <div className="text-[#818181]">
                <FiDownload />
              </div>
            </div>
          </div>
        </div>

        <div>
          <MutationProcess />
        </div>
      </div>
    </div>
  );
}
