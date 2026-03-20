// frontend/src/pages/ConfirmUpdate.tsx
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function ConfirmUpdate() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verificando credenciales...');
  const [tempPass, setTempPass] = useState<string | null>(null);
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    const confirmAction = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Error de Protocolo: No se encontró un token de acceso.');
        return;
      }

      try {
        // Llamada al endpoint que creamos en el auth.controller
        const response = await api('/auth/confirm-action', {
          method: 'POST',
          body: { token }
        });

        setStatus('success');
        setMessage(response.message);
        if (response.tempPassword) {
          setTempPass(response.tempPassword);
        } else {
          // Si no es password reset, redirigir normal
          setTimeout(() => navigate('/profile'), 4000);
        }
      } catch (err: any) {
        setStatus('error');
        setMessage(err.error || 'El enlace ha expirado.');
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
            {status === 'loading' ? '⌛' : status === 'success' ? '🔓' : '❌'}
          </div>

          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter">
              {status === 'loading' ? 'Procesando' : status === 'success' ? '¡Éxito!' : 'Error'}
            </h2>
            <p className="text-white/70 mt-2 italic">{message}</p>
          </div>

          {/* CUADRO DE CONTRASEÑA TEMPORAL */}
          {tempPass && (
            <div className="bg-black/40 p-6 rounded-2xl border border-emerald-400/30 animate-in zoom-in duration-500">
              <p className="text-xs text-emerald-400 uppercase font-bold tracking-widest mb-2">Tu nueva clave temporal</p>
              <div className="text-3xl font-mono tracking-widest text-white selection:bg-emerald-500">
                {tempPass}
              </div>
              <p className="text-[10px] text-white/40 mt-4 italic">
                Úsala para iniciar sesión y cámbiala en tu perfil lo antes posible.
              </p>
            </div>
          )}

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