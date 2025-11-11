"use client";
import { useState } from "react";
import Changebtn from "./component/btn/Changebtn";
import Image from "next/image";
import Activebtn from "./component/btn/Activebtn";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function Page() {
  const [changeStages, setChangeStages] = useState(1);
  const [selectedOption, setSelectedOption] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const router = useRouter();

  const hearAboutOptions = [
    "Google Ads",
    "Facebook",
    "LinkedIn",
    "Family/Friend",
    "Our Blog",
    "X",
    "Reddit",
    "Instagram",
    "Others",
  ];

  const handleSelect = (option) => {
    setSelectedOption(option);
    setSubmitError("");
  };

  const handleProceed = async () => {
    if (!selectedOption || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setSubmitError("");
      await api.post("/hear-about-us", {
        name: selectedOption,
      });
      router.push("/student/dashboard");
    } catch (error) {
      console.error("Failed to submit hear about us choice:", error);
      setSubmitError("Unable to save your choice. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Removed automatic timer as we now have a manual Next button

  const renseSteps = () => {
    switch (changeStages) {
      case 1:
        return (
          <div className="w-screen h-screen flexcenter flex-col bg-[#0A0A0A] ">
            <p className="Xirod text-[24px] leading-[40px] ">Welcome To</p>
            <p className="text-[#894999] font-[400] text-[31px] leading-[40px] ">
              THE MUTANT SCHOOL
            </p>
            <div className="mt-10">
              <Changebtn onclick={() => setChangeStages(2)} text={"Next"} />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="w-screen h-screen  bg-[#0A0A0A] flex justify-center items-end   transition-opacity duration-700 ease-in-out opacity-100 ">
            <div
              style={{ margin: "30px" }}
              className=" h-[80%]  sm:h-[60%] xl:h-[70%] w-full flex flex-col items-center justify-between   "
            >
              <div className="sm:flex items-center gap-2">
                <div>
                  <Image
                    src={"/images/students-images/Group 819.png"}
                    width={224.59}
                    height={274.17}
                    alt="mutant-robot"
                  />
                </div>
                <div>
                  <p className="Xirod text-[24px] leading-[40px] ">
                    Hi, I’m Virex...
                  </p>
                  <p className="text-[#894999] font-[400] text-[31px] leading-[40px] ">
                    Your Mutation Guide
                  </p>
                </div>
              </div>

              <div className="self-end">
                <Changebtn
                  onclick={(prev) => setChangeStages(prev + 1)}
                  text={"Continue "}
                />
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div
            style={{ padding: "20px" }}
            className="w-full min-h-screen flex flex-col items-center gap-8 bg-[#0A0A0A] transition-opacity duration-700 ease-in-out opacity-100 overflow-y-auto py-10"
          >
            <div className="w-[90%] h-fit sm:h-[80%] max-w-[1200px] flex flex-col items-center xl:flex-row xl:items-start gap-12 ">
              <div className="sm:self-start">
                <div>
                  <Image
                    src={"/images/students-images/Group 819.png"}
                    width={224.59}
                    height={274.17}
                    alt="mutant-robot"
                  />
                </div>
              </div>
              <div className="flex-1   ">
                <p
                  style={{ marginBottom: "90px" }}
                  className="font-[400] self-start Xirod text-[23px] leading-[40px] text-center "
                >
                  How did you hear about us?
                </p>
                <div
                  style={{ padding: "0 30px " }}
                  className="  grid grid-cols-2 sm:grid-cols-3 gap-5 flex-1 w-screen xl:w-full "
                >
                  {hearAboutOptions.map((option, index) => {
                    const isLast = index === hearAboutOptions.length - 1;
                    return (
                      <div
                        key={option}
                        className={isLast ? "col-span-2 sm:col-span-1" : ""}
                      >
                        <Activebtn
                          text={option}
                          onClick={() => handleSelect(option)}
                          isActive={selectedOption === option}
                        />
                      </div>
                    );
                  })}
                </div>
                {submitError ? (
                  <p className="text-red-500 text-center mt-6 text-sm sm:text-base">
                    {submitError}
                  </p>
                ) : null}
              </div>
            </div>

            <div style={{ margin: "30px 20px" }} className="self-end">
              <Changebtn
                text={isSubmitting ? "Submitting..." : "Proceed to the lab"}
                onclick={handleProceed}
                disabled={!selectedOption || isSubmitting}
              />
            </div>
          </div>
        );
    }
  };
  return <div className="min-h-screen w-full overflow-x-hidden">{renseSteps()}</div>;
}
