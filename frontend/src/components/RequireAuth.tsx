import type { ReactElement } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RequireAuth({ children }: { children: ReactElement }) {
  const { user, loading } = useAuth()

  if (loading) return <div className="p-8">Cargando...</div>
  if (!user) return <Navigate to="/login" replace />
  return children
}
