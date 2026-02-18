export default function Home() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-white">Bienvenido a Moni-Lab</h1>
      <p className="text-white/90 mb-6">Tu plataforma de aprendizaje de programación gamificada.</p>
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-3 text-emerald-900">¿Qué es Moni-Lab?</h2>
        <p className="text-emerald-900 mb-4">Moni-Lab es una plataforma diseñada para hacer que el aprendizaje de la programación sea divertido y motivador. A través de lecciones interactivas, quizzes y una ruta de aprendizaje gamificada, te ayudamos a dominar las habilidades de programación mientras ganas monedas virtuales y desbloqueas recompensas.</p>
        <h2 className="text-2xl font-bold mb-3 text-emerald-900">¿Cómo funciona?</h2>
        <p className="text-emerald-900 mb-4">Sigue la ruta de aprendizaje para completar lecciones y quizzes. Gana monedas por cada lección completada y úsalas para personalizar tu avatar o desbloquear contenido exclusivo. Consulta tu perfil para ver tu progreso y estadísticas.</p>
        <h2 className="text-2xl font-bold mb-3 text-emerald-900">¡Comienza ahora!</h2>
        <p className="text-emerald-900">Haz clic en "Ruta de aprendizaje" para comenzar tu viaje de programación con Moni-Lab. ¡Diviértete aprendiendo!</p>
      </div>
    </div>
  )
}