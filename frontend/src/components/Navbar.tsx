import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/home')
  }

  return (
    <>
      {/* Top navbar - Única barra para desktop y móvil */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-gradient-to-r from-emerald-700 via-teal-600 to-green-600 shadow-lg z-40">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4">
          
          {/* Logo + nombre (solo en desktop) */}
          <div className="flex items-center gap-4">
            {/* Botón Home solo ícono */}
            <NavLink to="/" className="flex items-center justify-center w-10 h-10 rounded-lg bg-white text-emerald-700">
              🏠
            </NavLink>

            {/* Nombre de la página y lema: oculto en móvil */}
            <div className="hidden sm:block">
              <h1 className="font-bold text-lg text-white">Moni-Lab</h1>
              <p className="text-xs text-white/80">Aprende jugando</p>
            </div>
          </div>

          {/* Opciones de navegación */}
          {user ? (
            <nav className="flex items-center gap-4">
              <NavLink to="/store" className="flex items-center gap-2 px-2 py-1 text-white hover:text-yellow-300">
                <span>🏪</span>
                <span className="hidden md:inline">Tienda</span>
              </NavLink>
              <NavLink to="/path" className="flex items-center gap-2 px-2 py-1 text-white hover:text-yellow-300">
                <span>🧭</span>
                <span className="hidden md:inline">Recorrido</span>
              </NavLink>
              <NavLink to="/stats" className="flex items-center gap-2 px-2 py-1 text-white hover:text-yellow-300">
                <span>📊</span>
                <span className="hidden md:inline">Estadísticas</span>
              </NavLink>
              <NavLink to="/profile" className="flex items-center gap-2 px-2 py-1 text-white hover:text-yellow-300">
                <span className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-emerald-900 font-semibold">
                  {(user.nombre || 'U').slice(0,2).toUpperCase()}
                </span>
                <span className="hidden md:inline">Perfil</span>
              </NavLink>

              {/* Botón Salir solo ícono */}
              <button
                onClick={handleLogout}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-sm transition"
                title="Salir"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 4.5A1.5 1.5 0 014.5 3h6A1.5 1.5 0 0112 4.5V6h-1V4.5a.5.5 0 00-.5-.5h-6a.5.5 0 00-.5.5v11a.5.5 0 00.5.5h6a.5.5 0 00.5-.5V14h1v1.5A1.5 1.5 0 0110.5 17h-6A1.5 1.5 0 013 15.5v-11z" clipRule="evenodd" />
                  <path d="M15 10a.75.75 0 00-.75-.75H8.5v1.5h5.75A.75.75 0 0015 10z" />
                </svg>
              </button>
            </nav>
          ) : (
            <div className="flex items-center gap-2">
              <NavLink to="/login" className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/90">
                Iniciar Sesión
              </NavLink>
              <NavLink to="/register" className="px-3 py-2 rounded-lg bg-yellow-300 text-emerald-900 font-semibold">
                Registrarse
              </NavLink>
            </div>
          )}
        </div>
      </header>
    </>
  )
}
