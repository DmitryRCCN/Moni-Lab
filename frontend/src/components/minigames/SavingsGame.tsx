import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import type { SavingsPathConfig } from './types'

type Props = {
  config: SavingsPathConfig
  onComplete: (score: number) => void
}

export default function SavingsGame({ config, onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [currentSavings, setCurrentSavings] = useState(config.inicial)
  const [submitted, setSubmitted] = useState(false)

  const currentStep = config.pasos[currentIndex]

  const isCorrect = useMemo(() => {
    if (!selectedOptionId) return false
    const selectedOption = currentStep.opciones.find(opt => opt.txt === selectedOptionId)
    return selectedOption?.es_correcto ?? false
  }, [currentStep, selectedOptionId])

  const handleNext = () => {
    if (!selectedOptionId) return

    const selectedOption = currentStep.opciones.find(opt => opt.txt === selectedOptionId)
    if (!selectedOption) return

    const wasCorrect = selectedOption.es_correcto
    setCorrectCount((c) => c + (wasCorrect ? 1 : 0))
    setCurrentSavings((prev) => prev + selectedOption.valor)

    if (currentIndex + 1 >= config.pasos.length) {
      setSubmitted(true)
      onComplete(wasCorrect ? correctCount + 1 : correctCount)
      return
    }

    setCurrentIndex(currentIndex + 1)
    setSelectedOptionId(null)
  }

  const progressPercentage = (currentSavings / config.meta) * 100
  const hasReachedGoal = currentSavings >= config.meta

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-white/70">
          Día {currentIndex + 1} de {config.pasos.length}
        </div>
        <div className="text-sm font-semibold text-white/90">
          Ahorro actual: ${currentSavings}
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-white/70">
          <span>Meta: ${config.meta}</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="h-3 rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progressPercentage, 100)}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/50">
          {currentStep.dia}
        </div>
        <p className="text-lg font-semibold text-white">{currentStep.pregunta}</p>
      </div>

      <div className="grid gap-3">
        {currentStep.opciones.map((option) => {
          const selected = option.txt === selectedOptionId
          return (
            <motion.button
              key={option.txt}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedOptionId(option.txt)}
              className={`w-full rounded-xl border p-4 text-left transition-all focus:outline-none focus:ring-2 focus:ring-emerald-300 ${
                selected ? 'border-emerald-400 bg-emerald-500/20' : 'border-white/15 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">{option.txt}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${option.valor >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {option.valor >= 0 ? '+' : ''}${option.valor}
                  </span>
                  {selected ? (
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/70 text-sm font-bold text-white">
                      ✓
                    </span>
                  ) : null}
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          disabled={!selectedOptionId || submitted}
          onClick={handleNext}
          className="rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white disabled:bg-gray-600"
        >
          {submitted ? 'Completado' : currentIndex + 1 === config.pasos.length ? 'Finalizar' : 'Siguiente'}
        </button>
      </div>

      {submitted ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
          <p className="font-semibold">
            {hasReachedGoal ? '¡Felicitaciones! Alcanzaste tu meta de ahorro.' : 'Juego completado.'}
          </p>
          <p className="text-sm text-white/70">
            Ahorro final: ${currentSavings} / ${config.meta}
          </p>
          <p className="text-sm text-white/70">
            Decisiones correctas: {correctCount} / {config.pasos.length}
          </p>
        </div>
      ) : null}
    </div>
  )
}