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
            const p = await api(`/usuario/${user.id}/progreso`);
            const map: Record<string, string> = {};
            
            // 1. Aseguramos que iteramos sobre un array
            const rows = Array.isArray(p) ? p : (p?.progreso || []);

            rows.forEach((row: any) => {
              // 2. IMPORTANTE: Usamos 'id_actividad' como llave para que coincida con el componente
              // Verificamos ambos posibles nombres que vengan del API
              const id = row.id_actividad || row.actividad_id;
              const estado = row.estado || row.estado_actividad || 'disponible';
              
              if (id) {
                map[id] = estado;
              }
            });

            console.log("Mapa de progreso generado:", map); // Tip: Revisa esto en la consola
            if (mounted) setProgressMap(map);
          } catch (e) {
            console.error("Error cargando progreso:", e);
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