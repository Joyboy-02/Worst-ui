import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useChaos } from '../context/ChaosContext';
import { CookieWallModal } from '../components/CookieWallModal';
import { StrobeWarning } from '../components/StrobeWarning';
import { Skull, AlertTriangle, Bug, Zap, ArrowRight, Flame } from 'lucide-react';

export const Landing: React.FC = () => {
  const { vowelFilter, startDialUp, recordRageClick } = useChaos();
  const [fleeOffset, setFleeOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Fleeing CTA button: moves away when hovered
  const handleFlee = () => {
    const randomX = Math.floor(Math.random() * 260) - 130;
    const randomY = Math.floor(Math.random() * 160) - 80;
    setFleeOffset({ x: randomX, y: randomY });
    recordRageClick('cta_flee_button');
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden select-none pb-20">
      {/* 4-Layer Modal Cookie Consent Wall */}
      <CookieWallModal />

      {/* Hero Marquee */}
      <div className="bg-hostile-pink text-black font-black font-mono py-1.5 px-4 overflow-hidden border-b-2 border-black">
        <div className="animate-marquee-reverse whitespace-nowrap text-xs md:text-sm">
          🚨 SYSTEM WARNING: ALL SOWN CROPS FACE CERTAIN ENTROPIC DISSOLUTION // GEMINI 2.5 FLASH CALCULATING PLANETARY COLLAPSE TIMELINES // PLEASE REMAIN UNCOMFORTABLE 🚨
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-10">
        {/* Sensory Overload Weather Strobe Feed */}
        <StrobeWarning />

        {/* Hero Section */}
        <div className="border-4 border-toxic-green p-6 md:p-12 my-8 bg-neutral-950 relative shadow-[12px_12px_0px_#ffff00]">
          {/* Sarcastic Badge */}
          <div className="inline-block bg-red-600 text-yellow-300 font-mono font-black text-xs px-3 py-1 border-2 border-yellow-300 mb-4 animate-bounce">
            ⚠️ {vowelFilter('OFFICIAL WORST UI / ANTI-PATTERN CASE STUDY')}
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black font-impact tracking-tight text-white mb-6 uppercase leading-none">
            <span className="text-toxic-green phosphor-glow block">
              {vowelFilter('AGRICULTURAL')}
            </span>
            <span className="text-hostile-pink block">
              {vowelFilter('CROP ADVISORY')}
            </span>
            <span className="text-yellow-400 block text-2xl sm:text-4xl md:text-5xl mt-2 font-mono">
              {vowelFilter('ASSISTANT OF DOOM')}
            </span>
          </h1>

          <p className="text-gray-300 font-mono text-sm md:text-lg max-w-3xl leading-relaxed mb-8 border-l-4 border-yellow-400 pl-4 bg-neutral-900/50 py-2">
            {vowelFilter(
              'A production-grade, full-stack agrotechnology platform delivering scientifically authentic soil health, pest triage, and fertilizer formulations powered by Google Gemini 2.5 Flash—while subjecting the farmer to weaponized cognitive friction and hostile layout dynamics.'
            )}
          </p>

          {/* Call to Actions with Fleeing Button */}
          <div className="flex flex-wrap items-center gap-6 pt-4">
            <div className="relative">
              <Link
                to="/advisory/new"
                onMouseEnter={handleFlee}
                style={{
                  transform: `translate(${fleeOffset.x}px, ${fleeOffset.y}px)`,
                  transition: 'transform 0.12s ease-out',
                }}
                className="inline-block bg-toxic-green hover:bg-toxic-green/90 text-black font-mono font-black text-base md:text-lg px-8 py-4 border-4 border-white shadow-[6px_6px_0px_#ff007f] cursor-pointer"
              >
                {vowelFilter('Submit Crop to The Ordeal')} →
              </Link>
            </div>

            <Link
              to="/dashboard"
              className="bg-neutral-900 hover:bg-neutral-800 text-yellow-300 font-mono font-bold text-sm md:text-base px-6 py-4 border-2 border-yellow-400 shadow-[4px_4px_0px_#fff]"
            >
              {vowelFilter('Enter Telemetry Hub')}
            </Link>

            <button
              onClick={startDialUp}
              className="bg-cyan-950 hover:bg-cyan-900 text-cyan-300 font-mono font-bold text-xs px-4 py-3 border border-cyan-400"
            >
              🔊 {vowelFilter('Play Dial-Up Modem Screech')}
            </button>
          </div>
        </div>

        {/* Live Nihilistic Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
          {[
            { label: 'Harvest Failure Probability', val: '99.4%', color: 'text-red-500' },
            { label: 'Global Topsoil Erosion Rate', val: '24 Billion T/yr', color: 'text-yellow-400' },
            { label: 'System Empathy Calibration', val: '0.000%', color: 'text-cyan-400' },
            { label: 'Agronomist Despair Index', val: 'MAXIMUM', color: 'text-hostile-pink' },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-neutral-950 border-2 border-neutral-700 p-4 text-center font-mono shadow-[4px_4px_0px_#000]"
            >
              <div className={`text-xl md:text-2xl font-black ${stat.color} mb-1`}>
                {stat.val}
              </div>
              <div className="text-[11px] text-gray-400 uppercase tracking-wider">
                {vowelFilter(stat.label)}
              </div>
            </div>
          ))}
        </div>

        {/* Sarcastic Testimonials */}
        <div className="my-12 border-2 border-dashed border-neutral-700 p-6 bg-black">
          <h2 className="text-xl font-black font-mono text-toxic-green mb-4 flex items-center gap-2">
            <Skull className="w-5 h-5 text-red-500" />
            {vowelFilter('VERIFIED FARMER GRIEVANCES & TESTIMONIALS')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs text-gray-300">
            <div className="p-4 bg-neutral-900 border-l-4 border-red-500">
              <p className="italic">
                "{vowelFilter('The soil pH advice was 100% scientifically correct, but while trying to click Submit, the button swapped with Reset and deleted my life savings in sorghum.')}"
              </p>
              <span className="block mt-2 text-yellow-400 font-bold">— Farmer Zebadiah, Nebraska</span>
            </div>
            <div className="p-4 bg-neutral-900 border-l-4 border-yellow-500">
              <p className="italic">
                "{vowelFilter('I spent 45 minutes solving the Minesweeper grid to find out my maize needed urea. The AI called me a carbon parasite. 10/10 agronomy.')}"
              </p>
              <span className="block mt-2 text-yellow-400 font-bold">— Agronomist Sarah, Rift Valley</span>
            </div>
            <div className="p-4 bg-neutral-900 border-l-4 border-toxic-green">
              <p className="italic">
                "{vowelFilter('I muted the weather strobe and my browser froze for 15 seconds while a digital locust ate my mouse cursor. Truly exceptional engineering.')}"
              </p>
              <span className="block mt-2 text-yellow-400 font-bold">— Extension Worker Dave, Queensland</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
