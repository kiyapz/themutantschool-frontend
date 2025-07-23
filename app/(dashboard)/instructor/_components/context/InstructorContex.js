"use client";
import { createContext, useEffect, useState } from "react";
import profilebase from "../../profile/_components/profilebase";
import { useRouter } from "next/router";

export const InstructorContext = createContext();
const router = useRouter;
export default function InstructorContextProvider({ children }) {
  const [profiledisplay, setprofiledisplay] = useState("Personal Information");
  const [openSmallScreenProfileDropDown, setopenSmallScreenProfileDropDown] =
    useState(false);
    const [activeTab, setActiveTab] = useState("Mission Details");
  const [openlargeProfileDropdown, setopenlargeProfileDropdown] =
    useState(false);
  const [ChangePassword, setChangePassword] = useState(false);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const [missionId, setmessionId] = useState("");
    const [passingScore, setPassingScore] = useState(70);
     const [quiztitle, setQuizTitle] = useState("");
      const [Level, setLevel] = useState("AddLevel");
       const [courses, setMission] = useState([]);

  // for level
  const [levelId, setLeveld] = useState("");
  const [capselId, setcapselId] = useState("");

  const [userUpdatedValue, setUserUpdatedValue] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    bio: "",
    facebook: "",
    linkedin: "",
    website: "",
    Twitter: "",
    url: "",
    youtube: "",
    instagram: "",
    Headline: "",
    ExpertiseTags: "",
    gender: "",
    Phone: "",
    role: "",
    nationality: "",
  });

  const refreshAuthToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        console.warn("No refresh token found");
        router.push("/Login");
        return null;
      }

      const response = await fetch("/api/auth/refresh-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const data = await response.json();

      // Update localStorage with new tokens
      localStorage.setItem("login-accessToken", data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }

      return data.accessToken;
    } catch (error) {
      console.error("Token refresh failed:", error);
      localStorage.removeItem("login-accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("USER");
      router.push("/Login");
      return null;
    }
  };

  const makeAuthenticatedRequest = async (url, options = {}) => {
    let accessToken = localStorage.getItem("login-accessToken");

    if (!accessToken) {
      console.warn("No access token found");
      router.push("/Login");
      return null;
    }

    try {
      const response = await profilebase.get(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response;
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log("Token expired, attempting to refresh...");

        const newAccessToken = await refreshAuthToken();

        if (newAccessToken) {
          try {
            const retryResponse = await profilebase.get(url, {
              ...options,
              headers: {
                ...options.headers,
                Authorization: `Bearer ${newAccessToken}`,
              },
            });

            return retryResponse;
          } catch (retryError) {
            console.log("Request failed even after token refresh:", retryError);
            throw retryError;
          }
        }
      }

      throw error;
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const storedUser = localStorage.getItem("USER");

        if (!storedUser) {
          console.warn("User not found in localStorage");
          router.push("/Login");
          return;
        }

        const parsedUser = JSON.parse(storedUser);
        const id = parsedUser._id;

        const response = await makeAuthenticatedRequest(`/user-profile/${id}`);

        if (response) {
          console.log("User profile fetched:", response.data.data);
          setUserProfile(response.data.data);
        }
      } catch (error) {
        console.error("Failed to load user profile:", error);

        if (error.response?.status >= 500) {
          console.log("Server error occurred");
        }
      }
    };

    getUser();
  }, []);

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
        Twitter: userProfile.profile?.socialLinks?.Twitter || "",
        url: userProfile.profile?.avatar?.url || "",
        youtube: userProfile.profile?.avatar?.publicId || "",
        instagram: userProfile.profile?.socialLinks?.instagram || "",
        Headline: userProfile.Headline || "",
        ExpertiseTags: userProfile.ExpertiseTags || "",
        gender: userProfile.gender || "",
        Phone: userProfile.phone || "",
        role: userProfile.role || "",
        nationality: userProfile.nationality || "",
        id: userProfile._id || "",
      });
    }
  }, [userProfile]);

  const refreshUserData = async () => {
    try {
      const storedUser = localStorage.getItem("USER");
      if (!storedUser) return;

      const parsedUser = JSON.parse(storedUser);
      const id = parsedUser._id;

      const response = await makeAuthenticatedRequest(`/user-profile/${id}`);

      if (response) {
        setUserProfile(response.data.data);
      }
    } catch (error) {
      console.error("Failed to refresh user data:", error);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("USER");

    if (!storedUser) {
      console.warn("User not found in localStorage");
      router.push("/Login");
      return;
    }
    const interval = setInterval(async () => {
      const accessToken = localStorage.getItem("login-accessToken");

      if (!accessToken) {
        router.push("/Login");
        return;
      }
      if (accessToken) {
        try {
          const tokenPayload = JSON.parse(atob(accessToken.split(".")[1]));
          const currentTime = Math.floor(Date.now() / 1000);

          // Refresh if token expires in next 10 minutes
          if (tokenPayload.exp - currentTime < 600) {
            await refreshAuthToken();
          }
        } catch (error) {
          console.log("Error checking token expiration:", error);
        }
      }
    }, 50 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const FetchUserProfile = async () => {
    console.log("Clicked user profile");

    try {
      const storedUser = localStorage.getItem("USER");
      const accessToken = localStorage.getItem("login-accessToken");
      console.log(accessToken, "access token");

      if (!storedUser || !accessToken) {
        console.warn("User or token not found in localStorage");
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      const id = parsedUser._id;
      console.log(id, "this is userid");

      const response = await profilebase.get(`/user-profile/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("User profile exactly:", response.data.data);
      setUserProfile(response.data.data);
    } catch (error) {
      console.log("Failed to load user", error.response?.data || error.message);
    }
  };

  const handleLogout = () => {
 
    localStorage.removeItem("login-accessToken");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("USER");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("missionDraft");
    localStorage.removeItem("missionId");
    
    window.location.href = "/Login";
  };

  return (
    <InstructorContext.Provider
      value={{
        Level,
        setLevel,
        levelId,
        setLeveld,
        capselId,
        setcapselId,
        FetchUserProfile,
        userProfile,
        setUserProfile,
        userUpdatedValue,
        setUserUpdatedValue,
        user,
        setUser,
        openlargeProfileDropdown,
        setopenlargeProfileDropdown,
        profiledisplay,
        setprofiledisplay,
        openSmallScreenProfileDropDown,
        setopenSmallScreenProfileDropDown,
        ChangePassword,
        setChangePassword,
        activeTab,
        setActiveTab,
        handleLogout,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        missionId,
        setmessionId,
        passingScore,
        setPassingScore,
        quiztitle,
        setQuizTitle,
        courses,
        setMission,
      }}
    >
      {children}
    </InstructorContext.Provider>
  );
}
