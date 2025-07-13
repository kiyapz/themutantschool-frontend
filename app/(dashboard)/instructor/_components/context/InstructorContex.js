'use client';
import { createContext, useEffect, useState } from "react";
import profilebase from "../../profile/_components/profilebase";

export const InstructorContext = createContext();

export default function InstructorContextProvider({ children }) {
  const [profiledisplay, setprofiledisplay] = useState('Personal Information');
  const [openSmallScreenProfileDropDown,setopenSmallScreenProfileDropDown] = useState(false);
  const [openlargeProfileDropdown, setopenlargeProfileDropdown] = useState(false);
  const [ ChangePassword,setChangePassword] = useState(false)
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

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

  // Token refresh function
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

  // Enhanced API call function with token refresh
  const makeAuthenticatedRequest = async (url, options = {}) => {
    let accessToken = localStorage.getItem("login-accessToken");

    if (!accessToken) {
      console.warn("No access token found");
      router.push("/Login");
      return null;
    }

    try {
      // First attempt with current token
      const response = await profilebase.get(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response;
    } catch (error) {
      // Check if token is expired (401 or 403)
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log("Token expired, attempting to refresh...");

        // Try to refresh the token
        const newAccessToken = await refreshAuthToken();

        if (newAccessToken) {
          // Retry the original request with new token
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
            console.error(
              "Request failed even after token refresh:",
              retryError
            );
            throw retryError;
          }
        }
      }

      throw error;
    }
  };

  // Updated useEffect with token refresh logic
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

        // Use the enhanced request function
        const response = await makeAuthenticatedRequest(`/user-profile/${id}`);

        if (response) {
          console.log("User profile fetched:", response.data.data);
          setUserProfile(response.data.data);
        }
      } catch (error) {
        console.error("Failed to load user profile:", error);
        // Handle other errors (network, server errors, etc.)
        if (error.response?.status >= 500) {
          console.error("Server error occurred");
        }
      }
    };

    getUser();
  }, []);

  // Updated useEffect to populate form when userProfile changes
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
      });
    }
  }, [userProfile]);

  // Optional: Function to manually refresh user data
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

  // Optional: Set up periodic token refresh (every 50 minutes for 1-hour tokens)
  useEffect(() => {
    const interval = setInterval(async () => {
      const accessToken = localStorage.getItem("login-accessToken");
      if (accessToken) {
        try {
          // Decode token to check expiration (optional)
          const tokenPayload = JSON.parse(atob(accessToken.split(".")[1]));
          const currentTime = Math.floor(Date.now() / 1000);

          // Refresh if token expires in next 10 minutes
          if (tokenPayload.exp - currentTime < 600) {
            await refreshAuthToken();
          }
        } catch (error) {
          console.error("Error checking token expiration:", error);
        }
      }
    }, 50 * 60 * 1000); // Check every 50 minutes

    return () => clearInterval(interval);
  }, []);


      const FetchUserProfile = async () => {
        console.log("Clicked user profile");
        
        try {
          const storedUser = localStorage.getItem("USER");
          const accessToken = localStorage.getItem("login-accessToken");
          console.log(accessToken, 'access token');
          
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
  return (
    <InstructorContext.Provider value={{FetchUserProfile,userProfile, setUserProfile,userUpdatedValue, setUserUpdatedValue,user, setUser,openlargeProfileDropdown, setopenlargeProfileDropdown, profiledisplay, setprofiledisplay,openSmallScreenProfileDropDown,setopenSmallScreenProfileDropDown,ChangePassword,setChangePassword }}>
      {children}
    </InstructorContext.Provider>
  );
}
