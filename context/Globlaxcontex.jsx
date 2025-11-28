'use client'
import { createContext, useState } from "react";
// import Errormessage from "../components/Errormessage";
import authApiUrl from "@/lib/baseUrl";
// import { set } from "zod";

export const Globlaxcontex = createContext()
export const GloblaxcontexProvider = ({ children }) => {
  
const [registerStep, setRegisterStep] = useState(1);
const [selectedRole, setSelectedRole] = useState("");
const [username, setCodeName] = useState("");
const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmpassword, setconfirmpassword] = useState("");
const [errormessage, setErrormessage] = useState("");
const [disablebtn,setdisablebtn] = useState(true)
const [isCompleteOtp, setIsCompleteOtp] = useState(false);
const [otpCode, setOtpCode] = useState("");
const [Successmessage, setSuccessmessage] = useState("");
const [successValue,setsuccessvalue] = useState(false)
const [otpbtn,setOtpBtn]=useState("Verify")
const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)



const [stack,setStack] = useState('Individual Account');
console.log(selectedRole, "selectedRole");
  

  console.log(password,confirmpassword, "password and confirm password");
  


  const handlesubmitform = ()=>{
    console.log("Form submitted:", {
      registerStep,
      selectedRole,
      username,
      firstName,
      lastName,
      email,
      password
    });
  }


  const handleContinue = () => {
    if (registerStep === 1 && !selectedRole) {
      setErrormessage("Please select a role before continuing.");
      setTimeout(() => setErrormessage(""), 2000);
      return;
    }
  
    if (registerStep === 2 && !username) {
      setErrormessage("Please enter a code name before continuing.");
      setTimeout(() => setErrormessage(""), 2000);
      return;
    }
  
    if (registerStep === 3 && (!firstName || !lastName)) {
      setErrormessage("Please enter your first and last name before continuing.");
      setTimeout(() => setErrormessage(""), 2000);
      return;
    }
  
    
  


    setdisablebtn(true)
    setRegisterStep((prev) => prev + 1);
    setsuccessvalue(false)
  };



  
  const verifyOtpWithBackend = async () => {
    console.log("Verifying OTP with backend...");
    setIsVerifyingOtp(true);
    setOtpBtn('Checking...')
  

    const storedUser = JSON.parse(localStorage.getItem("USER"));
    const email = storedUser?.email;

    console.log("Stored user email:", email);

    if (!email || !otpCode) {
      console.log("Missing email or otpCode");
      setIsVerifyingOtp(false);
      setOtpBtn("Verify");
      return;
    }
  
    const newotp = otpCode.replace(/\s+/g, ''); 
    const otpCodenew = String(newotp); 
  
    console.log("OTP Code:", otpCodenew);
    console.log("Is OTP a string?", typeof otpCodenew === "string");
  
    try {
      const response = await authApiUrl.post("verify", {
        email: email,
        token: otpCodenew,
      });
  
      if (response.status === 200 || response.data.success === true) {
        console.log("OTP verification successful:", response.data.message);
        console.log("Full response data:", response.data);
        setSuccessmessage(response.data.message);
        setIsCompleteOtp(true);
        
        // Update user object in localStorage with verification status
        // First, check if backend returned an updated user object
        let updatedUser = null;
        if (response.data.user) {
          updatedUser = response.data.user;
        } else if (response.data.data && response.data.data.user) {
          updatedUser = response.data.data.user;
        }
        
        const storedUser = localStorage.getItem("USER");
        if (storedUser) {
          try {
            let parsedUser = JSON.parse(storedUser);
            
            // If backend returned updated user, use that; otherwise update manually
            if (updatedUser) {
              // Merge the updated user data with existing user data
              parsedUser = { ...parsedUser, ...updatedUser };
            } else {
              // Manually update email verification status
              parsedUser.emailVerified = true;
              parsedUser.isEmailVerified = true;
              parsedUser.verified = true;
              parsedUser.isVerified = true;
              parsedUser.email_verified = true;
            }
            
            // Ensure isVerified is set to true (this is the key field)
            parsedUser.isVerified = true;
            
            // Save updated user object
            localStorage.setItem("USER", JSON.stringify(parsedUser));
            console.log("Updated user in localStorage:", parsedUser);
          } catch (error) {
            console.error("Failed to update user verification status:", error);
          }
        }
        
        setRegisterStep((prev) => prev + 1);
        setIsVerifyingOtp(false);
        return true;
      } else {
        console.log("OTP verification failed:", response.data.message);
        setErrormessage( "OTP verification failed");
        setTimeout(() => setErrormessage(""), 1000);
        setIsCompleteOtp(false)
        setIsCompleteOtp(false);
        setOtpBtn("Verify")
        setIsVerifyingOtp(false);
        return false;
      }
    } catch (error) {
      console.log("Error verifying OTP:", error.response?.data?.message || error.message);
      setErrormessage("OTP verification failed");
      setTimeout(() => setErrormessage(""), 1000);
      setIsCompleteOtp(false)
      setOtpBtn("Verify")
      setIsVerifyingOtp(false);
      return false;
    }
  };
  
  







  return (
    <Globlaxcontex.Provider value={{otpbtn,setOtpBtn,Successmessage, setSuccessmessage,registerStep, setRegisterStep,handleContinue,selectedRole, setSelectedRole,setCodeName,username,firstName, setFirstName,lastName, setLastName,email, setEmail,password, setPassword,handlesubmitform,disablebtn,setdisablebtn,confirmpassword, 
    setconfirmpassword,isCompleteOtp, setIsCompleteOtp,successValue,setsuccessvalue,stack,setStack,errormessage,setErrormessage,password, setPassword,confirmpassword, setconfirmpassword,otpCode, setOtpCode,verifyOtpWithBackend,isVerifyingOtp}}>
      {children}
    </Globlaxcontex.Provider>
  );
};