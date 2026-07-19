import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Wand2,
  AlertTriangle,
  Terminal,
  Activity,
  Plus
} from 'lucide-react';
import { API_URL } from '../config';

interface SchedulerViewProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  };
}

export const SchedulerView: React.FC<SchedulerViewProps> = ({ user }) => {
  const [lessons, setLessons] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [optimizing, setOptimizing] = useState(false);
  const [optReport, setOptReport] = useState<any | null>(null);

  // Form states
  const [courses, setCourses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | ''>( '');
  const [selectedRoomId, setSelectedRoomId] = useState<number | ''>('');
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | ''>('');
  const [dayOfWeek, setDayOfWeek] = useState<number>(1);
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('10:00');
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    fetchLessons();
    fetchRooms();
    fetchConflicts();
    fetchCourses();
    fetchTeachers();
  }, []);

  const fetchLessons = async () => {
    try {
      const res = await fetch(`${API_URL}/scheduler/lessons`);
      if (res.ok) {
        const data = await res.json();
        setLessons(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await fetch(`${API_URL}/scheduler/rooms`);
      if (res.ok) {
        const data = await res.json();
        setRooms(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchConflicts = async () => {
    try {
      const res = await fetch(`${API_URL}/scheduler/conflicts`);
      if (res.ok) {
        const data = await res.json();
        setConflicts(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${API_URL}/scheduler/courses`);
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await fetch(`${API_URL}/scheduler/teachers`);
      if (res.ok) {
        const data = await res.json();
        setTeachers(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess(false);

    if (!selectedCourseId || !selectedRoomId || !selectedTeacherId) {
      setSubmitError('Preencha os campos obrigatórios.');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/scheduler/lessons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: Number(selectedCourseId),
          roomId: Number(selectedRoomId),
          teacherId: Number(selectedTeacherId),
          dayOfWeek: Number(dayOfWeek),
          startTime,
          endTime,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.message || 'Erro ao registrar conflito de horário.');
      } else {
        setSubmitSuccess(true);
        setSelectedCourseId('');
        setSelectedTeacherId('');
        fetchLessons();
        fetchConflicts();
      }
    } catch (err) {
      setSubmitError('Erro ao conectar ao servidor NestJS.');
    }
  };

  const handleOptimize = async () => {
    setOptimizing(true);
    setOptReport(null);

    // Simulate short optimization animation
    setTimeout(async () => {
      try {
        const res = await fetch(`${API_URL}/scheduler/optimize`, {
          method: 'POST',
        });
        const data = await res.json();
        if (res.ok) {
          setOptReport(data);
          fetchLessons();
          fetchConflicts();
        }
      } catch (err) {
        console.error(err);
      } finally {
        setOptimizing(false);
      }
    }, 1500);
  };

  const getWeekDayName = (dayNum: number) => {
    const days = ['', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira'];
    return days[dayNum] || `Dia ${dayNum}`;
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-800">
      <div className="border-b border-slate-200 pb-4 mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900 font-serif flex items-center space-x-2">
            <Calendar className="text-blue-900 stroke-[1.5]" size={24} />
            <span>Otimizador Inteligente de Grades de Horários</span>
          </h2>
          <p className="text-sm text-slate-500">
            Deteção matemática de colisões e recolocação dinâmica de grades curriculares.
          </p>
        </div>

        {conflicts.length > 0 && (
          <button
            onClick={handleOptimize}
            disabled={optimizing}
            className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 transition active:scale-95 text-slate-950 font-bold px-5 py-3 rounded-sm cursor-pointer shadow-sm disabled:opacity-50"
          >
            <Wand2 size={16} />
            <span>{optimizing ? 'Otimizando...' : 'Resolver Conflitos'}</span>
          </button>
        )}
      </div>

      {/* Conflicts Alarm alert box */}
      {conflicts.length > 0 ? (
        <div className="p-4 bg-amber-50 border border-amber-300 text-amber-900 rounded-sm flex items-start space-x-3">
          <AlertTriangle className="shrink-0 text-amber-700 mt-1" size={24} />
          <div className="space-y-1">
            <h4 className="font-bold text-sm">Alerta: {conflicts.length} Conflitos de Alocação Encontrados</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Existem sobreposições de docentes lecionando à mesma hora ou salas em dupla reserva. Clique em "Resolver Conflitos" para executar o algoritmo de otimização de horário do IMETRO.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-emerald-50 border border-emerald-250 text-emerald-990 rounded-sm flex items-center space-x-3 shadow-sm">
          <Activity size={20} className="text-emerald-700" />
          <span className="text-xs font-semibold text-emerald-800">Grade curricular livre de quaisquer choques de horário ou salas.</span>
        </div>
      )}

      {/* Main Grid: Form + Conflict Visualizer */}
      <div className={`flex gap-8 items-start ${user.role === 'ADMIN' ? 'flex-row' : ''}`}>
        {/* Reservation Planner (Only ADMIN) */}
        {user.role === 'ADMIN' && (
          <div className="bg-white border border-slate-200 rounded-sm p-6 space-y-5 w-80 shrink-0 shadow-sm">
            <h3 className="text-md font-bold text-slate-900 font-serif flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Plus className="text-blue-900" size={18} />
              <span>Agendar Nova Aula</span>
            </h3>

            <form onSubmit={handleCreateLesson} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Cadeira / Disciplina</label>
                <select
                  required
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-slate-55 border border-slate-300 focus:border-blue-900 rounded-sm px-4 py-2.5 text-xs text-slate-800 outline-none transition"
                >
                  <option value="">Selecione...</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 font-semibold">Sala de Aula</label>
                <select
                  required
                  value={selectedRoomId}
                  onChange={(e) => setSelectedRoomId(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-slate-55 border border-slate-300 focus:border-blue-900 rounded-sm px-4 py-2.5 text-xs text-slate-800 outline-none transition"
                >
                  <option value="">Selecione...</option>
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} (Capacidade: {r.capacity})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Professor</label>
                <select
                  required
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-slate-55 border border-slate-300 focus:border-blue-900 rounded-sm px-4 py-2.5 text-xs text-slate-800 outline-none transition"
                >
                  <option value="">Selecione...</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Dia da Semana</label>
                  <select
                    value={dayOfWeek}
                    onChange={(e) => setDayOfWeek(Number(e.target.value))}
                    className="w-full bg-slate-55 border border-slate-300 focus:border-blue-900 rounded-sm px-4 py-2.5 text-xs text-slate-800 outline-none transition"
                  >
                    <option value={1}>Segunda-Feira</option>
                    <option value={2}>Terça-Feira</option>
                    <option value={3}>Quarta-Feira</option>
                    <option value={4}>Quinta-Feira</option>
                    <option value={5}>Sexta-Feira</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Início</label>
                  <input
                    type="text"
                    placeholder="08:00"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-slate-55 border border-slate-300 focus:border-blue-900 rounded-sm px-4 py-2.5 text-xs text-slate-900 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Fim</label>
                <input
                  type="text"
                  placeholder="10:00"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-slate-55 border border-slate-300 focus:border-blue-900 rounded-sm px-4 py-2.5 text-xs text-slate-900 outline-none transition"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-blue-900 text-white font-bold py-2.5 rounded-sm transition text-xs cursor-pointer mt-2"
              >
                Adicionar e Testar Conflitos
              </button>
            </form>

            {submitError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-[10px] rounded-sm leading-relaxed flex items-start space-x-2">
                <AlertTriangle className="shrink-0 text-red-750 mt-0.5" size={12} />
                <span>{submitError}</span>
              </div>
            )}

            {submitSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] rounded-sm">
                Aula registrada com sucesso.
              </div>
            )}
          </div>
        )}

        {/* Schedule grid view lists */}
        <div className="space-y-6 flex-1 min-w-0">
          <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-sm">
            <h3 className="text-md font-bold text-slate-900 font-serif mb-4 flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Calendar size={18} className="text-blue-900" />
              <span>Calendário Curricular Ativo</span>
            </h3>

            {lessons.length === 0 ? (
              <p className="text-xs text-slate-500 italic">Nenhum horário cadastrado ainda no banco de dados.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-205 text-slate-500 uppercase tracking-wider text-[9px] font-bold">
                      <th className="py-3 px-4">Dia</th>
                      <th className="py-3 px-4">Horário</th>
                      <th className="py-3 px-4">Cadeira</th>
                      <th className="py-3 px-4">Sala</th>
                      <th className="py-3 px-4">Professor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {lessons.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-50/80 transition text-slate-700">
                        <td className="py-3.5 px-4 font-bold text-slate-900">{getWeekDayName(l.dayOfWeek)}</td>
                        <td className="py-3.5 px-4 font-mono">{l.startTime} - {l.endTime}</td>
                        <td className="py-3.5 px-4 font-extrabold text-slate-950">{l.course?.name}</td>
                        <td className="py-3.5 px-4">{l.room?.name}</td>
                        <td className="py-3.5 px-4">{l.teacher?.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Optimization log terminal */}
      {optimizing && (
        <div className="bg-slate-900 border border-slate-950 rounded-sm p-8 flex flex-col items-center justify-center space-y-4 shadow-sm text-slate-200">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold">Executando algoritmo de reordenação no banco de dados...</p>
        </div>
      )}

      {optReport && (
        <div className="bg-slate-950 border border-slate-900 rounded-sm p-6 space-y-4 font-mono text-slate-200">
          <div className="flex items-center space-x-2 border-b border-slate-900 pb-3">
            <Terminal className="text-amber-400" size={16} />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Terminal de Otimização Algorítmica</h4>
          </div>

          <div className="space-y-2.5 max-h-40 overflow-y-auto text-[11px] text-slate-400 select-all">
            <p className="text-emerald-450 font-semibold">&gt; {optReport.message}</p>
            {optReport.updates.length === 0 ? (
              <p className="text-slate-500 italic">&gt; Todos os conflitos foram sanados com sucesso.</p>
            ) : (
              optReport.updates.map((upd: any, idx: number) => (
                <p key={idx} className="leading-relaxed">
                  <span className="text-blue-400">[Opt #{upd.lessonId}]</span> {upd.courseName}: {upd.change}
                </p>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
