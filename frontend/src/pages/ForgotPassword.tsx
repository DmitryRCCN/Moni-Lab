import { useState } from 'react';
import api from '../api'; // Asumiendo tu configuración de axios/fetch
import PasswordField from '../components/passwordField';

// --- PASO 1: DEFINIR INTERFACES PARA MATAR EL "ANY" ---
interface ApiError {
  error: string;
}

interface ForgotResponse {
  token: string;
}

interface VerifyResponse {
  allowToken: string;
}

export default function ForgotPassword() {
  const [step, setStep] = useState<'EMAIL' | 'VERIFY' | 'RESET' | 'SUCCESS'>('EMAIL');
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [tokens, setTokens] = useState({ reset: '', allow: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // --- MANEJADORES ---

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Tipamos la respuesta para evitar 'any'
      const res = await api('/auth/forgot-password', {
        method: 'POST',
        body: { email, nombre }
      }) as ForgotResponse;
      
      setTokens(prev => ({ ...prev, reset: res.token }));
      setStep('VERIFY');
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.error || 'Error al enviar el código');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api('/auth/verify-reset-code', {
        method: 'POST',
        body: { token: tokens.reset, code }
      }) as VerifyResponse;

      setTokens(prev => ({ ...prev, allow: res.allowToken }));
      setStep('RESET');
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.error || 'Código inválido');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api('/auth/reset-password', {
        method: 'POST',
        body: { allowToken: tokens.allow, newPassword }
      });
      setStep('SUCCESS');
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.error || 'No se pudo actualizar');
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
    {/* Contenedor con la estética de "Editar Perfil" */}
    <div className="bg-[#064e3b] border-2 border-emerald-500/30 p-8 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-md relative overflow-hidden">
      
      {/* Botón de cerrar (estético, para que parezca un modal) */}
      <button 
        onClick={() => window.history.back()} 
        className="absolute right-6 top-6 text-white/40 hover:text-white transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Título unificado */}
      <h2 className="text-3xl font-black text-white mb-8 text-center tracking-tight drop-shadow-md">
        {step === 'EMAIL' && 'Recuperar Acceso'}
        {step === 'VERIFY' && 'Verificar Código'}
        {step === 'RESET' && 'Nueva Contraseña'}
        {step === 'SUCCESS' && '¡Listo!'}
      </h2>
        
        {/* --- PASO 1: SOLICITAR CÓDIGO --- */}
        {step === 'EMAIL' && (
          <form onSubmit={handleSendCode} className="space-y-4">
             <h2 className="text-2xl font-bold text-white mb-6 text-center">Recuperar Acceso</h2>
             <input 
                type="text" 
                placeholder="Nombre de Usuario"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                className="w-full p-3 rounded bg-black/40 border border-white/10 text-white" 
                required 
             />
             <input 
                type="email" 
                placeholder="Correo Electrónico"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-3 rounded bg-black/40 border border-white/10 text-white" 
                required 
             />
             {error && <p className="text-xs text-rose-400 text-center bg-rose-400/10 py-2 rounded border border-rose-400/20">{error}</p>}
             <button disabled={loading} className="w-full py-3 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-500 transition-colors">
                {loading ? 'Enviando...' : 'Enviar Código'}
             </button>
          </form>
        )}

        {/* --- PASO 2: VERIFICAR CÓDIGO --- */}
        {step === 'VERIFY' && (
          <form onSubmit={handleVerify} className="space-y-4">
             <p className="text-white/80 text-center text-sm">Ingresa el código que enviamos a tu correo.</p>
             <input 
                type="text" 
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                placeholder="000000"
                className="w-full p-4 text-center text-2xl tracking-[1em] rounded bg-black/40 border border-emerald-500 text-white font-mono" 
                required 
             />
             {error && <p className="text-xs text-rose-400 text-center bg-rose-400/10 py-2 rounded border border-rose-400/20">{error}</p>}
             <button disabled={loading} className="w-full py-3 bg-emerald-600 text-white rounded-lg font-bold">
                {loading ? 'Verificando...' : 'Verificar'}
             </button>
          </form>
        )}

        {/* --- PASO 3: NUEVA CONTRASEÑA (REFACTOREADO) --- */}
        {step === 'RESET' && (
          <form onSubmit={handleReset} className="space-y-6">
            <div className="text-center space-y-4 mb-6">
              <div className="flex justify-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth="1.5" 
                  stroke="currentColor" 
                  className="w-12 h-12 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" 
                  />
                </svg>
              </div>
              <p className="text-sm text-white/80 px-4">
                Código aceptado. Ingresa tu nueva credencial.
              </p>
            </div>

            <PasswordField 
              label="Nueva Contraseña"
              value={newPassword}
              onChange={setNewPassword}
              hint="Mínimo 8 caracteres. Debe incluir mayúsculas, números y símbolos (@$!%*?&)."
            />

            {error && <p className="text-xs text-rose-400 text-center bg-rose-400/10 py-2 rounded border border-rose-400/20">{error}</p>}

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full py-4 bg-yellow-400 text-slate-900 rounded-xl font-black uppercase tracking-widest hover:bg-yellow-300 transition-all"
            >
              {loading ? 'Actualizando...' : 'Restablecer Ahora'}
            </button>
          </form>
        )}
        {/*-- PASO 4: ÉXITO --- */}
        {step === 'SUCCESS' && (
          <div className="text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <p className="text-white font-bold text-lg">Contraseña actualizada correctamente.</p>
            <button 
              onClick={() => window.location.href = '/login'}
              className="w-full py-4 bg-yellow-400 text-slate-900 rounded-xl font-black uppercase tracking-widest hover:bg-yellow-300 transition-all"
            >
              Volver al Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}