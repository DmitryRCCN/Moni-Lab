import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Lesson from './pages/Lesson'
import Profile from './pages/Profile'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-900 via-teal-800 to-green-900 text-white">
        <Navbar />
        <main className="flex-1 pt-20 pb-24 md:pb-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lesson/:id" element={<Lesson />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
