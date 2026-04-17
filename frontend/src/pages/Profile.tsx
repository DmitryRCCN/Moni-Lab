import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../api'
import { useAuth } from '../context/AuthContext'
import Avatar from '../components/avatar'
import EquipModal from '../components/equipModal'
import EditProfileModal from '../components/editProfileModal'

const ICONS = {
  book: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
      <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
    </svg>
  ),
  coin: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
      <path d="M6.375 5.5h.875v1.75h-.875a.875.875 0 1 1 0-1.75ZM8.75 10.5V8.75h.875a.875.875 0 0 1 0 1.75H8.75Z" />
      <path fillRule="evenodd" d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0ZM7.25 3.75a.75.75 0 0 1 1.5 0V4h2.5a.75.75 0 0 1 0 1.5h-2.5v1.75h.875a2.375 2.375 0 1 1 0 4.75H8.75v.25a.75.75 0 0 1-1.5 0V12h-2.5a.75.75 0 0 1 0-1.5h2.5V8.75h-.875a2.375 2.375 0 1 1 0-4.75h.875v-.25Z" clipRule="evenodd" />
    </svg>
  ),
  stats: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
      <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z" />
    </svg>
  ),
  star: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
    </svg>
  )
};

type ProfileData = {
  id: string
  email: string
  nombre: string
  monedas_virtuales?: number
  nivel_actual?: string
  equipped?: any
  estadisticas?: any
  items_comprados?: any[]
}

export default function Profile() {
  const [data, setData]       = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)
  const [showEquipEditor, setShowEquipEditor] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const { initializing }      = useAuth()

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        // Pedimos los items y el usuario al mismo tiempo para reconstruir el Avatar al recargar
        const [profileRes, itemsRes] = await Promise.all([api('/usuario/me'), api('/items')]);
        if (!mounted) return
        
        const userData = profileRes?.user || profileRes
        const allItems = itemsRes || []
        
        // Construimos el objeto "equipped" traduciendo el "equipado: true" a la estructura de Avatar.
        const dynamicallyEquipped: any = { ...userData.equipped };
        const purchased = userData?.items_comprados || [];
        
        purchased.forEach((purchasedItem: any) => {
          const isEquipped = purchasedItem.equipado === true || purchasedItem.equipado === 1 || String(purchasedItem.equipado) === 'true' || String(purchasedItem.equipado) === '1';
          
          if (isEquipped) {
            const itemDef = allItems.find((it: any) => String(it.id_item) === String(purchasedItem.id_item));
            if (itemDef) {
              dynamicallyEquipped[itemDef.tipo] = { id: itemDef.id_item, svg: itemDef.svg_capa };
            }
          }
        });
        
        userData.equipped = dynamicallyEquipped;
        setData(userData)
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

  // Función que el Modal llama para actualizar el Avatar sin tener que refrescar
  const handleAvatarUpdate = (item: any) => {
    setData((prevData) => {
      if (!prevData) return prevData;
      return {
        ...prevData,
        equipped: {
          ...prevData.equipped,
          [item.tipo]: { id: item.id_item, svg: item.svg_capa }
        }
      };
    });
  };

  const handleProfileUpdate = (newName: string) => {
    setData((prev) => prev ? { ...prev, nombre: newName } : prev);
  };

  if (loading) return <div className="text-center py-10 opacity-50 text-white">Cargando...</div>
  if (error)   return <div className="text-center py-10 text-red-400">{error}</div>
  if (!data)   return <div className="text-center py-10 opacity-50 text-white">No disponible</div>

  return (
    <div className="animate-in fade-in duration-500 space-y-6 max-w-4xl mx-auto p-4">

      <div className="moni-panel p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">

          <div className="w-32 h-32 shrink-0 rounded-3xl bg-emerald-900/40 border-4 border-white/10 overflow-hidden shadow-xl flex items-center justify-center">
            <Avatar 
              equipped={data.equipped} 
              className="w-full h-full" 
            />
          </div>

          <div className="flex-1">
            <h2 className="text-3xl font-black text-yellow-400 mb-1">{data.nombre}</h2>
            <p className="text-white/60 mb-4">{data.email}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <div className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm font-bold">
                Nivel {data.nivel_actual ?? '0.0'}
              </div>
              <div className="px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-xl text-amber-300 text-sm font-bold flex items-center gap-2">
                <span className="shrink-0">{ICONS.coin}</span> 
                <span>{data.monedas_virtuales?.toLocaleString() ?? 0}</span>
              </div>
            </div>
          </div>

          {/* Botones rediseñados */}
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3 mt-4 md:mt-0">
            <Link
              to="/store"
              className="w-full sm:w-auto px-6 py-3 bg-white text-emerald-800 font-bold rounded-xl hover:bg-yellow-300 transition-all text-center"
            >
              Tienda
            </Link>
            <button
              onClick={() => setShowEquipEditor(true)}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-400 transition-all text-center shadow-md"
            >
              Editar avatar
            </button>
            {/* NUEVO BOTÓN PARA EDITAR PERFIL */}
            <button
              onClick={() => setShowEditProfile(true)}
              className="w-full sm:w-auto px-6 py-3 bg-amber-500 text-slate-900 font-bold rounded-xl hover:bg-amber-400 transition-all text-center shadow-md"
            >
              Editar perfil
            </button>
          </div>
        </div>
      </div>

      {/* Renderizado de Modales */}
      {showEquipEditor && (
        <EquipModal 
          onClose={() => setShowEquipEditor(false)} 
          onAvatarUpdate={handleAvatarUpdate} 
        />
      )}

      {showEditProfile && (
        <EditProfileModal
          user={{ id: data.id, nombre: data.nombre, email: data.email }}
          onClose={() => setShowEditProfile(false)}
          onSuccess={handleProfileUpdate}
        />
      )}

      <div className="moni-panel p-6 mb-6">
        <h3 className="text-xl font-bold text-yellow-400 mb-6 flex items-center gap-2">
          {ICONS.stats} Estadísticas
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatItem 
            label="Lecciones" 
            value={data.estadisticas?.leccionesCompletadas ?? 0} 
            icon={ICONS.book} 
          />
          <StatItem 
            label="Puntaje"   
            value={Math.round((data.estadisticas?.puntajePromedio ?? 0) * 100) / 100} 
            icon={ICONS.star} 
          />
        </div>
      </div>

    </div>
  )
}

function StatItem({ label, value, icon }: { label: string; value: string | number; icon: ReactNode }) {
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