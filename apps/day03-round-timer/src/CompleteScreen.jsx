export function CompleteScreen({ totalRounds, totalElapsed, onGoAgain, onChangeMode }) {
  // Derived: format total elapsed time from seconds into M:SS or H:MM:SS
  const hrs = Math.floor(totalElapsed / 3600);
  const mins = Math.floor((totalElapsed % 3600) / 60);
  const secs = totalElapsed % 60;
  const timeStr =
    hrs > 0
      ? `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
      : `${mins}:${String(secs).padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4 gap-8">
      <div className="text-center">
        <p className="text-5xl font-black mb-2">Done!</p>
        <p className="text-gray-400 text-lg">Great work.</p>
      </div>

      <div className="flex gap-8 text-center">
        <div>
          <p className="text-4xl font-bold">{totalRounds}</p>
          <p className="text-sm text-gray-400 mt-1">Rounds</p>
        </div>
        <div>
          <p className="text-4xl font-bold">{timeStr}</p>
          <p className="text-sm text-gray-400 mt-1">Total Time</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-sm">
        <button
          onClick={onGoAgain}
          className="w-full p-4 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 active:scale-95 transition-all"
        >
          Go Again
        </button>
        <button
          onClick={onChangeMode}
          className="w-full p-4 rounded-xl bg-gray-700 text-gray-200 font-bold text-lg hover:bg-gray-600 active:scale-95 transition-all"
        >
          Change Mode
        </button>
      </div>
    </div>
  );
}
