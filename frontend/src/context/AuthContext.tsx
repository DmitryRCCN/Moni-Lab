import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../api'

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

  const [accessToken, setAccessToken] = useState<string | null>(() => {
    return localStorage.getItem('moni_access')
  })

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'moni_user') {
        setUser(e.newValue ? JSON.parse(e.newValue) : null)
      }
      if (e.key === 'moni_access') setAccessToken(e.newValue)
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  function loginFromResponse(res: any) {
    if (res?.accessToken) {
      localStorage.setItem('moni_access', res.accessToken)
      setAccessToken(res.accessToken)
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
