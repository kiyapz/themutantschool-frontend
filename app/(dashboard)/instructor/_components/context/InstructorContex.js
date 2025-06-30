'use client';
import { createContext, useState } from "react";

export const InstructorContext = createContext();

export default function InstructorContextProvider({ children }) {
  const [profiledisplay, setprofiledisplay] = useState('Personal Information');

  return (
    <InstructorContext.Provider value={{ profiledisplay, setprofiledisplay }}>
      {children}
    </InstructorContext.Provider>
  );
}
