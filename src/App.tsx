import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { AttendanceView } from './components/AttendanceView';
import { DocumentsView } from './components/DocumentsView';
import { SchedulerView } from './components/SchedulerView';
import { Loader } from './components/Loader';
import { DocumentVerifyPage } from './components/DocumentVerifyPage';
import { LandingPage } from './components/LandingPage';

type Route = 'landing' | 'login' | 'verify' | 'dashboard';

function getInitialRoute(): Route {
  const path = window.location.pathname;
  if (path.startsWith('/verify')) return 'verify';
  if (path.startsWith('/login')) return 'login';
  return 'landing';
}

function App() {
  const [route, setRoute] = useState<Route>(getInitialRoute);
  const [authState, setAuthState] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'attendance' | 'document' | 'scheduler'>('attendance');
  const [appLoading, setAppLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);

  // Splash screen on first mount
  useEffect(() => {
    const timer = setTimeout(() => setAppLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  const handleLoginSuccess = (data: any) => {
    setAuthState(data);
    setRoute('dashboard');
  };

  const handleLogout = () => {
    setAuthState(null);
    setRoute('landing');
  };

  const handleTabChange = (tab: 'attendance' | 'document' | 'scheduler') => {
    if (tab === activeTab) return;
    setTabLoading(true);
    setTimeout(() => {
      setActiveTab(tab);
      setTabLoading(false);
    }, 400);
  };

  // Initial splash screen
  if (appLoading) {
    return <Loader message="A inicializar o sistema..." />;
  }

  // Public routes
  if (route === 'verify') return <DocumentVerifyPage onBack={() => setRoute('landing')} />;
  if (route === 'landing') {
    return (
      <LandingPage
        onNavigate={(path) => {
          if (path === 'verify') setRoute('verify');
          else setRoute('login');
        }}
      />
    );
  }
  if (route === 'login' || !authState) {
    return <Login onLoginSuccess={handleLoginSuccess} onBack={() => setRoute('landing')} />;
  }

  // Dashboard
  const renderActiveTab = () => {
    if (tabLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div
              className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-blue-600"
              style={{ animation: 'spin 0.8s linear infinite' }}
            />
            <p className="text-slate-400 text-xs tracking-wider">A carregar módulo...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'attendance': return <AttendanceView user={authState.user} />;
      case 'document': return <DocumentsView user={authState.user} />;
      case 'scheduler': return <SchedulerView user={authState.user} />;
      default: return <AttendanceView user={authState.user} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 select-none">
      <Sidebar
        user={authState.user}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onLogout={handleLogout}
      />
      <main className="flex-1 p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {renderActiveTab()}
      </main>
    </div>
  );
}

export default App;
