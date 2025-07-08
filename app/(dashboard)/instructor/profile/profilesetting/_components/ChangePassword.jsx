'use client'

import { useContext, useState, useEffect } from "react";
import { Editprofilebtn } from "./Editprofilebtn";
import { InstructorContext } from "../../../_components/context/InstructorContex";

export default function ChangePasswordValue() {
  const { setChangePassword } = useContext(InstructorContext);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isButtonEnabled, setIsButtonEnabled] = useState(false);


  const changePassword = async (currentPassword, newPassword) => {
    try {
      const accessToken = localStorage.getItem("login-accessToken");
  
      const response = await axios.put(
        "/api/user/change-password",
        {
          currentPassword,
          newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          }
        }
      );
  
      console.log("Password updated successfully", response.data);
      return response.data;
    } catch (error) {
      console.error("Password change failed:", error.response?.data || error.message);
      throw error;
    }
  };

  useEffect(() => {
    if (
      currentPassword.trim() &&
      newPassword.trim() &&
      confirmPassword.trim() &&
      newPassword === confirmPassword
    ) {
      setIsButtonEnabled(true);
    } else {
      setIsButtonEnabled(false);
    }
  }, [currentPassword, newPassword, confirmPassword]);

  return (
    <div>
      <div style={{ padding: '20px' }} className="h-fit flex flex-col gap-3 bg-[#101010] w-full max-w-[900px] ">
        <div>
          <p className="text-[var(--background)] text-[25px] font-[700]">Change Password</p>
          <p className="text-[#999999] text-[16px] font-[400] leading-[40px]">
            Update your secret credentials and secure your lab here
          </p>
        </div>

        <div>
          <Editprofilebtn
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            label="Current Password"
          />
          <Editprofilebtn
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            label="New Password"
          />
          <Editprofilebtn
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            label="Confirm Password"
          />
        </div>

        <div className="flex items-center gap-3 mt-6">
          <button
            disabled={!isButtonEnabled}
            style={{ padding: '10px', opacity: isButtonEnabled ? 1 : 0.5 }}
            onClick={() => {
              changePassword;
              setChangePassword(false);
            }}
            className="bg-[var(--purpel-btncolor)] px-6 py-2 cursor-pointer flex items-center justify-center gap-1 rounded-[10px] text-sm font-bold text-white hover:opacity-90 transition-opacity"
          >
            Update Password
          </button>

          <button
            style={{ padding: '10px' }}
            onClick={() => setChangePassword(false)}
            className="border border-[#4D4D4D] px-6 py-2 cursor-pointer flex items-center justify-center gap-1 rounded-[10px] text-sm font-bold text-[#D2D2D2] hover:bg-[#1A1A1A] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
