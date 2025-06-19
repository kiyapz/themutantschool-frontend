'use client';

import { createContext, useState } from "react";

// Create the context
export const ForgotPasswordContext = createContext();

// Create the provider
export const ForgotPasswordProvider = ({ children }) => {
  const [otpCode, setOtpCode] = useState("");
  const [isCompleteOtp, setIsCompleteOtp] = useState(false);

  return (
    <ForgotPasswordContext.Provider
      value={{
        otpCode,
        setOtpCode,
        isCompleteOtp,
        setIsCompleteOtp,
      }}
    >
      {children}
    </ForgotPasswordContext.Provider>
  );
};
