'use client'
import { useContext } from "react";
import { Editprofilebtn } from "./Editprofilebtn";
import { InstructorContext } from "../../../_components/context/InstructorContex";

export default function  ChangePasswordValue() {
    const {setChangePassword} = useContext(InstructorContext)
    return (
        <div>
            
            <div style={{padding:'20px'}} className="h-fit flex flex-col gap-3 bg-[#101010] w-full max-w-[900px] ">
                <div>
                <p className="text-[var(--background)] text-[25px] font-[700]  ">Change Password</p>
                <p className="text-[#999999] text-[16px] font-[400] leading-[40px] ">Update your secret credentials and secure your lab here</p>
                </div>
         




        <div>
                      <Editprofilebtn label="Current Password"  />
                      <Editprofilebtn label="New Password" />
                      <Editprofilebtn label="Confirm Password" />
              
        </div>






          <div className="flex items-center gap-3 mt-6">
        <button 
          style={{padding:'10px'}}
          onClick={() =>setChangePassword(false)} 
          className="bg-[var(--purpel-btncolor)] px-6 py-2 cursor-pointer flex items-center justify-center gap-1 rounded-[10px] text-sm font-bold text-white hover:opacity-90 transition-opacity"
        >
          Update Password
        </button>
        <button 
          style={{padding:'10px'}}
          onClick={() =>setChangePassword(false)} 
          className="border border-[#4D4D4D] px-6 py-2 cursor-pointer flex items-center justify-center gap-1 rounded-[10px] text-sm font-bold text-[#D2D2D2] hover:bg-[#1A1A1A] transition-colors"
        >
          Cancel
        </button>
      </div>


        </div>
        </div>
    )
}