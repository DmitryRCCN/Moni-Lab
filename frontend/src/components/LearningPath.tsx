
import { Link } from 'react-router-dom'
import { useState } from 'react'

type Step = {
  id: number
  title: string
  locked?: boolean
}

const steps: Step[] = [
  { id: 1, title: 'Inicio' },
  { id: 2, title: 'Conceptos' },
  { id: 3, title: 'Ahorro' },
  { id: 4, title: 'Gastar' },
  { id: 5, title: 'Invertir', locked: true },
]

export default function LearningPath() {
  const [pulsing, setPulsing] = useState<Record<number, boolean>>({})

  function triggerPulse(id: number) {
    setPulsing(prev => ({ ...prev, [id]: true }))
    setTimeout(() => setPulsing(prev => ({ ...prev, [id]: false })), 300)
  }

  return (
    <div className="flex flex-col items-center w-full">
      {/* Vertical path with center line */}
      <div className="relative w-full max-w-3xl">
        {/* Central vertical line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1.5 bg-gradient-to-b from-emerald-400 via-teal-400 to-emerald-400 transform -translate-x-1/2" />

        {/* Steps container */}
        <div className="space-y-16 py-8">
          {steps.map((s, idx) => {
            const isLeft = idx % 2 === 0
            const isLocked = s.locked

            return (
              <div key={s.id} className="relative h-32 flex items-center">
                {/* Horizontal connector line */}
                <div
                  className={`absolute top-1/2 h-0.5 w-20 bg-gradient-to-r from-emerald-300 to-transparent transform -translate-y-1/2 ${
                    isLeft ? 'right-1/2 mr-8' : 'left-1/2 ml-8'
                  }`}
                />

                {/* Label - repositioned */}
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
                    {s.title}
                  </p>
                </div>

                {/* Central node */}
                <Link
                  to={isLocked ? '#' : `/lesson/${s.id}`}
                  className={`absolute left-1/2 transform -translate-x-1/2 flex-shrink-0 ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  onClick={() => !isLocked && triggerPulse(s.id)}

                >
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg transition-all duration-300 border-2 ${
                      isLocked
                        ? 'bg-gray-600 border-gray-500 text-white/70'
                        : `bg-gradient-to-br from-emerald-400 to-teal-500 border-emerald-300 ${pulsing[s.id] ? 'scale-125 ring-4 ring-emerald-300/40' : 'hover:scale-110 hover:shadow-emerald-500/50 hover:shadow-2xl'}`
                    }`}
                  >
                    {isLocked ? '🔒' : '✓'}
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom note */}
      <p className="mt-8 text-center text-white/70 text-sm max-w-md">
        ✨ Completa lecciones para desbloquear nuevos contenidos y ganar recompensas
      </p>
    </div>
  )
}