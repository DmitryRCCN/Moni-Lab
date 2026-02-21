import LearningPath from '../components/LearningPath'
import { useEffect, useState } from 'react'
import api from '../api'
import { useAuth } from '../context/AuthContext'

type Nodo = { id_nodo: string; titulo: string; descripcion?: string }

export default function Path() {
  const [nodos, setNodos] = useState<Nodo[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const [progressMap, setProgressMap] = useState<Record<string, string>>({})

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await api('/nodos')
        if (mounted) setNodos(res || [])
        // si hay usuario autenticado, cargar su progreso para colorear actividades
        if (user) {
          try {
            const p = await api(`/usuario/${user.id}/progreso`)
            const map: Record<string, string> = {}
            ;(p?.progreso || p || []).forEach((row: any) => {
              if (row.actividad_id) map[row.actividad_id] = row.estado || row.estado_actividad || 'disponible'
            })
            if (mounted) setProgressMap(map)
          } catch (e) {
            // ignore
          }
        }
      } catch (err: any) {
        if (mounted) setError(err.message || 'Error cargando nodos')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats row */}
        <div className="flex justify-start sm:justify-start mb-8">
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center border border-white/10 w-44">
            <p className="text-xs text-white/70 mb-1">Monedas</p>
            <p className="text-2xl font-bold text-yellow-300">393</p>
          </div>
        </div>

        {/* Learning path title */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Ruta de aprendizaje</h1>
          <p className="text-white/80 text-sm sm:text-base">Sigue el camino para dominar la educación financiera 💰</p>
        </div>

        {/* Learning path container */}
        <div className="bg-white/5 backdrop-blur rounded-2xl p-8 border border-white/10 shadow-xl">
          {loading ? (
            <p>Cargando ruta...</p>
          ) : error ? (
            <p className="text-red-400">{error}</p>
          ) : (
            <LearningPath nodes={nodos || undefined} progress={progressMap} />
          )}
        </div>

        {/* (Creación de actividades eliminada; se carga desde la BD) */}
      </div>
    </div>
  )
}