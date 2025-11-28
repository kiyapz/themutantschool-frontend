"use client";
import Link from "next/link";
import Image from "next/image";
import { useContext, useEffect, useMemo, useRef, useState, useCallback } from "react";
import { FiChevronDown, FiEdit } from "react-icons/fi";
import { InstructorContext } from "../_components/context/InstructorContex";
import { Editprofilebtn } from "./profilesetting/_components/Editprofilebtn";
import { EditprofileRadiobtn } from "./profilesetting/_components/EditprofileRadiobtn";
import ToggleButton from "./notification/_components/ToggleButton";
import profilebase from "./_components/profilebase";
import UserProfileImage from "./_components/UserProfileImage";
import { useRouter } from "next/navigation"; // Fixed import for Next.js 13+ App Router
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Profile() {
  const router = useRouter();
  const {
    profiledisplay,
    setprofiledisplay,
    userUpdatedValue,
    setUserUpdatedValue,
    userProfile,
    setUserProfile,
    FetchUserProfile,
    user,
    setUser,
  } = useContext(InstructorContext);

  const [activeTab, setActiveTab] = useState("Personal");
  const [openEditProfile, setEditProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPhoneDropdownOpen, setIsPhoneDropdownOpen] = useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const phoneDropdownRef = useRef(null);
  const countryDropdownRef = useRef(null);
  const [phoneCountryCode, setPhoneCountryCode] = useState("+971");
  const [phoneLocalNumber, setPhoneLocalNumber] = useState("");

  const countries = useMemo(
    () => [
      { code: "+93", flag: "🇦🇫", name: "Afghanistan" },
      { code: "+355", flag: "🇦🇱", name: "Albania" },
      { code: "+213", flag: "🇩🇿", name: "Algeria" },
      { code: "+376", flag: "🇦🇩", name: "Andorra" },
      { code: "+244", flag: "🇦🇴", name: "Angola" },
      { code: "+54", flag: "🇦🇷", name: "Argentina" },
      { code: "+374", flag: "🇦🇲", name: "Armenia" },
      { code: "+61", flag: "🇦🇺", name: "Australia" },
      { code: "+43", flag: "🇦🇹", name: "Austria" },
      { code: "+994", flag: "🇦🇿", name: "Azerbaijan" },
      { code: "+973", flag: "🇧🇭", name: "Bahrain" },
      { code: "+880", flag: "🇧🇩", name: "Bangladesh" },
      { code: "+375", flag: "🇧🇾", name: "Belarus" },
      { code: "+32", flag: "🇧🇪", name: "Belgium" },
      { code: "+501", flag: "🇧🇿", name: "Belize" },
      { code: "+229", flag: "🇧🇯", name: "Benin" },
      { code: "+975", flag: "🇧🇹", name: "Bhutan" },
      { code: "+591", flag: "🇧🇴", name: "Bolivia" },
      { code: "+387", flag: "🇧🇦", name: "Bosnia and Herzegovina" },
      { code: "+267", flag: "🇧🇼", name: "Botswana" },
      { code: "+55", flag: "🇧🇷", name: "Brazil" },
      { code: "+673", flag: "🇧🇳", name: "Brunei" },
      { code: "+359", flag: "🇧🇬", name: "Bulgaria" },
      { code: "+226", flag: "🇧🇫", name: "Burkina Faso" },
      { code: "+257", flag: "🇧🇮", name: "Burundi" },
      { code: "+855", flag: "🇰🇭", name: "Cambodia" },
      { code: "+237", flag: "🇨🇲", name: "Cameroon" },
      { code: "+1", flag: "🇨🇦", name: "Canada" },
      { code: "+238", flag: "🇨🇻", name: "Cape Verde" },
      { code: "+236", flag: "🇨🇫", name: "Central African Republic" },
      { code: "+235", flag: "🇹🇩", name: "Chad" },
      { code: "+56", flag: "🇨🇱", name: "Chile" },
      { code: "+86", flag: "🇨🇳", name: "China" },
      { code: "+57", flag: "🇨🇴", name: "Colombia" },
      { code: "+269", flag: "🇰🇲", name: "Comoros" },
      { code: "+242", flag: "🇨🇬", name: "Congo" },
      { code: "+506", flag: "🇨🇷", name: "Costa Rica" },
      { code: "+385", flag: "🇭🇷", name: "Croatia" },
      { code: "+53", flag: "🇨🇺", name: "Cuba" },
      { code: "+357", flag: "🇨🇾", name: "Cyprus" },
      { code: "+420", flag: "🇨🇿", name: "Czech Republic" },
      { code: "+45", flag: "🇩🇰", name: "Denmark" },
      { code: "+253", flag: "🇩🇯", name: "Djibouti" },
      { code: "+593", flag: "🇪🇨", name: "Ecuador" },
      { code: "+20", flag: "🇪🇬", name: "Egypt" },
      { code: "+503", flag: "🇸🇻", name: "El Salvador" },
      { code: "+240", flag: "🇬🇶", name: "Equatorial Guinea" },
      { code: "+291", flag: "🇪🇷", name: "Eritrea" },
      { code: "+372", flag: "🇪🇪", name: "Estonia" },
      { code: "+251", flag: "🇪🇹", name: "Ethiopia" },
      { code: "+679", flag: "🇫🇯", name: "Fiji" },
      { code: "+358", flag: "🇫🇮", name: "Finland" },
      { code: "+33", flag: "🇫🇷", name: "France" },
      { code: "+241", flag: "🇬🇦", name: "Gabon" },
      { code: "+220", flag: "🇬🇲", name: "Gambia" },
      { code: "+995", flag: "🇬🇪", name: "Georgia" },
      { code: "+49", flag: "🇩🇪", name: "Germany" },
      { code: "+233", flag: "🇬🇭", name: "Ghana" },
      { code: "+30", flag: "🇬🇷", name: "Greece" },
      { code: "+502", flag: "🇬🇹", name: "Guatemala" },
      { code: "+224", flag: "🇬🇳", name: "Guinea" },
      { code: "+245", flag: "🇬🇼", name: "Guinea-Bissau" },
      { code: "+592", flag: "🇬🇾", name: "Guyana" },
      { code: "+509", flag: "🇭🇹", name: "Haiti" },
      { code: "+504", flag: "🇭🇳", name: "Honduras" },
      { code: "+852", flag: "🇭🇰", name: "Hong Kong" },
      { code: "+36", flag: "🇭🇺", name: "Hungary" },
      { code: "+354", flag: "🇮🇸", name: "Iceland" },
      { code: "+91", flag: "🇮🇳", name: "India" },
      { code: "+62", flag: "🇮🇩", name: "Indonesia" },
      { code: "+98", flag: "🇮🇷", name: "Iran" },
      { code: "+964", flag: "🇮🇶", name: "Iraq" },
      { code: "+353", flag: "🇮🇪", name: "Ireland" },
      { code: "+972", flag: "🇮🇱", name: "Israel" },
      { code: "+39", flag: "🇮🇹", name: "Italy" },
      { code: "+225", flag: "🇨🇮", name: "Ivory Coast" },
      { code: "+81", flag: "🇯🇵", name: "Japan" },
      { code: "+962", flag: "🇯🇴", name: "Jordan" },
      { code: "+7", flag: "🇰🇿", name: "Kazakhstan" },
      { code: "+254", flag: "🇰🇪", name: "Kenya" },
      { code: "+965", flag: "🇰🇼", name: "Kuwait" },
      { code: "+996", flag: "🇰🇬", name: "Kyrgyzstan" },
      { code: "+856", flag: "🇱🇦", name: "Laos" },
      { code: "+371", flag: "🇱🇻", name: "Latvia" },
      { code: "+961", flag: "🇱🇧", name: "Lebanon" },
      { code: "+266", flag: "🇱🇸", name: "Lesotho" },
      { code: "+231", flag: "🇱🇷", name: "Liberia" },
      { code: "+218", flag: "🇱🇾", name: "Libya" },
      { code: "+423", flag: "🇱🇮", name: "Liechtenstein" },
      { code: "+370", flag: "🇱🇹", name: "Lithuania" },
      { code: "+352", flag: "🇱🇺", name: "Luxembourg" },
      { code: "+853", flag: "🇲🇴", name: "Macau" },
      { code: "+389", flag: "🇲🇰", name: "Macedonia" },
      { code: "+261", flag: "🇲🇬", name: "Madagascar" },
      { code: "+265", flag: "🇲🇼", name: "Malawi" },
      { code: "+60", flag: "🇲🇾", name: "Malaysia" },
      { code: "+960", flag: "🇲🇻", name: "Maldives" },
      { code: "+223", flag: "🇲🇱", name: "Mali" },
      { code: "+356", flag: "🇲🇹", name: "Malta" },
      { code: "+222", flag: "🇲🇷", name: "Mauritania" },
      { code: "+230", flag: "🇲🇺", name: "Mauritius" },
      { code: "+52", flag: "🇲🇽", name: "Mexico" },
      { code: "+373", flag: "🇲🇩", name: "Moldova" },
      { code: "+377", flag: "🇲🇨", name: "Monaco" },
      { code: "+976", flag: "🇲🇳", name: "Mongolia" },
      { code: "+382", flag: "🇲🇪", name: "Montenegro" },
      { code: "+212", flag: "🇲🇦", name: "Morocco" },
      { code: "+258", flag: "🇲🇿", name: "Mozambique" },
      { code: "+95", flag: "🇲🇲", name: "Myanmar" },
      { code: "+264", flag: "🇳🇦", name: "Namibia" },
      { code: "+977", flag: "🇳🇵", name: "Nepal" },
      { code: "+31", flag: "🇳🇱", name: "Netherlands" },
      { code: "+64", flag: "🇳🇿", name: "New Zealand" },
      { code: "+505", flag: "🇳🇮", name: "Nicaragua" },
      { code: "+227", flag: "🇳🇪", name: "Niger" },
      { code: "+234", flag: "🇳🇬", name: "Nigeria" },
      { code: "+850", flag: "🇰🇵", name: "North Korea" },
      { code: "+47", flag: "🇳🇴", name: "Norway" },
      { code: "+968", flag: "🇴🇲", name: "Oman" },
      { code: "+92", flag: "🇵🇰", name: "Pakistan" },
      { code: "+507", flag: "🇵🇦", name: "Panama" },
      { code: "+675", flag: "🇵🇬", name: "Papua New Guinea" },
      { code: "+595", flag: "🇵🇾", name: "Paraguay" },
      { code: "+51", flag: "🇵🇪", name: "Peru" },
      { code: "+63", flag: "🇵🇭", name: "Philippines" },
      { code: "+48", flag: "🇵🇱", name: "Poland" },
      { code: "+351", flag: "🇵🇹", name: "Portugal" },
      { code: "+974", flag: "🇶🇦", name: "Qatar" },
      { code: "+40", flag: "🇷🇴", name: "Romania" },
      { code: "+7", flag: "🇷🇺", name: "Russia" },
      { code: "+250", flag: "🇷🇼", name: "Rwanda" },
      { code: "+966", flag: "🇸🇦", name: "Saudi Arabia" },
      { code: "+221", flag: "🇸🇳", name: "Senegal" },
      { code: "+381", flag: "🇷🇸", name: "Serbia" },
      { code: "+248", flag: "🇸🇨", name: "Seychelles" },
      { code: "+232", flag: "🇸🇱", name: "Sierra Leone" },
      { code: "+65", flag: "🇸🇬", name: "Singapore" },
      { code: "+421", flag: "🇸🇰", name: "Slovakia" },
      { code: "+386", flag: "🇸🇮", name: "Slovenia" },
      { code: "+252", flag: "🇸🇴", name: "Somalia" },
      { code: "+27", flag: "🇿🇦", name: "South Africa" },
      { code: "+82", flag: "🇰🇷", name: "South Korea" },
      { code: "+34", flag: "🇪🇸", name: "Spain" },
      { code: "+94", flag: "🇱🇰", name: "Sri Lanka" },
      { code: "+249", flag: "🇸🇩", name: "Sudan" },
      { code: "+597", flag: "🇸🇷", name: "Suriname" },
      { code: "+46", flag: "🇸🇪", name: "Sweden" },
      { code: "+41", flag: "🇨🇭", name: "Switzerland" },
      { code: "+963", flag: "🇸🇾", name: "Syria" },
      { code: "+886", flag: "🇹🇼", name: "Taiwan" },
      { code: "+992", flag: "🇹🇯", name: "Tajikistan" },
      { code: "+255", flag: "🇹🇿", name: "Tanzania" },
      { code: "+66", flag: "🇹🇭", name: "Thailand" },
      { code: "+228", flag: "🇹🇬", name: "Togo" },
      { code: "+216", flag: "🇹🇳", name: "Tunisia" },
      { code: "+90", flag: "🇹🇷", name: "Turkey" },
      { code: "+993", flag: "🇹🇲", name: "Turkmenistan" },
      { code: "+256", flag: "🇺🇬", name: "Uganda" },
      { code: "+380", flag: "🇺🇦", name: "Ukraine" },
      { code: "+971", flag: "🇦🇪", name: "United Arab Emirates" },
      { code: "+44", flag: "🇬🇧", name: "United Kingdom" },
      { code: "+1", flag: "🇺🇸", name: "United States" },
      { code: "+598", flag: "🇺🇾", name: "Uruguay" },
      { code: "+998", flag: "🇺🇿", name: "Uzbekistan" },
      { code: "+58", flag: "🇻🇪", name: "Venezuela" },
      { code: "+84", flag: "🇻🇳", name: "Vietnam" },
      { code: "+967", flag: "🇾🇪", name: "Yemen" },
      { code: "+260", flag: "🇿🇲", name: "Zambia" },
      { code: "+263", flag: "🇿🇼", name: "Zimbabwe" },
    ],
    []
  );

  const languageOptions = useMemo(
    () => [
      "English",
      "Arabic",
      "French",
      "Spanish",
      "German",
      "Hindi",
      "Mandarin",
      "Portuguese",
      "Hausa",
      "Swahili",
    ],
    []
  );

  const parsePhoneNumber = useCallback((fullPhone) => {
    if (!fullPhone) {
      return { countryCode: "+971", phoneNumber: "" };
    }
    const digitsOnly = fullPhone.toString().replace(/\s+/g, "");
    const match = countries
      .slice()
      .sort((a, b) => b.code.length - a.code.length)
      .find((country) => digitsOnly.startsWith(country.code));

    if (match) {
      return {
        countryCode: match.code,
        phoneNumber: digitsOnly.slice(match.code.length),
      };
    }

    return { countryCode: "+971", phoneNumber: digitsOnly.replace(/^\+?971/, "") };
  }, [countries]);

  const flagToIso = (flagEmoji) => {
    if (!flagEmoji) return null;
    try {
      const codePoints = Array.from(flagEmoji, (char) => char.codePointAt(0));
      if (codePoints.length !== 2) {
        return null;
      }
      return codePoints
        .map((cp) => String.fromCharCode(cp - 127397))
        .join("")
        .toLowerCase();
    } catch (error) {
      return null;
    }
  };

  const flagCodeMap = useMemo(() => {
    const entries = countries.map((country) => {
      const iso = flagToIso(country.flag);
      return [country.name.toLowerCase(), iso];
    });
    return Object.fromEntries(entries);
  }, [countries]);

  const selectedCountry = useMemo(() => {
    const iso =
      flagCodeMap[
        (userUpdatedValue?.country || userUpdatedValue?.nationality || "").toLowerCase()
      ] || null;
    if (!iso) return null;

    return countries.find(
      (country) =>
        flagCodeMap[country.name.toLowerCase()] === iso ||
        (country.flag &&
          flagCodeMap[country.name.toLowerCase()] ===
            (flagCodeMap[
              (userUpdatedValue?.country || userUpdatedValue?.nationality || "").toLowerCase()
            ] ||
              ""))
    );
}, [
  countries,
  flagCodeMap,
  userUpdatedValue?.country,
  userUpdatedValue?.nationality,
]);

  useEffect(() => {
    const { countryCode, phoneNumber } = parsePhoneNumber(
      userUpdatedValue?.phoneNumber
    );
    setPhoneCountryCode(countryCode);
    setPhoneLocalNumber(phoneNumber);
  }, [userUpdatedValue?.phoneNumber, parsePhoneNumber]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        phoneDropdownRef.current &&
        !phoneDropdownRef.current.contains(event.target)
      ) {
        setIsPhoneDropdownOpen(false);
      }
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target)
      ) {
        setIsCountryDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlePhoneCountrySelect = (code) => {
    const digits = phoneLocalNumber.replace(/\D/g, "");
    setPhoneCountryCode(code);
    setPhoneLocalNumber(digits);
    setIsPhoneDropdownOpen(false);
    setUserUpdatedValue((prev) => ({
      ...prev,
      phoneNumber: `${code}${digits}`,
    }));
  };

  const handlePhoneNumberChange = (value) => {
    const digits = value.replace(/\D/g, "");
    setPhoneLocalNumber(digits);
    setUserUpdatedValue((prev) => ({
      ...prev,
      phoneNumber: `${phoneCountryCode}${digits}`,
    }));
  };

  const handleCountrySelect = (countryName) => {
    setUserUpdatedValue((prev) => ({
      ...prev,
      country: countryName,
      nationality: countryName,
    }));
    setIsCountryDropdownOpen(false);
  };

  // Fetch user profile on component mount
  useEffect(() => {
    async function fetchProfile() {
      setIsLoading(true);
      setError(null);

      try {
        const storedUser = localStorage.getItem("USER");
        const accessToken = localStorage.getItem("login-accessToken");

        if (!storedUser || !accessToken) {
          console.warn("User or token not found in localStorage");
          router.push("/auth/login");
          return;
        }

        const parsedUser = JSON.parse(storedUser);
        const id = parsedUser._id;

        const response = await profilebase.get(`/user-profile/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        console.log("User profile fetched:", response.data.data);
        setUserProfile(response.data.data);
      } catch (error) {
        console.error(
          "Failed to load user profile:",
          error.response?.data || error.message
        );
        setError("Failed to load profile. Please try again.");

        if (error.response?.status === 401 || error.response?.status === 403) {
          router.push("/auth/login");
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, [setUserProfile, router]);

  useEffect(() => {
    if (userProfile) {
      const avatarUrl =
        userProfile.profile?.avatar?.url ||
        userProfile.profile?.avatar?.secure_url ||
        userProfile.profile?.avatarUrl ||
        userProfile.avatar?.url ||
        userProfile.avatar?.secure_url ||
        userProfile.avatarUrl ||
        "";
      const avatarKey =
        userProfile.profile?.avatar?.key ||
        userProfile.profile?.avatar?.public_id ||
        userProfile.avatar?.key ||
        userProfile.avatar?.public_id ||
        "";

      console.log(
        "useEffect: userProfile.phoneNumber =",
        userProfile.phoneNumber
      );
      console.log(
        "useEffect: typeof userProfile.phoneNumber =",
        typeof userProfile.phoneNumber
      );
      console.log(
        "useEffect: userProfile.phoneNumber || '' =",
        userProfile.phoneNumber || ""
      );

      setUserUpdatedValue({
        firstName: userProfile.firstName || "",
        lastName: userProfile.lastName || "",
        username: userProfile.username || "",
        email: userProfile.email || "",
        bio: userProfile.profile?.bio || "",
        facebook: userProfile.profile?.socialLinks?.facebook || "",
        linkedin: userProfile.profile?.socialLinks?.linkedin || "",
        website: userProfile.profile?.socialLinks?.website || "",
        twitter: userProfile.profile?.socialLinks?.twitter || "",
        instagram: userProfile.profile?.socialLinks?.instagram || "",
        youtube: userProfile.profile?.socialLinks?.youtube || "",
        url: avatarUrl,
        publicId: avatarKey,
        headline: userProfile.profile?.headline || "",
        introVideo: userProfile.profile?.introVideo || "",
        expertiseTags: userProfile.profile?.expertiseTags || [],
        gender: userProfile.gender || "",
        phoneNumber: userProfile.phoneNumber || "",
        role: userProfile.role || "",
        nationality: userProfile.nationality || "",
        country: userProfile.country || userProfile.nationality || "",
        preferredLanguage: userProfile.preferredLanguage || "",
        displayFullName: userProfile.displayFullName !== false, // true by default unless explicitly set to false
        dateOfBirth:
          userProfile.dateOfBirth && userProfile.dateOfBirth !== null
            ? userProfile.dateOfBirth.split("T")[0]
            : "",
      });

      console.log("Just set userUpdatedValue to:", {
        phoneNumber: userProfile.phoneNumber || "",
        email: userProfile.email || "",
        firstName: userProfile.firstName || "",
      });

      console.log("Initialized userUpdatedValue with social links:", {
        twitter: userProfile.profile?.socialLinks?.twitter,
        youtube: userProfile.profile?.socialLinks?.youtube,
        facebook: userProfile.profile?.socialLinks?.facebook,
        instagram: userProfile.profile?.socialLinks?.instagram,
        linkedin: userProfile.profile?.socialLinks?.linkedin,
        website: userProfile.profile?.socialLinks?.website,
      });

      console.log("Initialized userUpdatedValue with personal info:", {
        phoneNumber: userProfile.phoneNumber,
        email: userProfile.email,
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        gender: userProfile.gender,
        nationality: userProfile.nationality,
        preferredLanguage: userProfile.preferredLanguage,
        dateOfBirth: userProfile.dateOfBirth,
      });

      console.log("Initialized userUpdatedValue with profile fields:", {
        headline: userProfile.profile?.headline,
        bio: userProfile.profile?.bio,
        expertiseTags: userProfile.profile?.expertiseTags,
        introVideo: userProfile.profile?.introVideo,
      });
    }
  }, [userProfile, setUserUpdatedValue]);

  // Debug: Log userUpdatedValue changes
  useEffect(() => {
    if (userUpdatedValue && userUpdatedValue.email) {
      console.log("userUpdatedValue updated - key fields:", {
        headline: userUpdatedValue.headline,
        preferredLanguage: userUpdatedValue.preferredLanguage,
        dateOfBirth: userUpdatedValue.dateOfBirth,
        expertiseTags: userUpdatedValue.expertiseTags,
        phoneNumber: userUpdatedValue.phoneNumber,
      });
    }
  }, [userUpdatedValue]);

  const updateUserProfile = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const storedUser = localStorage.getItem("USER");
      const accessToken = localStorage.getItem("login-accessToken");

      if (!storedUser || !accessToken) {
        setError("Authentication required. Please log in again.");
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      const id = parsedUser._id;

      const updateData = {
        firstName: userUpdatedValue.firstName,
        lastName: userUpdatedValue.lastName,
        username: userUpdatedValue.username,
        email: userUpdatedValue.email,
        gender: userUpdatedValue.gender,
        phoneNumber: userUpdatedValue.phoneNumber || "",
        role: userUpdatedValue.role,
        nationality: userUpdatedValue.nationality,
        country: userUpdatedValue.country || userUpdatedValue.nationality,
        preferredLanguage: userUpdatedValue.preferredLanguage || "",
        dateOfBirth: userUpdatedValue.dateOfBirth || null,
        displayFullName: userUpdatedValue.displayFullName !== false, // true by default unless explicitly set to false

        profile: {
          bio: userUpdatedValue.bio,
          headline: userUpdatedValue.headline,
          introVideo: userUpdatedValue.introVideo,
          expertiseTags: userUpdatedValue.expertiseTags || [],
          socialLinks: {
            facebook: userUpdatedValue.facebook || "",
            linkedin: userUpdatedValue.linkedin || "",
            website: userUpdatedValue.website || "",
            twitter: userUpdatedValue.twitter || "",
            instagram: userUpdatedValue.instagram || "",
            youtube: userUpdatedValue.youtube || "",
          },
          avatar: {
            url: userUpdatedValue.url,
            key: userUpdatedValue.publicId,
          },
        },
      };

      console.log("Sending update data:", updateData);
      console.log("Current userUpdatedValue:", userUpdatedValue);
      console.log("Social links in userUpdatedValue:", {
        twitter: userUpdatedValue.twitter,
        youtube: userUpdatedValue.youtube,
        facebook: userUpdatedValue.facebook,
        instagram: userUpdatedValue.instagram,
        linkedin: userUpdatedValue.linkedin,
        website: userUpdatedValue.website,
      });

      const response = await profilebase.put(
        `/user-profile/${id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Profile updated successfully:", response.data.data);
      console.log("Updated fields comparison:", {
        sent: {
          phoneNumber: updateData.phoneNumber,
          dateOfBirth: updateData.dateOfBirth,
          twitter: updateData.profile.socialLinks.twitter,
          youtube: updateData.profile.socialLinks.youtube,
        },
        received: {
          phoneNumber: response.data.data.phoneNumber,
          dateOfBirth: response.data.data.dateOfBirth,
          twitter: response.data.data.profile?.socialLinks?.twitter,
          youtube: response.data.data.profile?.socialLinks?.youtube,
        },
      });

      setUserProfile(response.data.data);

      // Manually update userUpdatedValue to reflect the new data immediately
      const updatedAvatarUrl =
        response.data.data.profile?.avatar?.url ||
        response.data.data.profile?.avatar?.secure_url ||
        response.data.data.profile?.avatarUrl ||
        response.data.data.avatar?.url ||
        response.data.data.avatar?.secure_url ||
        response.data.data.avatarUrl ||
        "";
      const updatedAvatarKey =
        response.data.data.profile?.avatar?.key ||
        response.data.data.profile?.avatar?.public_id ||
        response.data.data.avatar?.key ||
        response.data.data.avatar?.public_id ||
        "";

      setUserUpdatedValue({
        firstName: response.data.data.firstName || "",
        lastName: response.data.data.lastName || "",
        username: response.data.data.username || "",
        email: response.data.data.email || "",
        bio: response.data.data.profile?.bio || "",
        facebook: response.data.data.profile?.socialLinks?.facebook || "",
        linkedin: response.data.data.profile?.socialLinks?.linkedin || "",
        website: response.data.data.profile?.socialLinks?.website || "",
        twitter: response.data.data.profile?.socialLinks?.twitter || "",
        instagram: response.data.data.profile?.socialLinks?.instagram || "",
        youtube: response.data.data.profile?.socialLinks?.youtube || "",
        url: updatedAvatarUrl,
        publicId: updatedAvatarKey,
        headline: response.data.data.profile?.headline || "",
        introVideo: response.data.data.profile?.introVideo || "",
        expertiseTags: response.data.data.profile?.expertiseTags || [],
        gender: response.data.data.gender || "",
        phoneNumber: response.data.data.phoneNumber || "",
        role: response.data.data.role || "",
        nationality: response.data.data.nationality,
        country: response.data.data.country || response.data.data.nationality || "",
        preferredLanguage: response.data.data.preferredLanguage || "",
        displayFullName: response.data.data.displayFullName !== false, // true by default unless explicitly set to false
        dateOfBirth:
          response.data.data.dateOfBirth &&
          response.data.data.dateOfBirth !== null
            ? response.data.data.dateOfBirth.split("T")[0]
            : "",
      });

      setEditProfile(false);
    } catch (error) {
      console.error(
        "Failed to update user profile:",
        error.response?.data || error.message
      );
      setError("Failed to update profile. Please try again.");

      if (error.response?.status === 401 || error.response?.status === 403) {
        router.push("/auth/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Debug: Log current userUpdatedValue
  console.log("Current userUpdatedValue in render:", {
    phoneNumber: userUpdatedValue?.phoneNumber,
    email: userUpdatedValue?.email,
    firstName: userUpdatedValue?.firstName,
    lastName: userUpdatedValue?.lastName,
    displayFullName: userUpdatedValue?.displayFullName,
  });

  // Check if userUpdatedValue has been properly initialized
  const isUserUpdatedValueInitialized =
    userUpdatedValue && userUpdatedValue.email;

  if (isLoading && !userProfile) {
    return (
      <div className="h-fit w-full max-w-[1200px] flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="large" color="mutant" />
      </div>
    );
  }

  if (error && !userProfile) {
    return (
      <div className="h-fit w-full max-w-[1200px] flex flex-col items-center justify-center gap-4">
        <div className="text-red-500">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="bg-[var(--purpel-btncolor)] px-4 py-2 rounded-md text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="h-fit w-full max-w-[1200px] flex flex-col gap-[10px]">
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
        style={{ marginBottom: "5px", margin: "auto" }}
        className="h-fit w-[95%] relative z-10 top-[-80px] sm:top-[10px]"
      >
        <div className="grid w-full gap-3 xl:grid-cols-4">
          {/* Side Bar */}
          <div
            style={{
              paddingLeft: "35px",
              paddingTop: "40px",
              paddingRight: "10px",
            }}
            className="bg-[var(--black-background)] flex flex-col space-y-[20px] hidden xl:block"
          >
            <Link href="/instructor/profile" prefetch={false}>
              <div
                onClick={() => setprofiledisplay("Personal Information")}
                className={`${
                  profiledisplay === "Personal Information"
                    ? "text-[#8D5FCA]"
                    : "text-[var(--coco-color)]"
                } hover:text-[#8D5FCA] cursor-pointer w-full flex items-center justify-between text-[15px] leading-[150%] font-[600]`}
              >
                Personal Information
                <p>{`>`}</p>
              </div>
            </Link>
            <Link href="/instructor/profile/notification" prefetch={false}>
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
                <p>{`>`}</p>
              </div>
            </Link>
            <Link href="/instructor/profile/profilesetting" prefetch={false}>
              <div
                onClick={() => setprofiledisplay("Security Settings")}
                className={`${
                  profiledisplay === "Security Settings"
                    ? "text-[#8D5FCA]"
                    : "text-[var(--coco-color)]"
                } hover:text-[#8D5FCA] flex items-center justify-between cursor-pointer text-[15px] leading-[150%] font-[600]`}
              >
                Security Settings
                <p>{`>`}</p>
              </div>
            </Link>
          </div>

          {/* Personal Profile */}
          <div
            style={{ padding: "15px" }}
            className="flex bg-[var(--black-background)] flex-col gap-5 sm:col-span-3 h-fit w-full"
          >
            <div className="w-full flex items-end xl:items-center justify-between">
              <div className="flex flex-col xl:flex-row xl:items-center gap-3">
                <div className="h-[100px] w-[100px] relative left-[10px] sm:left-0 xl:h-[190px] xl:w-[190px] rounded-full border-[11px]">
                  <UserProfileImage />
                </div>

                <div>
                  <p className="font-[600] text-[26px] sm:text-[35px] leading-[150%]">
                    {userUpdatedValue?.firstName || "First"}
                    {userUpdatedValue?.displayFullName &&
                    userUpdatedValue?.lastName ? (
                      <span> {userUpdatedValue.lastName}</span>
                    ) : null}
                  </p>
                  <p className="text-[17px] text-[var(--button-border-color)] sm:text-[24px] leading-[150%] sm:text-[var(--greencolor)]">
                    {userUpdatedValue?.headline || "Product Designer || Tutor"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  if (FetchUserProfile) {
                    FetchUserProfile();
                  }
                  setEditProfile(true);
                }}
                disabled={isLoading}
                style={{ paddingLeft: "8px", paddingRight: "8px" }}
                className="bg-[var(--purpel-btncolor)] w-fit cursor-pointer flexcenter gap-1 rounded-[10px] text-[8px] sm:text-[14px] leading-[40px] font-[700] disabled:opacity-50"
              >
                <span>
                  <FiEdit size={8} />
                </span>
                {isLoading ? "Loading..." : "Edit Profile"}
              </button>
            </div>

            {/* divider */}
            <div className="bg-[#323232] w-full h-[1px]"></div>

            {/* bio */}
            <div>
              <p className="font-[700] text-[17px] leading-[40px]">Bio</p>
              <div className="w-full h-[100px] overflow-auto scrollbar-hide">
                <p className="text-[11px] xl:text-[16px] leading-[20px]">
                  {userUpdatedValue?.bio || "No bio available"}
                </p>
              </div>
            </div>

            {/* divider */}
            <div className="bg-[#323232] w-full h-[1px]"></div>

            {/* Profile */}
            <div className="w-full">
              <p className="font-[700] text-[17px] leading-[40px]">
                Personal Information
              </p>
              <div className="grid grid-cols-2 w-full items-center">
                <div className="text-[#ADA5A5] font-[700] text-[13px] xl:text-[19px] leading-[40px]">
                  Email Address
                </div>
                <div className="text-[#818181] xl:text-[18px] leading-[20px] text-[12px] sm:text-[14px]">
                  {userUpdatedValue?.email || "N/A"}
                </div>
                <div className="text-[#ADA5A5] font-[700] text-[13px] xl:text-[19px] leading-[40px]">
                  Phone Number
                </div>
                <div className="text-[#818181] xl:text-[18px] leading-[20px] text-[12px] sm:text-[14px]">
                  {userUpdatedValue?.phoneNumber || "N/A"}
                  {/* Debug: {JSON.stringify({phoneNumber: userUpdatedValue?.phoneNumber})} */}
                </div>
                <div className="text-[#ADA5A5] font-[700] text-[13px] xl:text-[19px] leading-[40px]">
                  Gender
                </div>
                <div className="text-[#818181] xl:text-[18px] leading-[20px] text-[12px] sm:text-[14px]">
                  {userUpdatedValue?.gender || "N/A"}
                </div>
                <div className="text-[#ADA5A5] font-[700] text-[13px] xl:text-[19px] leading-[40px]">
                  Country
                </div>
                <div className="text-[#818181] xl:text-[18px] leading-[20px] text-[12px] sm:text-[14px]">
                  {userUpdatedValue?.country || userUpdatedValue?.nationality || "N/A"}
                </div>
                <div className="text-[#ADA5A5] font-[700] text-[13px] xl:text-[19px] leading-[40px]">
                  Date Of Birth
                </div>
                <div className="text-[#818181] xl:text-[18px] leading-[20px] text-[12px] sm:text-[14px]">
                  {userUpdatedValue?.dateOfBirth || "N/A"}
                </div>
                <div className="text-[#ADA5A5] font-[700] text-[13px] xl:text-[19px] leading-[40px]">
                  Preferred Language
                </div>
                <div className="text-[#818181] xl:text-[18px] leading-[20px] text-[12px] sm:text-[14px]">
                  {userUpdatedValue?.preferredLanguage || "N/A"}
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="w-full">
              <p className="font-[700] text-[17px] leading-[40px]">
                Social Links
              </p>
              <div className="grid grid-cols-2 w-full">
                <div className="text-[#ADA5A5] font-[700] text-[13px] xl:text-[19px] leading-[40px]">
                  Personal Website
                </div>
                <div className="text-[#818181] xl:text-[18px] leading-[20px] text-[12px] sm:text-[14px]">
                  {userUpdatedValue?.website || "N/A"}
                </div>
                <div className="text-[#ADA5A5] font-[700] text-[13px] xl:text-[19px] leading-[40px]">
                  LinkedIn
                </div>
                <div className="text-[#818181] xl:text-[18px] leading-[20px] text-[12px] sm:text-[14px]">
                  {userUpdatedValue?.linkedin || "N/A"}
                </div>
                <div className="text-[#ADA5A5] font-[700] text-[13px] xl:text-[19px] leading-[40px] text-[12px]">
                  Instagram
                </div>
                <div className="text-[#818181] xl:text-[18px] leading-[20px] text-[12px] sm:text-[14px]">
                  {userUpdatedValue?.instagram || "N/A"}
                </div>
                <div className="text-[#ADA5A5] font-[700] text-[13px] xl:text-[19px] leading-[40px]">
                  X
                </div>
                <div className="text-[#818181] xl:text-[18px] leading-[20px] text-[12px] sm:text-[14px]">
                  {userUpdatedValue?.twitter || "N/A"}
                </div>
                <div className="text-[#ADA5A5] font-[700] text-[13px] xl:text-[19px] leading-[40px]">
                  Facebook
                </div>
                <div className="text-[#818181] xl:text-[18px] leading-[20px] text-[12px] sm:text-[14px]">
                  {userUpdatedValue?.facebook || "N/A"}
                </div>
                <div className="text-[#ADA5A5] font-[700] text-[13px] xl:text-[19px] leading-[40px]">
                  YouTube
                </div>
                <div className="text-[#818181] xl:text-[18px] leading-[20px] text-[12px] sm:text-[14px]">
                  {userUpdatedValue?.youtube || "N/A"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {openEditProfile && (
        <div
          style={{ padding: "20px" }}
          className="fixed inset-0 w-full h-full flex justify-center items-start sm:items-center overflow-auto bg-[rgba(0,0,0,0.9)] z-50 p-4"
        >
          <div
            style={{ padding: "15px" }}
            className="max-w-[900px] w-full flex flex-col gap-6 bg-[#101010] shadow-lg rounded-lg my-8 p-8"
          >
            <div className="flex items-center justify-between">
              <p className="text-white text-xl font-semibold">Update Profile</p>
              {error && <div className="text-red-500 text-sm">{error}</div>}
            </div>

            {/* Navigation bar */}
            <div>
              <ul className="flex items-center gap-3 border-b border-[#4D4D4D]">
                {["Personal", "Professional", "Social Links & Media"].map(
                  (tab) => (
                    <li
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      style={{ paddingBottom: "20px" }}
                      className={`cursor-pointer px-4 text-[12px] sm:text-[15px] py-2 font-semibold relative
                                            ${
                                              activeTab === tab
                                                ? "text-[#8D5FCA]"
                                                : "text-[#D2D2D2]"
                                            }
                                            hover:text-[#8D5FCA] transition-colors duration-200
                                        `}
                    >
                      {tab}
                      {activeTab === tab && (
                        <span className="absolute left-0 -bottom-[1px] w-full h-[2px] bg-[#8D5FCA] rounded-md"></span>
                      )}
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Personal Tab */}
            {activeTab === "Personal" && (
              <div className="h-fit flex flex-col gap-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <Editprofilebtn
                    value={userUpdatedValue?.firstName || ""}
                    onChange={(e) =>
                      setUserUpdatedValue({
                        ...userUpdatedValue,
                        firstName: e.target.value,
                      })
                    }
                    label="First Name"
                  />

                  <Editprofilebtn
                    value={userUpdatedValue?.lastName || ""}
                    onChange={(e) =>
                      setUserUpdatedValue({
                        ...userUpdatedValue,
                        lastName: e.target.value,
                      })
                    }
                    label="Last Name"
                  />

                  <Editprofilebtn
                    value={userUpdatedValue?.username || ""}
                    onChange={() => {}}
                    readOnly={true}
                    label="Username"
                  />

                  <Editprofilebtn
                    value={userUpdatedValue?.email || ""}
                    onChange={() => {}}
                    readOnly={true}
                    label="Email Address"
                    type="email"
                  />

                  <div className="flex flex-col gap-3">
                    <p className="text-[#8C8C8C] font-[600] text-[13px] sm:text-[15px] leading-[40px]">
                      Phone Number
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative sm:w-auto" ref={phoneDropdownRef}>
                        <button
                          type="button"
                          onClick={() => setIsPhoneDropdownOpen((prev) => !prev)}
                          className="flex items-center gap-2 bg-[#1F1F1F] px-3 py-3 rounded-[6px] text-white border border-[#2d2d2d] hover:border-[#8D5FCA] transition-colors"
                        >
                          {(() => {
                            const phoneCountry = countries.find(
                              (country) => country.code === phoneCountryCode
                            );
                            if (!phoneCountry) return <span className="text-lg">🏳️</span>;
                            const iso = flagToIso(phoneCountry.flag);
                            if (iso) {
                              return (
                                <Image
                                  src={`https://flagcdn.com/w20/${iso}.png`}
                                  alt={`${phoneCountry.name} flag`}
                                  width={20}
                                  height={14}
                                  className="rounded-[4px]"
                                />
                              );
                            }
                            return <span className="text-lg">{phoneCountry.flag}</span>;
                          })()}
                          <span className="font-semibold">{phoneCountryCode}</span>
                          <FiChevronDown className="text-sm" />
                        </button>
                        {isPhoneDropdownOpen && (
                          <div className="absolute z-30 mt-2 max-h-60 w-44 overflow-y-auto rounded-[12px] bg-[#1F1F1F] border border-[#2d2d2d] shadow-lg dark-scrollbar">
                            {countries.map((country) => {
                              const iso = flagToIso(country.flag);
                              return (
                                <button
                                  type="button"
                                  key={`${country.code}-${country.name}`}
                                  onClick={() => handlePhoneCountrySelect(country.code)}
                                  className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-white hover:bg-[#2c2c2c] ${
                                    phoneCountryCode === country.code ? "bg-[#3a2960]" : ""
                                  }`}
                                >
                                  {iso ? (
                                    <Image
                                      src={`https://flagcdn.com/w20/${iso}.png`}
                                      alt={`${country.name} flag`}
                                      width={20}
                                      height={14}
                                      className="rounded-[4px]"
                                    />
                                  ) : (
                                    <span className="text-lg">{country.flag}</span>
                                  )}
                                  <span className="font-medium">{country.code}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      <input
                        value={phoneLocalNumber}
                        onChange={(e) => handlePhoneNumberChange(e.target.value)}
                        type="tel"
                        className="flex-1 h-[47.16px] rounded-[6px] bg-[#1F1F1F] outline-none px-4 text-white border border-transparent focus:border-[#8D5FCA]"
                        placeholder="Phone number"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <p className="text-[#8C8C8C] font-[600] text-[13px] sm:text-[15px] leading-[40px]">
                      Gender
                    </p>
                    <div className="flex items-center gap-6">
                      <EditprofileRadiobtn
                        value="Male"
                        selectedValue={userUpdatedValue?.gender || ""}
                        onChange={(e) =>
                          setUserUpdatedValue({
                            ...userUpdatedValue,
                            gender: e.target.value,
                          })
                        }
                        label="Male"
                      />
                      <EditprofileRadiobtn
                        selectedValue={userUpdatedValue?.gender || ""}
                        onChange={(e) =>
                          setUserUpdatedValue({
                            ...userUpdatedValue,
                            gender: e.target.value,
                          })
                        }
                        value="Female"
                        label="Female"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <p className="text-[#8C8C8C] font-[600] text-[13px] sm:text-[15px] leading-[40px]">
                      Country
                    </p>
                    <div className="relative" ref={countryDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setIsCountryDropdownOpen((prev) => !prev)}
                        className="flex items-center justify-between gap-3 w-full bg-[#1F1F1F] px-4 py-3 rounded-[6px] text-white border border-[#2d2d2d] hover:border-[#8D5FCA] transition-colors"
                      >
                        {selectedCountry ? (
                          <span className="flex items-center gap-2">
                            <span className="text-lg">{selectedCountry.flag}</span>
                            <span>{selectedCountry.name}</span>
                          </span>
                        ) : (
                          <span className="text-[#9a9a9a]">Select your country</span>
                        )}
                        <FiChevronDown className="text-sm" />
                      </button>
                      {isCountryDropdownOpen && (
                        <div className="absolute z-30 mt-2 max-h-60 w-full overflow-y-auto rounded-[12px] bg-[#1F1F1F] border border-[#2d2d2d] shadow-lg dark-scrollbar">
                          {countries.map((country) => {
                            const iso = flagCodeMap[country.name.toLowerCase()];
                            return (
                              <button
                                type="button"
                                key={country.name}
                                onClick={() => handleCountrySelect(country.name)}
                                className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-white hover:bg-[#2c2c2c] ${
                                  selectedCountry?.name === country.name ? "bg-[#3a2960]" : ""
                                }`}
                              >
                                {iso ? (
                                  <Image
                                    src={`https://flagcdn.com/w20/${iso}.png`}
                                    alt={`${country.name} flag`}
                                    width={20}
                                    height={14}
                                    className="rounded-[4px]"
                                  />
                                ) : (
                                  <span className="text-lg">{country.flag}</span>
                                )}
                                <span className="font-medium">{country.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  <Editprofilebtn
                    value={userUpdatedValue?.dateOfBirth || ""}
                    onChange={(e) =>
                      setUserUpdatedValue({
                        ...userUpdatedValue,
                        dateOfBirth: e.target.value,
                      })
                    }
                    label="Date Of Birth"
                    type="date"
                  />

                  <div className="md:col-span-2 flex flex-col gap-3">
                    <label className="text-[#8C8C8C] font-[600] text-[13px] sm:text-[15px] leading-[40px]">
                      Preferred Language
                    </label>
                    <div className="relative">
                      <select
                        value={userUpdatedValue?.preferredLanguage || ""}
                        onChange={(e) =>
                          setUserUpdatedValue({
                            ...userUpdatedValue,
                            preferredLanguage: e.target.value,
                          })
                        }
                        className={`w-full h-[47.16px] rounded-[6px] bg-[#1F1F1F] text-white border border-[#2d2d2d] outline-none px-4 pr-10 focus:border-[#8D5FCA] appearance-none ${
                          userUpdatedValue?.preferredLanguage ? "" : "text-[#9a9a9a]"
                        }`}
                      >
                        <option value="" disabled>
                          Select a language
                        </option>
                        {languageOptions.map((lang) => (
                          <option key={lang} value={lang} className="text-white bg-[#1F1F1F]">
                            {lang}
                          </option>
                        ))}
                      </select>
                      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-white/70">
                        ▾
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Professional Tab */}
            {activeTab === "Professional" && (
              <>
                <div>
                  <div className="flex flex-col gap-3">
                    <label
                      htmlFor="bio"
                      className="text-[#8C8C8C] font-[600] text-[13px] sm:text-[15px] leading-[40px]"
                    >
                      Short Bio (About Me)
                    </label>
                    <textarea
                      style={{ padding: "10px" }}
                      name="bio"
                      onChange={(e) =>
                        setUserUpdatedValue({
                          ...userUpdatedValue,
                          bio: e.target.value,
                        })
                      }
                      placeholder="Tell us about yourself..."
                      value={userUpdatedValue?.bio || ""}
                      rows={5}
                      className="w-full rounded-[6px] bg-[#1F1F1F] outline-none px-4 py-3 text-white resize-none"
                    ></textarea>
                  </div>
                </div>
                <div>
                  <Editprofilebtn
                    value={userUpdatedValue?.headline || ""}
                    onChange={(e) =>
                      setUserUpdatedValue({
                        ...userUpdatedValue,
                        headline: e.target.value,
                      })
                    }
                    label="Headline"
                    placeholder="Product Designer || Tutor"
                  />
                  
                </div>
              </>
            )}

            {/* Social Links & Media Tab */}
            {activeTab === "Social Links & Media" && (
              <div className="h-fit">
                <div className="mb-5">
                  <Editprofilebtn
                    label="Intro video (must be a valid youtube embed link)"
                    onChange={(e) =>
                      setUserUpdatedValue({
                        ...userUpdatedValue,
                        introVideo: e.target.value,
                      })
                    }
                    value={userUpdatedValue?.introVideo || ""}
                    placeholder="e.g youtube.com/etienoekanem"
                  />
                </div>
                <div className="w-full grid sm:grid-cols-2 gap-5">
                  <div>
                    <Editprofilebtn
                      label="Facebook"
                      value={userUpdatedValue?.facebook || ""}
                      onChange={(e) =>
                        setUserUpdatedValue({
                          ...userUpdatedValue,
                          facebook: e.target.value,
                        })
                      }
                      placeholder="e.g facebook.com/etienoekanem"
                    />
                    <Editprofilebtn
                      label="Linkedin"
                      value={userUpdatedValue?.linkedin || ""}
                      onChange={(e) =>
                        setUserUpdatedValue({
                          ...userUpdatedValue,
                          linkedin: e.target.value,
                        })
                      }
                      placeholder="e.g linkedin.com/in/etienoekanem"
                    />
                    <Editprofilebtn
                      label="Instagram"
                      value={userUpdatedValue?.instagram || ""}
                      onChange={(e) =>
                        setUserUpdatedValue({
                          ...userUpdatedValue,
                          instagram: e.target.value,
                        })
                      }
                      placeholder="e.g instagram.com/etienoekanem"
                    />
                  </div>
                  <div className="flex flex-col gap-0 sm:block">
                    <Editprofilebtn
                      value={userUpdatedValue?.twitter || ""}
                      onChange={(e) =>
                        setUserUpdatedValue({
                          ...userUpdatedValue,
                          twitter: e.target.value,
                        })
                      }
                      label="X (formerly Twitter)"
                      placeholder="e.g x.com/etienoekanem"
                    />
                    <div className="grid grid-cols-2 sm:grid-cols-1 gap-0">
                      <Editprofilebtn
                        label="YouTube"
                        value={userUpdatedValue?.youtube || ""}
                        onChange={(e) =>
                          setUserUpdatedValue({
                            ...userUpdatedValue,
                            youtube: e.target.value,
                          })
                        }
                        placeholder="e.g youtube.com/etien..."
                      />
                      <Editprofilebtn
                        label="Personal Website"
                        value={userUpdatedValue?.website || ""}
                        onChange={(e) =>
                          setUserUpdatedValue({
                            ...userUpdatedValue,
                            website: e.target.value,
                          })
                        }
                        placeholder="e.g themutantsschool.c..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-5 mt-6">
              <button
                style={{ padding: "10px" }}
                onClick={updateUserProfile}
                disabled={isLoading}
                className="bg-[var(--purpel-btncolor)] px-6 py-2 cursor-pointer flex items-center justify-center gap-1 rounded-[10px] text-sm font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isLoading ? "Updating..." : "Update Profile"}
              </button>
              <button
                style={{ padding: "10px" }}
                onClick={() => {
                  setEditProfile(false);
                  setError(null);
                }}
                disabled={isLoading}
                className="border border-[#4D4D4D] px-6 py-2 cursor-pointer flex items-center justify-center gap-1 rounded-[10px] text-sm font-bold text-[#D2D2D2] hover:bg-[#1A1A1A] transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
