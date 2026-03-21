import { useState } from 'react';
import api from '../api';
import PasswordField from './passwordField';

type EditProfileModalProps = {
  user: { id: string; nombre: string; email?: string }; 
  onClose: () => void;
  // Callback para actualizar el nombre en Profile sin recargar la página
  onSuccess: (newName: string) => void; 
};

// Pasos del modal: perfil, confirmación de nombre, verificación de código, nueva pass
type Step = 'profile' | 'confirm-name' | 'verify' | 'new-password';

export default function EditProfileModal({ user, onClose, onSuccess }: EditProfileModalProps) {
  const [step, setStep] = useState<Step>('profile');
  const [tokens, setTokens] = useState({ resetToken: '', allowToken: '' });

  const [username, setUsername] = useState(user.nombre || '');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  
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
      // Usamos un endpoint directo para el nombre (ver nota abajo sobre el backend)
      await api('/auth/update-name-direct', {
        method: 'POST',
        body: { id_usuario: user.id, nuevo_nombre: username }
      });
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
      setSuccessMsg('Contraseña actualizada correctamente.');
      setTimeout(onClose, 2500);
    } catch (_err) {
      setError('La sesión expiró. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      {/* Contenedor con el verde de la Imagen 2/5/6 */}
      <div className="bg-[#064e3b] border-2 border-emerald-500/20 p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full max-w-md relative overflow-hidden">
        
        {/* Botón Cerrar Estilizado */}
        {!successMsg && (
          <button onClick={onClose} className="absolute right-6 top-6 text-white/40 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Cabecera con tipografía de Moni-Lab */}
        {!successMsg && (
          <h2 className="text-3xl font-black text-white mb-8 text-center tracking-tight drop-shadow-md">
            {step === 'profile' && 'Editar Perfil'}
            {step === 'confirm-name' && '¿Confirmar Cambio?'}
            {(step === 'verify' || step === 'new-password') && 'Cambiar Contraseña'}
          </h2>
        )}

        {successMsg ? (
          /* VISTA DE ÉXITO (Imagen 7) */
          <div className="py-6 text-center animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-[#4ade80] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
              <svg className="w-12 h-12 text-[#064e3b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-2xl text-white font-black leading-tight drop-shadow-sm">{successMsg}</p>
          </div>
        ) : (
          <>
            {/* VISTA PRINCIPAL */}
            {step === 'profile' && (
              <form onSubmit={handlePreUpdateName} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/60 font-black">Nombre de Usuario</label>
                  <input
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setError(''); }}
                    className="w-full p-4 rounded-xl bg-black/20 border border-white/10 text-white font-bold focus:border-emerald-400 outline-none transition-all"
                  />
                </div>
                
                <div className="text-center">
                  <button type="button" onClick={handleRequestCode} className="text-yellow-400 hover:text-yellow-200 text-sm font-black uppercase tracking-tighter transition-colors">
                    ¿Deseas cambiar tu contraseña?
                  </button>
                </div>

                {error && <p className="text-xs text-rose-400 font-bold text-center bg-rose-400/10 py-2 rounded-lg border border-rose-400/20">{error}</p>}
                
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={onClose} className="w-full py-4 rounded-xl bg-emerald-900/40 text-white font-black uppercase tracking-widest hover:bg-emerald-900/60 transition-all">Cancelar</button>
                  <button type="submit" className="w-full py-4 rounded-xl bg-[#ffb100] text-[#064e3b] font-black uppercase tracking-widest hover:bg-yellow-400 hover:scale-[1.02] active:scale-95 transition-all shadow-lg">Guardar Nombre</button>
                </div>
              </form>
            )}

            {/* CONFIRMACIÓN DE NOMBRE (Imagen 1 corregida) */}
            {step === 'confirm-name' && (
              <div className="space-y-6 text-center animate-in fade-in zoom-in-95">
                <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                  <p className="text-white/80 text-sm uppercase font-bold mb-2">Vas a cambiar a:</p>
                  <p className="text-3xl text-yellow-400 font-black tracking-tight">"{username}"</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep('profile')} className="w-full py-4 rounded-xl bg-white/10 text-white font-black uppercase tracking-widest hover:bg-white/20">Volver</button>
                  <button onClick={handleConfirmNameUpdate} disabled={loading} className="w-full py-4 rounded-xl bg-[#ffb100] text-[#064e3b] font-black uppercase tracking-widest hover:bg-yellow-400 hover:scale-[1.02] transition-all shadow-lg">
                    {loading ? 'Cambiando...' : '¡Sí, Confirmar!'}
                  </button>
                </div>
              </div>
            )}

            {/* VERIFICACIÓN (Paso 2) */}
            {step === 'verify' && (
              <form onSubmit={handleVerifyCode} className="space-y-6 animate-in slide-in-from-right-4">
                <div className="text-center">
                   <p className="text-white font-bold">Código enviado a:</p>
                   <p className="text-emerald-300 text-sm">{user.email}</p>
                </div>
                <input
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="w-full text-center text-4xl tracking-[0.5em] p-5 rounded-2xl bg-black/30 border-2 border-emerald-500/30 text-white font-mono outline-none focus:border-emerald-400"
                />
                {error && <p className="text-xs text-rose-400 text-center font-bold">{error}</p>}
                <button type="submit" disabled={loading} className="w-full py-4 bg-[#4ade80] text-[#064e3b] rounded-xl font-black uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-lg">
                  {loading ? 'Verificando...' : 'Verificar Código'}
                </button>
              </form>
            )}

            {/* NUEVA PASS (Paso 3) */}
            {step === 'new-password' && (
              <form onSubmit={handleResetPassword} className="space-y-6 animate-in slide-in-from-right-4">
                <div className="flex justify-center mb-2">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-3xl">🔐</div>
                </div>
                
                <div className="space-y-4">
                  <PasswordField 
                    label="Nueva Contraseña"
                    value={password}
                    onChange={setPassword}
                    hint="Mínimo 8 caracteres, números y símbolos."
                  />
                  <PasswordField 
                    label="Confirmar Contraseña"
                    value={confirm}
                    onChange={setConfirm}
                  />
                </div>

                {error && <p className="text-xs text-rose-400 bg-rose-400/10 p-3 rounded-lg border border-rose-400/20 text-center font-bold">{error}</p>}

                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full py-4 bg-[#ffb100] text-[#064e3b] rounded-xl font-black uppercase tracking-widest hover:bg-yellow-400 hover:scale-[1.02] transition-all shadow-lg"
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