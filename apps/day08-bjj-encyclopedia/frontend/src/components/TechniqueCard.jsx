import { useNavigate } from "react-router-dom";

const DIFFICULTY_COLORS = {
  Beginner: "bg-green-100 text-green-800",
  Intermediate: "bg-yellow-100 text-yellow-800",
  Advanced: "bg-red-100 text-red-800",
};

const POSITION_COLORS = {
  Guard: "bg-blue-100 text-blue-800",
  Mount: "bg-purple-100 text-purple-800",
  Back: "bg-indigo-100 text-indigo-800",
  "Side Control": "bg-cyan-100 text-cyan-800",
  "Half Guard": "bg-sky-100 text-sky-800",
  Turtle: "bg-teal-100 text-teal-800",
  Standing: "bg-orange-100 text-orange-800",
  "Open Guard": "bg-violet-100 text-violet-800",
};

const TYPE_COLORS = {
  Submission: "bg-rose-100 text-rose-800",
  Sweep: "bg-amber-100 text-amber-800",
  Escape: "bg-lime-100 text-lime-800",
  Transition: "bg-slate-100 text-slate-800",
  Control: "bg-fuchsia-100 text-fuchsia-800",
};

function Badge({ label, colorClass }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${colorClass}`}>
      {label}
    </span>
  );
}

export function TechniqueCard({ technique, compact = false }) {
  const navigate = useNavigate();
  const firstSentence = technique.description.split(".")[0] + ".";

  return (
    <article
      onClick={() => navigate(`/technique/${technique.id}`)}
      role="article"
      className="cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md hover:border-blue-300"
    >
      <h3 className="mb-2 text-base font-bold text-gray-900">{technique.name}</h3>
      <div className="mb-3 flex flex-wrap gap-1">
        <Badge
          label={technique.position}
          colorClass={POSITION_COLORS[technique.position] || "bg-gray-100 text-gray-700"}
        />
        <Badge
          label={technique.type}
          colorClass={TYPE_COLORS[technique.type] || "bg-gray-100 text-gray-700"}
        />
        <Badge
          label={technique.difficulty}
          colorClass={DIFFICULTY_COLORS[technique.difficulty] || "bg-gray-100 text-gray-700"}
        />
      </div>
      {!compact && (
        <p className="text-sm text-gray-600 line-clamp-2">{firstSentence}</p>
      )}
    </article>
  );
}
