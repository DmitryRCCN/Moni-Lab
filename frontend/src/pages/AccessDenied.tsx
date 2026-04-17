import { useNavigate } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

export default function AccessDenied() {
  const navigate = useNavigate()

  return (
    <div className="animate-in fade-in duration-700 min-h-screen flex items-center justify-center">
      <div className="moni-panel p-8 md:p-12 max-w-2xl w-full text-center">
        {/* Error Code */}
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¡Acceso Denegado!
          </h2>
          <h1 className="text-8xl md:text-9xl font-bold text-orange-500 mb-2">
            403
          </h1>
          <div className="h-1 w-24 bg-orange-500 mx-auto rounded"></div>
        </div>

        {/* Error Image */}
        <img
          src="/images/monaError.avif"
          alt="Acceso Denegado"
          loading="lazy"
          decoding="async"
          className="w-48 md:w-64 mx-auto mb-8 opacity-90"
        />

        {/* Error Message */}
        

        <p className="text-lg text-gray-300 mb-8">
          No tienes permiso para acceder a este recurso. Si crees que esto es un error, 
          contacta con el administrador.
        </p>

        {/* Permission Info */}
        <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4 mb-8">
          <p className="text-orange-300 text-sm">
            Esta área requiere permisos especiales que no tienes actualmente.
          </p>
        </div>

        {/* Action Buttons */}
         <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-slate-900 font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            <ArrowLeft size={20} />
            Volver Atrás
          </button>

          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            <Home size={20} />
            Ir al Inicio
          </button>
        </div>
      </div>
    </div>
  )
}
