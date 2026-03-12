import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Avatar from '../components/avatar'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/home')
  }

  // Estilos base para todos los links
  const baseLink = "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200"
  
  // Clases cuando el link ESTÁ activo (Invertido: fondo blanco, texto verde)
  const activeStyle = "bg-white text-emerald-700 shadow-md"
  
  // Clases cuando el link NO está activo (Texto blanco, hover sutil)
  const inactiveStyle = "text-white hover:bg-white/10"

  const navLinks = [
    {
      to: "/store",
      label: "Tienda",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
          <path d="M2.879 7.121A3 3 0 0 0 7.5 6.66a2.997 2.997 0 0 0 2.5 1.34 2.997 2.997 0 0 0 2.5-1.34 3 3 0 1 0 4.622-3.78l-.293-.293A2 2 0 0 0 15.415 2H4.585a2 2 0 0 0-1.414.586l-.292.292a3 3 0 0 0 0 4.243ZM3 9.032a4.507 4.507 0 0 0 4.5-.29A4.48 4.48 0 0 0 10 9.5a4.48 4.48 0 0 0 2.5-.758 4.507 4.507 0 0 0 4.5.29V16.5h.25a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75v-3.5a.75.75 0 0 0-.75-.75h-2.5a.75.75 0 0 0-.75.75v3.5a.75.75 0 0 1-.75.75h-4.5a.75.75 0 0 1 0-1.5H3V9.032Z"/>
        </svg>
      )
    },
    {
      to: "/path",
      label: "Recorrido",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
          <path d="M15.75 8.25a.75.75 0 0 1 .75.75c0 1.12-.492 2.126-1.27 2.812a.75.75 0 1 1-.992-1.124A2.243 2.243 0 0 0 15 9a.75.75 0 0 1 .75-.75Z"/>
          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM4.575 15.6a8.25 8.25 0 0 0 9.348 4.425 1.966 1.966 0 0 0-1.84-1.275.983.983 0 0 1-.97-.822l-.073-.437c-.094-.565.25-1.11.8-1.267l.99-.282c.427-.123.783-.418.982-.816l.036-.073a1.453 1.453 0 0 1 2.328-.377L16.5 15h.628a2.25 2.25 0 0 1 1.983 1.186 8.25 8.25 0 0 0-6.345-12.4c.044.262.18.503.389.676l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.575 15.6Z" clipRule="evenodd"/>
        </svg>
      )
    }
  ]

  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-linear-to-r from-emerald-700 via-teal-600 to-green-600 shadow-lg z-40">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4">

        {/* LOGO + HOME */}
        <div className="flex items-center gap-4">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center justify-center w-10 h-10 rounded-lg transition ${
                isActive ? "bg-white text-emerald-700" : "text-white hover:bg-white/10"
              }`
            }
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
              <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z"/>
              <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z"/>
            </svg>
          </NavLink>

          <div className="hidden sm:block text-white">
            <h1 className="font-bold text-lg leading-none">Moni-Lab</h1>
            <p className="text-xs opacity-80">Aprende jugando</p>
          </div>
        </div>

        {/* NAV */}
        {user ? (
          <nav className="flex items-center gap-2 md:gap-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `${baseLink} ${isActive ? activeStyle : inactiveStyle}`
                }
              >
                {link.icon}
                <span className="hidden md:inline font-medium">{link.label}</span>
              </NavLink>
            ))}

            {/* BOTÓN DE PERFIL DINÁMICO Y RESPONSIVE */}
            <NavLink 
              to="/profile" 
              className={({ isActive }) => `
                group flex items-center rounded-full transition-all duration-200 border border-white/10
                ${isActive ? "bg-white/20 border-white/40" : "bg-white/5 hover:bg-white/10"}
                p-1 md:pr-4  /* Padding mínimo en móvil, extra a la derecha en PC */
              `}
            >
              {/* Contenedor del Avatar (Siempre visible) */}
              <div className="w-10 h-10 rounded-full bg-emerald-900/40 border-2 border-emerald-500/30 overflow-hidden flex items-center justify-center transition-transform group-hover:scale-110 flex-shrink-0">
                {user?.equipped ? (
                  <Avatar 
                    equipped={user.equipped} 
                    className="w-full h-full" 
                  />
                ) : (
                  <div className="w-full h-full bg-slate-800 animate-pulse flex items-center justify-center text-xs opacity-50">
                    ...
                  </div>
                )}
              </div>

              {/* Texto del Perfil (SOLO VISIBLE EN PC) */}
              <div className="hidden md:flex flex-col ml-3">
                <span className="text-[10px] text-white/50 font-bold uppercase tracking-tighter leading-none mb-1">
                  Mi Perfil
                </span>
                <span className="text-sm font-bold text-white leading-none truncate max-w-[100px]">
                  {user?.nombre || 'Usuario'}
                </span>
              </div>
            </NavLink>

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-600 hover:bg-orange-700 text-white shadow transition-colors ml-2"
              title="Salir"
            >

              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
              </svg>
          


 

            </button>
          </nav>
        ) : (
          <div className="flex items-center gap-2">
    
    {/* INICIAR SESIÓN */}
            <NavLink 
              to="/login" 
              className={({ isActive }) => 
                `${baseLink} px-4 py-2 ${
                  isActive 
                    ? activeStyle 
                    : "text-white hover:bg-white/10"
                }`
              }
            >
              <span className="font-medium">Iniciar Sesión</span>
            </NavLink>

            {/* REGISTRARSE */}
            <NavLink 
              to="/register" 
              className={({ isActive }) => 
                `${baseLink} px-4 py-2 ${
                  isActive 
                    ? activeStyle 
                    : "text-white hover:bg-white/10"
                }`
              }
            >
              <span>Registrarse</span>
            </NavLink>
            
          </div>
        )}
      </div>
    </header>
  )
}