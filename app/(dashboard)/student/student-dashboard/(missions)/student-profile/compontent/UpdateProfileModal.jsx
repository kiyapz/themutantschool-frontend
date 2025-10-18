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
  const countries = useMemo(
    () => [
      { code: "+234", flag: "🇳🇬", name: "Nigeria" },
      { code: "+1", flag: "🇺🇸", name: "United States" },
      { code: "+44", flag: "🇬🇧", name: "United Kingdom" },
      { code: "+33", flag: "🇫🇷", name: "France" },
      { code: "+49", flag: "🇩🇪", name: "Germany" },
      { code: "+81", flag: "🇯🇵", name: "Japan" },
      { code: "+86", flag: "🇨🇳", name: "China" },
      { code: "+91", flag: "🇮🇳", name: "India" },
      { code: "+27", flag: "🇿🇦", name: "South Africa" },
      { code: "+55", flag: "🇧🇷", name: "Brazil" },
      { code: "+61", flag: "🇦🇺", name: "Australia" },
      { code: "+7", flag: "🇷🇺", name: "Russia" },
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
    reset({
      firstName: defaults.firstName || "",
      lastName: defaults.lastName || "",
      username: defaults.username || "",
      email: defaults.email || "",
      phoneCountry: defaults.phoneCountry || countries[0]?.code || "+234",
      phoneNumber: defaults.phoneNumber || "",
      nationality: defaults.nationality || "",
      gender: normalizeGenderIn(defaults.gender),
      dob: formatDateIn(defaults.dob),
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
          className={`bg-[#070707] text-sm rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#840B94] ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
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

  const LoadingSpinner = () => (
    <svg
      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div
            className="bg-[#101010] rounded-lg flex items-center justify-center"
            style={{ padding: "40px" }}
          >
            <LoadingSpinner />
            <span
              className="text-white text-lg font-semibold"
              style={{ marginLeft: "12px" }}
            >
              Loading...
            </span>
          </div>
        </div>
      )}

      <div
        className={`bg-[#101010] rounded-[10px] w-[955px] max-w-full text-white ${
          isLoading ? "opacity-50" : ""
        }`}
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
              className={`text-sm font-semibold ${
                activeTab === "personal"
                  ? "text-[#840B94] border-b-2 border-[#840B94]"
                  : "text-gray-400"
              }`}
              onClick={() => setActiveTab("personal")}
              disabled={isLoading}
              style={{ padding: "10px 16px" }}
            >
              Personal
            </button>
            <button
              className={`text-sm font-semibold ${
                activeTab === "social"
                  ? "text-[#840B94] border-b-2 border-[#840B94]"
                  : "text-gray-400"
              }`}
              onClick={() => setActiveTab("social")}
              disabled={isLoading}
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
                <InputField label="Username" id="username" name="username" />
                <InputField
                  label="Email Address"
                  id="email"
                  name="email"
                  type="email"
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
                        className={`bg-[#070707] text-xs rounded focus:outline-none focus:ring-2 focus:ring-purple-600 appearance-none cursor-pointer ${
                          isLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={isLoading}
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
                          className="w-3 h-3 text-gray-400"
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
                      className={`bg-[#070707] text-sm rounded w-full focus:outline-none focus:ring-2 focus:ring-purple-600 ${
                        isLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={isLoading}
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
                        "border border-[#604196] bg-[#1C0A22] rounded-[6px]"
                      } flex items-center space-x-1 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#840B94] ${
                        isLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      style={{ padding: "10px" }}
                    >
                      <input
                        type="radio"
                        value="male"
                        className="accent-[#840B94]"
                        disabled={isLoading}
                        {...register("gender")}
                      />
                      <span>Male</span>
                    </label>
                    <label
                      className={`${
                        watch("gender") === "female" &&
                        "border border-[#604196] bg-[#1C0A22] rounded-[6px]"
                      } flex items-center space-x-1 text-sm cursor-pointer ${
                        isLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      style={{ padding: "10px" }}
                    >
                      <input
                        type="radio"
                        value="female"
                        className="accent-[#840B94]"
                        disabled={isLoading}
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
                <InputField
                  label="Nationality"
                  id="nationality"
                  name="nationality"
                />
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
                    className={`bg-[#070707] text-sm rounded w-full focus:outline-none focus:ring-2 focus:ring-[#840B94] ${
                      isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isLoading}
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
              className={`bg-[#840B94] text-white text-sm font-bold rounded hover:bg-[#6a0979] transition-colors flex items-center ${
                isSubmitting || isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              style={{ padding: "10px 20px" }}
            >
              {isSubmitting || isLoading ? (
                <>
                  <LoadingSpinner />
                  Updating...
                </>
              ) : (
                "Update Profile"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className={`text-gray-400 hover:text-gray-200 text-sm transition-colors ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
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
