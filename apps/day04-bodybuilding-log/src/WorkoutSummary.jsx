import { totalVolume } from "./storage";

export function WorkoutSummary({ workout }) {
  // Derived stats from the workout data
  const exerciseCount = workout.exercises.length;
  const allSets = workout.exercises.flatMap((ex) => ex.sets);
  const setCount = allSets.length;
  const volume = totalVolume(allSets);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">{workout.date}</h3>
      </div>
      <div className="flex gap-6 text-sm">
        <div>
          <p className="text-2xl font-bold text-gray-900">{exerciseCount}</p>
          <p className="text-gray-400">Exercises</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{setCount}</p>
          <p className="text-gray-400">Sets</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{volume.toLocaleString()}</p>
          <p className="text-gray-400">lbs Volume</p>
        </div>
      </div>

      {/* Exercise breakdown */}
      <div className="mt-3 space-y-1">
        {workout.exercises.map((ex) => (
          <div key={ex.id} className="text-sm text-gray-600 flex justify-between">
            <span>{ex.name}</span>
            <span className="text-gray-400">
              {ex.sets.length} sets &middot; {totalVolume(ex.sets).toLocaleString()} lbs
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
