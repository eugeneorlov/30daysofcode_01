export function SetRow({ set, index, onRemove }) {
  return (
    <div className="flex items-center justify-between py-2 px-3 bg-gray-800 rounded-lg">
      <div className="flex items-center gap-4">
        <span className="text-xs text-gray-500 w-6">#{index + 1}</span>
        <span className="text-white font-medium">{set.weight} lbs</span>
        <span className="text-gray-400">&times;</span>
        <span className="text-white font-medium">{set.reps} reps</span>
      </div>
      <button
        onClick={() => onRemove(index)}
        className="text-gray-500 hover:text-red-400 text-sm transition-colors"
        aria-label={`Remove set ${index + 1}`}
      >
        ✕
      </button>
    </div>
  );
}
