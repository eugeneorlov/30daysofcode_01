import { useMemo, useState } from "react";
import { FilterBar } from "../components/FilterBar";
import { SearchInput } from "../components/SearchInput";
import { TechniqueCard } from "../components/TechniqueCard";
import { useTechniques } from "../hooks/useTechniques";

function applyFilters(techniques, filters, query) {
  return techniques.filter((t) => {
    if (filters.position?.length && !filters.position.includes(t.position)) return false;
    if (filters.type?.length && !filters.type.includes(t.type)) return false;
    if (filters.difficulty?.length && !filters.difficulty.includes(t.difficulty)) return false;
    if (query) {
      const q = query.toLowerCase();
      if (!t.name.toLowerCase().includes(q) && !t.description.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });
}

export default function BrowsePage() {
  const { techniques, loading, error } = useTechniques();
  const [filters, setFilters] = useState({ position: [], type: [], difficulty: [] });
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () => applyFilters(techniques, filters, query),
    [techniques, filters, query],
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">BJJ Technique Encyclopedia</h1>
        <p className="mt-1 text-gray-500">Browse, search, and navigate 20 techniques</p>
      </header>

      <div className="mb-4">
        <SearchInput value={query} onChange={setQuery} />
      </div>

      <div className="mb-6">
        <FilterBar filters={filters} onFiltersChange={setFilters} />
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <span className="text-gray-400">Loading techniques...</span>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          Failed to load techniques: {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <p className="text-lg">No techniques match your filters.</p>
          <button
            className="mt-3 text-sm text-blue-600 underline hover:text-blue-800 cursor-pointer"
            onClick={() => {
              setFilters({ position: [], type: [], difficulty: [] });
              setQuery("");
            }}
          >
            Clear all filters
          </button>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((t) => (
            <TechniqueCard key={t.id} technique={t} />
          ))}
        </div>
      )}

      {!loading && !error && (
        <p className="mt-4 text-sm text-gray-400">
          Showing {filtered.length} of {techniques.length} techniques
        </p>
      )}
    </div>
  );
}
