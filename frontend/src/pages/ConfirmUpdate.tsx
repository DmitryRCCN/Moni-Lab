import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';

const ICONS = {
  loading: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-16 mx-auto text-yellow-500 animate-spin">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  ),
  success: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-16 mx-auto text-emerald-400">
      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
    </svg>
  ),
  error: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-16 mx-auto text-red-400">
      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
    </svg>
  )
};

export default function ConfirmUpdate() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verificando confirmación...');
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    const confirmAction = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Error de Protocolo: No se encontró un enlace válido.');
        return;
      }

      try {
        const response = await api('/auth/confirm-action', {
          method: 'POST',
          body: { token }
        });

        setStatus('success');
        setMessage(response.message || 'Tu nombre de usuario ha sido actualizado.');
        setTimeout(() => navigate('/profile'), 4000); // Redirección limpia
      } catch (err: any) {
        setStatus('error');
        setMessage(err.error || 'El enlace ha expirado o es inválido.');
      }
    };

    confirmAction();
  }, [token, navigate]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4 text-white">
      <div className={`w-full max-w-md p-8 rounded-3xl border-2 transition-all ${
        status === 'loading' ? 'border-yellow-500/30 bg-slate-900' :
        status === 'success' ? 'border-emerald-500/50 bg-emerald-950/40' :
        'border-rose-500/50 bg-rose-950/40'
      } backdrop-blur-xl shadow-2xl`}>
        
        <div className="text-center space-y-6">
          
          {/* Aquí inyectamos el SVG correspondiente al estado */}
          <div className="mb-4">
            {ICONS[status]}
          </div>

          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter">
              {status === 'loading' ? 'Procesando' : status === 'success' ? '¡Éxito!' : 'Error'}
            </h2>
            <p className="text-white/70 mt-2">{message}</p>
          </div>

          <div className="pt-4">
            <Link 
              to="/login" 
              className={`block w-full py-4 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-95 ${
                status === 'success' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-rose-500'
              }`}
            >
              Ir al Inicio de Sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}