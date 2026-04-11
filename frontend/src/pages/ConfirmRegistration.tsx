import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

type ConfirmResponse = {
  accessToken: string;
  refreshToken?: string;
  user: {
    id: string;
    nombre: string;
    email: string;
  };
  message: string;
};

export default function ConfirmRegistration() {
  const navigate = useNavigate();
  const { loginFromResponse } = useAuth();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  
  // Flag para ejecutar solo una vez (evita ejecutarse múltiples veces en StrictMode)
  const hasRun = useRef(false);

  useEffect(() => {
    // Si ya se ejecutó la petición a la API, no la volvemos a hacer.
    if (hasRun.current) return;
    hasRun.current = true;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const confirmReg = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Token de confirmación no encontrado');
        return;
      }

      // Crear un timeout de 15 segundos para la operación
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error('La confirmación tardó demasiado. Por favor, intenta de nuevo.'));
        }, 15000);
      });

      try {
        const res = await Promise.race([
          api('/auth/confirm-registration', {
            method: 'POST',
            body: { token }
          }),
          timeoutPromise
        ]) as ConfirmResponse;

        if (timeoutId) clearTimeout(timeoutId);

        setStatus('success');
        setMessage('¡Registro confirmado exitosamente!');

        // Login automáticamente
        loginFromResponse(res);

        // Redirigir después de 2.5 segundos para que el usuario vea el mensaje
        setTimeout(() => {
          navigate('/path');
        }, 2500);

      } catch (err) {
        if (timeoutId) clearTimeout(timeoutId);

        setStatus('error');
        
        // Intentar parsear el error del servidor
        let errorMessage = 'Error desconocido al confirmar tu registro.';
        
        if (err instanceof Error) {
          // El mensaje de error puede contener JSON del servidor
          try {
            const errorData = JSON.parse(err.message);
            errorMessage = errorData.error || errorMessage;
          } catch {
            // Si no es JSON, usar el mensaje directo
            if (err.message.includes('TOKEN_EXPIRED')) {
              errorMessage = 'El enlace de confirmación ha expirado. Por favor, regístrate de nuevo.';
            } else if (err.message.includes('network') || err.message.includes('Failed')) {
              errorMessage = 'Error de conexión. Verifica tu internet e intenta de nuevo.';
            } else if (err.message.includes('tardó demasiado')) {
              errorMessage = err.message;
            } else {
              errorMessage = err.message;
            }
          }
        }
        
        setMessage(errorMessage);
      }
    };

    confirmReg();

    return () => {
      // Solo limpiamos el timeout en caso de que el usuario cierre la pestaña rápido
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [token, navigate, loginFromResponse]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="w-full max-w-md">
        <div className="bg-emerald-800 p-8 rounded-2xl shadow-xl border border-white/6 text-center">
          {status === 'loading' && (
            <>
              <div className="flex justify-center mb-6">
                <div className="animate-spin">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-12 h-12 text-yellow-300"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.995-1.465"
                    />
                  </svg>
                </div>
              </div>
              <h1 className="text-2xl font-bold mb-3 text-white">Un momento...</h1>
              <p className="text-white/80">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-emerald-700 flex items-center justify-center animate-bounce">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-10 h-10 text-yellow-300"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </div>
              </div>
              <h1 className="text-2xl font-bold mb-3 text-emerald-200">¡Éxito!</h1>
              <p className="text-white/80 mb-6">{message}</p>
              <p className="text-sm text-white/60">
                Redirigiendo a tu dashboard...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-rose-700/30 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-10 h-10 text-rose-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>
              <h1 className="text-2xl font-bold mb-3 text-rose-300">Error</h1>
              <p className="text-white/80 mb-8">{message}</p>

              <div className="space-y-3">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full py-3 rounded-lg bg-amber-400 text-slate-900 hover:scale-105 transition-transform font-bold"
                >
                  🔄 Intentar de Nuevo
                </button>

                <button
                  onClick={() => navigate('/register')}
                  className="w-full py-3 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors font-semibold"
                >
                  ← Volver al Registro
                </button>
              </div>

              <p className="text-xs text-white/60 mt-6">
                Si el problema persiste, intenta registrarte de nuevo.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}