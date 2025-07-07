'use client';

import { use, useContext, useEffect, useState } from "react";
import Registerherosection from "./Registerherosection";
import Registerbtn from "./Registerbtn";
import RegisterInput from "./RegisterIput";
import { Globlaxcontex } from "@/context/Globlaxcontex";
import OTPInput from "./Otpverification";
import PasswordInput from "../../-components/PasswordInput";
import Image from "next/image";
import Link from "next/link";
import authApiUrl from "@/lib/baseUrl";
import SuccessMessage from "../../../../components/SuccessMessage";
import { useRouter } from "next/navigation";


export default function IdentifyRole() {
  
 const router = useRouter(); 
  const [buttonDisabledtext, setButtonDisabled] = useState('continue');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  // const [firstName, setFirstName] = useState("");
// const [lastName, setLastName] = useState("");

const [firstNameSuccess, setFirstNameSuccess] = useState(false);
const [lastNameSuccess, setLastNameSuccess] = useState(false);
const [isusername,setUserName]=useState(false)
const [checkEmail,setCheckEmail]=useState(false)


  const {otpbtn,setOtpBtn,otpCode,successValue,setsuccessvalue,Successmessage, setSuccessmessage,verifyOtpWithBackend, stack,setStack,password, setPassword,confirmpassword, setconfirmpassword,isCompleteOtp,registerStep, setRegisterStep ,selectedRole, setSelectedRole,errormessage,setErrormessage,setCodeName,username,firstName, setFirstName,lastName, setLastName,email, setEmail,setdisablebtn,handleContinue} = useContext(Globlaxcontex);

  
  useEffect(() => {
    setsuccessvalue(false)
    setUserName(false)
    setSuccessmessage(
      <span className="flex items-center gap-2">
        <span className="w-4 h-4 border-2 border-t-transparent border-green-500 rounded-full animate-spin inline-block" />
        Checking...
      </span>
    );
    
    setdisablebtn(true);
    setErrormessage('');
    

    if (username.length < 1) {
      
      setSuccessmessage('');
      setdisablebtn(true)
      return;
    }
    
  
    const verifyAccount = async () => {
      try {
        const res = await authApiUrl.post("check-username", { username }); 
    
        const responseData = res.data;
        console.log("Response from server:", res);
    
        if (res.status === 201 || res.status === 200) {
          setErrormessage('');
          setSuccessmessage(responseData.message || "Username is available.");
          setsuccessvalue(true)
          setUserName(true)

          setTimeout(() => {
            setSuccessmessage('');
          }, 1000);
          setdisablebtn(!username);
        } else {
          setsuccessvalue(false)
          setSuccessmessage('');
          setdisablebtn(true);
          setErrormessage(responseData.message || "Something went wrong.");
          setTimeout(() => {
            setErrormessage('');
          }, 1000);
        }
    
      } catch (err) {
        setsuccessvalue(false)
        setdisablebtn(true)
        setErrormessage('');
        setdisablebtn(true)
        console.log("Error fetching data:", err);
        setSuccessmessage('');
    
        let errorMsg = "An error occurred while verifying the account.";
    
        if (err?.code === 'ERR_NETWORK') {
          errorMsg = "Network error: Please check your internet connection.";
        } else if (err?.response?.data?.message) {
          errorMsg = err.response.data.message;
        }
    
        setErrormessage(errorMsg);
        setTimeout(() => {
          setErrormessage('');
        }, 1000);
      }
    };
    
  
    verifyAccount();
  }, [username]);
  
  
  useEffect(() => {
  setErrormessage('');
  setSuccessmessage('');
    if (registerStep === 1) {
      setdisablebtn(!selectedRole);
    
    }
     else if  (registerStep === 3) {
      const isFirstValid = firstName.trim().length > 0;
      const isLastValid = lastName.trim().length > 0;
    
      setFirstNameSuccess(isFirstValid);
      setLastNameSuccess(isLastValid);
    
      setdisablebtn(!(isFirstValid && isLastValid)); // only enable if both valid
    }
    else if (registerStep === 5) {
      
      setIsValidEmail(!isCompleteOtp);
    } 
  }, [registerStep, selectedRole, username, firstName, lastName,isCompleteOtp]);
  
  
  useEffect(() => {
    setErrormessage('');
  setSuccessmessage('');
    console.log("Email, Password, Confirm Password: in effect", email, password, confirmpassword);
    
    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = email ? emailRegex.test(email.trim()) : false;
    setsuccessvalue(isValidEmail)
    setCheckEmail(isValidEmail)
    
   
    const isValidPasswordLength = password && password.trim().length >= 8;
    
    const allFieldsFilled = email?.trim() && password?.trim() && confirmpassword?.trim();
    const passwordsMatch = password === confirmpassword;
    
    
    if (password?.trim() && password.trim().length < 8) {
        console.error("Password must be at least 8 characters long");
        
    }
    
    
    setIsValidEmail(!(allFieldsFilled && passwordsMatch && isValidEmail && isValidPasswordLength));
    
}, [email, password, confirmpassword])
  
  
const handleEmailVerification = async () => {
  setErrormessage('');
  setSuccessmessage('');
  setButtonDisabled('Loading...');

  try {
    const res = await authApiUrl.post("register", {
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

      setErrormessage('');
      setSuccessmessage(responseData.message);
      console.log('Success message:', responseData.message);

      const { accessToken, refreshToken,  user } = res.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("USER", JSON.stringify(user)); 

      setTimeout(() => {
        setSuccessmessage('');
      }, 1000);

      setButtonDisabled('Done');
      setRegisterStep((prev) => prev + 1);
    }
  } catch (error) {
    setButtonDisabled('continue');

    if (error.response) {
      console.log("Error response:", error.response);
      const errorMessage = error.response.data.message || "Something went wrong.";
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
  } else  {
    router.push("/affiliate");
  }

};  



useEffect(() => {
  let interval;
  if (timeLeft > 0) {
    interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
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
    const res = await authApiUrl.post("resend-verification", { email : email });
    console.log("Resend response:", res.data);
    setTimeLeft(60);
    setCanResend(false);
  } catch (error) {
    console.error("Failed to resend OTP:", error.response?.data?.message || error.message);
  }
};



  const renderStep = () => {
    switch (registerStep) {
      case 1:
        return (
          <div  className="flex items-center justify-center w-screen h-fit ">
      
      <div className="w-full max-w-[336.13px] hide-scrollbar px sm:max-w-[607.96px] mx-auto px-4 sm:px-0  flex flex-col  h-fit md:h-[70vh] xl:min-h-[90vh] gap-8 items-center justify-between ">
        
        
        {/* <div className=" hidden sm:block w-full">
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
        </div> */}

        
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
              className={`w-full h-[70.31px] sm:h-[96.03px] cut-box cursor-pointer ${selectedRole === "student" ? "bg-[var(--secondary)]" : "bg-[var(--text-light)]"}`}
            >
              <div className={`cut-box-inner flex items-center sm:flex-col sm:justify-center gap-3 sm:gap-1 h-full w-full px-4 ${selectedRole === "student" ? "bg-[#1B0932]" : "bg-[var(--foreground)]"}`}>
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
                className={`cursor-pointer px-radio flex items-center sm:justify-center sm:flex-col gap-3 sm:gap-1 h-[70.31px] sm:h-[96.03px]  rounded-[5px] px-4 ${selectedRole === "instructor" ? "bg-[#1B0932] border border-[var(--secondary)]" : "border border-[var(--text-light)] bg-[var(--foreground)]"}`}
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
                <div className={`cut-box-inner2 flex items-center sm:flex-col sm:justify-center gap-3 sm:gap-1 h-full w-full px-4  ${selectedRole === "affiliate" ? "bg-[#1B0932]" : "bg-[var(--foreground)]"}  `}>
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
              <RegisterInput successValue={isusername} onchange={(e)=>setCodeName(e.target.value)} value={username} textCenter={'text-start'} placeholder="ENTER YOUR USERNAME" handledelete={()=>setCodeName('')} />
              <SuccessMessage message={Successmessage} />
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
              <RegisterInput   successValue={firstNameSuccess}
 handledelete={()=>setFirstName("")} hidden='hidden' onchange={(e)=>setFirstName(e.target.value)} value={firstName} placeholder="First Name" />
              <RegisterInput successValue={lastNameSuccess}
 handledelete={()=>setLastName("")} hidden='hidden' onchange={(e)=>setLastName(e.target.value)} value={lastName} placeholder="Last Name" />
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
              
              <RegisterInput successValue={checkEmail} handledelete={()=>setEmail("")} onchange={(e)=>setEmail(e.target.value)} value={email} type='email'  placeholder="Email Address" />
              <PasswordInput onchange={(e)=>setPassword(e.target.value)} value={password} type='password'  placeholder=' password'  />
               {registerStep === 4 && password && password.length < 8 && (
                   <p className="text-red-500 font-[300] leading-[57px] text-[16px] text-center"> Password must be at least 8 characters  </p>)}
              <PasswordInput onchange={(e) => setconfirmpassword(e.target.value)} value={confirmpassword} type='password'  placeholder="Confirm Password"/>          
              {registerStep === 4 && password !== confirmpassword && (<p className="text-red-500 font-[300] leading-[57px] text-[16px] text-center">Passwords do not match</p>  )}
              <button disabled={isValidEmail} onClick={handleEmailVerification} className={` text-white font-bold py-2 px-4 rounded w-full h-[57px] text-[18px] leading-[57px] ${isValidEmail ? 'bg-[#404040] cursor-not-allowed' : 'btn'}`}>
                {buttonDisabledtext}
              </button>
              {errormessage && (
                <p className="text-[#FF5D5D] font-[300] leading-[57px] text-[16px] text-center">{errormessage}</p>
              )}
              <SuccessMessage message={Successmessage} />
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


                <div className="flex flex-col gap-1">
              

                    <button onClick={verifyOtpWithBackend} className={`h-[60px] w-full rounded-[15px]  ${otpCode.length === 6 ? 'btn' :'bg-[#404040] cursor-not-allowed disabled ' }`}>{otpbtn} </button>
                         {errormessage && (<p className="text-[#FF5D5D] font-[300] leading-[57px] text-[16px] text-center">{errormessage}</p> )}
                          <SuccessMessage message={Successmessage} />


               <div className="text-center text-[var(--text)] flex items-center justify-center gap-2 font-[700] text-[14px] leading-[20px]"> Didn’t receive email?
                  <div className="text-sm"> {!canResend ? (<span className="text-[var(--secondary)]">Resend in 00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</span>
                   ) : (
                  <button onClick={handleResend} className="text-[var(--secondary)] underline">  Resend OTP   </button>  )}
                   </div>
                
              </div>
           </div>
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
                onClick={handleviewdashboard}
                className="w-full btn h-[57px] rounded-[10px] text-[18px] font-[700] leading-[57px]"
              >
                 continue to the lab
              </button>

          </div>
        );
    }
  };

  return <div className="">{renderStep()}</div>;
}
