import React from 'react';
import {
  GraduationCap,
  LogIn,
  ShieldCheck,
  CalendarDays,
  ClipboardList,
  FileText,
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (path: 'login' | 'verify') => void;
}

const Feature: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="flex space-x-4 items-start">
    <div className="w-10 h-10 rounded-sm bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-white text-sm font-semibold">{title}</p>
      <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{desc}</p>
    </div>
  </div>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Topbar */}
      <header className="border-b border-slate-800 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center">
            <GraduationCap size={16} className="text-white" />
          </div>
          <div>
            <p className="text-white font-serif font-semibold text-lg leading-none">IMETRO</p>
            <p className="text-slate-500 text-[10px] uppercase tracking-widest">Portal Académico</p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('login')}
          className="flex items-center space-x-2 text-slate-400 hover:text-white text-xs border border-slate-700 hover:border-slate-500 px-4 py-2 rounded-sm transition-colors cursor-pointer"
        >
          <LogIn size={13} />
          <span>Entrar no Sistema</span>
        </button>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center py-20">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 bg-blue-950 border border-blue-800 text-blue-300 text-[11px] uppercase tracking-widest px-4 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          <span>Sistema Académico Digital</span>
        </div>

        {/* Headline */}
        <h1 className="text-white font-serif text-5xl font-bold max-w-2xl leading-tight mb-4">
          Portal Académico<br />
          <span className="text-blue-400">IMETRO</span>
        </h1>
        <p className="text-slate-400 text-base max-w-md leading-relaxed mb-12">
          Gestão inteligente de presenças, emissão de certificados com assinatura digital e optimização automática de grades horárias.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <button
            onClick={() => onNavigate('login')}
            className="flex items-center justify-center space-x-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-sm transition-colors text-sm cursor-pointer"
          >
            <LogIn size={16} />
            <span>Aceder ao Sistema</span>
          </button>
          <button
            onClick={() => onNavigate('verify')}
            className="flex items-center justify-center space-x-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold px-8 py-3.5 rounded-sm transition-colors text-sm cursor-pointer"
          >
            <ShieldCheck size={16} />
            <span>Validar Documento</span>
          </button>
        </div>

        {/* Features grid */}
        <div className="grid sm:grid-cols-3 gap-8 max-w-3xl w-full text-left">
          <Feature
            icon={<ClipboardList size={18} className="text-blue-400" />}
            title="Presenças Inteligentes"
            desc="Registo por geolocalização e QR Code com detecção automática de fraude."
          />
          <Feature
            icon={<FileText size={18} className="text-blue-400" />}
            title="Documentos Verificáveis"
            desc="Diplomas e certificados com assinatura SHA-256 e código de verificação público."
          />
          <Feature
            icon={<CalendarDays size={18} className="text-blue-400" />}
            title="Grades Horárias"
            desc="Agendamento de aulas com detecção e resolução automática de conflitos."
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-5 text-center">
        <p className="text-slate-600 text-xs">
          © {new Date().getFullYear()} IMETRO — Instituto Superior de Tecnologias de Informação e Comunicação
        </p>
      </footer>
    </div>
  );
};
