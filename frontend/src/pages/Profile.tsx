import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../api'
import { useAuth } from '../context/AuthContext'
import Avatar from '../components/avatar'
import EquipModal from '../components/equipModal'

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
              <div className="px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-xl text-amber-300 text-sm font-bold">
                🪙 {data.monedas_virtuales?.toLocaleString() ?? 0}
              </div>
            </div>
          </div>

          {/* Botones rediseñados para verse consistentes y reaccionar igual */}
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
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
          </div>
        </div>
      </div>

      {showEquipEditor && (
        <EquipModal 
          onClose={() => setShowEquipEditor(false)} 
          onAvatarUpdate={handleAvatarUpdate} 
        />
      )}

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