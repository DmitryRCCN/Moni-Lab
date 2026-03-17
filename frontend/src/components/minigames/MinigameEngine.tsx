import { AnimatePresence, motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { MinigameConfig, MinigameFeedback } from './types'
import MochilaGame from './MochilaGame'
import DecisionGame from './DecisionGame'
import SavingsGame from './SavingsGame'
import CategorizeGame from './CategorizeGame'
import ShopCalculator from './ShopCalculator'

export type MinigameEngineProps = {
  config: MinigameConfig
  feedback: MinigameFeedback[]
  onFinish: (finalScore: number) => void
}

export default function MinigameEngine({ config, feedback, onFinish }: MinigameEngineProps) {
  const navigate = useNavigate()
  const [finalScore, setFinalScore] = useState<number | null>(null)
  const [buttonEnabled, setButtonEnabled] = useState(false)

  const maxScore = useMemo(() => {
    switch (config.tipo) {
      case 'PICK_N':
        return config.elementos?.filter(e => e.es_correcto).length || 0
      case 'SEQUENTIAL_DECISION':
        return config.pasos?.length || 0
      case 'SAVINGS_PATH':
        return config.pasos?.length || 0
      case 'CATEGORIZE':
        return config.items?.length || 0
      case 'SHOP_CALCULATOR':
        return config.escenarios?.length || 0
      default:
        return 0
    }
  }, [config])

  const finalMessage = useMemo(() => {
    if (finalScore === null) return ''
    const found = feedback.find((item) => item.puntos === finalScore)
    return found?.msg ?? ''
  }, [feedback, finalScore])

  useEffect(() => {
    if (finalScore === null) return
    if (finalScore === maxScore) {
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    }
    onFinish(finalScore)
    // Habilitar el botón después de 3 segundos
    const timer = setTimeout(() => setButtonEnabled(true), 3000)
    return () => clearTimeout(timer)
  }, [finalScore, maxScore, onFinish])

  const handleComplete = (score: number) => {
    setFinalScore(score)
  }

  return (
    <div className="moni-panel p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-3">{config.titulo}</h2>
      {config.descripcion ? <p className="mb-6 text-white/80">{config.descripcion}</p> : null}

      <AnimatePresence mode="wait">
        {finalScore !== null ? (
          <motion.div
            key="final"
            className="rounded-xl bg-white/10 p-6 text-center space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div>
              <p className="text-lg font-semibold mb-4">Resultado: {finalScore} / {maxScore}</p>
              <p className="text-sm text-white/80">{finalMessage}</p>
            </div>
            <div className="border-t border-white/10 pt-6 flex justify-center">
              <button
                onClick={() => navigate('/path')}
                disabled={!buttonEnabled}
                className={`px-8 py-3 rounded-xl text-white font-semibold transition-all ${
                  buttonEnabled
                    ? 'bg-emerald-500 hover:bg-emerald-400 hover:scale-105 cursor-pointer'
                    : 'bg-gray-600 text-white/50 cursor-not-allowed'
                }`}
              >
                {buttonEnabled ? 'Volver a la Ruta de Aprendizaje' : 'Cargando...'}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="game"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {config.tipo === 'PICK_N' ? (
              <MochilaGame config={config} onComplete={handleComplete} />
            ) : config.tipo === 'SEQUENTIAL_DECISION' ? (
              <DecisionGame config={config} onComplete={handleComplete} />
            ) : config.tipo === 'SAVINGS_PATH' ? (
              <SavingsGame config={config} onComplete={handleComplete} />
            ) : config.tipo === 'CATEGORIZE' ? (
              <CategorizeGame config={config} onComplete={handleComplete} />
            ) : config.tipo === 'SHOP_CALCULATOR' ? (
              <ShopCalculator config={config} onComplete={handleComplete} />
            ) : (
              <div>Tipo de minijuego no soportado</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
