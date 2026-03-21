import { useState } from 'react';

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
}

export default function PasswordField({ label, value, onChange, placeholder = "••••••••", hint }: PasswordFieldProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <label className="text-xs uppercase tracking-wider text-white/60 font-semibold">{label}</label>
      </div>
      
      <div className="relative group">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required
          className="w-full p-3 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-tighter text-white/40 hover:text-emerald-400 transition-colors"
        >
          {show ? 'Ocultar' : 'Mostrar'}
        </button>
      </div>
      
      {hint && (
        <p className="text-[10px] text-white/40 leading-tight italic pt-1">
          {hint}
        </p>
      )}
    </div>
  );
}