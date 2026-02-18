import { useEffect, useReducer } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RelationshipGraph } from "../components/RelationshipGraph";

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
    <span className={`rounded-full px-3 py-1 text-sm font-semibold ${colorClass}`}>
      {label}
    </span>
  );
}

function reducer(_state, action) {
  switch (action.type) {
    case "LOADING":
      return { loading: true, technique: null, error: null };
    case "SUCCESS":
      return { loading: false, technique: action.data, error: null };
    case "ERROR":
      return { loading: false, technique: null, error: action.error };
    default:
      return _state;
  }
}

export default function TechniqueDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [{ loading, technique, error }, dispatch] = useReducer(reducer, {
    loading: true,
    technique: null,
    error: null,
  });

  useEffect(() => {
    dispatch({ type: "LOADING" });
    let cancelled = false;
    fetch(`/api/techniques/${id}`)
      .then((res) => {
        if (res.status === 404) throw new Error("not_found");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!cancelled) dispatch({ type: "SUCCESS", data });
      })
      .catch((err) => {
        if (!cancelled) dispatch({ type: "ERROR", error: err.message });
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <span className="text-gray-400">Loading technique…</span>
      </div>
    );
  }

  if (error === "not_found") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Technique not found</h2>
        <button
          onClick={() => navigate("/")}
          className="mt-4 text-blue-600 underline hover:text-blue-800 cursor-pointer"
        >
          ← Back to browse
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          Failed to load technique: {error}
        </div>
        <button
          onClick={() => navigate("/")}
          className="mt-4 text-blue-600 underline hover:text-blue-800 cursor-pointer"
        >
          ← Back to browse
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <button
        onClick={() => navigate("/")}
        className="mb-6 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
      >
        ← Back to browse
      </button>

      <header className="mb-6">
        <h1 className="mb-3 text-3xl font-bold text-gray-900">{technique.name}</h1>
        <div className="flex flex-wrap gap-2">
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
      </header>

      <p className="mb-8 text-gray-700 leading-relaxed">{technique.description}</p>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <section>
          <h2 className="mb-3 text-xl font-bold text-gray-800">Steps</h2>
          <ol className="space-y-2">
            {technique.steps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 rounded-full bg-blue-600 text-white w-6 h-6 flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </span>
                <span className="text-sm text-gray-700 pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <div className="space-y-6">
          <section>
            <h2 className="mb-3 text-xl font-bold text-gray-800">Common Mistakes</h2>
            <ul className="space-y-2">
              {technique.common_mistakes.map((m, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700">
                  <span className="text-red-400 flex-shrink-0">✕</span>
                  {m}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-gray-800">Counters</h2>
            <ul className="space-y-2">
              {technique.counters.map((c, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700">
                  <span className="text-amber-500 flex-shrink-0">⚡</span>
                  {c}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <hr className="my-8 border-gray-200" />

      <section>
        <RelationshipGraph outgoing={technique.outgoing} incoming={technique.incoming} />
      </section>
    </div>
  );
}
