import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { sounds } from '../components/SoundEffects';

interface SoilParticle {
  id: number;
  x: number;
  y: number;
  icon: string;
}

interface ChaosContextType {
  expertMode: boolean;
  toggleExpertMode: () => void;
  vowelFilter: (text: string) => string;
  isDialUpPlaying: boolean;
  startDialUp: () => void;
  isMosquitoDroning: boolean;
  toggleMosquito: () => void;
  rageClicks: number;
  recordRageClick: (elementId: string) => Promise<void>;
  lockUntil: number | null;
  triggerLockout: (seconds?: number) => void;
  isScreenShaking: boolean;
  triggerScreenShake: () => void;
  rageToast: string | null;
  soilParticles: SoilParticle[];
}

const ChaosContext = createContext<ChaosContextType | undefined>(undefined);

export const ChaosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expertMode, setExpertMode] = useState<boolean>(() => {
    return localStorage.getItem('agro_expert_mode') === 'true';
  });
  const [isDialUpPlaying, setIsDialUpPlaying] = useState<boolean>(false);
  const [isMosquitoDroning, setIsMosquitoDroning] = useState<boolean>(false);
  const [rageClicks, setRageClicks] = useState<number>(0);
  const [lockUntil, setLockUntil] = useState<number | null>(null);
  const [isScreenShaking, setIsScreenShaking] = useState<boolean>(false);
  const [rageToast, setRageToast] = useState<string | null>(null);
  const [soilParticles, setSoilParticles] = useState<SoilParticle[]>([]);

  const toggleExpertMode = () => {
    setExpertMode((prev) => {
      const next = !prev;
      localStorage.setItem('agro_expert_mode', String(next));
      sounds.playTwigSnap();
      return next;
    });
  };

  const vowelFilter = useCallback(
    (text: string): string => {
      if (!expertMode) return text;
      return text.replace(/[aeiouAEIOU]/g, '');
    },
    [expertMode]
  );

  const toggleMosquito = () => {
    const active = sounds.toggleMosquito();
    setIsMosquitoDroning(active);
  };

  const startDialUp = () => {
    setIsDialUpPlaying(true);
    sounds.playCicadaChirp(5);
    setTimeout(() => setIsDialUpPlaying(false), 5000);
  };

  const triggerScreenShake = () => {
    setIsScreenShaking(true);
    sounds.playExplosion();
    setTimeout(() => setIsScreenShaking(false), 350);
  };

  const triggerLockout = (seconds: number = 15) => {
    const until = Date.now() + seconds * 1000;
    setLockUntil(until);
    sounds.playBuzzer();
    sounds.playCicadaChirp(3);
  };

  useEffect(() => {
    if (!lockUntil) return;
    const interval = setInterval(() => {
      if (Date.now() >= lockUntil) {
        setLockUntil(null);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [lockUntil]);

  const addSoilParticle = (x: number, y: number) => {
    const icons = ['🍂', '🌱', '🪱', '🌾', '🐜', '🍃'];
    const newP: SoilParticle = {
      id: Date.now() + Math.random(),
      x,
      y,
      icon: icons[Math.floor(Math.random() * icons.length)],
    };
    setSoilParticles((prev) => [...prev.slice(-10), newP]);
    setTimeout(() => {
      setSoilParticles((prev) => prev.filter((p) => p.id !== newP.id));
    }, 1800);
  };

  const recordRageClick = async (elementId: string) => {
    setRageClicks((c) => c + 1);
    sounds.playMudSquish();

    const regulatoryNotices = [
      "AUDIT NOTICE: KINETIC COMPRESSION DETECTED (EMPATHY LEVEL: 0.00%)",
      "REGULATORY VIOLATION: RAPID CLICKS DISTURB TOPSOIL SEDIMENT",
      "DEPARTMENT OF CONSERVATION: PEST RESISTANCE INCREASED BY 2.1%",
      "SOIL COMPLIANCE ADVISORY: CEASE IMPULSIVE USER INTERACTIONS",
      "SUB-CLAUSE 12: CLICK VELOCITY IN BREACH OF NITROGEN SAFETY PROTOCOL",
    ];
    setRageToast(regulatoryNotices[Math.floor(Math.random() * regulatoryNotices.length)]);
    setTimeout(() => setRageToast(null), 3400);

    try {
      await fetch('/api/telemetry/rage-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ elementId }),
      });
    } catch {
      // System indifference
    }
  };

  useEffect(() => {
    let clickTimestamps: number[] = [];
    const handleDocumentClick = (e: MouseEvent) => {
      const now = Date.now();
      clickTimestamps.push(now);
      addSoilParticle(e.clientX, e.clientY);

      clickTimestamps = clickTimestamps.filter((t) => now - t < 1000);

      if (clickTimestamps.length >= 3) {
        const target = e.target as HTMLElement;
        const targetId = target?.id || target?.tagName || 'unidentified_regulatory_control';
        recordRageClick(`rapid_click_${targetId}`);
        clickTimestamps = [];
      }
    };

    window.addEventListener('click', handleDocumentClick);
    return () => window.removeEventListener('click', handleDocumentClick);
  }, []);

  return (
    <ChaosContext.Provider
      value={{
        expertMode,
        toggleExpertMode,
        vowelFilter,
        isDialUpPlaying,
        startDialUp,
        isMosquitoDroning,
        toggleMosquito,
        rageClicks,
        recordRageClick,
        lockUntil,
        triggerLockout,
        isScreenShaking,
        triggerScreenShake,
        rageToast,
        soilParticles,
      }}
    >
      <div className={`${isScreenShaking ? 'animate-screen-shake' : ''} min-h-screen relative`}>
        <div className="nature-overlay" />

        {soilParticles.map((p) => (
          <div
            key={p.id}
            style={{ left: `${p.x}px`, top: `${p.y}px` }}
            className="soil-particle select-none"
          >
            {p.icon}
          </div>
        ))}

        {children}

        {/* Austere Bureaucratic Rage Toast */}
        {rageToast && (
          <div className="fixed bottom-4 right-4 z-50 bg-peat-dark text-parchment-drab font-mono text-xs px-4 py-3 border-2 border-regulatory-gold shadow-[4px_4px_0px_#000] tracking-wider">
            § {expertMode ? rageToast.replace(/[aeiouAEIOU]/g, '') : rageToast}
          </div>
        )}

        {/* 15s Regulatory Freeze */}
        {lockUntil && (
          <div className="fixed inset-0 z-[100000] bg-forester-dark/95 flex flex-col items-center justify-center p-6 text-center select-none backdrop-blur-sm border-8 border-bureau-green">
            <div className="w-16 h-16 border-4 border-subdued-fern border-t-transparent rounded-full animate-spin mb-6"></div>
            <div className="text-3xl mb-3 text-regulatory-gold">🏛️ 🌾 ⚖️</div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-parchment-drab tracking-wide mb-2">
              {expertMode
                ? "ADMSTRTV PRCDR: MTE VIOLTN".replace(/[aeiouAEIOU]/g, '')
                : "DEPARTMENT OF SOIL CONSERVATION: EMERGENCY REGULATORY HOLD"}
            </h2>
            <p className="text-parchment-muted font-mono text-xs max-w-lg mb-6 leading-relaxed">
              {expertMode
                ? "Y hv sttmptd t slnc ntrl wthr thrt. Sub-scnt 41 drcs mdtr bfr prcdng."
                : "You attempted to dismiss an active meteorological warning. Under Federal Agricultural Statute 41-B, user interactive input has been suspended for 15 seconds to permit mandatory soil sediment settling."}
            </p>
            <div className="text-4xl font-mono text-regulatory-gold font-bold">
              {Math.max(0, Math.ceil((lockUntil - Date.now()) / 1000))}s REMAINING
            </div>
            <p className="text-[11px] text-lichen-stone mt-6 font-mono">
              (Documentary compliance review in progress. Do not refresh.)
            </p>
          </div>
        )}
      </div>
    </ChaosContext.Provider>
  );
};

export const useChaos = () => {
  const context = useContext(ChaosContext);
  if (!context) throw new Error('useChaos must be used within a ChaosProvider');
  return context;
};
