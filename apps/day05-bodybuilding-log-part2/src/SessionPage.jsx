import { useState, useEffect, useRef } from "react";
import { useUser } from "./context/useUser";
import { ExerciseCard } from "./ExerciseCard";
import { AddExerciseModal } from "./AddExerciseModal";
import { trainingTypes } from "./data/exercises";
import { getSessionDuration, getSessionVolume, formatDuration, formatNumber } from "./utils/stats";

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * LastSessionSummary - Shows summary of the last completed session
 */
function LastSessionSummary({ session }) {
  if (!session) return null;

  const duration = getSessionDuration(session);
  const volume = getSessionVolume(session);
  const date = new Date(session.endedAt).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Last Workout</h3>
        <span className="text-sm text-gray-400">{date}</span>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <div className="text-sm text-gray-400">Type</div>
          <div className="text-white font-semibold">{session.trainingType}</div>
        </div>
        <div>
          <div className="text-sm text-gray-400">Duration</div>
          <div className="text-white font-semibold">{formatDuration(duration)}</div>
        </div>
        <div>
          <div className="text-sm text-gray-400">Volume</div>
          <div className="text-white font-semibold">{formatNumber(volume)} kg</div>
        </div>
      </div>
    </div>
  );
}

/**
 * SessionSummaryToast - Shown briefly after completing a session
 */
function SessionSummaryToast({ session, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const duration = getSessionDuration(session);
  const volume = getSessionVolume(session);

  return (
    <div className="fixed bottom-4 right-4 bg-green-900 border border-green-700 rounded-lg p-4 shadow-lg max-w-sm animate-slide-up z-50">
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-white font-semibold">Session Saved! 🎉</h4>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          ✕
        </button>
      </div>
      <p className="text-sm text-gray-300">
        {formatDuration(duration)} • {formatNumber(volume)} kg volume
      </p>
    </div>
  );
}

export function SessionPage() {
  const { user, sessions, activeSession, startSession, updateActiveSession, endSession } =
    useUser();
  const [showAddModal, setShowAddModal] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [lastCompleted, setLastCompleted] = useState(null);
  const intervalRef = useRef(null);

  // Calculate elapsed time based on activeSession startedAt
  useEffect(() => {
    if (!activeSession) return;

    const updateElapsed = () => {
      const startTime = new Date(activeSession.startedAt);
      const now = new Date();
      const elapsedSeconds = Math.floor((now - startTime) / 1000);
      setElapsed(elapsedSeconds);
    };

    // Update immediately
    updateElapsed();

    // Then update every second
    intervalRef.current = setInterval(updateElapsed, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [activeSession]);

  function handleSelectType(type) {
    startSession(type);
  }

  function handleAddExercise(ex) {
    const exercises = activeSession?.exercises || [];
    const newExercise = {
      ...ex,
      sets: [],
    };
    updateActiveSession({
      exercises: [...exercises, newExercise],
    });
    setShowAddModal(false);
  }

  function handleAddSet(exerciseId, set) {
    const exercises = activeSession?.exercises || [];
    const updated = exercises.map((ex) =>
      ex.id === exerciseId ? { ...ex, sets: [...ex.sets, set] } : ex
    );
    updateActiveSession({ exercises: updated });
  }

  function handleRemoveSet(exerciseId, setIndex) {
    const exercises = activeSession?.exercises || [];
    const updated = exercises.map((ex) =>
      ex.id === exerciseId ? { ...ex, sets: ex.sets.filter((_, i) => i !== setIndex) } : ex
    );
    updateActiveSession({ exercises: updated });
  }

  function handleRemoveExercise(exerciseId) {
    const exercises = activeSession?.exercises || [];
    const updated = exercises.filter((ex) => ex.id !== exerciseId);
    updateActiveSession({ exercises: updated });
  }

  function handleFinish() {
    if (!activeSession) return;

    // Only save if there are completed sets
    const hasCompletedSets = activeSession.exercises.some((ex) => ex.sets && ex.sets.length > 0);

    if (hasCompletedSets) {
      const completedSession = endSession();
      setLastCompleted(completedSession);
      setShowSummary(true);
    } else {
      // Just cancel if no sets were logged
      endSession();
    }

    setElapsed(0);
  }

  // Get last session for display
  const lastSession = sessions.length > 0 ? sessions[sessions.length - 1] : null;

  // Calculate current session stats
  const exercises = activeSession?.exercises || [];
  const totalVolume = exercises.reduce(
    (sum, ex) =>
      sum + (ex.sets?.reduce((s, set) => s + (set.weight || 0) * (set.reps || 0), 0) || 0),
    0
  );
  const totalSets = exercises.reduce((sum, ex) => sum + (ex.sets?.length || 0), 0);
  const currentExerciseIds = exercises.map((ex) => ex.id);

  // Training type selection (no active session)
  if (!activeSession) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Last session summary */}
        {lastSession && <LastSessionSummary session={lastSession} />}

        <div>
          <h2 className="text-2xl font-bold">Start a Session</h2>
          <p className="text-gray-400">Pick your training style for today.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {trainingTypes.map((type) => {
            const isDefault = user?.defaultTrainingType === type.toLowerCase();
            return (
              <button
                key={type}
                onClick={() => handleSelectType(type)}
                className={`bg-gray-900 border rounded-xl p-6 text-center hover:border-amber-500 hover:bg-amber-500/5 transition-colors relative ${
                  isDefault ? "border-amber-500/50" : "border-gray-800"
                }`}
                data-testid={`type-${type.toLowerCase()}`}
              >
                {isDefault && (
                  <div className="absolute top-2 right-2 text-xs bg-amber-500 text-white px-2 py-1 rounded">
                    Default
                  </div>
                )}
                <div className="text-3xl mb-2">
                  {type === "Bodybuilding" ? "🏋️" : type === "Powerlifting" ? "🏆" : "⚡"}
                </div>
                <span className="font-semibold text-white">{type}</span>
              </button>
            );
          })}
        </div>

        {/* Session summary toast */}
        {showSummary && lastCompleted && (
          <SessionSummaryToast session={lastCompleted} onClose={() => setShowSummary(false)} />
        )}
      </div>
    );
  }

  // Active session
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Session header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{activeSession.trainingType} Session</h2>
          <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
            <span data-testid="session-timer">{formatTime(elapsed)}</span>
            <span>{totalSets} sets</span>
            <span>{totalVolume.toLocaleString()} kg</span>
          </div>
        </div>
        <button
          onClick={handleFinish}
          className="px-5 py-2 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-colors"
          data-testid="finish-btn"
        >
          Finish
        </button>
      </div>

      {/* Exercise list */}
      <div className="space-y-4">
        {exercises.map((ex) => (
          <ExerciseCard
            key={ex.id}
            exercise={ex}
            sets={ex.sets || []}
            onAddSet={handleAddSet}
            onRemoveSet={handleRemoveSet}
            onRemoveExercise={handleRemoveExercise}
          />
        ))}
      </div>

      {/* Add exercise button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="w-full py-4 rounded-xl border-2 border-dashed border-gray-700 text-gray-400 hover:border-amber-500 hover:text-amber-500 transition-colors font-medium"
        data-testid="add-exercise-btn"
      >
        + Add Exercise
      </button>

      {showAddModal && (
        <AddExerciseModal
          onSelect={handleAddExercise}
          onClose={() => setShowAddModal(false)}
          currentExerciseIds={currentExerciseIds}
        />
      )}
    </div>
  );
}
