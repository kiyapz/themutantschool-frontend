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
        else if (user.role === "student")
          router.push("/student/student-dashboard");
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
      setErrormessage(error.response.data.message || "Login failed.");
      setButtonvalue("Enter the Lab");
      setIsLoading(false);
      setTimeout(() => setErrormessage(""), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between h-screen w-full p-6 sm:p-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-0 w-full h-full">
        <div
          style={{ backgroundImage: `url('/images/loginimg.png')` }}
          className="hidden sm:block bg-cover h-full w-full rounded-r-[30px] bg-center bg-no-repeat"
        >
          {" "}
        </div>

        <div className="w-full flex justify-center items-center h-full p-6 sm:p-8">
          <div className="max-w-[500px] flex flex-col gap-6 sm:gap-8 w-full">
            <h2 className="hidden sm:block  text-center Xirod text-[26px] leading-[41px] text-[var(--secondary)]  ">
              MUTANT
            </h2>

            <div className="flex flex-col gap-7 h-full">
              <div>
                <h1 className="font-[400] text-[16px] leading-[57px]  text-center Xirod sm:text-[31px] sm:leading-[40px] text-[var(--background)]  ">
                  ENTER THE LAB
                </h1>
                <p className="hidden sm:block text-center text-[var(--info)] font-[700] text-[13px] leading-[27px]   ">
                  Login to continue your mutation
                </p>
              </div>

              <div style={{padding:'0 25px'}} className="flex w-full h-full  flex-col justify-around gap-4">
                <div className="flex flex-col gap-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="h-[70.31px] outline-none font-[400] text-[17px] leading-[57px] rounded-[8px] w-full px p-2 sm:rounded-[10px] sm:h-[75.16px]  !bg-[var(--accent)] "
                  />

                  <PasswordInput
                    value={password}
                    onchange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                  />
                  <div className="grid grid-cols-[1.5fr_1fr] xl:grid-cols-3 h-[75.16px] gap-3 xl:gap-4 w-full   ">
                    <div
                      onClick={!isLoading ? handlelogin : undefined}
                      className={`h-[60.5px] w-full xl:col-span-2  flex items-center justify-between px rounded-[8px] btn ${
                        isLoading
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                    >
                      <p className="font-[600] text-[15px] leading-[57px] text-[var(--background)] ">
                        {buttonvalue}
                      </p>
                      <Image
                        src={"/images/Arrow.png"}
                        alt="arrow"
                        width={18}
                        height={15}
                      />
                    </div>
                    <div className="h-[60.5px] w-full   border-[1px] rounded-[8px] flex items-center justify-between px  border-[var(--primary)]  cursor-pointer">
                      <Image
                        src={"/images/google.png"}
                        alt="arrow"
                        width={28.75}
                        height={28.36}
                      />
                      <p className="font-[600] xl:text-[20px] text-[15px] leading-[57px] text-[var(--background)] ">
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

                <Link href="/auth/forgot-password">
                  <p className="text-center text-[var(--text-light)] text-[12px] font-[500] leading-[40px] ">
                    Forgot Password?
                  </p>
                </Link>
                <Link href="/academy/auth/register">
                  <p className="text-[16px] text-center cursor-pointer  hover:text-[var(--text)] leading-[40px] text-white ">
                    Register as Institution
                  </p>
                </Link>

                <div>
                  <div className="h-[60.5px] w-full flex-col flexcenter font-[600] text-[12px] sm:text-[14px] leading-[40px] text-[var(--background)]  border-[1px] px rounded-[8px] border-[var(--primary)] sm:h-[75.16px] ">
                    <p>
                      New here?{" "}
                      <Link href="/auth/register">
                        <span className="text-[var(--primary)] ">
                          Begin Your Transformation
                        </span>
                      </Link>{" "}
                    </p>
                  </div>
                  <p className="text-center text-[var(--text-light)] text-[14px] font-[500] leading-[40px] ">
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
