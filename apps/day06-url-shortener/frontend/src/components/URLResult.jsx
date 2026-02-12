import { useState } from "react";

export function URLResult({ result }) {
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const fullShortUrl = `http://localhost:8000${result.short_url}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullShortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 shadow-xl">
      <h3 className="text-lg font-semibold text-white mb-4">URL Shortened Successfully! 🎉</h3>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Short URL</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={fullShortUrl}
              readOnly
              className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg font-mono text-sm text-white"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 font-medium transition-all shadow-lg hover:shadow-xl"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Original URL</label>
          <div className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-gray-300 break-all">
            {result.original_url}
          </div>
        </div>
      </div>
    </div>
  );
}
