import { useState } from "react";
import { load, save, remove } from "../storage";
import { UserContext } from "./userContextValue";

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => load("user", null));
  const [sessions, setSessions] = useState(() => load("sessions", []));
  const [activeSession, setActiveSession] = useState(() => load("active-session", null));

  function signIn(userData) {
    save("user", userData);
    setUser(userData);
  }

  function signOut() {
    remove("user");
    setUser(null);
  }

  function updateUser(updates) {
    const updatedUser = { ...user, ...updates };
    save("user", updatedUser);
    setUser(updatedUser);
  }

  function startSession(trainingType) {
    const newSession = {
      id: Date.now(),
      trainingType,
      startedAt: new Date().toISOString(),
      exercises: [],
    };
    save("active-session", newSession);
    setActiveSession(newSession);
    return newSession;
  }

  function updateActiveSession(updates) {
    const updated = { ...activeSession, ...updates };
    save("active-session", updated);
    setActiveSession(updated);
  }

  function endSession() {
    if (!activeSession) return;

    // Add endedAt timestamp
    const completedSession = {
      ...activeSession,
      endedAt: new Date().toISOString(),
    };

    // Save to sessions history
    const updatedSessions = [...sessions, completedSession];
    save("sessions", updatedSessions);
    setSessions(updatedSessions);

    // Clear active session
    remove("active-session");
    setActiveSession(null);

    return completedSession;
  }

  function cancelSession() {
    remove("active-session");
    setActiveSession(null);
  }

  function clearAllData() {
    remove("user");
    remove("sessions");
    remove("active-session");
    setUser(null);
    setSessions([]);
    setActiveSession(null);
  }

  return (
    <UserContext.Provider
      value={{
        user,
        sessions,
        activeSession,
        signIn,
        signOut,
        updateUser,
        startSession,
        updateActiveSession,
        endSession,
        cancelSession,
        clearAllData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
