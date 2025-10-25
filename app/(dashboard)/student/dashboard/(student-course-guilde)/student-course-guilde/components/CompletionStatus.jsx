"use client";

import React, { useState, useEffect } from "react";
import levelCompletionTracker from "@/lib/levelCompletionTracker";

/**
 * CompletionStatus Component
 * Displays level completion status and prevents UI contradictions
 */
export default function CompletionStatus({ levelId, showDetails = false }) {
  const [completionData, setCompletionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCompletionStatus = () => {
      try {
        const isCompleted = levelCompletionTracker.isLevelCompleted(levelId);
        const isQuizPassed = levelCompletionTracker.isQuizPassed(levelId);
        const completedLevels = levelCompletionTracker.getCompletedLevels();
        const levelData = completedLevels[levelId];

        setCompletionData({
          isCompleted,
          isQuizPassed,
          levelData,
          levelId,
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading completion status:", error);
        setIsLoading(false);
      }
    };

    if (levelId) {
      loadCompletionStatus();
    }
  }, [levelId]);

  if (isLoading) {
    return (
      <div className="text-sm text-gray-400">Loading completion status...</div>
    );
  }

  if (!completionData) {
    return null;
  }

  const { isCompleted, isQuizPassed, levelData } = completionData;

  // If level is completed and quiz is passed, show completion message
  if (isCompleted && isQuizPassed) {
    return (
      <div className="bg-green-900/20 border border-green-700 text-green-300 p-4 rounded-lg text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-green-400">✓</span>
          <span className="font-semibold">Level Completed!</span>
        </div>
        <p className="text-sm text-green-200">
          You have successfully completed this level and passed the quiz.
        </p>
        {showDetails && levelData && (
          <div className="mt-3 text-xs text-green-300">
            <p>
              Score: {levelData.score || 0}/{levelData.total || 0}
            </p>
            <p>Percentage: {levelData.percentage || 0}%</p>
            <p>
              Completed: {new Date(levelData.completedAt).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    );
  }

  // If level is completed but quiz failed, show retry message
  if (isCompleted && !isQuizPassed) {
    return (
      <div className="bg-yellow-900/20 border border-yellow-700 text-yellow-300 p-4 rounded-lg text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-yellow-400">⚠</span>
          <span className="font-semibold">Quiz Not Passed</span>
        </div>
        <p className="text-sm text-yellow-200">
          You need to retake the quiz to complete this level.
        </p>
      </div>
    );
  }

  // If level is not completed, show progress message
  return (
    <div className="bg-blue-900/20 border border-blue-700 text-blue-300 p-4 rounded-lg text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        <span className="text-blue-400">📚</span>
        <span className="font-semibold">Level In Progress</span>
      </div>
      <p className="text-sm text-blue-200">
        Complete all videos and pass the quiz to finish this level.
      </p>
    </div>
  );
}

/**
 * Hook to get completion status for a level
 */
export function useCompletionStatus(levelId) {
  const [completionData, setCompletionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCompletionStatus = () => {
      try {
        const isCompleted = levelCompletionTracker.isLevelCompleted(levelId);
        const isQuizPassed = levelCompletionTracker.isQuizPassed(levelId);
        const completedLevels = levelCompletionTracker.getCompletedLevels();
        const levelData = completedLevels[levelId];

        setCompletionData({
          isCompleted,
          isQuizPassed,
          levelData,
          levelId,
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading completion status:", error);
        setIsLoading(false);
      }
    };

    if (levelId) {
      loadCompletionStatus();
    }
  }, [levelId]);

  return { completionData, isLoading };
}
