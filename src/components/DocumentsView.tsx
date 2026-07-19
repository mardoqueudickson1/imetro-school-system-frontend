import React, { useState, useEffect } from 'react';
import { 
  FileCheck, 
  Award, 
  Search, 
  CheckCircle2, 
  XOctagon, 
  UserCheck2, 
  Fingerprint, 
  Sparkles,
  Printer
} from 'lucide-react';

interface DocumentsViewProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  };
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({ user }) => {
  // Issuance States (Admin)
  const [studentId, setStudentId] = useState<number | ''>('');
  const [docType, setDocType] = useState('DIPLOMA');
  const [loadingIssue, setLoadingIssue] = useState(false);
  const [issuedDoc, setIssuedDoc] = useState<any | null>(null);

  // Verification States (Public)
  const [queryCode, setQueryCode] = useState('');
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [verifyReport, setVerifyReport] = useState<any | null>(null);

  // Dynamic Student List from backend
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch('http://localhost:3001/scheduler/students');
        if (res.ok) {
          const data = await res.json();
          setStudents(data);
        }
      } catch (err) {
        console.error('Error fetching students:', err);
      }
    };
    fetchStudents();
  }, []);

  const handleIssueDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !docType) return;

    setLoadingIssue(true);
    setIssuedDoc(null);

    try {
      const res = await fetch('http://localhost:3001/documents/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: Number(studentId),
          docType,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || 'Falha ao emitir documento');
      } else {
        setIssuedDoc(data);
      }
    } catch (err) {
      alert('Erro de conexão ao servidor.');
    } finally {
      setLoadingIssue(false);
    }
  };

  const handleVerifyDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryCode) return;

    setLoadingVerify(true);
    setVerifyReport(null);

    try {
      const res = await fetch(`http://localhost:3001/documents/verify/${queryCode.trim()}`);
      if (res.ok) {
        const data = await res.json();
        setVerifyReport(data);
      }
    } catch (err) {
      alert('Erro de conexão ao servidor validador.');
    } finally {
      setLoadingVerify(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-800">
      <div className="border-b border-slate-200 pb-4 mb-4">
        <h2 className="text-2xl font-black text-slate-900 font-serif flex items-center space-x-2">
          <FileCheck className="text-blue-900 stroke-[1.5]" size={24} />
          <span>Validador de Documentos &amp; Certificados Académicos</span>
        </h2>
        <p className="text-sm text-slate-500">
          Registo de integridade e autenticidade suportado por assinaturas SHA-256 e código de verificação pública.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Verification Portal (Publicly Available) */}
        <div className="bg-white border border-slate-200 rounded-sm p-6 space-y-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 font-serif flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Search className="text-blue-900" size={20} />
            <span>Verificação Pública Geral</span>
          </h3>

          <form onSubmit={handleVerifyDoc} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Código Verificador ou Assinatura Hash (SHA-256)
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  required
                  placeholder="Ex: IM-1092-8827 ou Hash completo"
                  value={queryCode}
                  onChange={(e) => setQueryCode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-blue-900 rounded-sm px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition"
                />
                <button
                  type="submit"
                  disabled={loadingVerify}
                  className="bg-slate-900 hover:bg-blue-900 text-white font-bold px-6 rounded-sm transition text-sm cursor-pointer disabled:opacity-50 flex items-center justify-center shrink-0"
                >
                  {loadingVerify ? 'Verificando...' : 'Verificar'}
                </button>
              </div>
            </div>
          </form>

          {/* Verification reports */}
          {verifyReport && (
            <div className={`p-5 rounded-sm border ${
              verifyReport.isValid
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-red-50 border-red-300 text-red-900'
            }`}>
              <div className="flex items-start space-x-3">
                {verifyReport.isValid ? (
                  <CheckCircle2 className="text-emerald-700 shrink-0 mt-0.5" size={20} />
                ) : (
                  <XOctagon className="text-red-700 shrink-0 mt-0.5" size={20} />
                )}
                <div className="space-y-3 w-full">
                  <div>
                    <h4 className="text-sm font-bold">{verifyReport.message}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Consulta de autenticidade efectuada no registo central do IMETRO.</p>
                  </div>

                  {verifyReport.isValid && (
                    <div className="border-t border-emerald-200 pt-3 text-xs space-y-2 text-slate-800 font-medium">
                      <div className="flex justify-between">
                        <span className="text-slate-550 text-[10px] uppercase font-bold">Titular:</span>
                        <span>{verifyReport.document.studentName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-550 text-[10px] uppercase font-bold">Tipo de Documento:</span>
                        <span className="uppercase">{verifyReport.document.docType.replace(/_/g, ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-555 text-[10px] uppercase font-bold">Data de Emissão:</span>
                        <span>{new Date(verifyReport.document.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="pt-2 border-t border-emerald-250/50 space-y-1">
                        <span className="text-slate-500 text-[9px] uppercase font-bold block">Checksum de Integridade (SHA-256):</span>
                        <span className="font-mono text-[9px] bg-white p-2 border border-emerald-200 rounded-sm block overflow-x-auto select-all">
                          {verifyReport.document.fileHash}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Certificate Issuance Section (Only ADMIN/Secretaria) */}
        {user.role === 'ADMIN' ? (
          <div className="bg-white border border-slate-200 rounded-sm p-6 space-y-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 font-serif flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Award className="text-blue-900" size={20} />
              <span>Emissão Oficial do Documento</span>
            </h3>

            <form onSubmit={handleIssueDoc} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Seleccionar Estudante Alvo
                </label>
                <select
                  required
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-slate-55 border border-slate-300 focus:border-blue-900 rounded-sm px-4 py-3 text-sm text-slate-800 outline-none transition"
                >
                  <option value="">Selecione o estudante...</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (ID: {s.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Tipo de Certidão
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full bg-slate-55 border border-slate-300 focus:border-blue-900 rounded-sm px-4 py-3 text-sm text-slate-800 outline-none transition"
                >
                  <option value="DIPLOMA">Diploma de Licenciatura</option>
                  <option value="CERTIFICADO_MATRICULA">Certidão de Matrícula</option>
                  <option value="DECLARACAO_NOTAS">Declaração de Notas Simples</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loadingIssue}
                className="w-full bg-slate-900 hover:bg-blue-900 text-white font-bold py-3 rounded-sm transition text-sm cursor-pointer disabled:opacity-50 mt-6"
              >
                {loadingIssue ? 'Gerando assinatura criptográfica...' : 'Assinar e Emitir Certificado'}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-slate-100/50 border border-slate-200 rounded-sm p-6 text-center space-y-4 text-slate-500">
            <div className="w-12 h-12 rounded-sm bg-white border border-slate-200 flex items-center justify-center mx-auto text-slate-450 shadow-sm">
              <Award size={20} className="stroke-[1.5]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Perfil Restrito</h4>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto mt-2 leading-relaxed">
                A emissão de credenciais académicas e assinatura de diplomas é de acesso exclusivo aos perfis de Secretaria de Coordenação Geral.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Render Issued Document Blueprint Printout Card */}
      {issuedDoc && (
        <div className="bg-white border-2 border-slate-900 rounded-sm p-8 max-w-2xl mx-auto space-y-6 relative overflow-hidden shadow-md">
          {/* Decorative watermark / stamp */}
          <div className="absolute right-6 top-6 w-24 h-24 rounded-full border-2 border-slate-205 flex items-center justify-center rotate-12 bg-white/70">
            <Award className="text-slate-300" size={40} />
          </div>

          <div className="text-center space-y-2 pb-6 border-b border-slate-200">
            <span className="text-[10px] text-blue-900 tracking-widest uppercase font-extrabold flex items-center justify-center space-x-1">
              <Sparkles size={12} className="stroke-[1.5]" />
              <span>IMETRO • República de Angola</span>
            </span>
            <h3 className="text-xl font-bold text-slate-900 font-serif tracking-tight uppercase">DIPLOMA ACADÉMICO REGISTADO</h3>
            <p className="text-[10px] text-slate-500">Autenticado nos registos do Instituto Metropolitano de Angola</p>
          </div>

          <div className="space-y-4 text-slate-800 text-sm leading-relaxed px-4 font-medium">
            <p>
              Certificamos que o estudante <strong className="text-slate-950">{issuedDoc.student.name}</strong> portador do correio electrónico <span className="text-slate-600 font-mono text-xs">{issuedDoc.student.email}</span> concluiu integralmente todas as valias académicas e regulamentares correspondentes ao módulo de estudos do IMETRO.
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pelo que, são-lhe averbados todos os privilégios legais relativos ao documento de tipo <strong className="uppercase text-slate-800">{issuedDoc.docType.replace(/_/g, ' ')}</strong>.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 bg-slate-50 p-6 rounded-sm border border-slate-200 text-xs">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-slate-500">
                <UserCheck2 size={13} className="text-blue-900" />
                <span className="font-bold">Assinatura Administrativa</span>
              </div>
              <p className="font-bold text-slate-800">Gabinete de Coordenação</p>
              <span className="text-[10px] text-slate-500">Verificação automática: {issuedDoc.verificationCode}</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-slate-500">
                <Fingerprint size={13} className="text-blue-900" />
                <span className="font-bold">Validação Criptográfica (SHA-256)</span>
              </div>
              <p className="font-mono text-[9px] text-slate-700 bg-white p-2 border border-slate-200 rounded-sm block truncate select-all">
                {issuedDoc.fileHash}
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-500 border-t border-slate-200 pt-6">
            <span>Emitido em: {new Date(issuedDoc.createdAt).toLocaleString()}</span>
            <button 
              onClick={() => window.print()}
              className="flex items-center space-x-1.5 hover:text-blue-900 font-bold transition cursor-pointer"
            >
              <Printer size={12} />
              <span>Imprimir Certidão</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
