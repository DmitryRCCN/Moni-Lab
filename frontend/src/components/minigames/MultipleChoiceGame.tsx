import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import type { MultipleChoiceConfig } from './types'

type Props = {
  config: MultipleChoiceConfig
  onComplete: (score: number) => void
}

export default function MultipleChoiceGame({ config, onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  const currentStep = config.pasos[currentIndex]

  const isCorrect = useMemo(() => {
    if (!selectedAnswer) return false
    const selected = currentStep.opciones.find(o => o.id === selectedAnswer)
    return selected?.es_correcto ?? false
  }, [currentStep, selectedAnswer])

  const handleNext = () => {
    if (!selectedAnswer) return
    const wasCorrect = isCorrect
    setCorrectCount((c) => c + (wasCorrect ? 1 : 0))

    if (currentIndex + 1 >= config.pasos.length) {
      setSubmitted(true)
      onComplete(wasCorrect ? correctCount + 1 : correctCount)
      return
    }

    setCurrentIndex(currentIndex + 1)
    setSelectedAnswer(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-white/70">
          Paso {currentIndex + 1} de {config.pasos.length}
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-5">
        {currentStep.contexto ? (
          <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/50">{currentStep.contexto}</div>
        ) : null}
        <p className="text-lg font-semibold text-white">{currentStep.pregunta}</p>
      </div>

      <div className="space-y-3">
        {currentStep.opciones.map((option) => {
          const selected = option.id === selectedAnswer
          return (
            <motion.button
              key={option.id}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedAnswer(option.id)}
              className={`w-full rounded-xl border p-4 text-left transition-all focus:outline-none focus:ring-2 focus:ring-emerald-300 ${
                selected ? 'border-emerald-400 bg-emerald-500/20' : 'border-white/15 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">{option.texto}</span>
                {selected && (
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/70 text-sm font-bold text-white">
                    ✓
                  </span>
                )}
              </div>
            </motion.button>
          )
        })}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          disabled={!selectedAnswer || submitted}
          onClick={handleNext}
          className="rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white disabled:bg-gray-600"
        >
          {submitted ? 'Completado' : currentIndex + 1 === config.pasos.length ? 'Finalizar' : 'Siguiente'}
        </button>
      </div>

      {submitted ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
          <p className="font-semibold">Has completado el juego.</p>
          <p className="text-sm text-white/70">Respuestas correctas: {correctCount} / {config.pasos.length}</p>
        </div>
      ) : null}
    </div>
  )
}
