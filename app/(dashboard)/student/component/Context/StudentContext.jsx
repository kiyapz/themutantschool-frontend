"use client";
import { createContext, useContext, useState } from "react";


export const StudentContext = createContext();

export const StudentProvider = ({ children }) => {

const [viewStudentName,setViewStudentName] = useState(true)
const [menuOpen, setMenuOpen] = useState(false);
 const [currentCapsule, setCurrentCapsule] = useState([]);

  
  
  return (
    <StudentContext.Provider
      value={{
        viewStudentName,
        setViewStudentName,
        menuOpen,
        setMenuOpen,
        currentCapsule,
        setCurrentCapsule,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};