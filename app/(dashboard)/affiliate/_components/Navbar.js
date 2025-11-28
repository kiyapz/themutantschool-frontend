"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChatBubbleLeftRightIcon,
  ChevronDownIcon,
  Bars3Icon,
  UserIcon,
  CreditCardIcon,
  CogIcon,
  ShieldCheckIcon,
  BellIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import NotificationDropdown from "../../student/component/NotificationDropdown";
import { IoNotificationsOutline } from "react-icons/io5";
import api from "@/lib/api";

export default function Navbar({ setSidebarOpen }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userName, setUserName] = useState("User");
  const [userInitial, setUserInitial] = useState("U");
  const [userAvatar, setUserAvatar] = useState("");
  const profileDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);

  // Fetch unread notification count
  const fetchUnreadCount = async () => {
    try {
      const response = await api.get("/notification");
      const notifications = response.data?.data || response.data || [];
      const unread = notifications.filter((notif) => !notif.isRead).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Error fetching notification count:", error);
    }
  };

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      const userStr = localStorage.getItem("USER");
      if (!userStr) {
        // Set default values if no user in localStorage
        setUserName("User");
        setUserInitial("U");
        return;
      }

      const user = JSON.parse(userStr);
      const userId = user._id || user.id;

      // Set fallback from localStorage user data
      if (user) {
        const fallbackName = user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName}`
          : (Array.isArray(user.name) ? null : user.name) || user.email || user.username || "User";
        setUserName(fallbackName);
        
        const fallbackInitial = user.firstName && user.lastName
          ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
          : fallbackName.charAt(0).toUpperCase();
        setUserInitial(fallbackInitial);
      }

      if (!userId) return;

      try {
        const response = await api.get(`/user-profile/${userId}`);
        console.log("User profile API response:", response);
        console.log("Response data:", response.data);
        console.log("Response data.data:", response.data?.data);
        
        // Handle different response structures
        let userData = null;
        if (response.data?.success && response.data?.data) {
          // Structure: { success: true, data: {...} }
          userData = response.data.data;
        } else if (response.data?.data) {
          // Structure: { data: {...} }
          userData = response.data.data;
        } else if (response.data) {
          // Structure: {...} directly
          userData = response.data;
        }
        
        console.log("User data extracted:", userData);

        if (userData && typeof userData === 'object') {
          const firstName = userData.firstName || "";
          const lastName = userData.lastName || "";
          
          // Handle name - check if it's an array and ignore it if so
          const nameValue = Array.isArray(userData.name) ? null : userData.name;
          
          // Build full name - prefer firstName + lastName, then firstName alone, then fallbacks
          let fullName = "User";
          if (firstName && lastName) {
            fullName = `${firstName} ${lastName}`;
          } else if (firstName) {
            fullName = firstName;
          } else if (nameValue) {
            fullName = nameValue;
          } else if (userData.email) {
            fullName = userData.email;
          } else if (userData.username) {
            fullName = userData.username;
          }
          
          console.log("Setting user name to:", fullName);
          setUserName(fullName);
          
          // Set initial - use first letter of firstName if available, otherwise first letter of fullName
          let initial = "U";
          if (firstName) {
            initial = firstName.charAt(0).toUpperCase();
          } else if (fullName && fullName !== "User") {
            initial = fullName.charAt(0).toUpperCase();
          }
          console.log("Setting user initial to:", initial);
          setUserInitial(initial);

          // Set avatar
          const avatarUrl = 
            userData.profile?.avatar?.url ||
            userData.profile?.avatar?.secure_url ||
            userData.profile?.avatarUrl ||
            userData.avatar?.url ||
            userData.avatar?.secure_url ||
            userData.avatarUrl ||
            userData.avatar ||
            "";
          console.log("Setting avatar URL to:", avatarUrl);
          setUserAvatar(avatarUrl);
        } else {
          console.warn("No user data found in response");
        }
      } catch (apiError) {
        console.error("Error fetching user profile from API:", apiError);
        console.error("Error details:", apiError.response?.data || apiError.message);
        // Keep the fallback values from localStorage
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      setUserName("User");
      setUserInitial("U");
    }
  };

  useEffect(() => {
    // Fetch notification count on mount
    fetchUnreadCount();

    // Fetch user profile
    fetchUserProfile();

    // Poll for new notifications every 30 seconds
    const notificationInterval = setInterval(fetchUnreadCount, 30000);

    // Listen for profile update events
    const handleProfileUpdate = () => {
      fetchUserProfile();
    };
    window.addEventListener("profileUpdated", handleProfileUpdate);

    return () => {
      clearInterval(notificationInterval);
      window.removeEventListener("profileUpdated", handleProfileUpdate);
    };
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getPageTitle = () => {
    if (pathname.includes("/profile")) return "USER PROFILE";
    if (pathname.includes("/conversion-history")) return "CONVERSION HISTORY";
    if (pathname.includes("/leaderboard")) return "LEADERBOARD";
    if (pathname.includes("/payments")) return "PAYMENTS";
    if (pathname.includes("/settings")) return "AFFILIATES";
    if (pathname.includes("/support")) return "SUPPORT";
    return "AFFILIATE DASHBOARD";
  };

  const handleLogout = () => {
    localStorage.removeItem("login-accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("USER");
    router.push("/auth/login");
  };

  const profileMenuItems = [
    {
      name: "Dashboard",
      href: "/affiliate",
      icon: ChartBarIcon,
    },
    {
      name: "Personal Information",
      href: "/affiliate/profile/personal-information",
      icon: UserIcon,
    },
    {
      name: "Payment Information",
      href: "/affiliate/profile/payment-information",
      icon: CreditCardIcon,
    },
    {
      name: "Security Settings",
      href: "/affiliate/profile/security-settings",
      icon: ShieldCheckIcon,
    },
    {
      name: "Notifications",
      href: "/affiliate/profile/notifications",
      icon: BellIcon,
    },
    {
      name: "Settings",
      href: "/affiliate/settings",
      icon: CogIcon,
    },
  ];


  return (
    <div
      className="px-2 sm:px-4 lg:px-6 py-2 sm:py-4 flex justify-between items-center fixed top-0 left-0 lg:left-64 right-0 z-50"
      style={{ backgroundColor: "#000000" }}
    >
      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden text-white hover:text-gray-300 p-1 flex-shrink-0"
        >
          <Bars3Icon className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
        <h1 className="text-[11px] sm:text-base lg:text-lg xl:text-xl Xirod font-semibold truncate min-w-0">
          {getPageTitle()}
        </h1>
      </div>
      <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4 relative flex-shrink-0">
        {/* Notifications Dropdown */}
        <div className="relative" ref={notificationDropdownRef}>
          <button
            onClick={() =>
              setIsNotificationDropdownOpen(!isNotificationDropdownOpen)
            }
            className="relative p-1 rounded-lg transition-all duration-200 group"
            style={{ color: "#9B9B9B" }}
            onMouseEnter={(e) => {
              e.target.style.color = "#FFFFFF";
              e.target.style.backgroundColor = "#1A1A1A";
            }}
            onMouseLeave={(e) => {
              e.target.style.color = "#9B9B9B";
              e.target.style.backgroundColor = "transparent";
            }}
          >
            <IoNotificationsOutline size={20} className="sm:w-[22px] sm:h-[22px] text-[#9B9B9B] group-hover:text-white transition-colors" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 bg-red-500 rounded-full text-[9px] sm:text-[10px] text-white flex items-center justify-center font-bold">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          <NotificationDropdown
            isOpen={isNotificationDropdownOpen}
            onClose={() => setIsNotificationDropdownOpen(false)}
            onNotificationUpdate={(count) => setUnreadCount(count)}
          />
        </div>

        <button
          className="p-1 rounded-lg transition-all duration-200 flex-shrink-0"
          style={{ color: "#9B9B9B" }}
          onMouseEnter={(e) => {
            e.target.style.color = "#FFFFFF";
            e.target.style.backgroundColor = "#1A1A1A";
          }}
          onMouseLeave={(e) => {
            e.target.style.color = "#9B9B9B";
            e.target.style.backgroundColor = "transparent";
          }}
        >
          <ChatBubbleLeftRightIcon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileDropdownRef}>
          {/* Desktop Profile Button */}
          <button
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="hidden md:flex items-center space-x-2 rounded-lg px-2 py-1 transition-all duration-200"
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#1A1A1A";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
            }}
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-600 rounded-full flex items-center justify-center overflow-hidden">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={userName}
                  className="w-full h-full rounded-full object-cover"
                  onError={() => {
                    setUserAvatar("");
                  }}
                />
              ) : (
                <span className="text-xs sm:text-sm font-medium text-white">{userInitial}</span>
              )}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs text-gray-400">Affiliate</span>
              <span className="text-sm font-medium text-white">
                {userName}
              </span>
            </div>
            <ChevronDownIcon className="h-4 w-4 text-gray-400" />
          </button>

          {/* Mobile Profile Button */}
          <button
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="md:hidden flex items-center rounded-lg p-0.5 sm:p-1 transition-all duration-200 flex-shrink-0"
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#1A1A1A";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
            }}
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-600 rounded-full flex items-center justify-center overflow-hidden">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={userName}
                  className="w-full h-full rounded-full object-cover"
                  onError={() => {
                    setUserAvatar("");
                  }}
                />
              ) : (
                <span className="text-xs sm:text-sm font-medium text-white">{userInitial}</span>
              )}
            </div>
          </button>

          {isProfileDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-64 rounded-lg shadow-lg border z-50"
              style={{ backgroundColor: "#0F0F0F", borderColor: "#1A1A1A" }}
            >
              <div className="p-4 border-b" style={{ borderColor: "#1A1A1A" }}>
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden"
                    style={{ backgroundColor: "#7343B3" }}
                  >
                    {userAvatar ? (
                      <img
                        src={userAvatar}
                        alt={userName}
                        className="w-full h-full object-cover"
                        onError={() => {
                          setUserAvatar("");
                        }}
                      />
                    ) : (
                      <span className="text-sm font-medium text-white">{userInitial}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {userName}
                    </p>
                    <p className="text-xs text-gray-400">Affiliate</p>
                  </div>
                </div>
              </div>
              <div className="py-2">
                {profileMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center space-x-3 px-4 py-3 text-sm transition-colors ${
                        isActive ? "opacity-100" : "opacity-70"
                      }`}
                      style={{
                        color: isActive ? "#7343B3" : "#E5E5E5",
                        backgroundColor: isActive ? "#0C0C0C" : "transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.target.style.color = "#FFFFFF";
                          e.target.style.backgroundColor = "#1A1A1A";
                          e.target.style.transform = "translateX(4px)";
                          e.target.style.borderLeft = "3px solid #7343B3";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.target.style.color = "#E5E5E5";
                          e.target.style.backgroundColor = "transparent";
                          e.target.style.transform = "translateX(0px)";
                          e.target.style.borderLeft = "3px solid transparent";
                        }
                      }}
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
                
                {/* Divider */}
                <div className="border-t my-1" style={{ borderColor: "#1A1A1A" }}></div>
                
                {/* Logout Button */}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsProfileDropdownOpen(false);
                  }}
                  className="flex items-center space-x-3 px-4 py-3 text-sm transition-colors opacity-70 w-full text-left"
                  style={{
                    color: "#FF6B6B",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.opacity = "1";
                    e.target.style.backgroundColor = "#1A1A1A";
                    e.target.style.transform = "translateX(4px)";
                    e.target.style.borderLeft = "3px solid #FF6B6B";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.opacity = "0.7";
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.transform = "translateX(0px)";
                    e.target.style.borderLeft = "3px solid transparent";
                  }}
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div
          className="hidden lg:block p-2 rounded-lg"
          style={{ backgroundColor: "#2A2A2A" }}
        >
          <span className="text-sm font-mono">&lt;/&gt;</span>
        </div>
      </div>
    </div>
  );
}
