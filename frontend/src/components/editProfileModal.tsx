import { useState, useCallback } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

type EditProfileModalProps = {
  user: { id: string; nombre: string };
  onClose: () => void;
  // Callback para actualizar el nombre en Profile sin recargar la página
  onSuccess: (newName: string) => void; 
};

export default function EditProfileModal({ user, onClose, onSuccess }: EditProfileModalProps) {
  const { updateUserData } = useAuth();
  
  const [username, setUsername] = useState(user.nombre || '');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const validate = useCallback(() => {
    if (username.length < 3) return 'El usuario debe tener al menos 3 caracteres';

    // Si el usuario escribió algo en la contraseña, la validamos
    if (password) {
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
      if (!regex.test(password)) {
        return 'La contraseña debe tener 8 caracteres con mayúsculas, minúsculas, números y símbolos';
      }
      if (password !== confirm) {
        return 'Las contraseñas no coinciden';
      }
    }
    return '';
  }, [username, password, confirm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setError('');
    setLoading(true);

    try {
      const bodyPayload = { 
        id_usuario: user.id, 
        nuevo_nombre: username, 
        nueva_password: password || undefined 
      };

      // 1. Enviamos la SOLICITUD de cambio
      await api('/auth/request-profile-update', {
        method: 'POST',
        body: bodyPayload,
      });

      // 2. Avisamos al usuario
      setSuccessMsg('Te enviamos un correo. Por favor, confirma los cambios para que se apliquen.');
      
    } catch (err) {
      setError('No pudimos procesar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-emerald-800 border border-white/10 p-6 rounded-2xl shadow-2xl w-full max-w-md relative">
        
        <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
          <h3 className="text-2xl font-bold text-white">Editar Perfil</h3>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
            ✕
          </button>
        </div>

        {successMsg ? (
          <div className="py-10 text-center animate-in zoom-in">
            <div className="text-5xl mb-4">✅</div>
            <p className="text-xl text-white font-bold">{successMsg}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-white/80">Nombre de Usuario</label>
              <input
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError('');
                }}                
                placeholder="Tu nuevo nombre será..."
                className="w-full mt-1 p-3 rounded-lg bg-white/5 border border-white/6 focus:outline-none focus:ring-2 focus:ring-emerald-300 text-white"
              />
            </div>

            <div className="pt-4 border-t border-white/10">
              <p className="text-xs text-yellow-300 mb-3">Déjalo en blanco si no deseas cambiar tu contraseña.</p>
              
              <label className="text-sm text-white/80">Nueva Contraseña</label>
              <div className="relative mb-4">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full mt-1 p-3 rounded-lg bg-white/5 border border-white/6 focus:outline-none focus:ring-2 focus:ring-emerald-300 text-white"
                />
              </div>

              {password && (
                <div>
                  <label className="text-sm text-white/80">Confirmar Contraseña</label>
                  <div className="relative">
                    <input
                      type={showPwd ? 'text' : 'password'}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="••••••••"
                      className="w-full mt-1 p-3 rounded-lg bg-white/5 border border-white/6 focus:outline-none focus:ring-2 focus:ring-emerald-300 text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-3 top-4 text-sm text-white/70 hover:text-white"
                    >
                      {showPwd ? 'Ocultar' : 'Mostrar'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {error && <p className="text-sm text-rose-400 font-medium">{error}</p>}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors font-bold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-amber-400 text-slate-900 hover:scale-105 transition-transform font-bold disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}