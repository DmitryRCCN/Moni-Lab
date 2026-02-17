const items = [
  { id: 1, name: 'Sombrero verde', price: 50 },
  { id: 2, name: 'Gafas de sol', price: 80 },
  { id: 3, name: 'Capa de hojas', price: 120 },
]

export default function Store() {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-emerald-800/30 to-teal-900/20 p-6 rounded-lg shadow-lg border border-white/6">
        <h2 className="text-2xl font-bold mb-4">Tienda</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-white/5 p-4 rounded flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-emerald-500/30 mb-3 flex items-center justify-center">🙂</div>
              <div className="text-center">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-white/80">{item.price} monedas</p>
                <button className="mt-3 px-3 py-1 bg-amber-400 text-slate-900 rounded">Comprar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}