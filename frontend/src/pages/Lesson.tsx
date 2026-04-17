import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../api'
import Exercise from '../components/Exercise'
import MinigameEngine from '../components/minigames/MinigameEngine'
import type { MinigameConfig, MinigameFeedback } from '../components/minigames/types'

type Actividad = {
  tipo_actividad: string
  lectura?: { cuerpo_texto: string; url_multimedia?: string }
  ejercicio?: { nivel_dificultad: string; minimo_aprobatorio: number; es_de_salto: boolean }
  minijuego?: { titulo_pantalla: string; historia_intro: string; config_json: string; retroalimentacion_json: string }
  id_actividad: string
}

export default function Lesson() {
  const params = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  
  const stateActivityId = (location.state as { activityId?: string })?.activityId
  const id = stateActivityId || params.id

  const [actividad, setActividad] = useState<Actividad | null>(null)
  const [minigameConfig, setMinigameConfig] = useState<MinigameConfig | null>(null)
  const [minigameFeedback, setMinigameFeedback] = useState<MinigameFeedback[]>([])
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
        if (mounted) {
          setActividad(res)

          // Si la actividad es un minijuego, parseamos la configuración y las retroalimentaciones
          if (res?.minijuego?.config_json) {
            try {
              const parsedConfig = JSON.parse(res.minijuego.config_json) as MinigameConfig
              setMinigameConfig(parsedConfig)
            } catch {
              // Ignoramos si no se puede parsear, el error se muestra como parte de la actividad.
              setMinigameConfig(null)
            }
          }

          if (res?.minijuego?.retroalimentacion_json) {
            try {
              const parsedFeedback = JSON.parse(res.minijuego.retroalimentacion_json) as MinigameFeedback[]
              setMinigameFeedback(parsedFeedback)
            } catch {
              setMinigameFeedback([])
            }
          }
        }
      } catch (err: unknown) {
        if (mounted) setError(err instanceof Error ? err.message : 'No se encontró la actividad')
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
      // Endpoint para marcar lectura como completada
      await api('/actividad/completar-lectura', {
        method: 'POST',
        body: { id_actividad: id }
      })
      setSuccess(true)
      // Redirigir a Path después de 2 segundos
      setTimeout(() => navigate('/path'), 2000)
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error al completar lectura")
    } finally {
      setIsCompleting(false)
    }
  }

  const handleMinigameFinish = async (finalScore: number) => {
    if (!minigameConfig) return
    const maxScore =
      minigameConfig.tipo === 'PICK_N'
      ? minigameConfig.elementos.filter(e => e.es_correcto).length
      : minigameConfig.tipo === 'SEQUENTIAL_DECISION'
      ? minigameConfig.pasos.length
      : minigameConfig.tipo === 'MULTIPLE_CHOICE'
      ? minigameConfig.pasos.length
      : minigameConfig.tipo === 'SAVINGS_PATH'
      ? minigameConfig.pasos.length
        : minigameConfig.tipo === 'CATEGORIZE'
      ? minigameConfig.items.length
      : minigameConfig.tipo === 'SHOP_CALCULATOR'
      ? minigameConfig.escenarios.length
        : 0
    const percent = maxScore > 0 ? Math.round((finalScore / maxScore) * 100) : 0
    try {
      await api('/intento', {
        method: 'POST',
        body: {
          id_actividad: id,
          puntaje_obtenido: percent,
          detalle_respuestas: JSON.stringify({ score: finalScore, maxScore }),
        },
      })
    } catch (err: unknown) {
      console.warn('No se pudo guardar el intento de minijuego:', err instanceof Error ? err?.message : err)
    }
  }

  if (loading) return <div className="p-8 text-white">Cargando actividad...</div>
  if (error) return <div className="p-8 text-red-300">{error}</div>
  if (!actividad) return <div className="p-8 text-white">Actividad no disponible</div>

  const title =
    actividad.tipo_actividad === 'lectura'
      ? '📖 Lectura'
      : actividad.tipo_actividad === 'minijuego'
      ? '🎮 Minijuego'
      : '✏️ Ejercicio'

  return (
    <div className="p-8 max-w-3xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>

      {actividad.tipo_actividad === 'lectura' && actividad.lectura ? (
        <div className="moni-panel p-6 animate-in fade-in duration-300">
          <div className="prose prose-invert max-w-none mb-8">
            <p className="text-lg leading-relaxed whitespace-pre-line text-justify">
              {actividad.lectura.cuerpo_texto}
            </p>
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
      ) : actividad.tipo_actividad === 'minijuego' && minigameConfig ? (
        <div className="space-y-6">
          {actividad.minijuego?.titulo_pantalla && (
            <div className="moni-panel p-6">
              <h2 className="text-2xl font-bold mb-3">{actividad.minijuego.titulo_pantalla}</h2>
              {actividad.minijuego?.historia_intro && (
                <p className="text-white/80 leading-relaxed">{actividad.minijuego.historia_intro}</p>
              )}
            </div>
          )}
          <MinigameEngine
            config={minigameConfig}
            feedback={minigameFeedback}
            onFinish={handleMinigameFinish}
          />
        </div>
      ) : (
        <Exercise ejercicio={actividad.ejercicio} activityId={actividad.id_actividad} />
      )}
    </div>
  )
}