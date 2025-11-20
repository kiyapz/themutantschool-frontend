"use client";
import { useContext, useEffect, useState } from "react";
import { StudentContext } from "./Context/StudentContext";
import { FaArrowLeft } from "react-icons/fa";
import { FiMenu } from "react-icons/fi"; // hamburger icon
import { IoClose, IoNotificationsOutline } from "react-icons/io5"; // close icon and notification icon
import Sidebar from "./Sidebar";
import { useRouter } from "next/navigation";
import NotificationDropdown from "./NotificationDropdown";
import api from "@/lib/api";

export default function Navbar() {
  const router = useRouter();
  const { viewStudentName, menuOpen, setMenuOpen } = useContext(StudentContext);
  const [name, setName] = useState("");
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

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

  // Fetch user profile to get real name
  const fetchUserProfile = async () => {
    try {
      const userStr = localStorage.getItem("USER");
      if (!userStr) {
        router.push("/");
        return;
      }

      const user = JSON.parse(userStr);
      const userId = user._id || user.id;

      if (!userId) {
        // Fallback to localStorage name
        const { firstName, lastName } = user;
        setName(firstName && lastName ? `${firstName} ${lastName}` : user.email || "User");
        return;
      }

      // Fetch from API
      const response = await api.get(`/user-profile/${userId}`);
      const userData = response.data?.data || response.data;

      if (userData) {
        const firstName = userData.firstName || "";
        const lastName = userData.lastName || "";
        const fullName = firstName && lastName
          ? `${firstName} ${lastName}`
          : userData.name || userData.email || "User";
        setName(fullName);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      // Fallback to localStorage name
      const user = localStorage.getItem("USER");
      if (user) {
        const userData = JSON.parse(user);
        const { firstName, lastName } = userData;
        setName(firstName && lastName ? `${firstName} ${lastName}` : userData.email || "User");
      }
    }
  };

  useEffect(() => {
    // Fetch user profile on mount
    fetchUserProfile();

    // Fetch notification count on mount
    fetchUnreadCount();

    // Listen for profile updates
    const handleProfileUpdate = (event) => {
      fetchUserProfile();
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);

    // Poll for new notifications every 30 seconds
    const notificationInterval = setInterval(fetchUnreadCount, 30000);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate);
      clearInterval(notificationInterval);
    };
  }, [router]);

  return (
    <div className="h-[60px] sm:h-[10vh] flex w-full px-4 sm:px-6 md:px-8 justify-between items-center">
      <div className="flex-1 min-w-0">
        <p className="text-[#919191] font-[300] text-[14px] sm:text-[18px] md:text-[25px] leading-[20px] sm:leading-[40px] truncate">
          Hello {name}
        </p>
      </div>

      {/* Right side icons */}
      <div className="flex items-center gap-4 relative">
        {/* Notification Icon */}
        <div
          onClick={() => {
            setNotificationOpen(!notificationOpen);
          }}
          className="relative cursor-pointer transition-transform duration-300 hover:scale-110 flex-shrink-0"
        >
          <IoNotificationsOutline size={24} className="text-white" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </div>

        {/* Notification Dropdown */}
        <NotificationDropdown
          isOpen={notificationOpen}
          onClose={() => setNotificationOpen(false)}
          onNotificationUpdate={(count) => setUnreadCount(count)}
        />

        {/* Menu Icon */}
        <div
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden relative z-30 cursor-pointer transition-transform duration-300 flex-shrink-0"
        >
          {menuOpen ? (
            <IoClose size={24} className="text-white" />
          ) : (
            <FiMenu size={20} className="text-white" />
          )}
        </div>
      </div>

      {/* Sidebar Overlay */}
      <div
        className={`fixed top-0 right-0 z-20 w-full h-screen bg-[rgba(0,0,0,0.9)] sm:hidden transform transition-transform duration-500 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div
          className={`w-[80%] max-w-[300px] h-full shadow-lg p-4 transition-transform duration-500 ease-in-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
