import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { RideEditorPage } from './pages/RideEditorPage'
import { RideDetailPage } from './pages/RideDetailPage'
import { RideListPage } from './pages/RideListPage'

function NavigationBar() {
  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo/Title */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <span className="text-2xl">🏍️</span>
            <span className="text-xl font-bold text-white">ADV Ride Planner</span>
          </Link>

          {/* Right side - Plan Ride Button */}
          <Link
            to="/ride/new"
            className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            Plan Ride
          </Link>
        </div>
      </div>
    </nav>
  )
}


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-950">
        <NavigationBar />
        <Routes>
          <Route path="/" element={<RideListPage />} />
          <Route path="/ride/new" element={<RideEditorPage />} />
          <Route path="/ride/:id" element={<RideDetailPage />} />
          <Route path="/ride/:id/edit" element={<RideEditorPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App