import { NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">M</div>
        <div className="brand">
          <div className="brand-name">Moni-Lab</div>
          <div className="brand-sub">Aprende jugando</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/" className="nav-item">
              <span className="nav-ico">🧭</span>
              <span className="nav-label">Recorrido</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/daily" className="nav-item">
              <span className="nav-ico">🔥</span>
              <span className="nav-label">Desafío Diario</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/objectives" className="nav-item">
              <span className="nav-ico">🎯</span>
              <span className="nav-label">Objetivos</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/leaderboard" className="nav-item">
              <span className="nav-ico">🏆</span>
              <span className="nav-label">Clasificación</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/store" className="nav-item">
              <span className="nav-ico">🏪</span>
              <span className="nav-label">Tienda</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/profile" className="nav-item">
              <span className="nav-ico">🧑‍🔬</span>
              <span className="nav-label">Perfil</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="avatar">MU</div>
        <div className="avatar-info">
          <div className="avatar-name">Moni User</div>
          <div className="avatar-meta">Nivel 4 • 393</div>
        </div>
      </div>
    </aside>
  )
}
