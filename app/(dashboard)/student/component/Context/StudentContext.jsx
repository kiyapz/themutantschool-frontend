"use client";
import { createContext, useContext, useState } from "react";


export const StudentContext = createContext();

export const StudentProvider = ({ children }) => {

const [viewStudentName,setViewStudentName] = useState(true)
const [menuOpen, setMenuOpen] = useState(false);

  
  
  return (
    <StudentContext.Provider
      value={{
        viewStudentName,
        setViewStudentName,
        menuOpen,
        setMenuOpen,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};