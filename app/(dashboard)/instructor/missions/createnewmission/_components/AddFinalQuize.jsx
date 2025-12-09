'use client'
import React, { useState, useEffect, useContext } from "react";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Trophy,
  Send,
  Loader,
} from "lucide-react";
import { FiArrowLeft } from "react-icons/fi";
import { InstructorContext } from "../../../_components/context/InstructorContex";

const FinalQuizGenerator = () => {
  const { setLevel } = useContext(InstructorContext);
  const [formData, setFormData] = useState({
    title: "",
    passingScore: 70,
    durationMinutes: 30,
    isFinal: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

 
  const missionId = localStorage.getItem("missionId");

  const handleBack = () => {
    setLevel("AddLevel"); // Go back to Add Level view
  };


  console.log(missionId,'missionid sent');
  


  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value,
    }));
  };

  const generateFinalQuiz = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      // Simulate API call
      const apiUrl = `https://themutantschool-backend.onrender.com/api/mission-quiz/generate-final/${missionId}`;

      // In a real implementation, you would use fetch:
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("login-accessToken")}`,
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
       
        console.log(response,'response from final quiz');
        
      }
      
      const data = await response.json();
    
      console.log(data,'data from final q');
      
      alert(data.message);
      

      
    } catch (err) {
      setError(err.message || "Failed to generate quiz");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full  p-4 relative">
      {/* Back Arrow Button */}
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 text-white hover:text-[#BDE75D] transition-colors cursor-pointer bg-[#131313] hover:bg-[#1a1a1a] px-4 py-2 rounded-lg border border-[#333] hover:border-[#BDE75D] shadow-lg"
      >
        <FiArrowLeft className="text-xl" />
        <span className="font-medium">Back to Levels</span>
      </button>

      <div className="w-full mx-auto pt-16">
        <div className="  rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div
            style={{ marginBottom: "20px",padding:'10px' }}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8 text-white"
          >
            <div className="flex items-center gap-1 sm:gap-3 mb-2">
              <Trophy className="w-8 h-8" />
              <h1 className="text-md  sm:text-3xl font-bold">
                Final Mission Quiz Generator
              </h1>
            </div>
            

            <div className="  ">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 " />
                <span className="">
                  Boss Level Quiz
                </span>
              </div>
              <p className=" mt-1">
                This will be marked as the final boss quiz and will compile
                questions from all previous level quizzes.
              </p>
            </div>
            {/*
             */}
          </div>

          <div className="p-6">
            {/* Quiz Generation Form */}
            <div className="space-y-6 bg-black flex flex-col gap-4 text-white">
              <div>
                <label
                  style={{ marginBottom: "10px " }}
                  className="block text-[20px] font-[500] text-gray-500 mb-2"
                >
                  Quiz Title
                </label>
                <input
                  style={{ paddingLeft: "20px " }}
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Final Quiz for React Fundamentals"
                  className="w-full h-[73.66px] placeholder-[#7D7D7D] text-white font-[400] text-[19px] leading-[150%] outline-none  rounded-[12px] bg-[#1C1C1C] "
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    style={{ marginBottom: "10px " }}
                    className="block text-[20px] font-[500] text-gray-700 mb-2"
                  >
                    <Clock className="w-4 h-4 inline mr-1" />
                    Duration (minutes)
                  </label>
                  <input
                    style={{ paddingLeft: "20px" }}
                    type="number"
                    disabled
                    name="durationMinutes"
                    value={formData.durationMinutes}
                    onChange={handleInputChange}
                    min="15"
                    max="180"
                    className="w-full h-[73.66px] placeholder-[#7D7D7D] text-white font-[400] text-[19px] leading-[150%] outline-none  rounded-[12px] bg-[#1C1C1C] "
                    required
                  />
                </div>

                <div>
                  <label
                    style={{ marginBottom: "10px " }}
                    className="block text-[20px] font-[500] text-gray-700 mb-2"
                  >
                    <Trophy className="w-4 h-4 inline mr-1" />
                    Passing Score (%)
                  </label>
                  <input
                    style={{ paddingLeft: " 20px" }}
                    type="number"
                    name="passingScore"
                    disabled
                    value={formData.passingScore}
                    onChange={handleInputChange}
                    min="50"
                    max="100"
                    className="w-full h-[73.66px] placeholder-[#7D7D7D] text-white font-[400] text-[19px] leading-[150%] outline-none  rounded-[12px] bg-[#1C1C1C] "
                    required
                  />
                </div>
              </div>

              <button
                
                type="button"
                onClick={generateFinalQuiz}
                disabled={isLoading || !formData.title.trim()}
                
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600
                text-white h-[73.66px] py-3 px-4 rounded-lg font-medium
                hover:from-indigo-700 hover:to-purple-700 focus:outline-none
                focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed transition-all
                duration-200"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader className="w-5 h-5 animate-spin" />
                    Generating Final Quiz...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Send className="w-5 h-5" />
                    Generate Final Boss Quiz
                  </span>
                )}
              </button>
            </div>

          

          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalQuizGenerator;
