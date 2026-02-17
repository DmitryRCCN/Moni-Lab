import { NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <>
      {/* Top navbar - Desktop */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-gradient-to-r from-emerald-700 via-teal-600 to-green-600 shadow-lg z-40">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-extrabold text-emerald-700">M</div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-lg">Moni-Lab</h1>
              <p className="text-xs text-white/80">Aprende jugando</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-2">
            {[
              { to: '/', label: 'Recorrido', icon: '🧭' },
              { to: '/stats', label: 'Estadísticas', icon: '📊' },
              { to: '/store', label: 'Tienda', icon: '🏪' },

            ].map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg transition ${isActive ? 'bg-white/20 border-b-2 border-yellow-300' : 'hover:bg-white/10'}`
                }
              >
                <span>{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}



          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:text-right text-sm">
              <p className="font-semibold">Moniel User</p>
              <p className="text-xs text-white/80">Nivel 4 • 393 XP</p>
            </div>

            {/* Profile button next to avatar on desktop */}
            <div className="flex items-center gap-2">
              <NavLink to="/profile" className={({ isActive }) => `hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-lg transition ${isActive ? 'bg-white/20 border-b-2 border-yellow-300' : 'hover:bg-white/10'}`}>
                <span className="w-9 h-9 bg-yellow-400 rounded-full flex items-center justify-center font-semibold text-emerald-900">MU</span>
                <span className="font-medium">Perfil</span>
              </NavLink>

              <div className="hidden md:flex items-center gap-2 ml-2">
                <button
                  onClick={() => { /* placeholder logout handler */ }}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-sm transition"
                  title="Salir"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 4.5A1.5 1.5 0 014.5 3h6A1.5 1.5 0 0112 4.5V6h-1V4.5a.5.5 0 00-.5-.5h-6a.5.5 0 00-.5.5v11a.5.5 0 00.5.5h6a.5.5 0 00.5-.5V14h1v1.5A1.5 1.5 0 0110.5 17h-6A1.5 1.5 0 013 15.5v-11z" clipRule="evenodd" />
                    <path d="M15 10a.75.75 0 00-.75-.75H8.5v1.5h5.75A.75.75 0 0015 10z" />
                  </svg>
                </button>
                <span className="text-sm text-white/80 hidden lg:inline">Salir</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Bottom navbar - Mobile (order: salir, stats, recorrido, tienda, perfil-avatar) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-emerald-800 via-teal-700 to-teal-800 border-t border-white/10 z-40">
        <div className="h-full flex items-center justify-around">
          <NavLink to="/logout" className={({ isActive }) => `flex flex-col items-center justify-center py-1 px-2 transition ${isActive ? 'text-yellow-300 border-t-2 border-yellow-300 pt-1' : 'text-white/80'}`}>
            <span className="text-2xl">🚪</span>
            <span className="text-xs">Salir</span>
          </NavLink>

          <NavLink to="/stats" className={({ isActive }) => `flex flex-col items-center justify-center py-1 px-2 transition ${isActive ? 'text-yellow-300 border-t-2 border-yellow-300 pt-1' : 'text-white/80'}`}>
            <span className="text-2xl">📊</span>
          </NavLink>

          <NavLink to="/" className={({ isActive }) => `flex flex-col items-center justify-center py-1 px-2 transition ${isActive ? 'text-yellow-300 border-t-2 border-yellow-300 pt-1' : 'text-white/80'}`}>
            <span className="text-2xl">🧭</span>
          </NavLink>

          <NavLink to="/store" className={({ isActive }) => `flex flex-col items-center justify-center py-1 px-2 transition ${isActive ? 'text-yellow-300 border-t-2 border-yellow-300 pt-1' : 'text-white/80'}`}>
            <span className="text-2xl">🏪</span>
          </NavLink>

          <NavLink to="/profile" className={({ isActive }) => `flex flex-col items-center justify-center py-1 px-2 transition ${isActive ? 'text-yellow-300 border-t-2 border-yellow-300 pt-1' : 'text-white/80'}`}>
            <span className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-emerald-900 font-semibold">MU</span>
          </NavLink>
        </div>
      </nav>
    </>
  )
}