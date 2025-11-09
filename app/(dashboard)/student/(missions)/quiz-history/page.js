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

      const data = await response.json();
      console.log("Quiz History:", data);

      if (!response.ok || data.status === "error") {
        const message =
          data?.message ||
          `HTTP error! Status: ${response.status}`;
        throw new Error(message);
      }

      setQuizHistory(data.data || []);
      setPagination(data.pagination || {});
    } catch (error) {
      console.error("Error fetching quiz history:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizHistory(pagination.page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-purple-500/30 border-t-purple-500"></div>
            <div
              className="absolute inset-2 animate-spin rounded-full border-4 border-pink-500/30 border-t-pink-500 animate-reverse"
              style={{ animationDuration: "1.5s" }}
            ></div>
          </div>
          <p className="text-gray-300 text-lg font-semibold mb-2">
            Loading quiz history...
          </p>
          <p className="text-gray-500 text-sm">
            Please wait while we fetch your data
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    const isNoAttempts = error
      ?.toLowerCase()
      ?.includes("no quiz attempts");

    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center bg-gradient-to-br from-red-950/20 to-[#0B0B0B] p-8 rounded-xl">
          <AiOutlineCloseCircle className="text-red-400 text-6xl mx-auto mb-4 animate-pulse" />
          <p className="text-red-400 text-xl font-semibold mb-2">
            {isNoAttempts
              ? "No quiz attempts found"
              : "Oops! Something went wrong"}
          </p>
          <p className="text-gray-400 text-sm mb-6 max-w-md">
            {isNoAttempts
              ? "You haven't taken any quizzes yet. Once you do, your results will appear here."
              : error}
          </p>
          {!isNoAttempts && (
            <button
              onClick={() => fetchQuizHistory(pagination.page)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-purple-600/50 hover:scale-105"
            >
              🔄 Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex flex-col gap-2 pb-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600">
          Quiz History
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          📊 Track your quiz attempts and performance over time
        </p>
      </div>

      {/* Stats Summary */}
      {quizHistory.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-gradient-to-br from-purple-900/20 to-purple-950/30 p-3 sm:p-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/20 hover:scale-105">
            <p className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">
              Total Attempts
            </p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
              {pagination.total}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-900/20 to-green-950/30 p-3 sm:p-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-green-900/20 hover:scale-105">
            <p className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">
              Passed
            </p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-green-400">
              {quizHistory.filter((q) => q.passed).length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-red-900/20 to-red-950/30 p-3 sm:p-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-red-900/20 hover:scale-105">
            <p className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">
              Failed
            </p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-red-400">
              {quizHistory.filter((q) => !q.passed).length}
            </p>
          </div>
        </div>
      )}

      {/* Quiz History List */}
      {quizHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-gradient-to-br from-[#0B0B0B] via-[#080808] to-purple-950/20 rounded-2xl border border-purple-900/40 text-center space-y-5 transition-all duration-300">
          <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center animate-pulse">
            <span className="text-4xl">📝</span>
          </div>
          <div className="space-y-2 px-6">
            <p className="text-gray-200 text-xl sm:text-2xl font-semibold">
              No quiz history yet
            </p>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
              Once you begin taking quizzes, your progress and scores will be tracked here.
            </p>
          </div>
          <button
            onClick={() => window.location.href = "/student/missions"}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-purple-600/40 hover:scale-105"
          >
            Explore Missions
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {quizHistory.map((quiz, index) => (
            <div
              key={quiz.attemptId || index}
              className={`bg-gradient-to-br ${
                quiz.passed
                  ? "from-[#0B0B0B] via-[#0B0B0B] to-green-950/10"
                  : "from-[#0B0B0B] via-[#0B0B0B] to-red-950/10"
              } rounded-xl p-4 sm:p-6 transition-all duration-300 hover:shadow-xl ${
                quiz.passed
                  ? "hover:shadow-green-900/10"
                  : "hover:shadow-red-900/10"
              } hover:scale-[1.01] group`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                {/* Left Section: Quiz Info */}
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-1 transition-transform duration-300 group-hover:scale-110 ${
                        quiz.passed ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {quiz.passed ? (
                        <AiOutlineCheckCircle className="text-2xl sm:text-3xl" />
                      ) : (
                        <AiOutlineCloseCircle className="text-2xl sm:text-3xl" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                        {quiz.quizTitle}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm mb-3">
                        <span className="px-3 py-1 bg-gradient-to-r from-purple-900/40 to-purple-800/30 rounded-full text-purple-300 font-semibold">
                          {quiz.quizType}
                        </span>
                        <span className="text-gray-400 flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {formatDate(quiz.createdAt)}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm bg-gray-900/50 rounded-lg p-2 sm:p-3">
                        <span className="text-gray-400 flex items-center gap-1">
                          <span className="font-semibold text-purple-400">
                            Questions:
                          </span>
                          <span className="text-white font-bold">
                            {quiz.totalQuestions}
                          </span>
                        </span>
                        <span className="text-gray-400 flex items-center gap-1">
                          <span className="font-semibold text-purple-400">
                            Passing Score:
                          </span>
                          <span className="text-white font-bold">
                            {quiz.passingScore}%
                          </span>
                        </span>
                      </div>
                      {quiz.cooldownUntil &&
                        new Date(quiz.cooldownUntil) > new Date() && (
                          <div className="mt-3 text-xs sm:text-sm text-yellow-400 bg-yellow-900/20 rounded-lg p-2 flex items-center gap-2">
                            <span className="text-lg">⏱</span>
                            <span>
                              Cooldown until: {formatDate(quiz.cooldownUntil)}
                            </span>
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                {/* Right Section: Score */}
                <div className="flex sm:flex-col items-center sm:items-end gap-3">
                  <div className="text-right">
                    <div className="relative">
                      <p
                        className={`text-3xl sm:text-4xl font-black ${getScoreColor(
                          quiz.score,
                          quiz.passed
                        )} drop-shadow-lg`}
                      >
                        {quiz.score}%
                      </p>
                      <div
                        className={`absolute -inset-1 bg-gradient-to-r ${
                          quiz.passed
                            ? "from-green-600/20 to-green-400/20"
                            : "from-red-600/20 to-red-400/20"
                        } blur-lg -z-10 opacity-0 group-hover:opacity-100 transition-opacity`}
                      ></div>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-400 mt-1">
                      {quiz.scoreSummary}
                    </p>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wide shadow-lg transition-all duration-300 ${
                      quiz.passed
                        ? "bg-gradient-to-r from-green-900/50 to-green-800/40 text-green-300 group-hover:shadow-green-600/30"
                        : "bg-gradient-to-r from-red-900/50 to-red-800/40 text-red-300 group-hover:shadow-red-600/30"
                    }`}
                  >
                    {quiz.passed ? "✓ PASSED" : "✗ FAILED"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 ${
              pagination.page === 1
                ? "bg-gray-800 text-gray-600 cursor-not-allowed opacity-50"
                : "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white shadow-lg hover:shadow-purple-600/50 hover:scale-105"
            }`}
          >
            ← Previous
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
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl font-bold transition-all duration-300 ${
                      pagination.page === pageNum
                        ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/50 scale-110"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white hover:scale-105"
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
                  <span key={pageNum} className="text-gray-500 px-1">
                    •••
                  </span>
                );
              }
              return null;
            })}
          </div>

          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 ${
              pagination.page === pagination.totalPages
                ? "bg-gray-800 text-gray-600 cursor-not-allowed opacity-50"
                : "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white shadow-lg hover:shadow-purple-600/50 hover:scale-105"
            }`}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
