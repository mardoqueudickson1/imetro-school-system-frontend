import React from 'react';

interface LoaderProps {
  message?: string;
}

export const Loader: React.FC<LoaderProps> = ({ message = 'A carregar...' }) => {
  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-50">
      {/* Logo mark */}
      <div className="mb-10 flex flex-col items-center space-y-3">
        <div className="relative w-16 h-16">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-2 border-slate-700" />
          {/* Spinning arc */}
          <div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-400"
            style={{ animation: 'spin 1s linear infinite' }}
          />
          {/* Inner dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-blue-400" style={{ animation: 'pulse 1.5s ease-in-out infinite' }} />
          </div>
        </div>

        {/* Brand name */}
        <div className="text-center">
          <p className="text-white font-serif text-2xl font-semibold tracking-wide">IMETRO</p>
          <p className="text-slate-500 text-[11px] uppercase tracking-widest mt-0.5">Portal Académico</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-48 h-px bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-400 rounded-full"
          style={{ animation: 'progress 1.6s ease-in-out infinite' }}
        />
      </div>

      {/* Message */}
      <p className="mt-5 text-slate-500 text-xs tracking-wider">{message}</p>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.75); }
        }
        @keyframes progress {
          0% { width: 0%; margin-left: 0%; }
          50% { width: 60%; margin-left: 20%; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </div>
  );
};
