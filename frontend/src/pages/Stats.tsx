export default function Stats() {
  const stats = [
    { label: 'Puntaje', value: 12450 },
    { label: 'Lecciones completadas', value: 12 },
    { label: 'Racha', value: '7 días' },
    { label: 'Mejor racha', value: '15 días' },
  ]

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="bg-gradient-to-br from-emerald-800/30 to-teal-900/20 p-6 rounded-lg shadow-lg border border-white/6">
        <h2 className="text-2xl font-bold mb-4">Estadísticas</h2>

        <ul className="space-y-3">
          {stats.map((s, i) => (
            <li key={i} className="flex justify-between items-center bg-white/5 p-3 rounded-md">
              <span className="font-medium">{s.label}</span>
              <span className="font-mono text-lg">{s.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}