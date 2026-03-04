import { Link } from 'react-router-dom'
import { useState } from 'react'

type Activity = {
  id_actividad: string
  tipo_actividad: string
  orden_secuencial?: number
  estado?: 'bloqueada' | 'disponible' | 'completada'
}

type Step = {
  id_nodo: string
  titulo: string
  descripcion?: string
  orden_secuencial: number
  activities: Activity[]
}

type Props = {
  nodes?: Step[]
  // Aseguramos que si no llega el estado de una actividad, por defecto sea 'bloqueada'
  progress?: Record<string, 'bloqueada' | 'disponible' | 'completada'>
}

export default function LearningPath({ nodes = [], progress = {} }: Props) {
  const [pulsing, setPulsing] = useState<Record<string, boolean>>({})

  function triggerPulse(id: string) {
    setPulsing(prev => ({ ...prev, [id]: true }))
    setTimeout(() => {
      setPulsing(prev => ({ ...prev, [id]: false }))
    }, 300)
  }

  if (!nodes.length) {
    return (
      <div className="text-white text-center py-10">
        No hay contenido disponible
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative w-full max-w-3xl">
        {/* Línea central */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1.5 bg-gradient-to-b from-emerald-400 via-teal-400 to-emerald-400 transform -translate-x-1/2" />

        <div className="space-y-24 py-12">
          {nodes
            .sort((a, b) => a.orden_secuencial - b.orden_secuencial)
            .map((node) => {
              return (
                <div key={node.id_nodo} className="relative flex flex-col items-center">
                  <h3 className="text-lg font-semibold text-white/90 mb-8">
                    {`${node.orden_secuencial}. ${node.titulo}`}
                  </h3>

                  <div className="flex flex-col items-center gap-16">
                    {node.activities
                      .sort((a, b) => (a.orden_secuencial ?? 1) - (b.orden_secuencial ?? 1))
                      .map((activity, actIndex) => {
                        // LÓGICA DE ESTADO: Si no existe en progress, asumimos 'bloqueada'
                        const estado = progress[activity.id_actividad] || 'bloqueada'
                        const isLocked = estado === 'bloqueada'
                        const isLeft = actIndex % 2 === 0

                        let colorClass = 'bg-gradient-to-br from-emerald-400 to-teal-500 border-emerald-300'
                        if (estado === 'bloqueada') colorClass = 'bg-gray-600 border-gray-500 text-white/30 shadow-none'
                        if (estado === 'disponible') colorClass = 'bg-emerald-500 border-emerald-400 text-white'
                        if (estado === 'completada') colorClass = 'bg-teal-600 border-teal-400 text-white'

                        const numero = `${node.orden_secuencial}.${activity.orden_secuencial ?? 1}`

                        // CONTENIDO DEL BOTÓN
                        const ButtonContent = (
                          <div
                            className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg transition-all duration-300 border-2 ${colorClass} ${
                              !isLocked && pulsing[activity.id_actividad]
                                ? 'scale-125 ring-4 ring-emerald-300/40'
                                : !isLocked ? 'hover:scale-110' : ''
                            }`}
                          >
                            {activity.tipo_actividad === 'lectura' ? '📖' : '✏️'}
                          </div>
                        )

                        return (
                          <div key={activity.id_actividad} className="relative flex items-center justify-center w-full">
                            {/* Número lateral */}
                            <div className={`absolute w-32 ${isLeft ? 'right-1/2 mr-24 text-right' : 'left-1/2 ml-24 text-left'}`}>
                              <p className={`font-bold text-lg ${isLocked ? 'text-white/20' : estado === 'completada' ? 'text-teal-300' : 'text-emerald-300'}`}>
                                {numero}
                              </p>
                            </div>

                            {/* Línea vertical conectora */}
                            {actIndex !== node.activities.length - 1 && (
                              <div className={`absolute top-16 w-1 h-12 ${isLocked ? 'bg-gray-700' : 'bg-emerald-400/30'}`} />
                            )}

                            {/* RENDERIZADO CONDICIONAL DE NAVEGACIÓN */}
                            {isLocked ? (
                              <div className="cursor-not-allowed opacity-60">
                                {ButtonContent}
                              </div>
                            ) : (
                              <Link
                                to="/lesson"
                                state={{ activityId: activity.id_actividad }}
                                onClick={() => triggerPulse(activity.id_actividad)}
                                className="cursor-pointer"
                              >
                                {ButtonContent}
                              </Link>
                            )}
                          </div>
                        )
                      })}
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}