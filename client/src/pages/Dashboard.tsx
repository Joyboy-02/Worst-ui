import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useChaos } from '../context/ChaosContext';
import { useAuth } from '../context/AuthContext';
import { TeleportingGrid } from '../components/TeleportingGrid';
import { StrobeWarning } from '../components/StrobeWarning';
import {
  Activity,
  Droplets,
  Flame,
  Bug,
  FileCheck,
  TrendingDown,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { vowelFilter, rageClicks, recordRageClick } = useChaos();
  const { user } = useAuth();

  const [soilMoisture, setSoilMoisture] = useState<number>(14.2);
  const [nitrogenDrift, setNitrogenDrift] = useState<number>(38);
  const [locustProximity, setLocustProximity] = useState<number>(4.2);

  useEffect(() => {
    const interval = setInterval(() => {
      setSoilMoisture((prev) => +(prev + (Math.random() * 2 - 1)).toFixed(1));
      setNitrogenDrift((prev) => Math.max(10, Math.min(120, Math.round(prev + (Math.random() * 6 - 3)))));
      setLocustProximity((prev) => +(Math.max(0.2, prev + (Math.random() * 0.4 - 0.25))).toFixed(2));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-forester-dark text-parchment-drab p-4 md:p-8 select-none">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-bureau-green pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-subdued-fern rounded-full animate-ping"></span>
              <span className="text-[11px] font-mono text-regulatory-gold uppercase tracking-wider">
                {vowelFilter('DIVISION OF TOPSOIL OVERSIGHT — ARABLE TELEMETRY LOG')}
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-serif font-bold text-parchment-drab tracking-tight mt-1">
              {vowelFilter('MANDATORY SOIL DEGRADATION TELEMETRY HUB')}
            </h1>
            <p className="text-xs text-lichen-stone font-mono mt-1">
              {vowelFilter('Officer-in-Charge')}: @{vowelFilter(user?.username || 'officer_vance_88')} |{' '}
              {vowelFilter('Compliance Grade')}: {user?.chaos_tolerance_score || 85}%
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/advisory/new"
              className="bg-bureau-green hover:bg-officer-moss text-parchment-drab font-mono font-bold text-xs md:text-sm px-5 py-2.5 border border-regulatory-gold shadow-sm transition-colors"
            >
              + {vowelFilter('File Form 14: Agronomic Advisory Request')}
            </Link>
          </div>
        </div>

        <StrobeWarning />

        {/* Teleporting Grid */}
        <TeleportingGrid>
          {/* Widget 1: Soil Acidity */}
          <div className="bg-peat-dark border border-bureau-green p-4 h-full flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-bureau-green pb-2">
                <span className="text-xs font-serif font-bold text-parchment-drab flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-regulatory-gold" />
                  {vowelFilter('SOIL pH & ACIDIFICATION PROFILE')}
                </span>
                <span className="text-[10px] text-warning-rust font-mono font-bold">pH 5.1 (CORROSIVE)</span>
              </div>
              <div className="space-y-3 font-mono text-xs text-parchment-muted">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>{vowelFilter('Hydrogen Ion Activity')}</span>
                    <span className="text-warning-rust font-bold">89.4%</span>
                  </div>
                  <div className="w-full bg-forester-dark h-2 border border-bureau-green">
                    <div className="bg-warning-rust h-full w-[89.4%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>{vowelFilter('Limestone Neutralization Deficit')}</span>
                    <span className="text-regulatory-gold font-bold">3.8 t/ha</span>
                  </div>
                  <div className="w-full bg-forester-dark h-2 border border-bureau-green">
                    <div className="bg-regulatory-gold h-full w-[72%]"></div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-lichen-stone font-mono mt-4 italic">
              * Soluble aluminum ions are actively destabilizing root cell elongation.
            </p>
          </div>

          {/* Widget 2: NPK Volatility Matrix */}
          <div className="bg-peat-dark border border-bureau-green p-4 h-full flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-bureau-green pb-2">
                <span className="text-xs font-serif font-bold text-parchment-drab flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-regulatory-gold" />
                  {vowelFilter('NPK MACRONUTRIENT LEDGER')}
                </span>
                <span className="text-[10px] text-lichen-stone font-mono">AUDITED</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center font-mono py-2">
                <div className="bg-forester-dark p-2 border border-bureau-green">
                  <div className="text-lg font-bold text-parchment-drab">{nitrogenDrift}</div>
                  <div className="text-[10px] text-lichen-stone">Nitrogen (N)</div>
                </div>
                <div className="bg-forester-dark p-2 border border-bureau-green">
                  <div className="text-lg font-bold text-parchment-drab">14</div>
                  <div className="text-[10px] text-lichen-stone">Phos (P)</div>
                </div>
                <div className="bg-forester-dark p-2 border border-bureau-green">
                  <div className="text-lg font-bold text-parchment-drab">28</div>
                  <div className="text-[10px] text-lichen-stone">Potas (K)</div>
                </div>
              </div>
            </div>
            <div className="text-[10px] text-parchment-muted font-mono mt-3 bg-forester-dark p-2 border border-bureau-green">
              § {vowelFilter('Notice: Soil phosphorus retention requires immediate agricultural gypsum buffer.')}
            </div>
          </div>

          {/* Widget 3: Biological Threats */}
          <div className="bg-peat-dark border border-bureau-green p-4 h-full flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-bureau-green pb-2">
                <span className="text-xs font-serif font-bold text-parchment-drab flex items-center gap-1.5">
                  <Bug className="w-3.5 h-3.5 text-warning-rust" />
                  {vowelFilter('ENTOMOLOGICAL & PEST REGISTRY')}
                </span>
                <span className="text-[10px] text-warning-rust font-mono font-bold animate-pulse">ELEVATED</span>
              </div>
              <div className="space-y-2 font-mono text-xs text-parchment-muted">
                <div className="flex justify-between">
                  <span>{vowelFilter('Migratory Locust Front')}</span>
                  <span className="text-warning-rust font-bold">{locustProximity} km away</span>
                </div>
                <div className="flex justify-between">
                  <span>{vowelFilter('Root Nematode Density')}</span>
                  <span className="text-regulatory-gold font-bold">1,840 / 100g</span>
                </div>
                <div className="flex justify-between">
                  <span>{vowelFilter('Fusarium Wilt Spores')}</span>
                  <span className="text-warning-rust font-bold">AIRBORNE</span>
                </div>
              </div>
            </div>
            <div className="w-full bg-forester-dark border border-bureau-green p-2 text-center text-[10px] font-mono text-lichen-stone mt-3">
              {vowelFilter('Estimated Defoliation Progression')}: 44 mins
            </div>
          </div>

          {/* Widget 4: Rage Click & Audit Telemetry */}
          <div className="bg-peat-dark border border-bureau-green p-4 h-full flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-bureau-green pb-2">
                <span className="text-xs font-serif font-bold text-parchment-drab flex items-center gap-1.5">
                  <TrendingDown className="w-3.5 h-3.5 text-regulatory-gold" />
                  {vowelFilter('KINETIC FRUSTRATION TELEMETRY')}
                </span>
                <span className="text-[10px] text-lichen-stone font-mono">EMPATHY: 0.00%</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="text-3xl font-serif font-bold text-parchment-drab">{rageClicks}</div>
                  <div className="text-[10px] text-lichen-stone font-mono uppercase">
                    {vowelFilter('Recorded Impatient Clicks')}
                  </div>
                </div>
                <button
                  onClick={() => recordRageClick('dashboard_audit_frustration')}
                  className="bg-forester-dark hover:bg-peat-dark text-parchment-drab text-xs font-mono px-3 py-2 border border-bureau-green"
                >
                  {vowelFilter('File Grievance')}
                </button>
              </div>
            </div>
            <p className="text-[10px] text-lichen-stone font-mono mt-3">
              * Every click is logged in the permanent Municipal Soil Degradation Record.
            </p>
          </div>

          {/* Widget 5: Hydrological Field Capacity */}
          <div className="bg-peat-dark border border-bureau-green p-4 h-full flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-bureau-green pb-2">
                <span className="text-xs font-serif font-bold text-parchment-drab flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-subdued-fern" />
                  {vowelFilter('HYDROLOGICAL REGIME')}
                </span>
                <span className="text-[10px] text-regulatory-gold font-mono">{soilMoisture}% MOISTURE</span>
              </div>
              <div className="space-y-2 font-mono text-xs text-parchment-muted">
                <div className="flex justify-between">
                  <span>{vowelFilter('Permanent Wilting Point')}</span>
                  <span className="text-warning-rust font-bold">12.0%</span>
                </div>
                <div className="flex justify-between">
                  <span>{vowelFilter('Field Holding Capacity')}</span>
                  <span>34.0%</span>
                </div>
                <div className="flex justify-between">
                  <span>{vowelFilter('Approved Emoji Scale')}</span>
                  <span className="text-base">🌵 🏜️ 🪣 🌊</span>
                </div>
              </div>
            </div>
            <div className="text-[10px] text-lichen-stone font-mono mt-3">
              {vowelFilter('Rhizosphere moisture levels are below statutory agricultural comfort standards.')}
            </div>
          </div>

          {/* Widget 6: Mandatory Actions */}
          <div className="bg-peat-dark border border-bureau-green p-4 h-full flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-bureau-green pb-2">
                <span className="text-xs font-serif font-bold text-parchment-drab flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-subdued-fern" />
                  {vowelFilter('STATUTORY PROTOCOLS')}
                </span>
              </div>
              <div className="space-y-2 font-mono text-xs">
                <Link
                  to="/advisory/new"
                  className="block w-full bg-bureau-green hover:bg-officer-moss text-parchment-drab font-bold p-2 text-center border border-regulatory-gold/60"
                >
                  {vowelFilter('Complete 7-Step Advisory Form')}
                </Link>
                <Link
                  to="/history"
                  className="block w-full bg-forester-dark hover:bg-peat-dark text-parchment-drab p-2 text-center border border-bureau-green"
                >
                  {vowelFilter('Examine Historical Registry')}
                </Link>
              </div>
            </div>
            <div className="text-[10px] text-lichen-stone font-mono mt-3 text-center">
              § {vowelFilter('Modules rearrange automatically every 12 seconds per statutory protocol.')}
            </div>
          </div>
        </TeleportingGrid>
      </div>
    </div>
  );
};
