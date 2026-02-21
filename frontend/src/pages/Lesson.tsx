import { useParams, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../api'
import Exercise from '../components/Exercise'

export default function Lesson() {
  const params = useParams()
  const location = useLocation()
  // prefer activityId passed via navigation state (to hide id from URL)
  const stateActivityId = (location.state as any)?.activityId as string | undefined
  const routeId = params.id
  const id = stateActivityId || routeId

  const [actividad, setActividad] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rawResponse, setRawResponse] = useState<any>(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      if (!id) {
        setError('Actividad no especificada')
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        const res = await api(`/actividad/${id}`)
        if (!mounted) return
        setRawResponse(res)
        if (!mounted) return
        setActividad(res)
        setError(null)
      } catch (err: any) {
        if (!mounted) return
        setError(err.message || 'No se encontró la actividad')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [id])

  if (loading) return <div className="p-8">Cargando actividad...</div>
  if (error) return <div className="p-8 text-red-300">{error}</div>
  if (!actividad) return <div className="p-8">Actividad no disponible</div>

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{actividad.tipo_actividad === 'lectura' ? 'Lectura' : actividad.tipo_actividad === 'ejercicio' ? 'Ejercicio' : 'Actividad'}</h1>

      {actividad.tipo_actividad === 'lectura' && actividad.lectura ? (
        <div className="bg-white/5 p-6 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-3">Lectura</h2>
          <div className="prose prose-invert max-w-none">
            <p>{actividad.lectura.cuerpo_texto}</p>
          </div>
          {actividad.lectura.url_multimedia && (
            <div className="mt-4">
              <img src={actividad.lectura.url_multimedia} alt="multimedia" className="max-w-full rounded" />
            </div>
          )}
        </div>
      ) : actividad.tipo_actividad === 'ejercicio' && actividad.ejercicio ? (
        <Exercise ejercicio={actividad.ejercicio} />
      ) : (
        <div className="p-4">Tipo de actividad desconocido</div>
      )}
    </div>
  )
}
