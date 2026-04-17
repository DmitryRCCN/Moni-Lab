import { useLocation, Navigate, Link } from 'react-router-dom';

type LocationState = {
  email?: string;
};

export default function ConfirmEmail() {
  const location = useLocation();
  const state = location.state as LocationState | null;
  const email = state?.email;

  if (!email) {
    return <Navigate to="/register" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-emerald-800 p-8 rounded-2xl shadow-xl border border-white/6">
        {/* Email Icon */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-yellow-300 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-8 h-8 text-emerald-900"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25H4.5a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5H4.5A2.25 2.25 0 0 0 2.25 6.75m19.5 0v-1.5a2.25 2.25 0 0 0-2.25-2.25H4.5a2.25 2.25 0 0 0-2.25 2.25v1.5m19.5 0v10.5a2.25 2.25 0 0 1-2.25 2.25H4.5a2.25 2.25 0 0 1-2.25-2.25V6.75"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold">¡Verifica tu Correo!</h1>
            <p className="text-sm text-white/80">
              Confirma tu registro por email
            </p>
          </div>
        </div>

        {/* Email Display */}
        <div className="bg-white/5 border border-white/6 rounded-lg p-4 mb-6">
          <p className="text-xs text-white/60 uppercase tracking-widest mb-1">Enviado a:</p>
          <p className="font-mono text-yellow-300 break-all text-sm">{email}</p>
        </div>

        {/* Instructions */}
        <div className="bg-emerald-900/40 border border-emerald-600/30 rounded-lg p-4 mb-6 text-sm">
          <h3 className="font-semibold mb-2 text-white">Próximos pasos:</h3>
          <ol className="space-y-1 text-white/80">
            <li>1. Revisa tu bandeja de entrada</li>
            <li>2. Haz clic en el enlace de confirmación</li>
            <li>3. ¡Listo! Tendrás acceso a Moni-Lab</li>
          </ol>
        </div>

        {/* Warning */}
        <div className="bg-amber-900/20 border border-amber-600/30 rounded-lg p-3 mb-6 text-xs">
          <p className="text-amber-100">
            <strong>El enlace expirará en 15 minutos.</strong> Revisa tu carpeta de spam si no lo ves.
          </p>
        </div>

        {/* Button */}
        <Link
          to="/register"
          className="block w-full py-3 rounded-lg bg-amber-400 text-slate-900 hover:scale-105 transition-transform font-bold text-center mb-3"
        >
          Volver al Registro
        </Link>

        <p className="text-xs text-white/60 text-center">
          ¿No recibiste el correo? Intenta registrarte de nuevo.
        </p>
      </div>
    </div>
  );
}
