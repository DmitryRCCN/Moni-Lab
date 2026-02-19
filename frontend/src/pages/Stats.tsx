import { useEffect, useState } from 'react'
import api from '../api'

type StatsData = {
  experiencia_total?: number
  monedas_virtuales?: number
  nivel_actual?: number
  estadisticas?: {
    totalLecciones?: number
    leccionesCompletadas?: number
    puntajePromedio?: number
  }
}

export default function Stats() {
  const [data, setData] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    api('/usuario/me')
      .then((res) => {
        if (!mounted) return
        // /usuario/me puede devolver { user: {...} } o directamente el usuario
        const u = (res?.user ?? res) as any
        setData({
          experiencia_total: u.experiencia_total,
          monedas_virtuales: u.monedas_virtuales,
          nivel_actual: u.nivel_actual,
          estadisticas: u.estadisticas,
        })
        setError(null)
      })
      .catch((err) => {
        if (!mounted) return
        setError(err.message || 'Error al cargar estadísticas')
      })
      .finally(() => mounted && setLoading(false))

    return () => { mounted = false }
  }, [])

  if (loading) return <div className="p-4 max-w-3xl mx-auto">Cargando estadísticas...</div>
  if (error) return <div className="p-4 max-w-3xl mx-auto text-red-300">{error}</div>
  if (!data) return <div className="p-4 max-w-3xl mx-auto">Sin datos</div>

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="bg-gradient-to-br from-emerald-800/30 to-teal-900/20 p-6 rounded-lg shadow-lg border border-white/6">
        <h2 className="text-2xl font-bold mb-4">Estadísticas</h2>

        <ul className="space-y-3">
          <li className="flex justify-between items-center bg-white/5 p-3 rounded-md">
            <span className="font-medium">Experiencia total</span>
            <span className="font-mono text-lg">{data.experiencia_total ?? 0}</span>
          </li>
          <li className="flex justify-between items-center bg-white/5 p-3 rounded-md">
            <span className="font-medium">Monedas virtuales</span>
            <span className="font-mono text-lg">{data.monedas_virtuales ?? 0}</span>
          </li>
          <li className="flex justify-between items-center bg-white/5 p-3 rounded-md">
            <span className="font-medium">Nivel actual</span>
            <span className="font-mono text-lg">{data.nivel_actual ?? 1}</span>
          </li>
          <li className="flex justify-between items-center bg-white/5 p-3 rounded-md">
            <span className="font-medium">Lecciones totales</span>
            <span className="font-mono text-lg">{data.estadisticas?.totalLecciones ?? 0}</span>
          </li>
          <li className="flex justify-between items-center bg-white/5 p-3 rounded-md">
            <span className="font-medium">Lecciones completadas</span>
            <span className="font-mono text-lg">{data.estadisticas?.leccionesCompletadas ?? 0}</span>
          </li>
          <li className="flex justify-between items-center bg-white/5 p-3 rounded-md">
            <span className="font-medium">Puntaje promedio</span>
            <span className="font-mono text-lg">{Math.round((data.estadisticas?.puntajePromedio ?? 0) * 100) / 100}</span>
          </li>
        </ul>
      </div>
    </div>
  )
}