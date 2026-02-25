import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../context/AuthContext'

type Pregunta = {
  id_pregunta: string
  enunciado: string
  tipo_pregunta: string
  nivel_dificultad: number
  respuesta_correcta: string
  opciones: string
  topico: string
  puntos: number
}

export default function Exercise({ ejercicio, activityId }: { ejercicio: any; activityId: string }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [preguntas, setPreguntas] = useState<Pregunta[]>([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Array<{ id: string; selected: string; correct: boolean; puntos: number }>>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [awardedCoins, setAwardedCoins] = useState<number>(0)

  // --- ESTADO PARA EL CIERRE ---
  const [secondsLeft, setSecondsLeft] = useState(5)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const res: any = await api(`/ejercicio/${activityId}/preguntas`)
        if (!mounted) return
        setPreguntas(res.preguntas || [])
      } catch (err: any) {
        if (mounted) setError(err.message || 'Error')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    if (activityId) load()
    return () => { mounted = false }
  }, [activityId])

  // --- LÓGICA DEL TEMPORIZADOR AL FINALIZAR ---
  useEffect(() => {
    if (current >= preguntas.length && preguntas.length > 0 && secondsLeft > 0) {
      const timer = setInterval(() => {
        setSecondsLeft((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [current, preguntas.length, secondsLeft])

  function parseOptions(opcionesField: string) {
    try {
      const parsed = JSON.parse(opcionesField)
      if (Array.isArray(parsed)) return parsed as string[]
    } catch (_) {
      return opcionesField.split('|').map(s => s.trim())
    }
    return []
  }

  async function confirmAnswer() {
    if (selected === null) return
    const q = preguntas[current]
    const correct = selected === q.respuesta_correcta
    const currentAnswer = { id: q.id_pregunta, selected, correct, puntos: q.puntos }
    const newAnswers = [...answers, currentAnswer]
    setSelected(null)

    if (current + 1 < preguntas.length) {
      setAnswers(newAnswers)
      setCurrent(current + 1)
      return
    }

    const totalPoints = newAnswers.reduce((s, a) => s + (a.correct ? a.puntos : 0), 0)
    const maxPoints = preguntas.reduce((s, p) => s + (p.puntos || 0), 0)
    const percent = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0

    setSubmitting(true)
    try {
      const res: any = await api('/intento', {
        method: 'POST',
        body: {
          id_actividad: activityId,
          puntaje_obtenido: percent,
          detalle_respuestas: JSON.stringify({ answers: newAnswers }),
        },
      })
      setAnswers(newAnswers)
      setCurrent(preguntas.length)
      if (res?.awardedCoins) setAwardedCoins(res.awardedCoins)
    } catch (err: any) {
      setError(err.message || 'Error enviando intento')
    } finally {
      setSubmitting(false)
    }
  }

  // 1. COMPROBACIONES INICIALES (Cargando o Errores)
  if (loading) return <div className="p-6">Cargando preguntas...</div>
  if (error) return <div className="p-6 text-red-300">{error}</div>
  if (!ejercicio || preguntas.length === 0) return <div className="p-6">No hay datos disponibles.</div>

  // 2. VISTA DE RESULTADOS (Cuando ya terminó todas las preguntas)
  if (current >= preguntas.length) {
    const scored = answers.reduce((s, a) => s + (a.correct ? a.puntos : 0), 0)
    const maxPoints = preguntas.reduce((s, p) => s + (p.puntos || 0), 0)
    const percent = maxPoints > 0 ? Math.round((scored / maxPoints) * 100) : 0

    return (
      <div className="bg-white/5 p-6 rounded-xl border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-300">
        <h2 className="text-2xl font-bold mb-4 text-center">¡Ejercicio Terminado!</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/5 p-4 rounded-lg text-center">
            <p className="text-sm text-white/60">Puntaje</p>
            <p className="text-2xl font-bold">{percent}%</p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg text-center">
            <p className="text-sm text-white/60">Monedas</p>
            <p className="text-2xl font-bold text-yellow-400">+{awardedCoins}</p>
          </div>
        </div>

        <div className="space-y-2 mb-8 max-h-40 overflow-y-auto pr-2">
          {answers.map((a, i) => (
            <div key={i} className={`p-2 rounded text-sm flex justify-between ${a.correct ? 'bg-emerald-500/10 text-emerald-300' : 'bg-red-500/10 text-red-300'}`}>
              <span>Pregunta {i + 1}</span>
              <span>{a.correct ? '✓' : '✗'}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center border-t border-white/10 pt-6">
          <button
            disabled={secondsLeft > 0}
            onClick={() => navigate('/path')}
            className={`w-full py-4 rounded-xl font-bold transition-all duration-300 ${
              secondsLeft > 0 
                ? 'bg-gray-700 text-white/30 cursor-not-allowed' 
                : 'bg-emerald-500 hover:bg-emerald-400 hover:scale-[1.02] shadow-[0_0_20px_rgba(16,185,129,0.3)]'
            }`}
          >
            {secondsLeft > 0 
              ? `Revisando resultados... (${secondsLeft}s)` 
              : 'Finalizar y Continuar'}
          </button>
        </div>
      </div>
    )
  }

  // 3. VISTA DE PREGUNTA ACTUAL (Aquí es donde va el código que no sabías donde poner)
  const q = preguntas[current]
  const opciones = parseOptions(q.opciones || '[]')

  return (
    <div className="bg-white/5 p-6 rounded shadow mb-6">
       <h2 className="text-xl font-semibold mb-3">Pregunta {current + 1} / {preguntas.length}</h2>
       <div className="mt-2 text-white/90 text-lg mb-6">{q?.enunciado}</div>

       <div className="grid gap-3">
         {opciones.map((opt: string, i: number) => (
           <button 
             key={i} 
             className={`text-left px-4 py-3 rounded-xl transition-all ${selected === opt ? 'bg-emerald-600 ring-2 ring-emerald-400' : 'bg-white/5 hover:bg-white/10'}`} 
             onClick={() => setSelected(opt)}
           >
             {opt}
           </button>
         ))}
       </div>

       <div className="mt-8 flex gap-3">
         <button 
           disabled={!selected || submitting} 
           onClick={confirmAnswer} 
           className="flex-1 bg-emerald-500 disabled:bg-gray-600 py-3 rounded-xl font-bold"
         >
           {submitting ? 'Enviando...' : 'Confirmar Respuesta'}
         </button>
         <button 
           onClick={() => setSelected(null)} 
           className="bg-gray-700 px-4 py-2 rounded-xl"
         >
           Limpiar
         </button>
       </div>
    </div>
  )
}