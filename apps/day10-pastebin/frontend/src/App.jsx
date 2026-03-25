import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CreatePage } from './pages/CreatePage'

function BrowsePage() {
  return <div>Browse Page - Coming Soon</div>
}

function ViewPage() {
  return <div>View Page - Coming Soon</div>
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BrowsePage />} />
        <Route path="/new" element={<CreatePage />} />
        <Route path="/:shortId" element={<ViewPage />} />
      </Routes>
    </Router>
  )
}

export default App
