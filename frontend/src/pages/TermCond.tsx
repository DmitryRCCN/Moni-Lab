export default function TermCond() {
  return (
    <div className="min-h-screen pt-8 pb-24 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-emerald-800 p-6 rounded-2xl shadow-xl border border-white/6">
          <h1 className="text-4xl mb-8 text-yellow-300">Términos y Condiciones</h1>

          <div className="space-y-6 text-white/90">
            <section>
              <h2 className="text-2xl mb-3 text-emerald-300">1. Alcance y aceptación</h2>
              <p className="text-base leading-relaxed">
                El uso de Moni-Lab implica la aceptación de estos Términos y Condiciones, así como del Aviso de Privacidad disponible en la sección correspondiente. Moni-Lab es una versión mínima viable y está ofrecida como un proyecto estudiantil universitario con fines educativos y de prototipo.
              </p>
            </section>

            <section>
              <h2 className="text-2xl mb-3 text-emerald-300">2. Usuarios y supervisión</h2>
              <ul className="space-y-2 text-base leading-relaxed">
                <li>• Moni-Lab está diseñado para niños y adolescentes bajo la supervisión de un padre, madre o tutor.</li>
                <li>• El registro debe hacerse con información veraz y actualizada.</li>
                <li>• El adulto responsable debe supervisar el uso de la plataforma y asesorar al menor en el uso de sus funciones.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl mb-3 text-emerald-300">3. Registro y cuenta</h2>
              <ul className="space-y-2 text-base leading-relaxed">
                <li>• Para acceder a funciones personalizadas es necesario crear una cuenta.</li>
                <li>• El usuario es responsable de mantener la confidencialidad de sus credenciales.</li>
                <li>• Moni-Lab podrá suspender o eliminar cuentas que incumplan estos términos o que usen información falsa.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl mb-3 text-emerald-300">4. Uso permitido</h2>
              <ul className="space-y-2 text-base leading-relaxed">
                <li>• La plataforma se ofrece únicamente para actividades educativas, lúdicas y de práctica en educación financiera.</li>
                <li>• No se permite usar la plataforma para fines comerciales, fraudulentos, de suplantación o violación de derechos de terceros.</li>
                <li>• El contenido del proyecto es una herramienta de aprendizaje; no constituye asesoría financiera profesional.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl mb-3 text-emerald-300">5. Propiedad intelectual</h2>
              <p className="text-base leading-relaxed">
                Todo el contenido de Moni-Lab, incluyendo textos, gráficos, código y diseños, es propiedad del proyecto o de sus licenciantes. Queda prohibida la reproducción, distribución o modificación sin autorización expresa.
              </p>
            </section>

            <section>
              <h2 className="text-2xl mb-3 text-emerald-300">6. Privacidad y tratamiento de datos</h2>
              <p className="text-base leading-relaxed">
                El tratamiento de datos personales se realiza conforme al Aviso de Privacidad. Al usar Moni-Lab, aceptas que tus datos sean recabados y utilizados para operar la plataforma y mejorar la experiencia educativa.
              </p>
            </section>

            <section>
              <h2 className="text-2xl mb-3 text-emerald-300">7. Cambios al servicio</h2>
              <p className="text-base leading-relaxed">
                Moni-Lab es un proyecto en versión Beta y puede cambiar, actualizarse o descontinuarse en cualquier momento. El equipo no garantiza disponibilidad continua ni ausencia de errores.
              </p>
            </section>

            <section>
              <h2 className="text-2xl mb-3 text-emerald-300">8. Suspensión y terminación</h2>
              <p className="text-base leading-relaxed">
                Moni-Lab puede suspender o cancelar tu acceso si se detecta un uso indebido, violaciones de estos términos o conducta contraria a la ley. También puedes solicitar la cancelación de tu cuenta en cualquier momento.
              </p>
            </section>

            <section>
              <h2 className="text-2xl mb-3 text-emerald-300">9. Limitación de responsabilidad</h2>
              <p className="text-base leading-relaxed">
                El equipo de Moni-Lab no se hace responsable por daños directos o indirectos derivados del uso de la plataforma, ni por decisiones financieras tomadas fuera de ella. El servicio se ofrece tal cual, dentro de un entorno académico y experimental.
              </p>
            </section>

            <section>
              <h2 className="text-2xl mb-3 text-emerald-300">10. Ley aplicable</h2>
              <p className="text-base leading-relaxed">
                Estos Términos y Condiciones se rigen por las leyes aplicables de los Estados Unidos Mexicanos. Cualquier controversia relacionada con el servicio será resuelta conforme a dichas leyes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl mb-3 text-emerald-300">11. Actualizaciones</h2>
              <p className="text-base leading-relaxed">
                Nos reservamos el derecho a modificar estos términos en cualquier momento. La versión vigente se publicará en esta página y entrará en vigor al ser actualizada.
              </p>
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
