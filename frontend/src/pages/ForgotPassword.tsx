import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

type Step = 'REQUEST' | 'VERIFY' | 'RESET' | 'SUCCESS';

export default function ForgotPassword() {
  const [step, setStep] = useState<Step>('REQUEST');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Datos del formulario
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Tokens
  const [reqToken, setReqToken] = useState('');
  const [allowToken, setAllowToken] = useState('');

  // PASO 1: Pedir código
  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api('/auth/forgot-password', {
        method: 'POST',
        body: { email, nombre: username }
      }) as any;
      setReqToken(res.token); // Guardamos el token temporal
      setStep('VERIFY');
    } catch (err: any) {
      setError(err.error || 'Datos incorrectos. Verifica tu usuario y correo.');
    } finally {
      setLoading(false);
    }
  };

  // PASO 2: Verificar código
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api('/auth/verify-reset-code', {
        method: 'POST',
        body: { token: reqToken, code }
      }) as any;
      setAllowToken(res.allowToken); // Nos dieron permiso de cambiar la pass
      setStep('RESET');
    } catch (err: any) {
      setError(err.error || 'Código inválido o expirado.');
    } finally {
      setLoading(false);
    }
  };

  // PASO 3: Nueva contraseña
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!regex.test(newPassword)) {
      setError('Debe incluir mayúsculas, minúsculas, números y símbolos @$!%*?& (Mín. 8 caracteres).');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await api('/auth/reset-password', {
        method: 'POST',
        body: { allowToken, newPassword }
      });
      setStep('SUCCESS');
    } catch (err: any) {
      setError(err.error || 'Ocurrió un error. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-emerald-950 p-8 rounded-2xl shadow-2xl border border-emerald-800/50 relative overflow-hidden">
        
        {/* Adorno visual */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-yellow-400"></div>

        <h2 className="text-2xl font-black text-emerald-400 uppercase tracking-widest mb-6 text-center">
          Recuperación de Sistema
        </h2>

        {/* --- PASO 1: SOLICITAR --- */}
        {step === 'REQUEST' && (
          <form onSubmit={handleRequest} className="space-y-4">
            <p className="text-sm text-white/70 text-center mb-6">
              Identifícate para solicitar un código de acceso temporal.
            </p>
            <div>
              <label className="text-xs uppercase tracking-wider text-white/60">Usuario</label>
              <input value={username} onChange={e => setUsername(e.target.value)} required className="w-full mt-1 p-3 rounded bg-black/40 border border-white/10 text-white focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-white/60">Correo Electrónico</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full mt-1 p-3 rounded bg-black/40 border border-white/10 text-white focus:outline-none focus:border-emerald-500" />
            </div>
            {error && <p className="text-rose-400 text-sm text-center font-bold">{error}</p>}
            
            <button disabled={loading} className="w-full mt-6 py-3 bg-emerald-600 text-white font-bold rounded hover:bg-emerald-500 transition-colors disabled:opacity-50">
              {loading ? 'Procesando...' : 'Enviar Código'}
            </button>
            <Link to="/login" className="block text-center text-sm text-white/40 hover:text-white mt-4">Cancelar</Link>
          </form>
        )}

        {/* --- PASO 2: VERIFICAR CÓDIGO --- */}
        {step === 'VERIFY' && (
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-4xl">📧</p>
              <p className="text-sm text-white/80">Hemos enviado un código de 6 dígitos a tu correo.</p>
              <p className="text-xs text-rose-400">Expira en 5 minutos.</p>
            </div>
            
            <div className="flex justify-center">
              <input 
                value={code} 
                onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} // Solo números, max 6
                placeholder="000000"
                className="w-full max-w-[16rem] text-center text-3xl tracking-[0.5em] p-3 rounded bg-black/60 border border-emerald-500/50 text-white focus:outline-none focus:border-yellow-400 font-mono"
                required 
              />
            </div>

            {error && <p className="text-rose-400 text-sm text-center font-bold">{error}</p>}
            
            <button disabled={loading || code.length < 6} className="w-full py-3 bg-yellow-500 text-slate-900 font-bold rounded hover:bg-yellow-400 transition-colors disabled:opacity-50">
              {loading ? 'Verificando...' : 'Validar Código'}
            </button>
            
            <button type="button" onClick={() => setStep('REQUEST')} className="block w-full text-center text-sm text-white/40 hover:text-white mt-2">
              Volver atrás
            </button>
          </form>
        )}

        {/* --- PASO 3: NUEVA CONTRASEÑA --- */}
        {step === 'RESET' && (
          <form onSubmit={handleReset} className="space-y-4">
            <div className="text-center space-y-2 mb-6">
              <p className="text-4xl text-emerald-400">🔓</p>
              <p className="text-sm text-white/80">Código aceptado. Ingresa tu nueva credencial de seguridad.</p>
            </div>

            <div className="relative">
              <label className="text-xs uppercase tracking-wider text-white/60">Nueva Contraseña</label>
              <input 
                type={showPassword ? 'text' : 'password'}
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)} 
                required 
                className="w-full mt-1 p-3 rounded bg-black/40 border border-white/10 text-white focus:outline-none focus:border-emerald-500" 
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-xs text-white/50 hover:text-white">
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>

            <p className="text-[10px] text-white/40 leading-tight">
              Requisito: Mínimo 8 caracteres. Debe incluir mayúsculas, minúsculas, números y al menos uno de estos símbolos: @$!%*?&
            </p>

            {error && <p className="text-rose-400 text-sm font-bold border border-rose-500/30 p-2 rounded bg-rose-950/50">{error}</p>}
            
            <button disabled={loading} className="w-full mt-4 py-3 bg-emerald-600 text-white font-bold rounded hover:bg-emerald-500 transition-colors disabled:opacity-50">
              {loading ? 'Actualizando...' : 'Establecer Contraseña'}
            </button>
          </form>
        )}

        {/* --- PASO 4: ÉXITO --- */}
        {step === 'SUCCESS' && (
          <div className="text-center space-y-6 animate-in zoom-in duration-500">
            <div className="text-6xl text-emerald-400">✅</div>
            <div>
              <h3 className="text-xl font-bold text-white">Sistema Actualizado</h3>
              <p className="text-white/70 mt-2 text-sm">Tu contraseña ha sido restablecida con éxito. Ya puedes acceder al sistema.</p>
            </div>
            <Link to="/login" className="block w-full py-4 bg-yellow-500 text-slate-900 font-black rounded-lg hover:scale-105 transition-transform uppercase tracking-widest">
              Iniciar Sesión
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}