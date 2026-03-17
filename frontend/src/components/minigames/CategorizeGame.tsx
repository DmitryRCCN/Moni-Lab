import { CheckCircle2, ArrowRightCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import type { CategorizeConfig } from './types'

type Props = {
  config: CategorizeConfig
  onComplete: (score: number) => void
}

export default function CategorizeGame({ config, onComplete }: Props) {
  const [assignments, setAssignments] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const correctCount = useMemo(() => {
    return config.items.reduce((count, item) => {
      const assigned = assignments[item.nombre]
      if (!assigned) return count
      return count + (assigned === item.correcta ? 1 : 0)
    }, 0)
  }, [assignments, config.items])

  const canSubmit = config.items.every((item) => Boolean(assignments[item.nombre]))

  const handleAssign = (itemName: string, category: string) => {
    setAssignments((prev) => ({ ...prev, [itemName]: category }))
  }

  const handleFinish = () => {
    setSubmitted(true)
    onComplete(correctCount)
  }

  return (
    <div className="space-y-6">
      <p className="text-white/80">Arrastra (o elige) cada elemento en la categoría correcta.</p>

      <div className="grid gap-4 md:grid-cols-2">
        {config.items.map((item) => {
          const assignedCategory = assignments[item.nombre]
          const isCorrect = assignedCategory === item.correcta

          return (
            <div key={item.nombre} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-white">{item.nombre}</div>
                  {assignedCategory ? (
                    <div className="mt-1 text-xs text-white/60">Asignado: {assignedCategory}</div>
                  ) : (
                    <div className="mt-1 text-xs text-white/40">Elige una categoría</div>
                  )}
                </div>
                {assignedCategory && submitted ? (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                      isCorrect ? 'bg-emerald-500/30 text-emerald-200' : 'bg-red-500/30 text-red-200'
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {isCorrect ? 'Correcto' : 'Incorrecto'}
                  </span>
                ) : assignedCategory && !submitted ? (
                  <div className="text-xs text-white/40">Asignado</div>
                ) : null}
              </div>

              <div className="mt-3 grid gap-2">
                {config.categorias.map((cat) => {
                  const selected = cat === assignedCategory
                  return (
                    <motion.button
                      key={cat}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleAssign(item.nombre, cat)}
                      className={`w-full rounded-xl border px-4 py-2 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-emerald-300 ${
                        selected
                          ? 'border-emerald-400 bg-emerald-500/20'
                          : 'border-white/15 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      {cat}
                    </motion.button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-white/70">
         
        </div>
        <button
        
          type="button"
          disabled={!canSubmit || submitted}
          onClick={handleFinish}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white disabled:bg-gray-600"
        >
          {submitted ? 'Finalizado' : 'Finalizar'}
          <ArrowRightCircle className="h-5 w-5" />
        </button>
      </div>

      {submitted ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
          <p className="font-semibold">Juego completado.</p>
          <p className="text-sm text-white/70">Obtuviste {correctCount} / {config.items.length} correctas.</p>
        </div>
      ) : null}
    </div>
  )
}
