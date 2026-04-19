import { Link } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import type { JSX } from 'react';

type Activity = {
  id_actividad: string
  tipo_actividad: string
  orden_secuencial?: number
  estado?: 'bloqueada' | 'disponible' | 'completada' | 'saltada'
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
  progress?: Record<string, 'bloqueada' | 'disponible' | 'completada' | 'saltada'>
  activeNodeId?: string | null
  activeActivityId?: string | null
}

// --- ÍCONOS REUTILIZABLES ---
const BrainIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
    <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.18a.75.75 0 0 1-.707 0A50.88 50.88 0 0 0 7.5 12.173v-.224c0-.131.067-.248.172-.311a54.615 54.615 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.123 56.123 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" />
    <path d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.284a.75.75 0 0 1-.46.711 47.87 47.87 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.87 47.87 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286.921.304 1.83.634 2.726.99v1.27a1.5 1.5 0 0 0-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.66a6.727 6.727 0 0 0 .551-1.607 1.5 1.5 0 0 0 .14-2.67v-.645a48.549 48.549 0 0 1 3.44 1.667 2.25 2.25 0 0 0 2.12 0Z" />
  </svg>
)

const LightningIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
    <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z" clipRule="evenodd" />
  </svg>
)

// ÍCONO DE LÁPIZ (Para actividades)
const PencilIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 drop-shadow-sm">
    <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.158 3.71 3.71 1.159-1.158a2.625 2.625 0 0 0 0-3.71Zm-2.904 7.624L5.113 23.606a.75.75 0 0 1-.363.19l-4.103 1.026a.75.75 0 0 1-.904-.904l1.026-4.103a.75.75 0 0 1 .19-.363L14.674 5.74l4.153 4.153Z" />
  </svg>
)

// ÍCONO DE LIBRO (Para lecturas)
const BookIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 drop-shadow-sm">
    <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c1.68 0 3.282.515 4.75 1.407A.75.75 0 0 0 24 19.462V5.212a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
  </svg>
)

// ÍCONO DE TROFEO (Para examen final)
const TrophyIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
    <path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 0 0-.584.859 6.753 6.753 0 0 0 6.138 5.6 6.73 6.73 0 0 0 2.743 1.346A6.707 6.707 0 0 1 9.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 0 0-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 0 1-1.112-3.173 6.73 6.73 0 0 0 2.743-1.347 6.753 6.753 0 0 0 6.139-5.6.75.75 0 0 0-.585-.858 47.077 47.077 0 0 0-3.07-.543V2.62a.75.75 0 0 0-.658-.744 49.22 49.22 0 0 0-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 0 0-.657.744Zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 0 1 3.16 5.337a45.6 45.6 0 0 1 2.006-.343v.256Zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 0 1-2.863 3.207 6.72 6.72 0 0 0 .857-3.294Z" clipRule="evenodd" />
  </svg>
);

// 1. DICCIONARIO DE TEMAS ACTUALIZADO CON FONDOS E ÍCONOS
const THEMES: Record<number, { 
  colorTitle: string; 
  lineGradient: string; 
  headerBg: string; 
  iconLeft?: JSX.Element; 
  iconRight?: JSX.Element; 
  decorations?: Record<number, string>;  
}> = {
  1: {
    colorTitle: 'text-white',
    lineGradient: 'from-blue-400/20 via-blue-400/50 to-blue-400/20',
    headerBg: 'bg-gradient-to-r from-blue-500 to-blue-400', 
    iconLeft: BrainIcon,
    iconRight: LightningIcon, 
    decorations: { 0: '/images/monaU1.1.webp', 3: '/images/monoDuda.webp', 6: '/images/monaRead.avif' }
  },
  2: {
    colorTitle: 'text-white',
    lineGradient: 'from-yellow-400/20 via-orange-400/50 to-yellow-400/20',
    headerBg: 'bg-gradient-to-r from-yellow-500 to-orange-400', 
    iconLeft: BrainIcon,
    iconRight: BrainIcon, 
    decorations: { 1: '/images/trueque.webp', 4: '/images/mercadoTrueque.webp', 7: '/images/monoIntercambio.webp' }
  },
  3: {
    colorTitle: 'text-white',
    lineGradient: 'from-purple-400/20 via-pink-400/50 to-purple-400/20',
    headerBg: 'bg-gradient-to-r from-purple-500 to-pink-500', 
    iconLeft: LightningIcon, 
    iconRight: LightningIcon,
    decorations: { 0: '/images/monoBillete.webp', 3: '/images/monaMoneda.webp', 6: '/images/monosMonedas.webp' }
  },
  4: {
    colorTitle: 'text-white',
    lineGradient: 'from-yellow-400/20 via-orange-400/50 to-yellow-400/20',
    headerBg: 'bg-gradient-to-r from-yellow-500 to-orange-400', 
    iconLeft: BrainIcon,
    iconRight: BrainIcon, 
    decorations: { 1: '/images/alcancia.webp', 4: '/images/stoncks.webp', 7: '/images/monoAlcancia.webp' }
  },
  5: {
    colorTitle: 'text-white',
    lineGradient: 'from-purple-400/20 via-pink-400/50 to-purple-400/20',
    headerBg: 'bg-gradient-to-r from-purple-500 to-pink-500', 
    iconLeft: LightningIcon, 
    iconRight: LightningIcon,
    decorations: { 0: '/images/mono-leyendo.png', 3: '/images/mono-emoji.png' }
  }
}

export default function LearningPath({ nodes = [], progress = {} }: Props) {
  const [pulsing, setPulsing] = useState<Record<string, boolean>>({})
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null)
  const hasAutoScrolled = useRef(false);

  // --- AUTO-SCROLL ---
  useEffect(() => {
    // Si no hay nodos, o ya hicimos scroll, evitamos correr esto
    if (nodes.length === 0 || Object.keys(progress).length === 0 || hasAutoScrolled.current) return;

    let firstAvailableActId: string | null = null;
    const sortedNodes = [...nodes].sort((a, b) => a.orden_secuencial - b.orden_secuencial);

    // Buscar la primera actividad con estado 'disponible'
    for (const node of sortedNodes) {
      const activities = [...node.activities].sort((a, b) => (a.orden_secuencial ?? 1) - (b.orden_secuencial ?? 1));
      const availableAct = activities.find(a => progress[a.id_actividad] === 'disponible');
      if (availableAct) {
        firstAvailableActId = availableAct.id_actividad;
        break;
      }
    }

    // Si la encontramos, hacemos el scroll centrado a ella
    if (firstAvailableActId && carouselRef.current) {
      const timer = setTimeout(() => {
        const targetAct = carouselRef.current?.querySelector(`[data-activity-id="${firstAvailableActId}"]`) as HTMLElement;
        if (targetAct) {
          targetAct.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setHighlightId(firstAvailableActId);
          setTimeout(() => setHighlightId(null), 2000);
          hasAutoScrolled.current = true; // Marcar como scrolleado
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [nodes, progress]); // Solo depende de las propiedades de progreso/nodos

  const triggerPulse = (id: string) => {
    setPulsing(prev => ({ ...prev, [id]: true }))
    setTimeout(() => setPulsing(prev => ({ ...prev, [id]: false })), 300)
  }

  // --- CORRECCIÓN DE SCROLL MANUAL ---
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
      if (diff < minDiff + 10) { 
        minDiff = diff; 
        currentIndex = index; 
      }
    });

    const nextIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    
    if (nextIndex >= 0 && nextIndex < slides.length) {
      const targetSlide = slides[nextIndex];
      container.scrollTo({
        top: targetSlide.offsetTop, 
        behavior: 'smooth'
      });
    }
  }

  if (!nodes.length) return <div className="text-white text-center py-10">No hay contenido disponible</div>

  const sortedNodes = [...nodes].sort((a, b) => a.orden_secuencial - b.orden_secuencial)
  return (
    <div className="w-full overflow-x-hidden flex flex-col items-center justify-center py-4 gap-4">      
      {/* Botón Arriba */}
      <button onClick={() => scroll('up')} className="z-30 p-3 text-emerald-400 bg-gray-900/80 backdrop-blur-md rounded-full transition-all hover:scale-110 active:scale-95 shadow-lg border border-gray-700">
        <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
        </svg>
      </button>

      {/* Contenedor del recorrido - SE AGREGÓ 'relative' PARA CÁLCULOS EXACTOS */}
      <div ref={carouselRef} className="relative flex flex-col w-full h-[70vh] overflow-y-auto overflow-x-hidden py-10 gap-24 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {sortedNodes.map((node) => {
          const theme = THEMES[node.orden_secuencial] || { colorTitle: 'text-white', lineGradient: 'from-emerald-400/20 via-teal-400/50 to-emerald-400/20', headerBg: 'bg-emerald-500' }

          return (
            <div key={node.id_nodo} className="w-full flex-shrink-0 snap-start flex flex-col items-center relative px-4 sm:px-14 md:px-24 pb-12">
              
              {/* BANNER DE UNIDAD */}
              <div className={`w-full max-w-2xl rounded-2xl shadow-lg mb-12 flex items-center justify-center min-h-[100px] border-4 transition-all duration-700 ${theme.headerBg} border-gray-800`}>
                <div className="flex items-center gap-3 sm:gap-6 px-6 py-4">
                  {theme.iconLeft && <div className="text-white w-8 h-8 sm:w-12 sm:h-12 flex-shrink-0 drop-shadow-md">{theme.iconLeft}</div>}
                  <h3 className={`text-2xl sm:text-3xl font-black ${theme.colorTitle} text-center uppercase drop-shadow-md`}>
                    Unidad {node.orden_secuencial}: {node.titulo}
                  </h3>
                  {theme.iconRight && <div className="text-white w-8 h-8 sm:w-12 sm:h-12 flex-shrink-0 drop-shadow-md">{theme.iconRight}</div>}
                </div>
              </div>

              {/* LISTA DE ACTIVIDADES */}
              <div className="relative flex flex-col items-center gap-16 w-full max-w-md">
                <div className={`absolute left-1/2 top-0 bottom-0 w-2 bg-gradient-to-b ${theme.lineGradient} transform -translate-x-1/2 rounded-full`} />

                {node.activities
                  .sort((a, b) => (a.orden_secuencial ?? 1) - (b.orden_secuencial ?? 1))
                  .map((activity, actIndex) => {
                    const isHighlighted = highlightId === activity.id_actividad;
                    const estado = progress[activity.id_actividad] || 'bloqueada';
                    const isEsDeSalto = activity.es_de_salto ?? false;
                    
                    const isLocked = estado === 'bloqueada';
                    
                    const allPreviousCompleted = node.activities
                      .filter((a) => (a.orden_secuencial ?? 0) < (activity.orden_secuencial ?? 0))
                      .every((a) => progress[a.id_actividad] === 'completada' || progress[a.id_actividad] === 'saltada');
                    
                    const isExamenFinal = isEsDeSalto && allPreviousCompleted;
                    const isLeft = actIndex % 2 === 0;

                    let colorClass = 'bg-gradient-to-br from-emerald-400 to-teal-500 border-emerald-300';
                    
                    if (isLocked) {
                      colorClass = 'bg-gray-700 border-gray-600 text-white/30 shadow-none opacity-60';
                    } else {
                      if (estado === 'disponible') colorClass = 'bg-emerald-500 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]';
                      if (estado === 'completada' || estado === 'saltada') colorClass = 'bg-teal-700 border-teal-500 text-white/80';
                      
                      if (isEsDeSalto && !isExamenFinal) colorClass = 'bg-yellow-500 border-yellow-400 text-white shadow-[0_0_15px_rgba(234,179,8,0.5)]';
                      if (isEsDeSalto && isExamenFinal) colorClass = 'bg-purple-600 border-purple-400 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]';
                    }

                    const numero = `${node.orden_secuencial}.${activity.orden_secuencial ?? 1}`;
                    
                    let icon = activity.tipo_actividad === 'lectura' ? BookIcon : PencilIcon
                    if (isEsDeSalto) {
                      icon = (
                        <div className="w-8 h-8 flex items-center justify-center drop-shadow-sm">
                          {isExamenFinal ? TrophyIcon : LightningIcon}
                        </div>
                      );
                    }

                    const ButtonContent = (
                      <div
                        data-activity-id={activity.id_actividad}
                        className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg transition-all duration-500 border-4 
                          ${colorClass} 
                          ${isHighlighted ? 'scale-125 ring-[12px] ring-emerald-400/30' : ''}
                          ${!isLocked ? 'hover:scale-110 active:scale-95' : 'cursor-not-allowed'}`}
                      >
                        {icon}
                      </div>
                    )

                    return (
                      <div key={activity.id_actividad} className="relative flex items-center justify-center w-full">
                        {/* Número lateral */}
                        <div className={`absolute w-32 ${isLeft ? 'right-1/2 mr-12 sm:mr-24 text-right' : 'left-1/2 ml-12 sm:ml-24 text-left'}`}>
                          <p className={`font-bold text-lg ${isLocked ? 'text-white/20' : (estado === 'completada' || estado === 'saltada') ? 'text-teal-500' : 'text-emerald-400'}`}>
                            {numero}
                          </p>
                        </div>

                        {/* Decoración */}
                        {theme.decorations && theme.decorations[actIndex] && (
                          <div className={`absolute top-1/2 transform -translate-y-1/2 pointer-events-none z-20 
                                          ${isLeft ? 'left-1/2 ml-16 sm:ml-28' : 'right-1/2 mr-16 sm:mr-28'}`}>
                            <div className="relative w-[184px] h-[86px] sm:w-[200px] sm:h-[200px] flex items-center justify-center">
                              <img 
                                src={theme.decorations[actIndex]} 
                                alt="Decor" 
                                className="absolute w-full h-full object-contain drop-shadow-xl rounded-xl" 
                              />
                            </div>
                          </div>
                        )}

                        {/* Botón */}
                        {isLocked ? (
                          <div className="opacity-60">{ButtonContent}</div>
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
      <button onClick={() => scroll('down')} className="z-30 p-3 text-emerald-400 bg-gray-900/80 backdrop-blur-md rounded-full transition-all hover:scale-110 active:scale-95 shadow-lg border border-gray-700">
        <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

    </div>
  )
}