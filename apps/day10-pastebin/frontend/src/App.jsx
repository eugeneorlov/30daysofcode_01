import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CreatePage } from './pages/CreatePage'
import { ViewPage } from './pages/ViewPage'

function BrowsePage() {
  return <div>Browse Page - Coming Soon</div>
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
