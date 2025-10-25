"use client";
import { useEffect, useState } from "react";
import Changebtn from "./component/btn/Changebtn";
import Image from "next/image";
import Activebtn from "./component/btn/Activebtn";
import Link from "next/link";

export default function Page() {
  const [changeStages, setChangeStages] = useState(1);

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
            className="w-screen h-fit xl:h-screen flex-col gap-8  bg-[#0A0A0A] flexcenter   transition-opacity duration-700 ease-in-out opacity-100 "
          >
            <div className="w-[90%] h-fit  sm:h-[80%] max-w-[1200px]    flexcenter flex-col xl:flex-row  gap-12 ">
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
                  <Activebtn text={"Google Ads"} />
                  <Activebtn text={"Facebook"} />
                  <Activebtn text={"LinkedIn"} />
                  <Activebtn text={"Family/Friend"} />
                  <Activebtn text={"Our Blog"} />
                  <Activebtn text={"X"} />
                  <Activebtn text={"Reddit"} />
                  <Activebtn text={"Instagram"} />
                  <div className="col-span-2 sm:col-span-1 ">
                    <Activebtn text={"Others"} />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ margin: "30px 20px" }} className="self-end">
              <Link href={"/student/dashboard"}>
                <Changebtn text={"Proceed to the lab"} />
              </Link>
            </div>
          </div>
        );
    }
  };
  return <div>{renseSteps()}</div>;
}
