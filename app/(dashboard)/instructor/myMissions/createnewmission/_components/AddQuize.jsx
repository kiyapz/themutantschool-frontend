"use client";

import React, { useContext, useState } from "react";
import { Plus, Minus, Send, Eye, EyeOff, Loader2 } from "lucide-react";
import { InstructorContext } from "../../../_components/context/InstructorContex";

const QuizCreator = () => {
  const { levelId } = useContext(InstructorContext);
  const [quiz, setQuiz] = useState({
    levelId: levelId ,
    title: "",
    questions: [
      {
        question: "",
        options: ["", "", "", ""],
        answer: "",
      },
    ],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

  const addQuestion = () => {
    setQuiz((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question: "",
          options: ["", "", "", ""],
          answer: "",
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

      const transformedQuiz = {
        levelId: quiz.levelId,
        title: quiz.title,
        question: quiz.questions[0]?.question,
        options: quiz.questions[0]?.options,
        answer: quiz.questions[0]?.answer,
      };

      console.log("Transformed Quiz Data:", transformedQuiz);

      const response = await fetch(
        "https://themutantschool-backend.onrender.com/api/mission-quiz/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(transformedQuiz), 
        }
      );

      const responseData = await response.json().catch(() => null);

      if (response.ok) {
        setApiResponse({
          success: true,
          message: "Quiz created successfully!",
          data: responseData,
        });

        
        setQuiz({
          levelId: levelId || "",
          title: "",
          questions: [
            {
              question: "",
              options: ["", "", "", ""],
              answer: "",
            },
          ],
        });
      } else {
        setApiResponse({
          error: `Server Error (${response.status})`,
          success: false,
          details:
            responseData?.message ||
            responseData ||
            "No additional error details available",
          status: response.status,
          statusText: response.statusText,
        });
      }
    } catch (error) {
      setApiResponse({
        error: `Network Error: ${error.message}`,
        success: false,
        details: "Check your internet connection and try again",
      });
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

  return (
    <div className=" xl:grid grid-cols-3 gap-4 ">
      <div className="max-w-4xl col-span-2 mx-auto p-6 bg-black min-h-screen flex flex-col gap-5 text-white">
        <div className="mb-6 w-full h-[266.88px] rounded-[20px] bg-[#101010]">
          <textarea
            style={{ padding: "20px" }}
            className="w-full p-2 rounded bg-[#101010] outline-none w-full h-full resize-none"
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

            <textarea
              style={{ padding: "10px" }}
              className="w-full p-2 rounded-[12px] h-[142.18px] bg-[#070707] outline-none resize-none"
              placeholder="Type Your Question here"
              value={q.question}
              disabled={isLoading}
              onChange={(e) =>
                updateQuestion(qIndex, "question", e.target.value)
              }
            />

            {q.options.map((opt, optIndex) => (
              <div className="flex flex-col gap-10 mb-4" key={optIndex}>
                <div className="flex items-center bg-[#070707] rounded-[12px] gap-2 mb-2">
                  <input
                    style={{ padding: "10px" }}
                    placeholder={`Option ${optIndex + 1}`}
                    className="w-full p-2 rounded-[12px] h-[75.76px] bg-[#070707] outline-none"
                    value={opt}
                    disabled={isLoading}
                    onChange={(e) =>
                      updateOption(qIndex, optIndex, e.target.value)
                    }
                  />
                </div>
              </div>
            ))}

            <select
              style={{ padding: "10px" }}
              className="w-full p-4 rounded-[12px] h-[60px] text-white bg-[#070707] outline-none appearance-none focus:outline-none focus:ring-0"
              value={q.answer}
              disabled={isLoading}
              onChange={(e) => updateQuestion(qIndex, "answer", e.target.value)}
            >
              <option style={{ padding: "10px" }} value="">
                Select correct answer
              </option>
              {q.options.map(
                (opt, idx) =>
                  opt.trim() && (
                    <option className="text-white" key={idx} value={opt}>
                      {opt}
                    </option>
                  )
              )}
            </select>
          </div>
        ))}

        <div className="flex gap-4 items-center">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
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
            disabled={isLoading}
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
        <p className="text-[#BDE75D] font-[600] text-[27px] leading-[57px] ">
          Quiz Questions
        </p>
        <div
          style={{ padding: "20px" }}
          className="bg-[#62337C] flex flex-col justify-center h-[102px] w-full  rounded-[13px] "
        >
          <p className="font-[600] text-[20px] leading-[27px] ">Question 1</p>
          <p className="font-[300] text-[12px] leading-[17px] ">
            Correct answer: Option B
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizCreator;
