import { Fragment } from 'react'

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
  return (
    <section className="learning-path vertical">
      <h2 className="lp-title">Camino de aprendizaje</h2>

      <div className="lp-vertical">
        <div className="lp-center-line" />
        {steps.map((s, idx) => {
          const side = idx % 2 === 0 ? 'left' : 'right'
          return (
            <div key={s.id} className={`lp-step-vert ${side}`}>
              <div className="lp-node-wrapper">
                <div className={`lp-node ${s.locked ? 'locked' : 'unlocked'}`}>
                  <div className="lp-node-icon">{s.locked ? '🔒' : '✓'}</div>
                </div>
                <div className="lp-label">{s.title}</div>
              </div>
              <div className="lp-step-spacer" />
            </div>
          )
        })}
      </div>

      <p className="lp-note">Sigue el camino para desbloquear nuevas lecciones y recompensas.</p>
    </section>
  )
}
