import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  MapPin, 
  CheckCircle, 
  QrCode, 
  Clock, 
  Compass, 
  Gauge, 
  AlertCircle 
} from 'lucide-react';

interface AttendanceViewProps {
  user: {
    id: number;
    name: string;
    email: string;
    role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  };
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({ user }) => {
  // Teacher states
  const [lessons, setLessons] = useState<any[]>([]);
  const [selectedLessonId, setSelectedLessonId] = useState<number | ''>('');
  const [radius, setRadius] = useState<number>(30); // meters
  const [duration, setDuration] = useState<number>(5); // minutes
  const [activeSession, setActiveSession] = useState<any | null>(null);
  const [checkedStudents, setCheckedStudents] = useState<any[]>([]);

  // Student states
  const [checkInCode, setCheckInCode] = useState('');
  const [isInsideRoom, setIsInsideRoom] = useState<boolean>(true); // Mock GPS switch
  const [checkInMsg, setCheckInMsg] = useState<{ success: boolean; text: string } | null>(null);
  const [studentHistory, setStudentHistory] = useState<any[]>([]);

  // Load backend configurations
  useEffect(() => {
    fetchLessons();
    if (user.role === 'STUDENT') {
      fetchStudentHistory();
    }
  }, []);

  // Periodic polling for students checked in
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (activeSession) {
      interval = setInterval(() => {
        fetchSessionDetails(activeSession.lessonId);
      }, 3000);
    }
    return () => clearInterval(interval!);
  }, [activeSession]);

  const fetchLessons = async () => {
    try {
      const res = await fetch('http://localhost:3001/scheduler/lessons');
      if (res.ok) {
        const data = await res.json();
        setLessons(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStudentHistory = async () => {
    try {
      const res = await fetch(`http://localhost:3001/attendance/student/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setStudentHistory(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSessionDetails = async (lessonId: number) => {
    try {
      const res = await fetch(`http://localhost:3001/attendance/lesson/${lessonId}`);
      if (res.ok) {
        const data = await res.json();
        setCheckedStudents(data.checkedInUsers || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLessonId) return;

    try {
      const res = await fetch('http://localhost:3001/attendance/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: Number(selectedLessonId),
          radiusMeters: radius,
          durationMinutes: duration,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || 'Falha ao iniciar sessão');
        return;
      }
      setActiveSession(data);
      setCheckedStudents([]);
    } catch (err) {
      alert('Erro ao ligar ao servidor');
    }
  };

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkInCode) return;

    // Simulation Coordinates based on mock GPS toggle
    // Classroom center is at Lat: -8.895000, Lng: 13.182000
    // Inside Room (11 meters away): Lat: -8.895100, Lng: 13.182000
    // Outside Campus / Cafeteria (~334 meters away): Lat: -8.892000, Lng: 13.180000
    const lat = isInsideRoom ? -8.8951 : -8.8920;
    const lng = isInsideRoom ? 13.182 : 13.18;

    try {
      const res = await fetch('http://localhost:3001/attendance/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: user.id,
          code: checkInCode,
          studentLatitude: lat,
          studentLongitude: lng,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setCheckInMsg({ success: false, text: data.message || 'Código incorreto ou expirado.' });
      } else {
        setCheckInMsg({ 
          success: true, 
          text: `Presença Confirmada! Distância medida pelo Haversine: ${Math.round(data.distanceMeters)} metros.` 
        });
        fetchStudentHistory();
      }
    } catch (err) {
      setCheckInMsg({ success: false, text: 'Erro ao conectar ao servidor de chamadas.' });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-800">
      <div className="border-b border-slate-200 pb-4 mb-4">
        <h2 className="text-2xl font-black text-slate-900 font-serif flex items-center space-x-2">
          <MapPin className="text-blue-900 stroke-[1.5]" size={24} />
          <span>Controlo de Presenças por Geodistância</span>
        </h2>
        <p className="text-sm text-slate-500">
          Validação algorítmica de proximidade em tempo real (Fórmula de Haversine).
        </p>
      </div>

      {user.role === 'TEACHER' && (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Start Session Block */}
          <div className="bg-white border border-slate-200 rounded-sm p-6 space-y-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 font-serif flex items-center space-x-2 border-b border-slate-100 pb-3">
              <PlusCircle className="text-blue-900" size={20} />
              <span>Emitir Aula QR-Code</span>
            </h3>

            <form onSubmit={handleStartSession} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Escolher Cadeira / Aula Activa
                </label>
                <select
                  required
                  value={selectedLessonId}
                  onChange={(e) => setSelectedLessonId(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-slate-55 border border-slate-300 focus:border-blue-900 rounded-sm px-4 py-3 text-sm text-slate-805 outline-none transition"
                >
                  <option value="">Selecione uma aula ativa...</option>
                  {lessons.map((lesson) => (
                    <option key={lesson.id} value={lesson.id}>
                      {lesson.course.name} - Sala: {lesson.room.name} ({lesson.startTime} a {lesson.endTime})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Raio Limite (Cerca GPS)
                  </label>
                  <select
                    value={radius}
                    onChange={(e) => setRadius(Number(e.target.value))}
                    className="w-full bg-slate-55 border border-slate-300 focus:border-blue-900 rounded-sm px-4 py-3 text-sm text-slate-805 outline-none transition"
                  >
                    <option value={10}>10 Metros (Estrita)</option>
                    <option value={20}>20 Metros</option>
                    <option value={30}>30 Metros (Recomendado)</option>
                    <option value={50}>50 Metros (Amplo/Wifi)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Tempo Limite de Exibição
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full bg-slate-55 border border-slate-300 focus:border-blue-900 rounded-sm px-4 py-3 text-sm text-slate-855 outline-none transition"
                  >
                    <option value={1}>1 Minuto (Impedir Fraudes)</option>
                    <option value={5}>5 Minutos</option>
                    <option value={10}>10 Minutos</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={!!activeSession}
                className="w-full bg-slate-900 hover:bg-blue-900 text-white font-bold py-3 px-4 rounded-sm transition text-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed mt-4"
              >
                Ativar QR Code de Chamada
              </button>
            </form>
          </div>

          {/* Active QR Code Display Panel */}
          <div className="bg-white border border-slate-205 rounded-sm p-6 flex flex-col items-center justify-center text-center shadow-sm">
            {activeSession ? (
              <div className="space-y-6 w-full">
                <div className="bg-slate-50 p-4 rounded-sm border border-slate-200 inline-block">
                  <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-widest block mb-2">
                    Sessão em Curso
                  </span>
                  <div className="bg-white p-4 rounded-sm border border-slate-200 inline-block shadow-sm">
                    {/* Simulated QR Code Icon */}
                    <QrCode size={180} className="text-slate-900" />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Código Alfanumérico Temporário
                  </p>
                  <span className="text-2xl font-mono font-black text-blue-900 tracking-wider block mt-1 select-all">
                    {activeSession.code}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-left bg-slate-50 p-4 border border-slate-200 rounded-sm max-w-sm mx-auto">
                  <div className="flex items-center space-x-2 text-xs text-slate-700">
                    <Gauge size={14} className="text-blue-900" />
                    <span className="font-medium">Raio: {activeSession.radiusMeters}m</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-slate-700">
                    <Clock size={14} className="text-blue-900" />
                    <span className="font-medium">Expirador: {activeSession.durationMinutes} min</span>
                  </div>
                </div>

                {/* Checked in Student counter */}
                <div className="border-t border-slate-200 pt-4 text-left">
                  <h4 className="text-xs font-bold text-slate-550 uppercase tracking-wider mb-3">
                    Estudantes Confirmados ({checkedStudents.length})
                  </h4>
                  {checkedStudents.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">Nenhum check-in registado nesta aula ainda...</p>
                  ) : (
                    <div className="divide-y divide-slate-100 max-h-40 overflow-y-auto">
                      {checkedStudents.map((stud) => (
                        <div key={stud.id} className="flex justify-between items-center py-2 text-xs">
                          <span className="font-bold text-slate-800">{stud.studentName}</span>
                          <span className="text-emerald-800 font-extrabold pr-2">Presente</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setActiveSession(null)}
                  className="px-4 py-2 border border-slate-350 hover:border-red-300 hover:bg-red-50 text-slate-700 hover:text-red-800 text-xs font-bold rounded-sm transition cursor-pointer"
                >
                  Fechar Chamada Activa
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-sm bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mx-auto shadow-inner">
                  <QrCode size={28} className="stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-850">Painel QR Code Inativo</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto mt-2 leading-relaxed">
                    Configure os parâmetros e inicie o QR Code ao lado para ativar o sistema de georeferência da sala de aula.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {user.role === 'STUDENT' && (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Check-In input form */}
          <div className="bg-white border border-slate-200 rounded-sm p-6 space-y-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 font-serif flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Compass className="text-blue-900" size={20} />
              <span>Painel Autenticação Chamada</span>
            </h3>

            {/* GPS Simulation Selector */}
            <div className="bg-slate-50 p-4 border border-slate-200 rounded-sm space-y-3 shadow-inner">
              <label className="block text-[10px] font-bold text-slate-550 uppercase tracking-wider">
                Simular Localização GPS do Aparelho
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsInsideRoom(true)}
                  className={`px-3 py-2 text-xs font-bold rounded-sm border transition cursor-pointer antialiased ${
                    isInsideRoom
                      ? 'bg-blue-50 text-blue-900 border-blue-400'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-350'
                  }`}
                >
                  Dentro da Sala (11 metros)
                </button>
                <button
                  type="button"
                  onClick={() => setIsInsideRoom(false)}
                  className={`px-3 py-2 text-xs font-bold rounded-sm border transition cursor-pointer antialiased ${
                    !isInsideRoom
                      ? 'bg-amber-50 text-amber-900 border-amber-400'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-350'
                  }`}
                >
                  Fora da Sala (~334 metros)
                </button>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed mt-1">
                Simula o envio coordenadas de GPS instantâneas para que o backend avalie a distância através do cálculo Haversine.
              </p>
            </div>

            <form onSubmit={handleCheckIn} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Código de Presença da Aula
                </label>
                <input
                  type="text"
                  required
                  placeholder="Introduza o código da chamada (ex: IM-XXXX)"
                  value={checkInCode}
                  onChange={(e) => setCheckInCode(e.target.value.toUpperCase())}
                  className="w-full bg-slate-55 border border-slate-300 focus:border-blue-900 rounded-sm px-4 py-3 text-sm text-slate-905 placeholder-slate-400 outline-none transition"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-blue-900 text-white font-bold py-3 rounded-sm transition text-sm cursor-pointer mt-4"
              >
                Registrar Minha Presença
              </button>
            </form>

            {checkInMsg && (
              <div className={`p-4 border rounded-sm flex items-start space-x-3 text-xs leading-relaxed ${
                checkInMsg.success
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-red-50 border-red-300 text-red-900'
              }`}>
                {checkInMsg.success ? (
                  <CheckCircle className="shrink-0 text-emerald-800 mt-0.5" size={16} />
                ) : (
                  <AlertCircle className="shrink-0 text-red-750 mt-0.5" size={16} />
                )}
                <span className="font-medium">{checkInMsg.text}</span>
              </div>
            )}
          </div>

          {/* Student attendance history list */}
          <div className="bg-white border border-slate-205 rounded-sm p-6 space-y-4 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 font-serif border-b border-slate-100 pb-3">Meu Histórico de Presenças</h3>

            {studentHistory.length === 0 ? (
              <p className="text-xs text-slate-500 italic">Ainda não marcou nenhuma presença nas cadeiras.</p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {studentHistory.map((sh) => (
                  <div
                    key={sh.id}
                    className="flex justify-between items-center p-3.5 bg-slate-50 border border-slate-200 rounded-sm text-xs shadow-sm hover:border-slate-350 transition"
                  >
                    <div>
                      <p className="font-extrabold text-slate-950">{sh.lesson.course.name}</p>
                      <span className="text-[10px] text-slate-500 block mt-1">
                        Dia/Hora: {new Date(sh.checkInTime).toLocaleString()}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-emerald-900 font-bold bg-emerald-100 px-2.5 py-1 rounded-sm border border-emerald-300 uppercase tracking-wider text-[9px]">
                        Presente
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
