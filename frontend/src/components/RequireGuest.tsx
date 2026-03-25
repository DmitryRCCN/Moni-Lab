import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { JSX } from 'react';

export default function RequireGuest({ children }: { children: JSX.Element }) {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Si ya hay un usuario logueado, lo mandamos a su recorrido
  if (user) {
    return <Navigate to="/path" replace />;
  }

  return children;
}