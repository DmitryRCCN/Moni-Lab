import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import type { ShopCalculatorConfig } from './types'

type Props = {
  config: ShopCalculatorConfig
  onComplete: (score: number) => void
}

export default function ShopCalculator({ config, onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState<string>('')
  const [correctCount, setCorrectCount] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null)

  const currentScenario = config.escenarios[currentIndex]

  const handleAnswer = () => {
    if (!userAnswer.trim()) return

    const answer = userAnswer.trim()
    let isCorrect = false
    let message = ''

    if (currentScenario.insuficiente) {
      // El cliente no tiene dinero suficiente
      if (answer.toLowerCase() === 'insuficiente' || answer.toLowerCase() === 'no') {
        isCorrect = true
        message = `¡Correcto! El dinero no alcanza. Se necesitaba $${currentScenario.precio} pero solo pagó $${currentScenario.paga_con}.`
      } else {
        isCorrect = false
        message = `Incorrecto. ${currentScenario.cliente} no tiene dinero suficiente. Se necesitaba $${currentScenario.precio} pero solo pagó $${currentScenario.paga_con}.`
      }
    } else {
      // Calcular el cambio esperado
      const expectedChange = currentScenario.paga_con - currentScenario.precio
      const userAnswerNum = parseFloat(answer)

      if (!isNaN(userAnswerNum) && userAnswerNum === expectedChange) {
        isCorrect = true
        message = `¡Correcto! El cambio es $${expectedChange}.`
      } else {
        isCorrect = false
        message = `Incorrecto. El cambio correcto es $${expectedChange}.`
      }
    }

    setFeedback({ correct: isCorrect, message })

    if (isCorrect) {
      setCorrectCount((c) => c + 1)
    }

    // Pasar al siguiente escenario después de 2 segundos
    setTimeout(() => {
      if (currentIndex + 1 >= config.escenarios.length) {
        setSubmitted(true)
        onComplete(isCorrect ? correctCount + 1 : correctCount)
      } else {
        setCurrentIndex(currentIndex + 1)
        setUserAnswer('')
        setFeedback(null)
      }
    }, 5000)
  }

  if (submitted) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
          <p className="font-semibold text-lg mb-2">¡Tienda Cerrada!</p>
          <p className="text-sm text-white/70 mb-4">
            Transacciones correctas: {correctCount} / {config.escenarios.length}
          </p>
          {correctCount === config.escenarios.length ? (
            <p className="text-sm text-emerald-200">¡Excelente comerciante! Manejaste toda la tienda perfectamente.</p>
          ) : (
            <p className="text-sm text-white/70">Sigue practicando para mejorar tu manejo del dinero.</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-white/70">
          Cliente {currentIndex + 1} de {config.escenarios.length}
        </div>
        <div className="text-sm font-semibold text-white/90">
          Aciertos: {correctCount}
        </div>
      </div>

      <div className="moni-panel p-6 space-y-4">
        <div className="border-b border-white/20 pb-4">
          <div className="text-lg font-bold text-emerald-400 mb-2">{currentScenario.cliente}</div>
          <p className="text-white/90">Producto: <span className="font-semibold">{currentScenario.articulo}</span></p>
          <p className="text-white/90">Precio: <span className="font-semibold">${currentScenario.precio}</span></p>
          <p className="text-white/90">Paga con: <span className="font-semibold">${currentScenario.paga_con}</span></p>
        </div>

        <div className="rounded-lg bg-white/10 p-4">
          <p className="text-white font-semibold mb-4">{currentScenario.pregunta}</p>

          {currentScenario.insuficiente ? (
            <div className="space-y-3">
              <button
                onClick={() => setUserAnswer('Insuficiente')}
                className={`w-full p-3 rounded-lg border transition-all ${ userAnswer === 'Insuficiente'
                    ? 'border-emerald-400 bg-emerald-500/20'
                    : 'border-white/15 bg-white/5 hover:bg-white/10'
                }`}
              >
                No alcanza el dinero
              </button>
              <button
                onClick={() => setUserAnswer('Vender')}
                className={`w-full p-3 rounded-lg border transition-all ${
                  userAnswer === 'Vender'
                    ? 'border-emerald-400 bg-emerald-500/20'
                    : 'border-white/15 bg-white/5 hover:bg-white/10'
                }`}
              >
                Vender de todas formas
              </button>
            </div>
          ) : (
            <input
              type="number"
              placeholder="Ingresa el cambio en $"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          )}
        </div>

        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-lg p-4 text-center ${ feedback.correct
              ? 'bg-emerald-500/20 border border-emerald-400 text-emerald-200'
              : 'bg-red-500/20 border border-red-400 text-red-200'
            }`}
          >
            <p className="font-semibold">{feedback.correct ? '✓ Correcto' : '✗ Incorrecto'}</p>
            <p className="text-sm mt-1">{feedback.message}</p>
          </motion.div>
        )}

        <div className="flex justify-end pt-4">
          <button
            onClick={handleAnswer}
            disabled={!userAnswer.trim() || !!feedback}
            className="px-6 py-3 rounded-lg bg-emerald-500 text-white font-semibold disabled:bg-gray-600 transition-all hover:bg-emerald-400"
          >
            Procesar Compra
          </button>
        </div>
      </div>
    </div>
  )
}
