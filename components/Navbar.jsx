"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/mutantcart/CartContext";
import { HiMenu, HiShoppingCart } from "react-icons/hi";
import Image from "next/image";
import StudentProfileDropdown from "./StudentProfileDropdown";

export default function Navbar() {
  const [active, setActive] = useState("register");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("/images/default-avatar.jpg");
  const [profileHref, setProfileHref] = useState("/");
  const [isMissionPage, setIsMissionPage] = useState(false);

  // Use cart context for real-time cart count updates
  const { cartCount } = useCart();
  const [bump, setBump] = useState(false);
  const [sparkles, setSparkles] = useState([]);
  const cartIconRef = useRef(null);
  const prevCartCountRef = useRef(0);

  const handleClick = (btn) => {
    setActive(btn);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    // Check if we're on a mission-related page
    const pathname = window.location.pathname;
    const isMissionPath =
      pathname.includes("/mission") || pathname.includes("/missions");
    setIsMissionPage(isMissionPath);

    const initializeUser = async () => {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("login-accessToken")
            : null;
        const rawUser =
          typeof window !== "undefined" ? localStorage.getItem("USER") : null;

        if (token && rawUser) {
          setIsAuthenticated(true);
          const user = JSON.parse(rawUser);
          const role = user?.role;
          setIsStudent(role === "student");
          setProfileHref(
            role === "student"
              ? "/student/dashboard"
              : role === "instructor"
              ? "/instructor"
              : "/"
          );
          const possibleAvatar =
            user?.profile?.avatar?.url ||
            user?.avatar?.url ||
            user?.profileImage ||
            user?.profile?.photo?.url ||
            "/images/default-avatar.jpg";
          setAvatarUrl(possibleAvatar);
        } else {
          setIsAuthenticated(false);
          setAvatarUrl("/images/default-avatar.jpg");
          setProfileHref("/auth/login");
        }
      } catch (e) {
        setIsAuthenticated(false);
        setAvatarUrl("/images/default-avatar.jpg");
        setProfileHref("/auth/login");
      }
    };

    initializeUser();
  }, []);

  // Listen for cart changes and trigger animation
  useEffect(() => {
    // Trigger bump animation when cart count increases
    if (cartCount > prevCartCountRef.current && prevCartCountRef.current > 0) {
      setBump(true);
      setTimeout(() => setBump(false), 300);

      // Add sparkle effects
      const newSparkles = Array.from({ length: 5 }, (_, i) => ({
        id: Date.now() + i,
        left: Math.random() * 20 - 10,
        top: Math.random() * 20 - 10,
      }));
      setSparkles(newSparkles);
      setTimeout(() => setSparkles([]), 600);
    }
    prevCartCountRef.current = cartCount;
  }, [cartCount]);

  return (
    <div className="w-full flexcenter  h-[70px] relative">
      <div
        style={{ border: "none" }}
        className="max-w-[350px] sm:max-w-[1440px] w-full h-full mx-auto flex items-center justify-center px-4 sm:px-6 lg:px-8"
      >
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <div className="flex items-center">
            <Link href={"/"} className="flex items-center gap-[2px] sm:gap-2">
              <Image
                src={"/images/mutantlogo.png"}
                alt="Mutant School Logo"
                width={60} // Further reduced width for mobile
                height={24} // Further reduced height for mobile
                sizes="(max-width: 640px) 60px, 100px" // Updated responsive sizing
                className="sm:w-[100px] sm:h-[40px]" // Larger size for small screens and above
                priority={true} // Prioritize loading of the logo
              />
            </Link>
          </div>

          {/* Right section for mobile: Mobile Menu Button + Cart + Profile */}
          <div className="flex items-center lg:hidden gap-[2px]">
            {/* Mobile: Cart + Profile */}
            <div className="flex items-center justify-end gap-[2px]">
              {/* Show cart icon for all users, not just students */}
              <div>
                <Link href={"/cart"}>
                  <div
                    ref={cartIconRef}
                    className={`flex items-center justify-center w-9 h-9 rounded-md text-white bg-[var(--foreground)] hover:bg-[var(--button-hover-color)] cursor-pointer relative ${
                      bump ? "cart-bump" : ""
                    }`}
                    aria-label="Cart"
                  >
                    <Image
                      src={"/images/cart.png"}
                      alt="cart"
                      width={18}
                      height={18}
                    />

                    {/* Cart count badge */}
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                        {cartCount}
                      </span>
                    )}

                    {/* sparkles */}
                    {sparkles.map((s) => (
                      <span
                        key={s.id}
                        className="cart-sparkle"
                        style={{
                          transform: `translate(${s.left}px, ${s.top}px)`,
                        }}
                      >
                        ✨
                      </span>
                    ))}
                  </div>
                </Link>
              </div>

              {/* Mobile Profile (show on navbar, not inside slide-out menu) */}
              {isAuthenticated && (
                <div className="flex items-center w-9 h-9">
                  <StudentProfileDropdown
                    avatarUrl={avatarUrl}
                    profileHref={profileHref}
                  />
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="flex items-center justify-center w-9 h-9 focus:outline-none text-white bg-[var(--foreground)] rounded-md"
                aria-label="Toggle mobile menu"
              >
                <HiMenu className="text-[18px]" />
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:block">
            <ul className="flex gap-4 xl:gap-6">
              <Link href={"/missions"}>
                <li className="Xirod cursor-pointer text-[11px] xl:text-[12px] leading-[24px] text-[var(--link-color)] hover:text-[var(--button-hover-color)] transition-colors duration-200">
                  MISSIONS
                </li>
              </Link>

              <Link href="/the-lab">
                <li className="Xirod cursor-pointer text-[11px] xl:text-[12px] leading-[24px] text-[var(--link-color)] hover:text-[var(--button-hover-color)] transition-colors duration-200">
                  THE LAB
                </li>
              </Link>
              <Link href="/hall-of-the-mutants">
                <li className="Xirod cursor-pointer text-[11px] xl:text-[12px] leading-[24px] text-[var(--link-color)] hover:text-[var(--button-hover-color)] transition-colors duration-200">
                  HALL OF MUTANTS
                </li>
              </Link>
            </ul>
          </nav>

          {/* Desktop Auth / Profile */}
          <div className="hidden lg:flex items-center justify-center gap-1 lg:gap-4">
            {isAuthenticated ? (
              <StudentProfileDropdown
                avatarUrl={avatarUrl}
                profileHref={profileHref}
              />
            ) : (
              <>
                <Link href={"/auth/login"}>
                  <div className=" w-[100px] text-black cut-box33 flexcenter  border-2 border-white h-[40px]">
                    <button
                      onClick={() => handleClick("signup")}
                      className={`w-[100%] h-full cursor-pointer cut-box34  ${
                        active === "signup"
                          ? "bg-white text-black"
                          : "text-white bg-[var(--foreground)] "
                      }`}
                    >
                      Login
                    </button>
                  </div>
                </Link>

                <Link href={"/auth/register"}>
                  <div className=" w-[100px] text-black cut-box35 flexcenter  border-2 border-white h-[40px]">
                    <button
                      onClick={() => handleClick("register")}
                      className={`w-[100%] h-full cursor-pointer cut-box36  ${
                        active === "register"
                          ? "bg-white text-black"
                          : "text-white bg-[var(--foreground)] "
                      }`}
                    >
                      Register
                    </button>
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed  inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu */}
      <div
        style={{ padding: "20px" }}
        className={`
                fixed top-0 right-0 h-full w-[320px] sm:w-[360px] bg-black shadow-xl transform transition-transform duration-300 ease-in-out z-50 lg:hidden overflow-y-auto
                ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}
            `}
      >
        <div className="flex flex-col gap-6 h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 ">
            <span className="text-[20px] Xirod text-[var(--primary-dark)]">
              Menu
            </span>
            <button
              onClick={closeMobileMenu}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--accent)] transition-colors"
              aria-label="Close menu"
            >
              <span className="text-[var(--link-color)] text-xl">×</span>
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-8">
              <Link href={"/missions"}>
                <li>
                  <button
                    onClick={closeMobileMenu}
                    className="w-full text-left text-[14px] leading-[24px] text-[var(--link-color)] hover:text-[var(--button-hover-color)] transition-colors duration-200 py-2"
                  >
                    MISSIONS
                  </button>
                </li>
              </Link>

              <Link href="/the-lab">
                <li>
                  <button
                    onClick={closeMobileMenu}
                    className="w-full text-left text-[14px] leading-[24px] text-[var(--link-color)] hover:text-[var(--button-hover-color)] transition-colors duration-200 py-2"
                  >
                    THE LAB
                  </button>
                </li>
              </Link>
              <Link href="/hall-of-the-mutants">
                <li>
                  <button
                    onClick={closeMobileMenu}
                    className="w-full text-left text-[14px] leading-[24px] text-[var(--link-color)] hover:text-[var(--button-hover-color)] transition-colors duration-200 py-2"
                  >
                    HALL OF MUTANTS
                  </button>
                </li>
              </Link>
            </ul>
          </nav>

          {/* Mobile Auth (only for guests; profile lives in navbar now) */}
          {!isAuthenticated && (
            <div className="grid grid-cols-2 gap-3 px-4 pb-4 justify-items-center">
              <Link href={"/auth/login"}>
                <div className=" w-[100px] text-black cut-box33 flexcenter  border-2 border-white h-[40px]">
                  <button
                    onClick={() => {
                      handleClick("signup");
                      closeMobileMenu();
                    }}
                    className={`w-[100%] h-full cursor-pointer cut-box34  ${
                      active === "signup"
                        ? "bg-white text-black"
                        : "text-white bg-[var(--foreground)] "
                    }`}
                  >
                    Login
                  </button>
                </div>
              </Link>
              <Link href={"/auth/register"}>
                <div className=" w-[100px] text-black cut-box35 flexcenter  border-2 border-white h-[40px]">
                  <button
                    onClick={() => {
                      handleClick("register");
                      closeMobileMenu();
                    }}
                    className={`w-[100%] h-full cursor-pointer cut-box36  ${
                      active === "register"
                        ? "bg-white text-black"
                        : "text-white bg-[var(--foreground)] "
                    }`}
                  >
                    Register
                  </button>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}