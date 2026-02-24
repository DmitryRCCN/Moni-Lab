import { useEffect, useState } from 'react'
import api from '../api'

type Item = { id_item: string; nombre: string; tipo: string; precio: number }

export default function Store() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<Item | null>(null)
  const [purchasing, setPurchasing] = useState(false)
  const [owned, setOwned] = useState<Record<string, boolean>>({})
  const [userCoins, setUserCoins] = useState<number | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const res = await api('/items')
        if (!mounted) return
        setItems(res || [])
        setError(null)
      } catch (err: any) {
        if (!mounted) return
        setError(err.message || 'Error cargando items')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()

    return () => { mounted = false }
  }, [])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const profile = await api('/usuario/me')
        if (!mounted) return
        // profile puede contener monedas_virtuales directamente
        setUserCoins(profile.monedas_virtuales ?? profile.user?.monedas_virtuales ?? null)
      } catch {
        // no hacer nada
      }
    })()
    return () => { mounted = false }
  }, [])

  async function confirmPurchase() {
    if (!selected) return
    setPurchasing(true)
    setMessage(null)
    try {
      const res = await api(`/items/${selected.id_item}/comprar`, { method: 'POST' })
      // res contiene monedas_restantes
      setOwned((s) => ({ ...s, [selected.id_item]: true }))
      if (res?.monedas_restantes !== undefined) setUserCoins(res.monedas_restantes)
      setMessage(`Comprado ${res.nombre}. Monedas restantes: ${res.monedas_restantes}`)
      setSelected(null)
    } catch (err: any) {
      setMessage(err.message || 'Error al comprar')
    } finally {
      setPurchasing(false)
    }
  }

  if (loading) return <div className="p-4 max-w-4xl mx-auto">Cargando tienda...</div>
  if (error) return <div className="p-4 max-w-4xl mx-auto text-red-300">{error}</div>

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-emerald-800/30 to-teal-900/20 p-6 rounded-lg shadow-lg border border-white/6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Tienda</h2>
          <div className="text-sm">Monedas: <span className="font-semibold">{userCoins ?? '—'}</span></div>
        </div>

        {message && <div className="mb-3 text-sm text-emerald-200">{message}</div>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.map(item => (
            <div key={item.id_item} className="bg-white/5 p-4 rounded flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-emerald-500/30 mb-3 flex items-center justify-center">🙂</div>
              <div className="text-center">
                <h3 className="font-semibold">{item.nombre}</h3>
                <p className="text-sm text-white/80">{item.precio} monedas</p>
                {owned[item.id_item]
                  ? <div className="mt-3 px-3 py-1 bg-white/10 rounded">Comprado</div>
                  : <button onClick={() => setSelected(item)} className="mt-3 px-3 py-1 bg-amber-400 text-slate-900 rounded">Comprar</button>
                }
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de confirmación simple */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-slate-900 p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-2">Confirmar compra</h3>
            <p className="mb-4">Comprar <span className="font-semibold">{selected.nombre}</span> por <span className="font-semibold">{selected.precio} monedas</span>?</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setSelected(null)} className="px-3 py-1 bg-white/10 rounded">Cancelar</button>
              <button onClick={confirmPurchase} disabled={purchasing} className="px-3 py-1 bg-amber-400 text-slate-900 rounded">{purchasing ? 'Comprando...' : 'Confirmar'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}