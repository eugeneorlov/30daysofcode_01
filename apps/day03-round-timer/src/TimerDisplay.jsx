export function TimerDisplay({ timeLeft, isResting }) {
  // Derived state: format seconds into MM:SS for the big countdown display.
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const display = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <div className="flex flex-col items-center justify-center flex-1">
      <span className="text-2xl font-bold uppercase tracking-widest mb-4 opacity-80">
        {isResting ? "REST" : "WORK"}
      </span>
      <time className="text-8xl font-mono font-black tabular-nums tracking-tight">{display}</time>
    </div>
  );
}
