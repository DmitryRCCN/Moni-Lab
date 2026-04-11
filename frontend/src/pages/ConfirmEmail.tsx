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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="w-full max-w-md">
        <div className="bg-emerald-800 p-8 rounded-2xl shadow-xl border border-white/6 text-center">
          {/* Icono de correo */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-emerald-700 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-10 h-10 text-yellow-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25H4.5a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5H4.5A2.25 2.25 0 0 0 2.25 6.75m19.5 0v-1.5a2.25 2.25 0 0 0-2.25-2.25H4.5a2.25 2.25 0 0 0-2.25 2.25v1.5m19.5 0v10.5a2.25 2.25 0 0 1-2.25 2.25H4.5a2.25 2.25 0 0 1-2.25-2.25V6.75"
                />
              </svg>
            </div>
          </div>

          {/* Título */}
          <h1 className="text-2xl font-bold mb-3">¡Verifica tu Correo!</h1>

          {/* Descripción */}
          <p className="text-white/80 mb-6">
            Hemos enviado un enlace de confirmación a:
          </p>

          {/* Email */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-8">
            <p className="font-mono text-yellow-300 break-all">{email}</p>
          </div>

          {/* Instrucciones */}
          <div className="bg-emerald-900/40 border border-emerald-600/30 rounded-lg p-4 mb-8 text-left">
            <h3 className="font-semibold mb-3 text-white">Pasos por seguir:</h3>
            <ol className="space-y-2 text-sm text-white/80">
              <li className="flex gap-2">
                <span className="font-bold text-yellow-300 flex-shrink-0">1.</span>
                <span>Revisa tu bandeja de entrada</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-yellow-300 flex-shrink-0">2.</span>
                <span>Haz clic en el botón "Confirmar mi Registro"</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-yellow-300 flex-shrink-0">3.</span>
                <span>¡Listo! Podrás acceder a Moni-Lab</span>
              </li>
            </ol>
          </div>

          {/* Nota importante */}
          <div className="bg-amber-900/20 border border-amber-600/30 rounded-lg p-4 mb-8">
            <p className="text-sm text-amber-100">
              ⏱️ <strong>El enlace expirará en 15 minutos.</strong>
              <br />
              Si no lo ves, revisa tu carpeta de spam.
            </p>
          </div>

          {/* Botón volver */}
          <Link
            to="/register"
            className="inline-block w-full py-3 rounded-lg bg-amber-400 text-slate-900 hover:scale-105 transition-transform font-bold mb-4"
          >
            ← Volver al Registro
          </Link>

          <p className="text-xs text-white/60">
            ¿No recibiste el correo?
            <br />
            Intenta registrarte de nuevo o revisa tu carpeta de spam.
          </p>
        </div>
      </div>
    </div>
  );
}
