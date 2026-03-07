import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../context/AuthContext'

export default function Login() {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)

  const [error, setError] = useState('')
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const navigate = useNavigate()
  const { loginFromResponse } = useAuth()

  const validate = useCallback(() => {

    if (!username) return 'Ingresa nombre de usuario'

    if (password.length < 8)
      return 'La contraseña debe tener al menos 8 caracteres'

    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/

    if (!regex.test(password))
      return 'Debe incluir mayúsculas, minúsculas, números y símbolos @$!%*?&'

    return ''

  }, [username, password])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {

      e.preventDefault()

      const v = validate()

      if (v) {
        setError(v)
        return
      }

      setError('')

      try {

        const res = await api('/auth/login', {
          method: 'POST',
          body: {
            nombre: username,
            password,
          },
        }) as any

        loginFromResponse(res)

        navigate('/Path')

      } catch {

        setErrorMessage(
          'Datos incorrectos o inexistentes. Inténtalo otra vez.'
        )

        setShowErrorModal(true)
      }
    },
    [username, password, validate, navigate, loginFromResponse]
  )

  return (
    <div className="min-h-screen flex items-center justify-center p-4">

      <div className="w-full max-w-md bg-emerald-800 p-6 rounded-2xl shadow-xl border border-white/6">

        <div className="flex items-center gap-4 mb-4">

          <div className="w-16 h-16 rounded-full bg-yellow-300 flex items-center justify-center text-3xl font-bold text-emerald-900">
            🦜
          </div>

          <div>
            <h1 className="text-2xl">¡Bienvenido!</h1>
            <p className="text-sm text-white/80">
              Inicia sesión para continuar con tu aventura
            </p>
          </div>

        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>

            <label className="text-sm text-white/80">
              Usuario
            </label>

            <input
              value={username}
              autoComplete="username"
              onChange={(e) => setUsername(e.target.value)}
              placeholder="nombre_de_usuario"
              className="w-full mt-1 p-3 rounded-lg bg-white/5 border border-white/6 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />

          </div>

          <div>

            <label className="text-sm text-white/80">
              Contraseña
            </label>

            <div className="relative">

              <input
                type={show ? 'text' : 'password'}
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full mt-1 p-3 rounded-lg bg-white/5 border border-white/6 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />

              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-2 top-2 text-sm text-white/70"
              >
                {show ? 'Ocultar' : 'Mostrar'}
              </button>

            </div>

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
            Entrar
          </button>

        </form>

        <p className="text-sm text-white/80 mt-4 text-center">
          ¿No tienes cuenta?{' '}
          <Link
            to="/register"
            className="text-yellow-300 font-semibold"
          >
            Regístrate
          </Link>
        </p>

      </div>

      {showErrorModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">

          <div className="bg-slate-900 p-6 rounded shadow-lg w-full max-w-md">

            <div className="flex items-center gap-4 mb-4">

              <div className="flex-1">
                <h3 className="text-lg font-semibold">
                  Error de inicio de sesión
                </h3>
                <p>{errorMessage}</p>
              </div>

              <img
                src="/images/monaError.avif"
                alt="Error"
                loading="lazy"
                decoding="async"
                className="w-36"
              />

            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowErrorModal(false)}
                className="px-3 py-1 bg-amber-400 text-slate-900 rounded"
              >
                Aceptar
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  )
}
