import { useState, useEffect, useRef } from "react";
import { PresetSelector } from "./PresetSelector";
import { TimerDisplay } from "./TimerDisplay";
import { TimerControls } from "./TimerControls";
import { RoundProgress } from "./RoundProgress";
import { CompleteScreen } from "./CompleteScreen";
import { playWarningBeep, playPhaseEndBeep, playCompleteBeep } from "./audio";

// Background color is derived from the current timer state.
// The ENTIRE screen changes color so it's visible from across the gym.
function getBackgroundClass(isResting, timeLeft, phaseDuration) {
  if (isResting) return "from-blue-500 to-blue-700";

  // Derived: calculate percentage remaining from timeLeft and total phase duration.
  // No extra state needed — just math on existing values.
  const pctRemaining = phaseDuration > 0 ? timeLeft / phaseDuration : 1;

  if (pctRemaining <= 0.1) return "from-red-500 to-red-700";
  if (pctRemaining <= 0.5) return "from-amber-400 to-amber-600";
  return "from-green-500 to-green-700";
}

export function RoundTimer() {
  const [screen, setScreen] = useState("selector"); // selector | timer | complete
  const [config, setConfig] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [isResting, setIsResting] = useState(false);

  // Track total elapsed time for the complete screen
  const [totalElapsed, setTotalElapsed] = useState(0);

  // Refs let the interval callback read the LATEST state values.
  // Without refs, the callback's closure captures state from the render
  // when the interval was created — and never sees updates.
  const configRef = useRef(config);
  const isRestingRef = useRef(isResting);
  const currentRoundRef = useRef(currentRound);

  // Keep refs in sync with state after every render.
  // useEffect with no dependency array runs after each render, ensuring
  // the interval callback always reads the latest values from refs.
  useEffect(() => {
    configRef.current = config;
    isRestingRef.current = isResting;
    currentRoundRef.current = currentRound;
  });

  // useEffect + setInterval pattern for the countdown.
  //
  // WHY cleanup is needed: without `return () => clearInterval(...)`,
  // pausing or unmounting would leave orphan intervals still ticking,
  // causing stale updates and memory leaks. The cleanup runs before
  // every re-render that changes deps and on unmount.
  //
  // WHY functional state updates: setInterval captures state from
  // the render when it was created (closure). Using `setTimeLeft(t => t - 1)`
  // gives us the latest value regardless of when the closure was created.
  //
  // Phase transitions (work→rest, rest→next round, final→complete) live
  // inside the interval callback so that setState calls happen in an
  // async callback — not synchronously in an effect body — avoiding
  // the react-hooks/set-state-in-effect cascading render warning.
  useEffect(() => {
    if (!isRunning) return;

    const intervalId = setInterval(() => {
      setTotalElapsed((t) => t + 1);

      // Functional updater: receives the latest timeLeft even when
      // React batches multiple interval ticks (e.g. during tests with
      // fake timers advancing many seconds at once).
      setTimeLeft((t) => {
        const next = Math.max(0, t - 1);

        if (next > 0) {
          // 10-second warning beep
          if (next === 10) playWarningBeep();
          return next;
        }

        // Time has reached 0 — handle phase transition.
        // Read other state values from refs since we're inside a
        // functional updater and can't access current state directly.
        const cfg = configRef.current;
        const resting = isRestingRef.current;
        const round = currentRoundRef.current;

        if (!resting) {
          // Work phase just ended
          const isFinalRound = round >= cfg.rounds;
          if (isFinalRound) {
            // Workout complete — stop timer, show results
            setIsRunning(false);
            setScreen("complete");
            playCompleteBeep();
            return 0;
          }
          // Switch to rest phase
          setIsResting(true);
          playPhaseEndBeep();
          return cfg.restSec;
        }

        // Rest phase just ended — start next round
        setIsResting(false);
        setCurrentRound((r) => r + 1);
        playPhaseEndBeep();
        return cfg.roundSec;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isRunning]);

  function handleStart(newConfig) {
    setConfig(newConfig);
    setTimeLeft(newConfig.roundSec);
    setCurrentRound(1);
    setIsResting(false);
    setIsRunning(true);
    setTotalElapsed(0);
    setScreen("timer");
  }

  function handleToggle() {
    setIsRunning((r) => !r);
  }

  function handleReset() {
    setTimeLeft(config.roundSec);
    setCurrentRound(1);
    setIsResting(false);
    setIsRunning(false);
    setTotalElapsed(0);
  }

  function handleBack() {
    setIsRunning(false);
    setScreen("selector");
  }

  function handleGoAgain() {
    handleStart(config);
  }

  function handleChangeMode() {
    setScreen("selector");
  }

  if (screen === "selector") {
    return <PresetSelector onStart={handleStart} />;
  }

  if (screen === "complete") {
    return (
      <CompleteScreen
        totalRounds={config.rounds}
        totalElapsed={totalElapsed}
        onGoAgain={handleGoAgain}
        onChangeMode={handleChangeMode}
      />
    );
  }

  // Derived: background gradient class from current phase and time remaining
  const bgClass = getBackgroundClass(isResting, timeLeft, config.roundSec);

  return (
    <div
      className={`min-h-screen bg-gradient-to-b ${bgClass} text-white flex flex-col px-4 py-6 transition-colors duration-500`}
    >
      {/* Back button */}
      <button
        onClick={handleBack}
        className="self-start text-white/70 font-medium text-sm mb-4 hover:text-white transition-colors"
      >
        &larr; Back
      </button>

      <TimerDisplay timeLeft={timeLeft} isResting={isResting} />

      <div className="flex flex-col gap-6 pb-8">
        <RoundProgress currentRound={currentRound} totalRounds={config.rounds} />
        <TimerControls isRunning={isRunning} onToggle={handleToggle} onReset={handleReset} />
      </div>
    </div>
  );
}
