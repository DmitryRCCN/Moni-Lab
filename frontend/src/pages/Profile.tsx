import { Link } from 'react-router-dom';

export default function Profile() {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-emerald-800/40 to-teal-900/30 p-6 rounded-lg shadow-lg border border-white/6">
        <div className="flex items-center gap-6">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 flex items-center justify-center text-3xl font-bold text-slate-900">A</div>
          <div>
            <h3 className="text-2xl font-bold">Usuario Ejemplo</h3>
            <p className="text-sm text-white/80 mt-1">Nivel 3 · <span className="font-semibold">120</span> monedas</p>
            <div className="mt-3 flex gap-3">
              <Link to="/stats" className="px-3 py-1 bg-white/10 rounded hover:bg-white/20">Ver estadísticas</Link>
              <Link to="/store" className="px-3 py-1 bg-white/10 rounded hover:bg-white/20">Tienda</Link>
            </div>
          </div>
        </div>
        <section className="mt-6 bg-white/5 p-4 rounded">
          <h4 className="font-semibold mb-2">Acerca de</h4>
          <p className="text-sm text-white/80">Este es un perfil de ejemplo. Aquí puedes mostrar progreso, logros y personalización de avatar.</p>
        </section>
      </div>
    </div>
  )
}