"use client";
import { createContext, useContext, useState } from "react";


export const StudentContext = createContext();

export const StudentProvider = ({ children }) => {

const [viewStudentName,setViewStudentName] = useState(true)

  
  
  return (
    <StudentContext.Provider
      value={{
        viewStudentName,
        setViewStudentName,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};