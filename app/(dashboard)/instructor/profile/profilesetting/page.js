"use client";

import Link from "next/link";
import { InstructorContext } from "../../_components/context/InstructorContex";
import { useContext, useState } from "react";
import ChangePasswordValue from "./_components/ChangePassword";
import UserProfileImage from "../_components/UserProfileImage";

export default function Profilesetting() {
  const { profiledisplay, setprofiledisplay, userUpdatedValue } =
    useContext(InstructorContext);

  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="h-fit w-full max-w-[1200px] flex flex-col gap-[10px] ">
      <p className="hidden sm:block text-[var(--sidebar-hovercolor)] font-[600] text-[42px] leading-[40px]">
        My Profile
      </p>
      <p className="hidden sm:block text-[var(--small-textcolor)] text-[13px] font-[600] leading-[40px]">
        You can update your personal details here
      </p>

      <div
        style={{ background: "linear-gradient(to right, #592BC3, #952CC5)" }}
        className="h-[218.12px] w-full rounded-b-[40px] sm:hidden"
      ></div>

      <div
        style={{ marginBottom: "15px", margin: "auto" }}
        className="h-fit w-[95%] relative z-20 top-[-80px] sm:top-[10px]"
      >
        <div className="grid w-full gap-3 xl:grid-cols-4">
          {/* Sidebar */}
          <div
            style={{
              paddingLeft: "35px",
              paddingTop: "40px",
              paddingBottom: "15px",
              paddingRight: "10px",
            }}
            className="bg-[var(--black-background)] xl:flex flex-col gap-5 hidden"
          >
            <div className="flexcenter w-full h-fit flex-col gap-3">
              <div className="h-[150px] w-[150px] xl:h-[180px] xl:w-[180px]">
                <UserProfileImage />
              </div>

              <div className="text-center">
                <p className="font-[600] text-[26px] sm:text-[25px] leading-[150%]">
                  {userUpdatedValue?.firstName || "First"}{" "}
                  <span>{userUpdatedValue?.lastName || "Last"}</span>
                </p>
                <p className="text-[17px] text-[var(--button-border-color)] sm:text-[15px] leading-[150%]">
                  {userUpdatedValue?.headline || "Product Designer || Tutor"}
                </p>
              </div>
            </div>

            <div className="bg-[#323232] w-full h-[1px] "></div>

            <div
              style={{
                paddingLeft: "35px",
                paddingTop: "40px",
                paddingRight: "10px",
              }}
              className="bg-[var(--black-background)] flex flex-col space-y-[20px] hidden xl:block"
            >
              <Link href="/instructor/profile">
                <div
                  onClick={() => setprofiledisplay("Personal Information")}
                  className={`${
                    profiledisplay === "Personal Information"
                      ? "text-[#8D5FCA]"
                      : "text-[var(--coco-color)]"
                  } hover:text-[#8D5FCA] cursor-pointer w-full flex items-center justify-between text-[15px] leading-[150%] font-[600]`}
                >
                  Personal Information
                  <p>{` >`} </p>
                </div>
              </Link>

              <Link href="/instructor/profile/notification">
                <div
                  onClick={() => setprofiledisplay("Notifications")}
                  style={{ marginTop: "20px", marginBottom: "20px" }}
                  className={`${
                    profiledisplay === "Notifications"
                      ? "text-[#8D5FCA]"
                      : "text-[var(--coco-color)]"
                  } hover:text-[#8D5FCA] flex items-center justify-between cursor-pointer text-[15px] leading-[150%] font-[600]`}
                >
                  Notifications
                  <p>{` >`} </p>
                </div>
              </Link>

              <Link href="/instructor/profile/profilesetting">
                <div
                  onClick={() => setprofiledisplay("Security Settings")}
                  className={`${
                    profiledisplay === "Security Settings"
                      ? "text-[#8D5FCA]"
                      : "text-[var(--coco-color)]"
                  } hover:text-[#8D5FCA] flex items-center justify-between cursor-pointer text-[15px] leading-[150%] font-[600]`}
                >
                  Security Settings
                  <p>{` >`} </p>
                </div>
              </Link>
            </div>
          </div>

          {/* Security Settings Panel */}
          <div
            style={{ padding: "15px" }}
            className="flex bg-[var(--black-background)] flex-col gap-5 sm:col-span-3 h-fit w-full"
          >
            <p className="font-[700] text-[17px] leading-[40px]">
              Security Settings
            </p>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-[#323232]">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-6 py-3 font-semibold transition-all duration-300 border-b-2 ${
                  activeTab === "overview"
                    ? "border-[#8D5FCA] text-[#8D5FCA]"
                    : "border-transparent text-[#999999] hover:text-white"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("change-password")}
                className={`px-6 py-3 font-semibold transition-all duration-300 border-b-2 ${
                  activeTab === "change-password"
                    ? "border-[#8D5FCA] text-[#8D5FCA]"
                    : "border-transparent text-[#999999] hover:text-white"
                }`}
              >
                Change Password
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "overview" ? (
              <div>
                <div
                  style={{ padding: "10px" }}
                  className="border w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 min-h-[121.39px] border-[#B2B2B221] rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">🔐</span>
                      <p className="font-[600] text-[19px] leading-[150%]">
                        Change Password
                      </p>
                    </div>
                    <p className="text-[#4B4B4B] text-[16px] leading-[150%]">
                      Set a unique password to protect your lab
                    </p>
                  </div>
                  <div>
                    <button
                      onClick={() => setActiveTab("change-password")}
                      style={{ padding: "10px 20px" }}
                      className="bg-[#604196] text-[13px] rounded-[8px] hover:bg-[#7051a8] transition-all whitespace-nowrap"
                    >
                      Change Password
                    </button>
                  </div>
                </div>

                <div
                  style={{ padding: "10px", marginTop: "20px" }}
                  className="border w-full flex items-start gap-3 min-h-[121.39px] border-[#B2B2B221] rounded-lg"
                >
                  <span className="text-2xl">🔒</span>
                  <div>
                    <h3 className="font-[600] text-[19px] leading-[150%] mb-2">
                      Two-Factor Authentication
                    </h3>
                    <p className="text-[#4B4B4B] text-[16px] leading-[150%] mb-3">
                      Add an extra layer of security to your account
                    </p>
                    <span className="text-sm text-[#999999] italic">
                      Coming soon...
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <ChangePasswordValue onBack={() => setActiveTab("overview")} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
