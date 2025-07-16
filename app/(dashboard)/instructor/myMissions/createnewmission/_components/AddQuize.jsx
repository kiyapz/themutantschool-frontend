"use client";

import React, { useContext, useState } from "react";
import { Plus, Minus, Send, Eye, EyeOff } from "lucide-react";
import { InstructorContext } from "../../../_components/context/InstructorContex";

const QuizCreator = () => {
  const { levelId } = useContext(InstructorContext);
  const [quiz, setQuiz] = useState({
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

  const [showPreview, setShowPreview] = useState(false);
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

  const addOption = (qIndex) => {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === qIndex ? { ...q, options: [...q.options, ""] } : q
      ),
    }));
  };

  const removeOption = (qIndex, optIndex) => {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              options: q.options.filter((_, j) => j !== optIndex),
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
      setApiResponse({ loading: true });

      const transformedQuiz = {
        levelId: quiz.levelId,
        title: quiz.title,
        questions: quiz.questions.question,
        options: quiz.questions.options,
        answers: quiz.questions.answer,
      };

      const response = await fetch(
        "https://themutantschool-backend.onrender.com/api/mission-quiz/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(quiz),
        }
      );

      const responseData = await response.json().catch(() => null);

      if (response.ok) {
        setApiResponse({
          success: true,
          message: "Quiz created successfully!",
          data: responseData,
        });
      } else {
        setApiResponse({
          error: `Server Error (${response.status})`,
          success: false,
          details: responseData || "No additional error details available",
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
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(quiz, null, 2));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-black min-h-screen flex flex-col gap-5 text-white">
      <h1 className="text-3xl font-bold mb-4">Quiz Creator</h1>

      

      <div className="mb-6">
        <label className="block mb-1">Quiz Title</label>
        <input
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          value={quiz.title}
          onChange={(e) =>
            setQuiz((prev) => ({ ...prev, title: e.target.value }))
          }
        />
      </div>

      {quiz.questions.map((q, qIndex) => (
        <div key={qIndex} className="mb-6 p-4 border flex flex-col gap-5 border-gray-700 rounded">
          <div className="flex justify-between mb-2">
            <h2 className="text-lg font-semibold">Question {qIndex + 1}</h2>
            {quiz.questions.length > 1 && (
              <button onClick={() => removeQuestion(qIndex)}>
                <Minus size={16} className="text-red-500" />
              </button>
            )}
          </div>

          <textarea
            className="w-full p-2 rounded  border border-gray-700 mb-4"
            placeholder="Enter your question here"
            value={q.question}
            onChange={(e) => updateQuestion(qIndex, "question", e.target.value)}
          />

          {q.options.map((opt, optIndex) => (
            <div className="flex flex-col gap-10 mb-4" key={optIndex}>
            <div key={optIndex} className="flex items-center border gap-2 mb-2">
              <input
              style={{padding:'10px'}}
              placeholder={`Option  ${optIndex + 1}`}
                className="flex-1 p-2 rounded  border-gray-700"
                value={opt}
                onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
              />
              {q.options.length > 2 && (
                <button onClick={() => removeOption(qIndex, optIndex)}>
                  <Minus size={16} className="text-red-500" />
                </button>
              )}
            </div>
            </div>
          ))}

        

          <select
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            value={q.answer}
            onChange={(e) => updateQuestion(qIndex, "answer", e.target.value)}
          >
            <option value="">Select correct answer</option>
            {q.options.map(
              (opt, idx) =>
                opt.trim() && (
                  <option key={idx} value={opt}>
                    {opt}
                  </option>
                )
            )}
          </select>
        </div>
      ))}

      

      <div className="flex gap-4">
        <button
        style={{padding:'5px'}}
          onClick={handleSubmit}
          className="px-6 py-2 border flex items-center w-fit rounded hover:bg-green-700"
        >
          <Send size={16} /> Create Quiz
        </button>

        
      </div>



     
    </div>
  );
};

export default QuizCreator;
