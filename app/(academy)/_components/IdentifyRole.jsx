"use client";

import { use, useContext, useEffect, useState } from "react";
import Registerherosection from "./Registerherosectio";
import Registerbtn from "./Registerbtn";
import RegisterInput from "./Registerinput";
// import { Globlaxcontex } from "@/context/Globlaxcontex";
import OTPInput from "./Otpverification";
import PasswordInput from "@/app/(auth)/-components/PasswordInput";
import Image from "next/image";
import Link from "next/link";

import SuccessMessage from "@/components/SuccessMessage";
import { useRouter } from "next/navigation";
import { AcademyGloblaxcontex } from "./academycontext/AcademyContext";
import InstuteTypeDropdown from "./Dropdown";
import authApiUrl from "./libs/authApiUrl";

export default function IdentifyRole() {
  const router = useRouter();
  const [buttonDisabledtext, setButtonDisabled] = useState("continue");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const {
    instituteType,
    instituteName,
    setSelectedinstituteName,
    otpCode,
    setsuccessvalue,
    Successmessage,
    setSuccessmessage,
    verifyOtpWithBackend,
    stack,
    setStack,
    password,
    setPassword,
    confirmpassword,
    setconfirmpassword,
    isCompleteOtp,
    registerStep,
    setRegisterStep,
    selectedRole,
    setSelectedRole,
    errormessage,
    setErrormessage,
    setCodeName,
    username,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    setdisablebtn,
    handleContinue,
  } = useContext(AcademyGloblaxcontex);

  console.log(instituteName, instituteType, "checking value");

  useEffect(() => {
    setsuccessvalue(false);
    // setSuccessmessage(
    //   <span className="flex items-center gap-2">
    //     <span className="w-4 h-4 border-2 border-t-transparent border-green-500 rounded-full animate-spin inline-block" />
    //     Checking...
    //   </span>
    // );

    setdisablebtn(true);
    setErrormessage("");

    if (username.length < 2) {
      setErrormessage("Username must be at least 2 characters long.");
      setSuccessmessage("");
      setdisablebtn(true);
      return;
    }

    setsuccessvalue(true);
    setTimeout(() => {
      setSuccessmessage("");
    }, 1000);
    setdisablebtn(!username);

    // const verifyAccount = async () => {
    //   try {
    //     const res = await authApiUrl.post("check-username", { username });

    //     const responseData = res.data;
    //     console.log("Response from server:", res);

    //     if (res.status === 201 || res.status === 200) {
    //       setErrormessage('');
    //       setSuccessmessage(responseData.message || "Username is available.");
    //       setsuccessvalue(true)
    //       setTimeout(() => {
    //         setSuccessmessage('');
    //       }, 1000);
    //       setdisablebtn(!username);
    //     } else {
    //       setsuccessvalue(false)
    //       setSuccessmessage('');
    //       setdisablebtn(true);
    //       setErrormessage(responseData.message || "Something went wrong.");
    //       setTimeout(() => {
    //         setErrormessage('');
    //       }, 1000);
    //     }

    //   } catch (err) {
    //     setsuccessvalue(false)
    //     setdisablebtn(true)
    //     setErrormessage('');
    //     setdisablebtn(true)
    //     console.log("Error fetching data:", err);
    //     setSuccessmessage('');

    //     let errorMsg = "An error occurred while verifying the account.";

    //     if (err?.code === 'ERR_NETWORK') {
    //       errorMsg = "Network error: Please check your internet connection.";
    //     } else if (err?.response?.data?.message) {
    //       errorMsg = err.response.data.message;
    //     }

    //     setErrormessage(errorMsg);
    //     setTimeout(() => {
    //       setErrormessage('');
    //     }, 1000);
    //   }
    // };

    // verifyAccount();
  }, [username]);

  useEffect(() => {
    if (registerStep === 1) {
      if (instituteType == "" || instituteName == "") {
        setdisablebtn(true);
      } else {
        setdisablebtn(false);
        console.log("succedded");

        return;
      }
    } else if (registerStep === 3) {
      if (firstName.length < 2 || lastName.length < 2) {
        setdisablebtn(true);
        setsuccessvalue(false);
        return;
      }

      setdisablebtn(!(firstName && lastName));
      setsuccessvalue(true);
    } else if (registerStep === 5) {
      setIsValidEmail(!isCompleteOtp);
    }
  }, [
    registerStep,
    selectedRole,
    username,
    firstName,
    lastName,
    isCompleteOtp,
    instituteType,
    instituteName,
  ]);

  useEffect(() => {
    console.log(
      "Email, Password, Confirm Password: in effect",
      email,
      password,
      confirmpassword
    );

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = email ? emailRegex.test(email.trim()) : false;
    setsuccessvalue(isValidEmail);

    // Password length validation (minimum 8 characters)
    const isValidPasswordLength = password && password.trim().length >= 8;

    const allFieldsFilled =
      email?.trim() && password?.trim() && confirmpassword?.trim();
    const passwordsMatch = password === confirmpassword;

    // Set error state if password is provided but less than 8 characters
    if (password?.trim() && password.trim().length < 8) {
      console.error("Password must be at least 8 characters long");
      // You could set an error state here instead:
      // setPasswordError("Password must be at least 8 characters long");
    }

    // Button should be disabled if any condition is not met
    setIsValidEmail(
      !(
        allFieldsFilled &&
        passwordsMatch &&
        isValidEmail &&
        isValidPasswordLength
      )
    );
  }, [email, password, confirmpassword]);

  const handleEmailVerification = async () => {
    setButtonDisabled(
      <span className="flex items-center gap-2">
        <span className="w-4 h-4 border-2 border-t-transparent border-green-500 text-center rounded-full animate-spin inline-block" />
        Checking...
      </span>
    );

    try {
      const res = await authApiUrl.post("register", {
        name: instituteName,
        type: instituteType,
        email,
        password,
        codename: username,
      });

      console.log(
        instituteName,
        instituteType,
        email,
        password,
        username,
        "helo my peop"
      );

      console.log("Response from server:", res);

      if (res.status === 201 || res.status === 200) {
        const responseData = res.data;
        console.log("Data set successfully:", responseData.message);
        console.log(res);
        console.log(responseData);

        setErrormessage("");
        setSuccessmessage(responseData.message);

        console.log("Success message:", responseData.message);

        const { accessToken, refreshToken, data: user } = res.data;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("userId", user._id);
        // console.log("User data stored in localStorage:", user);

        setTimeout(() => {
          setSuccessmessage("");
        }, 1000);
        setButtonDisabled("Done");

        setRegisterStep((prev) => prev + 1);
      }
    } catch (error) {
      if (error.response) {
        setButtonDisabled("continue");
        console.log("Error response:", error.response);
        const errorMessage =
          error.response.data.message || "Something went wrong.";
        setErrormessage(errorMessage);
      } else {
        setButtonDisabled("continue");

        setErrormessage("Network error or unexpected issue.");
      }
    }
  };

  const handleviewdashboard = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const role = storedUser?.type;

    if (role === "University") {
      router.push("/University");
    } else if (role === "College") {
      router.push("/College");
    } else if (role === "Training Center") {
      router.push("/Training Center");
    } else if (role === "Bootcamp") {
      router.push("/Bootcamp");
    } else {
      router.push("/Online Academy");
    }
  };

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

  const handleResend = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const email = storedUser?.email;

    try {
      const res = await authApiUrl.post("resend-verification", {
        email: email,
      });
      console.log("Resend response:", res.data);
      setTimeLeft(60);
      setCanResend(false);
    } catch (error) {
      console.error(
        "Failed to resend OTP:",
        error.response?.data?.message || error.message
      );
    }
  };

  const renderStep = () => {
    switch (registerStep) {
      case 1:
        return (
          <div className="flex items-center justify-center w-screen h-[90vh] ">
            <div className="w-full max-w-[336.13px] hide-scrollbar px sm:max-w-[607.96px]  mx-auto px-4 sm:px-0  flex flex-col  h-fit  gap-8 items-center justify-between ">
              <div className="flex flex-col gap-8 w-full max-w-[607.96px]">
                {/* Hero section */}
                <Registerherosection
                  gap="gap-3"
                  heading="ACTIVATE YOUR ACADEMY LAB"
                  text="Secure your Codename. Set up your institution. Start creating missions."
                />

                <div className="w-full ibm-plex-mono-thin flex flex-col gap-4">
                  {/* Institue */}
                  <div className="w-full grid grid-cols-1  gap-4">
                    {/* Institution Name" */}

                    <div
                      className={` h-[70.31px] sm:h-[75.16px] rounded-[10px] bg-[var(--btn-bg-color)] text-[#4B4B4B] bg-[(--btn-bg-color)] rounded-[10px]    `}
                    >
                      <input
                        className="outline-none text-[16px]   sm:text-[18px] leading-[40px] text-[var(--background)] placeholder-[#4B4B4B] w-full h-full px "
                        type="text"
                        onChange={(e) =>
                          setSelectedinstituteName(e.target.value)
                        }
                        placeholder="Institution Name"
                      />
                    </div>

                    {/* Institution Type */}

                    <div className="w-full h-[70.31px] sm:h-[75.16px] ">
                      <InstuteTypeDropdown />
                    </div>
                  </div>
                </div>

                <div className="flex w-full flex-col gap-4 pb-8">
                  <Registerbtn text="Continue" onClick={handleContinue} />
                  <p className="text-center text-[var(--text)] font-[700] text-[14px] leading-[20px]">
                    Already in mutant academy?
                    <Link href="/academy/auth/login">
                      {" "}
                      <span className="text-[var(--secondary)] cursor-pointer hover:underline">
                        Enter the Lab
                      </span>
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="flex flex-col  h-[90vh] w-screen items-center justify-center gap-10">
            <Registerherosection
              gap="gap-2"
              heading="Enter Your Codename"
              text="Every legend starts with a name. What’s yours?"
            />

            <div className="flex max-w-[500px] w-full flex-col px  gap-5">
              <RegisterInput
                onchange={(e) => setCodeName(e.target.value)}
                value={username}
                textCenter={"text-start"}
                placeholder="ENTER YOUR USERNAME"
                handledelete={() => setCodeName("")}
              />
              <SuccessMessage message={Successmessage} />
              <Registerbtn text="Continue" onClick={handleContinue} />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="flexcenter flex-col h-[90vh] w-screen">
            <Registerherosection
              gap="gap-2"
              heading="Secure Your Portal"
              text="Set your credentials to access The Lab."
            />
            <div className="flex flex-col max-w-[330px] w-full sm:max-w-[561px] gap-5">
              <RegisterInput
                handledelete={() => setEmail("")}
                onchange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Email Address"
              />
              <PasswordInput
                onchange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder=" password"
              />
              {registerStep === 4 && password && password.length < 8 && (
                <p className="text-red-500 font-[300] leading-[57px] text-[16px] text-center">
                  {" "}
                  Password must be at least 8 characters{" "}
                </p>
              )}
              <PasswordInput
                onchange={(e) => setconfirmpassword(e.target.value)}
                value={confirmpassword}
                type="password"
                placeholder="Confirm Password"
              />
              {registerStep === 4 && password !== confirmpassword && (
                <p className="text-red-500 font-[300] leading-[57px] text-[16px] text-center">
                  Passwords do not match
                </p>
              )}
              <button
                disabled={isValidEmail}
                onClick={handleEmailVerification}
                className={` text-white font-bold py-2 px-4 rounded w-full h-[57px] rounded-[8px] sm:rounded-[10px] text-[18px] leading-[57px] ${
                  isValidEmail ? "bg-[#404040] cursor-not-allowed" : "btn2"
                }`}
              >
                {buttonDisabledtext}
              </button>
              {errormessage && (
                <p className="text-[#FF5D5D] font-[300] leading-[57px] text-[16px] text-center">
                  {errormessage}
                </p>
              )}
              <SuccessMessage message={Successmessage} />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="flexcenter flex-col h-screen w-screen">
            <Registerherosection
              gap="gap-2"
              heading="Verify Your Signal"
              text="We’ve sent a secret code to your email. Prove your authenticity."
            />
            <div className="flex flex-col gap-10 max-w-[330px] w-full sm:max-w-[561px]">
              <div>
                <OTPInput />
              </div>

              <div className="flex flex-col gap-1 max-w-[330px] w-full sm:max-w-[561px]">
                <button
                  onClick={verifyOtpWithBackend}
                  className={`h-[60px] w-full rounded-[15px]  ${
                    otpCode.length === 6
                      ? "btn2"
                      : "bg-[#404040] cursor-not-allowed disabled "
                  }`}
                >
                  Verify
                </button>
                {errormessage && (
                  <p className="text-[#FF5D5D] font-[300] leading-[57px] text-[16px] text-center">
                    {errormessage}
                  </p>
                )}
                <SuccessMessage message={Successmessage} />

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
          </div>
        );

      default:
        return (
          <div className="w-[100vw] h-[90vh]  flex flex-col items-center justify-center gap-5 ">
            <div className="h-[130px] border w-[130px] rounded-full bg-green-300 flexcenter  ">
              <Image
                src="/images/markgood.png"
                alt="markgood"
                width={55.71}
                height={50.14}
              />
            </div>
            <p className="font-[700] text-[23px] leading-[27px] text-[var(--info)] text-center ">
              Amazing!
            </p>

            <Registerherosection
              gap="gap-2"
              heading="Congratulations"
              subheading="your academy portal is ready"
            />
            <button
              onClick={handleviewdashboard}
              className="w-full btn2 max-w-[330px] w-full sm:max-w-[561px]   h-[57px] rounded-[10px] text-[18px] font-[700] leading-[57px]"
            >
              continue to the lab
            </button>
          </div>
        );
    }
  };

  return <div className="">{renderStep()}</div>;
}
