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
import RegisterUser from './pages/RegisterUser'
import TermCond from './pages/TermCond'
import Privacy from './pages/Privacy'
import About from './pages/About'
import { AuthProvider } from './context/AuthContext'
import Footer from './components/Footer'
import RequireAuth from './components/RequireAuth'

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent text-white">
      <Navbar />
      
      {/* Contenedor principal */}
      <main className="flex-1 pt-24 pb-24 md:pb-12">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lesson/:id" element={<RequireAuth><Lesson /></RequireAuth>} />
          <Route path="/lesson" element={<RequireAuth><Lesson /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="/stats" element={<RequireAuth><Stats /></RequireAuth>} />
          <Route path="/store" element={<RequireAuth><Store /></RequireAuth>} />
          <Route path="/Path" element={<RequireAuth><Path /></RequireAuth>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/user" element={<RegisterUser />} />
          <Route path="/terms" element={<TermCond />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/about" element={<About />} />
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
        <div className="relative w-full overflow-x-hidden">
          <AppContent />
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App