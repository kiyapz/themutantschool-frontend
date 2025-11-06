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

  // Only use cart functionality on mission-related pages
  const [cartCount, setCartCount] = useState(0);
  const [bump, setBump] = useState(false);
  const [sparkles, setSparkles] = useState([]);
  const cartIconRef = useRef(null);

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

          // Fetch cart data for all authenticated students
          if (role === "student") {
            try {
              const response = await fetch(
                "https://themutantschool-backend.onrender.com/api/mission-cart",
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              const data = await response.json();
              const cartItemsData = data.cart.missions || [];
              setCartCount(cartItemsData.length);
            } catch (error) {
              console.log("Cart fetch failed:", error.message);
            }
          }
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

  return (
    <div className="w-full flexcenter  h-[70px] relative">
      <div
        style={{ border: "none" }}
        className="max-w-[350px] sm:max-w-[1440px] w-full h-full mx-auto flex items-center justify-center px-4 sm:px-6 lg:px-8"
      >
        <div className="flex items-center justify-between w-full">
          {/* Mobile Menu Button - Left of logo */}
          <div className="sm:hidden flex items-center mr-[2px]">
            <button
              onClick={toggleMobileMenu}
              className="md:hidden flex items-center justify-center w-9 h-9 focus:outline-none text-white bg-[var(--foreground)] rounded-md"
              aria-label="Toggle mobile menu"
            >
              <HiMenu className="text-[18px]" />
            </button>
          </div>

          {/* Logo */}
          <div className="flex items-center">
            <Link href={"/"} className="flex items-center gap-[2px] sm:gap-2">
              <span className="text-[20px] sm:text-[23px] Xirod text-[var(--primary-dark)] leading-[24px]">
                Mutant
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
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
          <div className="hidden md:flex items-center justify-center gap-1 lg:gap-4">
            {/* Show cart icon for all users, not just students */}
            <div className="flex items-center justify-center">
              <Link href={"/cart"}>
                <div
                  ref={cartIconRef}
                  className={`flex items-center justify-center w-9 h-9 rounded-md text-white bg-[var(--foreground)] hover:bg-[var(--button-hover-color)] cursor-pointer relative ${
                    bump ? "cart-bump" : ""
                  }`}
                  aria-label="Cart"
                >
                  {/* <HiShoppingCart className="text-[18px]" /> */}
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

            {isAuthenticated ? (
              <StudentProfileDropdown
                avatarUrl={avatarUrl}
                profileHref={profileHref}
              />
            ) : (
              <>
                <div className="cut-box3">
                  <Link href={"/auth/login"}>
                    <div
                      onClick={() => handleClick("signup")}
                      className={`cut-box-inner3 cursor-pointer  flex items-center justify-center text-[12px] lg:text-[13px] font-[700] px-3 py-2 ${
                        active === "signup"
                          ? "bg-white text-black"
                          : "text-white bg-[var(--foreground)] "
                      }`}
                    >
                      <button>Login</button>
                    </div>
                  </Link>
                </div>

                <div className="cut-box4">
                  <Link href={"/auth/register"}>
                    <div
                      onClick={() => handleClick("register")}
                      className={`cut-box-inner4 flex items-center justify-center text-[12px] lg:text-[13px] font-[700] cursor-pointer px-3 py-2 ${
                        active === "register"
                          ? "bg-white text-black"
                          : "text-white bg-[var(--foreground)]"
                      }`}
                    >
                      <button>Register</button>
                    </div>
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Mobile: Cart + Profile (menu moved to left) */}
          <div className="sm:hidden flex items-center justify-end gap-2">
            {/* Show cart icon for all users, not just students */}
            <div>
              <Link href={"/cart"}>
                <div
                  onClick={() => {
                    closeMobileMenu();
                  }}
                  className="flex items-center justify-center w-9 h-9 text-white bg-[var(--foreground)] rounded-md relative"
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
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed  inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu */}
      <div
        style={{ padding: "20px" }}
        className={`
                fixed top-0 right-0 h-full w-[280px] sm:w-[320px] bg-black shadow-xl transform transition-transform duration-300 ease-in-out z-50 md:hidden overflow-y-auto
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
                    className="w-full text-left  text-[14px] leading-[24px] text-[var(--link-color)] hover:text-[var(--button-hover-color)] transition-colors duration-200 py-2"
                  >
                    MISSIONS
                  </button>
                </li>
              </Link>

              <Link href="/the-lab">
                <li>
                  <button
                    onClick={closeMobileMenu}
                    className="w-full text-left  text-[14px] leading-[24px] text-[var(--link-color)] hover:text-[var(--button-hover-color)] transition-colors duration-200 py-2"
                  >
                    THE LAB
                  </button>
                </li>
              </Link>
              <Link href="/hall-of-the-mutants">
                <li>
                  <button
                    onClick={closeMobileMenu}
                    className="w-full text-left  text-[14px] leading-[24px] text-[var(--link-color)] hover:text-[var(--button-hover-color)] transition-colors duration-200 py-2"
                  >
                    HALL OF MUTANTS
                  </button>
                </li>
              </Link>
            </ul>
          </nav>

          {/* Mobile Auth (only for guests; profile lives in navbar now) */}
          {!isAuthenticated && (
            <div className="flex flex-col gap-3 px-4 pb-4">
              <div className="cut-box3">
                <Link href={"/auth/login"}>
                  <div
                    onClick={() => {
                      handleClick("signup");
                      closeMobileMenu();
                    }}
                    className={`cut-box-inner3 cursor-pointer flex items-center justify-center text-[12px] font-[700] px-3 py-2 ${
                      active === "signup"
                        ? "bg-white text-black"
                        : "text-white bg-[var(--foreground)] "
                    }`}
                  >
                    <button>Login</button>
                  </div>
                </Link>
              </div>

              <div className="cut-box4">
                <Link href={"/auth/register"}>
                  <div
                    onClick={() => {
                      handleClick("register");
                      closeMobileMenu();
                    }}
                    className={`cut-box-inner4 flex items-center justify-center text-[12px] font-[700] cursor-pointer px-3 py-2 ${
                      active === "register"
                        ? "bg-white text-black"
                        : "text-white bg-[var(--foreground)]"
                    }`}
                  >
                    <button>Register</button>
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
