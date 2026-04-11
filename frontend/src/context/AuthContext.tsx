import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import api, { setAccessToken, refreshAccessTokenViaCookie } from '../api'

// --- TIPOS PARA EL AVATAR ---
type EquippedItems = {
  background?: { id: string; svg?: string | null };
  base?:       { id: string; svg?: string | null };
  clothing?:   { id: string; svg?: string | null };
  eyes?:       { id: string; svg?: string | null };
  hair?:       { id: string; svg?: string | null };
  accessory?:  { id: string; svg?: string | null };
}

type User = { 
  id: string; 
  email: string; 
  nombre?: string;
  equipped?: EquippedItems;
  monedas_virtuales?: number;
  experiencia_total?: number;
}

type LoginResponse = {
  accessToken?: string
  user?: User
}

type AuthContextValue = {
  user: User | null
  accessToken: string | null
  loginFromResponse: (res: LoginResponse) => void
  logout: () => Promise<void>
  updateUserData: (data: Partial<User>) => void
  initializing: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
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
        
        // Sincronizamos con el módulo de la API y el estado de React
        setAccessToken(token)
        setAccessTokenState(token)

        const profile = await api('/usuario/me')
        if (!mounted) return

        const u = profile?.user ?? profile
        if (u?.id) {
          localStorage.setItem('moni_user', JSON.stringify(u))
          setUser(u)
        }
      } catch (error) {
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

  // Función para actualizar datos sin cerrar sesión
  const updateUserData = (data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      localStorage.setItem('moni_user', JSON.stringify(updated));
      return updated;
    });
  };

  const loginFromResponse = useCallback((res: LoginResponse) => {
    if (res?.accessToken) {
      setAccessToken(res.accessToken)
      setAccessTokenState(res.accessToken)
    }
    if (res?.user) {
      localStorage.setItem('moni_user', JSON.stringify(res.user))
      setUser(res.user)
    }
  }, []);

  async function logout() {
    try {
      await api('/auth/logout', { method: 'POST' })
    } catch {
      // Ignorar errores de red
    }
    localStorage.removeItem('moni_access')
    localStorage.removeItem('moni_user')
    setUser(null)
    setAccessToken(null)
    setAccessTokenState(null)
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        accessToken, 
        loginFromResponse, 
        logout, 
        updateUserData,
        initializing 
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}