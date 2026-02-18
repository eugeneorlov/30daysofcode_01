import { BrowserRouter, Route, Routes } from "react-router-dom";
import BrowsePage from "./pages/BrowsePage";
import TechniqueDetailPage from "./pages/TechniqueDetailPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<BrowsePage />} />
          <Route path="/technique/:id" element={<TechniqueDetailPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
