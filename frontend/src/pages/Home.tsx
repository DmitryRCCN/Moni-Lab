export default function Home() {
  return (
   <div className="animate-in fade-in duration-700">

      {/* HERO */}
      <div className="flex items-center justify-center gap-4 mb-10 text-center flex-wrap">
        
        <img
          src="/images/mono.avif"
          alt="Mono"
          loading="eager"
          decoding="async"
          className="hidden md:block w-36 lg:w-48"
        />

        <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 whitespace-nowrap">
          Bienvenido a Moni-Lab
        </h1>

        <img
          src="/images/mona.avif"
          alt="Mona"
          loading="lazy"
          decoding="async"
          className="hidden md:block w-36 lg:w-48"
        />
      </div>

      {/* PANEL 1 */}
      <section className="moni-panel p-6 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">

          <img
            src="/images/monoCoin.avif"
            alt="Moni coin"
            loading="lazy"
            decoding="async"
            className="w-28 md:w-36 shrink-0"
          />

          <div>
            <h2 className="text-2xl font-bold text-yellow-400 mb-2">
              ¿Qué es Moni-Lab?
            </h2>

            <p>
              Moni-Lab es una plataforma diseñada para aprender educación
              financiera de forma divertida mediante lecciones, actividades y
              recompensas dentro de la plataforma.
            </p>
          </div>

        </div>
      </section>

      {/* PANEL 2 */}
      <section className="moni-panel p-6 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">

          <div>
            <h2 className="text-2xl font-bold text-yellow-400 mb-2">
              ¿Cómo funciona?
            </h2>

            <p>
              Sigue el recorrido de aprendizaje para completar lecciones y
              quizzes. Gana monedas por cada actividad completada y úsalas
              para personalizar tu avatar o desbloquear contenido.
            </p>
          </div>

          <img
            src="/images/monaRead.avif"
            alt="Aprender"
            loading="lazy"
            decoding="async"
            className="w-28 md:w-36 shrink-0"
          />

        </div>
      </section>

      {/* PANEL 3 */}
      <section className="moni-panel p-6 md:p-8 text-center">

        <h2 className="text-2xl font-bold text-yellow-400 mb-3">
          ¡Comienza ahora!
        </h2>

        <p>
          Haz clic en <b>Registrarse</b> para comenzar tu viaje en el mundo
          de la economía con Moni-Lab.
        </p>

      </section>

    </div>
  )
}