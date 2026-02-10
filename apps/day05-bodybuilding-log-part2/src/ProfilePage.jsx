import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./context/useUser";
import { getMemberSince, getFavoriteType } from "./utils/stats";

const AVATAR_OPTIONS = ["🏋️", "💪", "🥊", "🏃", "🧘", "🦾", "🔥", "⚡", "🎯", "🏆"];

/**
 * AvatarPicker - Grid of emoji avatars
 * Currently selected avatar has a highlight ring
 */
function AvatarPicker({ currentAvatar, onSelect }) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-300 mb-3">Avatar</label>
      <div className="grid grid-cols-5 gap-3">
        {AVATAR_OPTIONS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => onSelect(emoji)}
            className={`text-4xl p-4 rounded-lg transition ${
              currentAvatar === emoji
                ? "ring-2 ring-amber-500 bg-gray-800"
                : "bg-gray-900 hover:bg-gray-800"
            }`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * ProfileForm - Edit user profile information
 */
function ProfileForm() {
  const { user, updateUser } = useUser();
  const [name, setName] = useState(user.name);
  const [age, setAge] = useState(user.age);
  const [defaultType, setDefaultType] = useState(user.defaultTrainingType || "bodybuilding");
  const [avatar, setAvatar] = useState(user.avatar);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate age
    if (age < 13 || age > 120) {
      alert("Age must be between 13 and 120");
      return;
    }

    // Update user data
    updateUser({
      name,
      age,
      avatar,
      defaultTrainingType: defaultType,
    });

    alert("Profile updated successfully!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-amber-500 focus:outline-none"
        />
      </div>

      {/* Age */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Age</label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(parseInt(e.target.value))}
          min="13"
          max="120"
          required
          className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-amber-500 focus:outline-none"
        />
      </div>

      {/* Avatar picker - updates immediately (no save needed) */}
      <AvatarPicker
        currentAvatar={avatar}
        onSelect={(newAvatar) => {
          setAvatar(newAvatar);
          updateUser({ avatar: newAvatar });
        }}
      />

      {/* Default Training Type */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Default Training Type
        </label>
        <div className="flex gap-3">
          {["powerlifting", "bodybuilding", "crossfit"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setDefaultType(type)}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition ${
                defaultType === type
                  ? "bg-amber-500 text-white"
                  : "bg-gray-900 text-gray-400 hover:bg-gray-800"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Save button */}
      <button
        type="submit"
        className="w-full px-6 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition"
      >
        Save Profile
      </button>
    </form>
  );
}

/**
 * StatsSummary - Quick stats about the user's training
 */
function StatsSummary() {
  const { sessions } = useUser();

  const memberSince = getMemberSince(sessions);
  const totalSessions = sessions.length;
  const favoriteType = getFavoriteType(sessions);

  const stats = [
    { label: "Member Since", value: memberSince },
    { label: "Total Sessions", value: totalSessions },
    { label: "Favorite Type", value: favoriteType },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-gray-900 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">{stat.label}</div>
          <div className="text-xl font-bold text-white">{stat.value}</div>
        </div>
      ))}
    </div>
  );
}

/**
 * DangerZone - Destructive actions like clearing all data
 */
function DangerZone() {
  const navigate = useNavigate();
  const { clearAllData } = useUser();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClearData = () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    // Clear all data and redirect to landing page
    clearAllData();
    navigate("/");
  };

  return (
    <div className="mt-12 pt-6 border-t border-gray-800">
      <h3 className="text-lg font-semibold text-red-400 mb-2">Danger Zone</h3>
      <p className="text-sm text-gray-400 mb-4">
        This action cannot be undone. All your sessions and data will be permanently deleted.
      </p>

      {showConfirm ? (
        <div className="space-y-3">
          <p className="text-white font-medium">Are you sure? This will delete all your data.</p>
          <div className="flex gap-3">
            <button
              onClick={handleClearData}
              className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
            >
              Yes, Delete Everything
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="px-6 py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={handleClearData}
          className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
        >
          Clear All Data
        </button>
      )}
    </div>
  );
}

/**
 * ProfilePage - User profile with editable settings and stats
 */
export function ProfilePage() {
  return (
    <div className="max-w-2xl">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Profile</h1>
        <p className="text-gray-400">Manage your account and preferences</p>
      </div>

      {/* Stats summary */}
      <StatsSummary />

      {/* Profile form */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <h2 className="text-xl font-semibold text-white mb-6">Profile Settings</h2>
        <ProfileForm />
      </div>

      {/* Danger zone */}
      <div className="bg-gray-800 rounded-xl p-6">
        <DangerZone />
      </div>
    </div>
  );
}
