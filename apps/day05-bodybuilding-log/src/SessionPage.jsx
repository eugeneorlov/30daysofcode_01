import { useState, useEffect, useRef } from "react";
import { ExerciseCard } from "./ExerciseCard";
import { AddExerciseModal } from "./AddExerciseModal";
import { trainingTypes } from "./data/exercises";
import { load, save } from "./storage";

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function SessionPage() {
  const [trainingType, setTrainingType] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef(null);

  // Start timer when training type is selected
  useEffect(() => {
    if (!isActive) return;
    intervalRef.current = setInterval(() => {
      setElapsed((t) => t + 1);
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [isActive]);

  function handleSelectType(type) {
    setTrainingType(type);
    setIsActive(true);
    setElapsed(0);
    setExercises([]);
  }

  function handleAddExercise(ex) {
    setExercises((prev) => [...prev, { ...ex, sets: [] }]);
    setShowAddModal(false);
  }

  function handleAddSet(exerciseId, set) {
    setExercises((prev) =>
      prev.map((ex) => (ex.id === exerciseId ? { ...ex, sets: [...ex.sets, set] } : ex))
    );
  }

  function handleRemoveSet(exerciseId, setIndex) {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === exerciseId ? { ...ex, sets: ex.sets.filter((_, i) => i !== setIndex) } : ex
      )
    );
  }

  function handleRemoveExercise(exerciseId) {
    setExercises((prev) => prev.filter((ex) => ex.id !== exerciseId));
  }

  function handleFinish() {
    setIsActive(false);
    clearInterval(intervalRef.current);

    if (exercises.length > 0 && exercises.some((ex) => ex.sets.length > 0)) {
      const session = {
        date: new Date().toISOString().split("T")[0],
        trainingType,
        duration: elapsed,
        exercises: exercises
          .filter((ex) => ex.sets.length > 0)
          .map((ex) => ({
            id: ex.id,
            name: ex.name,
            muscle: ex.muscle,
            sets: ex.sets,
          })),
      };
      const history = load("sessions", []);
      save("sessions", [...history, session]);
    }

    setTrainingType(null);
    setExercises([]);
    setElapsed(0);
  }

  const totalVolume = exercises.reduce(
    (sum, ex) => sum + ex.sets.reduce((s, set) => s + set.weight * set.reps, 0),
    0
  );

  const totalSets = exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
  const currentExerciseIds = exercises.map((ex) => ex.id);

  // Training type selection
  if (!trainingType) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold">Start a Session</h2>
        <p className="text-gray-400">Pick your training style for today.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {trainingTypes.map((type) => (
            <button
              key={type}
              onClick={() => handleSelectType(type)}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center hover:border-amber-500 hover:bg-amber-500/5 transition-colors"
              data-testid={`type-${type.toLowerCase()}`}
            >
              <div className="text-3xl mb-2">
                {type === "Bodybuilding" ? "🏋️" : type === "Powerlifting" ? "🏆" : "⚡"}
              </div>
              <span className="font-semibold text-white">{type}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Active session
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Session header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{trainingType} Session</h2>
          <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
            <span data-testid="session-timer">{formatTime(elapsed)}</span>
            <span>{totalSets} sets</span>
            <span>{totalVolume.toLocaleString()} lbs</span>
          </div>
        </div>
        <button
          onClick={handleFinish}
          className="px-5 py-2 rounded-xl bg-red-500/20 text-red-400 font-semibold hover:bg-red-500/30 transition-colors"
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
            sets={ex.sets}
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
