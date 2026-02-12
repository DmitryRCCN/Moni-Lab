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

          <nav className="hidden md:flex items-center gap-1">
            {[
              { to: '/', label: 'Recorrido', icon: '🧭' },
              { to: '/stats', label: 'Estadísticas', icon: '📊' },
              { to: '/store', label: 'Tienda', icon: '🏪' },
              { to: '/profile', label: 'Perfil', icon: '👤' },
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
            <button className="ml-4 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition">
              Salir
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:text-right text-sm">
              <p className="font-semibold">Moniel User</p>
              <p className="text-xs text-white/80">Nivel 4 • 393 XP</p>
            </div>
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-emerald-900">MU</div>
          </div>
        </div>
      </header>

      {/* Bottom navbar - Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-emerald-800 via-teal-700 to-teal-800 border-t border-white/10 z-40">
        <div className="h-full flex items-center justify-around">
          {[
            { to: '/', icon: '🧭' },
            { to: '/stats', icon: '📊' },
            { to: '/store', icon: '🏪' },
            { to: '/profile', icon: '👤' },
          ].map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-2 px-4 transition ${isActive ? 'text-yellow-300' : 'text-white/70 hover:text-white'}`
              }
            >
              <span className="text-2xl">{item.icon}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  )
}
