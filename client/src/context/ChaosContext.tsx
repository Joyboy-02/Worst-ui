import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { sounds } from '../components/SoundEffects';

interface ChaosContextType {
  expertMode: boolean;
  toggleExpertMode: () => void;
  vowelFilter: (text: string) => string;
  isDialUpPlaying: boolean;
  startDialUp: () => void;
  rageClicks: number;
  recordRageClick: (elementId: string) => Promise<void>;
  lockUntil: number | null;
  triggerLockout: (seconds?: number) => void;
  isScreenShaking: boolean;
  triggerScreenShake: () => void;
  rageToast: string | null;
}

const ChaosContext = createContext<ChaosContextType | undefined>(undefined);

export const ChaosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expertMode, setExpertMode] = useState<boolean>(() => {
    return localStorage.getItem('agro_expert_mode') === 'true';
  });
  const [isDialUpPlaying, setIsDialUpPlaying] = useState<boolean>(false);
  const [rageClicks, setRageClicks] = useState<number>(0);
  const [lockUntil, setLockUntil] = useState<number | null>(null);
  const [isScreenShaking, setIsScreenShaking] = useState<boolean>(false);
  const [rageToast, setRageToast] = useState<string | null>(null);

  const toggleExpertMode = () => {
    setExpertMode((prev) => {
      const next = !prev;
      localStorage.setItem('agro_expert_mode', String(next));
      sounds.playBuzzer();
      return next;
    });
  };

  // Section 9: "Users can toggle 'Expert Mode' which disables all vowels in the application UI."
  const vowelFilter = useCallback(
    (text: string): string => {
      if (!expertMode) return text;
      return text.replace(/[aeiouAEIOU]/g, '');
    },
    [expertMode]
  );

  const startDialUp = () => {
    setIsDialUpPlaying(true);
    sounds.playDialUp(10);
    setTimeout(() => setIsDialUpPlaying(false), 10000);
  };

  const triggerScreenShake = () => {
    setIsScreenShaking(true);
    sounds.playExplosion();
    setTimeout(() => setIsScreenShaking(false), 450);
  };

  const triggerLockout = (seconds: number = 15) => {
    const until = Date.now() + seconds * 1000;
    setLockUntil(until);
    sounds.playBuzzer();
  };

  // Countdown timer for lockout
  useEffect(() => {
    if (!lockUntil) return;
    const interval = setInterval(() => {
      if (Date.now() >= lockUntil) {
        setLockUntil(null);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [lockUntil]);

  const recordRageClick = async (elementId: string) => {
    setRageClicks((c) => c + 1);
    sounds.playClick();

    // Show temporary hostile toast
    const toasts = [
      "RAGE DETECTED (Empathy Level: 0.00%)",
      "KINETIC ANGER REGISTERED BY SOIL SENSORS",
      "THE MORE YOU CLICK, THE MORE YOUR CORN SUFFERS",
      "EMPATHY EXHAUSTED: PLEASE DESIST",
    ];
    setRageToast(toasts[Math.floor(Math.random() * toasts.length)]);
    setTimeout(() => setRageToast(null), 3000);

    try {
      await fetch('/api/telemetry/rage-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ elementId }),
      });
    } catch {
      // Telemetry server indifference
    }
  };

  // Global listener for fast clicking (rage clicks)
  useEffect(() => {
    let clickTimestamps: number[] = [];
    const handleDocumentClick = (e: MouseEvent) => {
      const now = Date.now();
      clickTimestamps.push(now);
      // Keep only clicks within the last 1000ms
      clickTimestamps = clickTimestamps.filter((t) => now - t < 1000);

      if (clickTimestamps.length >= 3) {
        const target = e.target as HTMLElement;
        const targetId = target?.id || target?.tagName || 'unidentified_victim_element';
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
        rageClicks,
        recordRageClick,
        lockUntil,
        triggerLockout,
        isScreenShaking,
        triggerScreenShake,
        rageToast,
      }}
    >
      <div className={`${isScreenShaking ? 'animate-screen-shake' : ''} min-h-screen`}>
        {children}

        {/* Global Hostile Rage Toast */}
        {rageToast && (
          <div className="fixed bottom-4 right-4 z-50 bg-red-600 text-yellow-300 font-extrabold px-5 py-3 border-4 border-yellow-300 shadow-[6px_6px_0px_#000] animate-bounce text-sm uppercase tracking-widest font-mono">
            ⚠️ {expertMode ? rageToast.replace(/[aeiouAEIOU]/g, '') : rageToast}
          </div>
        )}

        {/* Browser Lock Screen Freeze (Section 5) */}
        {lockUntil && (
          <div className="fixed inset-0 z-[100000] bg-black/95 flex flex-col items-center justify-center p-6 text-center select-none backdrop-blur-md">
            <div className="w-24 h-24 border-8 border-toxic-green border-t-transparent rounded-full animate-spin mb-6"></div>
            <h2 className="text-3xl font-black text-toxic-green tracking-widest mb-3 font-mono phosphor-glow">
              {expertMode
                ? "BRWSR LCKD: CLBRTNG STRM DSPSHR".replace(/[aeiouAEIOU]/g, '')
                : "BROWSER LOCKED: CALIBRATING ATMOSPHERIC DESPAIR"}
            </h2>
            <p className="text-yellow-400 font-mono max-w-lg mb-6 text-lg">
              {expertMode
                ? "Y clckd th mt bttn. Th tmsphe dsn't cr bt yr cnfnct. Pls wnt whl yr clld fld drwns."
                : "You clicked the mute button. The troposphere does not care about your acoustic comfort. Please wait while your unplanted field drowns in synthetic precipitation."}
            </p>
            <div className="text-5xl font-mono text-red-500 font-black animate-pulse">
              {Math.max(0, Math.ceil((lockUntil - Date.now()) / 1000))}s REMAINING
            </div>
            <p className="text-xs text-gray-500 mt-6 font-mono">
              (Interactive controls disabled. Breathing is discouraged during calibration.)
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
