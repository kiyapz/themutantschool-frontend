'use client'
import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Trophy,
  Send,
  Loader,
} from "lucide-react";

const FinalQuizGenerator = () => {
  const [formData, setFormData] = useState({
    title: "",
    passingScore: 70,
    durationMinutes: 30,
    isFinal: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
//   const [missionId, setMissionId] = useState("");

  // Simulate getting mission ID from localStorage
 
  const missionId = localStorage.getItem("missionId");


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
        // throw new Error(`HTTP error! status: ${response.status}`);
        console.log(response,'response from final quiz');
        
      }
      
      const data = await response.json();
    
      console.log(data);
      

      // Simulated response for demo
    //   await new Promise((resolve) => setTimeout(resolve, 2000));

    //   const mockResponse = {
    //     status: "success",
    //     message: "Final boss quiz generated from all level quizzes.",
    //     data: {
    //       id: "quiz_" + Date.now(),
    //       title: formData.title,
    //       missionId: missionId,
    //       type: "boss",
    //       isFinal: true,
    //       passingScore: formData.passingScore,
    //       durationMinutes: formData.durationMinutes,
    //       questions: [
    //         {
    //           id: "q1",
    //           question: "What is the virtual DOM in React?",
    //           options: [
    //             "A copy of the real DOM kept in memory",
    //             "A JavaScript object representation of the DOM",
    //             "A browser API for DOM manipulation",
    //             "A React component lifecycle method",
    //           ],
    //           correctAnswer: 1,
    //           difficulty: "intermediate",
    //         },
    //         {
    //           id: "q2",
    //           question: "Which hook is used for side effects in React?",
    //           options: ["useState", "useEffect", "useContext", "useReducer"],
    //           correctAnswer: 1,
    //           difficulty: "beginner",
    //         },
    //         {
    //           id: "q3",
    //           question: "What is the purpose of keys in React lists?",
    //           options: [
    //             "To style list items",
    //             "To help React identify which items have changed",
    //             "To sort the list items",
    //             "To filter the list items",
    //           ],
    //           correctAnswer: 1,
    //           difficulty: "intermediate",
    //         },
    //       ],
    //       createdAt: new Date().toISOString(),
    //       totalQuestions: 3,
    //       estimatedDifficulty: "intermediate",
    //     },
    //   };

    //   setResponse(mockResponse);
    } catch (err) {
      setError(err.message || "Failed to generate quiz");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-8 h-8" />
              <h1 className="text-3xl font-bold">
                Final Mission Quiz Generator
              </h1>
            </div>
            <p className="text-indigo-100">
              Create the ultimate boss-level React interview challenge
            </p>
            {missionId && (
              <div className="mt-3 px-3 py-1 bg-indigo-500/30 rounded-full text-sm inline-block">
                Mission ID: {missionId}
              </div>
            )}
          </div>

          <div className="p-6">
            {/* API Endpoint Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">API Endpoint</h3>
              <div className="font-mono text-sm text-gray-600 bg-gray-100 p-2 rounded">
                POST http://localhost:3000/api/mission-quiz/generate-final/
                {missionId}
              </div>
            </div>

            {/* Quiz Generation Form */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quiz Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Final Quiz for React Fundamentals"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    name="durationMinutes"
                    value={formData.durationMinutes}
                    onChange={handleInputChange}
                    min="15"
                    max="180"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Trophy className="w-4 h-4 inline mr-1" />
                    Passing Score (%)
                  </label>
                  <input
                    type="number"
                    name="passingScore"
                    value={formData.passingScore}
                    onChange={handleInputChange}
                    min="50"
                    max="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              {/* Final Quiz Indicator */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">
                    Boss Level Quiz
                  </span>
                </div>
                <p className="text-yellow-700 text-sm mt-1">
                  This will be marked as the final boss quiz (isFinal: true) and
                  will compile questions from all previous level quizzes.
                </p>
              </div>

              <button
                type="button"
                onClick={generateFinalQuiz}
                disabled={isLoading || !formData.title.trim()}
                // className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              
                // disabled={isLoading || !formData.title.trim()}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600
                text-white py-3 px-4 rounded-lg font-medium
                hover:from-indigo-700 hover:to-purple-700 focus:outline-none
                focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed transition-all
                duration-200" >
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

            {/* Error Display */}
            {error && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">Error</span>
                </div>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            )}

            {/* Success Response */}
            {response && (
              <div className="mt-6 space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-800 mb-2">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">
                      Quiz Generated Successfully!
                    </span>
                  </div>
                  <p className="text-green-700 text-sm">{response.message}</p>
                </div>

                {/* Quiz Details */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Quiz Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Title:</span>
                      <p className="text-gray-800">{response.data.title}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">
                        Quiz ID:
                      </span>
                      <p className="font-mono text-gray-800">
                        {response.data.id}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Type:</span>
                      <p className="text-gray-800 capitalize">
                        {response.data.type}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">
                        Final Quiz:
                      </span>
                      <p className="text-gray-800">
                        {response.data.isFinal ? "Yes" : "No"}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">
                        Duration:
                      </span>
                      <p className="text-gray-800">
                        {response.data.durationMinutes} minutes
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">
                        Passing Score:
                      </span>
                      <p className="text-gray-800">
                        {response.data.passingScore}%
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">
                        Total Questions:
                      </span>
                      <p className="text-gray-800">
                        {response.data.totalQuestions}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">
                        Difficulty:
                      </span>
                      <p className="text-gray-800 capitalize">
                        {response.data.estimatedDifficulty}
                      </p>
                    </div>
                  </div>

                  {/* Sample Questions Preview */}
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-700 mb-3">
                      Sample Questions Preview
                    </h4>
                    <div className="space-y-3">
                      {response.data.questions.slice(0, 2).map((q, index) => (
                        <div
                          key={q.id}
                          className="bg-white p-4 rounded-lg border"
                        >
                          <p className="font-medium text-gray-800 mb-2">
                            {index + 1}. {q.question}
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            {q.options.map((option, optIndex) => (
                              <div
                                key={optIndex}
                                className={`p-2 rounded ${
                                  optIndex === q.correctAnswer
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100"
                                }`}
                              >
                                {String.fromCharCode(65 + optIndex)}. {option}
                              </div>
                            ))}
                          </div>
                          <div className="mt-2 text-xs text-gray-500">
                            Difficulty: {q.difficulty}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* JSON Response */}
                <details className="bg-gray-100 rounded-lg">
                  <summary className="p-4 cursor-pointer font-medium text-gray-700 hover:text-gray-900">
                    View Full JSON Response
                  </summary>
                  <div className="px-4 pb-4">
                    <pre className="bg-gray-800 text-green-400 p-4 rounded text-xs overflow-x-auto">
                      {JSON.stringify(response, null, 2)}
                    </pre>
                  </div>
                </details>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalQuizGenerator;
