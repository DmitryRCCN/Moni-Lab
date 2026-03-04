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
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
              </svg>
            </NavLink>

            {/* Nombre de la página y lema: oculto en celular */}
            <div className="hidden sm:block">
              <h1 className="font-bold text-lg text-white">Moni-Lab</h1>
              <p className="text-xs text-white/80">Aprende jugando</p>
            </div>
          </div>

          {/* Opciones de navegación */}
          {user ? (
            <nav className="flex items-center gap-4">
              <NavLink to="/store" className="flex items-center gap-2 px-2 py-1 text-white hover:text-yellow-300">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                  <path d="M2.879 7.121A3 3 0 0 0 7.5 6.66a2.997 2.997 0 0 0 2.5 1.34 2.997 2.997 0 0 0 2.5-1.34 3 3 0 1 0 4.622-3.78l-.293-.293A2 2 0 0 0 15.415 2H4.585a2 2 0 0 0-1.414.586l-.292.292a3 3 0 0 0 0 4.243ZM3 9.032a4.507 4.507 0 0 0 4.5-.29A4.48 4.48 0 0 0 10 9.5a4.48 4.48 0 0 0 2.5-.758 4.507 4.507 0 0 0 4.5.29V16.5h.25a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75v-3.5a.75.75 0 0 0-.75-.75h-2.5a.75.75 0 0 0-.75.75v3.5a.75.75 0 0 1-.75.75h-4.5a.75.75 0 0 1 0-1.5H3V9.032Z" />
                </svg>
                <span className="hidden md:inline">Tienda</span>
              </NavLink>
              <NavLink to="/path" className="flex items-center gap-2 px-2 py-1 text-white hover:text-yellow-300">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                  <path d="M15.75 8.25a.75.75 0 0 1 .75.75c0 1.12-.492 2.126-1.27 2.812a.75.75 0 1 1-.992-1.124A2.243 2.243 0 0 0 15 9a.75.75 0 0 1 .75-.75Z" />
                  <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM4.575 15.6a8.25 8.25 0 0 0 9.348 4.425 1.966 1.966 0 0 0-1.84-1.275.983.983 0 0 1-.97-.822l-.073-.437c-.094-.565.25-1.11.8-1.267l.99-.282c.427-.123.783-.418.982-.816l.036-.073a1.453 1.453 0 0 1 2.328-.377L16.5 15h.628a2.25 2.25 0 0 1 1.983 1.186 8.25 8.25 0 0 0-6.345-12.4c.044.262.18.503.389.676l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.575 15.6Z" clip-rule="evenodd" />
                </svg>
                <span className="hidden md:inline">Recorrido</span>
              </NavLink>
              <NavLink to="/stats" className="flex items-center gap-2 px-2 py-1 text-white hover:text-yellow-300">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
                  <path d="M15.5 2A1.5 1.5 0 0 0 14 3.5v13a1.5 1.5 0 0 0 1.5 1.5h1a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 16.5 2h-1ZM9.5 6A1.5 1.5 0 0 0 8 7.5v9A1.5 1.5 0 0 0 9.5 18h1a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 10.5 6h-1ZM3.5 10A1.5 1.5 0 0 0 2 11.5v5A1.5 1.5 0 0 0 3.5 18h1A1.5 1.5 0 0 0 6 16.5v-5A1.5 1.5 0 0 0 4.5 10h-1Z" />
                </svg>
                <span className="hidden md:inline">Estadísticas</span>
              </NavLink>
              <NavLink to="/profile" className="flex items-center gap-2 px-2 py-1 text-white hover:text-yellow-300">
                <span className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-emerald-900 font-semibold">
                  {(user.nombre || 'U').slice(0,2).toUpperCase()}
                </span>
                <span className="hidden md:inline">Perfil</span>
              </NavLink>

              {/* Botón Salir */}
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
