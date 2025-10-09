import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function LevelQuiz({
  width = "100%",
  onQuizComplete,
  onReview,
}) {
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPerformanceDetails, setShowPerformanceDetails] = useState(false);
  const [showAnswerReview, setShowAnswerReview] = useState(false);
  const [resumedFromSaved, setResumedFromSaved] = useState(false);
  const [quizAlreadyTaken, setQuizAlreadyTaken] = useState(false);
  const [previousQuizResult, setPreviousQuizResult] = useState(null);
  console.log(quizData, "jjdnfnf");

  // Quiz state management
  const [quizDuration, setQuizDuration] = useState(0);
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [updateError, setUpdateError] = useState(null);

  // Store user answers
  const [userAnswers, setUserAnswers] = useState([]);

  // Load saved quiz state from localStorage on component mount
  useEffect(() => {
    const savedAlreadyTaken = localStorage.getItem("quizAlreadyTaken");
    if (savedAlreadyTaken === "true") {
      if (onQuizComplete) {
        onQuizComplete();
        return;
      }
    }

    const savedQuizState = localStorage.getItem("quizState");
    if (savedQuizState) {
      try {
        const parsedState = JSON.parse(savedQuizState);
        if (parsedState.quizStartTime && !parsedState.quizCompleted) {
          setQuizStartTime(parsedState.quizStartTime);
          setCurrentQuestionIndex(parsedState.currentQuestionIndex || 0);
          setUserAnswers(parsedState.userAnswers || []);
          setQuizDuration(parsedState.quizDuration || 0);
          setIsAnswered(parsedState.isAnswered || false);
          setSelectedAnswer(parsedState.selectedAnswer);
          setTimeLeft(parsedState.timeLeft || 20);
          setResumedFromSaved(true);

          // Hide the resume notification after 3 seconds
          setTimeout(() => {
            setResumedFromSaved(false);
          }, 3000);
        }
      } catch (error) {
        console.error("Error loading saved quiz state:", error);
        localStorage.removeItem("quizState");
      }
    }
  }, [onQuizComplete]);

  // Save quiz state to localStorage whenever it changes
  useEffect(() => {
    if (quizStartTime && !quizCompleted) {
      const quizState = {
        quizStartTime,
        currentQuestionIndex,
        userAnswers,
        quizDuration,
        isAnswered,
        selectedAnswer,
        timeLeft,
        quizCompleted: false,
      };
      localStorage.setItem("quizState", JSON.stringify(quizState));
    } else if (quizCompleted) {
      // Clear saved state when quiz is completed
      localStorage.removeItem("quizState");
    }
  }, [
    quizStartTime,
    currentQuestionIndex,
    userAnswers,
    quizDuration,
    isAnswered,
    selectedAnswer,
    timeLeft,
    quizCompleted,
  ]);

  // Quiz completion handler with proper answer storage
  const handleQuizComplete = useCallback(
    async (finalAnswers) => {
      console.log(
        `📊 QUIZ COMPLETE - Starting quiz completion with answers:`,
        finalAnswers
      );
      console.log(`📊 QUIZ COMPLETE - Quiz information:`, {
        quizId: quizData?._id,
        quizTitle: quizData?.title,
        levelId: quizData?.level,
        totalQuestions: quizData?.questions?.length,
        answeredQuestions: finalAnswers.filter(
          (a) => a !== null && a !== undefined
        ).length,
        skippedQuestions: finalAnswers.filter(
          (a) => a === null || a === undefined
        ).length,
        timestamp: new Date().toISOString(),
      });

      const finalDuration = Math.floor((Date.now() - quizStartTime) / 1000);
      setQuizDuration(finalDuration);
      setQuizCompleted(true);

      try {
        setLoading(true);
        setUpdateError(null);

        console.log("Submitting quiz to API...");
        const apiResponse = await submitQuizAnswers(finalAnswers);

        console.log("API Response received:", apiResponse);

        // Get score and percentage from API response
        const apiScore = apiResponse.score || 0;
        const apiTotal = apiResponse.total || quizData.questions.length;
        const percentage = Math.round((apiScore / apiTotal) * 100);

        console.log("📊 QUIZ RESULTS - Processing API response:", {
          score: apiScore,
          total: apiTotal,
          percentage: percentage,
          passed: apiResponse.passed,
          duration: finalDuration,
          timestamp: new Date().toISOString(),
        });

        // Log detailed question/answer results if available
        if (apiResponse.data && apiResponse.data.answers) {
          console.log("📊 QUIZ RESULTS - Question-by-question details:");
          apiResponse.data.answers.forEach((answer, idx) => {
            console.log(
              `Question ${idx + 1}: ${
                answer.isCorrect ? "✅ CORRECT" : "❌ WRONG"
              } - Selected: "${answer.selectedOption}" ${
                !answer.isCorrect ? `| Correct: "${answer.correctOption}"` : ""
              }`
            );
          });
        }

        setQuizResult({
          score: apiScore,
          total: apiTotal,
          percentage,
          duration: finalDuration,
          apiResponse,
          submittedSuccessfully: true,
        });

        console.log(
          "📊 QUIZ RESULTS - Quiz submitted successfully and results processed"
        );

        // Call the completion callback to advance to next stage
        if (onQuizComplete) {
          onQuizComplete();
        }
      } catch (error) {
        console.error("Failed to submit quiz to API:", error);

        // Extract the specific error message from the backend response
        const errorMessage =
          error.response?.data?.message ||
          "Quiz submission failed. Please try again.";
        setUpdateError(errorMessage);

        // Don't calculate local score, just show error
        setQuizResult({
          score: 0,
          total: quizData.questions.length,
          percentage: 0,
          duration: finalDuration,
          error: errorMessage, // Use the specific backend message here
          submittedSuccessfully: false,
        });
      } finally {
        setLoading(false);
      }
    },
    [quizData, quizStartTime]
  );

  // Quiz duration timer
  useEffect(() => {
    if (quizStartTime && !quizCompleted) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - quizStartTime) / 1000);
        setQuizDuration(elapsed);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [quizStartTime, quizCompleted]);

  // Question timer effect
  useEffect(() => {
    if (timeLeft > 0 && !isAnswered && !quizCompleted) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered) {
      // Add a guard to ensure quizData is available
      if (quizData) {
        handleNextQuestion();
      }
    }
  }, [timeLeft, isAnswered, quizCompleted, quizData]);

  // Reset timer when question changes
  useEffect(() => {
    if (quizData) {
      const questionTimeLimit = quizData.durationMinutes
        ? Math.floor(
            (quizData.durationMinutes * 60) / quizData.questions.length
          )
        : 20;
      setTimeLeft(questionTimeLimit);
    }
    setIsAnswered(false);
    setSelectedAnswer(null);
  }, [currentQuestionIndex, quizData]);

  // Fetch quiz data
  useEffect(() => {
    const missionId = localStorage.getItem("currentMissionId");
    if (!missionId) return;

    const fetchMissionData = async () => {
      const token = localStorage.getItem("login-accessToken");
      console.log(
        `🔍 QUIZ FETCH: Starting quiz data fetch for mission ID: ${missionId}`
      );

      try {
        console.log(
          `🔍 QUIZ FETCH: Sending request to API with token: ${
            token ? `${token.substring(0, 10)}...` : "missing"
          }`
        );
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
        console.log("🔍 QUIZ FETCH: Received quiz data:", {
          status: response.status,
          dataLength: allquiz?.length || 0,
          hasData: !!allquiz,
          timestamp: new Date().toISOString(),
        });

        const quizLevel = allquiz.find((level) => level.quiz);
        if (quizLevel) {
          const quiz = quizLevel.quiz;
          console.log("🔍 QUIZ FETCH: Found quiz in level:", {
            levelId: quizLevel._id,
            quizId: quiz._id,
            quizTitle: quiz.title,
            questionCount: quiz.questions?.length || 0,
            passingScore: quiz.passingScore,
          });
          setQuizData({ ...quiz, level: quizLevel._id });
          setUserAnswers(new Array(quiz.questions.length).fill(null));
        } else {
          console.log("🔍 QUIZ FETCH: No quiz found in any of the levels", {
            levelsChecked: allquiz?.length || 0,
            levels: allquiz?.map((level) => level._id) || [],
          });
        }
      } catch (error) {
        console.log(
          "🔍 QUIZ FETCH ERROR:",
          error.response?.data || error.message
        );
        console.log("🔍 QUIZ FETCH ERROR DETAILS:", {
          status: error.response?.status,
          errorMessage: error.message,
          url: `https://themutantschool-backend.onrender.com/api/mission-level/mission/${missionId}`,
          timestamp: new Date().toISOString(),
        });
        setUpdateError("Failed to load quiz data");
      } finally {
        setLoading(false);
        console.log("🔍 QUIZ FETCH: Completed fetch operation");
      }
    };

    fetchMissionData();
  }, []);

  // Submit quiz answers to API
  const submitQuizAnswers = async (chanswers) => {
    const token = localStorage.getItem("login-accessToken");
    const levelId = quizData.level;
    const quizId = quizData._id;
    const missionId = localStorage.getItem("currentMissionId");

    if (!token || !levelId || !quizId || !missionId) {
      throw new Error(
        "Missing authentication token, level ID, quiz ID, or mission ID"
      );
    }

    try {
      // Format answers for API - include ALL questions, even unanswered ones
      const formattedAnswers = [];

      chanswers.forEach((answerIndex, questionIndex) => {
        const question = quizData.questions[questionIndex];
        const questionId = question._id;

        // Only include questions that were actually answered
        if (answerIndex !== null && answerIndex !== undefined) {
          // Get the actual answer text from the selected option
          const selectedAnswerText = question.options[answerIndex];

          formattedAnswers.push({
            questionId: questionId,
            selectedOption: selectedAnswerText,
          });

          console.log(
            `Question ${
              questionIndex + 1
            }: ID=${questionId}, Selected Option: "${selectedAnswerText}"`
          );
        } else {
          console.log(
            `Question ${
              questionIndex + 1
            }: ID=${questionId}, SKIPPED (no answer selected)`
          );
        }
      });

      console.log("📝 QUIZ SUBMIT - Processing user answers:", chanswers);
      console.log(
        "📝 QUIZ SUBMIT - Questions total count:",
        quizData.questions.length
      );
      console.log("📝 QUIZ SUBMIT - Formatted answers:", formattedAnswers);

      console.log("📝 QUIZ SUBMIT - Preparing submission:", {
        levelId,
        quizId,
        missionId,
        timestamp: new Date().toISOString(),
        totalQuestions: quizData.questions.length,
        answeredQuestions: formattedAnswers.length,
        unansweredQuestions: chanswers.filter(
          (a) => a === null || a === undefined
        ).length,
      });

      // Log the exact payload being sent
      const answers = { answers: formattedAnswers };
      console.log(
        "📝 QUIZ SUBMIT - Full payload data:",
        // JSON.stringify(answers, null, 2)
        answers
      );

      console.log(
        "📝 QUIZ SUBMIT - Sending API request to:",
        `https://themutantschool-backend.onrender.com/api/mission-submit-quiz/submit-quiz/${quizId}/level/${levelId}`
      );

      const response = await axios.post(
        `https://themutantschool-backend.onrender.com/api/mission-submit-quiz/submit-quiz/${quizId}/level/${levelId}`,

        answers,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // console.log("📝 QUIZ SUBMIT - Received response:", {
      //   status: response.status,
      //   statusText: response.statusText,
      //   timestamp: new Date().toISOString(),
      //   hasData: !!response.data,
      //   responseData: response.data,
      // });

      // Detailed logging of score and results
      console.log(
        "📊 QUIZ RESULTS - Full response data:",
        JSON.stringify(
          "response.data vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv",
          response
        )
      );

      // console.log('response.data00000000000000kkkkkkkkkkkkkkkkkkkkkkkk',response, "response.data00000000000000");

      // Log specific score information if available
      // if (response.data) {
      //   console.log("📊 QUIZ RESULTS - Score details:", {
      //     score: response.data.score,
      //     totalQuestions: response.data.total,
      //     percentage:
      //       response.data.percentage ||
      //       Math.round((response.data.score / response.data.total) * 100),
      //     passed: response.data.passed,
      //     timestamp: new Date().toISOString(),
      //   });

      //   // If there's detailed answer data, log that too
      //   if (response.data.data && response.data.data.answers) {
      //     console.log(
      //       "📊 QUIZ RESULTS - Answer breakdown:",
      //       response.data.data.answers.map((answer, index) => ({
      //         question: index + 1,
      //         correct: answer.isCorrect,
      //         selected: answer.selectedOption,
      //         correctOption: answer.correctOption,
      //       }))
      //     );

      //     // Calculate correct vs incorrect counts
      //     const correctCount = response.data.data.answers.filter(
      //       (a) => a.isCorrect
      //     ).length;
      //     const incorrectCount = response.data.data.answers.filter(
      //       (a) => !a.isCorrect
      //     ).length;

      //     console.log("📊 QUIZ RESULTS - Summary:", {
      //       correctAnswers: correctCount,
      //       incorrectAnswers: incorrectCount,
      //       accuracy: `${Math.round(
      //         (correctCount / response.data.data.answers.length) * 100
      //       )}%`,
      //     });
      //   }
      // }

      // Handle cases where the quiz has already been taken
      // if (response.data.status === "already_taken") {
      //   console.log("Quiz already taken, advancing to completion screen.");
      //   localStorage.setItem("quizAlreadyTaken", "true"); // Save state
      //   if (onQuizComplete) {
      //     onQuizComplete();
      //   }
      //   return response.data; // Stop further processing
      // }

      return response.data;
    } catch (error) {
      console.log("📝 QUIZ SUBMIT - ERROR:", error.message);

      // Log more detailed error information
      if (error.response) {
        // console.log("📝 QUIZ SUBMIT - ERROR DETAILS:", {
        //   status: error.response.status,
        //   statusText: error.response.statusText,
        //   data: error.response.data,
        //   endpoint: `https://themutantschool-backend.onrender.com/api/mission-submit-quiz/submit-quiz/${missionId}/level/${levelId}`,
        //   timestamp: new Date().toISOString(),
        // });
        console.log("📝 QUIZ SUBMIT - ERROR HEADERS:", error);

        // Check if quiz was already taken (404 with "Quiz not found" message)
        if (
          error.response.status === 404 &&
          error.response.data?.message === "Quiz not found"
        ) {
          console.log("Quiz already taken - showing previous results");
          setQuizAlreadyTaken(true);
          setQuizCompleted(true);
          setLoading(false);
          setUpdateError(response.data.message);
          // Save the "already taken" state to localStorage
          // localStorage.setItem("quizAlreadyTaken", "true");

          // Create a mock result to show the user they've already taken the quiz
          // setPreviousQuizResult({
          //   message: "You have already completed this quiz!",
          //   alreadyTaken: true,
          //   canRetake: true,
          // });

          return {
            status: "already_taken",
            message: "Quiz already completed",
            data: {
              alreadyTaken: true,
              canRetake: true,
            },
          };
        }
      } else if (error.request) {
        console.log("Error request:", error.request);
      } else {
        console.log("Error message:", error.message);
      }

      throw error;
    }
  };

  const handleAnswerSelect = (selectedIndex) => {
    if (isAnswered) return;

    console.log(
      `DEBUG - Answer selected for question ${currentQuestionIndex}: ${selectedIndex}`
    );

    setSelectedAnswer(selectedIndex);
    setIsAnswered(true);

    // Store user's answer immediately with functional update
    setUserAnswers((prevAnswers) => {
      const newUserAnswers = [...prevAnswers];
      newUserAnswers[currentQuestionIndex] = selectedIndex;

      console.log(
        `DEBUG - Updated userAnswers for question ${currentQuestionIndex}:`,
        newUserAnswers
      );

      // Move to next question after storing the answer
      setTimeout(() => {
        handleNextQuestion(newUserAnswers);
      }, 500);

      return newUserAnswers;
    });
  };

  const handleNextQuestion = (currentAnswers = null) => {
    // Add a guard to ensure quizData exists before proceeding
    if (!quizData || !quizData.questions) {
      console.error("handleNextQuestion called without quizData.");
      return;
    }

    // Use the passed answers or fall back to current state
    const answersToUse = currentAnswers || userAnswers;

    console.log(
      `DEBUG - Moving from question ${currentQuestionIndex} to next. Total questions: ${quizData.questions.length}`
    );
    console.log(`DEBUG - Current answers being used:`, answersToUse);

    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      console.log(`DEBUG - Moving to question ${currentQuestionIndex + 1}`);
    } else {
      console.log(`DEBUG - Quiz completed. Final answers:`, answersToUse);
      handleQuizComplete(answersToUse);
    }
  };

  const startQuiz = () => {
    // Clear any saved state when starting a new quiz
    localStorage.removeItem("quizState");

    setQuizStartTime(Date.now());
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setQuizCompleted(false);
    setQuizResult(null);
    setUpdateError(null);
    setUserAnswers(new Array(quizData.questions.length).fill(null));

    // Set initial timer
    const questionTimeLimit = quizData.durationMinutes
      ? Math.floor((quizData.durationMinutes * 60) / quizData.questions.length)
      : 20;
    setTimeLeft(questionTimeLimit);
  };

  const restartQuiz = () => {
    startQuiz();
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div
        style={{ width }}
        className="flex items-center justify-center h-[70vh]"
      >
        <LoadingSpinner size="large" color="mutant" />
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

  // Quiz already taken screen
  if (quizAlreadyTaken && previousQuizResult) {
    return (
      <div
        style={{
          backgroundColor: "#020202",
          color: "white",
          fontFamily: "sans-serif",
          padding: "2rem",
          borderRadius: "10px",
          textAlign: "center",
        }}
      >
        <div className="flex flex-col gap-6 h-[70vh] justify-center items-center">
          <div className="text-6xl mb-4">🎯</div>

          <h2 className="text-[#822A8D] font-[700] text-[30px] sm:text-[40px] leading-[43px] mb-4">
            {previousQuizResult.message}
          </h2>

          <div className="flex gap-4">
            <button
              onClick={() => {
                // Navigate back or close quiz
                window.history.back();
              }}
              style={{ padding: "10px" }}
              className="bg-gray-600 hover:bg-gray-700 px-8 py-3 rounded-lg font-bold text-lg transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz start screen
  if (!quizStartTime && !quizCompleted) {
    // Use a fixed value for max attempts and get attempts taken from backend
    const maxAttempts = 3;
    const attemptsTaken = quizData.maxAttempts || 0; // The backend's 'maxAttempts' is the user's attempt count
    const attemptsLeft = maxAttempts - attemptsTaken;

    return (
      <div
        style={{
          backgroundColor: "#020202",
          color: "white",
          fontFamily: "sans-serif",
          padding: "2rem",
          borderRadius: "10px",
          // border: "1px solid red",
        }}
      >
        <div className="flex flex-col gap-4 h-[70vh] ">
          <h2 className="text-[#822A8D] font-[700] text-[30px] sm:text-[40px] leading-[43px] mb-4">
            {quizData.title}
          </h2>

          <div
            style={{ padding: "20px" }}
            className="bg-[#131313] p-6 rounded-lg mb-6"
          >
            <div className="flex flex-col gap-4 text-left">
              <div className="flex justify-between">
                <span>Duration:</span>
                <span>{quizData.durationMinutes || 15} minutes</span>
              </div>
              <div className="flex justify-between">
                <span>Questions:</span>
                <span>{quizData.questions.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Passing Score:</span>
                <span>{quizData.passingScore}%</span>
              </div>
              <div className="flex justify-between">
                <span>Attempts Allowed:</span>
                <span>{maxAttempts}</span>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-gray-400 mb-6">
            <p>
              Note: You have a maximum of {maxAttempts} attempts to pass this
              quiz.
            </p>
          </div>

          {updateError && (
            <div className="bg-red-900 text-white p-3 rounded mb-4">
              {updateError}
            </div>
          )}

          <button
            style={{ padding: "10px" }}
            onClick={startQuiz}
            className={`px-8 py-3 rounded-lg font-bold text-lg transition-colors ${
              attemptsLeft > 0
                ? "bg-[#840B94] hover:bg-[#6a0876]"
                : "bg-gray-500 cursor-not-allowed"
            }`}
            disabled={attemptsLeft <= 0}
          >
            {attemptsLeft > 0 ? "Start Quiz" : "No Attempts Left"}
          </button>
        </div>
      </div>
    );
  }

  // Results Screen
  if (quizCompleted) {
    const resultData = quizResult || {};
    const percentage = resultData.percentage || 0;
    const displayScore = resultData.score || 0;
    const totalQuestions = resultData.total || quizData.questions.length;

    // Determine pass/fail status, with a fallback
    const hasPassed =
      resultData.apiResponse?.passed !== undefined
        ? resultData.apiResponse.passed
        : percentage >= (quizData.passingScore || 70);

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
        className="flex h-[80vh] w-full flex-col  gap-8 "
      >
        <div>
          <p className="text-[#822A8D] font-[700] sm:text-[20px] leading-[21px]">
            Quiz Performance
          </p>
          <p className="font-[700] sm:text-[15px] leading-[16px]">
            See how you scored, track your growth, and unlock new powers with
            every quiz.
          </p>
        </div>

        <div
          style={{ padding: "10px", margin: "auto" }}
          className="bg-[#131313] items-center flex max-w-[600px] items-center gap-5 flex-col justify-center h-fit w-full rounded-[10px] xl:rounded-[20px] sm:rounded-[40px]"
        >
          <div className="flex flex-col h-[80%] items-center justify-center gap-3">
            <div className="flex items-center gap-4">
              <h2
                className={`font-[500] sm:text-[48px] leading-[43px] ${
                  hasPassed ? "text-green-400" : "text-red-400"
                }`}
              >
                {hasPassed ? `${percentage}%` : ""}
              </h2>
              {resultData.apiResponse && (
                <div
                  className={`text-4xl ${
                    hasPassed ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {hasPassed ? "🎉" : "💪"}
                </div>
              )}
            </div>
            <p className="font-[400] sm:text-[20px] text-center leading-[33px]">
              {hasPassed
                ? "🎉 Congratulations! You've successfully completed this challenge and evolved your skills!"
                : "💪 Here's how you fared in your latest challenge. Remember, every wrong answer is just training for your next evolution"}
            </p>

            {resultData.apiResponse && (
              <div className="text-green-400 text-sm">
                ✓ Results verified by server
              </div>
            )}
            {resultData.error && (
              <div className="text-red-400 text-sm text-center">
                ⚠️ {resultData.message}
              </div>
            )}
          </div>

          {hasPassed && (
            <div>
              <div className="text-[#646464] font-[400] text-[14px] sm:text-[19px] leading-[43px]">
                <button
                  onClick={() =>
                    setShowPerformanceDetails(!showPerformanceDetails)
                  }
                  className="flex items-center gap-2 cursor-pointer w-[300px] hover:text-white transition-colors"
                >
                  Performance Details
                  <span
                    className={`transform transition-transform ${
                      showPerformanceDetails ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {showPerformanceDetails && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between w-[300px]">
                      <p>Attempted Questions</p>
                      <p>
                        {totalQuestions}/{totalQuestions}
                      </p>
                    </div>
                    <div className="flex items-center justify-between w-[300px]">
                      <p>Correct Answers</p>
                      <p>
                        {displayScore}/{totalQuestions}
                      </p>
                    </div>
                    <div className="flex items-center justify-between w-[300px]">
                      <p>Duration</p>
                      <p>{formatDuration(quizDuration)}</p>
                    </div>
                    <div className="flex items-center justify-between w-[300px]">
                      <p>Passing Score</p>
                      <p>{quizData.passingScore}%</p>
                    </div>
                    {resultData.apiResponse && (
                      <>
                        <div className="flex items-center justify-between w-[300px]">
                          <p>Server Status</p>
                          <p className="text-green-400">
                            {resultData.apiResponse.status
                              ? resultData.apiResponse.status.toUpperCase()
                              : "COMPLETED"}
                          </p>
                        </div>
                        <div className="flex items-center justify-between w-[300px]">
                          <p>Quiz Result</p>
                          <p
                            className={
                              hasPassed ? "text-green-400" : "text-red-400"
                            }
                          >
                            {hasPassed ? "✅ PASSED" : "❌ FAILED"}
                          </p>
                        </div>
                        <div className="flex items-center justify-between w-[300px]">
                          <p>Attempt ID</p>
                          <p className="text-xs text-gray-400">
                            {resultData.apiResponse.attemptId?.slice(-8) ||
                              "N/A"}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Answer Review Section */}
        {resultData.apiResponse && resultData.apiResponse.data && (
          <div className="w-full max-w-[800px] mx-auto">
            <button
              onClick={() => setShowAnswerReview(!showAnswerReview)}
              className="flex items-center gap-2 cursor-pointer w-full justify-center text-[#646464] hover:text-white transition-colors py-4 border-t border-gray-700"
            >
              <span className="font-[400] text-[14px] sm:text-[19px]">
                {showAnswerReview ? "Hide" : "Show"} Answer Review
              </span>
              <span
                className={`transform transition-transform ${
                  showAnswerReview ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>

            {showAnswerReview && (
              <div className="mt-4 space-y-4 max-h-[400px] overflow-y-auto">
                {resultData.apiResponse.data.answers.map((answer, index) => (
                  <div
                    key={answer.questionId}
                    className={`p-4 rounded-lg border-l-4 ${
                      answer.isCorrect
                        ? "bg-green-900/20 border-green-500"
                        : "bg-red-900/20 border-red-500"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-white">
                        Question {index + 1}
                      </h4>
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          answer.isCorrect
                            ? "bg-green-600 text-white"
                            : "bg-red-600 text-white"
                        }`}
                      >
                        {answer.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-400">Your Answer:</span>
                        <span
                          className={`ml-2 ${
                            answer.isCorrect ? "text-green-300" : "text-red-300"
                          }`}
                        >
                          {answer.selectedOption}
                        </span>
                      </div>

                      {!answer.isCorrect && (
                        <div>
                          <span className="text-gray-400">Correct Answer:</span>
                          <span className="ml-2 text-green-300">
                            {answer.correctOption}
                          </span>
                        </div>
                      )}

                      {answer.explanation && (
                        <div>
                          <span className="text-gray-400">Explanation:</span>
                          <span className="ml-2 text-gray-300">
                            {answer.explanation}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {updateError && (
          <div className="bg-red-900 text-white p-3 rounded w-full text-center">
            {updateError}
          </div>
        )}

        <div className="flex items-center justify-end mt-6 gap-4 w-full">
          {hasPassed ? (
            <button
              style={{ padding: "16px 8px" }}
              onClick={() => {
                if (onQuizComplete) {
                  onQuizComplete();
                }
              }}
              className="bg-[#840B94] hover:bg-[#6a0876] font-[700] sm:text-[31px] sm:leading-[100%] rounded-[10px] px-6 py-3 transition-colors"
              disabled={loading}
            >
              {loading ? "Processing..." : "Continue"}
            </button>
          ) : (
            <button
              onClick={onReview}
              className="bg-[#604196] cursor-pointer font-[700] sm:text-[18px] sm:leading-[100%] rounded-[10px] px-6 py-3 transition-colors"
              style={{ padding: "16px 8px" }}
            >
              Review Capsules
            </button>
          )}
        </div>
      </div>
    );
  }

  // Quiz Question UI
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
        position: "relative",
      }}
    >
      {/* Resume notification */}
      {resumedFromSaved && (
        <div className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-10 animate-pulse">
          🔄 Quiz resumed from where you left off
        </div>
      )}
      {/* Quiz Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        {/* Time left */}
        <div
          style={{
            color: timeLeft <= 5 ? "#ef4444" : "#840B94",
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

        <div className="text-center">
          <div style={{ fontSize: "0.9rem", color: "#840B94" }}>
            {currentQuestionIndex + 1} / {quizData.questions.length}
          </div>
          <div style={{ fontSize: "0.8rem", color: "#666" }}>
            Duration: {formatDuration(quizDuration)}
          </div>
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
        {currentQuestionIndex + 1}. {currentQuestion.questionText}
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
    </div>
  );
}
