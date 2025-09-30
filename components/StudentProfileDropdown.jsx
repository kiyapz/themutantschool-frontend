"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function StudentProfileDropdown({
  avatarUrl,
  profileHref,
  onItemClick,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [studentLevel, setStudentLevel] = useState("Novice");
  const dropdownRef = useRef(null);

  // Get student name and determine level from localStorage
  useEffect(() => {
    const user = localStorage.getItem("USER");
    if (user) {
      const userData = JSON.parse(user);
      const { firstName } = userData;
      setStudentName(firstName || "Student");

      // Determine if student is Expert or Novice based on available data
      // You can modify this logic based on your actual user data structure
      const isExpert =
        userData.level >= 5 ||
        userData.completedMissions >= 10 ||
        userData.experience >= 1000 ||
        userData.role === "expert";

      setStudentLevel(isExpert ? "Expert" : "Novice");
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("login-accessToken");
    localStorage.removeItem("USER");
    window.location.href = "/";
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Image Button */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="w-9 h-9 rounded-full overflow-hidden border border-[#3A3A3A] cursor-pointer hover:border-[#555555] transition-colors duration-200 focus:outline-none"
        type="button"
      >
        <img
          src={avatarUrl}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: "0",
            marginTop: "8px",
            width: "200px",
            backgroundColor: "var(--foreground)",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            zIndex: 50,
            overflow: "hidden",
          }}
        >
          {/* Profile Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              padding: "16px",
              borderBottom: "1px solid #404040",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "1px solid #3A3A3A",
              }}
            >
              <img
                src={avatarUrl}
                alt="Profile"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "600",
                  margin: "0",
                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
                }}
              >
                {studentName}
              </p>
              <p
                style={{
                  color: studentLevel === "Expert" ? "#00ff88" : "#B0B0B0",
                  fontSize: "12px",
                  margin: "0",
                  fontWeight: "500",
                  textShadow:
                    studentLevel === "Expert"
                      ? "0 0 8px rgba(0, 255, 136, 0.3)"
                      : "none",
                }}
              >
                {studentLevel}
              </p>
            </div>
          </div>

          {/* Menu Items */}
          <ul style={{ padding: "8px 0", margin: "0" }}>
            <li>
              <Link
                href={profileHref}
                onClick={() => {
                  setIsDropdownOpen(false);
                  if (onItemClick) onItemClick();
                }}
                style={{
                  display: "block",
                  padding: "12px 20px",
                  color: "#D0D0D0",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  borderLeft: "3px solid transparent",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                  e.target.style.borderLeftColor =
                    "var(--mutant-color, #00ff88)";
                  e.target.style.color = "white";
                  e.target.style.paddingLeft = "24px";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.borderLeftColor = "transparent";
                  e.target.style.color = "#D0D0D0";
                  e.target.style.paddingLeft = "20px";
                }}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="http://localhost:3000/student/student-dashboard/student-profile"
                onClick={() => {
                  setIsDropdownOpen(false);
                  if (onItemClick) onItemClick();
                }}
                style={{
                  display: "block",
                  padding: "12px 20px",
                  color: "#D0D0D0",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  borderLeft: "3px solid transparent",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                  e.target.style.borderLeftColor =
                    "var(--mutant-color, #00ff88)";
                  e.target.style.color = "white";
                  e.target.style.paddingLeft = "24px";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.borderLeftColor = "transparent";
                  e.target.style.color = "#D0D0D0";
                  e.target.style.paddingLeft = "20px";
                }}
              >
                My Profile
              </Link>
            </li>
            <li>
              <Link
                href="http://localhost:3000/student/student-dashboard/mutation-student-setting"
                onClick={() => {
                  setIsDropdownOpen(false);
                  if (onItemClick) onItemClick();
                }}
                style={{
                  display: "block",
                  padding: "12px 20px",
                  color: "#D0D0D0",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  borderLeft: "3px solid transparent",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                  e.target.style.borderLeftColor =
                    "var(--mutant-color, #00ff88)";
                  e.target.style.color = "white";
                  e.target.style.paddingLeft = "24px";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.borderLeftColor = "transparent";
                  e.target.style.color = "#D0D0D0";
                  e.target.style.paddingLeft = "20px";
                }}
              >
                Settings
              </Link>
            </li>
            <li style={{ borderTop: "1px solid #404040", marginTop: "4px" }}>
              <button
                onClick={() => {
                  handleLogout();
                  setIsDropdownOpen(false);
                  if (onItemClick) onItemClick();
                }}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "12px 20px",
                  color: "#D0D0D0",
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  borderLeft: "3px solid transparent",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "rgba(255, 100, 100, 0.1)";
                  e.target.style.borderLeftColor = "#ff6b6b";
                  e.target.style.color = "#ff6b6b";
                  e.target.style.paddingLeft = "24px";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.borderLeftColor = "transparent";
                  e.target.style.color = "#D0D0D0";
                  e.target.style.paddingLeft = "20px";
                }}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
