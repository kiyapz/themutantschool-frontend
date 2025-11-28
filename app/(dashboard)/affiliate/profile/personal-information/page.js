"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import api from "@/lib/api";
import {
  DocumentDuplicateIcon,
  PencilIcon,
  XMarkIcon,
  UserIcon,
  EnvelopeIcon,
  CalendarIcon,
  GlobeAltIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";

export default function PersonalInformationPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const fileInputRef = useRef(null);
  const languageDropdownRef = useRef(null);
  const countryDropdownRef = useRef(null);
  const pathname = usePathname();

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    name: "",
    email: "",
    gender: "",
    country: "",
    dateOfBirth: "",
    language: "English (UK)",
    bio: "",
    avatar: "",
    referralCode: "",
    socialLinks: {
      website: "",
      twitter: "",
      linkedin: "",
      facebook: "",
      instagram: "",
      youtube: "",
    },
  });

  // Fetch current user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get current user from localStorage
        const userStr = localStorage.getItem("USER");
        if (!userStr) {
          setError("User not found. Please login again.");
          setLoading(false);
          return;
        }

        const user = JSON.parse(userStr);
        const userId = user._id || user.id;

        if (!userId) {
          setError("User ID not found.");
          setLoading(false);
          return;
        }

        // Fetch user profile
        const response = await api.get(`/user-profile/${userId}`);
        const userData = response.data?.data || response.data;

        if (userData) {
          const avatarUrl = 
            userData.profile?.avatar?.url ||
            userData.profile?.avatar?.secure_url ||
            userData.profile?.avatarUrl ||
            userData.avatar?.url ||
            userData.avatar?.secure_url ||
            userData.avatarUrl ||
            userData.avatar ||
            "/images/default-avatar.jpg";

          const firstName = userData.firstName || "";
          const lastName = userData.lastName || "";
          const fullName = firstName && lastName
            ? `${firstName} ${lastName}`
            : firstName || lastName || userData.name || "";

          setProfileData({
            firstName: firstName,
            lastName: lastName,
            name: fullName,
            email: userData.email || "",
            gender: userData.gender || userData.profile?.gender || "",
            country: userData.country || userData.nationality || userData.profile?.country || userData.profile?.nationality || "",
            dateOfBirth: userData.dateOfBirth || userData.profile?.dateOfBirth || "",
            language: userData.preferredLanguage || userData.language || userData.profile?.language || "English (UK)",
            bio: userData.bio || userData.profile?.bio || "",
            avatar: avatarUrl,
            referralCode: userData.referralCode || "",
            socialLinks: {
              website: userData.profile?.socialLinks?.website || "",
              twitter: userData.profile?.socialLinks?.twitter || "",
              linkedin: userData.profile?.socialLinks?.linkedin || "",
              facebook: userData.profile?.socialLinks?.facebook || "",
              instagram: userData.profile?.socialLinks?.instagram || "",
              youtube: userData.profile?.socialLinks?.youtube || "",
            },
          });
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Failed to load profile data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target)
      ) {
        setIsLanguageDropdownOpen(false);
      }
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target)
      ) {
        setIsCountryDropdownOpen(false);
      }
    }

    if (isLanguageDropdownOpen || isCountryDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isLanguageDropdownOpen, isCountryDropdownOpen]);

  // Countries list
  const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
    "Bahrain", "Bangladesh", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
    "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
    "Denmark", "Djibouti", "Dominica", "Dominican Republic",
    "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
    "Fiji", "Finland", "France",
    "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
    "Haiti", "Honduras", "Hungary",
    "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast",
    "Jamaica", "Japan", "Jordan",
    "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan",
    "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
    "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
    "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
    "Oman",
    "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
    "Qatar",
    "Romania", "Russia", "Rwanda",
    "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
    "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
    "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
    "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
    "Yemen",
    "Zambia", "Zimbabwe"
  ];

  const copyReferralCode = () => {
    if (profileData.referralCode) {
      navigator.clipboard.writeText(profileData.referralCode);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  const handleInputChange = (field, value, isSocialLink = false) => {
    if (isSocialLink) {
    setProfileData((prev) => ({
      ...prev,
        socialLinks: {
          ...prev.socialLinks,
      [field]: value,
        },
      }));
    } else {
      // If name field is being updated, also parse and update firstName and lastName
      if (field === "name") {
        const nameParts = value.trim().split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";
        setProfileData((prev) => ({
          ...prev,
          name: value,
          firstName: firstName,
          lastName: lastName,
        }));
      } else {
        setProfileData((prev) => ({
          ...prev,
          [field]: value,
        }));
      }
    }
  };

  // Handle avatar file selection
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    setAvatarFile(file);
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
    setError(null);
  };

  // Trigger file input
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleSaveProfile = async () => {
    try {
      setError(null);
      setSaving(true);
      
      // Get current user from localStorage
      const userStr = localStorage.getItem("USER");
      if (!userStr) {
        setError("User not found. Please login again.");
        setSaving(false);
        return;
      }

      const user = JSON.parse(userStr);
      const userId = user._id || user.id;

      if (!userId) {
        setError("User ID not found.");
        setSaving(false);
        return;
      }

      // Use firstName and lastName from state, or parse from name field if needed
      const firstName = profileData.firstName || (profileData.name ? profileData.name.trim().split(" ")[0] : "") || "";
      const lastName = profileData.lastName || (profileData.name ? profileData.name.trim().split(" ").slice(1).join(" ") : "") || "";

      // If avatar file is present, use FormData
      if (avatarFile) {
        const formData = new FormData();
        formData.append("avatar", avatarFile);
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("email", profileData.email);
        formData.append("gender", profileData.gender || "");
        formData.append("country", profileData.country || "");
        if (profileData.dateOfBirth) {
          formData.append("dateOfBirth", profileData.dateOfBirth);
        }
        formData.append("preferredLanguage", profileData.language || "English (UK)");
        formData.append("profile.bio", profileData.bio || "");
        formData.append("profile.socialLinks.website", profileData.socialLinks?.website || "");
        formData.append("profile.socialLinks.twitter", profileData.socialLinks?.twitter || "");
        formData.append("profile.socialLinks.linkedin", profileData.socialLinks?.linkedin || "");
        formData.append("profile.socialLinks.facebook", profileData.socialLinks?.facebook || "");
        formData.append("profile.socialLinks.instagram", profileData.socialLinks?.instagram || "");
        formData.append("profile.socialLinks.youtube", profileData.socialLinks?.youtube || "");

        // Use fetch for FormData to ensure proper Content-Type header
        const accessToken = localStorage.getItem("login-accessToken");
        const response = await fetch(
          `https://themutantschool-backend.onrender.com/api/user-profile/${userId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to update profile");
        }
      } else {
        // Prepare update data for JSON request
        const updateData = {
          firstName,
          lastName,
          email: profileData.email,
          gender: profileData.gender,
          country: profileData.country,
          dateOfBirth: profileData.dateOfBirth,
          preferredLanguage: profileData.language,
          bio: profileData.bio,
          profile: {
            bio: profileData.bio,
            socialLinks: profileData.socialLinks || {
              website: "",
              twitter: "",
              linkedin: "",
              facebook: "",
              instagram: "",
              youtube: "",
            },
          },
        };

        // Update user profile
        await api.put(`/user-profile/${userId}`, updateData);
      }
      
      // Refresh profile data
      const response = await api.get(`/user-profile/${userId}`);
      const userData = response.data?.data || response.data;

      if (userData) {
        const avatarUrl = 
          userData.profile?.avatar?.url ||
          userData.profile?.avatar?.secure_url ||
          userData.profile?.avatarUrl ||
          userData.avatar?.url ||
          userData.avatar?.secure_url ||
          userData.avatarUrl ||
          userData.avatar ||
          "/images/default-avatar.jpg";

        const updatedFirstName = userData.firstName || "";
        const updatedLastName = userData.lastName || "";
        const updatedFullName = updatedFirstName && updatedLastName
          ? `${updatedFirstName} ${updatedLastName}`
          : updatedFirstName || updatedLastName || userData.name || "";

        setProfileData({
          firstName: updatedFirstName,
          lastName: updatedLastName,
          name: updatedFullName,
          email: userData.email || "",
          gender: userData.gender || userData.profile?.gender || "",
          country: userData.country || userData.nationality || userData.profile?.country || userData.profile?.nationality || "",
          dateOfBirth: userData.dateOfBirth || userData.profile?.dateOfBirth || "",
          language: userData.preferredLanguage || userData.language || userData.profile?.language || "English (UK)",
          bio: userData.bio || userData.profile?.bio || "",
          avatar: avatarUrl,
          referralCode: userData.referralCode || "",
          socialLinks: {
            website: userData.profile?.socialLinks?.website || "",
            twitter: userData.profile?.socialLinks?.twitter || "",
            linkedin: userData.profile?.socialLinks?.linkedin || "",
            facebook: userData.profile?.socialLinks?.facebook || "",
            instagram: userData.profile?.socialLinks?.instagram || "",
            youtube: userData.profile?.socialLinks?.youtube || "",
          },
        });
      }

      // Clear avatar file and preview after successful save
      setAvatarFile(null);
      setAvatarPreview(null);
      
      // Dispatch custom event to notify navbar to refresh profile
      window.dispatchEvent(new CustomEvent("profileUpdated"));
      
    setIsModalOpen(false);
      setSaving(false);
      // You can add a success toast notification here
    } catch (error) {
      console.error("Error saving profile:", error);
      setError(error.message || "Failed to save profile. Please try again.");
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsModalOpen(false);
    setActiveTab("personal"); // Reset to first tab
    // Clear avatar file and preview
    setAvatarFile(null);
    setAvatarPreview(null);
    // Reset form data if needed
  };

  const tabs = [
    {
      id: "personal",
      name: "Personal Info",
      icon: UserIcon,
    },
    {
      id: "social",
      name: "Social Links",
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-t-transparent border-[#7343B3] rounded-full animate-spin"></div>
      </div>
    );
  }

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
        {/* Error Message */}
        {error && (
          <div
            className="mb-6 p-4 rounded-lg text-red-400"
            style={{ backgroundColor: "#301B19" }}
          >
            {error}
          </div>
        )}
        {/* User Card */}
        <div
          className="rounded-lg p-6 mb-8"
          style={{ backgroundColor: "#0F0F0F" }}
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div className="flex items-center space-x-6 mb-6 lg:mb-0">
              {/* Profile Picture */}
              <div className="relative w-24 h-24 rounded-full overflow-hidden">
                <Image
                  src={avatarPreview || profileData.avatar || "/images/default-avatar.jpg"}
                  alt={profileData.name || "User"}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* User Info */}
              <div>
                <h2 className="text-2xl font-bold mb-2">{profileData.name}</h2>
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-1">Referral Code</p>
                  <div className="flex items-center gap-3">
                    <p className="text-purple-400 font-mono text-lg font-bold">
                      {profileData.referralCode || "No referral code"}
                    </p>
                        <button
                      onClick={copyReferralCode}
                      className="px-3 py-2 rounded-lg flex items-center text-[#A5A5A5] hover:text-white space-x-1 transition-colors"
                          style={{ backgroundColor: "#1A1A1A" }}
                        >
                      {copied ? (
                        <>
                          <CheckIcon className="h-4 w-4 text-green-400" />
                          <span className="text-sm text-green-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <DocumentDuplicateIcon className="h-4 w-4" />
                          <span className="text-sm">Copy</span>
                        </>
                      )}
                        </button>
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
              <span className="text-gray-400">Gender</span>
              <span className="text-white">{profileData.gender}</span>
            </div>
            <div className="grid grid-cols-2 py-3 ">
              <span className="text-gray-400">Country</span>
              <span className="text-white">{profileData.country}</span>
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

        {/* Social Links Section */}
        <div
          className="rounded-lg p-6 mt-8"
          style={{ backgroundColor: "#0F0F0F" }}
        >
          <h2 className="text-xl font-semibold mb-6">Social Links</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Website */}
            {profileData.socialLinks?.website && (
              <div className="flex items-center space-x-3">
                <GlobeAltIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-400 text-sm">Website</p>
                  <a
                    href={profileData.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#7343B3] hover:text-[#9159d1] text-sm truncate block transition-colors"
                  >
                    {profileData.socialLinks.website}
                  </a>
                </div>
              </div>
            )}

            {/* Twitter */}
            {profileData.socialLinks?.twitter && (
              <div className="flex items-center space-x-3">
                <svg
                  className="h-5 w-5 text-gray-400 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 014 9.055v.05a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.188a11.644 11.644 0 006.29 1.84" />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-400 text-sm">Twitter</p>
                  <a
                    href={profileData.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#7343B3] hover:text-[#9159d1] text-sm truncate block transition-colors"
                  >
                    {profileData.socialLinks.twitter}
                  </a>
                </div>
              </div>
            )}

            {/* LinkedIn */}
            {profileData.socialLinks?.linkedin && (
              <div className="flex items-center space-x-3">
                <svg
                  className="h-5 w-5 text-gray-400 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-400 text-sm">LinkedIn</p>
                  <a
                    href={profileData.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#7343B3] hover:text-[#9159d1] text-sm truncate block transition-colors"
                  >
                    {profileData.socialLinks.linkedin}
                  </a>
                </div>
              </div>
            )}

            {/* Facebook */}
            {profileData.socialLinks?.facebook && (
              <div className="flex items-center space-x-3">
                <svg
                  className="h-5 w-5 text-gray-400 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.908c0-.817.092-1.192 1.172-1.192h2.828v-5h-3.972c-3.684 0-4.028 2.52-4.028 4.028v2.972z" />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-400 text-sm">Facebook</p>
                  <a
                    href={profileData.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#7343B3] hover:text-[#9159d1] text-sm truncate block transition-colors"
                  >
                    {profileData.socialLinks.facebook}
                  </a>
                </div>
              </div>
            )}

            {/* Instagram */}
            {profileData.socialLinks?.instagram && (
              <div className="flex items-center space-x-3">
                <svg
                  className="h-5 w-5 text-gray-400 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.204-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.069-1.644-.069-4.849 0-3.204.012-3.584.069-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.073 4.948.073 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-400 text-sm">Instagram</p>
                  <a
                    href={profileData.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#7343B3] hover:text-[#9159d1] text-sm truncate block transition-colors"
                  >
                    {profileData.socialLinks.instagram}
                  </a>
                </div>
              </div>
            )}

            {/* YouTube */}
            {profileData.socialLinks?.youtube && (
              <div className="flex items-center space-x-3">
                <svg
                  className="h-5 w-5 text-gray-400 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l7 4-7 4z" />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-400 text-sm">YouTube</p>
                  <a
                    href={profileData.socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#7343B3] hover:text-[#9159d1] text-sm truncate block transition-colors"
                  >
                    {profileData.socialLinks.youtube}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Show message if no social links */}
          {!profileData.socialLinks?.website &&
            !profileData.socialLinks?.twitter &&
            !profileData.socialLinks?.linkedin &&
            !profileData.socialLinks?.facebook &&
            !profileData.socialLinks?.instagram &&
            !profileData.socialLinks?.youtube && (
              <p className="text-gray-400 text-sm">
                No social links added yet. Edit your profile to add social links.
              </p>
            )}
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
                  {/* Avatar Upload - Full Width */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Profile Picture
                    </label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={avatarPreview || profileData.avatar || "/images/default-avatar.jpg"}
                          alt="Profile"
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={handleAvatarClick}
                          className="px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 text-sm"
                          style={{ backgroundColor: "#7343B3" }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "#9159d1";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "#7343B3";
                          }}
                        >
                          {avatarFile ? "Change Picture" : "Upload Picture"}
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                        {avatarFile && (
                          <p className="text-xs text-gray-400">
                            {avatarFile.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Grid Layout for Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                    {/* Country */}
                    <div className="relative" ref={countryDropdownRef} style={{ zIndex: 10001 }}>
                      <label className="block text-sm text-gray-400 mb-2">
                        <GlobeAltIcon className="h-4 w-4 inline mr-2" />
                        Country
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsLanguageDropdownOpen(false);
                          setIsCountryDropdownOpen(!isCountryDropdownOpen);
                        }}
                        className="w-full px-4 py-3 rounded-lg text-white transition-all duration-200 flex items-center justify-between"
                        style={{
                          backgroundColor: "#000000",
                          border: isCountryDropdownOpen ? "1px solid #7343B3" : "1px solid #1A1A1A",
                        }}
                        onMouseEnter={(e) => {
                          if (!isCountryDropdownOpen) {
                            e.target.style.borderColor = "#7343B3";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isCountryDropdownOpen) {
                            e.target.style.borderColor = "#1A1A1A";
                          }
                        }}
                      >
                        <span>{profileData.country || "Select Country"}</span>
                        {isCountryDropdownOpen ? (
                          <ChevronUpIcon className="h-4 w-4 text-gray-400" />
                        ) : (
                          <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                        )}
                      </button>

                      {/* Dropdown Menu */}
                      {isCountryDropdownOpen && (
                        <div
                          className="absolute w-full mt-2 rounded-lg shadow-xl scrollbar-hide"
                          style={{
                            backgroundColor: "#0F0F0F",
                            border: "1px solid #1A1A1A",
                            maxHeight: "240px",
                            overflowY: "auto",
                            zIndex: 100000,
                            position: "absolute",
                            top: "100%",
                            left: 0,
                          }}
                        >
                          {countries.map((country) => (
                            <button
                              key={country}
                              type="button"
                              onClick={() => {
                                handleInputChange("country", country);
                                setIsCountryDropdownOpen(false);
                              }}
                              className="w-full text-left px-4 py-3 text-sm transition-all duration-200 flex items-center justify-between"
                              style={{
                                color: profileData.country === country ? "#7343B3" : "#FFFFFF",
                                backgroundColor:
                                  profileData.country === country
                                    ? "#0C0C0C"
                                    : "transparent",
                              }}
                              onMouseEnter={(e) => {
                                if (profileData.country !== country) {
                                  e.target.style.backgroundColor = "#1A1A1A";
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (profileData.country !== country) {
                                  e.target.style.backgroundColor = "transparent";
                                }
                              }}
                            >
                              <span style={{ color: profileData.country === country ? "#7343B3" : "#FFFFFF" }}>
                                {country}
                              </span>
                              {profileData.country === country && (
                                <CheckIcon className="h-4 w-4" style={{ color: "#7343B3" }} />
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        <EnvelopeIcon className="h-4 w-4 inline mr-2" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        disabled
                        readOnly
                        className="w-full px-4 py-3 rounded-lg text-gray-500 transition-all duration-200 cursor-not-allowed"
                        style={{
                          backgroundColor: "#0A0A0A",
                          border: "1px solid #1A1A1A",
                        }}
                      />
                    </div>

                    {/* Preferred Language */}
                    <div className="relative" ref={languageDropdownRef} style={{ zIndex: 10000 }}>
                      <label className="block text-sm text-gray-400 mb-2">
                        Preferred Language
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsCountryDropdownOpen(false);
                          setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
                        }}
                        className="w-full px-4 py-3 rounded-lg text-white transition-all duration-200 flex items-center justify-between"
                        style={{
                          backgroundColor: "#000000",
                          border: isLanguageDropdownOpen ? "1px solid #7343B3" : "1px solid #1A1A1A",
                        }}
                        onMouseEnter={(e) => {
                          if (!isLanguageDropdownOpen) {
                            e.target.style.borderColor = "#7343B3";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isLanguageDropdownOpen) {
                            e.target.style.borderColor = "#1A1A1A";
                          }
                        }}
                      >
                        <span>{profileData.language || "Select Language"}</span>
                        {isLanguageDropdownOpen ? (
                          <ChevronUpIcon className="h-4 w-4 text-gray-400" />
                        ) : (
                          <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                        )}
                      </button>

                      {/* Dropdown Menu */}
                      {isLanguageDropdownOpen && (
                        <div
                          className="absolute w-full mt-2 rounded-lg shadow-xl scrollbar-hide"
                          style={{
                            backgroundColor: "#0F0F0F",
                            border: "1px solid #1A1A1A",
                            maxHeight: "240px",
                            overflowY: "auto",
                            zIndex: 99999,
                            position: "absolute",
                            top: "100%",
                            left: 0,
                          }}
                        >
                          {[
                            "English (UK)",
                            "English (US)",
                            "Spanish",
                            "French",
                            "German",
                            "Italian",
                            "Portuguese",
                            "Chinese",
                            "Japanese",
                            "Korean",
                            "Arabic",
                            "Hindi",
                          ].map((language) => (
                            <button
                              key={language}
                              type="button"
                              onClick={() => {
                                handleInputChange("language", language);
                                setIsLanguageDropdownOpen(false);
                              }}
                              className="w-full text-left px-4 py-3 text-sm transition-all duration-200 flex items-center justify-between"
                              style={{
                                color: profileData.language === language ? "#7343B3" : "#FFFFFF",
                                backgroundColor:
                                  profileData.language === language
                                    ? "#0C0C0C"
                                    : "transparent",
                              }}
                              onMouseEnter={(e) => {
                                if (profileData.language !== language) {
                                  e.target.style.backgroundColor = "#1A1A1A";
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (profileData.language !== language) {
                                  e.target.style.backgroundColor = "transparent";
                                }
                              }}
                            >
                              <span style={{ color: profileData.language === language ? "#7343B3" : "#FFFFFF" }}>
                                {language}
                              </span>
                              {profileData.language === language && (
                                <CheckIcon className="h-4 w-4" style={{ color: "#7343B3" }} />
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bio - Full Width */}
                  <div className="md:col-span-2">
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

              {activeTab === "social" && (
                <div className="space-y-6">
                  {/* Website */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      <GlobeAltIcon className="h-4 w-4 inline mr-2" />
                      Website
                    </label>
                    <input
                      type="url"
                      value={profileData.socialLinks?.website || ""}
                      onChange={(e) => handleInputChange("website", e.target.value, true)}
                      className="w-full px-4 py-3 rounded-lg text-white transition-all duration-200"
                      style={{
                        backgroundColor: "#000000",
                        border: "1px solid #1A1A1A",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#7343B3")}
                      onBlur={(e) => (e.target.style.borderColor = "#1A1A1A")}
                      placeholder="e.g., https://yourwebsite.com"
                    />
                  </div>

                  {/* Twitter */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      <svg className="h-4 w-4 inline mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 014 9.055v.05a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.188a11.644 11.644 0 006.29 1.84" />
                      </svg>
                      Twitter
                    </label>
                    <input
                      type="url"
                      value={profileData.socialLinks?.twitter || ""}
                      onChange={(e) => handleInputChange("twitter", e.target.value, true)}
                      className="w-full px-4 py-3 rounded-lg text-white transition-all duration-200"
                      style={{
                        backgroundColor: "#000000",
                        border: "1px solid #1A1A1A",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#7343B3")}
                      onBlur={(e) => (e.target.style.borderColor = "#1A1A1A")}
                      placeholder="e.g., https://twitter.com/yourhandle"
                    />
                  </div>

                  {/* LinkedIn */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      <svg className="h-4 w-4 inline mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      value={profileData.socialLinks?.linkedin || ""}
                      onChange={(e) => handleInputChange("linkedin", e.target.value, true)}
                      className="w-full px-4 py-3 rounded-lg text-white transition-all duration-200"
                      style={{
                        backgroundColor: "#000000",
                        border: "1px solid #1A1A1A",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#7343B3")}
                      onBlur={(e) => (e.target.style.borderColor = "#1A1A1A")}
                      placeholder="e.g., https://linkedin.com/in/yourprofile"
                    />
                </div>

                  {/* Facebook */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      <svg className="h-4 w-4 inline mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.908c0-.817.092-1.192 1.172-1.192h2.828v-5h-3.972c-3.684 0-4.028 2.52-4.028 4.028v2.972z" />
                      </svg>
                      Facebook
                    </label>
                    <input
                      type="url"
                      value={profileData.socialLinks?.facebook || ""}
                      onChange={(e) => handleInputChange("facebook", e.target.value, true)}
                      className="w-full px-4 py-3 rounded-lg text-white transition-all duration-200"
                      style={{
                        backgroundColor: "#000000",
                        border: "1px solid #1A1A1A",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#7343B3")}
                      onBlur={(e) => (e.target.style.borderColor = "#1A1A1A")}
                      placeholder="e.g., https://facebook.com/yourprofile"
                    />
                  </div>

                  {/* Instagram */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      <svg className="h-4 w-4 inline mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.204-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.069-1.644-.069-4.849 0-3.204.012-3.584.069-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.073 4.948.073 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                      Instagram
                    </label>
                    <input
                      type="url"
                      value={profileData.socialLinks?.instagram || ""}
                      onChange={(e) => handleInputChange("instagram", e.target.value, true)}
                      className="w-full px-4 py-3 rounded-lg text-white transition-all duration-200"
                      style={{
                        backgroundColor: "#000000",
                        border: "1px solid #1A1A1A",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#7343B3")}
                      onBlur={(e) => (e.target.style.borderColor = "#1A1A1A")}
                      placeholder="e.g., https://instagram.com/yourhandle"
                    />
                  </div>

                  {/* YouTube */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      <svg className="h-4 w-4 inline mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l7 4-7 4z" />
                      </svg>
                      YouTube
                    </label>
                    <input
                      type="url"
                      value={profileData.socialLinks?.youtube || ""}
                      onChange={(e) => handleInputChange("youtube", e.target.value, true)}
                      className="w-full px-4 py-3 rounded-lg text-white transition-all duration-200"
                      style={{
                        backgroundColor: "#000000",
                        border: "1px solid #1A1A1A",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#7343B3")}
                      onBlur={(e) => (e.target.style.borderColor = "#1A1A1A")}
                      placeholder="e.g., https://youtube.com/yourchannel"
                    />
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
                disabled={saving}
                className="px-6 py-3 rounded-lg text-white font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: saving ? "#5a2d8a" : "#7343B3" }}
                onMouseEnter={(e) => {
                  if (!saving) {
                  e.target.style.backgroundColor = "#9159d1";
                  e.target.style.transform = "scale(1.02)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!saving) {
                  e.target.style.backgroundColor = "#7343B3";
                  e.target.style.transform = "scale(1)";
                  }
                }}
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
