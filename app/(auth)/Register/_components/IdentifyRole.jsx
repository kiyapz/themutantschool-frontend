'use client';

import { useContext, useEffect, useState } from "react";
import Registerherosection from "./Registerherosection";
import Registerbtn from "./Registerbtn";
import RegisterInput from "./RegisterIput";
import { Globlaxcontex } from "@/context/Globlaxcontex";
import OTPInput from "./Otpverification";
import PasswordInput from "../../-components/PasswordInput";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterformSchema } from "./ZodSchema";
import { z } from "zod";
import Errormessage from "@/context/Errormessage";
import Link from "next/link";

export default function IdentifyRole() {
  // const [disableBtn, setDisableBtn] = useState(true);
  const [password, setPassword] = useState("");
const [confirmpassword, setconfirmpassword] = useState("");
const [stack,setStack] = useState('Individual Account');




  
  const onSubmit = (data) => { console.log("Form submitted:", data); };
  const { isCompleteOtp,registerStep, setRegisterStep ,selectedRole, setSelectedRole,errormessage,setErrormessage,setCodeName,codeName,firstName, setFirstName,lastName, setLastName,email, setEmail,setdisablebtn} = useContext(Globlaxcontex);

  
  
  


  useEffect(() => {
    if (registerStep === 1) {
      setdisablebtn(!selectedRole);
    } else if (registerStep === 2) {
      setdisablebtn(!codeName);
    } else if (registerStep === 3) {
      setdisablebtn(!(firstName && lastName));
    } 
    else if (registerStep === 5) {
      
      setdisablebtn(!isCompleteOtp);
    } 
  }, [registerStep, selectedRole, codeName, firstName, lastName,isCompleteOtp]);
  
  
  useEffect(() => {
    console.log("Email, Password, Confirm Password: in effect", email, password, confirmpassword);
    
    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = email ? emailRegex.test(email.trim()) : false;
    
    // Password length validation (minimum 8 characters)
    const isValidPasswordLength = password && password.trim().length >= 8;
    
    const allFieldsFilled = email?.trim() && password?.trim() && confirmpassword?.trim();
    const passwordsMatch = password === confirmpassword;
    
    // Set error state if password is provided but less than 8 characters
    if (password?.trim() && password.trim().length < 8) {
        console.error("Password must be at least 8 characters long");
        // You could set an error state here instead:
        // setPasswordError("Password must be at least 8 characters long");
    }
    
    // Button should be disabled if any condition is not met
    setdisablebtn(!(allFieldsFilled && passwordsMatch && isValidEmail && isValidPasswordLength));
    
}, [email, password, confirmpassword])
  
  



  const handleContinue = () => setRegisterStep((prev) => prev + 1);

  const renderStep = () => {
    switch (registerStep) {
      case 1:
        return (
          <div  className="flex items-center justify-center w-screen h-fit ">
      {/* Main container with consistent max-width */}
      <div className="w-full max-w-[336.13px] hide-scrollbar px sm:max-w-[607.96px] mx-auto px-4 sm:px-0  flex flex-col  h-fit md:h-[70vh] xl:min-h-[90vh] gap-8 items-center justify-between ">
        
        {/* Tab switcher with consistent width */}
        <div className=" hidden sm:block w-full">
        <div className=" h-[60.5px] sm:h-[72.56px] w-full max-w-[607.96px] grid grid-cols-2 bg-[#1D1D1D] rounded-[8px]">
          <button 
            onClick={() => setStack('Individual Account')} 
            className={`rounded-[15px] h-[60.5px] text-[14px] font-[600] leading-[27px] text-center sm:h-[72.56px] w-full ${stack === 'Individual Account' ? 'bg-[#464646]' : ""} text-white`}
          >
            Individual Account
          </button>
          <button 
            onClick={() => setStack('Academy')} 
            className={`rounded-[15px] w-full h-[60.5px] text-[14px] font-[600] leading-[27px] text-center sm:h-[72.56px] ${stack === 'Academy' ? 'bg-[#464646]' : ""} text-white`}
          >
            Academy
          </button>
        </div>
        </div>

        {/* Content section with consistent spacing */}
        <div className="flex flex-col gap-8 w-full max-w-[607.96px]">
          
          {/* Hero section */}
          <Registerherosection
            gap="gap-3"
            heading="Identify Your Role"
            subheading="Begin your transformation"
            text="Select your role in the mutant evolution"
          />
          
          {/* Role selection cards */}
          <div className="w-full ibm-plex-mono-thin flex flex-col gap-4">
            
            {/* Student card - full width */}
            <div 
              onClick={() => setSelectedRole("student")} 
              className={`w-full h-[70.31px] sm:h-[96.03px] cut-box cursor-pointer ${selectedRole === "student" ? "bg-[var(--secondary)]" : "bg-[var(--text-light)]"}`}
            >
              <div className="cut-box-inner flex items-center sm:flex-col sm:justify-center gap-3 sm:gap-1 h-full w-full px-4">
                <input 
                  className="radiobtn sm:hidden" 
                  type="radio" 
                  name="role" 
                  value="student" 
                  checked={selectedRole === "student"} 
                  readOnly 
                />
                <p className="text-center font-[500] text-[19px] leading-[27px] text-[var(--text)]">Student</p>
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
                className={`cursor-pointer px-radio flex items-center sm:justify-center sm:flex-col gap-3 sm:gap-1 h-[70.31px] sm:h-[96.03px] bg-[var(--foreground)] rounded-[5px] px-4 ${selectedRole === "instructor" ? "border-2 border-[var(--secondary)]" : "border border-[var(--text-light)]"}`}
              >
                <input 
                  className="radiobtn sm:hidden" 
                  type="radio" 
                  name="role" 
                  value="instructor" 
                  checked={selectedRole === "instructor"} 
                  readOnly 
                />
                <p className="text-center font-[500] text-[19px] leading-[27px] text-[var(--text)]">Instructor</p>
                <p className="hidden sm:block text-center font-[500] text-[var(--text-light)] text-[12px] leading-[16px]">
                  Transfer wisdom. Guide the evolution.
                </p>
              </div>
              
              {/* Affiliate card */}
              <div 
                onClick={() => setSelectedRole("affiliate")} 
                className={`h-[70.31px] sm:h-[96.03px] w-full cut-box2 cursor-pointer ${selectedRole === "affiliate" ? " bg-[var(--secondary)]" : "bg-[var(--text-light)]"}`}
              >
                <div className="cut-box-inner2 flex items-center sm:flex-col sm:justify-center gap-3 sm:gap-1 h-full w-full px-4">
                  <input 
                    className="radiobtn sm:hidden" 
                    type="radio" 
                    name="role" 
                    value="affiliate" 
                    checked={selectedRole === "affiliate"} 
                    readOnly 
                  />
                  <p className="text-center font-[500] text-[19px] leading-[27px] text-[var(--text)]">Affiliate</p>
                  <p className="hidden sm:block text-center font-[500] text-[var(--text-light)] text-[12px] leading-[16px]">
                    Spread mutation across the network and earn.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom section with consistent spacing */}
          <div className="flex w-full flex-col gap-4 pb-8">
            <Registerbtn text='Continue' onClick={handleContinue} />
            <p className="text-center text-[var(--text)] font-[700] text-[14px] leading-[20px]">
              Already a mutant?<Link href='/Login'> <span className="text-[var(--secondary)] cursor-pointer hover:underline">Enter the Lab</span></Link> 
            </p>
          </div>
        </div>
      </div>
    </div>
        );

      case 2:
        return (
          <div className="flex flex-col gap-10">
            <Registerherosection
              gap="gap-2"
              heading="Enter Your Codename"
              text="Every legend starts with a name. What’s yours?"
            />
            <div className="flex flex-col px  gap-5">
              <RegisterInput onchange={(e)=>setCodeName(e.target.value)} value={codeName} textCenter={'text-center'} placeholder="ENTER YOUR USERNAME" />
              <Registerbtn text='Continue' onClick={handleContinue} />

            </div>
            
          </div>
        );

      case 3:
        return (
          <div className="flex flex-col gap-10 max-w-[330px] sm:max-w-[561px]">
            <Registerherosection
              gap="gap-2"
              heading="Who Are You Before Mutation?"
              text="We need your real-world name."
            />
            <div className="flex flex-col gap-5">
              <RegisterInput onchange={(e)=>setFirstName(e.target.value)} value={firstName} placeholder="First Name" />
              <RegisterInput onchange={(e)=>setLastName(e.target.value)} value={lastName} placeholder="Last Name" />
              <Registerbtn text='Continue' onClick={handleContinue} />
            </div>
          
          </div>
        );

      case 4:
        return (
          <div>
            <Registerherosection
              gap="gap-2"
              heading="Secure Your Portal"
              text="Set your credentials to access The Lab."
            />
            <div className="flex flex-col gap-5">
              {/* <form onSubmit={onsubmit} className="flex flex-col gap-5"> */}
              <RegisterInput onchange={(e)=>setEmail(e.target.value)} value={email} type='email'  placeholder="Email Address" />
              <PasswordInput onchange={(e)=>setPassword(e.target.value)} value={password} type='password'  placeholder=' password'  />
              {/* {registerStep === 4 && password !== confirmpassword && (<p className="text-red-500 font-[300] leading-[57px] text-[16px] text-center">Passwords must be up to 8 characters</p>  )}
               */}
               {registerStep === 4 && password && password.length < 8 && (
    <p className="text-red-500 font-[300] leading-[57px] text-[16px] text-center">
      Password must be at least 8 characters
    </p>
  )}
              <PasswordInput onchange={(e) => setconfirmpassword(e.target.value)} value={confirmpassword} type='password'  placeholder="Confirm Password"/>          
              {registerStep === 4 && password !== confirmpassword && (<p className="text-red-500 font-[300] leading-[57px] text-[16px] text-center">Passwords do not match</p>  )}
              <Registerbtn  text='Continue' />
              
                           {/* </form> */}
            </div>
          </div>
        );

      case 5:
        return (
          <div>
            <Registerherosection
              gap="gap-2"
              heading="Verify Your Signal"
              text="We’ve sent a secret code to your email. Prove your authenticity."
            />
            <div className="flex flex-col gap-10">
                <div>
                    <OTPInput />
                </div>
                {/* <button
        disabled={!isCompleteOtp}
        className={`w-40 h-10 rounded bg-blue-500 text-white font-bold transition-opacity ${
          isCompleteOtp ? 'opacity-100' : 'opacity-50 cursor-not-allowed'
        }`}
        onClick={() => onComplete?.(otp.join(""))}
      >
        Continue
      </button> */}

      <Registerbtn  text='verify' />
              <p className="text-center text-[var(--text)] font-[700] text-[14px] leading-[20px]">
                Didn’t receive email?{" "}
                <span className="text-[var(--secondary)]">Resend in 00:60</span>
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="w-full h-full flexcenter flex-col gap-5  max-w-[330px] sm:max-w-[561px] ">
            <div  className="h-[130px] border w-[130px] rounded-full bg-green-300 flexcenter  ">
              <Image
               
                src="/images/markgood.png"
                alt="markgood"
                width={55.71}
                height={50.14}
              />
            </div>
            <p className="font-[700] text-[23px] leading-[27px] text-[var(--info)] text-center ">Amazing!</p>
            <Registerherosection
              gap="gap-2"
              heading="Congratulations"
              subheading="You’ve been admmited"
              
            />
            <button
                
                className="w-full btn h-[57px] rounded-[10px] text-[18px] font-[700] leading-[57px]"
              >
                Verify
              </button>

          </div>
        );
    }
  };

  return <div className="">{renderStep()}</div>;
}
