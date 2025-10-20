/**
 * Level Completion Tracker
 * Manages student level completion status and progress tracking
 */

class LevelCompletionTracker {
  constructor() {
    this.STORAGE_KEYS = {
      PASSED_QUIZZES: "passedQuizzes",
      COMPLETED_LEVELS: "completedLevels",
      LEVEL_PROGRESS: "levelProgress",
      CURRENT_LEVEL_ID: "currentLevelId",
      CURRENT_MISSION_ID: "currentMissionId",
    };
  }

  /**
   * Mark a level as completed
   * @param {string} levelId - The level ID
   * @param {boolean} quizPassed - Whether the quiz was passed
   * @param {number} score - Quiz score
   * @param {number} percentage - Quiz percentage
   */
  markLevelCompleted(levelId, quizPassed, score = 0, percentage = 0) {
    try {
      // Update passed quizzes
      const passedQuizzes = this.getPassedQuizzes();
      passedQuizzes[levelId] = quizPassed;
      localStorage.setItem(
        this.STORAGE_KEYS.PASSED_QUIZZES,
        JSON.stringify(passedQuizzes)
      );

      // Update completed levels
      const completedLevels = this.getCompletedLevels();
      completedLevels[levelId] = {
        completed: true,
        quizPassed,
        score,
        percentage,
        completedAt: new Date().toISOString(),
      };
      localStorage.setItem(
        this.STORAGE_KEYS.COMPLETED_LEVELS,
        JSON.stringify(completedLevels)
      );

      console.log(`Level ${levelId} marked as completed:`, {
        quizPassed,
        score,
        percentage,
      });

      return true;
    } catch (error) {
      console.error("Error marking level as completed:", error);
      return false;
    }
  }

  /**
   * Check if a level is completed
   * @param {string} levelId - The level ID
   * @returns {boolean} - Whether the level is completed
   */
  isLevelCompleted(levelId) {
    const completedLevels = this.getCompletedLevels();
    return completedLevels[levelId]?.completed === true;
  }

  /**
   * Check if a level's quiz is passed
   * @param {string} levelId - The level ID
   * @returns {boolean} - Whether the quiz is passed
   */
  isQuizPassed(levelId) {
    const passedQuizzes = this.getPassedQuizzes();
    return passedQuizzes[levelId] === true;
  }

  /**
   * Get all completed levels
   * @returns {Object} - Object with level IDs as keys and completion data as values
   */
  getCompletedLevels() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.COMPLETED_LEVELS);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error("Error getting completed levels:", error);
      return {};
    }
  }

  /**
   * Get all passed quizzes
   * @returns {Object} - Object with level IDs as keys and boolean values
   */
  getPassedQuizzes() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.PASSED_QUIZZES);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error("Error getting passed quizzes:", error);
      return {};
    }
  }

  /**
   * Get completion statistics for a mission
   * @param {string} missionId - The mission ID
   * @param {Array} levels - Array of level objects
   * @returns {Object} - Completion statistics
   */
  getMissionCompletionStats(missionId, levels = []) {
    const completedLevels = this.getCompletedLevels();
    const passedQuizzes = this.getPassedQuizzes();

    let totalLevels = levels.length;
    let completedCount = 0;
    let passedQuizzesCount = 0;

    levels.forEach((level) => {
      if (completedLevels[level._id]?.completed) {
        completedCount++;
      }
      if (passedQuizzes[level._id]) {
        passedQuizzesCount++;
      }
    });

    const completionPercentage =
      totalLevels > 0 ? (completedCount / totalLevels) * 100 : 0;
    const allLevelsCompleted = completedCount === totalLevels;
    const allQuizzesPassed = passedQuizzesCount === totalLevels;

    return {
      totalLevels,
      completedLevels: completedCount,
      passedQuizzes: passedQuizzesCount,
      completionPercentage,
      allLevelsCompleted,
      allQuizzesPassed,
      canTakeFinalQuiz: allLevelsCompleted && allQuizzesPassed,
    };
  }

  /**
   * Calculate progress for a specific level
   * @param {string} levelId - The level ID
   * @param {number} watchedVideos - Number of watched videos
   * @param {number} totalVideos - Total number of videos
   * @param {number} currentStage - Current stage (1-6)
   * @returns {Object} - Progress object with completed and total
   */
  calculateLevelProgress(
    levelId,
    watchedVideos = 0,
    totalVideos = 0,
    currentStage = 1
  ) {
    const isCompleted = this.isLevelCompleted(levelId);
    const isQuizPassed = this.isQuizPassed(levelId);

    // If level is completed, show 100% progress
    if (isCompleted && isQuizPassed) {
      return {
        completed: totalVideos + 1, // All videos + quiz
        total: totalVideos + 1,
        isCompleted: true,
        isQuizPassed: true,
      };
    }

    // Calculate progress based on current stage
    let completed = 0;
    const total = totalVideos + 1; // Videos + quiz

    switch (currentStage) {
      case 1: // Learning outcomes
        completed = 0;
        break;
      case 2: // Intro video
        completed = Math.min(1, watchedVideos);
        break;
      case 3: // Capsule videos
        completed = watchedVideos;
        break;
      case 4: // Quiz stage
        completed = totalVideos;
        break;
      case 5: // Quiz passed
        completed = totalVideos + 1;
        break;
      case 6: // Quiz failed
        completed = totalVideos;
        break;
      default:
        completed = watchedVideos;
    }

    return {
      completed,
      total,
      isCompleted,
      isQuizPassed,
    };
  }

  /**
   * Reset level completion (for retaking)
   * @param {string} levelId - The level ID
   */
  resetLevelCompletion(levelId) {
    try {
      const completedLevels = this.getCompletedLevels();
      const passedQuizzes = this.getPassedQuizzes();

      delete completedLevels[levelId];
      delete passedQuizzes[levelId];

      localStorage.setItem(
        this.STORAGE_KEYS.COMPLETED_LEVELS,
        JSON.stringify(completedLevels)
      );
      localStorage.setItem(
        this.STORAGE_KEYS.PASSED_QUIZZES,
        JSON.stringify(passedQuizzes)
      );

      console.log(`Level ${levelId} completion reset`);
      return true;
    } catch (error) {
      console.error("Error resetting level completion:", error);
      return false;
    }
  }

  /**
   * Clear all completion data (for testing or reset)
   */
  clearAllCompletionData() {
    try {
      localStorage.removeItem(this.STORAGE_KEYS.PASSED_QUIZZES);
      localStorage.removeItem(this.STORAGE_KEYS.COMPLETED_LEVELS);
      localStorage.removeItem(this.STORAGE_KEYS.LEVEL_PROGRESS);
      console.log("All completion data cleared");
      return true;
    } catch (error) {
      console.error("Error clearing completion data:", error);
      return false;
    }
  }

  /**
   * Get detailed completion report
   * @param {Array} levels - Array of level objects
   * @returns {Object} - Detailed completion report
   */
  getCompletionReport(levels = []) {
    const completedLevels = this.getCompletedLevels();
    const passedQuizzes = this.getPassedQuizzes();

    const report = {
      totalLevels: levels.length,
      completedLevels: 0,
      passedQuizzes: 0,
      levelDetails: [],
      overallCompletion: 0,
      canTakeFinalQuiz: false,
    };

    levels.forEach((level, index) => {
      const isCompleted = completedLevels[level._id]?.completed || false;
      const isQuizPassed = passedQuizzes[level._id] || false;

      if (isCompleted) report.completedLevels++;
      if (isQuizPassed) report.passedQuizzes++;

      report.levelDetails.push({
        levelId: level._id,
        levelName: level.name || `Level ${index + 1}`,
        isCompleted,
        isQuizPassed,
        completionData: completedLevels[level._id] || null,
      });
    });

    report.overallCompletion =
      report.totalLevels > 0
        ? (report.completedLevels / report.totalLevels) * 100
        : 0;
    report.canTakeFinalQuiz =
      report.completedLevels === report.totalLevels &&
      report.passedQuizzes === report.totalLevels;

    return report;
  }
}

// Create and export a singleton instance
const levelCompletionTracker = new LevelCompletionTracker();
export default levelCompletionTracker;
