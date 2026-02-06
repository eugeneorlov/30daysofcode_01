import { useState, useCallback } from "react";
import { FlashCard } from "./FlashCard";

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function FlashCardDeck({ cards }) {
  const [deck, setDeck] = useState(cards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = deck[currentIndex];
  const total = deck.length;

  const goTo = useCallback((index) => {
    setFlipped(false);
    setCurrentIndex(index);
  }, []);

  const next = useCallback(() => {
    if (currentIndex < total - 1) goTo(currentIndex + 1);
  }, [currentIndex, total, goTo]);

  const prev = useCallback(() => {
    if (currentIndex > 0) goTo(currentIndex - 1);
  }, [currentIndex, goTo]);

  const shuffle = useCallback(() => {
    setDeck(shuffleArray(deck));
    setCurrentIndex(0);
    setFlipped(false);
  }, [deck]);

  const reset = useCallback(() => {
    setDeck(cards);
    setCurrentIndex(0);
    setFlipped(false);
  }, [cards]);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      {/* Progress */}
      <div className="flex items-center gap-3 text-sm text-gray-500">
        <span>
          {currentIndex + 1} / {total}
        </span>
        <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
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
          disabled={currentIndex === 0}
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
          disabled={currentIndex === total - 1}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
