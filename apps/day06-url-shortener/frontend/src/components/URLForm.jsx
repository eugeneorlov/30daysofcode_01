import { useState } from "react";

export function URLForm({ onURLShortened }) {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error("Failed to shorten URL");
      }

      const data = await response.json();
      onURLShortened(data);
      setUrl("");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-200 mb-2">
            Enter URL to shorten
          </label>
          <div className="flex gap-2">
            <input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/very/long/url"
              className="flex-1 px-4 py-2 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              disabled={isLoading}
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all shadow-lg hover:shadow-xl"
            >
              {isLoading ? "Shortening..." : "Shorten"}
            </button>
          </div>
        </div>
        {error && (
          <div className="text-red-200 text-sm bg-red-500/20 border border-red-500 px-4 py-2 rounded-lg">{error}</div>
        )}
      </div>
    </form>
  );
}
