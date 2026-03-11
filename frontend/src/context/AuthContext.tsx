import React, { createContext, useContext, useEffect, useState } from 'react'
import api, { setAccessToken, refreshAccessTokenViaCookie } from '../api'

// --- TIPOS PARA EL AVATAR ---
type EquippedItems = {
  base: string;
  expression?: string | null;
  clothing?: string | null;
  accessory?: string | null;
}

// Actualizamos el tipo User para incluir equipped
type User = { 
  id: string; 
  email: string; 
  nombre?: string;
  equipped?: EquippedItems;
}

type AuthContextValue = {
  user: User | null
  accessToken: string | null
  loginFromResponse: (res: any) => void
  logout: () => Promise<void>
  initializing: boolean
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
  const [initializing, setInitializing] = useState(true)

  // Sincronización entre pestañas
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

  // Al montar, intentar obtener un access token y el perfil
  useEffect(() => {
    let mounted = true;
    
    const initAuth = async () => {
      try {
        const token = await refreshAccessTokenViaCookie()
        if (!mounted) return
        
        setAccessToken(token)
        setAccessTokenState(token)

        // Obtener perfil del usuario (esto ya trae el 'equipped' gracias al service)
        const profile = await api('/usuario/me')
        if (!mounted) return

        const u = profile?.user ?? profile
        if (u?.id) {
          localStorage.setItem('moni_user', JSON.stringify(u))
          setUser(u)
        }
      } catch (error) {
        // Si hay error 401 o de red, limpiamos estado
        if (mounted) {
          localStorage.removeItem('moni_user');
          setUser(null);
        }
      } finally {
        if (mounted) setInitializing(false);
      }
    };

    initAuth();

    return () => { mounted = false };
  }, []);

  function loginFromResponse(res: any) {
    if (res?.accessToken) {
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
      // Ignorar errores de red al cerrar sesión
    }
    localStorage.removeItem('moni_access')
    localStorage.removeItem('moni_user')
    setUser(null)
    setAccessToken(null)
    setAccessTokenState(null)
  }

  return (
    <AuthContext.Provider value={{ user, accessToken, loginFromResponse, logout, initializing }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}