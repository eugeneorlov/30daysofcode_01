import { FlashCardDeck } from "./FlashCardDeck";
import { vocabulary } from "./data/vocabulary";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-900">French Flashcards</h1>
        <p className="mt-2 text-gray-500">Learn essential French words and phrases</p>
      </header>

      <FlashCardDeck cards={vocabulary} />
    </div>
  );
}

export default App;
