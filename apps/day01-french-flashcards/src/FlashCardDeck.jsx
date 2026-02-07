import { useState, useEffect } from "react";
import { FlashCard } from "./FlashCard";

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const CATEGORY_LABELS = {
  all: "All",
  greetings: "Greetings",
  essentials: "Essentials",
  cafe: "Café",
  directions: "Directions",
  gym: "Gym",
};

export function FlashCardDeck({ cards }) {
  const [deck, setDeck] = useState(cards);

  // Lazy initializers read from localStorage on first render only.
  // This avoids reading storage on every re-render while still
  // restoring the user's previous session.
  const [selectedCategory, setSelectedCategory] = useState(
    () => localStorage.getItem("flashcards-selectedCategory") || "all"
  );
  const [currentIndex, setCurrentIndex] = useState(() => {
    const saved = localStorage.getItem("flashcards-currentIndex");
    return saved !== null ? Number(saved) : 0;
  });
  const [flipped, setFlipped] = useState(false);

  // Derived state: filter cards on every render instead of storing a
  // separate filtered array in state. This keeps a single source of
  // truth (selectedCategory + deck) and avoids sync bugs.
  const filteredCards =
    selectedCategory === "all" ? deck : deck.filter((c) => c.category === selectedCategory);

  // Build the list of unique categories from the data so the UI
  // stays in sync if vocabulary.js changes.
  const categories = ["all", ...new Set(cards.map((c) => c.category))];

  const total = filteredCards.length;
  const safeIndex = Math.min(currentIndex, total - 1);
  const card = filteredCards[safeIndex];

  // Persist currentIndex and selectedCategory to localStorage whenever
  // they change. useEffect runs after render so it won't block the UI.
  useEffect(() => {
    localStorage.setItem("flashcards-currentIndex", safeIndex);
  }, [safeIndex]);

  useEffect(() => {
    localStorage.setItem("flashcards-selectedCategory", selectedCategory);
  }, [selectedCategory]);

  function selectCategory(cat) {
    setSelectedCategory(cat);
    setCurrentIndex(0);
    setFlipped(false);
  }

  function goTo(index) {
    setFlipped(false);
    setCurrentIndex(index);
  }

  function next() {
    if (safeIndex < total - 1) goTo(safeIndex + 1);
  }

  function prev() {
    if (safeIndex > 0) goTo(safeIndex - 1);
  }

  function shuffle() {
    // Functional updater avoids stale closure over `deck`.
    // Shuffled order is NOT persisted — it resets on reload.
    setDeck((prev) => shuffleArray(prev));
    setCurrentIndex(0);
    setFlipped(false);
  }

  function reset() {
    setDeck(cards);
    setCurrentIndex(0);
    setFlipped(false);
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto">
      {/* Category filter */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => selectCategory(cat)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {CATEGORY_LABELS[cat] || cat}
          </button>
        ))}
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3 text-sm text-gray-500">
        <span>
          {safeIndex + 1} / {total}
        </span>
        <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${((safeIndex + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <FlashCard card={card} flipped={flipped} onFlip={() => setFlipped((f) => !f)} />

      <p className="text-xs text-gray-400">Click the card to flip</p>

      {/* Navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={prev}
          disabled={safeIndex === 0}
          className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <button
          onClick={shuffle}
          className="px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
        >
          Shuffle
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors"
        >
          Reset
        </button>
        <button
          onClick={next}
          disabled={safeIndex === total - 1}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
