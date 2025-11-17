"use client";
import { useState, useCallback, useEffect } from "react";
import profilebase from "../../profile/_components/profilebase";
import CustomDropdown from "./CustomDropdown";

export default function KYCModal({ isOpen, onClose, onSuccess, existingKYC }) {
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "",
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewFront, setPreviewFront] = useState(null);
  const [previewBack, setPreviewBack] = useState(null);
  const isUpdateMode = existingKYC && existingKYC.status;

  // Load user data and existing KYC from localStorage on mount
  useEffect(() => {
    if (isOpen) {
      const storedUser = localStorage.getItem("USER");
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          // Normalize role to ensure proper capitalization
          const userRole = user.role || "instructor";
          const normalizedUserRole = userRole.charAt(0).toUpperCase() + userRole.slice(1).toLowerCase();
          
          // If updating, pre-fill with existing KYC data, otherwise use user data
          if (existingKYC && existingKYC.status) {
            setFormData({
              fullName: existingKYC.fullName || (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.fullName || ""),
              email: existingKYC.email || user.email || "",
              role: normalizedUserRole,
              bankName: existingKYC.bankName || "",
              accountHolderName: existingKYC.accountHolderName || "",
              accountNumber: existingKYC.accountNumber || "",
              swiftCode: existingKYC.swiftCode || "",
              bankCountry: existingKYC.bankCountry || "",
              phoneNumber: existingKYC.phoneNumber || user.phoneNumber || "",
              documentType: existingKYC.documentType || "",
              declarationAccepted: false,
              signature: existingKYC.signature || "",
              proofFront: null,
              proofBack: null,
            });
            
            // Set preview images from existing URLs if available
            if (existingKYC.proofFrontUrl) {
              setPreviewFront(existingKYC.proofFrontUrl);
            }
            if (existingKYC.proofBackUrl) {
              setPreviewBack(existingKYC.proofBackUrl);
            }
          } else {
            setFormData((prev) => ({
              ...prev,
              email: user.email || "",
              role: normalizedUserRole,
              fullName: user.firstName && user.lastName 
                ? `${user.firstName} ${user.lastName}` 
                : user.fullName || "",
              phoneNumber: user.phoneNumber || "",
            }));
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    } else {
      // Clean up previews when modal closes
      setPreviewFront(null);
      setPreviewBack(null);
    }
  }, [isOpen, existingKYC]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        if (name === "proofFront") {
          setPreviewFront(reader.result);
        } else if (name === "proofBack") {
          setPreviewBack(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // Get userId from localStorage
    const storedUser = localStorage.getItem("USER");
    let userId = "";
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        userId = user._id || user.id || "";
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    // Validation - for updates, files are optional if they already exist
    const hasExistingFiles = existingKYC && existingKYC.proofFrontUrl && existingKYC.proofBackUrl;
    const requiresNewFiles = !isUpdateMode || !hasExistingFiles;
    
    if (
      !userId ||
      !formData.fullName ||
      !formData.email ||
      !formData.role ||
      !formData.bankName ||
      !formData.accountHolderName ||
      !formData.accountNumber ||
      !formData.swiftCode ||
      !formData.bankCountry ||
      !formData.phoneNumber ||
      !formData.documentType ||
      !formData.declarationAccepted ||
      !formData.signature ||
      (requiresNewFiles && (!formData.proofFront || !formData.proofBack))
    ) {
      setError("Please fill in all required fields and upload all required documents.");
      setIsLoading(false);
      return;
    }

    try {
      const accessToken = localStorage.getItem("login-accessToken");
      if (!accessToken) {
        throw new Error("No access token available");
      }

      // Normalize role value to match API enum (capitalize first letter)
      const normalizedRole = formData.role 
        ? formData.role.charAt(0).toUpperCase() + formData.role.slice(1).toLowerCase()
        : "Instructor";

      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append("userId", userId);
      submitData.append("fullName", formData.fullName);
      submitData.append("email", formData.email);
      submitData.append("role", normalizedRole);
      submitData.append("bankName", formData.bankName);
      submitData.append("accountHolderName", formData.accountHolderName);
      submitData.append("accountNumber", formData.accountNumber);
      submitData.append("swiftCode", formData.swiftCode);
      submitData.append("bankCountry", formData.bankCountry);
      submitData.append("phoneNumber", formData.phoneNumber);
      submitData.append("documentType", formData.documentType);
      submitData.append("declarationAccepted", formData.declarationAccepted);
      submitData.append("signature", formData.signature);
      
      // Only append files if they are new (not using existing ones)
      if (formData.proofFront) {
        submitData.append("proofFront", formData.proofFront);
      }
      if (formData.proofBack) {
        submitData.append("proofBack", formData.proofBack);
      }

      // Use update endpoint if updating, otherwise use submit endpoint
      const endpoint = isUpdateMode ? `kyc/update/${userId}` : "kyc/submit";
      const method = isUpdateMode ? "put" : "post";

      const response = await profilebase[method](endpoint, submitData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 || response.status === 201) {
        onSuccess(isUpdateMode 
          ? "KYC information updated successfully! It will be reviewed shortly." 
          : "KYC information submitted successfully! It will be reviewed shortly.");
        // Reset form
        setFormData({
          fullName: "",
          email: "",
          role: "",
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
        setPreviewFront(null);
        setPreviewBack(null);
        setActiveTab("personal");
        onClose();
      } else {
        throw new Error(response.data.message || "Failed to submit KYC information.");
      }
    } catch (err) {
      console.error("KYC submission error:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [formData, onClose, onSuccess, isUpdateMode, existingKYC]);

  if (!isOpen) {
    return null;
  }

  const documentTypeOptions = [
    { value: "NATIONAL_ID", label: "National ID" },
    { value: "PASSPORT", label: "Passport" },
    { value: "DRIVER_LICENSE", label: "Driver's License" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-[var(--accent)] rounded-lg p-8 shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <h2 className="text-[var(--background)] text-2xl font-bold mb-4">
          {isUpdateMode ? "Update KYC Information" : "Submit KYC Information"}
        </h2>

        {error && (
          <p className="text-red-400 bg-red-500/10 border border-red-500/30 rounded-md px-4 py-2 mb-4 text-sm">
            {error}
          </p>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-3 border-b border-[var(--sidebar-linkcolor)]/30 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab("personal")}
            className={`px-6 py-3 text-sm font-semibold relative transition-colors ${
              activeTab === "personal"
                ? "text-[var(--mutant-color)]"
                : "text-[var(--text-light)] hover:text-[var(--background)]"
            }`}
          >
            Personal Info
            {activeTab === "personal" && (
              <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[var(--mutant-color)] rounded-md"></span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("bank")}
            className={`px-6 py-3 text-sm font-semibold relative transition-colors ${
              activeTab === "bank"
                ? "text-[var(--mutant-color)]"
                : "text-[var(--text-light)] hover:text-[var(--background)]"
            }`}
          >
            Bank Information
            {activeTab === "bank" && (
              <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[var(--mutant-color)] rounded-md"></span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("documents")}
            className={`px-6 py-3 text-sm font-semibold relative transition-colors ${
              activeTab === "documents"
                ? "text-[var(--mutant-color)]"
                : "text-[var(--text-light)] hover:text-[var(--background)]"
            }`}
          >
            Documents
            {activeTab === "documents" && (
              <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[var(--mutant-color)] rounded-md"></span>
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {/* Personal Information Tab */}
          {activeTab === "personal" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-[var(--text-light)] text-sm font-bold mb-2"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded bg-[var(--sidebar-linkcolor)]/20 border border-transparent focus:border-[var(--mutant-color)] focus:ring-[var(--mutant-color)] text-[var(--background)]"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-[var(--text-light)] text-sm font-bold mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded bg-[var(--sidebar-linkcolor)]/20 border border-transparent focus:border-[var(--mutant-color)] focus:ring-[var(--mutant-color)] text-[var(--background)]"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-[var(--text-light)] text-sm font-bold mb-2"
                  >
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded bg-[var(--sidebar-linkcolor)]/20 border border-transparent focus:border-[var(--mutant-color)] focus:ring-[var(--mutant-color)] text-[var(--background)]"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="role"
                    className="block text-[var(--text-light)] text-sm font-bold mb-2"
                  >
                    Role *
                  </label>
                  <input
                    type="text"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded bg-[var(--sidebar-linkcolor)]/20 border border-transparent focus:border-[var(--mutant-color)] focus:ring-[var(--mutant-color)] text-[var(--background)] opacity-60 cursor-not-allowed"
                    required
                    readOnly
                  />
                </div>
              </div>
            </div>
          )}

          {/* Bank Information Tab */}
          {activeTab === "bank" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="bankName"
                    className="block text-[var(--text-light)] text-sm font-bold mb-2"
                  >
                    Bank Name *
                  </label>
                  <input
                    type="text"
                    id="bankName"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded bg-[var(--sidebar-linkcolor)]/20 border border-transparent focus:border-[var(--mutant-color)] focus:ring-[var(--mutant-color)] text-[var(--background)]"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="accountHolderName"
                    className="block text-[var(--text-light)] text-sm font-bold mb-2"
                  >
                    Account Holder Name *
                  </label>
                  <input
                    type="text"
                    id="accountHolderName"
                    name="accountHolderName"
                    value={formData.accountHolderName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded bg-[var(--sidebar-linkcolor)]/20 border border-transparent focus:border-[var(--mutant-color)] focus:ring-[var(--mutant-color)] text-[var(--background)]"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="accountNumber"
                    className="block text-[var(--text-light)] text-sm font-bold mb-2"
                  >
                    Account Number *
                  </label>
                  <input
                    type="text"
                    id="accountNumber"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded bg-[var(--sidebar-linkcolor)]/20 border border-transparent focus:border-[var(--mutant-color)] focus:ring-[var(--mutant-color)] text-[var(--background)]"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="swiftCode"
                    className="block text-[var(--text-light)] text-sm font-bold mb-2"
                  >
                    SWIFT/BIC Code *
                  </label>
                  <input
                    type="text"
                    id="swiftCode"
                    name="swiftCode"
                    value={formData.swiftCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded bg-[var(--sidebar-linkcolor)]/20 border border-transparent focus:border-[var(--mutant-color)] focus:ring-[var(--mutant-color)] text-[var(--background)]"
                    required
                    placeholder="e.g., CHASUS33"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="bankCountry"
                    className="block text-[var(--text-light)] text-sm font-bold mb-2"
                  >
                    Bank Country *
                  </label>
                  <input
                    type="text"
                    id="bankCountry"
                    name="bankCountry"
                    value={formData.bankCountry}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded bg-[var(--sidebar-linkcolor)]/20 border border-transparent focus:border-[var(--mutant-color)] focus:ring-[var(--mutant-color)] text-[var(--background)]"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === "documents" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="documentType"
                    className="block text-[var(--text-light)] text-sm font-bold mb-2"
                  >
                    Document Type *
                  </label>
                  <CustomDropdown
                    value={formData.documentType}
                    onChange={(value) => setFormData((prev) => ({ ...prev, documentType: value }))}
                    options={documentTypeOptions}
                    placeholder="Select Document Type"
                  />
                </div>

                <div>
                  <label
                    htmlFor="signature"
                    className="block text-[var(--text-light)] text-sm font-bold mb-2"
                  >
                    Signature (Your Name) *
                  </label>
                  <input
                    type="text"
                    id="signature"
                    name="signature"
                    value={formData.signature}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded bg-[var(--sidebar-linkcolor)]/20 border border-transparent focus:border-[var(--mutant-color)] focus:ring-[var(--mutant-color)] text-[var(--background)]"
                    required
                    placeholder="Type your full name as signature"
                  />
                </div>
              </div>

              {/* File Uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="proofFront"
                    className="block text-[var(--text-light)] text-sm font-bold mb-2"
                  >
                    Document Front Image *
                  </label>
                  <div className="space-y-3">
                    <div className="relative">
                      <input
                        type="file"
                        id="proofFront"
                        name="proofFront"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full px-4 py-2 rounded bg-[var(--sidebar-linkcolor)]/20 border border-transparent focus:border-[var(--mutant-color)] focus:ring-[var(--mutant-color)] text-[var(--background)] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[var(--mutant-color)] file:text-white hover:file:opacity-90"
                        required={!isUpdateMode || !existingKYC?.proofFrontUrl}
                      />
                      {isUpdateMode && existingKYC?.proofFrontUrl && !formData.proofFront && (
                        <p className="text-[var(--text-light)] text-xs mt-2">
                          Current document is on file. Upload a new file to replace it.
                        </p>
                      )}
                    </div>
                    {previewFront && (
                      <div className="relative border border-[var(--sidebar-linkcolor)]/30 rounded-lg overflow-hidden">
                        <img
                          src={previewFront}
                          alt="Front document preview"
                          className="w-full h-auto max-h-[300px] object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewFront(null);
                            setFormData((prev) => ({ ...prev, proofFront: null }));
                            const input = document.getElementById("proofFront");
                            if (input) input.value = "";
                          }}
                          className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full p-1.5 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                    {formData.proofFront && !previewFront && (
                      <p className="text-[var(--text-light)] text-xs">
                        Selected: {formData.proofFront.name}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="proofBack"
                    className="block text-[var(--text-light)] text-sm font-bold mb-2"
                  >
                    Document Back Image *
                  </label>
                  <div className="space-y-3">
                    <div className="relative">
                      <input
                        type="file"
                        id="proofBack"
                        name="proofBack"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full px-4 py-2 rounded bg-[var(--sidebar-linkcolor)]/20 border border-transparent focus:border-[var(--mutant-color)] focus:ring-[var(--mutant-color)] text-[var(--background)] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[var(--mutant-color)] file:text-white hover:file:opacity-90"
                        required={!isUpdateMode || !existingKYC?.proofBackUrl}
                      />
                      {isUpdateMode && existingKYC?.proofBackUrl && !formData.proofBack && (
                        <p className="text-[var(--text-light)] text-xs mt-2">
                          Current document is on file. Upload a new file to replace it.
                        </p>
                      )}
                    </div>
                    {previewBack && (
                      <div className="relative rounded-lg overflow-hidden">
                        <img
                          src={previewBack}
                          alt="Back document preview"
                          className="w-full h-auto max-h-[300px] object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewBack(null);
                            setFormData((prev) => ({ ...prev, proofBack: null }));
                            const input = document.getElementById("proofBack");
                            if (input) input.value = "";
                          }}
                          className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full p-1.5 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                    {formData.proofBack && !previewBack && (
                      <p className="text-[var(--text-light)] text-xs">
                        Selected: {formData.proofBack.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Declaration */}
              <div className="mt-6 pt-4 border-t border-[var(--sidebar-linkcolor)]/30">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="declarationAccepted"
                    name="declarationAccepted"
                    checked={formData.declarationAccepted}
                    onChange={handleInputChange}
                    className="mt-1 w-5 h-5 rounded border-[var(--sidebar-linkcolor)] text-[var(--mutant-color)] focus:ring-[var(--mutant-color)]"
                    required
                  />
                  <label
                    htmlFor="declarationAccepted"
                    className="text-[var(--text-light)] text-sm"
                  >
                    I declare that the information provided is true and accurate. I understand that providing false information may result in account suspension or legal action. *
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center gap-4 mt-6 pt-4 border-t border-[var(--sidebar-linkcolor)]/30">
          <div className="flex gap-2">
            {activeTab === "bank" && (
              <button
                type="button"
                onClick={() => setActiveTab("personal")}
                className="px-6 py-2 rounded text-[var(--text)] bg-transparent hover:bg-[var(--sidebar-linkcolor)]/30 transition-colors"
              >
                Previous
              </button>
            )}
            {activeTab === "documents" && (
              <button
                type="button"
                onClick={() => setActiveTab("bank")}
                className="px-6 py-2 rounded text-[var(--text)] bg-transparent hover:bg-[var(--sidebar-linkcolor)]/30 transition-colors"
              >
                Previous
              </button>
            )}
          </div>
          <div className="flex gap-4">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-2 rounded text-[var(--text)] bg-transparent hover:bg-[var(--sidebar-linkcolor)]/30 transition-colors"
            >
              Cancel
            </button>
            {activeTab === "personal" && (
              <button
                type="button"
                onClick={() => setActiveTab("bank")}
                className="px-6 py-2 rounded bg-[var(--mutant-color)] text-white font-semibold hover:opacity-90 transition-opacity"
              >
                Next
              </button>
            )}
            {activeTab === "bank" && (
              <button
                type="button"
                onClick={() => setActiveTab("documents")}
                className="px-6 py-2 rounded bg-[var(--mutant-color)] text-white font-semibold hover:opacity-90 transition-opacity"
              >
                Next
              </button>
            )}
            {activeTab === "documents" && (
              <button
                onClick={handleSubmit}
                disabled={isLoading || !formData.declarationAccepted}
                className="px-6 py-2 rounded bg-[var(--mutant-color)] text-white font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (isUpdateMode ? "Updating..." : "Submitting...") : (isUpdateMode ? "Update KYC" : "Submit KYC")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
