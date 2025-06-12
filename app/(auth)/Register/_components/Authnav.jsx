'use client'

import { Globlaxcontex } from "@/context/Globlaxcontex";
import { useContext } from "react";
import { FiArrowLeft } from "react-icons/fi";

export default function Authnav() {
  const { registerStep, setRegisterStep } = useContext(Globlaxcontex);

  const handleClick = () => {
    if (registerStep > 1) {
      setRegisterStep((prev) => prev - 1);
    }
  };

  return (
    <div className="relative  w-full sm:block hidden flexcenter">
      {/* Back Arrow - always visible, but disabled at step 1 */}
      <div
        onClick={handleClick}
        className={`absolute h-[30px] top-[3%]  w-[44px] sm:left-[5%] xl:left-[10%] cursor-pointer flex items-center justify-center
          ${registerStep === 1 ? "opacity-40 cursor-not-allowed" : "opacity-100 hover:opacity-70"}`}
      >
        <FiArrowLeft className="text-xl" />
      </div>

      {/* Progress Bar - hidden when step is 1 or 5 or greater */}
      {!(registerStep === 1 || registerStep >= 5) && (
        <div className="w-full   flex gap-5 items-center max-w-[350px] sm:max-w-[561px]">
          <div
            className={`h-[30px] w-[30px] aspect-square flex items-center justify-center rounded-full ibm-plex-mono-thin font-[700] text-[13px] leading-[57px] text-center ${
              registerStep >= 2
                ? "bg-[var(--secondary)] text-[var(--background)]"
                : "bg-[var(--text)] text-[var(--blackcolor)]"
            }`}
          >
            1
          </div>

          <div
            className={`h-[2px] w-full ${
              registerStep >= 3 ? "bg-[var(--secondary)]" : "bg-[var(--text)]"
            }`}
          ></div>

          <div
            className={`h-[30px] w-[30px] aspect-square flex items-center justify-center rounded-full ibm-plex-mono-thin font-[700] text-[13px] leading-[57px] text-center ${
              registerStep >= 3
                ? "bg-[var(--secondary)] text-[var(--background)]"
                : "bg-[var(--text)] text-[var(--blackcolor)]"
            }`}
          >
            2
          </div>

          <div
            className={`h-[2px] w-full ${
              registerStep == 4 ? "bg-[var(--secondary)]" : "bg-[var(--text)]"
            }`}
          ></div>

          <div
            className={`h-[30px] w-[30px] aspect-square flex items-center justify-center rounded-full ibm-plex-mono-thin font-[700] text-[13px] leading-[57px] text-center ${
              registerStep === 4
                ? "bg-[var(--secondary)] text-[var(--background)]"
                : "bg-[var(--text)] text-[var(--blackcolor)]"
            }`}
          >
            3
          </div>
        </div>
      )}
    </div>
  );
}