import { NavLink, Outlet } from "react-router-dom";
import { useUser } from "./context/useUser";

const navItems = [
  { to: "/app/session", label: "Session", icon: "🏋️", badge: true },
  { to: "/app/history", label: "History", icon: "📋" },
  { to: "/app/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/app/profile", label: "Profile", icon: "👤" },
];

export function AppLayout() {
  const { user, signOut, activeSession } = useUser();

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-20 md:w-56 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-lg font-bold hidden md:block">
            Iron<span className="text-amber-500">Log</span>
          </h1>
          <span className="text-2xl md:hidden block text-center">🏋️</span>
        </div>

        <nav className="flex-1 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors relative ${
                  isActive
                    ? "bg-amber-500/20 text-amber-500"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              <span className="hidden md:inline text-sm font-medium">{item.label}</span>
              {/* Show badge for active session */}
              {item.badge && activeSession && (
                <span className="absolute top-2 left-2 w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{user?.avatar}</span>
            <span className="hidden md:inline text-sm text-gray-300 truncate">{user?.name}</span>
          </div>
          <button
            onClick={signOut}
            className="w-full text-center text-sm text-gray-500 hover:text-red-400 transition-colors"
            data-testid="signout-btn"
          >
            <span className="hidden md:inline">Sign Out</span>
            <span className="md:hidden">🚪</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
