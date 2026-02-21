import React, { useEffect, useState } from 'react'
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
  const [preguntas, setPreguntas] = useState<Pregunta[]>([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Array<{ id: string; selected: string; correct: boolean; puntos: number }>>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const res: any = await api(`/ejercicio/${activityId}/preguntas`)
        if (!mounted) return
        const list: Pregunta[] = res.preguntas || []
        setPreguntas(list)
        setError(null)
      } catch (err: any) {
        if (!mounted) return
        setError(err.message || 'No se pudieron cargar preguntas')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    if (activityId) load()
    return () => { mounted = false }
  }, [activityId])

  if (!ejercicio) return <div>No hay datos del ejercicio</div>
  if (loading) return <div className="p-6">Cargando preguntas...</div>
  if (error) return <div className="p-6 text-red-300">{error}</div>
  if (!preguntas || preguntas.length === 0) return (
    <div className="bg-white/5 p-6 rounded shadow mb-6">
      <h2 className="text-xl font-semibold mb-3">Ejercicio</h2>
      <p className="mb-2">Nivel: <strong>{ejercicio.nivel_dificultad}</strong></p>
      <p className="mb-2">Mínimo aprobatorio: <strong>{ejercicio.minimo_aprobatorio}%</strong></p>
      <div className="mt-4">
        <p className="text-sm text-white/70">No hay preguntas asignadas a este ejercicio.</p>
      </div>
    </div>
  )

  const q = preguntas[current]

  function parseOptions(opcionesField: string) {
    try {
      const parsed = JSON.parse(opcionesField)
      if (Array.isArray(parsed)) return parsed as string[]
    } catch (_) {
      // fall back to pipe-separated
      return opcionesField.split('|').map(s => s.trim())
    }
    return []
  }

  async function confirmAnswer() {
    if (selected === null) return
    const correct = selected === q.respuesta_correcta
    setAnswers(prev => [...prev, { id: q.id_pregunta, selected, correct, puntos: q.puntos }])
    setSelected(null)
    if (current + 1 < preguntas.length) {
      setCurrent(current + 1)
      return
    }

    // finished -> submit intento
    const totalPoints = answers.reduce((s, a) => s + (a.correct ? a.puntos : 0), correct ? q.puntos : 0)
    const maxPoints = preguntas.reduce((s, p) => s + (p.puntos || 0), 0)
    const percent = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0

    setSubmitting(true)
    try {
      await api('/intento', {
        method: 'POST',
        body: {
          id_usuario: user?.id,
          id_actividad: activityId,
          puntaje_obtenido: totalPoints,
          detalle_respuestas: JSON.stringify({ answers: [...answers, { id: q.id_pregunta, selected, correct, puntos: q.puntos }] }),
        },
      })
      setError(null)
      // replace view with results
      setAnswers(prev => [...prev, { id: q.id_pregunta, selected, correct, puntos: q.puntos }])
      setCurrent(preguntas.length)
    } catch (err: any) {
      setError(err.message || 'Error enviando intento')
    } finally {
      setSubmitting(false)
    }
  }

  if (current >= preguntas.length) {
    const scored = answers.reduce((s, a) => s + (a.correct ? a.puntos : 0), 0)
    const maxPoints = preguntas.reduce((s, p) => s + (p.puntos || 0), 0)
    const percent = maxPoints > 0 ? Math.round((scored / maxPoints) * 100) : 0
    return (
      <div className="bg-white/5 p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-3">Resultado</h2>
        <p>Puntaje obtenido: <strong>{scored}</strong> / {maxPoints} ({percent}%)</p>
        <p className="mt-3">Respuestas:</p>
        <ul className="list-disc pl-6 mt-2 text-sm text-white/80">
          {answers.map(a => (
            <li key={a.id}>{a.id}: {a.selected} — {a.correct ? '✓' : '✗'}</li>
          ))}
        </ul>
      </div>
    )
  }

  const opciones = parseOptions(q.opciones || '[]')

  return (
    <div className="bg-white/5 p-6 rounded shadow mb-6">
      <h2 className="text-xl font-semibold mb-3">Ejercicio</h2>
      <p className="mb-2">Nivel: <strong>{ejercicio.nivel_dificultad}</strong></p>
      <p className="mb-2">Mínimo aprobatorio: <strong>{ejercicio.minimo_aprobatorio}%</strong></p>
      <div className="mt-4">
        <div className="mb-4">
          <div className="text-lg font-medium">Pregunta {current + 1} / {preguntas.length}</div>
          <div className="mt-2 text-white/90">{q.enunciado}</div>
        </div>

        <div className="grid gap-3">
          {opciones.map((opt, i) => (
            <button key={i} className={`text-left px-4 py-3 rounded ${selected === opt ? 'bg-emerald-600 text-white' : 'bg-white/3 text-white/90'}`} onClick={() => setSelected(opt)}>
              {opt}
            </button>
          ))}
        </div>

        <div className="mt-4 flex gap-3">
          <button disabled={!selected || submitting} onClick={confirmAnswer} className="bg-emerald-500 px-4 py-2 rounded">Confirmar</button>
          <button onClick={() => setSelected(null)} className="bg-gray-700 px-4 py-2 rounded">Limpiar</button>
        </div>

        {submitting && <div className="mt-3">Enviando resultado...</div>}
      </div>
    </div>
  )
}
