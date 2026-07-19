import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldX, Search, ExternalLink, Hash, GraduationCap, Loader2 } from 'lucide-react';

interface VerificationResult {
  isValid: boolean;
  message: string;
  document?: {
    id: number;
    docType: string;
    verificationCode: string;
    fileHash: string;
    createdAt: string;
    isAuthentic: boolean;
    studentName: string;
    studentEmail: string;
  };
}

const DOC_TYPE_LABELS: Record<string, string> = {
  DIPLOMA: 'Diploma de Licenciatura',
  CERTIFICATE: 'Certificado de Conclusão',
  TRANSCRIPT: 'Histórico Académico',
};

export const DocumentVerifyPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState('');

  // Pre-fill from URL query param: /verify?code=IM-1234-5678
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) setInput(code);
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setResult(null);
    setError('');

    try {
      const res = await fetch(
        `http://localhost:3001/documents/verify/${encodeURIComponent(input.trim())}`,
      );
      const data: VerificationResult = await res.json();
      setResult(data);
    } catch {
      setError('Não foi possível conectar ao servidor IMETRO. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-sm flex items-center justify-center">
            <GraduationCap size={16} className="text-white" />
          </div>
          <div>
            <p className="text-white font-serif font-semibold text-lg tracking-wide leading-none">IMETRO</p>
            <p className="text-slate-500 text-[10px] uppercase tracking-widest">Portal Académico</p>
          </div>
        </div>
        <a
          href="/"
          className="text-slate-400 hover:text-white text-xs flex items-center space-x-1.5 transition-colors"
        >
          <ExternalLink size={12} />
          <span>Entrar no Sistema</span>
        </a>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-xl">
          {/* Title */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-slate-700 bg-slate-900 mb-5">
              <ShieldCheck size={24} className="text-blue-400" />
            </div>
            <h1 className="text-white font-serif text-3xl font-semibold">Validação de Documentos</h1>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed max-w-sm mx-auto">
              Insira o código de verificação ou o hash SHA-256 do documento emitido pelo IMETRO para confirmar a sua autenticidade.
            </p>
          </div>

          {/* Search form */}
          <form onSubmit={handleVerify} className="space-y-3">
            <div className="relative">
              <Hash size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ex: IM-1092-8827 ou hash SHA-256..."
                className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 text-white placeholder-slate-600 rounded-sm pl-10 pr-4 py-3.5 text-sm outline-none transition-colors font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-semibold py-3.5 rounded-sm transition-colors text-sm flex items-center justify-center space-x-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>A verificar...</span>
                </>
              ) : (
                <>
                  <Search size={16} />
                  <span>Verificar Documento</span>
                </>
              )}
            </button>
          </form>

          {/* Error */}
          {error && (
            <div className="mt-6 p-4 bg-red-950 border border-red-800 rounded-sm text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Result */}
          {result && (
            <div className={`mt-6 rounded-sm border ${result.isValid ? 'bg-emerald-950 border-emerald-800' : 'bg-red-950 border-red-800'}`}>
              {/* Status banner */}
              <div className={`flex items-center space-x-3 px-5 py-4 border-b ${result.isValid ? 'border-emerald-800' : 'border-red-800'}`}>
                {result.isValid ? (
                  <ShieldCheck size={20} className="text-emerald-400 shrink-0" />
                ) : (
                  <ShieldX size={20} className="text-red-400 shrink-0" />
                )}
                <div>
                  <p className={`font-semibold text-sm ${result.isValid ? 'text-emerald-300' : 'text-red-300'}`}>
                    {result.isValid ? 'Documento AUTÊNTICO' : 'Documento NÃO encontrado'}
                  </p>
                  <p className={`text-xs mt-0.5 ${result.isValid ? 'text-emerald-500' : 'text-red-500'}`}>
                    {result.message}
                  </p>
                </div>
              </div>

              {/* Document details */}
              {result.isValid && result.document && (
                <div className="px-5 py-5 space-y-3">
                  <Row label="Estudante" value={result.document.studentName} />
                  <Row label="Email" value={result.document.studentEmail} />
                  <Row label="Tipo de Documento" value={DOC_TYPE_LABELS[result.document.docType] || result.document.docType} />
                  <Row label="Código de Verificação" value={result.document.verificationCode} mono />
                  <Row label="Hash SHA-256" value={`${result.document.fileHash.substring(0, 32)}...`} mono />
                  <Row label="Data de Emissão" value={new Date(result.document.createdAt).toLocaleDateString('pt-AO', { day: '2-digit', month: 'long', year: 'numeric' })} />
                  <div className="pt-2 flex items-center space-x-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">Registado no arquivo oficial IMETRO</p>
                  </div>
                </div>
              )}
            </div>
          )}
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

// Helper row component
const Row: React.FC<{ label: string; value: string; mono?: boolean }> = ({ label, value, mono }) => (
  <div className="flex items-start justify-between gap-4">
    <span className="text-emerald-600 text-xs uppercase tracking-wider shrink-0">{label}</span>
    <span className={`text-emerald-200 text-xs text-right break-all ${mono ? 'font-mono' : ''}`}>{value}</span>
  </div>
);
