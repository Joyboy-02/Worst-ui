import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useChaos } from '../context/ChaosContext';
import { useAuth } from '../context/AuthContext';
import { TeleportingGrid } from '../components/TeleportingGrid';
import { StrobeWarning } from '../components/StrobeWarning';
import {
  Activity,
  Droplets,
  AlertTriangle,
  Flame,
  Bug,
  Compass,
  Cpu,
  RefreshCw,
  Skull,
  TrendingDown,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { vowelFilter, rageClicks, recordRageClick } = useChaos();
  const { user } = useAuth();

  // Simulated live fluctuating metrics
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
    <div className="min-h-screen bg-black text-white p-4 md:p-8 select-none">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-4 border-toxic-green pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
              <span className="text-xs font-mono text-pink-500 tracking-widest font-black uppercase">
                {vowelFilter('REAL-TIME TELEMETRY CRISIS CENTER')}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black font-impact text-toxic-green tracking-tight phosphor-glow">
              {vowelFilter('THE SHIFTING SANDS DASHBOARD')}
            </h1>
            <p className="text-xs md:text-sm text-yellow-300 font-mono">
              {vowelFilter('Agronomist Operator')}: @{vowelFilter(user?.username || 'existential_farmer_99')} |{' '}
              {vowelFilter('Chaos Score')}: {user?.chaos_tolerance_score || 85}%
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/advisory/new"
              className="bg-toxic-green hover:bg-yellow-400 text-black font-mono font-black text-sm px-5 py-3 border-2 border-white shadow-[4px_4px_0px_#ff007f] transition-transform active:scale-95"
            >
              + {vowelFilter('Initiate New Advisory Ordeal')}
            </Link>
          </div>
        </div>

        {/* Sensory Overload Alert */}
        <StrobeWarning />

        {/* Teleporting Grid of Widgets */}
        <TeleportingGrid>
          {/* Widget 1: Soil Chemistry & Acidification */}
          <div className="bg-neutral-950 border-3 border-toxic-green p-5 h-full flex flex-col justify-between shadow-[5px_5px_0px_#00ff66]">
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-neutral-800 pb-2">
                <span className="text-xs font-mono font-bold text-toxic-green flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-toxic-green" />
                  {vowelFilter('SOIL ACIDITY STATUS')}
                </span>
                <span className="text-[10px] text-red-500 font-mono animate-pulse">pH 5.1 (CORROSIVE)</span>
              </div>
              <div className="space-y-3 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-gray-300 mb-1">
                    <span>{vowelFilter('Hydrogen Ion Aggressiveness')}</span>
                    <span className="text-red-400 font-bold">89.4%</span>
                  </div>
                  <div className="w-full bg-neutral-900 h-2.5 border border-neutral-700">
                    <div className="bg-red-600 h-full w-[89.4%] animate-pulse"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-gray-300 mb-1">
                    <span>{vowelFilter('Calcium Carbonate Deficit')}</span>
                    <span className="text-yellow-400 font-bold">3.8 tons/ha</span>
                  </div>
                  <div className="w-full bg-neutral-900 h-2.5 border border-neutral-700">
                    <div className="bg-yellow-500 h-full w-[72%]"></div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-gray-500 font-mono mt-4 italic">
              * Aluminum ions are actively dissolving root tips at 0.3mm/hr.
            </p>
          </div>

          {/* Widget 2: NPK Volatility Matrix */}
          <div className="bg-neutral-950 border-3 border-hostile-pink p-5 h-full flex flex-col justify-between shadow-[5px_5px_0px_#ff007f]">
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-neutral-800 pb-2">
                <span className="text-xs font-mono font-bold text-hostile-pink flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-hostile-pink" />
                  {vowelFilter('NPK MACRONUTRIENT BALANCE')}
                </span>
                <span className="text-[10px] text-yellow-400 font-mono">VOLATILE</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center font-mono py-2">
                <div className="bg-neutral-900 p-2 border border-neutral-800">
                  <div className="text-xl font-black text-toxic-green">{nitrogenDrift}</div>
                  <div className="text-[10px] text-gray-400">Nitrogen (N)</div>
                </div>
                <div className="bg-neutral-900 p-2 border border-neutral-800">
                  <div className="text-xl font-black text-yellow-400">14</div>
                  <div className="text-[10px] text-gray-400">Phos (P)</div>
                </div>
                <div className="bg-neutral-900 p-2 border border-neutral-800">
                  <div className="text-xl font-black text-cyan-400">28</div>
                  <div className="text-[10px] text-gray-400">Potas (K)</div>
                </div>
              </div>
            </div>
            <div className="text-[10px] text-yellow-300 font-mono mt-3 bg-neutral-900 p-2 border border-neutral-800">
              ⚠️ {vowelFilter('Warning: Phosphorus uptake blocked by fungal apathy.')}
            </div>
          </div>

          {/* Widget 3: Subterranean Locust Radar */}
          <div className="bg-neutral-950 border-3 border-yellow-400 p-5 h-full flex flex-col justify-between shadow-[5px_5px_0px_#ffff00]">
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-neutral-800 pb-2">
                <span className="text-xs font-mono font-bold text-yellow-400 flex items-center gap-1.5">
                  <Bug className="w-4 h-4 text-yellow-400" />
                  {vowelFilter('BIOLOGICAL THREAT RADAR')}
                </span>
                <span className="text-[10px] text-red-500 font-mono font-bold animate-ping">CRITICAL</span>
              </div>
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">{vowelFilter('Desert Locust Swarm')}</span>
                  <span className="text-red-400 font-bold">{locustProximity} km away</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{vowelFilter('Root Nematode Density')}</span>
                  <span className="text-yellow-400 font-bold">1,840 / 100g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{vowelFilter('Fusarium Wilt Spores')}</span>
                  <span className="text-hostile-pink font-bold">DETECTED</span>
                </div>
              </div>
            </div>
            <div className="w-full bg-red-950 border border-red-700 p-2 text-center text-[10px] font-mono text-yellow-200 mt-3">
              {vowelFilter('Estimated Defoliation Time')}: 44 mins
            </div>
          </div>

          {/* Widget 4: Frustration & Rage Click Telemetry */}
          <div className="bg-neutral-950 border-3 border-cyan-400 p-5 h-full flex flex-col justify-between shadow-[5px_5px_0px_#00ffff]">
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-neutral-800 pb-2">
                <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4 text-cyan-400" />
                  {vowelFilter('UI RAGE CLICK TELEMETRY')}
                </span>
                <span className="text-[10px] text-pink-400 font-mono">EMPATHY: 0.00%</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="text-3xl font-black text-cyan-300 font-mono">{rageClicks}</div>
                  <div className="text-[10px] text-gray-400 font-mono uppercase">
                    {vowelFilter('Registered Hostile Clicks')}
                  </div>
                </div>
                <button
                  onClick={() => recordRageClick('dashboard_vent_button')}
                  className="bg-red-600 hover:bg-red-500 text-yellow-200 text-xs font-mono font-bold px-3 py-2 border-2 border-white shadow-[2px_2px_0px_#000] active:scale-95"
                >
                  {vowelFilter('Vent Rage (Click Me)')}
                </button>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 font-mono mt-3">
              * Every click sends kinetic frustration logs to Supabase audit tables.
            </p>
          </div>

          {/* Widget 5: Soil Hydrology & Desiccation */}
          <div className="bg-neutral-950 border-3 border-neutral-600 p-5 h-full flex flex-col justify-between shadow-[5px_5px_0px_#ffffff]">
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-neutral-800 pb-2">
                <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-cyan-400" />
                  {vowelFilter('HYDROLOGICAL MATRIX')}
                </span>
                <span className="text-[10px] text-yellow-400 font-mono">{soilMoisture}% MOISTURE</span>
              </div>
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">{vowelFilter('Wilting Point')}</span>
                  <span className="text-red-400 font-bold">12.0% (NEAR CATASTROPHE)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{vowelFilter('Field Capacity')}</span>
                  <span className="text-gray-400">34.0%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{vowelFilter('Irrigation Emoji Scale')}</span>
                  <span className="text-base">🌵 🏜️ ☀️</span>
                </div>
              </div>
            </div>
            <div className="text-[10px] text-gray-400 font-mono mt-3">
              {vowelFilter('Soil moisture is insufficient to sustain hope or chloroplasts.')}
            </div>
          </div>

          {/* Widget 6: Hostile Quick Actions */}
          <div className="bg-neutral-950 border-3 border-red-600 p-5 h-full flex flex-col justify-between shadow-[5px_5px_0px_#ff0000]">
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-neutral-800 pb-2">
                <span className="text-xs font-mono font-bold text-red-500 flex items-center gap-1.5">
                  <Skull className="w-4 h-4 text-red-500" />
                  {vowelFilter('CRISIS PROTOCOLS')}
                </span>
              </div>
              <div className="space-y-2 font-mono text-xs">
                <Link
                  to="/advisory/new"
                  className="block w-full bg-toxic-green hover:bg-toxic-green/90 text-black font-bold p-2 text-center border border-white"
                >
                  {vowelFilter('Submit 7-Step Multi-Page Form')}
                </Link>
                <Link
                  to="/history"
                  className="block w-full bg-neutral-900 hover:bg-neutral-800 text-yellow-300 font-bold p-2 text-center border border-neutral-700"
                >
                  {vowelFilter('Inspect Infinite Void of History')}
                </Link>
              </div>
            </div>
            <div className="text-[10px] text-red-400 font-mono mt-3 text-center">
              ⚠️ {vowelFilter('All widgets will rearrange in 12s or on mouse velocity.')}
            </div>
          </div>
        </TeleportingGrid>
      </div>
    </div>
  );
};
