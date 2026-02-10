/**
 * Pure utility functions for calculating workout statistics.
 * These functions are framework-agnostic and easy to test.
 * All calculations derive from the raw sessions array stored in localStorage.
 */

/**
 * Calculate total volume (weight × reps) across all completed sets in all sessions
 * @param {Array} sessions - Array of workout session objects
 * @returns {number} Total volume in kg
 */
export function calcTotalVolume(sessions) {
  if (!sessions || sessions.length === 0) return 0;

  return sessions.reduce((total, session) => {
    const sessionVolume = session.exercises.reduce((exerciseTotal, exercise) => {
      const exerciseSets = exercise.sets.reduce((setTotal, set) => {
        if (set.weight && set.reps) {
          return setTotal + set.weight * set.reps;
        }
        return setTotal;
      }, 0);
      return exerciseTotal + exerciseSets;
    }, 0);
    return total + sessionVolume;
  }, 0);
}

/**
 * Calculate average session duration across all sessions
 * @param {Array} sessions - Array of workout session objects
 * @returns {number} Average duration in minutes
 */
export function calcAvgDuration(sessions) {
  if (!sessions || sessions.length === 0) return 0;

  const totalMinutes = sessions.reduce((total, session) => {
    if (session.startedAt && session.endedAt) {
      const durationMs = new Date(session.endedAt) - new Date(session.startedAt);
      const durationMinutes = Math.round(durationMs / 1000 / 60);
      return total + durationMinutes;
    }
    return total;
  }, 0);

  return Math.round(totalMinutes / sessions.length);
}

/**
 * Calculate estimated calories burned for a single session
 * Based on training type and duration
 * @param {Object} session - Workout session object
 * @returns {number} Estimated calories burned
 */
export function calcEstimatedCalories(session) {
  if (!session.startedAt || !session.endedAt) return 0;

  const durationMs = new Date(session.endedAt) - new Date(session.startedAt);
  const durationMinutes = durationMs / 1000 / 60;

  // Calorie rates per minute by training type
  const rates = {
    bodybuilding: 5,
    powerlifting: 6,
    crossfit: 8,
  };

  const rate = rates[session.trainingType] || 5;
  return Math.round(durationMinutes * rate);
}

/**
 * Calculate total estimated calories across all sessions
 * @param {Array} sessions - Array of workout session objects
 * @returns {number} Total estimated calories
 */
export function calcTotalCalories(sessions) {
  if (!sessions || sessions.length === 0) return 0;

  return sessions.reduce((total, session) => {
    return total + calcEstimatedCalories(session);
  }, 0);
}

/**
 * Calculate total sets performed for each muscle group across all sessions
 * @param {Array} sessions - Array of workout session objects
 * @returns {Object} Object with muscle groups as keys and set counts as values
 */
export function calcMuscleGroupSets(sessions) {
  if (!sessions || sessions.length === 0) {
    return { chest: 0, back: 0, legs: 0, shoulders: 0, arms: 0, core: 0 };
  }

  const muscleGroupCounts = {
    chest: 0,
    back: 0,
    legs: 0,
    shoulders: 0,
    arms: 0,
    core: 0,
  };

  sessions.forEach((session) => {
    session.exercises.forEach((exercise) => {
      const muscleGroup = exercise.muscleGroup;
      const completedSets = exercise.sets.filter((set) => set.weight && set.reps).length;
      if (muscleGroupCounts[muscleGroup] !== undefined) {
        muscleGroupCounts[muscleGroup] += completedSets;
      }
    });
  });

  return muscleGroupCounts;
}

/**
 * Calculate session count distribution by training type
 * @param {Array} sessions - Array of workout session objects
 * @returns {Object} Object with training types as keys and counts as values
 */
export function calcTypeDistribution(sessions) {
  if (!sessions || sessions.length === 0) {
    return { bodybuilding: 0, powerlifting: 0, crossfit: 0 };
  }

  const distribution = {
    bodybuilding: 0,
    powerlifting: 0,
    crossfit: 0,
  };

  sessions.forEach((session) => {
    const type = session.trainingType;
    if (distribution[type] !== undefined) {
      distribution[type] += 1;
    }
  });

  return distribution;
}

/**
 * Format duration from seconds to human-readable string
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration (e.g., "45 min" or "1h 12min")
 */
export function formatDuration(minutes) {
  if (!minutes || minutes === 0) return "0 min";

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins} min`;
  } else if (mins === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${mins}min`;
  }
}

/**
 * Format number with thousands separator
 * @param {number} num - Number to format
 * @returns {string} Formatted number (e.g., "12,450")
 */
export function formatNumber(num) {
  if (typeof num !== "number") return "0";
  return num.toLocaleString("en-US");
}

/**
 * Get the last N sessions sorted by date (most recent first)
 * @param {Array} sessions - Array of workout session objects
 * @param {number} limit - Number of sessions to return
 * @returns {Array} Last N sessions
 */
export function getLastSessions(sessions, limit = 10) {
  if (!sessions || sessions.length === 0) return [];

  return [...sessions].sort((a, b) => new Date(b.endedAt) - new Date(a.endedAt)).slice(0, limit);
}

/**
 * Get session duration in minutes
 * @param {Object} session - Workout session object
 * @returns {number} Duration in minutes
 */
export function getSessionDuration(session) {
  if (!session.startedAt || !session.endedAt) return 0;

  const durationMs = new Date(session.endedAt) - new Date(session.startedAt);
  return Math.round(durationMs / 1000 / 60);
}

/**
 * Get session volume (total weight × reps)
 * @param {Object} session - Workout session object
 * @returns {number} Session volume in kg
 */
export function getSessionVolume(session) {
  if (!session.exercises) return 0;

  return session.exercises.reduce((total, exercise) => {
    const exerciseVolume = exercise.sets.reduce((setTotal, set) => {
      if (set.weight && set.reps) {
        return setTotal + set.weight * set.reps;
      }
      return setTotal;
    }, 0);
    return total + exerciseVolume;
  }, 0);
}

/**
 * Format date for chart display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date (e.g., "Mon 10 Feb")
 */
export function formatChartDate(dateString) {
  const date = new Date(dateString);
  const options = { weekday: "short", day: "numeric", month: "short" };
  return date.toLocaleDateString("en-US", options);
}

/**
 * Get most common training type (favorite)
 * @param {Array} sessions - Array of workout session objects
 * @returns {string} Most common training type
 */
export function getFavoriteType(sessions) {
  if (!sessions || sessions.length === 0) return "None";

  const distribution = calcTypeDistribution(sessions);
  const sorted = Object.entries(distribution).sort((a, b) => b[1] - a[1]);

  return sorted[0][1] > 0 ? sorted[0][0].charAt(0).toUpperCase() + sorted[0][0].slice(1) : "None";
}

/**
 * Get date of first session (member since)
 * @param {Array} sessions - Array of workout session objects
 * @returns {string} Formatted date or "No sessions yet"
 */
export function getMemberSince(sessions) {
  if (!sessions || sessions.length === 0) return "No sessions yet";

  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(a.startedAt) - new Date(b.startedAt)
  );

  const firstDate = new Date(sortedSessions[0].startedAt);
  return firstDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
