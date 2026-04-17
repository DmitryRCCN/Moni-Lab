import { useNavigate } from 'react-router-dom'
import { Home, RefreshCw } from 'lucide-react'

export default function ServerError() {
  const navigate = useNavigate()

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="animate-in fade-in duration-700 min-h-screen flex items-center justify-center">
      <div className="moni-panel p-8 md:p-12 max-w-2xl w-full text-center">
        {/* Error Code */}
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¡Error del Servidor!
          </h2>
          <h1 className="text-8xl md:text-9xl font-bold text-red-500 mb-2">
            500
          </h1>
          <div className="h-1 w-24 bg-red-500 mx-auto rounded"></div>
        </div>

        {/* Error Image */}
        <img
          src="/images/monaError.avif"
          alt="Error"
          loading="lazy"
          decoding="async"
          className="w-48 md:w-64 mx-auto mb-8 opacity-90 saturate-150"
        />

        {/* Error Message */}
        

        <p className="text-lg text-gray-300 mb-8">
          Algo salió mal en nuestro servidor. Nuestro equipo ha sido notificado 
          y estamos trabajando para solucionarlo lo antes posible.
        </p>

        {/* Status Message */}
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-8">
          <p className="text-red-300 text-sm">
            Por favor, intenta de nuevo en unos momentos o contacta con soporte si el problema persiste.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleRefresh}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-slate-900 font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            <RefreshCw size={20} />
            Reintentar
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
