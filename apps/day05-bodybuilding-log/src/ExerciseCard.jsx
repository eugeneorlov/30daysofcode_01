import { useState } from "react";
import { SetRow } from "./SetRow";

export function ExerciseCard({ exercise, sets, onAddSet, onRemoveSet, onRemoveExercise }) {
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");

  const volume = sets.reduce((sum, s) => sum + s.weight * s.reps, 0);

  function handleAddSet() {
    const w = parseFloat(weight);
    const r = parseInt(reps, 10);
    if (!w || w <= 0 || !r || r <= 0) return;
    onAddSet(exercise.id, { weight: w, reps: r });
    setWeight("");
    setReps("");
  }

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
        <div>
          <h3 className="font-semibold text-white">{exercise.name}</h3>
          <span className="text-xs text-amber-500">{exercise.muscle}</span>
        </div>
        <button
          onClick={() => onRemoveExercise(exercise.id)}
          className="text-sm text-gray-500 hover:text-red-400 transition-colors"
        >
          Remove
        </button>
      </div>

      <div className="p-4 space-y-2">
        {sets.map((set, i) => (
          <SetRow key={i} set={set} index={i} onRemove={(idx) => onRemoveSet(exercise.id, idx)} />
        ))}

        {sets.length > 0 && (
          <p className="text-xs text-gray-500 text-right pt-1">
            Volume: {volume.toLocaleString()} lbs
          </p>
        )}
      </div>

      <div className="flex gap-2 px-4 pb-4">
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="lbs"
          min="0"
          className="flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          data-testid={`weight-input-${exercise.id}`}
        />
        <input
          type="number"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          placeholder="reps"
          min="0"
          className="flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          data-testid={`reps-input-${exercise.id}`}
        />
        <button
          onClick={handleAddSet}
          className="px-4 py-2 rounded-lg bg-amber-500 text-gray-950 font-semibold text-sm hover:bg-amber-400 transition-colors"
        >
          Add Set
        </button>
      </div>
    </div>
  );
}
