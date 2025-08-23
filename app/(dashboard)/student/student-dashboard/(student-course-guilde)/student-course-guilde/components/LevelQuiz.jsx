import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function LevelQuiz({ width = "100%" }) {
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !isAnswered && !quizCompleted) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered) {
      // Auto-move to next question when time runs out
      handleNextQuestion();
    }
  }, [timeLeft, isAnswered, quizCompleted]);

  // Reset timer when question changes
  useEffect(() => {
    setTimeLeft(20);
    setIsAnswered(false);
    setSelectedAnswer(null);
  }, [currentQuestionIndex]);

  useEffect(() => {
    const missionId = localStorage.getItem("currentMissionId");
    if (!missionId) return;

    const fetchMissionData = async () => {
      const token = localStorage.getItem("login-accessToken");

      try {
        const response = await axios.get(
          `https://themutantschool-backend.onrender.com/api/mission-level/mission/${missionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const allquiz = response.data.data;
        console.log("Fetched quiz Data new:----------", response.data.data);

        // Find the quiz data from the response
        const quizLevel = allquiz.find((level) => level.quiz);
        if (quizLevel) {
          setQuizData(quizLevel.quiz);
        }
      } catch (error) {
        console.log(
          "Error fetching missions:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMissionData();
  }, []);

  const handleAnswerSelect = (selectedIndex) => {
    if (isAnswered) return;

    setSelectedAnswer(selectedIndex);
    setIsAnswered(true);

    // Check if answer is correct
    const currentQuestion = quizData.questions[currentQuestionIndex];
    if (selectedIndex === currentQuestion.correctAnswerIndex) {
      setScore(score + 1);
    }

    // Immediately move to next question
    setTimeout(() => {
      handleNextQuestion();
    }, 500); // Small delay for better UX
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setTimeLeft(20);
    setIsAnswered(false);
    setScore(0);
    setQuizCompleted(false);
  };

  if (loading) {
    return (
      <div
        style={{ width, textAlign: "center", color: "white", padding: "2rem" }}
      >
        Loading quiz...
      </div>
    );
  }

  if (!quizData) {
    return (
      <div
        style={{ width, textAlign: "center", color: "white", padding: "2rem" }}
      >
        No quiz data available
      </div>
    );
  }

  if (quizCompleted) {
    const percentage = Math.round((score / quizData.questions.length) * 100);
    const passed = percentage >= quizData.passingScore;

    return (
      <div
        style={{
          width,
          backgroundColor: "#020202",
          color: "white",
          fontFamily: "sans-serif",
          padding: "2rem",
          borderRadius: "10px",
        }}
        className="flex h-[80vh]  w-full flex-col items-start justify-between"
      >
        <div>
          <p className="text-[#822A8D] font-[700] text-[50px] leading-[43px] ">
            Quiz Performance
          </p>
          <p className=" font-[700] text-[25px] leading-[43px] ">
            See how you scored, track your growth, and unlock new powers with
            every quiz.
          </p>
        </div>
        <div className="bg-[#131313] flexcenter gap-5 flex-col h-[301.3779px] w-full rounded-[70px] ">
          <h2 className="font-[500] text-[78px] leading-[43px] ">
            ({percentage}%)
          </h2>

          <p className="font-[400] text-[20px] leading-[33px] ">
            Here’s how you fared in your latest challenge. Remember, every wrong
            answer is just training for your next evolution
          </p>
        </div>

        <div className="flex  items-center justify-end mt-6 gap-4 w-full">
          <div
            style={{
              marginBottom: "2rem",
              color: passed ? "#4ade80" : "#ef4444",
            }}
          >
            prev
          </div>
          <button
            onClick={restartQuiz}
            style={{
              backgroundColor: "#3b82f6",
              color: "white",
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Restart Quiz
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];

  return (
    <div
      style={{
        width,
        backgroundColor: "#020202",
        color: "white",
        fontFamily: "sans-serif",
        padding: "2rem",
        borderRadius: "10px",
      }}
    >
      {/* Quiz Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        {/* time left */}
        <div
          style={{
            color: timeLeft <= 5 ? "#ef4444" : "#840B94",
            // color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "50px",
            fontSize: "1.2rem",
            fontWeight: "bold",
            minWidth: "80px",
            textAlign: "center",
            transition: "background-color 0.3s ease",
          }}
        >
          {timeLeft}s
        </div>
        <div style={{ fontSize: "0.9rem", color: "#840B94" }}>
          {currentQuestionIndex + 1} / {quizData.questions.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          width: "100%",
          height: "4px",
          backgroundColor: "#333",
          borderRadius: "2px",
          marginBottom: "2rem",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${
              ((currentQuestionIndex + 1) / quizData.questions.length) * 100
            }%`,
            height: "100%",
            backgroundColor: "#840B94",
            transition: "width 0.3s ease",
          }}
        />
      </div>

      {/* Question */}
      <h3
        style={{
          fontWeight: "bold",
          fontSize: "1.3rem",
          marginBottom: "1.5rem",
          textAlign: "center",
          lineHeight: "1.4",
        }}
      >
        {currentQuestionIndex + 1}.{currentQuestion.questionText}
      </h3>

      {/* Options */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {currentQuestion.options.map((option, index) => (
          <div
            key={index}
            onClick={() => handleAnswerSelect(index)}
            style={{
              backgroundColor: selectedAnswer === index ? "#840B94" : "#111",
              padding: "1rem",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {option}
          </div>
        ))}
      </div>

      {/* Score Display */}
      <div
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          fontSize: "0.9rem",
          color: "#888",
        }}
      >
        Score: {score}/{currentQuestionIndex + (isAnswered ? 1 : 0)}
      </div>
    </div>
  );
}
