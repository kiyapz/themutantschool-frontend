import React, { useState } from "react";

const UpdateProfileModal = ({ onClose, onUpdate }) => {
  // Country data
  const countries = [
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
  ];

  // Reusable InputField component inside the same file/component
  const InputField = ({
    label,
    id,
    name,
    type = "text",
    value,
    onChange,
    placeholder = "",
    required = false,
    extraLabel = null,
    children,
    ...props
  }) => {
    return (
      <div>
        <label htmlFor={id} className="text-xs font-semibold mb-1 block">
          {label} {required && <span className="text-red-500">*</span>}{" "}
          {extraLabel}
        </label>
        {children ? (
          children
        ) : (
          <input
            id={id}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="bg-[#070707] text-sm rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#840B94] "
            {...props}
          />
        )}
      </div>
    );
  };

  // State and handlers
  const [activeTab, setActiveTab] = useState("personal");
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [formData, setFormData] = useState({
    firstName: "Etieno",
    lastName: "Ekanem",
    username: "PerfectGift2012",
    email: "etienodouglas@gmail.com",
    phoneNumber: "09129495797",
    nationality: "Nigerian",
    gender: "male",
    dob: "12-Feb-2000",
    displayFullName: false,
    socialLinks: {
      twitter: "",
      facebook: "",
      linkedin: "",
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name in formData.socialLinks) {
      setFormData((prev) => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [name]: value },
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onUpdate) {
      onUpdate(formData);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="bg-[#101010] rounded-[10px] p-8 w-[955.0723876953125px] max-w-full text-white">
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4">Update Profile</h2>
          <div className="flex border-b border-gray-700 mb-6">
            <button
              className={`py-2 px-4 text-sm font-semibold ${
                activeTab === "personal"
                  ? "text-[#840B94] border-b-2 border-[#840B94]"
                  : "text-gray-400"
              }`}
              onClick={() => setActiveTab("personal")}
            >
              Personal
            </button>
            <button
              className={`py-2 px-4 text-sm font-semibold ${
                activeTab === "social"
                  ? "text-[#840B94] border-b-2 border-[#840B94]"
                  : "text-gray-400"
              }`}
              onClick={() => setActiveTab("social")}
            >
              Social Links
            </button>
          </div>
        </div>

        <div>
          {activeTab === "personal" ? (
            <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <InputField
                  label="First Name"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <InputField
                  label="Last Name"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <InputField
                  label="Username"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
                <InputField
                  label="Email Address"
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <InputField
                  label="Phone Number"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                >
                  <div className="flex items-center">
                    <div className="relative">
                      <select
                        value={`${selectedCountry.flag} ${selectedCountry.code}`}
                        onChange={(e) => {
                          const selected = countries.find(
                            (country) =>
                              `${country.flag} ${country.code}` ===
                              e.target.value
                          );
                          setSelectedCountry(selected);
                        }}
                        className="bg-[#070707] text-xs rounded px-2 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-purple-600 appearance-none pr-6 cursor-pointer"
                      >
                        {countries.map((country) => (
                          <option
                            key={country.code}
                            value={`${country.flag} ${country.code}`}
                          >
                            {country.flag} {country.code}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-1 top-1/2 transform -translate-y-1/2 pointer-events-none">
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
                      name="phoneNumber"
                      type="text"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="bg-[#070707] text-sm rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-600"
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
                  <div className="flex space-x-4 mt-1 ">
                    <label  style={{ padding: "10px" }}  className={ ` ${
                        formData.gender === "male" &&
                        "border border-[#604196] bg-[#1C0A22] rounded-[6px] "
                      }  flex items-center space-x-1 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#840B94]`}>
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={formData.gender === "male"}
                        onChange={handleChange}
                        className="accent-[#840B94] "
                      />
                      <span>Male</span>
                    </label>
                    <label
                      style={{ padding: "10px" }}
                      className={`${
                        formData.gender === "female" &&
                        "border border-[#604196] bg-[#1C0A22] rounded-[6px] "
                      } flex items-center space-x-1 text-sm cursor-pointer `}
                    >
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={formData.gender === "female"}
                        onChange={handleChange}
                        className="accent-[#840B94] "
                      />
                      <span>Female</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <InputField
                  label="Nationality"
                  id="nationality"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                />
                <InputField
                  label="Date Of Birth"
                  id="dob"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                />
              </div>

              <div className="flex items-center space-x-2 mb-6">
                <input
                  type="checkbox"
                  id="displayFullName"
                  name="displayFullName"
                  checked={formData.displayFullName}
                  onChange={handleChange}
                  className="accent-purple-600"
                />
                <label
                  htmlFor="displayFullName"
                  className="text-xs font-semibold cursor-pointer"
                >
                  Display Full Name
                </label>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <InputField
                  label="Twitter"
                  id="twitter"
                  name="twitter"
                  value={formData.socialLinks.twitter}
                  onChange={handleChange}
                  placeholder="https://twitter.com/username"
                />
              </div>
              <div className="grid w-full gap-5 sm:grid-cols-2">
                <InputField
                  label="Facebook"
                  id="facebook"
                  name="facebook"
                  value={formData.socialLinks.facebook}
                  onChange={handleChange}
                  placeholder="https://facebook.com/username"
                />
                <InputField
                  label="LinkedIn"
                  id="linkedin"
                  name="linkedin"
                  value={formData.socialLinks.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                />
                <InputField
                  label="Instagram"
                  id="Instagram"
                  name="Instagram"
                  value={formData.socialLinks.Instagram}
                  onChange={handleChange}
                  placeholder="https://Instagram.com/username"
                />
                <InputField
                  label="X (formerly Twitter)"
                  id="X (formerly Twitter)"
                  name="X (formerly Twitter)"
                  value={formData.socialLinks.X}
                  onChange={handleChange}
                  placeholder="https://X (formerly Twitter).com/in/username"
                />

                <InputField
                  label="Youtube"
                  id="Youtube"
                  name="Youtube"
                  value={formData.socialLinks.facebook}
                  onChange={handleChange}
                  placeholder="https://Youtube.com/username"
                />
                <InputField
                  label="Personal website"
                  id="Personal website"
                  name="Personal website"
                  value={formData.socialLinks.linkedin}
                  onChange={handleChange}
                  placeholder="https://Personal website.com/in/username"
                />
              </div>
            </>
          )}

          <div
            style={{ marginTop: "20px" }}
            className="flex items-center space-x-4"
          >
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-[#840B94] text-white text-sm font-bold px-5 py-2 rounded hover:bg-[#6a0979] transition-colors"
            >
              Update Profile
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200 text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfileModal;
