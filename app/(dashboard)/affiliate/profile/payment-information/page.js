"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import api from "@/lib/api";
import {
  CheckCircleIcon,
  XMarkIcon,
  DocumentTextIcon,
  PhotoIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

export default function PaymentInformationPage() {
  const pathname = usePathname();
  const proofFrontRef = useRef(null);
  const proofBackRef = useRef(null);
  const documentTypeDropdownRef = useRef(null);
  const bankCountryDropdownRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userData, setUserData] = useState(null);
  const [isDocumentTypeDropdownOpen, setIsDocumentTypeDropdownOpen] = useState(false);
  const [isBankCountryDropdownOpen, setIsBankCountryDropdownOpen] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    bankName: "",
    accountHolderName: "",
    accountNumber: "",
    swiftCode: "",
    bankCountry: "",
    phoneNumber: "",
    documentType: "",
    declarationAccepted: false,
    signature: "",
    proofFront: null,
    proofBack: null,
  });

  const [previewFront, setPreviewFront] = useState(null);
  const [previewBack, setPreviewBack] = useState(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (documentTypeDropdownRef.current && !documentTypeDropdownRef.current.contains(event.target)) {
        setIsDocumentTypeDropdownOpen(false);
      }
      if (bankCountryDropdownRef.current && !bankCountryDropdownRef.current.contains(event.target)) {
        setIsBankCountryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userStr = localStorage.getItem("USER");
        if (!userStr) return;

        const user = JSON.parse(userStr);
        const userId = user._id || user.id;

        if (!userId) return;

        const response = await api.get(`/user-profile/${userId}`);
        const userData = response.data?.data || response.data;

        if (userData) {
          setUserData(userData);
          const fullName = userData.firstName && userData.lastName
            ? `${userData.firstName} ${userData.lastName}`
            : userData.name || "";
          
          setFormData((prev) => ({
            ...prev,
            fullName,
            email: userData.email || "",
            phoneNumber: userData.phone || "",
          }));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle account number input - only allow numbers
  const handleAccountNumberChange = (e) => {
    const value = e.target.value;
    // Only allow numbers
    if (value === "" || /^\d+$/.test(value)) {
      setFormData((prev) => ({
        ...prev,
        accountNumber: value,
      }));
    }
  };

  const handleFileChange = (e, fileType) => {
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

    if (fileType === "front") {
      setFormData((prev) => ({ ...prev, proofFront: file }));
      const previewUrl = URL.createObjectURL(file);
      setPreviewFront(previewUrl);
    } else if (fileType === "back") {
      setFormData((prev) => ({ ...prev, proofBack: file }));
      const previewUrl = URL.createObjectURL(file);
      setPreviewBack(previewUrl);
    }

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.bankName ||
      !formData.accountHolderName ||
      !formData.accountNumber ||
      !formData.swiftCode ||
      !formData.bankCountry ||
      !formData.phoneNumber ||
      !formData.documentType ||
      !formData.signature ||
      !formData.proofFront ||
      !formData.proofBack
    ) {
      setError("All fields are required.");
      return;
    }

    if (!formData.declarationAccepted) {
      setError("You must accept the declaration to proceed.");
      return;
    }

    const userStr = localStorage.getItem("USER");
    if (!userStr) {
      setError("User not found. Please login again.");
      return;
    }

    const user = JSON.parse(userStr);
    const userId = user._id || user.id;

    if (!userId) {
      setError("User ID not found.");
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append("userId", userId);
      submitData.append("fullName", formData.fullName);
      submitData.append("email", formData.email);
      submitData.append("role", "Affiliate");
      submitData.append("bankName", formData.bankName);
      submitData.append("accountHolderName", formData.accountHolderName);
      submitData.append("accountNumber", formData.accountNumber);
      submitData.append("swiftCode", formData.swiftCode);
      submitData.append("bankCountry", formData.bankCountry);
      submitData.append("phoneNumber", formData.phoneNumber);
      submitData.append("documentType", formData.documentType);
      submitData.append("declarationAccepted", formData.declarationAccepted.toString());
      submitData.append("signature", formData.signature);
      submitData.append("proofFront", formData.proofFront);
      submitData.append("proofBack", formData.proofBack);

      const accessToken = localStorage.getItem("login-accessToken");
      const response = await fetch(
        `https://themutantschool-backend.onrender.com/api/kyc/submit`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: submitData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit KYC. Please try again.");
      }

      const result = await response.json();
      setSuccess(result.message || "KYC submitted successfully!");
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          bankName: "",
          accountHolderName: "",
          accountNumber: "",
          swiftCode: "",
          bankCountry: "",
          documentType: "",
          declarationAccepted: false,
          signature: "",
          proofFront: null,
          proofBack: null,
        });
        setPreviewFront(null);
        setPreviewBack(null);
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error("Error submitting KYC:", error);
      setError(error.message || "Failed to submit KYC. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
      <div className="w-full lg:w-64">
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

      {/* Payment Information Content */}
      <div className="flex-1">
        <div className="rounded-lg p-6" style={{ backgroundColor: "#0F0F0F" }}>
          <h2 className="text-xl font-semibold mb-6">KYC Verification</h2>

          {/* Error Message */}
          {error && (
            <div
              className="mb-6 p-4 rounded-lg text-red-400 text-sm"
              style={{ backgroundColor: "#301B19" }}
            >
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div
              className="mb-6 p-4 rounded-lg text-green-400 text-sm flex items-center gap-2"
              style={{ backgroundColor: "#1A2E1A" }}
            >
              <CheckCircleIcon className="h-5 w-5" />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg text-white transition-all duration-200"
                    style={{
                      backgroundColor: "#000000",
                      border: "1px solid #1A1A1A",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#7343B3")}
                    onBlur={(e) => (e.target.style.borderColor = "#1A1A1A")}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg text-white transition-all duration-200"
                    style={{
                      backgroundColor: "#000000",
                      border: "1px solid #1A1A1A",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#7343B3")}
                    onBlur={(e) => (e.target.style.borderColor = "#1A1A1A")}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg text-white transition-all duration-200"
                    style={{
                      backgroundColor: "#000000",
                      border: "1px solid #1A1A1A",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#7343B3")}
                    onBlur={(e) => (e.target.style.borderColor = "#1A1A1A")}
                    required
                  />
                </div>

                <div className="relative" ref={documentTypeDropdownRef} style={{ zIndex: 10000 }}>
                  <label className="block text-sm text-gray-400 mb-2">
                    Document Type
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsBankCountryDropdownOpen(false);
                      setIsDocumentTypeDropdownOpen(!isDocumentTypeDropdownOpen);
                    }}
                    className="w-full px-4 py-3 rounded-lg text-white transition-all duration-200 flex items-center justify-between"
                    style={{
                      backgroundColor: "#000000",
                      border: isDocumentTypeDropdownOpen ? "1px solid #7343B3" : "1px solid #1A1A1A",
                    }}
                    onMouseEnter={(e) => {
                      if (!isDocumentTypeDropdownOpen) {
                        e.target.style.borderColor = "#7343B3";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isDocumentTypeDropdownOpen) {
                        e.target.style.borderColor = "#1A1A1A";
                      }
                    }}
                  >
                    <span>
                      {formData.documentType === "NATIONAL_ID"
                        ? "National ID"
                        : formData.documentType === "PASSPORT"
                        ? "Passport"
                        : formData.documentType === "DRIVER_LICENSE"
                        ? "Driver's License"
                        : "Select Document Type"}
                    </span>
                    {isDocumentTypeDropdownOpen ? (
                      <ChevronUpIcon className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {isDocumentTypeDropdownOpen && (
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
                      {[
                        { value: "NATIONAL_ID", label: "National ID" },
                        { value: "PASSPORT", label: "Passport" },
                        { value: "DRIVER_LICENSE", label: "Driver's License" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              documentType: option.value,
                            }));
                            setIsDocumentTypeDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 text-sm transition-all duration-200 flex items-center justify-between"
                          style={{
                            color: formData.documentType === option.value ? "#7343B3" : "#FFFFFF",
                            backgroundColor:
                              formData.documentType === option.value
                                ? "#0C0C0C"
                                : "transparent",
                          }}
                          onMouseEnter={(e) => {
                            if (formData.documentType !== option.value) {
                              e.target.style.backgroundColor = "#1A1A1A";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (formData.documentType !== option.value) {
                              e.target.style.backgroundColor = "transparent";
                            }
                          }}
                        >
                          <span
                            style={{
                              color: formData.documentType === option.value ? "#7343B3" : "#FFFFFF",
                            }}
                          >
                            {option.label}
                          </span>
                          {formData.documentType === option.value && (
                            <CheckIcon className="h-4 w-4" style={{ color: "#7343B3" }} />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bank Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Bank Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg text-white transition-all duration-200"
                    style={{
                      backgroundColor: "#000000",
                      border: "1px solid #1A1A1A",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#7343B3")}
                    onBlur={(e) => (e.target.style.borderColor = "#1A1A1A")}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    name="accountHolderName"
                    value={formData.accountHolderName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg text-white transition-all duration-200"
                    style={{
                      backgroundColor: "#000000",
                      border: "1px solid #1A1A1A",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#7343B3")}
                    onBlur={(e) => (e.target.style.borderColor = "#1A1A1A")}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Account Number
                  </label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleAccountNumberChange}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="w-full px-4 py-3 rounded-lg text-white transition-all duration-200"
                    style={{
                      backgroundColor: "#000000",
                      border: "1px solid #1A1A1A",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#7343B3")}
                    onBlur={(e) => (e.target.style.borderColor = "#1A1A1A")}
                    placeholder="Enter numbers only"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    SWIFT Code
                  </label>
                  <input
                    type="text"
                    name="swiftCode"
                    value={formData.swiftCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg text-white transition-all duration-200"
                    style={{
                      backgroundColor: "#000000",
                      border: "1px solid #1A1A1A",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#7343B3")}
                    onBlur={(e) => (e.target.style.borderColor = "#1A1A1A")}
                    required
                  />
                </div>

                <div className="md:col-span-2 relative" ref={bankCountryDropdownRef} style={{ zIndex: 9999 }}>
                  <label className="block text-sm text-gray-400 mb-2">
                    Bank Country
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsDocumentTypeDropdownOpen(false);
                      setIsBankCountryDropdownOpen(!isBankCountryDropdownOpen);
                    }}
                    className="w-full px-4 py-3 rounded-lg text-white transition-all duration-200 flex items-center justify-between"
                    style={{
                      backgroundColor: "#000000",
                      border: isBankCountryDropdownOpen ? "1px solid #7343B3" : "1px solid #1A1A1A",
                    }}
                    onMouseEnter={(e) => {
                      if (!isBankCountryDropdownOpen) {
                        e.target.style.borderColor = "#7343B3";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isBankCountryDropdownOpen) {
                        e.target.style.borderColor = "#1A1A1A";
                      }
                    }}
                  >
                    <span>{formData.bankCountry || "Select Country"}</span>
                    {isBankCountryDropdownOpen ? (
                      <ChevronUpIcon className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {isBankCountryDropdownOpen && (
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
                      {countries.map((country) => (
                        <button
                          key={country}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              bankCountry: country,
                            }));
                            setIsBankCountryDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 text-sm transition-all duration-200 flex items-center justify-between"
                          style={{
                            color: formData.bankCountry === country ? "#7343B3" : "#FFFFFF",
                            backgroundColor:
                              formData.bankCountry === country
                                ? "#0C0C0C"
                                : "transparent",
                          }}
                          onMouseEnter={(e) => {
                            if (formData.bankCountry !== country) {
                              e.target.style.backgroundColor = "#1A1A1A";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (formData.bankCountry !== country) {
                              e.target.style.backgroundColor = "transparent";
                            }
                          }}
                        >
                          <span
                            style={{
                              color: formData.bankCountry === country ? "#7343B3" : "#FFFFFF",
                            }}
                          >
                            {country}
                          </span>
                          {formData.bankCountry === country && (
                            <CheckIcon className="h-4 w-4" style={{ color: "#7343B3" }} />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Document Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Identity Documents</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Front Document */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    <DocumentTextIcon className="h-4 w-4 inline mr-2" />
                    Front of ID Document
                  </label>
                  <div className="space-y-2">
                    {previewFront ? (
                      <div className="relative">
                        <Image
                          src={previewFront}
                          alt="Front ID Preview"
                          width={400}
                          height={300}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewFront(null);
                            setFormData((prev) => ({ ...prev, proofFront: null }));
                            if (proofFrontRef.current) proofFrontRef.current.value = "";
                          }}
                          className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => proofFrontRef.current?.click()}
                        className="w-full px-4 py-8 rounded-lg border-2 border-dashed text-gray-400 hover:text-white hover:border-[#7343B3] transition-all duration-200 flex flex-col items-center justify-center"
                        style={{ borderColor: "#1A1A1A" }}
                      >
                        <PhotoIcon className="h-8 w-8 mb-2" />
                        <span className="text-sm">Click to upload front of ID</span>
                      </button>
                    )}
                    <input
                      ref={proofFrontRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "front")}
                      className="hidden"
                      required
                    />
                  </div>
                </div>

                {/* Back Document */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    <DocumentTextIcon className="h-4 w-4 inline mr-2" />
                    Back of ID Document
                  </label>
                  <div className="space-y-2">
                    {previewBack ? (
                      <div className="relative">
                        <Image
                          src={previewBack}
                          alt="Back ID Preview"
                          width={400}
                          height={300}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewBack(null);
                            setFormData((prev) => ({ ...prev, proofBack: null }));
                            if (proofBackRef.current) proofBackRef.current.value = "";
                          }}
                          className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => proofBackRef.current?.click()}
                        className="w-full px-4 py-8 rounded-lg border-2 border-dashed text-gray-400 hover:text-white hover:border-[#7343B3] transition-all duration-200 flex flex-col items-center justify-center"
                        style={{ borderColor: "#1A1A1A" }}
                      >
                        <PhotoIcon className="h-8 w-8 mb-2" />
                        <span className="text-sm">Click to upload back of ID</span>
                      </button>
                    )}
                    <input
                      ref={proofBackRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "back")}
                      className="hidden"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Signature */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Digital Signature (Your Full Name)
              </label>
              <input
                type="text"
                name="signature"
                value={formData.signature}
                onChange={handleInputChange}
                placeholder="Enter your full name as signature"
                className="w-full px-4 py-3 rounded-lg text-white transition-all duration-200"
                style={{
                  backgroundColor: "#000000",
                  border: "1px solid #1A1A1A",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#7343B3")}
                onBlur={(e) => (e.target.style.borderColor = "#1A1A1A")}
                required
              />
            </div>

            {/* Declaration */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                name="declarationAccepted"
                checked={formData.declarationAccepted}
                onChange={handleInputChange}
                className="mt-1 w-4 h-4 rounded"
                style={{ accentColor: "#7343B3" }}
                required
              />
              <label className="text-sm text-gray-400">
                I declare that the information provided is true and accurate. I understand that providing false information may result in account suspension.
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-lg text-white font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: loading ? "#5a2d8a" : "#7343B3" }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.backgroundColor = "#9159d1";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.backgroundColor = "#7343B3";
                  }
                }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  "Submit KYC"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
