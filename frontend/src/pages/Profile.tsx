import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../api'
import { useAuth } from '../context/AuthContext'

type ProfileData = {
  id: string
  email: string
  nombre: string
  rol?: string
  experiencia_total?: number
  monedas_virtuales?: number
  nivel_actual?: number
  estadisticas?: {
    totalLecciones?: number
    leccionesCompletadas?: number
    puntajePromedio?: number
  }
}

export default function Profile() {
  const [data, setData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { initializing } = useAuth()

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const res = await api('/usuario/me')
        if (!mounted) return
        setData(res)
  
        setError(null)
      } catch (err: any) {
        if (!mounted) return
        setError(err.message || 'Error al cargar perfil')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    if (!initializing) {
      load()
    }

    return () => {
      mounted = false
    }
  }, [initializing])

  if (loading) return <div className="p-4 max-w-4xl mx-auto">Cargando perfil...</div>
  if (error) return <div className="p-4 max-w-4xl mx-auto text-red-300">{error}</div>

  if (!data) return <div className="p-4 max-w-4xl mx-auto">Perfil no disponible</div>

  const initials = data.nombre ? data.nombre.split(' ').map(s => s[0]).slice(0,2).join('') : data.email[0] 

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-emerald-800/40 to-teal-900/30 p-6 rounded-lg shadow-lg border border-white/6">
        <div className="flex items-center gap-6">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 flex items-center justify-center text-3xl font-bold text-slate-900">{initials}</div>
          <div>
            <h3 className="text-2xl font-bold">{data.nombre}</h3>
            <p className="text-sm text-white/80 mt-1">Nivel {data.nivel_actual || 1} · <span className="font-semibold">{data.monedas_virtuales ?? 0}</span> monedas</p>
            <div className="mt-3 flex gap-3">
              <Link to="/stats" className="px-3 py-1 bg-white/10 rounded hover:bg-white/20">Ver estadísticas</Link>
              <Link to="/store" className="px-3 py-1 bg-white/10 rounded hover:bg-white/20">Tienda</Link>
            </div>
          </div>
        </div>
        <section className="mt-6 bg-white/5 p-4 rounded">
          <h4 className="font-semibold mb-2">Acerca de</h4>
          <p className="text-sm text-white/80">Experiencia total: <span className="font-semibold">{data.experiencia_total ?? 0}</span></p>
          <p className="text-sm text-white/80">Email: <span className="font-semibold">{data.email}</span></p>
          <div className="mt-3">
            <h5 className="font-semibold mb-1">Estadísticas</h5>
            <p className="text-sm text-white/80">Lecciones totales: {data.estadisticas?.totalLecciones ?? 0}</p>
            <p className="text-sm text-white/80">Completadas: {data.estadisticas?.leccionesCompletadas ?? 0}</p>
            <p className="text-sm text-white/80">Puntaje promedio: {Math.round((data.estadisticas?.puntajePromedio ?? 0) * 100) / 100}</p>
          </div>
        </section>
      </div>
    </div>
  )
}