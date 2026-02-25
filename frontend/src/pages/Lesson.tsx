import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../api'
import Exercise from '../components/Exercise'

export default function Lesson() {
  const params = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  
  const stateActivityId = (location.state as any)?.activityId as string | undefined
  const id = stateActivityId || params.id

  const [actividad, setActividad] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // --- Estados para el temporizador de lectura ---
  const [secondsLeft, setSecondsLeft] = useState(15)
  const [isCompleting, setIsCompleting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    let mounted = true
    async function load() {
      if (!id) {
        setError('Actividad no especificada')
        setLoading(false)
        return
      }
      try {
        const res = await api(`/actividad/${id}`)
        if (mounted) setActividad(res)
      } catch (err: any) {
        if (mounted) setError(err.message || 'No se encontró la actividad')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [id])

  // --- Lógica del Temporizador ---
  useEffect(() => {
    if (actividad?.tipo_actividad === 'lectura' && secondsLeft > 0) {
      const timer = setInterval(() => {
        setSecondsLeft((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [actividad, secondsLeft])

  const handleCompleteReading = async () => {
    setIsCompleting(true)
    try {
      // Endpoint sugerido para marcar lectura como completada
      await api('/actividad/completar-lectura', {
        method: 'POST',
        body: { id_actividad: id }
      })
      setSuccess(true)
      // Redirigir a Path después de 2 segundos
      setTimeout(() => navigate('/path'), 2000)
    } catch (err: any) {
      alert(err.message || "Error al completar lectura")
    } finally {
      setIsCompleting(false)
    }
  }

  if (loading) return <div className="p-8 text-white">Cargando actividad...</div>
  if (error) return <div className="p-8 text-red-300">{error}</div>
  if (!actividad) return <div className="p-8 text-white">Actividad no disponible</div>

  return (
    <div className="p-8 max-w-3xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-4">
        {actividad.tipo_actividad === 'lectura' ? '📖 Lectura' : '✏️ Ejercicio'}
      </h1>

      {actividad.tipo_actividad === 'lectura' && actividad.lectura ? (
        <div className="bg-white/5 p-6 rounded-xl border border-white/10 shadow-xl">
          <div className="prose prose-invert max-w-none mb-8">
            <p className="text-lg leading-relaxed">{actividad.lectura.cuerpo_texto}</p>
          </div>

          <div className="flex flex-col items-center gap-4 pt-6 border-t border-white/10">
            {success ? (
              <div className="text-emerald-400 font-bold animate-pulse text-center">
                ¡Excelente! Guardando progreso y volviendo a la ruta...
              </div>
            ) : (
              <>
                <button
                  disabled={secondsLeft > 0 || isCompleting}
                  onClick={handleCompleteReading}
                  className={`px-10 py-3 rounded-full font-bold transition-all ${
                    secondsLeft > 0 
                      ? 'bg-gray-600 text-white/40 cursor-not-allowed' 
                      : 'bg-emerald-500 hover:bg-emerald-400 hover:scale-105 shadow-lg'
                  }`}
                >
                  {secondsLeft > 0 
                    ? `Espera ${secondsLeft}s para finalizar` 
                    : isCompleting ? 'Procesando...' : 'Completar Lectura'}
                </button>
                <p className="text-xs text-white/30 text-center">
                  Debes leer con atención antes de marcar como terminado.
                </p>
              </>
            )}
          </div>
        </div>
      ) : (
        <Exercise ejercicio={actividad.ejercicio} activityId={actividad.id_actividad} />
      )}
    </div>
  )
}