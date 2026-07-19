import { useState } from 'react';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { AttendanceView } from './components/AttendanceView';
import { DocumentsView } from './components/DocumentsView';
import { SchedulerView } from './components/SchedulerView';

function App() {
  const [authState, setAuthState] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'attendance' | 'document' | 'scheduler'>('attendance');

  const handleLoginSuccess = (data: any) => {
    setAuthState(data);
  };

  const handleLogout = () => {
    setAuthState(null);
  };

  // If unauthorized, lock behind authentication wall portal
  if (!authState) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'attendance':
        return <AttendanceView user={authState.user} />;
      case 'document':
        return <DocumentsView user={authState.user} />;
      case 'scheduler':
        return <SchedulerView user={authState.user} />;
      default:
        return <AttendanceView user={authState.user} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 select-none">
      {/* Dynamic Navigation Sidebar */}
      <Sidebar
        user={authState.user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      {/* Main Panel Viewport */}
      <main className="flex-1 p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {renderActiveTab()}
      </main>
    </div>
  );
}

export default App;
