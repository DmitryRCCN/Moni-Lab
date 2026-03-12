import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../api'
import { useAuth } from '../context/AuthContext'
import Avatar from '../components/avatar'

// Tipo alineado con la respuesta de getUserProfile del Service
type ProfileData = {
  id: string
  email: string
  nombre: string
  monedas_virtuales?: number
  nivel_actual?: string
  equipped?: {
    background: { id: string };
    base:       { id: string };
    clothing:   { id: string };
    eyes:       { id: string };
    hair:       { id: string };
    accessory:  { id: string };
  };
  estadisticas?: {
    leccionesCompletadas?: number
    puntajePromedio?: number
  }
}

export default function Profile() {
  const [data, setData]       = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)
  const { initializing }      = useAuth()

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const res = await api('/usuario/me') // Asumiendo que este endpoint llama a getUserProfile
        if (!mounted) return
        // Ajustamos la asignación según la estructura del service
        setData(res?.user ?? res)
      } catch (err: any) {
        if (!mounted) return
        setError(err.message || 'Error al cargar perfil')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    if (!initializing) load()
    return () => { mounted = false }
  }, [initializing])

  if (loading) return <div className="text-center py-10 opacity-50 text-white">Cargando...</div>
  if (error)   return <div className="text-center py-10 text-red-400">{error}</div>
  if (!data)   return <div className="text-center py-10 opacity-50 text-white">No disponible</div>

  return (
    <div className="animate-in fade-in duration-500 space-y-6 max-w-4xl mx-auto p-4">

      {/* ── PERFIL PRINCIPAL ──────────────────────────────────────────────── */}
      <div className="moni-panel p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">

          {/* Avatar Dinámico */}
          <div className="w-32 h-32 shrink-0 rounded-3xl bg-emerald-900/40 border-4 border-white/10 overflow-hidden shadow-xl flex items-center justify-center">
            <Avatar 
              equipped={data.equipped} // Pasamos el objeto completo del backend
              className="w-full h-full" 
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            <h2 className="text-3xl font-black text-yellow-400 mb-1">{data.nombre}</h2>
            <p className="text-white/60 mb-4">{data.email}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <div className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm font-bold">
                Nivel {data.nivel_actual ?? '0.0'}
              </div>
              <div className="px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-xl text-amber-300 text-sm font-bold">
                🪙 {data.monedas_virtuales?.toLocaleString() ?? 0}
              </div>
            </div>
          </div>

          <Link
            to="/store"
            className="w-full md:w-auto px-6 py-3 bg-white text-emerald-800 font-bold rounded-xl hover:bg-yellow-300 transition-all text-center"
          >
            Tienda
          </Link>
        </div>
      </div>

      {/* ── ESTADÍSTICAS (Mismo estilo) ────────────────────────────────────── */}
      <div className="moni-panel p-6 mb-6">
        <h3 className="text-xl font-bold text-yellow-400 mb-6 flex items-center gap-2">
          📊 Estadísticas
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatItem 
            label="Lecciones" 
            value={data.estadisticas?.leccionesCompletadas ?? 0} 
            icon="📚" 
          />
          <StatItem 
            label="Puntaje"   
            value={Math.round((data.estadisticas?.puntajePromedio ?? 0) * 100) / 100} 
            icon="🎯" 
          />
        </div>
      </div>

    </div>
  )
}

function StatItem({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <div className="flex justify-between items-center bg-black/40 p-4 rounded-2xl border border-white/5">
      <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <span className="text-white/70 font-medium">{label}</span>
      </div>
      <span className="text-xl font-black text-white">{value}</span>
    </div>
  )
}