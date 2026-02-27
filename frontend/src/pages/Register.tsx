import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [show, setShow] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { loginFromResponse } = useAuth()

  function validate() {
    if (!email || !username || !password) return 'Completa todos los campos'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Correo inválido'
    if (username.length < 3) return 'El usuario debe tener al menos 3 caracteres'
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password))
      return 'La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y al menos uno de estos símbolos: @$!%*?&';
    if (password !== confirm) return 'Las contraseñas no coinciden'
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
    ;(async () => {
      try {
        const res = (await api('/auth/register', { method: 'POST', body: { email, password, nombre: username } })) as any
        loginFromResponse(res)
        navigate('/Path')
      } catch (err: any) {
        setError(err.message || 'Error en registro')
      }
    })()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gradient-to-br from-emerald-800/30 to-teal-900/20 p-6 rounded-2xl shadow-xl border border-white/6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-yellow-300 flex items-center justify-center text-3xl font-bold text-emerald-900">🌿</div>
          <div>
            <h1 className="text-2xl font-bold">¡Crea tu cuenta!</h1>
            <p className="text-sm text-white/80">Regístrate y comienza a aprender jugando</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-white/80">Correo electrónico</label>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
              className="w-full mt-1 p-3 rounded-lg bg-white/5 border border-white/6 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>

          <div>
            <label className="text-sm text-white/80">Usuario</label>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="nombre_de_usuario"
              className="w-full mt-1 p-3 rounded-lg bg-white/5 border border-white/6 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>

          <div>
            <label className="text-sm text-white/80">Contraseña</label>
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="•••••••"
                className="w-full mt-1 p-3 rounded-lg bg-white/5 border border-white/6 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-white/80">Confirmar contraseña</label>
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="•••••••"
                className="w-full mt-1 p-3 rounded-lg bg-white/5 border border-white/6 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
              <button type="button" onClick={() => setShow(s => !s)} className="absolute right-2 top-2 text-sm text-white/70">{show ? 'Ocultar' : 'Mostrar'}</button>
            </div>
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
            <button type="submit" className="w-full py-3 rounded-lg bg-amber-400 text-slate-900 font-bold hover:scale-105 transition-transform">Crear cuenta</button>
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
