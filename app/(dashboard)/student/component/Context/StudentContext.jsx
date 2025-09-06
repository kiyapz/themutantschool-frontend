"use client";
import { createContext, useContext, useEffect, useState } from "react";


export const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const [viewStudentName, setViewStudentName] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentCapsule, setCurrentCapsule] = useState([]);
  const [watchedVideos, setWatchedVideos] = useState([]); 
  const [currentCapsuleTitle, setCurrentCapsuleTitle] = useState("");
  // Quiz state - this is what you can pass to other components
  const [showQuiz, setShowQuiz] = useState(false);
  const [showLevelCkallenge, setShowLevelCkallenge] = useState(true);


    // useEffect(() => {
    //   setShowLevelCkallenge(true);
    // }, [showLevelCkallenge, setShowLevelCkallenge]);


  return (
    <StudentContext.Provider
      value={{
        viewStudentName,
        setViewStudentName,
        menuOpen,
        setMenuOpen,
        currentCapsule,
        setCurrentCapsule,
        watchedVideos,
        setWatchedVideos,
        currentCapsuleTitle,
        setCurrentCapsuleTitle,
        showQuiz,
        setShowQuiz,
        showLevelCkallenge,
        setShowLevelCkallenge,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};