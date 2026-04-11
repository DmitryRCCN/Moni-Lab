import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Path from './pages/Path'
import Lesson from './pages/Lesson'
import Profile from './pages/Profile'
import Store from './pages/Store'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import RegisterUser from './pages/RegisterUser'
import ConfirmEmail from './pages/ConfirmEmail'
import ConfirmRegistration from './pages/ConfirmRegistration'
import ForgotPassword from './pages/ForgotPassword';
import ConfirmUpdate from './pages/ConfirmUpdate';
import TermCond from './pages/TermCond'
import Privacy from './pages/Privacy'
import About from './pages/About'
import NotFound from './pages/NotFound'
import ServerError from './pages/ServerError'
import AccessDenied from './pages/AccessDenied'
import { AuthProvider } from './context/AuthContext'
import Footer from './components/Footer'
import RequireAuth from './components/RequireAuth'
import RequireGuest from './components/RequireGuest'
import ItemEditor from './components/itemEditor'
import ErrorBoundary from './components/ErrorBoundary'

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent text-white">
      <Navbar />
      
      <main className="flex-1 pt-28 pb-10 px-4 w-full max-w-5xl mx-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lesson/:id" element={<RequireAuth><Lesson /></RequireAuth>} />
          <Route path="/lesson" element={<RequireAuth><Lesson /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="/store" element={<RequireAuth><Store /></RequireAuth>} />
          <Route path="/path" element={<RequireAuth><Path /></RequireAuth>} />
          <Route path="/login" element={<RequireGuest><Login /></RequireGuest>} />
          <Route path="/register" element={<RequireGuest><Register /></RequireGuest>} />
          <Route path="/register/user" element={<RequireGuest><RegisterUser /></RequireGuest>} />
          <Route path="/auth/confirm-email" element={<RequireGuest><ConfirmEmail /></RequireGuest>} />
          <Route path="/auth/confirm-registration" element={<ConfirmRegistration />} />
          <Route path="/forgot-password" element={<RequireGuest><ForgotPassword /></RequireGuest>} />
          <Route path="/confirm-update" element={<ConfirmUpdate />} />
          <Route path="/terms" element={<TermCond />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/about" element={<About />} />
          <Route path="/item-editor" element={<RequireAuth><ItemEditor /></RequireAuth>} />
          
          {/* Error Routes */}
          <Route path="/error/404" element={<NotFound />} />
          <Route path="/error/500" element={<ServerError />} />
          <Route path="/error/403" element={<AccessDenied />} />
          
          {/* Catch all - 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <div className="relative w-full overflow-x-hidden">
            <AppContent />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App