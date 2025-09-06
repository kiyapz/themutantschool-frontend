'use client'
import { Edit } from "lucide-react";
import React, { useContext, useState } from "react";
import UpdateProfileModal from "./UpdateProfileModal";

function MutationProfile() {
    const [model,setModel] = useState(false)

    const handleUpdate = (updatedData) => {
      console.log("Updated profile data:", updatedData);

      // Example use cases:
      // - Send to API
      // - Update state
      // - Show success message
      // - Close modal, etc.
    };
 
  const InfoBox = ({ title, content, children }) => {
    return (
      <div className="border border-[#939393] rounded-[20px] p-4 md:p-6 bg-[#0C0C0C] text-white w-full">
        {title && (
          <h3 className="text-[26px] font-[600] leading-[40px] mb-3">
            {title}
          </h3>
        )}
        {content && (
          <p className="text-[16px] text-[#989898] font-[400] leading-[23px]">
            {content}
          </p>
        )}
        {children}
      </div>
    );
  };

  // 🧾 Personal Info as array (cleaner + reusable)
  const personalInfo = [
    { label: "Email Address", value: "etienodouglas@gmail.com" },
    { label: "Phone Number", value: "+234 (0) 9129495797" },
    { label: "Gender", value: "Male" },
    { label: "Nationality", value: "Nigerian" },
    { label: "Date of Birth", value: "12 - FEB - 2000" },
    { label: "Preferred Language", value: "English (UK)" },
  ];

  return (
    <div className="space-y-6 max-w-3xl mx-auto p-6">
      {/* 👤 Profile Header */}
      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className=" w-[200px]  h-[200px]  lg:w-[189px] lg:h-[140px] border-[4px] border-[#840B94] rounded-full bg-[#1a1a1a] flex items-center justify-center">
          {/* Optional profile image goes here */}
          {/* <img src="/profile.jpg" alt="Profile" className="w-full h-full rounded-full" /> */}
        </div>

        <div className="w-full flex flex-col lg:flex-row items-center justify-between">
          <div>
            <h2 className="text-[37px] leading-[20px] font-[500] text-white">
              Etieno Ekanem
            </h2>
            <p className="text-[#FDDD3F] font-[500] text-[22px] leading-[40px]">
              Newbie
            </p>
          </div>
          <button
            onClick={() => setModel(true)}
            className="mt-2 px-4 py-2 text-[14px] flex items-center gap-1 font-[700] bg-[#161616] text-[#A9A9A9] rounded-[10px] cursor-pointer"
          >
            <span>
              <Edit size={10} />
            </span>
            Edit Profile
          </button>
        </div>
      </div>

      {/* 📄 Bio Box */}
      <InfoBox
        title="Bio"
        content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      />

      {/* 🧍 Personal Info Box */}
      <InfoBox title="Personal Information">
        <div className="grid grid-cols-2 gap-y-4">
          {personalInfo.map(({ label, value }) => (
            <React.Fragment key={label}>
              <p>
                <strong className="lg:text-[19px] text-[#ADA5A5] font-[700] lg:leading-[40px]">
                  {label}:
                </strong>
              </p>
              <p className="lg:text-[18px] text-[#818181] font-[400] lg:leading-[20px] max-w-full">
                {value}
              </p>
            </React.Fragment>
          ))}
        </div>
      </InfoBox>

      {model && (
        <div className="absolute top-0 left-0 h-screen w-screen z-50 bg-[rgba(0,0,0,0.6)] ">
          <UpdateProfileModal
            onClose={() => setModel(false)}
            onUpdate={handleUpdate}
          />
        </div>
      )}
    </div>
  );
}

export default MutationProfile;
