export function RoundProgress({ currentRound, totalRounds }) {
  // Derived state: progress percentage calculated from round numbers,
  // not stored separately. Avoids sync issues if rounds change.
  const pct = (currentRound / totalRounds) * 100;

  return (
    <div className="w-full max-w-sm mx-auto text-center">
      <p className="text-lg font-semibold opacity-90 mb-2">
        Round {currentRound} of {totalRounds}
      </p>
      <div className="h-2 bg-white/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-white/70 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
