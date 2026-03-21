import { useState } from 'react';
import api from '../api';

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
  
  const [showPwd, setShowPwd] = useState(false);
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
      // Error 400 Fix: Aseguramos que 'nombre' y 'email' existan y coincidan con el backend
      const res = await api('/auth/forgot-password', {
        method: 'POST',
        body: { 
          email: user.email, 
          nombre: user.nombre // El backend usa "nombre" en el SELECT
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
      setTimeout(onClose, 2000);
    } catch (_err) {
      setError('La sesión expiró. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-emerald-800 border border-white/10 p-6 rounded-2xl shadow-2xl w-full max-w-md relative">
        
        {/* Cabecera dinámica */}
        <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
          <h3 className="text-2xl font-bold text-white">
            {step === 'profile' && 'Editar Perfil'}
            {step === 'confirm-name' && '¿Estás seguro?'}
            {(step === 'verify' || step === 'new-password') && 'Cambiar Contraseña'}
          </h3>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">✕</button>
        </div>

        {successMsg ? (
          <div className="py-10 text-center animate-in zoom-in">
            <div className="text-5xl mb-4">✅</div>
            <p className="text-xl text-white font-bold">{successMsg}</p>
          </div>
        ) : (
          <>
            {/* VISTA PRINCIPAL */}
            {step === 'profile' && (
              <form onSubmit={handlePreUpdateName} className="space-y-6">
                <div>
                  <label className="text-sm text-white/80">Nombre de Usuario</label>
                  <input
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setError(''); }}
                    className="w-full mt-1 p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-emerald-300 outline-none"
                  />
                </div>
                <div className="pt-2 text-center border-t border-white/5">
                  <button type="button" onClick={handleRequestCode} className="text-yellow-300 hover:text-yellow-100 text-sm font-semibold transition-colors">
                    ¿Deseas cambiar tu contraseña?
                  </button>
                </div>
                {error && <p className="text-sm text-rose-400 font-medium">{error}</p>}
                <div className="flex gap-3">
                  <button type="button" onClick={onClose} className="w-full py-3 rounded-lg bg-white/10 text-white font-bold">Cancelar</button>
                  <button type="submit" className="w-full py-3 rounded-lg bg-amber-400 text-slate-900 font-bold hover:scale-105 transition-transform">Guardar Nombre</button>
                </div>
              </form>
            )}

            {/* CONFIRMACIÓN DE NOMBRE (REEMPLAZA WINDOW.CONFIRM) */}
            {step === 'confirm-name' && (
              <div className="space-y-6 text-center animate-in fade-in">
                <p className="text-white text-lg">
                  Tu nombre cambiará de <span className="text-yellow-300 font-bold">"{user.nombre}"</span> a <span className="text-emerald-300 font-bold">"{username}"</span>.
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setStep('profile')} className="w-full py-3 rounded-lg bg-white/10 text-white font-bold">Volver</button>
                  <button onClick={handleConfirmNameUpdate} disabled={loading} className="w-full py-3 rounded-lg bg-amber-400 text-slate-900 font-bold hover:scale-105 transition-transform">
                    {loading ? 'Cambiando...' : 'Confirmar'}
                  </button>
                </div>
              </div>
            )}

            {/* VERIFICACIÓN (Paso 2) */}
            {step === 'verify' && (
              <form onSubmit={handleVerifyCode} className="space-y-6 animate-in slide-in-from-right-4">
                <p className="text-white/80 text-center">Código enviado a {user.email}</p>
                <input
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="w-full text-center text-3xl tracking-widest p-3 rounded bg-black/40 border border-emerald-500/50 text-white font-mono outline-none"
                />
                {error && <p className="text-sm text-rose-400 text-center">{error}</p>}
                <button type="submit" disabled={loading} className="w-full py-3 bg-emerald-500 text-white rounded-lg font-bold">
                  {loading ? 'Verificando...' : 'Verificar Código'}
                </button>
              </form>
            )}

            {/* NUEVA PASS (Paso 3) */}
            {step === 'new-password' && (
              <form onSubmit={handleResetPassword} className="space-y-4 animate-in slide-in-from-right-4">
                <input type={showPwd ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white" placeholder="Nueva Contraseña" />
                <input type={showPwd ? 'text' : 'password'} value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white" placeholder="Confirmar" />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="text-xs text-white/50">{showPwd ? 'Ocultar' : 'Mostrar'}</button>
                {error && <p className="text-sm text-rose-400">{error}</p>}
                <button type="submit" disabled={loading} className="w-full py-3 bg-yellow-400 text-slate-900 rounded-lg font-bold">Guardar Contraseña</button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}