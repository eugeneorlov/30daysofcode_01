import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { LandingPage } from "./LandingPage";
import { AppLayout } from "./AppLayout";
import { SessionPage } from "./SessionPage";
import { HistoryPage } from "./HistoryPage";
import { StatsPage } from "./StatsPage";
import { ProtectedRoute } from "./ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="session" replace />} />
            <Route path="session" element={<SessionPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="stats" element={<StatsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}
