
import { Link } from 'react-router-dom'
import { useState } from 'react'

type Step = {
  id: string | number
  titulo: string
  descripcion?: string
  orden_secuencial?: number
  activities?: Array<{ id_actividad: string; tipo_actividad: string; orden_secuencial?: number }>
  locked?: boolean
}

export default function LearningPath({ nodes, progress }: { nodes?: Step[]; progress?: Record<string, string> }) {
  const [pulsing, setPulsing] = useState<Record<string | number, boolean>>({})

  function triggerPulse(id: string | number) {
    setPulsing(prev => ({ ...prev, [id]: true }))
    setTimeout(() => setPulsing(prev => ({ ...prev, [id]: false })), 300)
  }

  const items = nodes && nodes.length > 0 ? nodes : [
    { id: 1, titulo: 'Inicio' },
    { id: 2, titulo: 'Conceptos' },
    { id: 3, titulo: 'Ahorro' },
    { id: 4, titulo: 'Gastar' },
    { id: 5, titulo: 'Invertir', locked: true },
  ]

  const nodeTitle = nodes && nodes.length > 0 ? nodes[0].titulo : undefined

  return (
    <div className="flex flex-col items-center w-full">
      {nodeTitle && (
        <div className="mb-4 text-center w-full">
          <h2 className="text-xl font-semibold text-white/90">{nodeTitle}</h2>
        </div>
      )}

      <div className="relative w-full max-w-3xl">
        <div className="absolute left-1/2 top-0 bottom-0 w-1.5 bg-gradient-to-b from-emerald-400 via-teal-400 to-emerald-400 transform -translate-x-1/2" />

        <div className="space-y-16 py-8">
          {items.map((s, idx) => {
            const isLeft = idx % 2 === 0
            const isLocked = s.locked

            // determine activity badge: use first activity if available
            const firstAct = s.activities && s.activities.length > 0 ? s.activities[0] : undefined
            const nodoIndex = s.orden_secuencial ?? (idx + 1)
            const actividadIndex = firstAct?.orden_secuencial ?? 1
            const badgeText = `${nodoIndex}.${actividadIndex}`
            const actType = firstAct ? firstAct.tipo_actividad : undefined
            const estado = firstAct && progress ? progress[firstAct.id_actividad] : undefined

            // color based on estado: 'bloqueada','disponible','completada'
            let colorClass = 'bg-gradient-to-br from-emerald-400 to-teal-500 border-emerald-300'
            if (estado === 'bloqueada' || estado === 'bloqueada') colorClass = 'bg-gray-600 border-gray-500 text-white/70'
            if (estado === 'disponible') colorClass = 'bg-emerald-500 border-emerald-400 text-white'
            if (estado === 'completada') colorClass = 'bg-teal-600 border-teal-400 text-white'

            return (
              <div key={s.id} className="relative h-32 flex items-center">
                <div
                  className={`absolute top-1/2 h-0.5 w-20 bg-gradient-to-r from-emerald-300 to-transparent transform -translate-y-1/2 ${
                    isLeft ? 'right-1/2 mr-8' : 'left-1/2 ml-8'
                  }`}
                />

                <div
                  className={`absolute top-1/2 transform -translate-y-1/2 w-32 ${
                    isLeft ? 'right-1/2 mr-32 text-right' : 'left-1/2 ml-32 text-left'
                  }`}
                >
                  <p
                    className={`font-bold text-lg mb-2 ${
                      isLocked
                        ? 'text-white/50'
                        : idx === 0
                        ? 'text-emerald-300'
                        : idx < 3
                        ? 'text-amber-300'
                        : 'text-lime-300'
                    }`}
                  >
                    {badgeText}
                  </p>
                </div>

                <Link
                  to={isLocked || !firstAct ? '#' : `/lesson`}
                  state={firstAct ? { activityId: firstAct.id_actividad } : undefined}
                  className={`absolute left-1/2 transform -translate-x-1/2 flex-shrink-0 ${isLocked || !firstAct ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  onClick={() => !isLocked && firstAct && triggerPulse(firstAct.id_actividad)}
                >
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold shadow-lg transition-all duration-300 border-2 ${isLocked ? 'bg-gray-600 border-gray-500 text-white/70' : colorClass} ${pulsing[s.id] ? 'scale-125 ring-4 ring-emerald-300/40' : 'hover:scale-110'}`}
                  >
                    {/* only icon inside */}
                    <div className="text-2xl">
                      {actType === 'lectura' ? '📖' : actType === 'ejercicio' ? '✏️' : '•'}
                    </div>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      </div>

      <p className="mt-8 text-center text-white/70 text-sm max-w-md">
        ✨ Completa lecciones para desbloquear nuevos contenidos y ganar recompensas
      </p>
    </div>
  )
}