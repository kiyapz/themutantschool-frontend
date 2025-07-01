'use client';
import { createContext, useState } from "react";

export const InstructorContext = createContext();

export default function InstructorContextProvider({ children }) {
  const [profiledisplay, setprofiledisplay] = useState('Personal Information');
  const [openSmallScreenProfileDropDown,setopenSmallScreenProfileDropDown] = useState(false);
  const [openlargeProfileDropdown, setopenlargeProfileDropdown] = useState(false);

  return (
    <InstructorContext.Provider value={{openlargeProfileDropdown, setopenlargeProfileDropdown, profiledisplay, setprofiledisplay,openSmallScreenProfileDropDown,setopenSmallScreenProfileDropDown }}>
      {children}
    </InstructorContext.Provider>
  );
}
