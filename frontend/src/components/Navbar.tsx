import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Moni-Lab
        </Link>
        
        <div className="space-x-4">
          <Link to="/" className="hover:bg-blue-700 px-3 py-2 rounded">Inicio</Link>
          <Link to="/profile" className="hover:bg-blue-700 px-3 py-2 rounded">Perfil</Link>
          <button className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded">Salir</button>
        </div>
      </div>
    </nav>
  )
}
