import { useState } from "react";
import { exercises, muscleGroups } from "./data/exercises";

export function ExerciseSelector({ onSelect, currentExerciseIds }) {
  const [search, setSearch] = useState("");
  const [filterMuscle, setFilterMuscle] = useState("All");

  // Derived: filter exercises by search text and muscle group.
  // No separate state needed — recomputed on every render.
  const filtered = exercises.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase());
    const matchesMuscle = filterMuscle === "All" || ex.muscle === filterMuscle;
    return matchesSearch && matchesMuscle;
  });

  // Derived: group filtered exercises by muscle for display
  const grouped = filtered.reduce((acc, ex) => {
    if (!acc[ex.muscle]) acc[ex.muscle] = [];
    acc[ex.muscle].push(ex);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search exercises..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        data-testid="exercise-search"
      />

      <div className="flex flex-wrap gap-2">
        {["All", ...muscleGroups].map((muscle) => (
          <button
            key={muscle}
            onClick={() => setFilterMuscle(muscle)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filterMuscle === muscle
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {muscle}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {Object.entries(grouped).map(([muscle, exs]) => (
          <div key={muscle}>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              {muscle}
            </h3>
            <div className="space-y-1">
              {exs.map((ex) => {
                const alreadyAdded = currentExerciseIds.includes(ex.id);
                return (
                  <button
                    key={ex.id}
                    onClick={() => !alreadyAdded && onSelect(ex)}
                    disabled={alreadyAdded}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      alreadyAdded
                        ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                        : "bg-white hover:bg-blue-50 text-gray-900"
                    }`}
                  >
                    {ex.name}
                    {alreadyAdded && <span className="ml-2 text-xs text-gray-400">Added</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-gray-400 text-center py-4">No exercises found.</p>
        )}
      </div>
    </div>
  );
}
