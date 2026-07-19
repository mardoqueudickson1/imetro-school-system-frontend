import React, { useState } from 'react';
import { LogIn, ShieldAlert, GraduationCap } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (user: any) => void;
  onBack?: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Quick Login Mock list matching database seed identities exactly
  const mockUsers = [
    { name: 'Estudante Teresa', email: 'teresa@imetro.ao', role: 'STUDENT' },
    { name: 'Estudante Ricardo', email: 'ricardo@imetro.ao', role: 'STUDENT' },
    { name: 'Professor Marcos', email: 'marcos@imetro.ao', role: 'TEACHER' },
    { name: 'Coordenação Geral', email: 'secretaria@imetro.ao', role: 'ADMIN' },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Preencha todos os campos.');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Falha ao autenticar');
      }

      onLoginSuccess(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro de conexão com o servidor NestJS.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (mockEmail: string) => {
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: mockEmail, password: 'password123' }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Falha ao autenticar');
      }

      onLoginSuccess(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 relative">
      {/* Structural Subtle Layout lines to look like a high-end blueprint/paper layout */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

      <div className="w-full max-w-5xl grid md:grid-cols-12 gap-12 items-center z-10">
        
        {/* Left Side: Elegant Academic Branding & Quick Access (Grid 7 cols) */}
        <div className="md:col-span-7 space-y-8 pr-4">
          <div className="space-y-4">
            <div
              className={`flex items-center space-x-4 ${onBack ? 'cursor-pointer group' : ''}`}
              onClick={onBack}
            >
              <div className="p-3 bg-blue-50 text-blue-900 border border-blue-950/20 rounded-sm group-hover:bg-blue-100 transition-colors">
                <GraduationCap size={36} className="stroke-[1.5]" />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 font-serif leading-none group-hover:text-blue-900 transition-colors">
                  IMETRO
                </h1>
                <p className="text-[11px] tracking-wider uppercase text-blue-800 font-semibold mt-1">
                  Instituto Metropolitano de Angola
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-extrabold text-slate-900 font-serif leading-tight">
              Portal de Engenharia &amp; <br />
              <span className="text-blue-800 underline decoration-2 decoration-blue-850 underline-offset-4">
                Sistemas Académicos
              </span>
            </h2>

            <p className="text-slate-650 leading-relaxed text-sm max-w-lg">
              Plataforma dedicada de acompanhamento letivo. Integra controle de presença por geolocalização (fórmula Haversine), emissão autenticada de certificados com assinatura SHA-256 e otimização automatizada de horários.
            </p>
          </div>

          {/* Quick Sign-In Buttons */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Acesso Rápido de Testes
            </p>
            <div className="grid grid-cols-2 gap-3 max-w-md">
              {mockUsers.map((mu) => (
                <button
                  key={mu.email}
                  disabled={loading}
                  onClick={() => handleQuickLogin(mu.email)}
                  className="flex flex-col items-start p-3 bg-white hover:bg-slate-100/80 border border-slate-200 hover:border-slate-400 rounded-sm transition text-left cursor-pointer group shadow-sm active:scale-[0.98]"
                >
                  <span className="text-xs font-bold text-slate-800 group-hover:text-blue-800 transition">
                    {mu.name}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5">{mu.role}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Elegant Structured Login Card (Grid 5 cols) */}
        <div className="md:col-span-5 bg-white border border-slate-200 rounded-sm p-8 shadow-md">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900 font-serif">Autenticação</h3>
            <p className="text-xs text-slate-500 mt-1">Introduza os seus dados para entrar na plataforma</p>
          </div>

          {errorMsg && (
            <div className="mb-5 flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-sm text-red-800 text-xs">
              <ShieldAlert className="shrink-0 text-red-750" size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Correio Electrónico
              </label>
              <input
                type="email"
                required
                className="w-full bg-slate-50 border border-slate-300 focus:border-blue-800 rounded-sm px-3 py-2.5 text-sm text-slate-950 placeholder-slate-400 outline-none transition"
                placeholder="exemplo@imetro.ao"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Palavra-passe
              </label>
              <input
                type="password"
                required
                value={password}
                className="w-full bg-slate-50 border border-slate-300 focus:border-blue-800 rounded-sm px-3 py-2.5 text-sm text-slate-950 placeholder-slate-400 outline-none transition"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-blue-900 text-white font-bold py-3 rounded-sm transition flex items-center justify-center space-x-2 text-sm cursor-pointer disabled:opacity-50 active:scale-[0.99] mt-6"
            >
              {loading ? (
                <span>Autenticando...</span>
              ) : (
                <>
                  <LogIn size={16} />
                  <span>Entrar no Sistema</span>
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
