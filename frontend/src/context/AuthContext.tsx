import React, { createContext, useContext, useEffect, useState } from 'react'
import api, { setAccessToken, refreshAccessTokenViaCookie } from '../api'

type User = { id: string; email: string; nombre?: string }

type AuthContextValue = {
  user: User | null
  accessToken: string | null
  loginFromResponse: (res: any) => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const s = localStorage.getItem('moni_user')
      return s ? JSON.parse(s) : null
    } catch {
      return null
    }
  })

  const [accessToken, setAccessTokenState] = useState<string | null>(null)

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'moni_user') {
        setUser(e.newValue ? JSON.parse(e.newValue) : null)
      }
      if (e.key === 'moni_access') setAccessTokenState(e.newValue)
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  // Al montar, intentar obtener un access token desde la cookie (refreshToken)
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const token = await refreshAccessTokenViaCookie()
        if (!mounted) return
        setAccessToken(token)
        setAccessTokenState(token)
        // Obtener perfil del usuario y sincronizar estado
        const profile = await api('/usuario/me')
        if (!mounted) return
        // el backend puede devolver { user: {...} } (me.route) o directamente el objeto de usuario
        const u = profile?.user ?? profile
        if (u?.id) {
          localStorage.setItem('moni_user', JSON.stringify(u))
          setUser(u)
        }
      } catch {
        // no estamos autenticados
      }
    })()

    return () => { mounted = false }
  }, [])

  function loginFromResponse(res: any) {
    if (res?.accessToken) {
      // No persistir access token en localStorage: usar cookie + memoria
      setAccessToken(res.accessToken)
      setAccessTokenState(res.accessToken)
    }
    if (res?.user) {
      localStorage.setItem('moni_user', JSON.stringify(res.user))
      setUser(res.user)
    }
  }

  async function logout() {
    try {
      await api('/auth/logout', { method: 'POST' })
    } catch {
      // ignore network errors on logout
    }
    localStorage.removeItem('moni_access')
    localStorage.removeItem('moni_user')
    setUser(null)
    setAccessToken(null)
    setAccessTokenState(null)
  }

  return (
    <AuthContext.Provider value={{ user, accessToken, loginFromResponse, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
