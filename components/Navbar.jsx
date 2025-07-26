"use client";
import Link from "next/link";
import { useState } from "react";
import { HiMenu } from "react-icons/hi";

export default function Navbar() {
  const [active, setActive] = useState("register");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleClick = (btn) => {
    setActive(btn);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="w-full flexcenter  h-[70px] relative">
      <div style={{border:'none'}} className="max-w-[350px] px sm:max-w-[1440px] w-full h-full mx-auto flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <div className="flex items-center">
            <Link href={"/"} className="flex items-center gap-2">
              <span className="text-[20px] sm:text-[23px] Xirod text-[var(--primary-dark)] leading-[24px]">
                Mutant
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:block">
            <ul className="flex gap-4 xl:gap-6">
              <li className="Xirod cursor-pointer text-[11px] xl:text-[12px] leading-[24px] text-[var(--link-color)] hover:text-[var(--button-hover-color)] transition-colors duration-200">
                MISSIONS
              </li>
              <li className="Xirod cursor-pointer text-[11px] xl:text-[12px] leading-[24px] text-[var(--link-color)] hover:text-[var(--button-hover-color)] transition-colors duration-200">
                THE LAB
              </li>
              <li className="Xirod cursor-pointer text-[11px] xl:text-[12px] leading-[24px] text-[var(--link-color)] hover:text-[var(--button-hover-color)] transition-colors duration-200">
                HALL OF MUTANTS
              </li>
              <li className="Xirod cursor-pointer text-[11px] xl:text-[12px] leading-[24px] text-[var(--link-color)] hover:text-[var(--button-hover-color)] transition-colors duration-200">
                ROADMAP
              </li>
              <li className="Xirod cursor-pointer text-[11px] xl:text-[12px] leading-[24px] text-[var(--link-color)] hover:text-[var(--button-hover-color)] transition-colors duration-200">
                ABOUT
              </li>
            </ul>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            <div className="cut-box3">
              <Link href={"/Login"}>
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
              <Link href={"/Register"}>
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
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden flex flex-col items-center justify-center w-8 h-8 space-y-1 focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            <span
              className={`block w-5 h-0.5  transition-all duration-300 ${
                isMobileMenuOpen ? "opacity-0" : ""
              }`}
            >
              <HiMenu />
            </span>
          </button>
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
                fixed top-0 right-0 px h-full w-[280px] sm:w-[320px]  shadow-xl transform transition-transform duration-300 ease-in-out z-50 md:hidden
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
              <li>
                <button
                  onClick={closeMobileMenu}
                  className="w-full text-left  text-[14px] leading-[24px] text-[var(--link-color)] hover:text-[var(--button-hover-color)] transition-colors duration-200 py-2"
                >
                  MISSIONS
                </button>
              </li>
              <li>
                <button
                  onClick={closeMobileMenu}
                  className="w-full text-left  text-[14px] leading-[24px] text-[var(--link-color)] hover:text-[var(--button-hover-color)] transition-colors duration-200 py-2"
                >
                  THE LAB
                </button>
              </li>
              <li>
                <button
                  onClick={closeMobileMenu}
                  className="w-full text-left  text-[14px] leading-[24px] text-[var(--link-color)] hover:text-[var(--button-hover-color)] transition-colors duration-200 py-2"
                >
                  HALL OF MUTANTS
                </button>
              </li>
              <li>
                <button
                  onClick={closeMobileMenu}
                  className="w-full text-left  text-[14px] leading-[24px] text-[var(--link-color)] hover:text-[var(--button-hover-color)] transition-colors duration-200 py-2"
                >
                  ROADMAP
                </button>
              </li>
              <li>
                <button
                  onClick={closeMobileMenu}
                  className="w-full text-left  text-[14px] leading-[24px] text-[var(--link-color)] hover:text-[var(--button-hover-color)] transition-colors duration-200 py-2"
                >
                  ABOUT
                </button>
              </li>
            </ul>
          </nav>

          {/* Mobile Auth Buttons - FIXED: Removed hidden class */}
          <div className="flex flex-col gap-3 px-4 pb-4">
            <div className="cut-box3">
              <Link href={"/Login"}>
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
              <Link href={"/Register"}>
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
        </div>
      </div>
    </div>
  );
}
