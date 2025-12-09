"use client";

import { use, useContext, useEffect, useState } from "react";
import Registerherosection from "./Registerherosection";
import Registerbtn from "./Registerbtn";
import RegisterInput from "./RegisterIput";
import { Globlaxcontex } from "@/context/Globlaxcontex";
import OTPInput from "./Otpverification";
import PasswordInput from "../../../-components/PasswordInput";
import Image from "next/image";
import Link from "next/link";
import authApiUrl from "@/lib/baseUrl";
import SuccessMessage from "../../../../../components/SuccessMessage";
import { useRouter } from "next/navigation";

export default function IdentifyRole() {
  const router = useRouter();
  const [referralCode, setReferralCode] = useState(null);
  const [buttonDisabledtext, setButtonDisabled] = useState("Continue");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const [firstNameSuccess, setFirstNameSuccess] = useState(false);
  const [lastNameSuccess, setLastNameSuccess] = useState(false);
  const [isusername, setUserName] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  const {
    otpbtn,
    setOtpBtn,
    otpCode,
    successValue,
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
    isVerifyingOtp,
  } = useContext(Globlaxcontex);

  // Extract referral code from URL on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const ref = urlParams.get("ref");
      if (ref) {
        setReferralCode(ref);
      }
    }
  }, []);

  useEffect(() => {
    setSuccessmessage(
      <span className="flex items-center gap-2">
        <span className="w-4 h-4 border-2 border-t-transparent border-green-500 rounded-full animate-spin inline-block" />
        Checking...
      </span>
    );
    setsuccessvalue(false);
    setUserName(false);
    setdisablebtn(true);
    setErrormessage("");
    setSuccessmessage("");

    if (username.length === 0) {
      return;
    }

    const abortController = new AbortController();

    const timeoutId = setTimeout(async () => {
      try {
        if (username.length === 0) {
          return;
        }

        const res = await authApiUrl.post(
          "check-username",
          { username },
          { signal: abortController.signal }
        );

        if (abortController.signal.aborted || username.length === 0) {
          return;
        }

        const responseData = res.data;
        console.log("Response from server:", res);

        if (res.status === 201 || res.status === 200) {
          setErrormessage("");
          setSuccessmessage(responseData.message);
          setsuccessvalue(true);
          setUserName(true);
          setdisablebtn(false);

          setTimeout(() => {
            setSuccessmessage("");
          }, 1000);
        } else {
          setsuccessvalue(false);
          setSuccessmessage("");
          setdisablebtn(true);
          setErrormessage(responseData.message || "Something went wrong.");

          setTimeout(() => {
            setErrormessage("");
          }, 1000);
        }
      } catch (err) {
        if (err.name === "AbortError" || abortController.signal.aborted) {
          return;
        }

        setsuccessvalue(false);
        setdisablebtn(true);
        setSuccessmessage("");

        let errorMsg = "An error occurred while verifying the account.";

        if (err?.code === "ERR_NETWORK") {
          errorMsg = "Network error: Please check your internet connection.";
        } else if (err?.response?.data?.message) {
          errorMsg = err.response.data.message;
        }

        setErrormessage(errorMsg);
        setTimeout(() => {
          setErrormessage("");
        }, 1000);
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      abortController.abort();
    };
  }, [username]);

  useEffect(() => {
    setErrormessage("");
    setSuccessmessage("");
    if (registerStep === 1) {
      setdisablebtn(!selectedRole);
    } else if (registerStep === 3) {
      const isFirstValid = firstName.trim().length > 0;
      const isLastValid = lastName.trim().length > 0;

      setFirstNameSuccess(isFirstValid);
      setLastNameSuccess(isLastValid);

      setdisablebtn(!(isFirstValid && isLastValid)); // only enable if both valid
    } else if (registerStep === 4) {
      // Email and password validation for step 4
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const hasEmail = email && email.trim().length > 0;
      const hasPassword = password && password.trim().length > 0;
      const hasConfirmPassword =
        confirmpassword && confirmpassword.trim().length > 0;

      const isEmailValid = hasEmail ? emailRegex.test(email.trim()) : false;
      const isPasswordValid = hasPassword && password.trim().length >= 8;
      const allFieldsFilled = hasEmail && hasPassword && hasConfirmPassword;
      const passwordsMatch =
        hasPassword && hasConfirmPassword && password === confirmpassword;

      const isFormValid =
        allFieldsFilled && passwordsMatch && isEmailValid && isPasswordValid;

      setIsValidEmail(!isFormValid); // Disable button if form is NOT valid
      setCheckEmail(isEmailValid);
      setsuccessvalue(isEmailValid);

      console.log("Step 4 Validation:", {
        email,
        hasEmail,
        hasPassword,
        hasConfirmPassword,
        isEmailValid,
        isPasswordValid,
        allFieldsFilled,
        passwordsMatch,
        isFormValid,
        buttonShouldBeDisabled: !isFormValid,
      });
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
    email,
    password,
    confirmpassword,
  ]);

  const handleEmailVerification = async () => {
    setErrormessage("");
    setSuccessmessage("");
    setButtonDisabled("Loading...");

    try {
      let registerUrl = "register";
      if (referralCode) {
        registerUrl += `?ref=${encodeURIComponent(referralCode)}`;
      }

      const res = await authApiUrl.post(registerUrl, {
        email,
        password,
        firstName,
        lastName,
        username,
        role: selectedRole,
      });

      console.log("Response from server:", res);

      if (res.status === 201 || res.status === 200) {
        const responseData = res.data;
        console.log("Data set successfully:", responseData);

        setErrormessage("");
        setSuccessmessage(responseData.message);
        console.log("Success message:", responseData.message);

        const { accessToken, refreshToken, user } = res.data;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("login-accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("USER", JSON.stringify(user));

        // Set flag for new student welcome modal (15 XP reward)
        if (user.role === "student") {
          localStorage.setItem("newStudentWelcome", "true");
        }

        setTimeout(() => {
          setSuccessmessage("");
        }, 1000);

        setButtonDisabled("Done");
        // Always go to step 5 (OTP verification) after successful registration
        // Ensure we're at step 4 before incrementing
        if (registerStep === 4) {
          setRegisterStep(5);
        } else {
          setRegisterStep((prev) => prev + 1);
        }
      }
    } catch (error) {
      setButtonDisabled("Continue");

      if (error.response) {
        console.log("Error response:", error.response);
        const errorMessage =
          error.response.data.message || "Something went wrong.";
        setErrormessage(errorMessage);
      } else {
        console.error("Unexpected error:", error);
        setErrormessage("An unexpected error occurred.");
      }
    }
  };

  const handleviewdashboard = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const role = storedUser?.role;

    if (role === "instructor") {
      router.push("/instructor");
    } else if (role === "student") {
      router.push("/student");
    } else {
      router.push("/affiliate");
    }
  };

  const handleRedirectLogin = () => {
    const getUserData = localStorage.getItem("USER");

    if (getUserData) {
      const user = JSON.parse(getUserData);
      // Check if email is verified
      const isVerified =
        user.emailVerified ||
        user.isEmailVerified ||
        user.verified ||
        user.isVerified ||
        user.email_verified;

      if (!isVerified) {
        // Redirect to verify email page if not verified
        router.push("/auth/verify-email");
        return;
      }

      if (user.role === "student") {
        router.push("/student");
      } else {
        router.push("/auth/login");
      }
    } else {
      router.push("/auth/login");
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
    const storedUser = JSON.parse(localStorage.getItem("USER"));
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
          <div className="flex items-center justify-center w-screen h-full ">
            <div className="w-full max-w-[336.13px] hide-scrollbar px sm:max-w-[607.96px] mx-auto px-4 sm:px-0  flex flex-col  h-fit gap-8 items-center  ">
              <div className="flex flex-col gap-8 w-full max-w-[607.96px]">
                {/* Hero section */}
                <Registerherosection
                  gap="gap-3"
                  heading="Identify Your Role"
                  subheading="Begin your transformation"
                  text="Select your role in the mutant evolution"
                />

                <div className="w-full ibm-plex-mono-thin flex flex-col gap-4">
                  <div
                    onClick={() => setSelectedRole("student")}
                    className={`w-full h-[70.31px] sm:h-[96.03px] cut-box cursor-pointer ${
                      selectedRole === "student"
                        ? "bg-[var(--secondary)]"
                        : "bg-[var(--text-light)]"
                    }`}
                  >
                    <div
                      className={`cut-box-inner flex items-center sm:flex-col sm:justify-center gap-3 sm:gap-1 h-full w-full px-4 ${
                        selectedRole === "student"
                          ? "bg-[var(--role-selected-bg)]"
                          : "bg-[var(--foreground)]"
                      }`}
                    >
                      <input
                        className="radiobtn sm:hidden"
                        type="radio"
                        name="role"
                        value="student"
                        checked={selectedRole === "student"}
                        readOnly
                      />
                      <p className="text-center font-[500] text-[19px] leading-[27px] text-[var(--text)]">
                        Student
                      </p>
                      <p className="hidden sm:block text-center font-[500] text-[var(--text-light)] text-[12px] leading-[16px]">
                        Learn and mutate your skill DNA.
                      </p>
                    </div>
                  </div>

                  {/* Instructor & Affiliate row */}
                  <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Instructor card */}
                    <div
                      onClick={() => setSelectedRole("instructor")}
                      className={`cursor-pointer px-radio flex items-center sm:justify-center sm:flex-col gap-3 sm:gap-1 h-[70.31px] sm:h-[96.03px]  rounded-[5px] px-4 ${
                        selectedRole === "instructor"
                          ? "bg-[var(--role-selected-bg)] border border-[var(--secondary)]"
                          : "border border-[var(--text-light)] bg-[var(--foreground)]"
                      }`}
                    >
                      <input
                        className="radiobtn sm:hidden"
                        type="radio"
                        name="role"
                        value="instructor"
                        checked={selectedRole === "instructor"}
                        readOnly
                      />
                      <p className="text-center font-[500] text-[19px] leading-[27px] text-[var(--text)]">
                        Instructor
                      </p>
                      <p className="hidden sm:block text-center font-[500] text-[var(--text-light)] text-[12px] leading-[16px]">
                        Transfer wisdom. Guide the evolution.
                      </p>
                    </div>

                    {/* Affiliate card */}
                    <div
                      onClick={() => setSelectedRole("affiliate")}
                      className={`h-[70.31px] sm:h-[96.03px] w-full cut-box2 cursor-pointer ${
                        selectedRole === "affiliate"
                          ? " bg-[var(--secondary)]"
                          : "bg-[var(--text-light)]"
                      }`}
                    >
                      <div
                        className={`cut-box-inner2 flex items-center sm:flex-col sm:justify-center gap-3 sm:gap-1 h-full w-full px-4  ${
                          selectedRole === "affiliate"
                            ? "bg-[var(--role-selected-bg)]"
                            : "bg-[var(--foreground)]"
                        }  `}
                      >
                        <input
                          className="radiobtn sm:hidden"
                          type="radio"
                          name="role"
                          value="affiliate"
                          checked={selectedRole === "affiliate"}
                          readOnly
                        />
                        <p className="text-center font-[500] text-[19px] leading-[27px] text-[var(--text)]">
                          Affiliate
                        </p>
                        <p className="hidden sm:block text-center font-[500] text-[var(--text-light)] text-[12px] leading-[16px]">
                          Spread mutation across the network and earn.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex w-full flex-col gap-4 pb-8">
                  <Registerbtn text="Continue" onClick={handleContinue} />
                  <p className="text-center text-[var(--text)] font-[700] text-[14px] leading-[20px]">
                    Already a mutant?
                    <Link
                      href="
                    /auth/login"
                    >
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
          <div className="flex flex-col gap-10 max-w-[330px] sm:max-w-[561px] mx-auto w-full">
            <Registerherosection
              gap="gap-2"
              heading="Enter Your Codename"
              text="Every legend starts with a name. What's yours?"
            />

            <div className="flex flex-col px  gap-5">
              <RegisterInput
                successValue={isusername}
                onchange={(e) => {
                  // Convert to lowercase and allow only letters and numbers
                  const sanitized = e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9]/g, "");
                  setCodeName(sanitized);
                }}
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
          <div className="flex flex-col gap-10 max-w-[330px] sm:max-w-[561px] mx-auto w-full">
            <Registerherosection
              gap="gap-2"
              heading="Who Are You Before Mutation?"
              text="We need your real-world name."
            />
            <div className="flex flex-col gap-5">
              <RegisterInput
                successValue={firstNameSuccess}
                handledelete={() => setFirstName("")}
                hidden="hidden"
                onchange={(e) => {
                 
                  const value = e.target.value.replace(/\s/g, "");
                  const capitalized =
                    value.charAt(0).toUpperCase() +
                    value.slice(1).toLowerCase();
                  setFirstName(capitalized);
                }}
                value={firstName}
                placeholder="First Name"
              />
              <RegisterInput
                successValue={lastNameSuccess}
                handledelete={() => setLastName("")}
                hidden="hidden"
                onchange={(e) => {
                  // Remove spaces and capitalize first letter
                  const value = e.target.value.replace(/\s/g, "");
                  const capitalized =
                    value.charAt(0).toUpperCase() +
                    value.slice(1).toLowerCase();
                  setLastName(capitalized);
                }}
                value={lastName}
                placeholder="Last Name"
              />
              <Registerbtn text="Continue" onClick={handleContinue} />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="flex flex-col gap-10 max-w-[330px] sm:max-w-[561px] mx-auto w-full">
            <Registerherosection
              gap="gap-2"
              heading="Secure Your Portal"
              text="Set your credentials to access The Lab."
            />
            <div className="flex flex-col gap-5">
              <RegisterInput
                successValue={checkEmail}
                handledelete={() => setEmail("")}
                onchange={(e) => setEmail(e.target.value.toLowerCase())}
                value={email}
                type="email"
                placeholder="Email Address"
              />
              <PasswordInput
                onchange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Password"
              />
              {registerStep === 4 && password && password.length < 8 && (
                <p className="text-[var(--error-text-color)] font-[300] leading-[20px] text-[16px] text-center">
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
                <p className="text-[var(--error-text-color)] font-[300] leading-[20px] text-[16px] text-center">
                  Passwords do not match
                </p>
              )}
              <button
                disabled={isValidEmail}
                onClick={handleEmailVerification}
                className={`text-white font-bold py-2 px-4 rounded-[10px] w-full h-[57px] text-[18px] leading-[57px] transition-all duration-200 ${
                  isValidEmail
                    ? "bg-[var(--disabled-button-bg)] cursor-not-allowed"
                    : "btn cursor-pointer hover:opacity-90"
                }`}
              >
                {buttonDisabledtext}
              </button>
              {errormessage && (
                <p className="text-[var(--error-text-color)] font-[300] leading-[20px] text-[16px] text-center">
                  {errormessage}
                </p>
              )}
              <SuccessMessage message={Successmessage} />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="flex flex-col gap-10 max-w-[330px] sm:max-w-[561px] mx-auto w-full">
            <Registerherosection
              gap="gap-2"
              heading="Verify Your Signal"
              text="We've sent a secret code to your email. Prove your authenticity."
            />
            <div className="flex flex-col gap-10">
              <div>
                <OTPInput />
              </div>

              <div className="flex flex-col gap-1">
                <button
                  onClick={verifyOtpWithBackend}
                  disabled={otpCode.length !== 6 || isVerifyingOtp}
                  className={`h-[60px] w-full rounded-[10px] flex items-center justify-center gap-2 ${
                    otpCode.length === 6 && !isVerifyingOtp
                      ? "btn cursor-pointer"
                      : "bg-[var(--disabled-button-bg)] cursor-not-allowed disabled"
                  }`}
                >
                  {isVerifyingOtp ? (
                    <>
                      <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin inline-block" />
                      <span>Checking...</span>
                    </>
                  ) : (
                    otpbtn
                  )}
                </button>
                {errormessage && (
                  <p className="text-[var(--error-text-color)] font-[300] leading-[20px] text-[16px] text-center">
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
          <div className="w-full h-full flexcenter flex-col gap-5  max-w-[330px] sm:max-w-[561px] ">
            <div className="h-[130px] w-[130px] rounded-full bg-[#4A9B7F] flexcenter  ">
              <Image
                src="/images/markgood.png"
                alt="markgood"
                width={55.71}
                height={50.14}
              />
            </div>
            <p className="font-[700] text-[23px] leading-[27px] text-[#D4AF37] text-center ">
              Amazing!
            </p>
            <Registerherosection
              gap="gap-2"
              heading="CONGRATULATIONS"
              subheading="you've been Admitted"
            />
            
            <button
              onClick={handleRedirectLogin}
              style={{ padding: " 6px 30px" }}
              className=" btn cursor-pointer w-full  rounded-[10px] text-[18px] font-[700] leading-[57px]"
            >
              Continue to the Lab.
            </button>
            {/* </Link> */}
          </div>
        );
    }
  };

  return (
    <div className="flex justify-center items-center w-full">
      {renderStep()}
    </div>
  );
}
