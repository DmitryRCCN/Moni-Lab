export default function TermCond() {
  return (
    <div className="min-h-screen pt-8 pb-24 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-emerald-800 p-6 rounded-2xl shadow-xl border border-white/6">
          <h1 className="text-4xl  mb-8 text-yellow-300">Términos y Condiciones</h1>

          <div className="space-y-6 text-white/90">
            <section>
              <h2 className="text-2xl  mb-3 text-emerald-300">1. Objeto</h2>
              <p className="text-base leading-relaxed">
                Moni-Lab es una plataforma digital diseñada para enseñar conceptos básicos de educación financiera a niños y adolescentes, siempre en compañía y supervisión de sus padres o tutores. El uso de la plataforma implica la aceptación plena de estos Términos y Condiciones.
              </p>
            </section>

            <section>
              <h2 className="text-2xl  mb-3 text-emerald-300">2. Uso de la plataforma</h2>
              <ul className="space-y-2 text-base leading-relaxed">
                <li>• El contenido está orientado a fines educativos y recreativos, no constituye asesoría financiera profesional.</li>
                <li>• Los niños deben utilizar la plataforma bajo la supervisión de un adulto responsable.</li>
                <li>• Los padres o tutores son responsables de guiar y acompañar a los menores en el uso de Moni-Lab.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl  mb-3 text-emerald-300">3. Registro y cuentas</h2>
              <ul className="space-y-2 text-base leading-relaxed">
                <li>• Para acceder a ciertas funciones, puede ser necesario crear una cuenta.</li>
                <li>• Los datos proporcionados deben ser veraces y actualizados.</li>
                <li>• Moni-Lab se reserva el derecho de suspender cuentas que incumplan estos términos.</li>
                <li>• El correo electrónico proporcionado deberá ser del padre/madre o tutor para un mejor seguimiento de la ruta de aprendizaje del usuario.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl  mb-3 text-emerald-300">4. Propiedad intelectual</h2>
              <ul className="space-y-2 text-base leading-relaxed">
                <li>• Todo el contenido (textos, imágenes, ilustraciones, animaciones, código) es propiedad de Moni-Lab o de sus licenciantes.</li>
                <li>• No está permitido copiar, distribuir o modificar el contenido sin autorización expresa.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl  mb-3 text-emerald-300">5. Privacidad y protección de datos</h2>
              <ul className="space-y-2 text-base leading-relaxed">
                <li>• Moni-Lab respeta la privacidad de los usuarios y aplica medidas para proteger la información personal.</li>
                <li>• Los datos recopilados se utilizan únicamente para mejorar la experiencia educativa y no se comparten con terceros sin consentimiento.</li>
                <li>• Para más detalles, consulte nuestro Aviso de Privacidad.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl  mb-3 text-emerald-300">6. Limitación de responsabilidad</h2>
              <ul className="space-y-2 text-base leading-relaxed">
                <li>• Moni-Lab no se hace responsable por decisiones financieras tomadas fuera de la plataforma basadas en los contenidos educativos.</li>
                <li>• El uso de la plataforma es bajo responsabilidad de los padres o tutores.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl  mb-3 text-emerald-300">7. Modificaciones</h2>
              <ul className="space-y-2 text-base leading-relaxed">
                <li>• Moni-Lab puede actualizar estos Términos y Condiciones en cualquier momento.</li>
                <li>• Los cambios entrarán en vigor desde su publicación en la plataforma.</li>
              </ul>
            </section>
          </div>

          <div className="mt-8 p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-lg">
            <p className="text-white text-sm">
              <strong>Última actualización:</strong> {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
