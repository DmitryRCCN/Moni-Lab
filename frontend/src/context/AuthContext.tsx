import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth as authApi, user as userApi } from '../services/api'
import { useNavigate } from 'react-router-dom'

type User = { id?: string; email?: string; username?: string }

type AuthContextValue = {
  user: User | null
  loading: boolean
  login: (p: { email?: string; username?: string; password: string }) => Promise<void>
  register: (p: { email: string; username: string; password: string }) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem('moni_user')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Optionally, refresh profile from backend if backend exists
    async function load() {
      if (!user) return
      try {
        const me = await userApi.me()
        setUser(me)
        localStorage.setItem('moni_user', JSON.stringify(me))
      } catch {
        // ignore network errors
      }
    }
    load()
  }, [user])

  async function login(payload: { email?: string; username?: string; password: string }) {
    setLoading(true)
    try {
      try {
        const data = await authApi.login(payload)
        const u = data.user || { username: payload.username || '', email: payload.email }
        setUser(u)
        localStorage.setItem('moni_user', JSON.stringify(u))
      } catch {
        // Fallback local mock if backend not available
        const u = { username: payload.username || 'Invitado', email: payload.email }
        setUser(u)
        localStorage.setItem('moni_user', JSON.stringify(u))
      }
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  async function register(payload: { email: string; username: string; password: string }) {
    setLoading(true)
    try {
      try {
        const data = await authApi.register(payload)
        const u = data.user || { username: payload.username, email: payload.email }
        setUser(u)
        localStorage.setItem('moni_user', JSON.stringify(u))
      } catch {
        const u = { username: payload.username, email: payload.email }
        setUser(u)
        localStorage.setItem('moni_user', JSON.stringify(u))
      }
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  async function logout() {
    setLoading(true)
    try {
      try {
        await authApi.logout()
      } catch {
        // ignore network errors
      }
      setUser(null)
      localStorage.removeItem('moni_user')
      navigate('/login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
