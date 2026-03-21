import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';

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
          <div className="text-5xl">
            {status === 'loading' ? '⌛' : status === 'success' ? '✅' : '❌'}
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