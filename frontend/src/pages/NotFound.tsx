import { useNavigate } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="animate-in fade-in duration-700 min-h-screen flex items-center justify-center">
      
      <div className="moni-panel p-8 md:p-12 max-w-2xl w-full text-center">
         <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          ¡Página No Encontrada!
        </h2>
        {/* Error Code */}
        <div className="mb-6">
          <h1 className="text-8xl md:text-9xl font-bold text-yellow-400 mb-2">
            404
          </h1>
          <div className="h-1 w-24 bg-yellow-400 mx-auto rounded"></div>
        </div>

        {/* Error Image */}
        <img
          src="/images/monaError.avif"
          alt="Error"
          loading="lazy"
          decoding="async"
          className="w-48 md:w-64 mx-auto mb-8 opacity-90"
        />

        {/* Error Message */}
       

        <p className="text-lg text-gray-300 mb-8">
          Parece que la página que buscas no existe o fue movida. No te preocupes, 
          ¡podemos ayudarte a encontrar lo que necesitas!
        </p>

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

        {/* Fun Footer Message */}
        <p className="text-sm text-gray-400 mt-8">
          Tip: Revisa la URL o intenta navegar desde el menú principal
        </p>
      </div>
    </div>
  )
}
