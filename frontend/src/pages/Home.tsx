import LearningPath from '../components/LearningPath'

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats row - keep only Monedas */}
        <div className="flex justify-start sm:justify-start mb-8">
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center border border-white/10 w-44">
            <p className="text-xs text-white/70 mb-1">Monedas</p>
            <p className="text-2xl font-bold text-yellow-300">393</p>
          </div>
        </div>

        {/* Learning path title */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Ruta de aprendizaje</h1>
          <p className="text-white/80 text-sm sm:text-base">Sigue el camino para dominar la educación financiera 💰</p>
        </div>

        {/* Learning path container */}
        <div className="bg-white/5 backdrop-blur rounded-2xl p-8 border border-white/10 shadow-xl">
          <LearningPath />
        </div>
      </div>
    </div>
  )
}
