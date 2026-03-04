import { useEffect, useState } from 'react'
import api from '../api'

type Item = { id_item: string; nombre: string; tipo: string; precio: number }

export default function Store() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<Item | null>(null)
  const [purchasing, setPurchasing] = useState(false)
  const [activeTab, setActiveTab] = useState<'shop' | 'inventory'>('shop')
  const [ownedIds, setOwnedIds] = useState<Set<string>>(new Set())
  const [userCoins, setUserCoins] = useState<number | null>(null)
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
        
        // ---DETECCIÓN DE ITEMS PROPIOS ---
        // Buscamos las monedas y los items tanto en la raíz como dentro de 'user'
        const userData = profileRes?.user || profileRes
        setUserCoins(userData?.monedas_virtuales ?? 0)
        
        // Mapeamos los IDs asegurándonos de que sean Strings para la comparación
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

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  async function confirmPurchase() {
    if (!selected) return
    
    // --- CIERRE DEL MODAL ---
    // Guardamos la referencia y cerramos el modal inmediatamente para que 
    // el usuario vea la notificación mientras el proceso ocurre de fondo
    const itemToBuy = selected
    setSelected(null) 
    
    setPurchasing(true)
    try {
      const res = await api(`/items/${itemToBuy.id_item}/comprar`, { method: 'POST' })
      
      if (res?.monedas_restantes !== undefined) setUserCoins(res.monedas_restantes)
      
      // Actualizamos el set de IDs comprados
      setOwnedIds(prev => {
        const next = new Set(prev)
        next.add(String(itemToBuy.id_item))
        return next
      })
      
      setNotification({ msg: `¡Éxito! Has adquirido ${itemToBuy.nombre}`, type: 'success' })
    } catch (err: any) {
      setNotification({ msg: err.message || 'No se pudo completar la compra', type: 'error' })
    } finally {
      setPurchasing(false)
    }
  }

  if (loading) return <div className="p-8 text-center text-white/50">Cargando tienda...</div>
  
  // Filtrado de items según el Set de IDs
  const shopItems = items.filter(item => !ownedIds.has(String(item.id_item)))
  const inventoryItems = items.filter(item => ownedIds.has(String(item.id_item)))

  return (
    <div className="p-4 max-w-5xl mx-auto animate-in fade-in duration-500">
      
      {notification && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-right-full duration-300">
          <div className={`px-6 py-3 rounded-xl shadow-2xl border flex items-center gap-3 ${
            notification.type === 'success' 
              ? 'bg-emerald-900/90 border-emerald-500 text-emerald-200' 
              : 'bg-red-900/90 border-red-500 text-red-200'
          }`}>
            <span className="text-xl">{notification.type === 'success' ? '✅' : '❌'}</span>
            <p className="font-medium">{notification.msg}</p>
          </div>
        </div>
      )}

      <div className="moni-panel p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Moni-Store
            </h1>
            <p className="text-white/40 text-sm">Personaliza tu experiencia</p>
          </div>
          
          <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-3">
            <span className="text-yellow-400 text-xl font-bold">🪙</span>
            <span className="text-2xl font-black text-white">{userCoins?.toLocaleString() ?? 0}</span>
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
            <h3 className="text-2xl font-bold mb-2">¿Confirmar compra?</h3>
            <p className="text-white/60 mb-6">
              Comprar <span className="text-white font-bold">{selected.nombre}</span> por <span className="text-yellow-400 font-bold">{selected.precio} monedas</span>.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={confirmPurchase} 
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black rounded-2xl transition-all"
              >
                Confirmar
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
    </div>
  )
}

function ItemCard({ item, onBuy, isOwned }: { item: Item; onBuy?: () => void; isOwned: boolean }) {
  return (
    <div className="group bg-white/5 border border-white/5 p-6 rounded-3xl flex flex-col items-center">
      <div className="w-32 h-32 rounded-2xl bg-emerald-500/10 mb-4 flex items-center justify-center text-5xl">
        {item.tipo === 'skin' ? '👤' : '✨'}
      </div>
      <h3 className="text-lg font-bold mb-1">{item.nombre}</h3>
      <p className="text-xs text-white/40 uppercase mb-4">{item.tipo}</p>
      {isOwned ? (
        <span className="text-emerald-400 font-bold text-sm">Adquirido</span>
      ) : (
        <button onClick={onBuy} className="w-full py-3 bg-amber-400 text-slate-900 font-bold rounded-xl">
          {item.precio} monedas
        </button>
      )}
    </div>
  )
}