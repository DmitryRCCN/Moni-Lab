import { useState, useCallback } from 'react'
import { useNavigate, useLocation, Link, Navigate } from 'react-router-dom'
import api from '../api'

type LocationState = {
  email?: string
}

export default function RegisterUser() {

  const navigate = useNavigate()
  const location = useLocation()

  const state = location.state as LocationState | null
  const email = state?.email

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')

  const validate = useCallback(() => {

    if (!username || !password || !confirm)
      return 'Completa todos los campos'

    if (username.length < 3)
      return 'El usuario debe tener al menos 3 caracteres'

    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/

    if (!regex.test(password))
      return 'La contraseña debe tener 8 caracteres con mayúsculas, minúsculas, números y símbolos'

    if (password !== confirm)
      return 'Las contraseñas no coinciden'

    return ''

  }, [username, password, confirm])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {

      e.preventDefault()

      const v = validate()

      if (v) {
        setError(v)
        return
      }

      if (!email) return

      setError('')

      try {

        await api('/auth/request-registration', {
          method: 'POST',
          body: {
            email,
            password,
            nombre: username
          }
        })

        // Navegar a página de confirmación
        navigate('/auth/confirm-email', { state: { email } })

      } catch (err) {
        let safeErrorMessage = 'Error al procesar tu solicitud. Intenta de nuevo.';

        if (err instanceof Error) {
          try {
            // Intentar parsear como JSON (respuesta del servidor)
            const errorData = JSON.parse(err.message);
            safeErrorMessage = errorData.error || safeErrorMessage;
          } catch {
            // Si no es JSON, intentar interpretar el mensaje
            const rawMessage = err.message.toLowerCase();
            
            if (rawMessage.includes('already taken')) {
              safeErrorMessage = 'El nombre de usuario ya está registrado. Elige otro.';
            } else if (rawMessage.includes('network') || rawMessage.includes('failed')) {
              safeErrorMessage = 'Error de conexión. Verifica tu internet e intenta de nuevo.';
            } else {
              safeErrorMessage = err.message;
            }
          }
        }
        
        setError(safeErrorMessage);
      }

    },
    [username, password, confirm, email, navigate, validate]
  )

  if (!email) {
    return <Navigate to="/register" replace />
  }

  return (

    <div className="min-h-screen flex items-center justify-center p-4">

      <div className="w-full max-w-md bg-emerald-800 p-6 rounded-2xl shadow-xl border border-white/6">

        <div className="flex items-center gap-4 mb-4">

          <div className="w-16 h-16 rounded-full bg-yellow-300 flex items-center justify-center text-3xl font-bold text-emerald-900">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
            </svg>
          </div>

          <div>
            <h1 className="text-2xl">Completa tu cuenta</h1>
            <p className="text-sm text-white/80">
              Crea usuario y contraseña para acceder
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

            <input
              type={show ? 'text' : 'password'}
              value={password}
              autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full mt-1 p-3 rounded-lg bg-white/5 border border-white/6 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />

          </div>

          <div>

            <label className="text-sm text-white/80">
              Confirmar contraseña
            </label>

            <div className="relative">

              <input
                type={show ? 'text' : 'password'}
                value={confirm}
                autoComplete="new-password"
                onChange={(e) => setConfirm(e.target.value)}
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
            className="w-full py-3 rounded-lg bg-amber-400 text-slate-900 hover:scale-105 transition-transform font-bold"
          >
            Finalizar registro
          </button>

        </form>

        <p className="text-sm text-white/80 mt-4 text-center">

          ¿Volver atrás?{' '}

          <Link
            to="/register"
            className="text-yellow-300 font-semibold"
          >
            Modificar correo
          </Link>

        </p>

      </div>

    </div>
  )
}