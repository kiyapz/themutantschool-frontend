"use client";

import React, { useContext, useEffect, useState } from "react";
import { MdSettings } from "react-icons/md";
import { Plus, Minus, Send, Eye, EyeOff, Loader2 } from "lucide-react";
import { InstructorContext } from "../../../_components/context/InstructorContex";
import axios from "axios";
import QuizeCustomDropdown from "./QuizeDropdown";

const QuizCreator = () => {
  const {
    levelId,
    missionId,
    capselId,
    passingScore,
    setQuizTitle,
  } = useContext(InstructorContext);
   
  const [quiz, setQuiz] = useState({
    missionId: missionId,
    levelId: levelId,
    title: "",
    questions: [
      {
        question: "",
        options: ["", "", "", ""],
        answer: "",
        explanation: "",
      },
    ],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [QuizData, setQuizData] = useState("AddLevel");
  const [durationMinutes, setDurationMinutes] = useState(15);
 
  console.log("Quiz Creator initialized with levelId:", QuizData);

  const addQuestion = () => {
    setQuiz((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question: "",
          options: ["", "", "", ""],
          answer: "",
          explanation: "",
        },
      ],
    }));
  };

  const removeQuestion = (index) => {
    if (quiz.questions.length > 1) {
      setQuiz((prev) => ({
        ...prev,
        questions: prev.questions.filter((_, i) => i !== index),
      }));
    }
  };

  const updateQuestion = (qIndex, field, value) => {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === qIndex ? { ...q, [field]: value } : q
      ),
    }));
  };

  const updateOption = (qIndex, optIndex, value) => {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              options: q.options.map((opt, j) =>
                j === optIndex ? value : opt
              ),
            }
          : q
      ),
    }));
  };

  const validateQuiz = () => {
    if (!quiz.levelId.trim()) return "Level ID is required";
    if (!quiz.title.trim()) return "Quiz title is required";
    if (quiz.questions.length === 0) return "At least one question is required";

    for (let i = 0; i < quiz.questions.length; i++) {
      const q = quiz.questions[i];
      if (!q.question.trim()) return `Question ${i + 1} is required`;
      if (q.options.length < 2)
        return `Question ${i + 1} must have at least 2 options`;
      if (q.options.some((opt) => !opt.trim()))
        return `All options for Question ${i + 1} must be filled`;
      if (!q.answer.trim()) return `Answer for Question ${i + 1} is required`;
      if (!q.options.includes(q.answer))
        return `Answer for Question ${i + 1} must match one of the options`;
      if (!q.explanation.trim())
        return `Explanation for Question ${i + 1} is required`;
    }

    return null;
  };

  const handleSubmit = async () => {
    const error = validateQuiz();
    if (error) {
      setApiResponse({ error, success: false });
      return;
    }

    const accessToken = localStorage.getItem("login-accessToken");

    try {
      setIsLoading(true);
      setApiResponse(null);

      const transformedQuestions = quiz.questions.map((question) => {
        const correctAnswerIndex = question.options.indexOf(question.answer);
        return {
          questionText: question.question,
          options: question.options,
          correctAnswerIndex: correctAnswerIndex,
          explanation: question.explanation,
        };
      });

      const transformedQuiz = {
        title: quiz.title,
        type: "mutation",
        missionId: quiz.missionId,
        levelId: quiz.levelId,
        questions: transformedQuestions,
        passingScore: passingScore,
        durationMinutes: durationMinutes,
      };

      console.log("Transformed Quiz Data:", transformedQuiz);

      const response = await axios.post(
        "https://themutantschool-backend.onrender.com/api/mission-quiz/create",
        transformedQuiz,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API Response:", response);

      if (response.status === 200 || response.status === 201) {
        setApiResponse({
          success: true,
          message: "Quiz created successfully!",
          data: response.data,
        });
        getAllLevel();
        
        setQuiz({
          levelId: levelId || "",
          missionId: missionId || "",
          title: "",
          questions: [
            {
              question: "",
              options: ["", "", "", ""],
              answer: "",
              explanation: "",
            },
          ],
        });
      } else {
        setApiResponse({
          error: `Server Error (${response.status})`,
          success: false,
          details:
            response.data?.message ||
            response.data ||
            "No additional error details available",
          status: response.status,
          statusText: response.statusText,
        });
      }
    } catch (error) {
      console.error("Error creating quiz:", error);

      if (error.response) {
        setApiResponse({
          error: `Server Error (${error.response.status})`,
          success: false,
          details:
            error.response.data?.message ||
            error.response.data ||
            "Server error occurred",
          status: error.response.status,
          statusText: error.response.statusText,
        });
      } else if (error.request) {
        setApiResponse({
          error: "Network Error",
          success: false,
          details:
            "Unable to connect to server. Check your internet connection.",
        });
      } else {
        setApiResponse({
          error: `Error: ${error.message}`,
          success: false,
          details: "An unexpected error occurred",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (apiResponse && (apiResponse.success || apiResponse.error)) {
      const timer = setTimeout(() => {
        setApiResponse(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [apiResponse]);

  const getAllLevel = async () => {
    console.log(levelId, " level id for quiz");

    const accessToken = localStorage.getItem("login-accessToken");
    const missionId = localStorage.getItem("missionId");

   

    try {
      const response = await axios.get(
        `https://themutantschool-backend.onrender.com/api/mission-level/mission/${missionId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setQuizData(response.data.data[capselId] || []);
      setQuizTitle(response.data.data[capselId]?.title || "");
      console.log("Fetched quiz levels:", response.data.data[capselId]);
    } catch (error) {
      console.error("Failed to fetch levels:", error);
     
    } finally {
     
    }
  };

  useEffect(() => {
    getAllLevel();
  }, []);

  return (
    <div className="flex flex-col  xl:grid grid-cols-3 gap-4">
      <div className="max-w-4xl col-span-2 mx-auto p-6 bg-black min-h-screen flex flex-col gap-5 text-white">
        
        <div
          style={{ padding: "20px" }}
          className="rounded-[20px] w-full h-fit bg-[#101010]"
        >
          <p className=" text-[#BDE75D] flex items-center gap-2 leading-[40px] text-[28px] font-[600] ">
           <MdSettings /> Quiz Settings
          </p>

          <div
            style={{ padding: "10px" }}
            className="mb-6 w-full gap-5 h-fit xl:grid grid-cols-3 "
          >
            <div className="flex flex-col gap-2">
              <p className="text-[#7F7F7F] font-[400] text-[19px] ">
                Time Limit(Minutes)
              </p>
              <input
                style={{ padding: "10px" }}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                type="number"
                className="w-full outline-none h-[75.76px]  text-center rounded-[14px] bg-[#070707] "
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-[#7F7F7F] font-[400] text-[19px] ">
                Passing Score
              </p>
              <QuizeCustomDropdown />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-[#7F7F7F] font-[400] text-[19px] ">
                Allowed Attempts
              </p>
              <input
                style={{ padding: "10px" }}
                defaultValue={1}
                type="text"
                className="w-full outline-none text-center h-[75.76px] rounded-[14px] bg-[#070707] "
              />
            </div>
          </div>
        </div>

        <div
          style={{ padding: "10px" }}
          className="mb-6 w-full h-[75.16px] rounded-[12px] bg-[#101010]"
        >
          <input
            style={{ padding: "20px" }}
            className="w-full p-2 rounded bg-[#070707] outline-none w-full h-full "
            value={quiz.title}
            placeholder="Quiz Title"
            disabled={isLoading}
            onChange={(e) =>
              setQuiz((prev) => ({ ...prev, title: e.target.value }))
            }
          />
        </div>

        {quiz.questions.map((q, qIndex) => (
          <div
            style={{ padding: "20px" }}
            key={qIndex}
            className="mb-6 p-4 flex flex-col gap-5 rounded bg-[#101010]"
          >
            <div className="flex justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="h-[50px] text-[#000000] leading-[150%] font-[600] w-[50px] rounded-full flexcenter bg-[#BDE75D] ">
                  {qIndex + 1}
                </div>
                <h3 className="text-[29px] leading-[150%] text-[#83A140] font-[600] ">
                  Question {qIndex + 1}
                </h3>
              </div>

              {quiz.questions.length > 1 && (
                <button
                  onClick={() => removeQuestion(qIndex)}
                  disabled={isLoading}
                  className="disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus size={16} className="text-red-500" />
                </button>
              )}
            </div>

            <input
              style={{ padding: "10px" }}
              className="w-full p-2 rounded-[12px] h-[75.16px] bg-[#070707] outline-none resize-none"
              placeholder="Type Your Question here"
              value={q.question}
              disabled={isLoading}
              onChange={(e) =>
                updateQuestion(qIndex, "question", e.target.value)
              }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {q.options.map((opt, optIndex) => (
                <div className="w-full mb-4" key={optIndex}>
                  <div className="flex gap-2 items-center">
                    <input
                      type="radio"
                      id={`q${qIndex}_option${optIndex}`}
                      name={`question_${qIndex}_answer`}
                      value={opt}
                      checked={q.answer === opt}
                      disabled={isLoading || !opt.trim()}
                      onChange={(e) =>
                        updateQuestion(qIndex, "answer", e.target.value)
                      }
                      className="w-5 h-5 text-[#604196] bg-[#070707] border-2 border-gray-600 focus:ring-[#604196] focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <input
                      style={{ padding: "10px" }}
                      placeholder={`Option ${optIndex + 1}`}
                      className="flex-1 p-2 rounded-[12px] w-full h-[75.76px] bg-[#070707] outline-none"
                      value={opt}
                      disabled={isLoading}
                      onChange={(e) =>
                        updateOption(qIndex, optIndex, e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>

            <textarea
              style={{ padding: "10px" }}
              className="w-full p-2 rounded-[12px] h-[75.16px] bg-[#070707] outline-none resize-none"
              placeholder="Explanation for this question"
              value={q.explanation}
              disabled={isLoading}
              onChange={(e) =>
                updateQuestion(qIndex, "explanation", e.target.value)
              }
            />
          </div>
        ))}

        <div className="flex gap-4 items-center">
          <button
            onClick={handleSubmit}
            disabled={QuizData.quiz || isLoading || quiz.questions.length <= 4}
            className="bg-[#604196] cursor-pointer w-[169.37px] h-[44.07px] hover:bg-[#1D132E] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Creating...
              </>
            ) : (
              "Create Quiz"
            )}
          </button>

          <button
            onClick={addQuestion}
            disabled={QuizData.quiz || isLoading}
            className="bg-[#604196] cursor-pointer w-[169.37px] h-[44.07px] hover:bg-[#1D132E] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Wait...
              </>
            ) : (
              <>
                <Plus size={16} />
                Add Question
              </>
            )}
          </button>
        </div>

        {apiResponse && (
          <div
            style={{ padding: "16px" }}
            className={`mt-4 fixed top-4 right-4 w-fit max-w-md p-4 bg-[#070707] rounded-sm shadow-lg z-50 ${
              apiResponse.success
                ? "bg-green-900 border border-green-700"
                : "bg-red-900 border border-red-700"
            }`}
          >
            {apiResponse.success ? (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="text-green-100">{apiResponse.message}</div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="text-red-100 font-medium">
                    {apiResponse.error || "An error occurred"}
                  </div>
                </div>
                {apiResponse.details && (
                  <div className="text-sm text-red-300 pl-4">
                    {apiResponse.details}
                  </div>
                )}
                {apiResponse.status && (
                  <div className="text-xs text-red-400 pl-4">
                    Status: {apiResponse.status} - {apiResponse.statusText}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="">
        <p className="text-[#BDE75D] font-[600] text-[27px] leading-[57px]">
          Quiz Questions
        </p>

        {QuizData.quiz ? (
          <div className="flex flex-col gap-4">
            {" "}
            {QuizData?.quiz?.questions.map((question, index) => (
              <div
                key={index}
                style={{ padding: "20px" }}
                className="bg-[#62337C] flex flex-col justify-center h-[102px] w-full rounded-[13px] mb-4"
              >
                <p className="font-[600] text-[20px] leading-[27px]">
                  Question {index + 1}: {question.questionText}
                </p>
                <p className="font-[300] text-[12px] leading-[17px]">
                  Correct answer (Option {question.correctAnswerIndex + 1}):{" "}
                  {question.options[question.correctAnswerIndex]}
                </p>
              </div>
            ))}
          </div>
        ) : (
          "Create A Quize"
        )}
      </div>
    </div>
  );
};

export default QuizCreator;
