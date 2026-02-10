import { useState } from "react";
import { SignInModal } from "./SignInModal";

const features = [
  { icon: "🏋️", title: "Track Sets & Reps", desc: "Log every set with weight and reps." },
  { icon: "⏱️", title: "Session Timer", desc: "Time your workouts automatically." },
  { icon: "📊", title: "Progress Charts", desc: "Visualize your gains over time." },
];

export function LandingPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="text-5xl font-bold tracking-tight">
          Iron<span className="text-amber-500">Log</span>
        </h1>
        <p className="text-xl text-gray-400">
          The no-nonsense workout tracker for serious lifters.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          {features.map((f) => (
            <div key={f.title} className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-lg mb-1">{f.title}</h3>
              <p className="text-sm text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="mt-8 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-lg rounded-xl transition-colors"
          data-testid="get-started-btn"
        >
          Get Started
        </button>
      </div>

      {showModal && <SignInModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
