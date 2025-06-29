'use client'

// import { Globlaxcontex } from "@/context/Globlaxcontex";
import { useContext, useRef, useState, useEffect } from "react";
import { AcademyGloblaxcontex } from "./academycontext/AcademyContext";

export default function OTPInput({ length = 6, onComplete }) {
  const inputs = useRef([]);
  const [otp, setOtp] = useState(Array(length).fill(""));
  const {otpCode, setOtpCode} = useContext(AcademyGloblaxcontex)

  const { setIsCompleteOtp } = useContext(AcademyGloblaxcontex);

  const handleChange = (e, i) => {
    const value = e.target.value.replace(/[^0-9a-zA-Z]/g, "").toUpperCase();

    if (value.length === 1 && i < length - 1) {
      inputs.current[i + 1]?.focus();
    }

    const newOtp = [...otp];
    newOtp[i] = value;
    setOtp(newOtp);

    const code = newOtp.join("");
    setOtpCode(code); 

    if (code.length === length && !newOtp.includes("")) {
      onComplete?.(code); 
    }
  };

  const handleKeyDown = (e, i) => {
    if (e.key === "Backspace" && !e.target.value && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  
  useEffect(() => {
    const complete = otp.every(val => val.length === 1);
    setIsCompleteOtp(complete);
  }, [otp, setIsCompleteOtp]);

  
  useEffect(() => {
    console.log("Full OTP:", otpCode);
  }, [otpCode]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2 py justify-center">
        {[...Array(length)].map((_, i) => (
          <input
            key={i}
            ref={el => (inputs.current[i] = el)}
            maxLength={1}
            value={otp[i]}
            onChange={e => handleChange(e, i)}
            onKeyDown={e => handleKeyDown(e, i)}
            className="w-12 h-12 text-center  bg-[var(--otp-color)] rounded-[5px] focus:outline-none"
          />
        ))}
      </div>
    </div>
  );
}
