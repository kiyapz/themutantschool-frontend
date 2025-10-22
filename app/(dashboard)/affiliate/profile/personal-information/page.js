"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ShareIcon,
  DocumentDuplicateIcon,
  PencilIcon,
  XMarkIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

export default function PersonalInformationPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const pathname = usePathname();

  const [profileData, setProfileData] = useState({
    name: "Etieno Ekanem",
    email: "etienodouglas@gmail.com",
    phone: "+234 (0) 9129495797",
    gender: "Male",
    nationality: "Nigerian",
    dateOfBirth: "2000-02-12",
    language: "English (UK)",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  });

  const copyReferralLink = () => {
    navigator.clipboard.writeText("themutantschool.com/abdulrahmanassan/r...");
    // Add toast notification here
  };

  const shareReferralLink = () => {
    // Add share functionality here
  };

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = () => {
    // Handle saving profile data here
    console.log("Saving profile:", profileData);
    setIsModalOpen(false);
    // You can add API call here to save the data
  };

  const handleCancelEdit = () => {
    setIsModalOpen(false);
    setActiveTab("personal"); // Reset to first tab
    // Reset form data if needed
  };

  const tabs = [
    {
      id: "personal",
      name: "Personal Info",
      icon: UserIcon,
    },
    {
      id: "contact",
      name: "Contact",
      icon: PhoneIcon,
    },
    {
      id: "preferences",
      name: "Preferences",
      icon: GlobeAltIcon,
    },
  ];

  const profileNavItems = [
    {
      name: "Personal Information",
      href: "/affiliate/profile/personal-information",
    },
    { name: "Notifications", href: "/affiliate/profile/notifications" },
    {
      name: "Payment Information",
      href: "/affiliate/profile/payment-information",
    },
    { name: "Security Settings", href: "/affiliate/profile/security-settings" },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Profile Navigation */}
      <div className="w-full h-full lg:w-64">
        <div className="rounded-lg p-4" style={{ backgroundColor: "#0F0F0F" }}>
          <nav className="space-y-2">
            {profileNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "text-purple-400"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Profile Content */}
      <div className="flex-1">
        {/* User Card */}
        <div
          className="rounded-lg p-6 mb-8"
          style={{ backgroundColor: "#0F0F0F" }}
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div className="flex items-center space-x-6 mb-6 lg:mb-0">
              {/* Profile Picture */}
              <div className="w-24 h-24 rounded-full overflow-hidden">
                <Image
                  src="/images/default-avatar.jpg"
                  alt="Etieno Ekanem"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* User Info */}
              <div>
                <h2 className="text-2xl font-bold mb-2">{profileData.name}</h2>
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-2">Referral Link</p>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 flex-col rounded-lg px-4 gap-2 py-2">
                      <p className="text-purple-400 font-mono text-sm">
                        themutantschool.com/abdulrahmanassan/r...
                      </p>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={shareReferralLink}
                          className="px-4 py-2 rounded-lg flex items-center text-[#A5A5A5] space-x-2 transition-colors"
                          style={{ backgroundColor: "#1A1A1A" }}
                        >
                          <ShareIcon className="h-4 w-4" />
                          <span className="text-sm">Share</span>
                        </button>
                        <button
                          onClick={copyReferralLink}
                          className="px-4 py-2 rounded-lg flex items-center text-[#A5A5A5] space-x-2 transition-colors"
                          style={{ backgroundColor: "#1A1A1A" }}
                        >
                          <DocumentDuplicateIcon className="h-4 w-4" />
                          <span className="text-sm">Copy</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Profile Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 rounded-lg text-white font-medium flex items-center space-x-2 transition-all duration-200"
              style={{ backgroundColor: "#7343B3" }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#9159d1";
                e.target.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#7343B3";
                e.target.style.transform = "scale(1)";
              }}
            >
              <PencilIcon className="h-4 w-4" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Bio Section */}
        <div
          className="rounded-lg p-6 mb-8"
          style={{ backgroundColor: "#0F0F0F" }}
        >
          <h2 className="text-xl font-semibold mb-4">Bio</h2>
          <p className="text-gray-400">{profileData.bio}</p>
        </div>

        {/* Personal Information */}
        <div className="rounded-lg p-6" style={{ backgroundColor: "#0F0F0F" }}>
          <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-2 py-3 ">
              <span className="text-gray-400">Email Address</span>
              <span className="text-white">{profileData.email}</span>
            </div>
            <div className="grid grid-cols-2 py-3 ">
              <span className="text-gray-400">Phone Number</span>
              <span className="text-white">{profileData.phone}</span>
            </div>
            <div className="grid grid-cols-2 py-3 ">
              <span className="text-gray-400">Gender</span>
              <span className="text-white">{profileData.gender}</span>
            </div>
            <div className="grid grid-cols-2 py-3 ">
              <span className="text-gray-400">Nationality</span>
              <span className="text-white">{profileData.nationality}</span>
            </div>
            <div className="grid grid-cols-2 py-3 ">
              <span className="text-gray-400">Date Of Birth</span>
              <span className="text-white">
                {new Date(profileData.dateOfBirth)
                  .toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                  .toUpperCase()}
              </span>
            </div>
            <div className="grid grid-cols-2 py-3 ">
              <span className="text-gray-400">Preferred Language</span>
              <span className="text-white">{profileData.language}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className="w-full max-w-2xl rounded-lg shadow-lg"
            style={{ backgroundColor: "#0F0F0F" }}
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between p-6 border-b"
              style={{ borderColor: "#1A1A1A" }}
            >
              <h2 className="text-xl font-semibold text-white">Edit Profile</h2>
              <button
                onClick={handleCancelEdit}
                className="p-2 rounded-lg transition-all duration-200"
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
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b" style={{ borderColor: "#1A1A1A" }}>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                      isActive ? "text-purple-400" : "text-gray-400"
                    }`}
                    style={{
                      backgroundColor: isActive ? "#0C0C0C" : "transparent",
                      borderBottom: isActive
                        ? "2px solid #7343B3"
                        : "2px solid transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.target.style.color = "#FFFFFF";
                        e.target.style.backgroundColor = "#1A1A1A";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.target.style.color = "#9B9B9B";
                        e.target.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="p-6 max-h-96 overflow-y-auto scrollbar-hide">
              {activeTab === "personal" && (
                <div className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      <UserIcon className="h-4 w-4 inline mr-2" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="w-full px-4 py-3 rounded-lg text-white transition-all duration-200"
                      style={{
                        backgroundColor: "#000000",
                        border: "1px solid #1A1A1A",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#7343B3")}
                      onBlur={(e) => (e.target.style.borderColor = "#1A1A1A")}
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Gender
                    </label>
                    <select
                      value={profileData.gender}
                      onChange={(e) =>
                        handleInputChange("gender", e.target.value)
                      }
                      className="w-full px-4 py-3 rounded-lg text-white transition-all duration-200"
                      style={{
                        backgroundColor: "#000000",
                        border: "1px solid #1A1A1A",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#7343B3")}
                      onBlur={(e) => (e.target.style.borderColor = "#1A1A1A")}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      <CalendarIcon className="h-4 w-4 inline mr-2" />
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={(e) =>
                        handleInputChange("dateOfBirth", e.target.value)
                      }
                      className="w-full px-4 py-3 rounded-lg text-white transition-all duration-200"
                      style={{
                        backgroundColor: "#000000",
                        border: "1px solid #1A1A1A",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#7343B3")}
                      onBlur={(e) => (e.target.style.borderColor = "#1A1A1A")}
                    />
                  </div>

                  {/* Nationality */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      <GlobeAltIcon className="h-4 w-4 inline mr-2" />
                      Nationality
                    </label>
                    <input
                      type="text"
                      value={profileData.nationality}
                      onChange={(e) =>
                        handleInputChange("nationality", e.target.value)
                      }
                      className="w-full px-4 py-3 rounded-lg text-white transition-all duration-200"
                      style={{
                        backgroundColor: "#000000",
                        border: "1px solid #1A1A1A",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#7343B3")}
                      onBlur={(e) => (e.target.style.borderColor = "#1A1A1A")}
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg text-white transition-all duration-200 resize-none"
                      style={{
                        backgroundColor: "#000000",
                        border: "1px solid #1A1A1A",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#7343B3")}
                      onBlur={(e) => (e.target.style.borderColor = "#1A1A1A")}
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>
              )}

              {activeTab === "contact" && (
                <div className="space-y-6">
                  {/* Email */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      <EnvelopeIcon className="h-4 w-4 inline mr-2" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="w-full px-4 py-3 rounded-lg text-white transition-all duration-200"
                      style={{
                        backgroundColor: "#000000",
                        border: "1px solid #1A1A1A",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#7343B3")}
                      onBlur={(e) => (e.target.style.borderColor = "#1A1A1A")}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      <PhoneIcon className="h-4 w-4 inline mr-2" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="w-full px-4 py-3 rounded-lg text-white transition-all duration-200"
                      style={{
                        backgroundColor: "#000000",
                        border: "1px solid #1A1A1A",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#7343B3")}
                      onBlur={(e) => (e.target.style.borderColor = "#1A1A1A")}
                    />
                  </div>
                </div>
              )}

              {activeTab === "preferences" && (
                <div className="space-y-6">
                  {/* Language */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Preferred Language
                    </label>
                    <select
                      value={profileData.language}
                      onChange={(e) =>
                        handleInputChange("language", e.target.value)
                      }
                      className="w-full px-4 py-3 rounded-lg text-white transition-all duration-200"
                      style={{
                        backgroundColor: "#000000",
                        border: "1px solid #1A1A1A",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#7343B3")}
                      onBlur={(e) => (e.target.style.borderColor = "#1A1A1A")}
                    >
                      <option value="English (UK)">English (UK)</option>
                      <option value="English (US)">English (US)</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div
              className="flex justify-end space-x-3 p-6 border-t"
              style={{ borderColor: "#1A1A1A" }}
            >
              <button
                onClick={handleCancelEdit}
                className="px-6 py-3 rounded-lg text-white font-medium transition-all duration-200"
                style={{ backgroundColor: "#2A2A2A" }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#404040";
                  e.target.style.transform = "scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#2A2A2A";
                  e.target.style.transform = "scale(1)";
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-6 py-3 rounded-lg text-white font-medium transition-all duration-200"
                style={{ backgroundColor: "#7343B3" }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#9159d1";
                  e.target.style.transform = "scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#7343B3";
                  e.target.style.transform = "scale(1)";
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
