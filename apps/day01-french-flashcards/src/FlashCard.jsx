export function FlashCard({ card, flipped, onFlip }) {
  return (
    <div
      className="perspective-[1000px] w-full max-w-md mx-auto h-64 cursor-pointer"
      onClick={onFlip}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Front — French */}
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-white shadow-lg border border-gray-200 [backface-visibility:hidden] px-6">
          <span className="text-sm font-medium text-blue-500 uppercase tracking-wide mb-2">
            Francais
          </span>
          <p className="text-3xl font-bold text-gray-900 text-center">{card.french}</p>
        </div>

        {/* Back — English */}
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)] px-6">
          <span className="text-sm font-medium text-blue-200 uppercase tracking-wide mb-2">
            English
          </span>
          <p className="text-3xl font-bold text-center">{card.english}</p>
          {card.example && (
            <p className="mt-4 text-sm text-blue-100 italic text-center">
              &ldquo;{card.example}&rdquo;
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
