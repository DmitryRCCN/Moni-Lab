export default function Privacy() {
  return (
    <div className="min-h-screen pt-8 pb-24 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-emerald-800 p-6 rounded-2xl shadow-xl border border-white/6">
          <h1 className="text-4xl mb-8 text-yellow-300">Aviso de Privacidad</h1>

          <div className="space-y-6 text-white/90">
            <section>
              <h2 className="text-2xl mb-3 text-emerald-300">1. Responsable del tratamiento</h2>
              <p className="text-base leading-relaxed">
                Moni-Lab es un proyecto estudiantil universitario de versión mínima viable, desarrollado con fines educativos y de prueba de concepto. El tratamiento de datos personales se realiza bajo responsabilidad del equipo de desarrollo de Moni-Lab.
              </p>
            </section>

            <section>
              <h2 className="text-2xl mb-3 text-emerald-300">2. Datos personales que recabamos</h2>
              <ul className="space-y-2 text-base leading-relaxed">
                <li>• Datos de contacto: correo electrónico, nombre completo o seudónimo.</li>
                <li>• Datos de autenticación: contraseña cifrada y datos de sesión necesarios para acceso seguro.</li>
                <li>• Datos de uso: progreso en la plataforma, actividades completadas, puntos, monedas virtuales y nodos recorridos.</li>
                <li>• Datos de comunicación: mensajes enviados a soporte o información de interacción con notificaciones y correos.</li>
                <li>• Información técnica: IP, dispositivo, navegador y registros de uso para mejora del servicio.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl mb-3 text-emerald-300">3. Finalidades del tratamiento</h2>
              <ul className="space-y-2 text-base leading-relaxed">
                <li>• Permitir el registro, autenticación y acceso a la plataforma.</li>
                <li>• Personalizar la experiencia educativa y conservar el avance del usuario.</li>
                <li>• Enviar comunicaciones académicas, actualizaciones del servicio y notificaciones relevantes.</li>
                <li>• Analizar el uso de la plataforma y mejorar la calidad de los contenidos y funciones.</li>
                <li>• Cumplir con obligaciones legales, de seguridad y de soporte técnico.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl mb-3 text-emerald-300">4. Base legal y consentimiento</h2>
              <p className="text-base leading-relaxed">
                El tratamiento de los datos personales se realiza con el consentimiento expreso de los usuarios al registrarse y aceptar este Aviso de Privacidad. En la medida en que proceda, también se aplica el principio de finalidad legítima de la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) y su reglamento.
              </p>
            </section>

            <section>
              <h2 className="text-2xl mb-3 text-emerald-300">5. Datos de menores de edad</h2>
              <p className="text-base leading-relaxed">
                Moni-Lab está dirigido a niños y adolescentes con la supervisión de padres o tutores. No se solicita información sensible de menores. El correo electrónico de registro puede pertenecer al padre, madre o tutor, y el uso de la plataforma debe realizarse bajo supervisión responsable.
              </p>
            </section>

            <section>
              <h2 className="text-2xl mb-3 text-emerald-300">6. Transferencias y proveedores</h2>
              <p className="text-base leading-relaxed">
                No compartimos datos personales con terceros para fines distintos a los establecidos. Podemos transferir información a proveedores de servicios que apoyan la operación de la plataforma (por ejemplo, servicios de correo electrónico, alojamiento o análisis), siempre que mantengan confidencialidad y seguridad.
              </p>
            </section>

            <section>
              <h2 className="text-2xl mb-3 text-emerald-300">7. Derechos ARCO y contacto</h2>
              <p className="text-base leading-relaxed">
                Los usuarios pueden ejercer sus derechos de acceso, rectificación, cancelación y oposición (ARCO), así como la limitación del uso y divulgación de sus datos. Para ejercer estos derechos, envía una solicitud al correo <strong>contacto@mail.monilab.com.mx</strong>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl mb-3 text-emerald-300">8. Seguridad y conservación</h2>
              <p className="text-base leading-relaxed">
                Implementamos medidas técnicas y administrativas razonables para proteger los datos personales contra acceso no autorizado, pérdida, modificación o divulgación. Conservamos los datos mientras la cuenta permanezca activa y durante los plazos necesarios para cumplir obligaciones legales y de calidad del servicio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl mb-3 text-emerald-300">9. Cambios al aviso</h2>
              <p className="text-base leading-relaxed">
                Este Aviso de Privacidad puede actualizarse conforme evolucione el proyecto y se agreguen nuevas funciones. Las modificaciones se publicarán en esta página y se notificará a los usuarios cuando sea relevante.
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
