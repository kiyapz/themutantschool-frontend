"use client";
import { useContext, useEffect, useState } from "react";
import { StudentContext } from "./Context/StudentContext";
import { FaArrowLeft } from "react-icons/fa";
import { FiMenu } from "react-icons/fi"; // hamburger icon
import { IoClose } from "react-icons/io5"; // close icon
import Sidebar from "./Sidebar";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const { viewStudentName, menuOpen, setMenuOpen } = useContext(StudentContext);
  const [name, setName] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("USER");
    if (user) {
      const { firstName, lastName } = JSON.parse(user);
      setName(`${firstName} ${lastName}`);
    } else {
      console.log("No user found in localStorage");
      router.push("/");
    }
  }, [router]);

  return (
    <div
      style={{ padding: "0 30px" }}
      className="h-[10vh] flex w-full  justify-between items-center"
    >
      <div>
        <p className="text-[#919191] font-[300] text-[20px] sm:text-[38px] leading-[40px]">
          Hello {name}
        </p>
      </div>

      {/* Menu Icon */}
      <div
        onClick={() => setMenuOpen(!menuOpen)}
        className="sm:hidden relative z-30 cursor-pointer transition-transform duration-300"
      >
        {menuOpen ? (
          <IoClose size={22} className="text-white" />
        ) : (
          <FiMenu size={18} className="text-white" />
        )}
      </div>

      {/* Sidebar Overlay */}
      <div
        className={`fixed top-0 right-0 z-20 w-full h-screen bg-[rgba(0,0,0,0.9)] sm:hidden transform transition-transform duration-500 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div
          className={`w-[80%] h-full shadow-lg p-4 transition-transform duration-500 ease-in-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
