'use client';
import { createContext, useState } from "react";

export const CourseGuideContext = createContext()

 const CourseGuideProvider = ({ children }) => {
    const [showVideo, setShowVideo] = useState(false);
    const [showVideoLevels, setShowVideoLevels] = useState(false);
  return (
    <CourseGuideContext.Provider
      value={{ showVideo, setShowVideo, showVideoLevels, setShowVideoLevels }}
    >
      {children}
    </CourseGuideContext.Provider>
  );
}
export default CourseGuideProvider;