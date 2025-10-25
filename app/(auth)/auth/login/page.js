"use client";

import PasswordInput from "@/app/(auth)/-components/PasswordInput.jsx";
import authApiUrl from "@/lib/baseUrl";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const date = new Date();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errormessage, setErrormessage] = useState("");
  const [Successmessage, setSuccessmessage] = useState("");
  const [buttonvalue, setButtonvalue] = useState("Enter the Lab");
  const [isLoading, setIsLoading] = useState(false);

  const handlelogin = async () => {
    console.log("Clicked login...");
    setIsLoading(true);
    setButtonvalue(
      <span className="flex items-center gap-2">
        <span className="w-4 h-4 border-2 border-t-transparent border-[var(--secondary)] rounded-full animate-spin inline-block" />
        Checking...
      </span>
    );
    setErrormessage("");

    if (!email || !password) {
      setErrormessage("Please enter your email and password.");
      setTimeout(() => setErrormessage(""), 2000);
      setButtonvalue("Enter the Lab");
      setIsLoading(false);
      return;
    }

    try {
      const response = await authApiUrl.post("login", { email, password });
      console.log("Login response:", response);

      if (response.status === 200) {
        const { message, accessToken, user, refreshToken } = response.data;

        console.log("Login successful:", response.data);
        setSuccessmessage(message);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("login-accessToken", accessToken);
        localStorage.setItem("USER", JSON.stringify(user));

        setTimeout(() => setSuccessmessage(""), 2000);
        setButtonvalue("Enter the Lab");
        setIsLoading(false);

        if (user.role === "instructor") router.push("/instructor");
        else if (user.role === "student") router.push("/student");
        else if (user.role === "affiliate") router.push("/affiliate");
        else router.push("/");

        return true;
      } else if (!response.status === 200) {
        setErrormessage(response.data.message || "Login failed.");
        setTimeout(() => setErrormessage(""), 2000);
        setButtonvalue("Enter the Lab");
        setIsLoading(false);
        return false;
      } else {
        // setErrormessage(response.data.message || "Login failed.");
        setErrormessage("invalid email or Password Login failed.");
        setTimeout(() => setErrormessage(""), 2000);
        setButtonvalue("Enter the Lab");
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);

      // Check if it's an email verification error (403)
      if (
        error?.response?.status === 403 &&
        error?.response?.data?.message?.includes("not verified")
      ) {
        setErrormessage(
          "Account not verified. Redirecting to verification page..."
        );
        setButtonvalue("Enter the Lab");
        setIsLoading(false);

        // Redirect to verification page after 2 seconds
        setTimeout(() => {
          router.push("/auth/verify-email");
        }, 2000);
        return;
      }

      setErrormessage(error.response?.data?.message || "Login failed.");
      setButtonvalue("Enter the Lab");
      setIsLoading(false);
      setTimeout(() => setErrormessage(""), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-4 sm:p-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-0 w-full h-full sm:min-h-screen">
        <div
          style={{ backgroundImage: `url('/images/loginimg.png')` }}
          className="hidden sm:block bg-cover h-full w-full rounded-r-[30px] bg-center bg-no-repeat min-h-screen login-bg-image"
        >
          {" "}
        </div>

        <div className="w-full flex justify-center items-center h-full sm:min-h-screen p-4 sm:p-8">
          <div className="max-w-[500px] flex flex-col gap-4 sm:gap-8 w-full">
            <h2 className="hidden sm:block  text-center Xirod text-[26px] leading-[41px] text-[var(--secondary)]  ">
              MUTANT
            </h2>

            <div className="flex flex-col gap-4 sm:gap-7 h-full">
              <div>
                <h1 className="font-[400] text-[18px] leading-[30px] text-center Xirod sm:text-[31px] sm:leading-[40px] text-[var(--background)]">
                  ENTER THE LAB
                </h1>
                <p className="hidden sm:block text-center text-[var(--info)] font-[700] text-[13px] leading-[27px]">
                  Login to continue your mutation
                </p>
              </div>

              <div className="flex w-full flex-col gap-4 px-2 sm:px-6">
                <div className="flex flex-col gap-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="h-[50px] sm:h-[70px] outline-none font-[400] text-[14px] sm:text-[17px] leading-[20px] sm:leading-[57px] rounded-[8px] w-full px-3 sm:px-4 py-2 sm:rounded-[10px] !bg-[var(--accent)] text-white placeholder-gray-400"
                  />

                  <PasswordInput
                    value={password}
                    onchange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-[1.5fr_1fr] xl:grid-cols-3 gap-3 xl:gap-4 w-full">
                    <div
                      onClick={!isLoading ? handlelogin : undefined}
                      className={`h-[50px] sm:h-[60px] w-full xl:col-span-2 flex items-center justify-between px-3 sm:px-4 rounded-[8px] btn ${
                        isLoading
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                    >
                      <p className="font-[600] text-[14px] sm:text-[15px] leading-[20px] sm:leading-[57px] text-[var(--background)]">
                        {buttonvalue}
                      </p>
                      <Image
                        src={"/images/Arrow.png"}
                        alt="arrow"
                        width={18}
                        height={15}
                      />
                    </div>
                    <div className="h-[50px] sm:h-[60px] w-full border-[1px] rounded-[8px] flex items-center justify-between px-3 sm:px-4 border-[var(--primary)] cursor-pointer">
                      <Image
                        src={"/images/google.png"}
                        alt="arrow"
                        width={28.75}
                        height={28.36}
                      />
                      <p className="font-[600] text-[14px] sm:text-[15px] xl:text-[20px] leading-[20px] sm:leading-[57px] text-[var(--background)]">
                        Google
                      </p>
                    </div>
                  </div>
                  {errormessage && (
                    <div className="text-[var(--error-text-color)] text-center mt-2">
                      {errormessage}
                    </div>
                  )}
                  {Successmessage && (
                    <div className="text-[var(--success-text-color)] text-center mt-2">
                      {Successmessage}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <Link href="/auth/forgot-password">
                    <p className="text-center text-[var(--text-light)] text-[12px] font-[500] leading-[20px] sm:leading-[40px]">
                      Forgot Password?
                    </p>
                  </Link>
                  <Link href="/auth/verify-email">
                    <p className="text-center text-[var(--text-light)] text-[12px] font-[500] leading-[20px] hover:text-[var(--secondary)] cursor-pointer">
                      Haven&apos;t verified your email?{" "}
                      <span className="text-[var(--secondary)] underline">
                        Click here to verify
                      </span>
                    </p>
                  </Link>
                </div>
                <Link href="/academy/auth/register">
                  <p className="text-[14px] sm:text-[16px] text-center cursor-pointer hover:text-[var(--text)] leading-[20px] sm:leading-[40px] text-white">
                    Register as Institution
                  </p>
                </Link>

                <div>
                  <div className="h-[50px] sm:h-[60px] w-full flex-col flex items-center justify-center font-[600] text-[12px] sm:text-[14px] leading-[20px] sm:leading-[40px] text-[var(--background)] border-[1px] px-3 sm:px-4 rounded-[8px] border-[var(--primary)]">
                    <p>
                      New here?{" "}
                      <Link href="/auth/register">
                        <span className="text-[var(--primary)]">
                          Begin Your Transformation
                        </span>
                      </Link>{" "}
                    </p>
                  </div>
                  <p className="text-center text-[var(--text-light)] text-[12px] sm:text-[14px] font-[500] leading-[20px] sm:leading-[40px] mt-2">
                    Copyright©Themutantschool2025
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div></div>
    </div>
  );
}
