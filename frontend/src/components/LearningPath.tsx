import { Link } from 'react-router-dom'
import { useState, useRef } from 'react'

type Activity = {
  id_actividad: string
  tipo_actividad: string
  orden_secuencial?: number
  estado?: 'bloqueada' | 'disponible' | 'completada'
  es_de_salto?: boolean
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

// ÍCONOS REUTILIZABLES
// Aquí está el ícono que me pasaste convertido a componente
const BrainIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
    <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.18a.75.75 0 0 1-.707 0A50.88 50.88 0 0 0 7.5 12.173v-.224c0-.131.067-.248.172-.311a54.615 54.615 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.123 56.123 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" />
    <path d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.284a.75.75 0 0 1-.46.711 47.87 47.87 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.87 47.87 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286.921.304 1.83.634 2.726.99v1.27a1.5 1.5 0 0 0-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.66a6.727 6.727 0 0 0 .551-1.607 1.5 1.5 0 0 0 .14-2.67v-.645a48.549 48.549 0 0 1 3.44 1.667 2.25 2.25 0 0 0 2.12 0Z" />
    <path d="M4.462 19.462c.42-.419.753-.89 1-1.395.453.214.902.435 1.347.662a6.742 6.742 0 0 1-1.286 1.794.75.75 0 0 1-1.06-1.06Z" />
  </svg>
)

const LightningIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
    <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z" clipRule="evenodd" />
  </svg>
)


// 1. DICCIONARIO DE TEMAS ACTUALIZADO CON FONDOS E ÍCONOS
const THEMES: Record<number, { 
  colorTitle: string; 
  lineGradient: string; 
  headerBg: string; // Nuevo fondo para el encabezado
  iconLeft?: JSX.Element; // Ícono izquierdo
  iconRight?: JSX.Element; // Ícono derecho
  decorations?: Record<number, string>;
}> = {
  1: {
    colorTitle: 'text-white',
    lineGradient: 'from-blue-400/20 via-blue-400/50 to-blue-400/20',
    headerBg: 'bg-gradient-to-r from-blue-500 to-blue-400', 
    iconLeft: BrainIcon,
    iconRight: LightningIcon, 
    decorations: {
      0: '/images/monaU1.1.webp', 
      3: '/images/monoCoin.avif',
      6: '/images/monaRead.avif'
    }
  },
  2: {
    colorTitle: 'text-white',
    lineGradient: 'from-yellow-400/20 via-orange-400/50 to-yellow-400/20',
    headerBg: 'bg-gradient-to-r from-yellow-500 to-orange-400', // Gradiente amarillo/naranja
    iconLeft: BrainIcon,
    iconRight: BrainIcon, // Aquí usamos el mismo ícono en ambos lados
    decorations: {
      1: '/images/mono-leyendo.png'
    }
  },
  3: {
    colorTitle: 'text-white',
    lineGradient: 'from-purple-400/20 via-pink-400/50 to-purple-400/20',
    headerBg: 'bg-gradient-to-r from-purple-500 to-pink-500', // Gradiente morado
    iconLeft: LightningIcon, 
    iconRight: LightningIcon,
    decorations: {
      0: '/images/mono-leyendo.png',
      3: '/images/mono-emoji.png'
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

  // Lógica de scroll vertical
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
      
      {/* Botón Arriba */}
      <button 
        onClick={() => scroll('up')}
        className="z-30 p-3 text-emerald-400 bg-gray-900/80 backdrop-blur-md rounded-full transition-all hover:scale-110 active:scale-95 shadow-lg border border-gray-700"
        aria-label="Sección anterior"
      >
        <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
        </svg>
      </button>

      {/* Contenedor del recorrido */}
      <div 
        ref={carouselRef}
        className="flex flex-col w-full h-[70vh] overflow-y-auto snap-y snap-mandatory py-4 gap-24
                   [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {sortedNodes.map((node) => {
          const theme = THEMES[node.orden_secuencial] || {
            colorTitle: 'text-white',
            lineGradient: 'from-emerald-400/20 via-teal-400/50 to-emerald-400/20',
            headerBg: 'bg-emerald-500' // Fondo por defecto
          }

          return (
            <div 
              key={node.id_nodo} 
              className="w-full flex-shrink-0 snap-start flex flex-col items-center relative px-4 sm:px-14 md:px-24 pb-12"
            >
              {/* NUEVO CONTENEDOR TIPO BANNER (CON ÍCONOS) */}
              <div className={`w-full max-w-2xl rounded-2xl shadow-lg mb-12 flex items-center justify-center min-h-[100px] sm:min-h-[120px] border-4 border-gray-800 ${theme.headerBg}`}>
                <div className="flex items-center gap-3 sm:gap-6 px-6 py-4">
                  
                  {/* Ícono Izquierdo Dinámico */}
                  {theme.iconLeft && (
                    <div className="text-white w-8 h-8 sm:w-12 sm:h-12 flex-shrink-0 drop-shadow-md">
                      {theme.iconLeft}
                    </div>
                  )}

                  {/* Título */}
                  <h3 className={`text-2xl sm:text-3xl font-black ${theme.colorTitle} text-center tracking-wide uppercase drop-shadow-[0_4px_4px_rgba(0,0,0,0.3)]`}>
                    Unidad {node.orden_secuencial}: {node.titulo}
                  </h3>

                  {/* Ícono Derecho Dinámico */}
                  {theme.iconRight && (
                    <div className="text-white w-8 h-8 sm:w-12 sm:h-12 flex-shrink-0 drop-shadow-md">
                      {theme.iconRight}
                    </div>
                  )}

                </div>
              </div>

              {/* Contenedor de las actividades y línea */}
              <div className="relative flex flex-col items-center gap-16 w-full max-w-md">
                <div className={`absolute left-1/2 top-0 bottom-0 w-2 bg-gradient-to-b ${theme.lineGradient} transform -translate-x-1/2 rounded-full`} />

                {node.activities
                  .sort((a, b) => (a.orden_secuencial ?? 1) - (b.orden_secuencial ?? 1))
                  .map((activity, actIndex) => {
                    const estado = progress[activity.id_actividad] || 'bloqueada'
                    const isEsDeSalto = activity.es_de_salto ?? false
                    
                    // Lógica de desbloqueo para exámenes de salto: SIEMPRE desbloqueados
                    let isLocked = false
                    if (isEsDeSalto) {
                      isLocked = false // Los exámenes de salto siempre están disponibles
                    } else {
                      isLocked = estado === 'bloqueada'
                    }
                    
                    // Determinar si todos los ejercicios previos están completados (para cambiar etiqueta)
                    const allPreviousCompleted = node.activities
                      .filter((a) => (a.orden_secuencial ?? 0) < (activity.orden_secuencial ?? 0))
                      .every((a) => progress[a.id_actividad] === 'completada')
                    
                    // Para exámenes de salto, mostrar "Examen Final" si todas las previas están completadas
                    const isExamenFinal = isEsDeSalto && allPreviousCompleted
                    
                    // isLeft determina si el NÚMERO va a la izquierda o derecha
                    const isLeft = actIndex % 2 === 0

                    let colorClass = 'bg-gradient-to-br from-emerald-400 to-teal-500 border-emerald-300'
                    if (estado === 'bloqueada' && !isEsDeSalto) colorClass = 'bg-gray-700 border-gray-600 text-white/30 shadow-none'
                    if (estado === 'disponible' && !isEsDeSalto) colorClass = 'bg-emerald-500 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                    if (estado === 'completada') colorClass = 'bg-teal-700 border-teal-500 text-white/80'
                    
                    // Colores especiales para exámenes de salto
                    if (isEsDeSalto && !isExamenFinal) colorClass = 'bg-yellow-500 border-yellow-400 text-white shadow-[0_0_15px_rgba(234,179,8,0.5)]'
                    if (isEsDeSalto && isExamenFinal) colorClass = 'bg-purple-600 border-purple-400 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]'

                    const numero = `${node.orden_secuencial}.${activity.orden_secuencial ?? 1}`
                    
                    // Determinar el ícono según el tipo de actividad y si es examen de salto
                    let icon = activity.tipo_actividad === 'lectura' ? '📖' : '✏️'
                    if (isEsDeSalto && !isExamenFinal) icon = '⚡'
                    if (isEsDeSalto && isExamenFinal) icon = '🏆'

                    const ButtonContent = (
                      <div
                        className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg transition-all duration-300 border-4 ${colorClass} ${
                          !isLocked && pulsing[activity.id_actividad]
                            ? 'scale-125 ring-4 ring-emerald-300/40'
                            : !isLocked ? 'hover:scale-110' : ''
                        }`}
                      >
                        {icon}
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

                        {/* Imágenes decorativas */}
                        {theme.decorations && theme.decorations[actIndex] && (
                          <div className={`absolute top-1/2 transform -translate-y-1/2 pointer-events-none z-20 
                                          ${isLeft ? 'left-1/2 ml-16 sm:ml-28' : 'right-1/2 mr-16 sm:mr-28'}`}>
                            <img 
                              src={theme.decorations[actIndex]} 
                              alt="Decoración" 
                              className="w-28 h-28 sm:w-40 sm:h-40 object-contain drop-shadow-xl hover:scale-110 transition-transform" 
                            />
                          </div>
                        )}

                        {/* Botón de la actividad */}
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

      {/* Botón Abajo */}
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