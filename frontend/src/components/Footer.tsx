import { NavLink } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="w-full bg-emerald-900/90 backdrop-blur-md text-white/80 py-6 mt-auto border-t border-white/10 relative z-50">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm font-medium">© {new Date().getFullYear()} Moni-Lab</div>
        <div className="flex flex-wrap justify-center items-center gap-6">
          <NavLink to="/privacy" className="text-sm hover:text-emerald-400 transition-colors">Aviso de privacidad</NavLink>
          <NavLink to="/terms" className="text-sm hover:text-emerald-400 transition-colors">Términos y condiciones</NavLink>
          <NavLink to="/about" className="text-sm hover:text-emerald-400 transition-colors">Sobre nosotros</NavLink>
        </div>
      </div>
    </footer>
  )
}