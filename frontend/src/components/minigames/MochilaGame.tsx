import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import type { PickNConfig } from './types'

type Props = {
  config: PickNConfig
  onComplete: (score: number) => void
}

export default function MochilaGame({ config, onComplete }: Props) {
  const [selected, setSelected] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState<number | null>(null)

  const canSubmit = selected.length === config.cantidad_requerida

  const correctCount = useMemo(() => {
    return selected.filter((id) => {
      const element = config.elementos.find(e => e.id === id)
      return element?.es_correcto
    }).length
  }, [selected, config.elementos])

  const toggle = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id)
      if (prev.length >= config.cantidad_requerida) return prev
      return [...prev, id]
    })
  }

  const handleSubmit = () => {
    setSubmitted(true)
    setScore(correctCount)
    onComplete(correctCount)
  }

  return (
    <div className="space-y-6">
      <p className="text-white/80">Selecciona {config.cantidad_requerida} objetos para llevar en tu mochila.</p>

      <div className="grid gap-3 sm:grid-cols-2">
        {config.elementos.map((element) => {
          const isSelected = selected.includes(element.id)
          const isCorrect = element.es_correcto

          return (
            <motion.button
              key={element.id}
              type="button"
              onClick={() => toggle(element.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              className={`relative rounded-xl border p-4 text-left transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 ${
                isSelected
                  ? 'border-emerald-400 bg-emerald-500/20'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-white">{element.nombre}</div>
                  {element.img && <div className="text-xs text-white/60">{element.img}</div>}
                </div>
                {isSelected ? (
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/70 text-sm font-bold text-white">
                    ✓
                  </span>
                ) : null}
              </div>
              {submitted && isSelected ? (
                <div
                  className={`mt-3 rounded-full px-3 py-1 text-xs font-semibold ${
                    isCorrect ? 'bg-emerald-500/30 text-emerald-200' : 'bg-red-500/30 text-red-200'
                  }`}
                >
                  {isCorrect ? '¡Bien!' : 'No era necesario'}
                </div>
              ) : null}
            </motion.button>
          )
        })}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-white/70">Seleccionados: {selected.length} / {config.cantidad_requerida}</p>
        <button
          type="button"
          disabled={!canSubmit || submitted}
          onClick={handleSubmit}
          className="w-full sm:w-auto rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white disabled:bg-gray-600"
        >
          {submitted ? 'Finalizado' : 'Confirmar selección'}
        </button>
      </div>

      {submitted && score !== null ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
          <p className="font-semibold">
            Obtuviste {score} / {config.elementos.filter(e => e.es_correcto).length}
          </p>
          {score === config.elementos.filter(e => e.es_correcto).length ? (
            <p className="text-sm text-emerald-200">¡Excelente explorador! Elegiste todo lo necesario 😊</p>
          ) : (
            <p className="text-sm text-white/70">Revisa tus elecciones, puedes intentarlo de nuevo.</p>
          )}
        </div>
      ) : null}
    </div>
  )
}
