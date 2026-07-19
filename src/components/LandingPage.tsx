import React, { useEffect, useRef, useState } from 'react';
import { LogIn, ShieldCheck } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (path: 'login' | 'verify') => void;
}

const CAROUSEL_IMAGES = [
  { src: '/2.jpg', caption: 'Campus IMETRO — Luanda, Angola' },
  { src: '/1.jpeg', caption: 'Laboratório de Informática' },
  { src: '/3.jpg', caption: 'Cerimónia de Outorga de Diplomas' },
  { src: '/campus_bg.jpg', caption: 'Campus IMETRO — Vista Aérea' },
];

const INTERVAL_MS = 5000;

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const yearRef = useRef<HTMLSpanElement>(null);
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (yearRef.current) yearRef.current.textContent = String(new Date().getFullYear());
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
        setFading(false);
      }, 600);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen text-white font-sans flex flex-col relative overflow-hidden">

      {/* ── Carousel background ── */}
      {CAROUSEL_IMAGES.map((img, i) => (
        <div
          key={img.src}
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: `url(${img.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: i === current ? (fading ? 0 : 1) : 0,
            transition: 'opacity 0.7s ease-in-out',
          }}
        />
      ))}

      {/* ── Dark overlay for text readability ── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: 'linear-gradient(135deg, rgba(10,14,30,0.82) 0%, rgba(10,14,30,0.55) 60%, rgba(10,14,30,0.3) 100%)' }}
      />

      {/* ── Carousel dots ── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {CAROUSEL_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => { setFading(true); setTimeout(() => { setCurrent(i); setFading(false); }, 400); }}
            className="cursor-pointer transition-all duration-300"
            style={{
              width: i === current ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: i === current ? '#fff' : 'rgba(255,255,255,0.35)',
              border: 'none',
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* ── Caption pill ── */}
      <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-20">
        <span
          className="text-[10px] uppercase tracking-[0.2em] text-white/60 transition-opacity duration-500"
          style={{ opacity: fading ? 0 : 1 }}
        >
          {CAROUSEL_IMAGES[current].caption}
        </span>
      </div>

      {/* ── All content above backdrop ── */}
      <div className="relative z-10 flex flex-col min-h-screen">

        {/* Nav */}
        <nav className="w-full border-b border-white/10 backdrop-blur-[2px]">
          <div className="max-w-5xl mx-auto px-10 py-5 flex items-center justify-between">
            <div className="flex items-baseline space-x-2.5">
              <span className="font-serif text-xl font-bold tracking-tight text-white">IMETRO</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 hidden sm:inline">
                Instituto Superior Politécnico
              </span>
            </div>

            <div className="flex items-center space-x-6">
              <button
                onClick={() => onNavigate('verify')}
                className="text-xs text-white/60 hover:text-white underline underline-offset-4 decoration-white/30 hover:decoration-white/80 transition-colors cursor-pointer"
              >
                Verificar documento
              </button>
              <button
                onClick={() => onNavigate('login')}
                className="text-xs bg-white text-slate-900 px-5 py-2 hover:bg-blue-100 transition-colors duration-300 cursor-pointer font-semibold"
              >
                Entrar
              </button>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <main className="flex-1 flex flex-col justify-center w-full">
          <div className="max-w-5xl mx-auto px-10 pt-16 pb-12 w-full">

            <p className="text-[11px] uppercase tracking-[0.25em] text-white/50 mb-6">
              Sistema Académico — Luanda, Angola
            </p>

            <h1 className="font-serif text-[clamp(3.5rem,8vw,6.5rem)] font-bold leading-[0.95] text-white mb-8 max-w-3xl drop-shadow-lg">
              O portal<br />
              <em className="not-italic text-blue-300">académico</em><br />
              do IMETRO.
            </h1>

            <p className="text-white/65 text-base max-w-sm leading-relaxed mb-10">
              Um lugar onde docentes registam presenças, a secretaria emite certificados,
              e os horários encaixam sem conflitos. Simples assim.
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <button
                onClick={() => onNavigate('login')}
                className="flex items-center space-x-2 bg-white text-slate-900 text-sm px-8 py-3.5 hover:bg-blue-100 transition-colors duration-300 cursor-pointer font-semibold shadow-lg"
              >
                <LogIn size={15} />
                <span>Aceder ao sistema</span>
              </button>
              <button
                onClick={() => onNavigate('verify')}
                className="flex items-center space-x-2 text-sm text-white/70 border-b border-white/30 pb-0.5 hover:text-white hover:border-white transition-colors cursor-pointer"
              >
                <ShieldCheck size={13} />
                <span>Validar um documento</span>
              </button>
            </div>

            {/* Feature pills */}
            <div className="border-t border-white/10 mt-20 pt-8">
              <div className="flex flex-wrap gap-12 text-xs text-white/40">
                <div>
                  <p className="text-white font-semibold text-sm mb-0.5">Presenças</p>
                  <p>Registo por QR Code e geolocalização</p>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm mb-0.5">Certificados</p>
                  <p>Assinatura SHA-256 verificável publicamente</p>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm mb-0.5">Horários</p>
                  <p>Detecção automática de conflitos</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full border-t border-white/10">
          <div className="max-w-5xl mx-auto px-10 py-5 flex items-center justify-between">
            <p className="text-[11px] text-white/30">
              © <span ref={yearRef} /> IMETRO
            </p>
            <p className="text-[11px] text-white/30 hidden sm:block">
              secretaria@imetro.ao
            </p>
          </div>
        </footer>

      </div>
    </div>
  );
};
