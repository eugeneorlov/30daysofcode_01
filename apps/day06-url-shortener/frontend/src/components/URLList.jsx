import { useEffect, useState } from "react";

export function URLList({ refreshTrigger }) {
  const [urls, setUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchURLs();
  }, [refreshTrigger]);

  const fetchURLs = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/urls");
      if (!response.ok) {
        throw new Error("Failed to fetch URLs");
      }
      const data = await response.json();
      setUrls(data.urls);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (isLoading) {
    return <div className="w-full max-w-2xl text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="w-full max-w-2xl text-center text-red-600">{error}</div>;
  }

  if (urls.length === 0) {
    return (
      <div className="w-full max-w-2xl text-center text-gray-500">
        No URLs shortened yet. Create your first one above!
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Shortened URLs ({urls.length})</h3>
      <div className="space-y-2">
        {urls.map((url) => (
          <div
            key={url.short_code}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm font-semibold text-blue-600">
                    {url.short_code}
                  </span>
                  <button
                    onClick={() => copyToClipboard(`http://localhost:8000${url.short_url}`)}
                    className="text-gray-400 hover:text-gray-600"
                    title="Copy short URL"
                  >
                    📋
                  </button>
                </div>
                <div className="text-sm text-gray-600 break-all">→ {url.original_url}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
