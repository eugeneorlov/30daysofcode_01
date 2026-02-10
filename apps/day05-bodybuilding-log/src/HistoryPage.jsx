import { load } from "./storage";

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  return `${m} min`;
}

export function HistoryPage() {
  const sessions = load("sessions", []);
  const sorted = [...sessions].sort((a, b) => b.date.localeCompare(a.date));

  if (sorted.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Workout History</h2>
        <p className="text-gray-500">No workouts yet. Start a session to see your history.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Workout History</h2>
      {sorted.map((session, i) => {
        const totalVolume = session.exercises.reduce(
          (sum, ex) => sum + ex.sets.reduce((s, set) => s + set.weight * set.reps, 0),
          0
        );
        const totalSets = session.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);

        return (
          <div key={i} className="bg-gray-900 rounded-xl border border-gray-800 p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-white font-semibold">{session.date}</span>
                <span className="ml-3 text-xs text-amber-500">{session.trainingType}</span>
              </div>
              <span className="text-sm text-gray-500">{formatDuration(session.duration)}</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-400 mb-3">
              <span>{session.exercises.length} exercises</span>
              <span>{totalSets} sets</span>
              <span>{totalVolume.toLocaleString()} lbs</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {session.exercises.map((ex) => (
                <span
                  key={ex.id}
                  className="px-2 py-1 bg-gray-800 rounded-lg text-xs text-gray-300"
                >
                  {ex.name}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
