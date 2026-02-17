import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Path from './pages/Path'
import Lesson from './pages/Lesson'
import Profile from './pages/Profile'
import Stats from './pages/Stats'
import Store from './pages/Store'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

function AppContent() {
  const location = useLocation()
  const hideNavbar = ['/home', '/login', '/register'].includes(location.pathname)

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-900 via-teal-800 to-green-900 text-white">
      {!hideNavbar && <Navbar />}
      <main className={`flex-1 ${hideNavbar ? 'pt-0' : 'pt-20'} pb-24 md:pb-8`}>
        <Routes>
          <Route path="/" element={<Path />} />
          <Route path="/lesson/:id" element={<Lesson />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/store" element={<Store />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App