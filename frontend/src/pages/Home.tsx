import LearningPath from '../components/LearningPath'

export default function Home() {
  return (
    <div className="app-shell">
      <div className="app-grid">
        {/* Left column is the sidebar - already rendered by Navbar in App layout */}

        <main className="main-content">
          <div className="main-inner">
            <h1 className="text-3xl font-bold mb-1">Ruta de aprendizaje</h1>
            <p className="text-sm text-gray-400 mb-6">Sigue el camino para aprender economía jugando.</p>

            <div className="card card-path">
              <LearningPath />
            </div>

            <section className="features">
              <div className="card small">
                <h3 className="card-title">Progreso</h3>
                <p className="card-desc">Visualiza tus últimas sesiones y logros.</p>
              </div>

              <div className="card small">
                <h3 className="card-title">Retos diarios</h3>
                <p className="card-desc">Completa mini-retos para ganar monedas.</p>
              </div>

              <div className="card small">
                <h3 className="card-title">Recompensas</h3>
                <p className="card-desc">Canjea tus monedas en la tienda.</p>
              </div>
            </section>
          </div>
        </main>

        {/* right panel intentionally hidden for now (ignored per request) */}
      </div>
    </div>
  )
}
