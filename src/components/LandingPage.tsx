import React, { useEffect, useRef } from 'react';
import { LogIn, ShieldCheck } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (path: 'login' | 'verify') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const yearRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (yearRef.current) yearRef.current.textContent = String(new Date().getFullYear());
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col">

      {/* Nav */}
      <nav className="flex items-center justify-between px-10 py-5 border-b border-slate-100">
        <div className="flex items-baseline space-x-2.5">
          <span className="font-serif text-xl font-bold tracking-tight text-slate-900">IMETRO</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 hidden sm:inline">
            Instituto Superior Politécnico
          </span>
        </div>

        <div className="flex items-center space-x-6">
          <button
            onClick={() => onNavigate('verify')}
            className="text-xs text-slate-500 hover:text-slate-900 underline underline-offset-4 decoration-slate-300 hover:decoration-slate-700 transition-colors cursor-pointer"
          >
            Verificar documento
          </button>
          <button
            onClick={() => onNavigate('login')}
            className="text-xs bg-slate-900 text-white px-5 py-2 hover:bg-blue-700 transition-colors duration-300 cursor-pointer font-medium"
          >
            Entrar
          </button>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col justify-center px-10 pt-16 pb-12 max-w-5xl">

        <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400 mb-6">
          Sistema Académico — Luanda, Angola
        </p>

        <h1 className="font-serif text-[clamp(3.5rem,8vw,6.5rem)] font-bold leading-[0.95] text-slate-900 mb-8 max-w-3xl">
          O portal<br />
          <em className="not-italic text-blue-700">académico</em><br />
          do IMETRO.
        </h1>

        <p className="text-slate-500 text-base max-w-sm leading-relaxed mb-10">
          Um lugar onde docentes registam presenças, a secretaria emite certificados,
          e os horários encaixam sem conflitos. Simples assim.
        </p>

        <div className="flex flex-wrap items-center gap-6">
          <button
            onClick={() => onNavigate('login')}
            className="flex items-center space-x-2 bg-slate-900 text-white text-sm px-8 py-3.5 hover:bg-blue-700 transition-colors duration-300 cursor-pointer font-medium"
          >
            <LogIn size={15} />
            <span>Aceder ao sistema</span>
          </button>
          <button
            onClick={() => onNavigate('verify')}
            className="flex items-center space-x-2 text-sm text-slate-500 border-b border-slate-300 pb-0.5 hover:text-slate-900 hover:border-slate-800 transition-colors cursor-pointer"
          >
            <ShieldCheck size={13} />
            <span>Validar um documento</span>
          </button>
        </div>

        {/* Divider + features row */}
        <div className="border-t border-slate-100 mt-20 pt-8">
          <div className="flex flex-wrap gap-12 text-xs text-slate-400">
            <div>
              <p className="text-slate-800 font-semibold text-sm mb-0.5">Presenças</p>
              <p>Registo por QR Code e localização</p>
            </div>
            <div>
              <p className="text-slate-800 font-semibold text-sm mb-0.5">Certificados</p>
              <p>Assinatura SHA-256 verificável publicamente</p>
            </div>
            <div>
              <p className="text-slate-800 font-semibold text-sm mb-0.5">Horários</p>
              <p>Detecção automática de conflitos</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-10 py-5 border-t border-slate-100 flex items-center justify-between">
        <p className="text-[11px] text-slate-300">
          © <span ref={yearRef} /> IMETRO
        </p>
        <p className="text-[11px] text-slate-300 hidden sm:block">
          Secretaria: secretaria@imetro.ao
        </p>
      </footer>
    </div>
  );
};
