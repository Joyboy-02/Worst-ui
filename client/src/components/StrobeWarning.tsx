import React, { useState, useEffect } from 'react';
import { useChaos } from '../context/ChaosContext';
import { BellOff, Wind, AlertCircle } from 'lucide-react';

const SEVERE_WEATHER_NOTICES = [
  {
    type: 'EROSION_ADVISORY_LEVEL_IV',
    title: 'SEVERE METEOROLOGICAL WARNING: PRECIPITATION & RUNOFF ANOMALY',
    details: 'Barometric plunge observed across northern quadrants. Estimated topsoil sheet displacement: 4.8 tons/hectare.',
  },
  {
    type: 'BIOLOGICAL_VORTEX_INDEX',
    title: 'ENTOMOLOGICAL HAZARD: LEPIDOPTERAN CATERPILLAR CONVERGENCE',
    details: 'Defoliation velocity assessed at 1.2 hectares/hour. Biological balance in severe regulatory deficit.',
  },
  {
    type: 'MICROBIAL_DESICCATION_EVENT',
    title: 'GROUND HYDROLOGY NOTICE: SUBTERRANEAN WILTING THRESHOLD REACHED',
    details: 'Rhizosphere moisture depleted below 11.4%. Mycorrhizal fungal networks have entered dormant distress state.',
  },
];

export const StrobeWarning: React.FC = () => {
  const [currentNoticeIndex, setCurrentNoticeIndex] = useState(0);
  const { triggerLockout, vowelFilter } = useChaos();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNoticeIndex((prev) => (prev + 1) % SEVERE_WEATHER_NOTICES.length);
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  const activeNotice = SEVERE_WEATHER_NOTICES[currentNoticeIndex];

  return (
    <div className="relative border border-warning-rust/70 bg-peat-dark my-4 shadow-sm select-none">
      <div className="p-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-2 bg-forester-dark border border-warning-rust text-warning-rust">
            <Wind className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-forester-dark text-regulatory-gold text-[10px] font-mono px-2 py-0.5 border border-regulatory-gold/40">
                {vowelFilter('MANDATORY ENVIRONMENTAL ADVISORY')}
              </span>
              <span className="text-[11px] font-mono text-lichen-stone uppercase">
                {activeNotice.type}
              </span>
            </div>
            <h3 className="text-sm md:text-base font-serif font-bold text-parchment-drab tracking-wide mt-0.5">
              {vowelFilter(activeNotice.title)}
            </h3>
            <p className="text-xs font-mono text-parchment-muted/80">
              {vowelFilter(activeNotice.details)}
            </p>
          </div>
        </div>

        {/* Mute button that triggers 15s hold */}
        <button
          onClick={() => triggerLockout(15)}
          id="strobe-mute-trap"
          className="whitespace-nowrap bg-forester-dark hover:bg-peat-dark text-parchment-muted hover:text-parchment-drab font-mono text-xs px-3.5 py-2 border border-lichen-stone/50 flex items-center gap-2 transition-colors"
          title="Dismissing this active alert triggers mandatory 15-second compliance hold"
        >
          <BellOff className="w-3.5 h-3.5 text-warning-rust" />
          <span>{vowelFilter('Silence Advisory (15s Administrative Hold)')}</span>
        </button>
      </div>
    </div>
  );
};
