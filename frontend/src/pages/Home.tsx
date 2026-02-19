export default function Home(

  
) {
  return (
    <div className="p-8 max-w-4xl mx-auto ">
      <h1 className="flex items-center justify-center flex-nowrap text-5xl font-bold mb-4 text-yellow-300">
        <img src="images/mono.png" alt="izquierda" className="hidden md:block w-60 h-38" />

        <span className="whitespace-nowrap">Bienvenido a Moni-Lab</span>

        <img src="images/mona.png" alt="derecha" className="hidden md:block w-60 h-38" />
      </h1>
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <div className="flex items-start gap-4">
          <img src="images/monoCoin.png" alt="icono" className="w-40 h-40" />
          <div>
            <h2 className="text-2xl font-bold text-emerald-900 mb-2">
              ¿Qué es Moni-Lab?
            </h2>
            <p className="text-emerald-900">
              Moni-Lab es una plataforma diseñada para que aprendas las bases de una educación financiera productiva y de una manera divertida y motivadora.
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <div className="flex items-start gap-4">
          <div>
            <h2 className="text-2xl font-bold text-emerald-900 mb-2">
              ¿Cómo funciona?
            </h2>
            <p className="text-emerald-900">
              Sigue la ruta de aprendizaje para completar lecciones y quizzes. Gana monedas por cada lección completada y úsalas para personalizar tu avatar o desbloquear contenido exclusivo. Consulta tu perfil para ver tu progreso y estadísticas.
            </p>
          </div>
          <img src="images/monaRead.png" alt="icono" className="w-40 h-40" />
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow gap-1 mb-6">
        <h2 className="text-2xl font-bold mb-3 text-emerald-900">¡Comienza ahora!</h2>
        <p className="text-emerald-900">Haz clic en "Registrarse" para comenzar tu viaje en el mundo de la economía con Moni-Lab. <br></br> ¡Diviértete aprendiendo!</p>
      </div>
    </div>
  )
}