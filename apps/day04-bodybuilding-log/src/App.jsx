import { useState, useEffect } from "react";
import { ExerciseSelector } from "./ExerciseSelector";
import { SetLogger } from "./SetLogger";
import { WorkoutHistory } from "./WorkoutHistory";
import { loadWorkouts, saveWorkouts, todayKey } from "./storage";
import { exercises } from "./data/exercises";

function App() {
  const [tab, setTab] = useState("workout"); // workout | history
  const [showSelector, setShowSelector] = useState(false);

  // Lazy initializer loads saved workouts from localStorage once
  const [workouts, setWorkouts] = useState(() => loadWorkouts());

  // Today's workout: find existing or start empty.
  // Derived from workouts array — no separate state needed.
  const today = todayKey();
  const todayWorkout = workouts.find((w) => w.date === today) || {
    date: today,
    exercises: [],
  };

  // Persist to localStorage whenever workouts change
  useEffect(() => {
    saveWorkouts(workouts);
  }, [workouts]);

  function updateTodayWorkout(updatedExercises) {
    setWorkouts((prev) => {
      const existing = prev.find((w) => w.date === today);
      if (existing) {
        return prev.map((w) => (w.date === today ? { ...w, exercises: updatedExercises } : w));
      }
      return [...prev, { date: today, exercises: updatedExercises }];
    });
  }

  function handleAddExercise(exercise) {
    const newEntry = { id: exercise.id, name: exercise.name, muscle: exercise.muscle, sets: [] };
    updateTodayWorkout([...todayWorkout.exercises, newEntry]);
    setShowSelector(false);
  }

  function handleRemoveExercise(exerciseId) {
    updateTodayWorkout(todayWorkout.exercises.filter((ex) => ex.id !== exerciseId));
  }

  function handleAddSet(exerciseId, set) {
    updateTodayWorkout(
      todayWorkout.exercises.map((ex) =>
        ex.id === exerciseId ? { ...ex, sets: [...ex.sets, set] } : ex
      )
    );
  }

  function handleRemoveSet(exerciseId, setIndex) {
    updateTodayWorkout(
      todayWorkout.exercises.map((ex) =>
        ex.id === exerciseId ? { ...ex, sets: ex.sets.filter((_, i) => i !== setIndex) } : ex
      )
    );
  }

  // Derived: IDs of exercises already in today's workout
  const currentExerciseIds = todayWorkout.exercises.map((ex) => ex.id);

  // Derived: full exercise objects for SetLogger (need muscle group label)
  function getExerciseInfo(id) {
    return exercises.find((e) => e.id === id) || { id, name: id, muscle: "" };
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Bodybuilding Log</h1>
        <p className="text-sm text-gray-400">{today}</p>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white">
        <button
          onClick={() => setTab("workout")}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            tab === "workout"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Today
        </button>
        <button
          onClick={() => setTab("history")}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            tab === "history"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          History
        </button>
      </div>

      <main className="max-w-lg mx-auto px-4 py-6">
        {tab === "workout" && (
          <div className="space-y-4">
            {/* Exercise cards with set loggers */}
            {todayWorkout.exercises.map((ex) => (
              <SetLogger
                key={ex.id}
                exercise={getExerciseInfo(ex.id)}
                sets={ex.sets}
                onAddSet={handleAddSet}
                onRemoveSet={handleRemoveSet}
                onRemoveExercise={handleRemoveExercise}
              />
            ))}

            {/* Add exercise button / selector */}
            {showSelector ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">Add Exercise</h2>
                  <button
                    onClick={() => setShowSelector(false)}
                    className="text-sm text-gray-400 hover:text-gray-600"
                  >
                    Cancel
                  </button>
                </div>
                <ExerciseSelector
                  onSelect={handleAddExercise}
                  currentExerciseIds={currentExerciseIds}
                />
              </div>
            ) : (
              <button
                onClick={() => setShowSelector(true)}
                className="w-full py-4 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 font-medium hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                + Add Exercise
              </button>
            )}

            {todayWorkout.exercises.length === 0 && !showSelector && (
              <p className="text-center text-gray-400 text-sm mt-4">
                Tap &quot;+ Add Exercise&quot; to start your workout.
              </p>
            )}
          </div>
        )}

        {tab === "history" && <WorkoutHistory workouts={workouts} />}
      </main>
    </div>
  );
}

export default App;
