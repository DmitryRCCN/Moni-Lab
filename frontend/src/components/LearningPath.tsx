import { Link } from 'react-router-dom'
import { useState, useRef } from 'react'

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
  progress?: Record<string, 'bloqueada' | 'disponible' | 'completada'>
}

export default function LearningPath({ nodes = [], progress = {} }: Props) {
  const [pulsing, setPulsing] = useState<Record<string, boolean>>({})
  const carouselRef = useRef<HTMLDivElement>(null)

  function triggerPulse(id: string) {
    setPulsing(prev => ({ ...prev, [id]: true }))
    setTimeout(() => {
      setPulsing(prev => ({ ...prev, [id]: false }))
    }, 300)
  }

  // Lógica para los botones de las flechas
  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  if (!nodes.length) {
    return (
      <div className="text-white text-center py-10">
        No hay contenido disponible
      </div>
    )
  }

  const sortedNodes = [...nodes].sort((a, b) => a.orden_secuencial - b.orden_secuencial)

  return (
    <div className="relative w-full flex items-center justify-center group">
      
      {/* Botón Izquierdo */}
      <button 
        onClick={() => scroll('left')}
        className="absolute left-0 z-30 p-2 text-emerald-400 bg-gray-900/40 backdrop-blur-md rounded-full transition-all hover:scale-110 active:scale-95 sm:left-2"
        aria-label="Nodo anterior"
      >
        <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Contenedor del Carrusel */}
      <div 
        ref={carouselRef}
        className="flex w-full overflow-x-auto snap-x snap-mandatory pb-12 pt-4 px-14 sm:px-24
                   [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {sortedNodes.map((node) => (
          <div 
            key={node.id_nodo} 
            className="w-full flex-shrink-0 snap-center flex flex-col items-center relative"
          >
            {/* Título del Nodo */}
            <h3 className="text-xl font-bold text-yellow-400 mb-10 text-center px-4">
              {`Unidad ${node.orden_secuencial}: ${node.titulo}`}
            </h3>

            {/* Contenedor vertical de actividades con su propia línea conectora */}
            <div className="relative flex flex-col items-center gap-16 w-full max-w-md">
              
              {/* Línea central (ahora es local para cada nodo) */}
              <div className="absolute left-1/2 top-0 bottom-0 w-1.5 bg-gradient-to-b from-emerald-400/20 via-teal-400/50 to-emerald-400/20 transform -translate-x-1/2 rounded-full" />

              {node.activities
                .sort((a, b) => (a.orden_secuencial ?? 1) - (b.orden_secuencial ?? 1))
                .map((activity, actIndex) => {
                  const estado = progress[activity.id_actividad] || 'bloqueada'
                  const isLocked = estado === 'bloqueada'
                  const isLeft = actIndex % 2 === 0

                  let colorClass = 'bg-gradient-to-br from-emerald-400 to-teal-500 border-emerald-300'
                  if (estado === 'bloqueada') colorClass = 'bg-gray-700 border-gray-600 text-white/30 shadow-none'
                  if (estado === 'disponible') colorClass = 'bg-emerald-500 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                  if (estado === 'completada') colorClass = 'bg-teal-700 border-teal-500 text-white/80'

                  const numero = `${node.orden_secuencial}.${activity.orden_secuencial ?? 1}`

                  const ButtonContent = (
                    <div
                      className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg transition-all duration-300 border-4 ${colorClass} ${
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
                      <div className={`absolute w-32 ${isLeft ? 'right-1/2 mr-12 sm:mr-24 text-right' : 'left-1/2 ml-12 sm:ml-24 text-left'}`}>
                        <p className={`font-bold text-lg ${isLocked ? 'text-white/20' : estado === 'completada' ? 'text-teal-500' : 'text-emerald-400'}`}>
                          {numero}
                        </p>
                      </div>

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
                          className="cursor-pointer focus:outline-none"
                        >
                          {ButtonContent}
                        </Link>
                      )}
                    </div>
                  )
                })}
            </div>
          </div>
        ))}
      </div>

      {/* Botón Derecho */}
      <button 
        onClick={() => scroll('right')}
        className="absolute right-0 z-30 p-2 text-emerald-400 bg-gray-900/40 backdrop-blur-md rounded-full transition-all hover:scale-110 active:scale-95 sm:right-2"
        aria-label="Siguiente nodo"
      >
        <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
        </svg>
      </button>

    </div>
  )
}