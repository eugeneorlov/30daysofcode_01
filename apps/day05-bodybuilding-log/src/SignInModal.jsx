import { useState } from "react";
import { useUser } from "./context/useUser";
import { useNavigate } from "react-router-dom";

const avatars = ["💪", "🏋️", "🔥", "⚡", "🦍", "🐺", "🦁", "🏆"];

export function SignInModal({ onClose }) {
  const { signIn } = useUser();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [avatar, setAvatar] = useState("💪");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Name is required.");
      return;
    }
    const ageNum = parseInt(age, 10);
    if (!age || isNaN(ageNum) || ageNum < 13 || ageNum > 120) {
      setError("Enter a valid age (13–120).");
      return;
    }
    signIn({ name: trimmedName, age: ageNum, avatar });
    navigate("/app/session");
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
      data-testid="signin-modal"
    >
      <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md border border-gray-800">
        <h2 className="text-2xl font-bold text-white mb-6">Welcome to IronLog</h2>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              data-testid="name-input"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Your age"
              min="13"
              max="120"
              className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              data-testid="age-input"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Pick an Avatar</label>
            <div className="flex flex-wrap gap-2">
              {avatars.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setAvatar(emoji)}
                  className={`text-2xl p-2 rounded-lg transition-colors ${
                    avatar === emoji
                      ? "bg-amber-500/20 ring-2 ring-amber-500"
                      : "bg-gray-800 hover:bg-gray-700"
                  }`}
                  data-testid={`avatar-${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 rounded-xl bg-amber-500 text-gray-950 font-bold hover:bg-amber-400 transition-colors"
              data-testid="signin-submit"
            >
              Let's Go
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
