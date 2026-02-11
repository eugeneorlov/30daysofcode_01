import { useState } from "react";
import { URLForm } from "./components/URLForm";
import { URLResult } from "./components/URLResult";
import { URLList } from "./components/URLList";

function App() {
  const [latestResult, setLatestResult] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleURLShortened = (result) => {
    setLatestResult(result);
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🔗 URL Shortener
          </h1>
          <p className="text-gray-600">
            Make your long URLs short and shareable
          </p>
        </div>

        <div className="flex flex-col items-center gap-8">
          <URLForm onURLShortened={handleURLShortened} />
          <URLResult result={latestResult} />
          <div className="w-full max-w-2xl border-t border-gray-300 pt-8">
            <URLList refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
