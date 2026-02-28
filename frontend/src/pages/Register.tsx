import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Register() {
  const [email, setEmail] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function validate() {
    if (!email) return 'Ingresa un correo electrónico'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Correo inválido'
    if (!acceptTerms) return 'Debes aceptar los Términos y Condiciones para continuar'
    return ''
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const v = validate()
    if (v) {
      setError(v)
      return
    }
    setError('')
    // avanzar al siguiente paso llevando el email
    navigate('/register/user', { state: { email } })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-emerald-800 p-6 rounded-2xl shadow-xl border border-white/6">
        <div className="flex items-center gap-4 mb-4">
          <img src="images/papaMono.png" className="w-40 h-40"/>
          <div>
            <h1 className="text-2xl">¡Crea tu cuenta!</h1>
            <p className="text-sm text-white">Ingresa el correo electrónico de tu madre, padre o tutor</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-white">Correo electrónico</label>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
              className="w-full mt-1 p-3 rounded-lg bg-white/5 border border-white/6 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>

          <div className="flex items-start gap-2 pt-2">
            <input
              type="checkbox"
              id="terms"
              checked={acceptTerms}
              onChange={e => setAcceptTerms(e.target.checked)}
              className="mt-1 cursor-pointer"
            />
            <label htmlFor="terms" className="text-xs text-white/80 cursor-pointer">
              Acepto los{' '}
              <Link to="/terms" target="_blank" className="text-yellow-300 font-semibold hover:underline">
                Términos y Condiciones
              </Link>
            </label>
          </div>

          {error && <p className="text-sm text-rose-400">{error}</p>}

          <div className="pt-2">
            <button type="submit" className="w-full py-3 rounded-lg bg-amber-400 text-slate-900 font-bold hover:scale-105 transition-transform ">Siguiente</button>
          </div>
        </form>

        <p className="text-sm text-white/80 mt-4 text-center">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-yellow-300 font-semibold">Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}