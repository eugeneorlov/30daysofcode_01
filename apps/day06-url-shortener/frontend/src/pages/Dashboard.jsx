import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { URLForm } from "../components/URLForm";
import { URLResult } from "../components/URLResult";
import { URLList } from "../components/URLList";

export function Dashboard() {
  const [latestResult, setLatestResult] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleURLShortened = (result) => {
    setLatestResult(result);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-12 px-4">
      {/* Navigation Bar */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <p className="text-white font-semibold">{user?.name || "User"}</p>
              <p className="text-gray-300 text-sm">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🔗 URL Shortener</h1>
          <p className="text-gray-300">Make your long URLs short and shareable</p>
        </div>

        <div className="flex flex-col items-center gap-8">
          <URLForm onURLShortened={handleURLShortened} />
          <URLResult result={latestResult} />
          <div className="w-full max-w-2xl border-t border-white/20 pt-8">
            <URLList refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </div>
    </div>
  );
}
