"use client";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { StudentContext } from "../../component/Context/StudentContext";
import CertificateCard from "./component/CertificateCard";

export default function Page(params) {
  const { showLevelCkallenge, setShowLevelCkallenge } =
    useContext(StudentContext);
  const [isAnimated, setIsAnimated] = useState(false);
  const [showElements, setShowElements] = useState({
    topIcons: false,
    character: false,
    newbieText: false,
    progressBar: false,
    button: false,
    bottomText: false,
  });
  const [certificates, setCertificates] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [avatarStage, setAvatarStage] = useState("Newbie");
  const [xpProgress, setXpProgress] = useState({
    currentXpInLevel: 0,
    xpToNextLevel: 100,
    percent: 0,
  });

  useEffect(() => {
    // When the page/component mounts
    setShowLevelCkallenge(false);

    // When the page/component unmounts
    return () => {
      setShowLevelCkallenge(true);
    };
  }, [setShowLevelCkallenge]);

  useEffect(() => {
    // Staggered animation sequence
    const timers = [
      setTimeout(
        () => setShowElements((prev) => ({ ...prev, topIcons: true })),
        200
      ),
      setTimeout(
        () => setShowElements((prev) => ({ ...prev, character: true })),
        500
      ),
      setTimeout(
        () => setShowElements((prev) => ({ ...prev, newbieText: true })),
        800
      ),
      setTimeout(
        () => setShowElements((prev) => ({ ...prev, progressBar: true })),
        1100
      ),
      setTimeout(() => setIsAnimated(true), 1200), // Progress bar fill
      setTimeout(
        () => setShowElements((prev) => ({ ...prev, button: true })),
        1400
      ),
      setTimeout(
        () => setShowElements((prev) => ({ ...prev, bottomText: true })),
        1700
      ),
    ];

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("login-accessToken");
    const fetchCertificates = async () => {
      try {
        const response = await fetch(
          "https://themutantschool-backend.onrender.com/api/certificate/my-certificates",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Certificates:", data);
        setCertificates(data.certificates || []);
        setStudentName(data.studentName || "");
      } catch (error) {
        console.error("Error fetching certificates:", error);
      }
    };

    fetchCertificates();
  }, []);

  useEffect(() => {
    const fetchStudentData = async () => {
      const token = localStorage.getItem("login-accessToken");
      if (!token) return;

      try {
        const response = await fetch(
          "https://themutantschool-backend.onrender.com/api/student/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        console.log("Achievements page - Dashboard data:", data);
        if (data.success) {
          setXpProgress(data.data.progressToNextLevel);
          setAvatarStage(data.data.avatarStage || "Newbie");
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };
    fetchStudentData();
  }, []);

  return (
    <div className="flex flex-col gap-6 w-full">
      <div
        style={{ padding: "16px" }}
        className="w-full bg-[#0B0B0B] relative xl:flex gap-10 items-center min-h-[250px] sm:h-[400px] xl:h-[438.49px] rounded-[20px]"
      >
        <div className="flex justify-center sm:justify-start mb-4 sm:mb-0">
          <div className="border-[4px] sm:border-[8px] border-[#E4BE00] flexcenter rounded-full w-[140px] h-[140px] sm:w-[280px] sm:h-[280px] xl:w-[344px] xl:h-[344px]">
            <div
              className={`transition-all duration-1000 ease-out ${
                showElements.character
                  ? "opacity-100 translate-y-0 scale-100 rotate-0"
                  : "opacity-0 translate-y-[30px] scale-75 rotate-[-5deg]"
              }`}
            >
              <Image
                src={"/images/students-images/Layer 2.png"}
                width={259.2}
                height={207.86}
                alt="mutant-robot"
                className="w-[90px] h-auto sm:w-[180px] xl:w-[259px]"
              />
            </div>
          </div>
        </div>

        {/* second layer */}
        <div className="flex flex-col w-full justify-between col-span-2 mt-4 sm:mt-0">
          <p className="absolute top-3 right-3 text-[#BF8BDB] font-[800] text-[18px] sm:text-[27px] leading-[24px] sm:leading-[40px]">
            XP Progress
          </p>
          <div className="flex flex-col gap-6 sm:gap-10 mt-8 sm:mt-0">
            <p
              className={`Xirod text-[#FDDD3F] font-[500] text-[16px] sm:text-[32px] xl:text-[45px] leading-[20px] sm:leading-[40px] text-center sm:text-left transition-all duration-800 ease-out ${
                showElements.newbieText
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-[10px] scale-99"
              }`}
            >
              <span
                className={`inline-block transition-all duration-300 ${
                  showElements.newbieText ? "animate-pulse" : ""
                }`}
              >
                {avatarStage}
              </span>
            </p>

            <div className="flex justify-center sm:justify-start w-full">
              {/* Progress section with smooth reveal */}
              <div
                className={`w-full max-w-[363px] transition-all duration-800 ease-out ${
                  showElements.progressBar
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-[20px]"
                }`}
              >
                <div className="w-full h-[15px] bg-[#1E1E1E] rounded-[10px] z-20 relative mb-4 overflow-hidden">
                  <div
                    style={{ width: `${xpProgress.percent}%` }}
                    className={`h-[15px] rounded-full relative z-30 bg-gradient-to-r from-[#1D5DAC] to-[#950F9C] transition-all duration-1500 ease-out shadow-lg`}
                  ></div>
                </div>
                <p className="font-[400] text-[12px] sm:text-[14px] text-[#957AA3] leading-[20px] sm:leading-[40px] text-center sm:text-left">
                  {xpProgress.xpToNextLevel} XP to next level
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex items-center justify-between">
        <p className="font-[600] text-[24px] sm:text-[35px] leading-[28px] sm:leading-[20px]">
          Certificates
        </p>
        <p className="font-[500] text-[16px] sm:text-[25px] text-[var(--mutant-color)] cursor-pointer leading-[20px] hover:text-[var(--primary)] transition-colors">
          View All
        </p>
      </div>

      <div className="w-full">
        <div className="flex flex-col gap-3 w-full">
          {certificates.length === 0 ? (
            <p>No certificates available.</p>
          ) : (
            certificates.map((cert) => (
              <CertificateCard
                key={cert.id}
                title={cert.missionTitle || cert.title}
                date={new Date(cert.issuedAt).toLocaleDateString()}
                studentName={cert.studentName || cert.student || studentName}
                instructor={cert.instructorName || cert.instructor}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
