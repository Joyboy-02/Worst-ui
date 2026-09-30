import React, { useState, useEffect } from 'react';
import { useChaos } from '../context/ChaosContext';
import { AlertTriangle, BellOff, Zap } from 'lucide-react';

const ALERTS = [
  {
    type: 'BIOMETRIC_HAIL_SWARM',
    title: 'LEVEL-5 CROP APOCALYPSE: ACID HAIL & LOCUST CONVERGENCE',
    details: 'Barometric pressure plummeting. Topsoil detachment velocity 74 km/h.',
  },
  {
    type: 'SOLAR_DESICCATION_BURST',
    title: 'ATMOSPHERIC RADIAL ANOMALY: NITROGEN VAPORIZATION',
    details: 'Ambient ground temp 49°C. Chlorophyll degradation imminent within 14 minutes.',
  },
  {
    type: 'FUNGAL_SPORE_VORTEX',
    title: 'BIOLOGICAL HAZARD: ERGOT & RUST MICROSPORE FRONTS DETECTED',
    details: 'Spore density exceeds 4,000 ppm. Pray for cold front or accept blight.',
  },
];

export const StrobeWarning: React.FC = () => {
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);
  const { triggerLockout, vowelFilter } = useChaos();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAlertIndex((prev) => (prev + 1) % ALERTS.length);
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  const activeAlert = ALERTS[currentAlertIndex];

  return (
    <div className="relative overflow-hidden border-4 border-black my-4 shadow-[6px_6px_0px_#ff007f]">
      {/* Strobe animated container */}
      <div className="bg-red-600 animate-strobe-slow text-white p-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-black border-2 border-white animate-bounce">
              <Zap className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-black text-toxic-green text-[10px] font-mono font-black px-2 py-0.5 border border-toxic-green">
                  {vowelFilter('LIVE SENSORY OVERLOAD')}
                </span>
                <span className="text-xs font-mono font-bold text-yellow-300 animate-pulse">
                  {activeAlert.type}
                </span>
              </div>
              <h3 className="text-base md:text-lg font-black font-mono tracking-tight text-yellow-200 mt-0.5">
                {vowelFilter(activeAlert.title)}
              </h3>
              <p className="text-xs font-mono text-white opacity-95">
                {vowelFilter(activeAlert.details)}
              </p>
            </div>
          </div>

          {/* Mute button that locks browser for 15s */}
          <button
            onClick={() => triggerLockout(15)}
            id="strobe-mute-trap"
            className="whitespace-nowrap bg-black hover:bg-neutral-900 text-yellow-300 hover:text-white font-mono font-black text-xs px-4 py-2.5 border-2 border-yellow-300 shadow-[3px_3px_0px_#fff] flex items-center gap-2 transition-transform active:scale-95"
            title="Attempting to mute will calibrate atmospheric conditions (15-second browser lock)"
          >
            <BellOff className="w-4 h-4 text-red-500 animate-spin" />
            <span>{vowelFilter('Mute Alert & Restore Sanity')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
