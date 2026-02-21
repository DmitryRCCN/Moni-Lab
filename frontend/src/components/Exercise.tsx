import React from 'react'

export default function Exercise({ ejercicio }: { ejercicio: any }) {
  if (!ejercicio) return <div>No hay datos del ejercicio</div>

  return (
    <div className="bg-white/5 p-6 rounded shadow mb-6">
      <h2 className="text-xl font-semibold mb-3">Ejercicio</h2>
      <p className="mb-2">Nivel: <strong>{ejercicio.nivel_dificultad}</strong></p>
      <p className="mb-2">Mínimo aprobatorio: <strong>{ejercicio.minimo_aprobatorio}%</strong></p>
      {ejercicio.es_de_salto && <p className="text-sm text-white/70">Este ejercicio permite salto.</p>}
      <div className="mt-4">
        <p className="text-sm text-white/70">Preguntas cargadas en la siguiente iteración.</p>
      </div>
    </div>
  )
}
