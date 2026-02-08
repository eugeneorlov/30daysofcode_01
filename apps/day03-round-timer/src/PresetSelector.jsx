import { useState } from "react";

const PRESETS = [
  {
    id: "muay-thai",
    emoji: "\uD83E\uDD4A",
    label: "Muay Thai",
    roundSec: 180,
    restSec: 60,
    rounds: 5,
    colors: "from-red-500 to-orange-500",
    text: "text-white",
  },
  {
    id: "bjj",
    emoji: "\uD83E\uDD4B",
    label: "BJJ",
    roundSec: 300,
    restSec: 60,
    rounds: 3,
    colors: "from-blue-800 to-blue-600",
    text: "text-white",
  },
  {
    id: "tabata",
    emoji: "\u26A1",
    label: "Tabata",
    roundSec: 20,
    restSec: 10,
    rounds: 8,
    colors: "from-green-400 to-emerald-500",
    text: "text-gray-900",
  },
  {
    id: "custom",
    emoji: "\u2699\uFE0F",
    label: "Custom",
    roundSec: 0,
    restSec: 0,
    rounds: 0,
    colors: "from-gray-400 to-gray-500",
    text: "text-white",
  },
];

function formatPresetSummary(roundSec, restSec, rounds) {
  const roundMin = Math.floor(roundSec / 60);
  const roundRemSec = roundSec % 60;
  const restMin = Math.floor(restSec / 60);
  const restRemSec = restSec % 60;

  const roundStr =
    roundMin > 0 && roundRemSec > 0
      ? `${roundMin}m${roundRemSec}s`
      : roundMin > 0
        ? `${roundMin}min`
        : `${roundRemSec}s`;
  const restStr =
    restMin > 0 && restRemSec > 0
      ? `${restMin}m${restRemSec}s`
      : restMin > 0
        ? `${restMin}min`
        : `${restRemSec}s`;

  return `${roundStr} \u00D7 ${rounds} rounds, ${restStr} rest`;
}

export function PresetSelector({ onStart }) {
  const [showCustom, setShowCustom] = useState(false);
  const [customRoundMin, setCustomRoundMin] = useState(3);
  const [customRoundSec, setCustomRoundSec] = useState(0);
  const [customRestMin, setCustomRestMin] = useState(1);
  const [customRestSec, setCustomRestSec] = useState(0);
  const [customRounds, setCustomRounds] = useState(5);

  function handlePresetClick(preset) {
    if (preset.id === "custom") {
      setShowCustom(true);
      return;
    }
    onStart({
      roundSec: preset.roundSec,
      restSec: preset.restSec,
      rounds: preset.rounds,
    });
  }

  function handleCustomStart() {
    const roundSec = customRoundMin * 60 + customRoundSec;
    const restSec = customRestMin * 60 + customRestSec;
    if (roundSec <= 0 || customRounds <= 0) return;
    onStart({ roundSec, restSec, rounds: customRounds });
  }

  // Derived: is the custom form valid?
  const customRoundTotal = customRoundMin * 60 + customRoundSec;
  const customValid = customRoundTotal > 0 && customRounds > 0;

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Round Timer</h1>

      <div className="grid grid-cols-1 gap-4 w-full max-w-sm">
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => handlePresetClick(preset)}
            className={`min-h-24 rounded-2xl bg-gradient-to-r ${preset.colors} ${preset.text} p-5 text-left transition-transform active:scale-95`}
          >
            <div className="text-2xl font-bold">
              {preset.emoji} {preset.label}
            </div>
            {preset.id !== "custom" && (
              <div className="mt-1 text-sm opacity-80">
                {formatPresetSummary(preset.roundSec, preset.restSec, preset.rounds)}
              </div>
            )}
            {preset.id === "custom" && (
              <div className="mt-1 text-sm opacity-80">Set your own intervals</div>
            )}
          </button>
        ))}
      </div>

      {/* Custom form — inline below the cards */}
      {showCustom && (
        <div className="mt-6 w-full max-w-sm bg-gray-800 rounded-2xl p-5 text-white">
          <h2 className="text-lg font-semibold mb-4">Custom Setup</h2>

          <div className="space-y-4">
            <fieldset>
              <legend className="text-sm text-gray-400 mb-1">Round Time</legend>
              <div className="flex gap-3">
                <label className="flex-1">
                  <span className="text-xs text-gray-500">Min</span>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    value={customRoundMin}
                    onChange={(e) => setCustomRoundMin(Number(e.target.value))}
                    className="w-full mt-1 rounded-lg bg-gray-700 px-3 py-2 text-center text-lg"
                    data-testid="custom-round-min"
                  />
                </label>
                <label className="flex-1">
                  <span className="text-xs text-gray-500">Sec</span>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    value={customRoundSec}
                    onChange={(e) => setCustomRoundSec(Number(e.target.value))}
                    className="w-full mt-1 rounded-lg bg-gray-700 px-3 py-2 text-center text-lg"
                    data-testid="custom-round-sec"
                  />
                </label>
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-sm text-gray-400 mb-1">Rest Time</legend>
              <div className="flex gap-3">
                <label className="flex-1">
                  <span className="text-xs text-gray-500">Min</span>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    value={customRestMin}
                    onChange={(e) => setCustomRestMin(Number(e.target.value))}
                    className="w-full mt-1 rounded-lg bg-gray-700 px-3 py-2 text-center text-lg"
                    data-testid="custom-rest-min"
                  />
                </label>
                <label className="flex-1">
                  <span className="text-xs text-gray-500">Sec</span>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    value={customRestSec}
                    onChange={(e) => setCustomRestSec(Number(e.target.value))}
                    className="w-full mt-1 rounded-lg bg-gray-700 px-3 py-2 text-center text-lg"
                    data-testid="custom-rest-sec"
                  />
                </label>
              </div>
            </fieldset>

            <label className="block">
              <span className="text-sm text-gray-400">Rounds</span>
              <input
                type="number"
                min={1}
                max={99}
                value={customRounds}
                onChange={(e) => setCustomRounds(Number(e.target.value))}
                className="w-full mt-1 rounded-lg bg-gray-700 px-3 py-2 text-center text-lg"
                data-testid="custom-rounds"
              />
            </label>
          </div>

          <button
            onClick={handleCustomStart}
            disabled={!customValid}
            className="mt-5 w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Start
          </button>
        </div>
      )}
    </div>
  );
}
