"use client";
import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import Image from "next/image";

export default function FinalQuizComponent({
  quizData: initialQuizData,
  onQuizComplete,
  onReview,
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showPerformanceDetails, setShowPerformanceDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quiz state management
  const [quizDuration, setQuizDuration] = useState(0);
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [updateError, setUpdateError] = useState(null);

  // Store user answers
  const [userAnswers, setUserAnswers] = useState([]);

  // Initialize answers array when quiz data is loaded
  useEffect(() => {
    if (initialQuizData && initialQuizData.questions) {
      setUserAnswers(new Array(initialQuizData.questions.length).fill(null));
    }
  }, [initialQuizData]);

  // Start quiz timer
  useEffect(() => {
    if (!quizStartTime && initialQuizData) {
      setQuizStartTime(Date.now());
    }
  }, [initialQuizData, quizStartTime]);

  // Timer for each question
  useEffect(() => {
    if (!isAnswered && !quizCompleted && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isAnswered, quizCompleted]);

  // Quiz duration tracker
  useEffect(() => {
    if (quizStartTime && !quizCompleted) {
      const durationTimer = setInterval(() => {
        setQuizDuration(Math.floor((Date.now() - quizStartTime) / 1000));
      }, 1000);
      return () => clearInterval(durationTimer);
    }
  }, [quizStartTime, quizCompleted]);

  const handleAnswerSelect = (optionIndex) => {
    if (isAnswered) return;

    // Save the answer
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestionIndex] = optionIndex;
    setUserAnswers(newUserAnswers);
    setSelectedAnswer(optionIndex);
    setIsAnswered(true);

    // Automatically move to next question after a short delay
    setTimeout(() => {
      if (currentQuestionIndex < initialQuizData.questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setTimeLeft(20);
      } else {
        // Quiz completed
        handleQuizSubmit();
      }
    }, 500); // 500ms delay to show the selection
  };

  const handleQuizSubmit = async () => {
    setQuizCompleted(true);
    setIsSubmitting(true);

    // Calculate score
    let correctAnswers = 0;
    initialQuizData.questions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const totalQuestions = initialQuizData.questions.length;
    const scorePercentage = (correctAnswers / totalQuestions) * 100;
    const passed = scorePercentage >= (initialQuizData.passingScore || 70);

    const result = {
      score: correctAnswers,
      total: totalQuestions,
      percentage: scorePercentage.toFixed(2),
      passed,
      duration: formatDuration(quizDuration),
    };

    // Submit to backend
    try {
      const token = localStorage.getItem("login-accessToken");

      // Format answers with selectedOption (the actual text) instead of index
      const answers = initialQuizData.questions.map((question, index) => {
        const selectedIndex = userAnswers[index];
        const selectedOptionText =
          selectedIndex !== null && selectedIndex !== undefined
            ? question.options[selectedIndex]
            : "";

        return {
          questionId: question._id,
          selectedOption: selectedOptionText,
        };
      });

      console.log("📤 Submitting final quiz:", {
        quizId: initialQuizData._id,
        answersCount: answers.length,
        answers: answers,
      });

      const response = await axios.post(
        `https://themutantschool-backend.onrender.com/api/mission-submit-quiz/submit-final-quiz/${initialQuizData._id}`,
        { answers },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Final quiz submitted successfully:", response.data);

      // Only set result after backend confirms success
      setQuizResult(result);
      setIsSubmitting(false);

      // Call parent callback ONLY if submission was successful
      if (onQuizComplete) {
        console.log("✅ Calling parent callback - submission was successful");
        onQuizComplete(result);
      }
    } catch (error) {
      console.error("❌ Error submitting final quiz:", error);
      console.error("❌ Error response data:", error.response?.data);

      // Extract the error message
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to submit quiz";

      console.error("❌ Setting error message:", errorMessage);
      setUpdateError(errorMessage);
      setIsSubmitting(false);

      // Set result even on error so user can see their score
      setQuizResult(result);

      // DON'T call parent callback when there's an error
      console.log("❌ Skipping parent callback due to submission error");
      return; // Exit early
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  if (!initialQuizData) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="large" color="mutant" />
      </div>
    );
  }

  // Show loading state while submitting to backend
  if (isSubmitting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-[#131313] rounded-lg p-8">
        <LoadingSpinner size="xlarge" color="mutant" />
        <p className="text-white text-xl mt-6 mb-2">
          Submitting your answers...
        </p>
        <p className="text-gray-400 text-sm">
          Please wait while we process your results
        </p>
      </div>
    );
  }

  if (quizCompleted && quizResult) {
    return (
      <div className="bg-[#131313] rounded-lg p-8">
        <div className="text-center">
          <h2 className="text-[#822A8D] font-bold text-3xl mb-4">
            {quizResult.passed ? "🏆 Boss Defeated!" : "💀 Boss Fight Failed"}
          </h2>
          <div
            className={`text-6xl font-bold mb-4 ${
              quizResult.passed ? "text-green-500" : "text-red-500"
            }`}
          >
            {quizResult.percentage}%
          </div>
          <p className="text-gray-300 text-lg mb-6">
            {quizResult.passed
              ? "Congratulations! You've defeated the Final Boss and completed this mission!"
              : "The boss proved too strong! Train more and return to fight again."}
          </p>
          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-gray-400">
              <span>Score:</span>
              <span className="text-white">
                {quizResult.score}/{quizResult.total}
              </span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Passing Score:</span>
              <span className="text-white">
                {initialQuizData.passingScore}%
              </span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Duration:</span>
              <span className="text-white">{quizResult.duration}</span>
            </div>
          </div>

          {/* CRITICAL: Always show error message if it exists */}
          {updateError && updateError.trim() !== "" && (
            <div className="mb-6 p-6 bg-gradient-to-r from-red-900/60 to-red-800/60 border-4 border-red-500 rounded-2xl shadow-2xl animate-pulse">
              <div className="flex items-start gap-4">
                <div className="text-red-300 text-5xl animate-bounce">⚠️</div>
                <div className="flex-1">
                  <div className="bg-red-950/50 p-4 rounded-lg border-l-4 border-red-400">
                    <p className="text-red-100 text-lg font-semibold leading-relaxed">
                      {updateError}
                    </p>
                  </div>
                  <p className="text-red-300 text-sm mt-3 italic">
                    ℹ️ Your quiz was completed locally, but could not be
                    submitted to the server.
                  </p>
                </div>
              </div>
            </div>
          )}

          {onReview && (
            <button
              onClick={onReview}
              className="bg-[#840B94] hover:bg-[#6a0876] text-white font-bold px-8 py-3 rounded-lg transition-colors"
            >
              Go Back to Levels
            </button>
          )}
        </div>
      </div>
    );
  }

  const currentQuestion = initialQuizData.questions[currentQuestionIndex];
  const progress =
    ((currentQuestionIndex + 1) / initialQuizData.questions.length) * 100;

  return (
    <div className="bg-[#131313] rounded-lg p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold text-[#840B94]">
            ⚔️ Final Boss Fight
          </h1>
          <div className="text-white">
            <span className="text-[#840B94] font-bold">
              {formatDuration(quizDuration)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
          <div
            className="bg-[#840B94] h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-gray-400 text-sm">
          Question {currentQuestionIndex + 1} of{" "}
          {initialQuizData.questions.length}
        </p>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h3 className="text-xl text-white mb-6">
          {currentQuestion.questionText}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options?.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={isAnswered}
              className={`w-full text-left p-4 rounded-lg transition-all flex items-center justify-between focus:outline-none ${
                selectedAnswer === index
                  ? "bg-[#840B94]/30"
                  : "bg-[#1a1a1a] hover:bg-[#252525]"
              } ${
                isAnswered ? "cursor-not-allowed opacity-60" : "cursor-pointer"
              }`}
            >
              <span className="text-white">{option}</span>
              {selectedAnswer === index && (
                <span className="text-[#840B94] text-2xl ml-4">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Status message */}
      <div className="flex justify-center items-center">
        <div className="text-gray-400 text-sm italic">
          {isAnswered
            ? "Moving to next question..."
            : "Select an answer to continue"}
        </div>
      </div>
    </div>
  );
}
