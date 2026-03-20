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

// 1. AÑADIMOS "decorations" AL TEMA
// El número de la izquierda indica DESPUÉS DE QUÉ ACTIVIDAD (índice 0, 1, 2...) aparecerá la imagen
const THEMES: Record<number, { 
  colorTitle: string; 
  lineGradient: string; 
  mascotUrl: string;
  decorations?: Record<number, string>; // Nuevo: Índice de la actividad -> Ruta de la imagen
}> = {
  1: {
    colorTitle: 'text-blue-400',
    lineGradient: 'from-blue-400/20 via-blue-400/50 to-blue-400/20',
    mascotUrl: '/assets/mono-leyendo.png', // La imagen del mono leyendo estilo Duolingo
    decorations: {
      0: '/assets/mono-emoji-confundido.png', // Aparece al lado del primer nodo
      2: '/assets/libro-moneda.png'           // Aparece al lado del tercer nodo (el libro con la moneda en lugar del búho)
    }
  },
  2: {
    colorTitle: 'text-yellow-400',
    lineGradient: 'from-yellow-400/20 via-orange-400/50 to-yellow-400/20',
    mascotUrl: '/assets/mono-emoji-confundido.png',
    decorations: {
      1: '/assets/mono-leyendo.png' // Puedes reutilizar imágenes en diferentes posiciones
    }
  },
  3: {
    colorTitle: 'text-purple-400',
    lineGradient: 'from-purple-400/20 via-pink-400/50 to-purple-400/20',
    mascotUrl: '/assets/libro-moneda.png',
    decorations: {
      0: '/assets/mono-leyendo.png',
      3: '/assets/mono-emoji-confundido.png'
    }
  }
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

  const scroll = (direction: 'up' | 'down') => {
    if (!carouselRef.current) return
    const container = carouselRef.current

    const slides = Array.from(container.children) as HTMLElement[]
    if (slides.length === 0) return

    const currentScroll = container.scrollTop
    let currentIndex = 0
    let minDiff = Infinity

    slides.forEach((slide, index) => {
      const diff = Math.abs(slide.offsetTop - currentScroll)
      if (diff < minDiff) {
        minDiff = diff
        currentIndex = index
      }
    })

    const nextIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

    if (nextIndex >= 0 && nextIndex < slides.length) {
      slides[nextIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
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
    <div className="w-full flex flex-col items-center justify-center py-4 gap-4">
      
      <button 
        onClick={() => scroll('up')}
        className="z-30 p-3 text-emerald-400 bg-gray-900/80 backdrop-blur-md rounded-full transition-all hover:scale-110 active:scale-95 shadow-lg border border-gray-700"
        aria-label="Sección anterior"
      >
        <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
        </svg>
      </button>

      <div 
        ref={carouselRef}
        className="flex flex-col w-full h-[70vh] overflow-y-auto snap-y snap-mandatory py-4 gap-24
                   [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {sortedNodes.map((node) => {
          const theme = THEMES[node.orden_secuencial] || {
            colorTitle: 'text-emerald-400',
            lineGradient: 'from-emerald-400/20 via-teal-400/50 to-emerald-400/20',
            mascotUrl: '/assets/default-mascot.png'
          }

          return (
            <div 
              key={node.id_nodo} 
              className="w-full flex-shrink-0 snap-start flex flex-col items-center relative px-4 sm:px-14 md:px-24 pb-12"
            >
              <div className="flex flex-col items-center mb-10">
                <img src={theme.mascotUrl} alt={`Mascota unidad ${node.orden_secuencial}`} className="w-28 h-28 object-contain mb-4 drop-shadow-xl" />
                <h3 className={`text-2xl font-black ${theme.colorTitle} text-center px-4 tracking-wide uppercase`}>
                  Unidad {node.orden_secuencial}: {node.titulo}
                </h3>
              </div>

              <div className="relative flex flex-col items-center gap-16 w-full max-w-md">
                <div className={`absolute left-1/2 top-0 bottom-0 w-2 bg-gradient-to-b ${theme.lineGradient} transform -translate-x-1/2 rounded-full`} />

                {node.activities
                  .sort((a, b) => (a.orden_secuencial ?? 1) - (b.orden_secuencial ?? 1))
                  .map((activity, actIndex) => {
                    const estado = progress[activity.id_actividad] || 'bloqueada'
                    const isLocked = estado === 'bloqueada'
                    // isLeft determina si el NÚMERO va a la izquierda o derecha
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
                        
                        {/* 1. NÚMERO LATERAL */}
                        <div className={`absolute w-32 ${isLeft ? 'right-1/2 mr-12 sm:mr-24 text-right' : 'left-1/2 ml-12 sm:ml-24 text-left'}`}>
                          <p className={`font-bold text-lg ${isLocked ? 'text-white/20' : estado === 'completada' ? 'text-teal-500' : 'text-emerald-400'}`}>
                            {numero}
                          </p>
                        </div>

                        {/* 2. IMAGEN DECORATIVA AL LADO OPUESTO DEL NÚMERO */}
                        {theme.decorations && theme.decorations[actIndex] && (
                          <div className={`absolute top-1/2 transform -translate-y-1/2 pointer-events-none z-20 
                                          ${isLeft ? 'left-1/2 ml-16 sm:ml-28' : 'right-1/2 mr-16 sm:mr-28'}`}>
                            <img 
                              src={theme.decorations[actIndex]} 
                              alt="Decoración de la ruta" 
                              // Agregamos una ligera animación flotante (animate-pulse o similar) si lo deseas
                              className="w-20 h-20 sm:w-28 sm:h-28 object-contain drop-shadow-xl hover:scale-110 transition-transform" 
                            />
                          </div>
                        )}

                        {/* 3. BOTÓN PRINCIPAL */}
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
          )
        })}
      </div>

      <button 
        onClick={() => scroll('down')}
        className="z-30 p-3 text-emerald-400 bg-gray-900/80 backdrop-blur-md rounded-full transition-all hover:scale-110 active:scale-95 shadow-lg border border-gray-700"
        aria-label="Siguiente sección"
      >
        <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

    </div>
  )
}