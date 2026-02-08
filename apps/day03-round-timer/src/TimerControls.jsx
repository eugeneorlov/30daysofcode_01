export function TimerControls({ isRunning, onToggle, onReset }) {
  return (
    <div className="flex gap-4 w-full max-w-sm mx-auto">
      <button
        onClick={onToggle}
        className="flex-1 p-4 rounded-xl bg-white/20 text-white font-bold text-lg backdrop-blur-sm active:scale-95 transition-transform"
      >
        {isRunning ? "Pause" : "Resume"}
      </button>
      <button
        onClick={onReset}
        className="flex-1 p-4 rounded-xl bg-white/10 text-white/80 font-bold text-lg backdrop-blur-sm active:scale-95 transition-transform"
      >
        Reset
      </button>
    </div>
  );
}
