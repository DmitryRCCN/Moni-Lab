import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Register() {
  const [email, setEmail] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const validate = useCallback(() => {
    if (!email) return 'Ingresa un correo electrónico'

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return 'Correo inválido'

    if (!acceptTerms)
      return 'Debes aceptar los Términos y Condiciones para continuar'

    return ''
  }, [email, acceptTerms])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()

      const v = validate()

      if (v) {
        setError(v)
        return
      }

      setError('')

      navigate('/register/user', {
        state: { email },
      })
    },
    [validate, navigate, email]
  )

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-emerald-800 p-6 rounded-2xl shadow-xl border border-white/6">

        <div className="flex items-center gap-4 mb-4">

          <img
            src="/images/papaMono.avif"
            alt="Tutor"
            loading="lazy"
            decoding="async"
            className="w-32 md:w-36"
          />

          <div>
            <h1 className="text-2xl">¡Crea tu cuenta!</h1>
            <p className="text-sm text-white">
              Ingresa el correo electrónico de tu madre, padre o tutor
            </p>
          </div>

        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="text-sm text-white">
              Correo electrónico
            </label>

            <input
              type="email"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
              className="w-full mt-1 p-3 rounded-lg bg-white/5 border border-white/6 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>

          <div className="flex items-start gap-2 pt-2">

            <input
              type="checkbox"
              id="terms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-1 cursor-pointer"
            />

            <label
              htmlFor="terms"
              className="text-xs text-white/80 cursor-pointer"
            >
              Acepto los{' '}
              <Link
                to="/terms"
                target="_blank"
                className="text-yellow-300 font-semibold hover:underline"
              >
                Términos y Condiciones
              </Link>
            </label>

          </div>

          {error && (
            <p className="text-sm text-rose-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-amber-400 text-slate-900 font-bold hover:scale-105 transition-transform"
          >
            Siguiente
          </button>

        </form>

        <p className="text-sm text-white/80 mt-4 text-center">
          ¿Ya tienes cuenta?{' '}
          <Link
            to="/login"
            className="text-yellow-300 font-semibold"
          >
            Inicia sesión
          </Link>
        </p>

      </div>
    </div>
  )
}