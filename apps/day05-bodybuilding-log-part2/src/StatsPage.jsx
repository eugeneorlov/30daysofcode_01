import { load } from "./storage";

export function StatsPage() {
  const sessions = load("sessions", []);

  if (sessions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Stats</h2>
        <p className="text-gray-500">No data yet. Complete a session to see your stats.</p>
      </div>
    );
  }

  const totalSessions = sessions.length;
  const totalVolume = sessions.reduce(
    (sum, s) =>
      sum +
      s.exercises.reduce(
        (eSum, ex) => eSum + ex.sets.reduce((sSum, set) => sSum + set.weight * set.reps, 0),
        0
      ),
    0
  );
  const totalSets = sessions.reduce(
    (sum, s) => sum + s.exercises.reduce((eSum, ex) => eSum + ex.sets.length, 0),
    0
  );
  const totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Stats</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 text-center">
          <p className="text-3xl font-bold text-amber-500">{totalSessions}</p>
          <p className="text-sm text-gray-400 mt-1">Sessions</p>
        </div>
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 text-center">
          <p className="text-3xl font-bold text-amber-500">{totalVolume.toLocaleString()}</p>
          <p className="text-sm text-gray-400 mt-1">Total Volume (lbs)</p>
        </div>
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 text-center">
          <p className="text-3xl font-bold text-amber-500">{totalSets}</p>
          <p className="text-sm text-gray-400 mt-1">Total Sets</p>
        </div>
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 text-center">
          <p className="text-3xl font-bold text-amber-500">{Math.round(totalDuration / 60)}</p>
          <p className="text-sm text-gray-400 mt-1">Minutes Trained</p>
        </div>
      </div>
      <p className="text-sm text-gray-600 text-center">
        Charts coming in Part 2 — powered by Recharts.
      </p>
    </div>
  );
}
