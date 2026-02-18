import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Path from './pages/Path'
import Lesson from './pages/Lesson'
import Profile from './pages/Profile'
import Stats from './pages/Stats'
import Store from './pages/Store'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import { AuthProvider } from './context/AuthContext'
import Footer from './components/Footer'
import RequireAuth from './components/RequireAuth'

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-900 via-teal-800 to-green-900 text-white">
      <Navbar />
      <main className={`flex-1 pt-20 pb-24 md:pb-8`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lesson/:id" element={<RequireAuth><Lesson /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="/stats" element={<RequireAuth><Stats /></RequireAuth>} />
          <Route path="/store" element={<RequireAuth><Store /></RequireAuth>} />
          <Route path="/Path" element={<RequireAuth><Path /></RequireAuth>} />
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
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App