import { useState } from "react";

export function SetLogger({ exercise, sets, onAddSet, onRemoveSet, onRemoveExercise }) {
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");

  function handleAdd() {
    const w = Number(weight);
    const r = Number(reps);
    if (w > 0 && r > 0) {
      onAddSet(exercise.id, { weight: w, reps: r });
      setWeight("");
      setReps("");
    }
  }

  // Derived: total volume for this exercise
  const volume = sets.reduce((sum, s) => sum + s.weight * s.reps, 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div>
          <h3 className="font-semibold text-gray-900">{exercise.name}</h3>
          <p className="text-xs text-gray-400">{exercise.muscle}</p>
        </div>
        <button
          onClick={() => onRemoveExercise(exercise.id)}
          className="text-red-400 hover:text-red-600 text-sm font-medium transition-colors"
        >
          Remove
        </button>
      </div>

      {/* Existing sets */}
      {sets.length > 0 && (
        <div className="divide-y divide-gray-100">
          {sets.map((s, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-2 text-sm">
              <span className="text-gray-500 w-8">#{i + 1}</span>
              <span className="text-gray-900 font-medium">
                {s.weight} lbs &times; {s.reps} reps
              </span>
              <button
                onClick={() => onRemoveSet(exercise.id, i)}
                className="text-gray-300 hover:text-red-500 transition-colors"
                aria-label={`Remove set ${i + 1}`}
              >
                &times;
              </button>
            </div>
          ))}
          <div className="px-4 py-2 text-xs text-gray-400">
            Volume: {volume.toLocaleString()} lbs
          </div>
        </div>
      )}

      {/* Add set form */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-100">
        <input
          type="number"
          placeholder="lbs"
          min={1}
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="w-20 px-3 py-2 rounded-lg border border-gray-200 text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          data-testid={`weight-input-${exercise.id}`}
        />
        <input
          type="number"
          placeholder="reps"
          min={1}
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          className="w-20 px-3 py-2 rounded-lg border border-gray-200 text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          data-testid={`reps-input-${exercise.id}`}
        />
        <button
          onClick={handleAdd}
          className="flex-1 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Add Set
        </button>
      </div>
    </div>
  );
}
