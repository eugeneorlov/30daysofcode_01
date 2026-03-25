import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { BrowsePage } from './pages/BrowsePage'
import { CreatePage } from './pages/CreatePage'
import { ViewPage } from './pages/ViewPage'

function Navigation() {
  const location = useLocation()

  return (
    <nav className="bg-gray-900 border-b border-gray-700">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="text-xl font-bold text-purple-400 hover:text-purple-300 transition-colors duration-200"
          >
            Pastebin
          </Link>

          {/* Only show New button if we're not already on the create page */}
          {location.pathname !== '/new' && (
            <Link
              to="/new"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              New
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-950 flex flex-col">
        <Navigation />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<BrowsePage />} />
            <Route path="/new" element={<CreatePage />} />
            <Route path="/:shortId" element={<ViewPage />} />
          </Routes>
        </main>
        <footer className="text-center py-4 text-gray-500 text-xs">
          Built as part of 30 Days of Code
        </footer>
      </div>
    </Router>
  )
}

export default App
