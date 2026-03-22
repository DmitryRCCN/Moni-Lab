import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import api from '../api'
import Avatar from '../components/avatar'
import EquipModal from '../components/equipModal'
import { useAuth } from '../context/AuthContext'

const ICONS = {
  success: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-emerald-400">
      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
    </svg>
  ),
  error: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-red-400">
      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
    </svg>
  ),
  coin: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-yellow-400">
      <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 0 1-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004ZM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 0 1-.921.42Z" />
      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v.816a3.836 3.836 0 0 0-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 0 1-.921-.421l-.879-.66a.75.75 0 0 0-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 0 0 1.5 0v-.81a4.124 4.124 0 0 0 1.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 0 0-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 0 0 .933-1.175l-.415-.33a3.836 3.836 0 0 0-1.719-.755V6Z" clipRule="evenodd" />
    </svg>
  )  
};

type Item = { 
  id_item: string; 
  nombre: string; 
  tipo: string; 
  precio: number; 
  svg_capa?: string
}

export default function Store() {
  const { user, updateUserData } = useAuth();
  
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<Item | null>(null)
  const [purchasing, setPurchasing] = useState(false)
  const [showEquipEditor, setShowEquipEditor] = useState(false)
  const [equipPromptItem, setEquipPromptItem] = useState<Item | null>(null)
  const [activeTab, setActiveTab] = useState<'shop' | 'inventory'>('shop')
  const [ownedIds, setOwnedIds] = useState<Set<string>>(new Set())
  const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    let mounted = true
    async function loadData() {
      setLoading(true)
      try {
        const [itemsRes, profileRes] = await Promise.all([
          api('/items'),
          api('/usuario/me')
        ])
        if (!mounted) return

        setItems(itemsRes || [])
        const userData = profileRes?.user || profileRes
        
        // Sincronizamos monedas iniciales con el contexto por si acaso
        updateUserData({ monedas_virtuales: userData?.monedas_virtuales ?? 0 });
        
        const purchased = userData?.items_comprados?.map((i: any) => String(i.id_item)) || []
        setOwnedIds(new Set(purchased))
      } catch (err: any) {
        if (mounted) setError(err.message || 'Error cargando la tienda')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    loadData()
    return () => { mounted = false }
  }, [])

  const location = useLocation()
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('edit') === '1') setShowEquipEditor(true)
  }, [location.search])

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  async function confirmPurchase() {
    if (!selected) return
    const itemToBuy = selected
    setSelected(null) 
    setPurchasing(true)
    
    try {
      const res = await api(`/items/${itemToBuy.id_item}/comprar`, { method: 'POST' })
      
      // --- SINCRONIZACIÓN DE MONEDAS ---
      if (res?.monedas_restantes !== undefined) {
        updateUserData({ monedas_virtuales: res.monedas_restantes });
      }
      
      setOwnedIds(prev => {
        const next = new Set(prev)
        next.add(String(itemToBuy.id_item))
        return next
      })
      setNotification({ msg: `¡Éxito! Has adquirido ${itemToBuy.nombre}`, type: 'success' })
      setEquipPromptItem(itemToBuy)
    } catch (err: any) {
      setNotification({ msg: 'No se pudo completar la compra', type: 'error' })
    } finally {
      setPurchasing(false)
    }
  }

  if (loading) return <div className="p-8 text-center text-white/50">Cargando tienda...</div>
  
  const shopItems = items.filter(item => !ownedIds.has(String(item.id_item)))
  const inventoryItems = items.filter(item => ownedIds.has(String(item.id_item)))

  return (
   <div className="animate-in fade-in duration-500">
      
      {notification && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 p-4 rounded-xl shadow-2xl border animate-in slide-in-from-right duration-300 ${
          notification.type === 'success' 
            ? 'bg-emerald-900/90 border-emerald-500 text-emerald-50' 
            : 'bg-red-900/90 border-red-500 text-red-50'
        }`}>
          {notification.type === 'success' ? ICONS.success : ICONS.error}
          
          <span className="font-medium">{notification.msg}</span>
          
          {/* Botón opcional para cerrar */}
          <button 
            onClick={() => setNotification(null)}
            className="ml-2 opacity-50 hover:opacity-100 transition-opacity"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className="moni-panel p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-yellow-400 mb-3">Moni-Store</h1>
            <p className="text-white/40 text-sm">Personaliza tu experiencia</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowEquipEditor(true)}
              className="mr-3 px-6 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-400 transition-all shadow-md"
            >
              Editar avatar
            </button>
            <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-3">
              {ICONS.coin}
              <span className="text-2xl font-black text-white">
                {(user?.monedas_virtuales || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex p-1 bg-black/20 rounded-2xl mb-8 w-fit mx-auto md:mx-0">
          <button 
            onClick={() => setActiveTab('shop')}
            className={`px-8 py-2 rounded-xl font-bold transition-all ${activeTab === 'shop' ? 'bg-emerald-500 text-white shadow-lg' : 'text-white/50 hover:text-white'}`}
          >
            Tienda
          </button>
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`px-8 py-2 rounded-xl font-bold transition-all ${activeTab === 'inventory' ? 'bg-emerald-500 text-white shadow-lg' : 'text-white/50 hover:text-white'}`}
          >
            Mi Inventario
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'shop' ? (
            shopItems.length > 0 ? shopItems.map(item => (
              <ItemCard key={item.id_item} item={item} onBuy={() => setSelected(item)} isOwned={false} />
            )) : (
              <div className="col-span-full text-center py-12">
                <p className="text-white/20 italic">¡Has comprado todo lo disponible!</p>
              </div>
            )
          ) : (
            inventoryItems.length > 0 ? inventoryItems.map(item => (
              <ItemCard key={item.id_item} item={item} isOwned={true} />
            )) : (
              <div className="col-span-full text-center py-12 text-white/20 italic">
                Aún no tienes ítems en tu inventario.
              </div>
            )
          )}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 p-8 rounded-3xl shadow-2xl w-full max-w-sm text-center">
            <div className="flex justify-center mb-4 scale-150">
               {ICONS.coin}
            </div>
            <h3 className="text-2xl font-bold mb-2">¿Confirmar compra?</h3>
            <p className="text-white/60 mb-6">
              Comprar <span className="text-white font-bold">{selected.nombre}</span> por <span className="text-yellow-400 font-bold">{selected.precio} monedas</span>.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={confirmPurchase} 
                disabled={purchasing}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black rounded-2xl transition-all disabled:opacity-50"
              >
                {purchasing ? 'Procesando...' : 'Confirmar'}
              </button>
              <button 
                onClick={() => setSelected(null)} 
                className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {equipPromptItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl shadow-2xl w-full max-w-sm text-center">
            <h4 className="text-lg font-bold mb-2">¿Deseas equipar este ítem ahora?</h4>
            <p className="text-white/60 mb-6">{equipPromptItem.nombre}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={async () => {
                  const item = equipPromptItem
                  setEquipPromptItem(null)
                  try {
                    await api(`/items/${item.id_item}/equipar`, { method: 'POST' })
                    
                    // --- SINCRONIZACIÓN DE AVATAR ---
                    const nuevoEquipamiento = { 
                      ...user?.equipped, 
                      [item.tipo]: { id: item.id_item, svg: item.svg_capa } 
                    };
                    updateUserData({ equipped: nuevoEquipamiento });

                    setNotification({ msg: `Equipo aplicado: ${item.nombre}`, type: 'success' })
                  } catch (err: any) {
                    setNotification({ msg: 'No se pudo equipar el item', type: 'error' })
                  }
                }}
                className="w-full py-3 bg-emerald-500 text-slate-900 rounded-xl font-bold"
              >
                Sí
              </button>
              <button
                onClick={() => setEquipPromptItem(null)}
                className="w-full py-3 bg-white/5 text-white rounded-xl font-bold"
              >
                No gracias
              </button>
            </div>
          </div>
        </div>
      )}

      {showEquipEditor && (
        <EquipModal onClose={() => setShowEquipEditor(false)} />
      )}
    </div>
  )
}

// ItemCards
function ItemCard({ item, onBuy, isOwned }: { item: Item & { svg_capa?: string }; onBuy?: () => void; isOwned: boolean }) {
  const previewEquipped: any = {
    base: item.tipo === 'base' 
      ? { id: item.id_item, svg: item.svg_capa } 
      : { id: 'base_peach' }, 
    [item.tipo]: { id: item.id_item, svg: item.svg_capa }
  };

  return (
    <div className="group bg-white/5 border border-white/5 p-6 rounded-3xl flex flex-col items-center">
      <div className="w-32 h-32 rounded-2xl bg-emerald-500/10 mb-4 flex items-center justify-center overflow-hidden">
        <Avatar equipped={previewEquipped} className="w-full h-full" />
      </div>
      <h3 className="text-lg font-bold mb-1 text-center">{item.nombre}</h3>
      <p className="text-xs text-white/40 uppercase mb-4">{item.tipo}</p>
      {isOwned ? (
        <span className="text-emerald-400 font-bold text-sm">Adquirido</span>
      ) : (
        <button onClick={onBuy} className="w-full py-3 bg-amber-400 text-slate-900 font-bold rounded-xl hover:bg-amber-300 transition-colors">
          {item.precio} monedas
        </button>
      )}
    </div>
  )
}