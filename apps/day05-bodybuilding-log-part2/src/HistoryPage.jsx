import { useUser } from "./context/useUser";
import { getSessionDuration, getSessionVolume, formatDuration, formatNumber } from "./utils/stats";

export function HistoryPage() {
  const { sessions } = useUser();

  // Sort sessions by date (most recent first)
  const sorted = [...sessions].sort((a, b) => new Date(b.endedAt) - new Date(a.endedAt));

  if (sorted.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-white">Workout History</h2>
        <p className="text-gray-400">No workouts yet. Start a session to see your history.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold text-white">Workout History</h2>
      <p className="text-gray-400">{sorted.length} workouts completed</p>

      {sorted.map((session, i) => {
        const duration = getSessionDuration(session);
        const totalVolume = getSessionVolume(session);
        const totalSets = session.exercises.reduce((sum, ex) => sum + (ex.sets?.length || 0), 0);
        const date = new Date(session.endedAt).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        });

        return (
          <div key={session.id || i} className="bg-gray-900 rounded-xl border border-gray-800 p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-white font-semibold">{date}</span>
                <span className="ml-3 text-xs px-2 py-1 bg-amber-500/20 text-amber-500 rounded">
                  {session.trainingType}
                </span>
              </div>
              <span className="text-sm text-gray-400">{formatDuration(duration)}</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-400 mb-3">
              <span>{session.exercises.length} exercises</span>
              <span>{totalSets} sets</span>
              <span>{formatNumber(totalVolume)} kg</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {session.exercises.map((ex, idx) => (
                <span
                  key={ex.id || idx}
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
