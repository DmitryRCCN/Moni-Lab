import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../api'
import { useAuth } from '../context/AuthContext'

type ProfileData = {
  id: string
  email: string
  nombre: string
  monedas_virtuales?: number
  nivel_actual?: string
  estadisticas?: {
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
        // Manejamos si la respuesta viene envuelta en un objeto 'user'
        setData(res?.user ?? res)
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

    return () => { mounted = false }
  }, [initializing])

  if (loading) return <div className="text-center py-10 opacity-50">Cargando perfil...</div>
  if (error) return <div className="text-center py-10 text-red-400">{error}</div>
  if (!data) return <div className="text-center py-10 opacity-50">Perfil no disponible</div>

  const initials = data.nombre 
    ? data.nombre.split(' ').map(s => s[0]).slice(0, 2).join('') 
    : data.email[0].toUpperCase()

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      
      {/* CABECERA DE PERFIL */}
      <div className="moni-panel p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          
          {/* EL CÍRCULO (Arreglado con shrink-0) */}
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-yellow-300 to-orange-500 flex items-center justify-center text-3xl font-bold text-slate-900 shadow-lg shrink-0 border-4 border-white/10">
            {initials}
          </div>

          <div className="flex-1">
            <h2 className="text-3xl font-black text-yellow-400 mb-1">{data.nombre}</h2>
            <p className="text-white/60 mb-4">{data.email}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <div className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm font-bold">
                Nivel actual {data.nivel_actual ?? '1.0'}
              </div>
              <div className="px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-xl text-amber-300 text-sm font-bold">
                🪙 {data.monedas_virtuales?.toLocaleString() ?? 0} Monedas
              </div>
            </div>
          </div>

          <Link to="/store" className="w-full md:w-auto px-6 py-3 bg-white text-emerald-800 font-bold rounded-xl hover:bg-yellow-300 hover:text-emerald-900 transition-all shadow-md text-center">
            Ir a la Tienda
          </Link>
        </div>
      </div>

      {/* SECCIÓN DE ESTADÍSTICAS (Lo que estaba en stats.tsx) */}
      <div className="moni-panel p-6 md:p-8">
        <h3 className="text-xl font-bold text-yellow-400 mb-6 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
            <path d="M15.5 2A1.5 1.5 0 0 0 14 3.5v13a1.5 1.5 0 0 0 1.5 1.5h1a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 16.5 2h-1ZM9.5 6A1.5 1.5 0 0 0 8 7.5v9A1.5 1.5 0 0 0 9.5 18h1a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 10.5 6h-1ZM3.5 10A1.5 1.5 0 0 0 2 11.5v5A1.5 1.5 0 0 0 3.5 18h1A1.5 1.5 0 0 0 6 16.5v-5A1.5 1.5 0 0 0 4.5 10h-1Z" />
          </svg>
          Estadísticas
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatItem label="Lecciones Completadas" value={data.estadisticas?.leccionesCompletadas ?? 0} icon="📚" />
          <StatItem label="Puntaje Promedio" value={Math.round((data.estadisticas?.puntajePromedio ?? 0) * 100) / 100} icon="🎯" />

        </div>
      </div>

    </div>
  )
}

// Sub-componente para las tarjetas de estadísticas individuales
function StatItem({ label, value, icon }: { label: string, value: string | number, icon: string }) {
  return (
    <div className="flex justify-between items-center bg-black/30 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
      <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <span className="text-white/70 font-medium">{label}</span>
      </div>
      <span className="text-xl font-black text-white">{value}</span>
    </div>
  )
}