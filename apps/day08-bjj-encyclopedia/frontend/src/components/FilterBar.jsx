const POSITIONS = ["Guard", "Mount", "Back", "Side Control", "Half Guard", "Turtle", "Standing", "Open Guard"];
const TYPES = ["Submission", "Sweep", "Escape", "Transition", "Control"];
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

function ChipGroup({ label, options, selected, onToggle }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 min-w-[64px]">
        {label}
      </span>
      {options.map((opt) => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            onClick={() => onToggle(opt)}
            aria-pressed={active}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors cursor-pointer border ${
              active
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-600"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export function FilterBar({ filters, onFiltersChange }) {
  function toggle(group, value) {
    const current = filters[group] || [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFiltersChange({ ...filters, [group]: next });
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <ChipGroup
        label="Position"
        options={POSITIONS}
        selected={filters.position || []}
        onToggle={(v) => toggle("position", v)}
      />
      <ChipGroup
        label="Type"
        options={TYPES}
        selected={filters.type || []}
        onToggle={(v) => toggle("type", v)}
      />
      <ChipGroup
        label="Difficulty"
        options={DIFFICULTIES}
        selected={filters.difficulty || []}
        onToggle={(v) => toggle("difficulty", v)}
      />
    </div>
  );
}
