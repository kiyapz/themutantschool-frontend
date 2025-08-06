"use client";

import PasswordInput from "@/app/(auth)/-components/PasswordInput";
import authApiUrl from "../../../../_components/libs/authApiUrl";
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

  const handlelogin = async () => {
    // console.log("Clicked login...");
    setButtonvalue(
      <span className="flex items-center gap-2">
        <span className="w-4 h-4 border-2 border-t-transparent border-[var(--secondary)] rounded-full animate-spin inline-block" />
        Checking...
      </span>
    );
    setErrormessage("");

    if (!email || !password) {
      setErrormessage("Please enter your email and password.");
      setTimeout(() => setErrormessage(""), 1000);
      setButtonvalue("Enter the Lab");
      return;
    }

    try {
      const response = await authApiUrl.post("login", {
        email: email,
        password: password,
      });
      console.log("Login response:", response);

      if (response.status === 200) {
        console.log(response);

        console.log("Login successful:", response.data);

        const storedUser = JSON.parse(localStorage.getItem("type"));
        const role = storedUser?.type || response.data.type;

        console.log(response.data.message);
        console.log("Login successful:", response.data);
        setSuccessmessage(response.data.message);
        setTimeout(() => setSuccessmessage(""), 1000);
        setButtonvalue("Enter the Lab");
        localStorage.setItem("login-accessToken", response.data.accessToken);

        if (role === "University") {
          router.push("/University");
        } else if (role === "College") {
          router.push("/College");
        } else if (role === "Training Center") {
          router.push("/Training Center");
        } else if (role === "Bootcamp") {
          router.push("/Bootcamp");
        } else if (role === "Online Academy") {
          router.push("/Online Academy");
        } else {
          router.push("/academy/Login");
        }

        return true;
      } else {
        setErrormessage(response.data.message || "Login failed.");
        setTimeout(() => setErrormessage(""), 1000);
        setButtonvalue("Enter the Lab");

        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrormessage(
        error?.response?.data?.message || "Login failed. Please try again."
      );
      setTimeout(() => setErrormessage(""), 1000);
      setButtonvalue("Enter the Lab");

      return false;
    }
  };

  return (
    <div className="flex py flex-col items-center  justify-center  h-[80vh]    sm:h-screen w-screen ">
      <div className="mt-mutantlogin grid   grid-cols-1 sm:grid-cols-2 sm:gap-4  w-full max-w-[350px]   px sm:max-w-[700px]   xl:max-w-[1200px] h-fit ">
        <div
          style={{ backgroundImage: `url('/images/loginimg.png')` }}
          className="hidden sm:block bg-cover h-full   rounded-r-[30px] bg-center"
        >
          {" "}
        </div>

        <div className=" w-full flex   justify-center h-fit">
          <div className="    flex flex-col gap-2 w-full h-full  ">
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

              <div className="flex w-full h-full  flex-col justify-around gap-4">
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
                      onClick={handlelogin}
                      className="h-[60.5px] w-full xl:col-span-2  flex items-center justify-between px    rounded-[8px] btn cursor-pointer "
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
                    <div className="text-red-500 text-center mt-2">
                      {errormessage}
                    </div>
                  )}
                  {Successmessage && (
                    <div className="text-green-500 text-center mt-2">
                      {Successmessage}
                    </div>
                  )}
                </div>

                <Link href="/academy/ForgotPassword.jsx">
                  <p className="text-center text-[var(--text-light)] text-[12px] font-[500] leading-[40px] ">
                    Forgot Password?
                  </p>
                </Link>
                <Link href="/auth/register">
                  <p className="text-[16px] text-center cursor-pointer  hover:text-[var(--text)] leading-[40px] text-white ">
                    Register as Individual
                  </p>
                </Link>

                <div>
                  <div className="h-[60.5px] w-full flexcenter font-[600] text-[12px] sm:text-[14px] leading-[40px] text-[var(--background)]  border-[1px] px rounded-[8px] border-[var(--primary)] sm:h-[75.16px] ">
                    <p>
                      New here?{" "}
                      <Link href="/Register">
                        <span className="text-[var(--primary)] ">
                          Begin Your Transformation
                        </span>
                      </Link>{" "}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <p className="text-center text-[var(--text-light)] text-[14px] font-[500] leading-[40px] ">
          Copyright©Themutantschool2025
        </p>
      </div>
    </div>
  );
}
