"use client";
import { useEffect, useState } from "react";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";

export default function QuizHistoryPage() {
  const [quizHistory, setQuizHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchQuizHistory = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("login-accessToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `https://themutantschool-backend.onrender.com/api/mission-submit-quiz/quiz-history?page=${page}&limit=10`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Quiz History:", data);

      if (data.status === "success") {
        setQuizHistory(data.data || []);
        setPagination(data.pagination || {});
      }
    } catch (error) {
      console.error("Error fetching quiz history:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizHistory(pagination.page);
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
      fetchQuizHistory(newPage);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getScoreColor = (score, passed) => {
    if (passed) return "text-green-500";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  if (loading && quizHistory.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading quiz history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AiOutlineCloseCircle className="text-red-500 text-5xl mx-auto mb-4" />
          <p className="text-red-500 text-lg">{error}</p>
          <button
            onClick={() => fetchQuizHistory(pagination.page)}
            className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-white">
          Quiz History
        </h1>
        <p className="text-gray-400">
          Track your quiz attempts and performance
        </p>
      </div>

      {/* Stats Summary */}
      {quizHistory.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#0B0B0B] p-4 rounded-lg border border-purple-900">
            <p className="text-gray-400 text-sm">Total Attempts</p>
            <p className="text-2xl font-bold text-white">{pagination.total}</p>
          </div>
          <div className="bg-[#0B0B0B] p-4 rounded-lg border border-green-900">
            <p className="text-gray-400 text-sm">Passed</p>
            <p className="text-2xl font-bold text-green-500">
              {quizHistory.filter((q) => q.passed).length}
            </p>
          </div>
          <div className="bg-[#0B0B0B] p-4 rounded-lg border border-red-900">
            <p className="text-gray-400 text-sm">Failed</p>
            <p className="text-2xl font-bold text-red-500">
              {quizHistory.filter((q) => !q.passed).length}
            </p>
          </div>
        </div>
      )}

      {/* Quiz History List */}
      {quizHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-[#0B0B0B] rounded-lg">
          <p className="text-gray-400 text-lg mb-2">No quiz history found</p>
          <p className="text-gray-500 text-sm">
            Your quiz attempts will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {quizHistory.map((quiz, index) => (
            <div
              key={quiz.attemptId || index}
              className="bg-[#0B0B0B] rounded-lg p-4 sm:p-6 border border-gray-800 hover:border-purple-800 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                {/* Left Section: Quiz Info */}
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-1 ${
                        quiz.passed ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {quiz.passed ? (
                        <AiOutlineCheckCircle className="text-2xl" />
                      ) : (
                        <AiOutlineCloseCircle className="text-2xl" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-1">
                        {quiz.quizTitle}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400 mb-2">
                        <span className="px-2 py-1 bg-purple-900/30 rounded text-purple-400">
                          {quiz.quizType}
                        </span>
                        <span>{formatDate(quiz.createdAt)}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <span className="text-gray-400">
                          Questions:{" "}
                          <span className="text-white">
                            {quiz.totalQuestions}
                          </span>
                        </span>
                        <span className="text-gray-400">
                          Passing Score:{" "}
                          <span className="text-white">
                            {quiz.passingScore}%
                          </span>
                        </span>
                      </div>
                      {quiz.cooldownUntil &&
                        new Date(quiz.cooldownUntil) > new Date() && (
                          <div className="mt-2 text-sm text-yellow-500">
                            ⏱ Cooldown until: {formatDate(quiz.cooldownUntil)}
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                {/* Right Section: Score */}
                <div className="flex sm:flex-col items-center sm:items-end gap-2">
                  <div className="text-right">
                    <p
                      className={`text-3xl font-bold ${getScoreColor(
                        quiz.score,
                        quiz.passed
                      )}`}
                    >
                      {quiz.score}%
                    </p>
                    <p className="text-sm text-gray-400">{quiz.scoreSummary}</p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      quiz.passed
                        ? "bg-green-900/30 text-green-400"
                        : "bg-red-900/30 text-red-400"
                    }`}
                  >
                    {quiz.passed ? "PASSED" : "FAILED"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className={`px-4 py-2 rounded-lg transition-colors ${
              pagination.page === 1
                ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700 text-white"
            }`}
          >
            Previous
          </button>

          <div className="flex items-center gap-2">
            {[...Array(pagination.totalPages)].map((_, index) => {
              const pageNum = index + 1;
              // Show first page, last page, current page, and pages around current
              if (
                pageNum === 1 ||
                pageNum === pagination.totalPages ||
                (pageNum >= pagination.page - 1 &&
                  pageNum <= pagination.page + 1)
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-lg transition-colors ${
                      pagination.page === pageNum
                        ? "bg-purple-600 text-white"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              } else if (
                pageNum === pagination.page - 2 ||
                pageNum === pagination.page + 2
              ) {
                return (
                  <span key={pageNum} className="text-gray-500">
                    ...
                  </span>
                );
              }
              return null;
            })}
          </div>

          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className={`px-4 py-2 rounded-lg transition-colors ${
              pagination.page === pagination.totalPages
                ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700 text-white"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
