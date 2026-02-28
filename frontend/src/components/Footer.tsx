import { NavLink } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="w-full bg-emerald-900 text-white/80 py-4 mt-6 border-t border-white/6 fixed bottom-0 left-0">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="text-sm">© {new Date().getFullYear()} Moni-Lab</div>
        <div className="flex items-center gap-4">
          <NavLink to="/privacy" className="text-sm hover:text-white">Aviso de privacidad</NavLink>
          <NavLink to="/terms" className="text-sm hover:text-white">Términos y condiciones</NavLink>
          <NavLink to="/about" className="text-sm hover:text-white">Sobre nosotros</NavLink>
        </div>
      </div>
    </footer>
  )
}
