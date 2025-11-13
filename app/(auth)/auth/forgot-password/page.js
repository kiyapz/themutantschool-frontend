"use client";

import { useContext, useEffect, useState } from "react";
import Registerherosection from "../register/_components/Registerherosection";
import RegisterInput from "../register/_components/RegisterIput";
import { FiArrowLeft } from "react-icons/fi";
import Image from "next/image";
import { ForgotPasswordContext } from "./_components/ForgotpasswordContex";
import OTPInput from "./_components/Otp";
import authApiUrl from "@/lib/baseUrl";
import Link from "next/link";
import PasswordInput from "../../-components/PasswordInput";
import { Globlaxcontex } from "@/context/Globlaxcontex";

export default function Forgotpassword() {
  const { setsuccessvalue } = useContext(Globlaxcontex);
  const { otpCode, setOtpCode } = useContext(ForgotPasswordContext);
  const [registerStep, setRegisterStep] = useState(1);
  const [disablebtn, setDisablebtn] = useState(true);
  const [email, setEmail] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errormessage, setErrormessage] = useState("");

  useEffect(() => {
    setsuccessvalue(false);

    if (registerStep === 1) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValidEmail = email ? emailRegex.test(email.trim()) : false;

      setsuccessvalue(isValidEmail);
      setDisablebtn(!isValidEmail);

      return;
    }

    if (registerStep === 2) {
      setDisablebtn(true);
      if (otpCode.trim().length === 6) {
        setDisablebtn(false);
      } else {
        setDisablebtn(true);
      }

      return;
    }
  }, [email, otpCode, registerStep, setsuccessvalue]);

  useEffect(() => {
    let interval;
    if (timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timeLeft]);

  useEffect(() => {
    console.log(
      "Email, Password, Confirm Password:",
      password,
      confirmPassword
    );

    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    const allFieldsFilled = trimmedPassword && trimmedConfirmPassword;
    const isPasswordLongEnough = trimmedPassword.length >= 8;
    const passwordsMatch = trimmedPassword === trimmedConfirmPassword;

    if (trimmedPassword && !isPasswordLongEnough) {
      setErrormessage(
        "Password must be at least 8 characters long and contain a capital letter and symbol."
      );
    } else {
      setErrormessage("");
    }

    const shouldEnableButton =
      allFieldsFilled && passwordsMatch && isPasswordLongEnough;
    setDisablebtn(!shouldEnableButton);
  }, [password, confirmPassword]);

  const handleResend = async () => {
    try {
      setDisablebtn(true);
      const res = await authApiUrl.post("reset-password/request", {
        email: email,
      });
      console.log("Resend response:", res.data);

      if (res.status !== 200) {
        setErrormessage(res.data.message || "Failed to resend OTP");
        setTimeout(() => setErrormessage(""), 1000);
        console.error(
          "Failed to resend OTP:",
          res.data.message || "Unknown error"
        );
        return;
      }

      setTimeLeft(60);
      setCanResend(false);
      if (registerStep === 1) {
        setRegisterStep(2);
      }
      setOtpCode("");
    } catch (error) {
      setErrormessage("Failed to resend OTP");
      setTimeout(() => setErrormessage(""), 1000);
      console.error(
        "Failed to resend OTP:",
        error.response?.data?.message || error.message
      );
    }
  };

  const handlesendotp = async () => {
    try {
      const res = await authApiUrl.post("reset-password", {
        email,
        newPassword: password,
        otp: otpCode,
      });

      console.log("Reset password response:", res.data);

      setTimeLeft(60);
      setCanResend(false);
      setRegisterStep((prev) => prev + 1);
      setOtpCode("");
    } catch (error) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message || "Something went wrong";

      if (status === 404) {
        setErrormessage(message); 
      } else {
        setErrormessage(message);
      }

      console.error("Error from reset password:", message);
      setTimeout(() => setErrormessage(""), 2000);
    }
  };

  const renderStep = () => {
    switch (registerStep) {
      case 1:
        return (
          <div className="flex flex-col gap-10">
            <Registerherosection
              gap="gap-2"
              heading="Lost Your Signal?"
              text="Let’s reconnect you to the Lab."
            />
            <div className="flex flex-col gap-5">
              <RegisterInput
                handledelete={() => setEmail("")}
                value={email}
                textCenter="text-center"
                onchange={(e) => setEmail(e.target.value)}
                placeholder="Enter Your Email Address"
              />

              <button
                onClick={handleResend}
                disabled={disablebtn}
                className={`w-full  h-[57px] rounded-[10px] text-[18px] font-[700] leading-[57px] ${
                  registerStep == 2 && "disabled cursor-not-allowed"
                }     ${
                  disablebtn
                    ? "bg-[#404040] cursor-not-allowed disabled"
                    : "btn"
                }  `}
              >
                continue
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="max-w-[330px] sm:max-w-[561px]">
            <Registerherosection
              gap="gap-2"
              heading="Verify Your Signal"
              text="We’ve sent a secret code to your email. Prove your authenticity."
            />
            <div className="flex flex-col gap-10">
              <OTPInput />
              <button
                disabled={disablebtn}
                onClick={() => setRegisterStep((prev) => prev + 1)}
                className={`w-full  h-[57px] rounded-[10px] text-[18px] font-[700] leading-[57px] ${
                  disablebtn
                    ? "bg-[#404040] cursor-not-allowed disabled"
                    : "btn"
                }`}
              >
                continue
              </button>
              {errormessage && (
                <div className="text-red-500 text-[10px] text-center">
                  {errormessage}
                </div>
              )}
              {/* <div className="text-center flex items-center justify-center gap-1 text-[var(--text)] font-[700] text-[14px] leading-[20px]"> */}

              <div className="text-center text-[var(--text)] flex items-center justify-center gap-2 font-[700] text-[14px] leading-[20px]">
                {" "}
                Didn’t receive email?
                <div className="text-sm">
                  {" "}
                  {!canResend ? (
                    <span className="text-[var(--secondary)]">
                      Resend in 00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                    </span>
                  ) : (
                    <button
                      onClick={handleResend}
                      className="text-[var(--secondary)] underline"
                    >
                      {" "}
                      Resend OTP{" "}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          // </div>/
        );

      case 3:
        return (
          <div className="max-w-[330px] sm:max-w-[561px]">
            <Registerherosection
              gap="gap-2"
              heading="Reset Your Portal Access"
              text="Set your new credentials.."
            />
            <div className="flex flex-col gap-5">
              <PasswordInput
                onchange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="New password"
              />
              <PasswordInput
                onchange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                type="password"
                placeholder="Comfirm New password"
              />
              {errormessage && (
                <p className="text-red-500 text-[10px] ">{errormessage}</p>
              )}
              <button
                onClick={handlesendotp}
                className={`w-full  h-[57px] rounded-[10px] text-[18px] font-[700] leading-[57px] ${
                  disablebtn
                    ? "bg-[#404040] cursor-not-allowed disabled"
                    : "btn"
                }`}
              >
                continue
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="flexcenter w-full flex-col gap-5 max-w-[330px]   sm:max-w-[561px]">
            <div className="h-[130px] border w-[130px] rounded-full bg-green-300 flexcenter">
              <Image
                src="/images/markgood.png"
                alt="markgood"
                width={55.71}
                height={50.14}
              />
            </div>
            <Registerherosection
              gap="gap-2"
              heading="YOU HAVE successfully"
              subheading="reset your PORTAL ACCESS"
              text="You’re back online. Your mission continues."
            />
            <Link href="/auth/login">
              <button className="w-full btn h-[57px] max-w-[330px] sm:max-w-[561px] rounded-[10px] text-[18px] font-[700] leading-[57px]">
                Go Back to Login
              </button>
            </Link>
          </div>
        );
    }
  };

  return (
    <div className="flexcenter relative w-full h-[90vh] px">
      {/* Back Arrow */}
      <div
        onClick={() => setRegisterStep((prev) => prev - 1)}
        className={`absolute top-[5%] left-[5%] xl:left-[10%] h-[44px] w-[44px] flex items-center justify-center cursor-pointer
          ${
            registerStep === 1 || registerStep === 4
              ? "opacity-40 cursor-not-allowed hidden"
              : "opacity-100 hover:opacity-70"
          }`}
      >
        <FiArrowLeft className="text-xl" />
      </div>

      {/* Content based on step */}
      {renderStep()}
    </div>
  );
}
