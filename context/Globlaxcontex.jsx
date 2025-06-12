'use client'
import { createContext, useState } from "react";
import Errormessage from "./Errormessage";

export const Globlaxcontex = createContext()
export const GloblaxcontexProvider = ({ children }) => {
  
const [registerStep, setRegisterStep] = useState(1);
const [selectedRole, setSelectedRole] = useState("");
const [codeName, setCodeName] = useState("");
const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmpassword, setconfirmpassword] = useState("");
const [errormessage, setErrormessage] = useState("");
const [disablebtn,setdisablebtn] = useState(true)
const [isCompleteOtp, setIsCompleteOtp] = useState(false);
console.log(selectedRole, "selectedRole");
  // Function to handle the "Continue" button click

  console.log(password,confirmpassword, "password and confirm password");
  


  const handlesubmitform = ()=>{
    console.log("Form submitted:", {
      registerStep,
      selectedRole,
      codeName,
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
  
    if (registerStep === 2 && !codeName) {
      setErrormessage("Please enter a code name before continuing.");
      setTimeout(() => setErrormessage(""), 2000);
      return;
    }
  
    if (registerStep === 3 && (!firstName || !lastName)) {
      setErrormessage("Please enter your first and last name before continuing.");
      setTimeout(() => setErrormessage(""), 2000);
      return;
    }
  
    
  
    // Submit on final step
    // if (registerStep === 4) {
    //   handlesubmitform();
    //   return;
    // }
  
    // Move to next step


    setdisablebtn(true)
    setRegisterStep((prev) => prev + 1);
  };
  







  return (
    <Globlaxcontex.Provider value={{registerStep, setRegisterStep,handleContinue,selectedRole, setSelectedRole,errormessage,setErrormessage,setCodeName,codeName,firstName, setFirstName,lastName, setLastName,email, setEmail,password, setPassword,handlesubmitform,disablebtn,setdisablebtn,confirmpassword, 
    setconfirmpassword,isCompleteOtp, setIsCompleteOtp}}>
      {children}
    </Globlaxcontex.Provider>
  );
};