"use client";
import Image from "next/image";
import Sidebtn from "./btn/Sidebtn";
import { useContext, useState } from "react";
import { StudentContext } from "./Context/StudentContext";
import { useRouter } from "next/navigation";
import {
  AiOutlineHome,
  AiOutlineFlag,
  AiOutlineHistory,
  AiOutlineUser,
  AiOutlineTrophy,
  AiOutlineSetting,
  AiOutlineLogout,
  AiOutlineFileText,
} from "react-icons/ai";

export default function Sidebar() {
  const { menuOpen, setMenuOpen } = useContext(StudentContext);
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setIsLoggingOut(true);
    setShowLogoutModal(false);

    // Clear all authentication tokens
    localStorage.removeItem("login-accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("USER");

    // Redirect to login page
    setTimeout(() => {
      router.push("/auth/login");
    }, 500);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };
  return (
    <div
      style={{ paddingLeft: "20px" }}
      className="w-full flex flex-col justify-between   h-full "
    >
      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-70 px-4"
          onClick={cancelLogout} // Close when clicking on the backdrop
        >
          <div
            className="bg-[#121212] p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-sm mx-auto"
            onClick={(e) => e.stopPropagation()} // Prevent clicks from bubbling to the backdrop
          >
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
              Confirm Logout
            </h3>
            <p className="text-gray-300 text-sm sm:text-base mb-5 sm:mb-6">
              Are you sure you want to logout from your account?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelLogout}
                className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-700 text-white text-sm sm:text-base rounded hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-3 py-2 sm:px-4 sm:py-2 bg-[#8B4CC2] text-white text-sm sm:text-base rounded hover:bg-[#7343b3] transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flexcenter flex-col">
        <div style={{ marginTop: "20px" }} className="h-[10vh]   ">
          <p
            className="font-[400] Xirod text-[29px] leading-[40px] text-center"
            style={{ color: "var(--mutant-color)" }}
          >
            Mutant
          </p>
        </div>

        <div className="flex flex-col   gap-5">
          <Sidebtn
            link={"/student/dashboard"}
            text={"Home"}
            icon={AiOutlineHome}
          />
          <Sidebtn
            link={"/student/missions"}
            text={"My Missions"}
            icon={AiOutlineFlag}
          />
          <Sidebtn
            link={"/student/quiz-history"}
            text={"Quiz History"}
            icon={AiOutlineFileText}
          />
          <Sidebtn
            link={"/student/history"}
            text={"Mutation History"}
            icon={AiOutlineHistory}
          />
          <Sidebtn
            link={"/student/profile"}
            text={"Mutation Profile"}
            icon={AiOutlineUser}
          />
          <Sidebtn
            link={"/student/achievements"}
            text={"Achievements"}
            icon={AiOutlineTrophy}
          />
          <Sidebtn
            link={"/student/settings"}
            text={"Settings"}
            icon={AiOutlineSetting}
          />
        </div>
      </div>
      <div className="mb-8">
        <button
          onClick={handleLogoutClick}
          disabled={isLoggingOut}
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all
                     text-white bg-[#070707] cursor-pointer  w-[85%]"
        >
          <AiOutlineLogout className="text-xl" />
          <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
        </button>
      </div>
    </div>
  );
}
