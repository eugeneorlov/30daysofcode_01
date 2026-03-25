import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

// Placeholder page components
function RideListPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">ADV Ride Planner</h1>
      <div className="mb-4">
        <Link
          to="/ride/new"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Plan New Ride
        </Link>
      </div>
      <div className="text-gray-600">
        <p>Your planned rides will appear here.</p>
      </div>
    </div>
  )
}

function RideEditorPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Ride Editor</h1>
      <div className="mb-4">
        <Link
          to="/"
          className="text-blue-500 hover:text-blue-700"
        >
          ← Back to Rides
        </Link>
      </div>
      <div className="text-gray-600">
        <p>Ride planning interface coming soon...</p>
      </div>
    </div>
  )
}

function RideDetailPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Ride Details</h1>
      <div className="mb-4">
        <Link
          to="/"
          className="text-blue-500 hover:text-blue-700 mr-4"
        >
          ← Back to Rides
        </Link>
        <Link
          to={`${window.location.pathname}/edit`}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Edit Ride
        </Link>
      </div>
      <div className="text-gray-600">
        <p>Ride details and map will appear here...</p>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
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