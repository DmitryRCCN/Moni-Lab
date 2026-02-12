export default function RightPanel() {
  return (
    <aside className="right-panel">
      <div className="rp-card rp-offer">
        <div className="rp-head">
          <div className="rp-tag">🔥 Oferta</div>
          <div className="rp-lang">JS</div>
        </div>
        <h3 className="rp-title">¡Oferta de San Valentín!</h3>
        <p className="rp-desc">Obtén 35% de descuento - tiempo limitado.</p>
        <button className="rp-cta">HAZTE PRO</button>
      </div>

      <div className="rp-card rp-league">
        <div className="rp-row">
          <div className="rp-title-sm">Retador Liga</div>
          <div className="rp-link">Ver</div>
        </div>
        <div className="rp-sub">Clasificado #6 • 829 XP esta semana</div>
      </div>

      <div className="rp-card rp-goals">
        <div className="rp-row">
          <div className="rp-title-sm">Objetivos Diarios</div>
          <div className="rp-link">Ver</div>
        </div>
        <div className="rp-goal">
          <div className="rp-progress"><div className="rp-progress-bar" style={{ width: '50%' }} /></div>
          <div className="rp-goal-meta">Resuelve 4 desafíos al primer intento (2/4)</div>
        </div>

        <div className="rp-goal">
          <div className="rp-progress"><div className="rp-progress-bar" style={{ width: '83%' }} /></div>
          <div className="rp-goal-meta">Completa 6 ejercicios (5/6)</div>
        </div>
      </div>
    </aside>
  )
}
