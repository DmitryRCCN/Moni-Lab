export default function About() {
  return (
    <div className="min-h-screen pt-8 pb-24 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-emerald-800 p-6 rounded-2xl shadow-xl border border-white/6">
          <h1 className="text-4xl mb-8 text-yellow-300">Sobre Nosotros</h1>

          <div className="space-y-6 text-white/90">
            <section>
              <h2 className="text-2xl mb-3 text-emerald-300">Quiénes somos</h2>
              <p className="text-base leading-relaxed">
                Moni-Lab es un proyecto estudiantil universitario desarrollado como una versión mínima viable (Beta) para fomentar la educación financiera en niños y adolescentes. Nuestro objetivo es demostrar un prototipo funcional que combine gamificación, aprendizaje adaptativo y análisis de desempeño.
              </p>
            </section>

            <section>
              <h2 className="text-2xl mb-3 text-emerald-300">Qué hacemos</h2>
              <p className="text-base leading-relaxed">
                Ofrecemos una plataforma interactiva donde los usuarios avanzan a través de nodos educativos, resuelven actividades y minijuegos, ganan puntos y monedas virtuales, y construyen un avatar personalizable. El proyecto integra herramientas de análisis que permiten entender el progreso del estudiante de manera más objetiva.
              </p>
            </section>

            <section>
              <h2 className="text-2xl mb-3 text-emerald-300">Nuestro enfoque</h2>
              <p className="text-base leading-relaxed">
                Diseñamos Moni-Lab para que sea accesible, atractivo y seguro. El enfoque es educativo, no financiero profesional, y busca reforzar hábitos responsables mediante experiencias de juego y contenidos pedagógicos adecuados a la etapa escolar.
              </p>
            </section>

            <section>
              <h2 className="text-2xl mb-3 text-emerald-300">Compromiso con la privacidad</h2>
              <p className="text-base leading-relaxed">
                Valoramos la privacidad y el cuidado de los datos personales, especialmente porque la plataforma está orientada a menores. Por ello, aplicamos principios de seguridad, confidencialidad y transparencia en el uso de la información, tal como se detalla en nuestro Aviso de Privacidad.
              </p>
            </section>

            <section>
              <h2 className="text-2xl mb-3 text-emerald-300">Visión para el proyecto</h2>
              <p className="text-base leading-relaxed">
                Moni-Lab busca sentar las bases de una experiencia educativa escalable, para evolucionar desde esta primera versión hacia un producto más completo que apoye a estudiantes, tutores y educadores en el aprendizaje financiero temprano.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
