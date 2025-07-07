'use client';
import { createContext, useState } from "react";

export const InstructorContext = createContext();

export default function InstructorContextProvider({ children }) {
  const [profiledisplay, setprofiledisplay] = useState('Personal Information');
  const [openSmallScreenProfileDropDown,setopenSmallScreenProfileDropDown] = useState(false);
  const [openlargeProfileDropdown, setopenlargeProfileDropdown] = useState(false);
  const [ ChangePassword,setChangePassword] = useState(false)
  const [user, setUser] = useState(null);
  return (
    <InstructorContext.Provider value={{user, setUser,openlargeProfileDropdown, setopenlargeProfileDropdown, profiledisplay, setprofiledisplay,openSmallScreenProfileDropDown,setopenSmallScreenProfileDropDown,ChangePassword,setChangePassword }}>
      {children}
    </InstructorContext.Provider>
  );
}
