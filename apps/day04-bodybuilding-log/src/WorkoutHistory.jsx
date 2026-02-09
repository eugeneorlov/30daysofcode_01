import { WorkoutSummary } from "./WorkoutSummary";

export function WorkoutHistory({ workouts }) {
  if (workouts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-lg">No workouts yet.</p>
        <p className="text-sm mt-1">Start logging to see your history here.</p>
      </div>
    );
  }

  // Derived: sort workouts by date, newest first
  const sorted = [...workouts].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-4">
      {sorted.map((workout) => (
        <WorkoutSummary key={workout.date} workout={workout} />
      ))}
    </div>
  );
}
