import { useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

type EditProfileModalProps = {
  user: { id: string; nombre: string; email?: string }; 
  onClose: () => void;
  // Callback para actualizar el nombre en Profile sin recargar la página
  onSuccess: (newName: string) => void; 
};

// Pasos del modal: perfil, confirmación de nombre, verificación de código, nueva pass
type Step = 'profile' | 'confirm-name' | 'verify' | 'new-password';

export default function EditProfileModal({ user, onClose, onSuccess }: EditProfileModalProps) {
  
  const { updateUserData } = useAuth();

  const [step, setStep] = useState<Step>('profile');
  const [tokens, setTokens] = useState({ resetToken: '', allowToken: '' });

  const [username, setUsername] = useState(user.nombre || '');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // --- LÓGICA DE NOMBRE (DIRECTA SIN CORREO) ---
  
  const handlePreUpdateName = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.length < 3) return setError('Mínimo 3 caracteres.');
    if (username === user.nombre) return onClose(); // No hubo cambios
    setStep('confirm-name');
  };

  const handleConfirmNameUpdate = async () => {
    setLoading(true);
    setError('');
    try {
      await api('/auth/update-name-direct', {
        method: 'POST',
        body: { id_usuario: user.id, nuevo_nombre: username }
      });

      updateUserData({ nombre: username }); // Actualizamos el contexto para reflejar el cambio en el Navbar

      setSuccessMsg(`¡Nombre actualizado a "${username}"!`);
      onSuccess(username);
      setTimeout(onClose, 1500);
    } catch (_err) {
      setError('Error al actualizar el nombre.');
    } finally {
      setLoading(false);
    }
  };

  // --- LÓGICA DE CONTRASEÑA (3 PASOS CON CÓDIGO) ---

  const handleRequestCode = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api('/auth/forgot-password', {
        method: 'POST',
        body: { 
          email: user.email, 
          nombre: user.nombre
        }
      });
      setTokens(prev => ({ ...prev, resetToken: res.token }));
      setStep('verify');
    } catch (_err) {
      setError('No pudimos enviar el código. Verifica que tus datos sean correctos.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api('/auth/verify-reset-code', {
        method: 'POST',
        body: { token: tokens.resetToken, code: verificationCode }
      });
      setTokens(prev => ({ ...prev, allowToken: res.allowToken }));
      setStep('new-password');
    } catch (_err) {
      setError('Código incorrecto o expirado.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return setError('Las contraseñas no coinciden.');

    setLoading(true);
    setError('');
    try {
      await api('/auth/reset-password', {
        method: 'POST',
        body: { allowToken: tokens.allowToken, newPassword: password }
      });
      setSuccessMsg('Contraseña actualizada. Volviendo al perfil...');
      setTimeout(onClose, 2500);
    } catch (_err) {
      setError('La sesión expiró. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-emerald-800 border-2 border-emerald-500/30 p-8 rounded-2xl shadow-xl w-full max-w-md relative overflow-hidden">
        
        {!successMsg && (
          <button onClick={onClose} className="absolute right-6 top-6 text-white/40 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {!successMsg && (
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            {step === 'profile' && 'Editar Perfil'}
            {step === 'confirm-name' && '¿Confirmar Cambio?'}
            {(step === 'verify' || step === 'new-password') && 'Cambiar Contraseña'}
          </h2>
        )}

        {successMsg ? (
          <div className="py-6 text-center animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg text-white font-bold">{successMsg}</p>
          </div>
        ) : (
          <>
            {step === 'profile' && (
              <form onSubmit={handlePreUpdateName} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/60 font-bold">Nombre de Usuario</label>
                  <input
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setError(''); }}
                    className="w-full p-3 rounded-lg bg-white/5 border border-white/6 focus:outline-none focus:ring-2 focus:ring-emerald-300 text-white font-bold"
                  />
                </div>
                
                <div className="text-center">
                  <button type="button" onClick={handleRequestCode} className="text-yellow-400 hover:text-yellow-200 text-sm font-bold transition-colors">
                    ¿Deseas cambiar tu contraseña?
                  </button>
                </div>

                {error && <p className="text-xs text-rose-400 font-bold text-center bg-rose-400/10 py-2 rounded-lg border border-rose-400/20">{error}</p>}
                
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={onClose} className="w-full py-3 rounded-lg bg-emerald-900/40 text-white font-bold hover:bg-emerald-900/60 transition-all">Cancelar</button>
                  <button type="submit" className="w-full py-3 rounded-lg bg-amber-400 text-slate-900 font-bold hover:bg-amber-500 hover:scale-[1.02] transition-all shadow-lg">Guardar Nombre</button>
                </div>
              </form>
            )}

            {step === 'confirm-name' && (
              <div className="space-y-6 text-center animate-in fade-in zoom-in-95">
                <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                  <p className="text-white/60 text-xs uppercase tracking-widest font-bold mb-2">Vas a cambiar a:</p>
                  <p className="text-2xl text-yellow-400 font-bold">"{username}"</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep('profile')} className="w-full py-3 rounded-lg bg-emerald-900/40 text-white font-bold hover:bg-emerald-900/60 transition-all">Volver</button>
                  <button onClick={handleConfirmNameUpdate} disabled={loading} className="w-full py-3 rounded-lg bg-amber-400 text-slate-900 font-bold hover:bg-amber-500 hover:scale-[1.02] transition-all shadow-lg">
                    {loading ? 'Cambiando...' : '¡Sí, Confirmar!'}
                  </button>
                </div>
              </div>
            )}

            {step === 'verify' && (
              <form onSubmit={handleVerifyCode} className="space-y-6 animate-in slide-in-from-right-4">
                <div className="text-center">
                   <p className="text-white font-bold text-sm mb-1">Código enviado a:</p>
                   <p className="text-yellow-300 text-xs">{user.email}</p>
                </div>
                <input
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="w-full text-center text-3xl tracking-[0.5em] p-4 rounded-lg bg-white/5 border-2 border-emerald-500/30 text-white font-mono outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300"
                />
                {error && <p className="text-xs text-rose-400 text-center font-bold">{error}</p>}
                <button type="submit" disabled={loading} className="w-full py-3 bg-emerald-500 text-white rounded-lg font-bold hover:bg-emerald-400 transition-all shadow-lg">
                  {loading ? 'Verificando...' : 'Verificar Código'}
                </button>
              </form>
            )}

            {step === 'new-password' && (
              <form onSubmit={handleResetPassword} className="space-y-6 animate-in slide-in-from-right-4">
                <div className="flex justify-center mb-2">
                  <div className="w-14 h-14 bg-yellow-300 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 text-emerald-900">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-white/60 font-semibold">Nueva Contraseña</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full p-3 rounded-lg bg-white/5 border border-white/6 focus:outline-none focus:ring-2 focus:ring-emerald-300 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-white/60 font-semibold">
                      Confirmar Contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full mt-1 p-3 rounded-lg bg-white/5 border border-white/6 focus:outline-none focus:ring-2 focus:ring-emerald-300 text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-2 text-sm text-white/70"
                      >
                        {showPassword ? 'Ocultar' : 'Mostrar'}
                      </button>
                    </div>
                  </div>

                  <p className="text-[10px] text-white/40 leading-tight italic pt-1">
                    Mínimo 8 caracteres, números y símbolos.
                  </p>
                </div>

                {error && <p className="text-xs text-rose-400 bg-rose-400/10 p-3 rounded-lg border border-rose-400/20 text-center font-bold">{error}</p>}

                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full py-3 bg-amber-400 text-slate-900 rounded-lg font-bold hover:bg-amber-500 hover:scale-[1.02] transition-all shadow-lg"
                >
                  {loading ? 'Actualizando...' : 'Confirmar Cambio'}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}