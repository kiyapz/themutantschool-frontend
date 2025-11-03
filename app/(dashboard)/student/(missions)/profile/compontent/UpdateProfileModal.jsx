"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

const UpdateProfileModal = ({
  onClose,
  onUpdate,
  defaults = {},
  defaultAvatarUrl = "/default-avatar.png",
  isLoading = false,
}) => {
  // Add custom styles for select dropdown
  React.useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      select option {
        background-color: var(--accent);
        color: white;
        padding: 8px;
      }
      select option:hover,
      select option:checked {
        background-color: var(--mutant-color) !important;
        color: white;
      }
      select::-webkit-scrollbar {
        width: 8px;
      }
      select::-webkit-scrollbar-track {
        background: var(--card);
        border-radius: 10px;
      }
      select::-webkit-scrollbar-thumb {
        background: var(--mutant-color);
        border-radius: 10px;
      }
      select::-webkit-scrollbar-thumb:hover {
        background: var(--primary);
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
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
      { code: "+970", flag: "🇵🇸", name: "Palestine" },
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
      { code: "+211", flag: "🇸🇸", name: "South Sudan" },
      { code: "+34", flag: "🇪🇸", name: "Spain" },
      { code: "+94", flag: "🇱🇰", name: "Sri Lanka" },
      { code: "+249", flag: "🇸🇩", name: "Sudan" },
      { code: "+597", flag: "🇸🇷", name: "Suriname" },
      { code: "+268", flag: "🇸🇿", name: "Swaziland" },
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

  const [activeTab, setActiveTab] = useState("personal");
  const [previewUrl, setPreviewUrl] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      phoneCountry: countries[0]?.code || "+234",
      phoneNumber: "",
      nationality: "",
      gender: "",
      dob: "",
      profile: {
        bio: "",
        avatar: { url: "" }, // text URL field
        socialLinks: {
          twitter: "",
          facebook: "",
          linkedin: "",
          instagram: "",
          website: "",
          youtube: "",
        },
      },
      avatarFile: null, // file input
    },
  });

  const normalizeGenderIn = (g) => {
    const v = (g || "").toString().toLowerCase();
    return v === "male" || v === "female" ? v : "";
  };
  const normalizeGenderOut = (g) =>
    g === "male" ? "Male" : g === "female" ? "Female" : g;

  const formatDateIn = (dateStr) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toISOString().split("T")[0];
    } catch (e) {
      return ""; // Fallback for invalid dates
    }
  };

  useEffect(() => {
    const formattedDob = formatDateIn(defaults.dob);
    console.log("🔄 Modal reset with defaults:", {
      originalDob: defaults.dob,
      formattedDob: formattedDob,
      phoneCountry: defaults.phoneCountry,
      phoneNumber: defaults.phoneNumber,
    });

    reset({
      firstName: defaults.firstName || "",
      lastName: defaults.lastName || "",
      username: defaults.username || "",
      email: defaults.email || "",
      phoneCountry: defaults.phoneCountry || "+234",
      phoneNumber: defaults.phoneNumber || "",
      nationality: defaults.nationality || "",
      gender: normalizeGenderIn(defaults.gender),
      dob: formattedDob,
      profile: {
        bio: defaults?.profile?.bio || "",
        avatar: defaults?.profile?.avatar || { url: "" },
        socialLinks: {
          twitter: defaults?.profile?.socialLinks?.twitter || "",
          facebook: defaults?.profile?.socialLinks?.facebook || "",
          linkedin: defaults?.profile?.socialLinks?.linkedin || "",
          instagram: defaults?.profile?.socialLinks?.instagram || "",
          website: defaults?.profile?.socialLinks?.website || "",
          youtube: defaults?.profile?.socialLinks?.youtube || "",
        },
      },
      avatarFile: null,
    });
    setPreviewUrl(defaults?.profile?.avatar?.url || "");
  }, [defaults, countries, reset]);

  const phoneCountry = watch("phoneCountry");
  const selectedCountry = useMemo(
    () => countries.find((c) => c.code === phoneCountry) || countries[0],
    [countries, phoneCountry]
  );

  // Local preview for chosen file
  const chosenFile = watch("avatarFile");
  useEffect(() => {
    if (chosenFile && chosenFile.length > 0) {
      const file = chosenFile[0];
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [chosenFile]);

  const onSubmit = (data) => {
    console.log("📝 RAW Form data received:", data);
    console.log(
      "📝 Date of Birth value from form:",
      data.dob,
      "Type:",
      typeof data.dob
    );

    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      email: data.email,
      phoneNumber: data.phoneNumber,
      nationality: data.nationality,
      gender: normalizeGenderOut(data.gender),
      dob: data.dob,
      profile: {
        bio: data.profile?.bio || "",
        avatar: { url: data.profile?.avatar?.url || "" }, // text URL (used only when no file)
        socialLinks: { ...data.profile?.socialLinks },
      },
      avatarFile:
        data.avatarFile && data.avatarFile.length > 0
          ? data.avatarFile[0]
          : null,
    };

    payload.phoneE164 = `${data.phoneCountry}${(data.phoneNumber || "").replace(
      /\D/g,
      ""
    )}`;

    console.log("📝 Form data being submitted:", {
      dob: data.dob,
      dobInPayload: payload.dob,
      phoneNumber: data.phoneNumber,
      phoneCountry: data.phoneCountry,
      phoneE164: payload.phoneE164,
      gender: payload.gender,
    });

    console.log("📦 FULL PAYLOAD:", payload);

    onUpdate?.(payload);
  };

  const InputField = ({
    label,
    id,
    name,
    type = "text",
    required = false,
    extraLabel = null,
    children,
    disabled = false,
    ...props
  }) => (
    <div>
      <label
        htmlFor={id}
        className="text-xs font-semibold mb-1 block"
        style={{ padding: "10px" }}
      >
        {label} {required && <span className="text-red-500">*</span>}{" "}
        {extraLabel}
      </label>
      {children ? (
        children
      ) : (
        <input
          id={id}
          type={type}
          className={`bg-[var(--accent)] text-sm rounded-[10px] px-3 py-2 w-full text-white focus:outline-none focus:ring-2 focus:ring-[var(--mutant-color)] ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={disabled}
          {...register(
            name,
            required ? { required: `${label} is required` } : {}
          )}
          {...props}
          style={{ padding: "10px" }}
        />
      )}
      {errors?.[name]?.message && (
        <p className="text-red-400 text-[11px]" style={{ marginTop: "4px" }}>
          {errors[name].message}
        </p>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div
        className="bg-[#101010] rounded-[10px] w-[955px] max-w-full text-white"
        style={{ padding: "32px" }}
      >
        <div style={{ marginBottom: "24px" }}>
          <h2 className="text-lg font-bold" style={{ marginBottom: "16px" }}>
            Update Profile
          </h2>
          <div
            className="flex border-b border-gray-700"
            style={{ marginBottom: "24px" }}
          >
            <button
              className={`text-sm font-semibold transition-colors ${
                activeTab === "personal"
                  ? "text-[var(--mutant-color)] border-b-2 border-[var(--mutant-color)]"
                  : "text-[var(--text)] hover:text-[var(--mutant-color)]"
              }`}
              onClick={() => setActiveTab("personal")}
              style={{ padding: "10px 16px" }}
            >
              Personal
            </button>
            <button
              className={`text-sm font-semibold transition-colors ${
                activeTab === "social"
                  ? "text-[var(--mutant-color)] border-b-2 border-[var(--mutant-color)]"
                  : "text-[var(--text)] hover:text-[var(--mutant-color)]"
              }`}
              onClick={() => setActiveTab("social")}
              style={{ padding: "10px 16px" }}
            >
              Social Links
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {activeTab === "personal" ? (
            <>
              <div
                className="grid grid-cols-2 gap-4"
                style={{ marginBottom: "16px" }}
              >
                <InputField
                  label="First Name"
                  id="firstName"
                  name="firstName"
                  required
                />
                <InputField
                  label="Last Name"
                  id="lastName"
                  name="lastName"
                  required
                />
              </div>

              <div
                className="grid grid-cols-2 gap-4"
                style={{ marginBottom: "16px" }}
              >
                <InputField
                  label="Username"
                  id="username"
                  name="username"
                  disabled={true}
                />
                <InputField
                  label="Email Address"
                  id="email"
                  name="email"
                  type="email"
                  disabled={true}
                />
              </div>

              <div
                className="grid grid-cols-2 gap-4"
                style={{ marginBottom: "16px" }}
              >
                <InputField
                  label="Phone Number"
                  id="phoneNumber"
                  name="phoneNumber"
                >
                  <div className="flex items-center gap-1">
                    <div className="relative">
                      <select
                        value={`${
                          (
                            countries.find(
                              (c) => c.code === watch("phoneCountry")
                            ) || countries[0]
                          ).flag
                        } ${watch("phoneCountry")}`}
                        onChange={(e) => {
                          const sel = countries.find(
                            (c) => `${c.flag} ${c.code}` === e.target.value
                          );
                          if (sel)
                            setValue("phoneCountry", sel.code, {
                              shouldDirty: true,
                              shouldTouch: true,
                            });
                        }}
                        className="bg-[var(--accent)] text-white text-xs rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[var(--mutant-color)] appearance-none cursor-pointer"
                        style={{
                          padding: "10px",
                          paddingRight: "24px",
                          marginRight: "8px",
                        }}
                      >
                        {countries.map((c) => (
                          <option key={c.code} value={`${c.flag} ${c.code}`}>
                            {c.flag} {c.code}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg
                          className="w-3 h-3 text-[var(--text)]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                    <input
                      id="phoneNumber"
                      type="text"
                      placeholder="Phone number"
                      className="bg-[var(--accent)] text-sm text-white rounded-[10px] w-full focus:outline-none focus:ring-2 focus:ring-[var(--mutant-color)]"
                      {...register("phoneNumber")}
                      style={{ padding: "10px" }}
                    />
                  </div>
                </InputField>

                <div>
                  <label
                    className="text-xs font-semibold mb-1 block"
                    htmlFor="gender"
                  >
                    Gender
                  </label>
                  <div
                    className="flex space-x-4"
                    style={{ marginTop: "4px", padding: "16px" }}
                  >
                    <label
                      className={`${
                        watch("gender") === "male" &&
                        "border border-[var(--mutant-color)] bg-[var(--card)] rounded-[6px]"
                      } flex items-center space-x-1 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--mutant-color)]`}
                      style={{ padding: "10px" }}
                    >
                      <input
                        type="radio"
                        value="male"
                        className="accent-[var(--mutant-color)]"
                        {...register("gender")}
                      />
                      <span>Male</span>
                    </label>
                    <label
                      className={`${
                        watch("gender") === "female" &&
                        "border border-[var(--mutant-color)] bg-[var(--card)] rounded-[6px]"
                      } flex items-center space-x-1 text-sm cursor-pointer`}
                      style={{ padding: "10px" }}
                    >
                      <input
                        type="radio"
                        value="female"
                        className="accent-[var(--mutant-color)]"
                        {...register("gender")}
                      />
                      <span>Female</span>
                    </label>
                  </div>
                </div>
              </div>

              <div
                className="grid grid-cols-2 gap-4"
                style={{ marginBottom: "16px" }}
              >
                <InputField label="Country" id="nationality" name="nationality">
                  <select
                    id="nationality"
                    {...register("nationality")}
                    className="bg-[var(--accent)] text-white text-sm rounded-[10px] px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[var(--mutant-color)] cursor-pointer"
                    style={{ padding: "10px" }}
                  >
                    <option value="">Select your country</option>
                    {countries.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
                </InputField>
                <InputField
                  label="Date Of Birth"
                  id="dob"
                  name="dob"
                  type="date"
                />
              </div>
            </>
          ) : (
            <>
              <div style={{ marginTop: "16px" }}>
                <InputField label="Bio" id="bio" name="profile.bio">
                  <textarea
                    rows={4}
                    className="bg-[var(--accent)] text-sm text-white rounded-[10px] w-full focus:outline-none focus:ring-2 focus:ring-[var(--mutant-color)]"
                    {...register("profile.bio")}
                    placeholder="Tell us about yourself..."
                    style={{ padding: "10px" }}
                  />
                </InputField>
              </div>
              <div className="grid w-full gap-5 sm:grid-cols-2">
                <InputField
                  label="Twitter"
                  id="twitter"
                  name="profile.socialLinks.twitter"
                  placeholder="https://twitter.com/username"
                />
                <InputField
                  label="Facebook"
                  id="facebook"
                  name="profile.socialLinks.facebook"
                  placeholder="https://facebook.com/username"
                />
                <InputField
                  label="LinkedIn"
                  id="linkedin"
                  name="profile.socialLinks.linkedin"
                  placeholder="https://linkedin.com/in/username"
                />
                <InputField
                  label="Instagram"
                  id="instagram"
                  name="profile.socialLinks.instagram"
                  placeholder="https://instagram.com/username"
                />
                <InputField
                  label="Youtube"
                  id="youtube"
                  name="profile.socialLinks.youtube"
                  placeholder="https://youtube.com/username"
                />
                <InputField
                  label="Personal website"
                  id="website"
                  name="profile.socialLinks.website"
                  placeholder="https://yourdomain.com"
                />
              </div>
            </>
          )}

          <div
            className="flex items-center gap-2 space-x-4"
            style={{ marginTop: "20px" }}
          >
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className={`btn text-white text-sm font-bold rounded-[10px] transition-colors flex items-center gap-2 ${
                isSubmitting || isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              style={{ padding: "10px 20px" }}
            >
              {isSubmitting || isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </>
              ) : (
                "Update Profile"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-[var(--text)] hover:text-[var(--mutant-color)] text-sm transition-colors"
              style={{ padding: "10px" }}
            >
              Cancel
            </button>
          </div>

          {/* keep phoneCountry stored */}
          <input type="hidden" {...register("phoneCountry")} />
        </form>
      </div>
    </div>
  );
};

export default UpdateProfileModal;
