'use client';

import { useState } from "react";
import OTPInput from "../Register/_components/Otpverification";
import Registerherosection from "../Register/_components/Registerherosection";
import RegisterInput from "../Register/_components/RegisterIput";
import Registerbtn from "../Register/_components/Registerbtn";
import { FiArrowLeft } from "react-icons/fi";
import Image from "next/image"; // Make sure you import Image if you use it

export default function Forgotpassword() {
  const [registerStep, setRegisterStep] = useState(1);

  const handleContinue = () => {
    if (registerStep < 4) {
      setRegisterStep((prev) => prev + 1);
    }
  };

  const handleClick = () => {
    if (registerStep > 1) {
      setRegisterStep((prev) => prev - 1);
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
              <RegisterInput textCenter="text-center" placeholder="Enter Your Email Address" />
              <button
              onClick={handleContinue}
              className="w-full btn h-[57px] rounded-[10px] text-[18px] font-[700] leading-[57px]"
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
              {/* <OTPInput /> */}
              <button
              onClick={handleContinue}
              className="w-full btn h-[57px] rounded-[10px] text-[18px] font-[700] leading-[57px]"
            >
              continue
            </button>
              <p className="text-center text-[var(--text)] font-[700] text-[14px] leading-[20px]">
                Didn’t receive email?{" "}
                <span className="text-[var(--secondary)]">Resend in 00:60</span>
              </p>
            </div>
          </div>
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
              <RegisterInput placeholder="New Password" />
              <RegisterInput placeholder="Confirm New Password" />
              <button
              onClick={handleContinue}
              className="w-full btn h-[57px] rounded-[10px] text-[18px] font-[700] leading-[57px]"
            >
              continue
            </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="flexcenter flex-col gap-5 max-w-[330px] sm:max-w-[561px]">
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
            <button
              className="w-full btn h-[57px] rounded-[10px] text-[18px] font-[700] leading-[57px]"
            >
              Go Back to Login
            </button>
          </div>
        );
    }
  };

  return (
    <div className="flexcenter relative w-full h-[90vh] px">
      {/* Back Arrow */}
      <div
        onClick={handleClick}
        className={`absolute top-[5%] left-[5%] xl:left-[10%] h-[44px] w-[44px] flex items-center justify-center cursor-pointer
          ${registerStep === 1 || registerStep === 4   ? "opacity-40 cursor-not-allowed hidden" : "opacity-100 hover:opacity-70"}`}
      >
        <FiArrowLeft className="text-xl" />
      </div>

      {/* Content based on step */}
      {renderStep()}
    </div>
  );
}
