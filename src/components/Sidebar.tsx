import React from 'react';
import { 
  LogOut, 
  MapPin, 
  FileCheck, 
  CalendarClock, 
  GraduationCap, 
  UserCircle 
} from 'lucide-react';

interface SidebarProps {
  user: {
    id: number;
    name: string;
    email: string;
    role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  };
  activeTab: 'attendance' | 'document' | 'scheduler';
  setActiveTab: (tab: 'attendance' | 'document' | 'scheduler') => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  activeTab,
  setActiveTab,
  onLogout,
}) => {
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'Admin';
      case 'TEACHER':
        return 'Docente';
      default:
        return 'Estudante';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-amber-950/80 text-amber-300 border border-amber-900';
      case 'TEACHER':
        return 'bg-emerald-950/80 text-emerald-300 border border-emerald-900';
      default:
        return 'bg-blue-950/80 text-blue-300 border border-blue-900';
    }
  };

  return (
    <aside aria-label="Menu Académico" className="w-80 bg-slate-900 text-slate-100 border-r border-slate-950 flex flex-col justify-between p-6 shrink-0 h-screen sticky top-0">
      {/* Brand Header */}
      <div className="space-y-8">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-slate-800 text-blue-400 border border-slate-700 rounded-sm">
            <GraduationCap size={24} className="stroke-[1.5]" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-white font-serif leading-none tracking-tight">
              IMETRO School
            </h1>
            <span className="text-[9px] uppercase tracking-wider text-blue-400 font-bold mt-1 block">
              Gestão Académica
            </span>
          </div>
        </div>

        {/* Tab Items Menu */}
        <nav className="space-y-1">
          <button
            onClick={() => setActiveTab('attendance')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-sm text-sm font-semibold transition cursor-pointer ${
              activeTab === 'attendance'
                ? 'bg-slate-850 text-white border border-slate-700 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
            }`}
          >
            <MapPin size={18} className="stroke-[1.5]" />
            <span>Presenças Inteligentes</span>
          </button>

          <button
            onClick={() => setActiveTab('document')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-sm text-sm font-semibold transition cursor-pointer ${
              activeTab === 'document'
                ? 'bg-slate-850 text-white border border-slate-700 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
            }`}
          >
            <FileCheck size={18} className="stroke-[1.5]" />
            <span>Validador de Documentos</span>
          </button>

          <button
            onClick={() => setActiveTab('scheduler')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-sm text-sm font-semibold transition cursor-pointer ${
              activeTab === 'scheduler'
                ? 'bg-slate-850 text-white border border-slate-700 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
            }`}
          >
            <CalendarClock size={18} className="stroke-[1.5]" />
            <span>Grades &amp; Horários</span>
          </button>
        </nav>
      </div>

      {/* User Footer Profile card */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex items-center space-x-3 p-2 bg-slate-950 border border-slate-800 rounded-sm">
          <div className="text-slate-350 bg-slate-800 p-2 rounded-sm border border-slate-700">
            <UserCircle size={20} className="stroke-[1.5]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-200 truncate m-0 leading-tight">
              {user.name}
            </p>
            <p className="text-[10px] text-slate-400 truncate m-0 mt-0.5">
              {user.email}
            </p>
          </div>
          <span className={`text-[9px] px-1.5 py-0.5 font-bold rounded-sm uppercase shrink-0 border ${getRoleBadgeColor(user.role)}`}>
            {getRoleLabel(user.role)}
          </span>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-800/40 hover:bg-red-950/50 hover:text-red-200 border border-slate-850 hover:border-red-900 text-slate-300 rounded-sm text-xs font-bold transition cursor-pointer"
        >
          <LogOut size={13} />
          <span>Terminar Sessão</span>
        </button>
      </div>
    </aside>
  );
};
