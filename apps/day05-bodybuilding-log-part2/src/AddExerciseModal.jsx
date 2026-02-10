import { useState } from "react";
import { exercises, muscleGroups, trainingTypes } from "./data/exercises";

export function AddExerciseModal({ onSelect, onClose, currentExerciseIds }) {
  const [search, setSearch] = useState("");
  const [filterMuscle, setFilterMuscle] = useState("All");
  const [filterTag, setFilterTag] = useState("All");

  const filtered = exercises.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase());
    const matchesMuscle = filterMuscle === "All" || ex.muscle === filterMuscle;
    const matchesTag = filterTag === "All" || ex.tags.includes(filterTag);
    return matchesSearch && matchesMuscle && matchesTag;
  });

  const grouped = filtered.reduce((acc, ex) => {
    if (!acc[ex.muscle]) acc[ex.muscle] = [];
    acc[ex.muscle].push(ex);
    return acc;
  }, {});

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
      data-testid="add-exercise-modal"
    >
      <div className="bg-gray-900 rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col border border-gray-800">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Add Exercise</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white text-xl transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-4 space-y-3 border-b border-gray-800">
          <input
            type="text"
            placeholder="Search exercises..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            data-testid="exercise-search"
          />

          <div className="flex flex-wrap gap-2">
            {["All", ...muscleGroups].map((m) => (
              <button
                key={m}
                onClick={() => setFilterMuscle(m)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  filterMuscle === m
                    ? "bg-amber-500 text-gray-950"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {["All", ...trainingTypes].map((t) => (
              <button
                key={t}
                onClick={() => setFilterTag(t)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  filterTag === t
                    ? "bg-amber-500 text-gray-950"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {Object.entries(grouped).map(([muscle, exs]) => (
            <div key={muscle}>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
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
                          ? "bg-gray-800/50 text-gray-600 cursor-not-allowed"
                          : "bg-gray-800 hover:bg-amber-500/10 hover:text-amber-500 text-white"
                      }`}
                    >
                      <span>{ex.name}</span>
                      {alreadyAdded && <span className="ml-2 text-xs text-gray-600">Added</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-gray-500 text-center py-4">No exercises found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
