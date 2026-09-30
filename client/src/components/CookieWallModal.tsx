import React, { useState, useEffect } from 'react';
import { useChaos } from '../context/ChaosContext';
import { ShieldCheck, Cookie, AlertCircle, RefreshCw } from 'lucide-react';

export const CookieWallModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    return sessionStorage.getItem('agro_cookie_survived') !== 'true';
  });
  const [currentLayer, setCurrentLayer] = useState<number>(1);
  const [rejectPos, setRejectPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [sliderVal, setSliderVal] = useState<number>(50);
  const [windowResized, setWindowResized] = useState<boolean>(false);
  const [individualTrackers, setIndividualTrackers] = useState<boolean[]>([true, true, true, true, true]);
  const { vowelFilter, startDialUp } = useChaos();

  // Resize window detection bypass
  useEffect(() => {
    let initialWidth = window.innerWidth;
    const handleResize = () => {
      if (Math.abs(window.innerWidth - initialWidth) > 80) {
        setWindowResized(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Runaway button effect for "Reject All"
  const handleRejectHover = () => {
    const randomX = Math.floor(Math.random() * 300) - 150;
    const randomY = Math.floor(Math.random() * 200) - 100;
    setRejectPos({ x: randomX, y: randomY });
  };

  const handleBypass = () => {
    setIsOpen(false);
    sessionStorage.setItem('agro_cookie_survived', 'true');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99990] bg-black/90 flex items-center justify-center p-2 backdrop-blur-sm select-none">
      {/* 98% viewport coverage */}
      <div className="w-[98vw] h-[95vh] bg-neutral-900 border-4 border-toxic-green flex flex-col justify-between p-4 md:p-6 shadow-[10px_10px_0px_#ff007f] relative overflow-y-auto">
        {/* Header */}
        <div className="border-b-2 border-toxic-green pb-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Cookie className="w-8 h-8 text-yellow-400 animate-spin" />
            <div>
              <h2 className="text-xl md:text-2xl font-black font-mono text-toxic-green tracking-wider phosphor-glow">
                {vowelFilter('MANDATORY SOIL COOKIE CONSENT PROTOCOL')}
              </h2>
              <p className="text-xs text-pink-500 font-mono">
                {vowelFilter(`Layer ${currentLayer} of 4: Agronomic Surveillance Treaty of 1648`)}
              </p>
            </div>
          </div>

          <div className="text-right font-mono text-xs text-yellow-300">
            {windowResized ? (
              <button
                onClick={handleBypass}
                className="bg-toxic-green text-black px-3 py-1.5 font-bold border-2 border-white animate-bounce shadow-[2px_2px_0px_#fff]"
              >
                {vowelFilter('WINDOW RESIZE DETECTED: BYPASS WALL')}
              </button>
            ) : (
              <span className="hidden sm:inline text-gray-500 text-[10px]">
                {vowelFilter('(Bypass Hint: Resize window width by 80px or solve the ordeal)')}
              </span>
            )}
          </div>
        </div>

        {/* Content depending on layer */}
        <div className="my-4 flex-1 overflow-y-auto font-mono text-xs md:text-sm text-gray-300 space-y-4">
          {currentLayer === 1 && (
            <div className="space-y-3">
              <div className="bg-black/60 p-3 border border-neutral-700 text-yellow-200 text-xs">
                {vowelFilter(
                  'We, our 4,821 telemetry affiliates, and local subterranean earthworms collect hyper-granular soil telemetry, biometric frustration data, and keystroke kinetic stress vectors to train AI agronomists on human despair.'
                )}
              </div>
              <div className="h-40 overflow-y-scroll p-3 bg-neutral-950 border border-neutral-800 text-[11px] text-gray-400 leading-relaxed font-mono">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Quod erat demonstrandum. Agrotechnica destructiva nihilism perpetuum...
              </div>
              <p className="text-xs text-red-400 font-bold">
                {vowelFilter('Notice: There is no close button. You cannot decline without consenting to decline.')}
              </p>
            </div>
          )}

          {currentLayer === 2 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-yellow-300">
                {vowelFilter('Layer 2: Calibrate Your Soil Nitrogen Acceptance Ratio')}
              </h3>
              <p className="text-xs text-gray-400">
                {vowelFilter('Adjust the slider until it hits the exact existential balance of 73%. Any deviation will trigger immediate reset.')}
              </p>
              <div className="p-4 bg-black border border-neutral-700 flex flex-col items-center">
                <span className="text-3xl font-black text-toxic-green font-mono mb-2">{sliderVal}%</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderVal}
                  onChange={(e) => setSliderVal(Number(e.target.value))}
                  className="w-full h-3 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-toxic-green"
                />
              </div>
            </div>
          )}

          {currentLayer === 3 && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-yellow-300">
                {vowelFilter('Layer 3: Granular Micro-Consent for Subterranean Organisms')}
              </h3>
              <p className="text-xs text-gray-400">
                {vowelFilter('You must uncheck each individual pest telemetry provider before continuing.')}
              </p>
              <div className="space-y-2 bg-black p-3 border border-neutral-700">
                {[
                  'Nematode Root Penetration Analytics Corp.',
                  'Aphid Honeydew Extraction Telemetry Ltd.',
                  'Soil Mycorrhizal Spore Advertising Partners',
                  'Nitrosomonas Bacteria Guilt Surveillance',
                  'Locust Swarm Early Warning (Monetized)',
                ].map((name, idx) => (
                  <label key={idx} className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={individualTrackers[idx]}
                      onChange={() => {
                        const updated = [...individualTrackers];
                        updated[idx] = !updated[idx];
                        setIndividualTrackers(updated);
                      }}
                      className="accent-pink-500 w-4 h-4"
                    />
                    <span>{vowelFilter(name)}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {currentLayer === 4 && (
            <div className="space-y-4 text-center py-6">
              <ShieldCheck className="w-16 h-16 text-toxic-green mx-auto animate-bounce" />
              <h3 className="text-xl font-black text-toxic-green font-mono">
                {vowelFilter('Layer 4: Final Psychological Oath')}
              </h3>
              <p className="text-xs text-yellow-200 max-w-md mx-auto">
                {vowelFilter('By proceeding, you pledge to submit to erratic layout shifts and accept that Gemini AI 2.5 Flash possesses higher agronomic intelligence than any mortal farmer.')}
              </p>
            </div>
          )}
        </div>

        {/* Hostile Actions */}
        <div className="border-t-2 border-toxic-green pt-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {/* Runaway Reject Button */}
            <button
              onMouseEnter={handleRejectHover}
              style={{
                transform: `translate(${rejectPos.x}px, ${rejectPos.y}px)`,
                transition: 'transform 0.15s ease-out',
              }}
              className="bg-red-700 hover:bg-red-800 text-white font-mono font-bold text-xs px-4 py-2 border-2 border-white shadow-[2px_2px_0px_#000]"
            >
              {vowelFilter('Reject All & Exit')}
            </button>

            {currentLayer > 1 && (
              <button
                onClick={() => setCurrentLayer((l) => l - 1)}
                className="bg-neutral-800 text-gray-400 font-mono text-xs px-3 py-2 border border-neutral-600"
              >
                {vowelFilter('Back')}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {currentLayer < 4 ? (
              <button
                onClick={() => {
                  if (currentLayer === 2 && sliderVal !== 73) {
                    alert('Nitrogen acceptance ratio is not 73%! The soil remains skeptical.');
                    return;
                  }
                  setCurrentLayer((l) => l + 1);
                }}
                className="bg-toxic-green text-black font-mono font-black text-xs md:text-sm px-6 py-2.5 border-2 border-white shadow-[3px_3px_0px_#ff007f] hover:bg-yellow-400 transition-colors"
              >
                {vowelFilter('Proceed to Next Ordeal')} →
              </button>
            ) : (
              <button
                onClick={handleBypass}
                className="bg-toxic-green text-black font-mono font-black text-sm px-8 py-3 border-2 border-white shadow-[4px_4px_0px_#ffff00] hover:bg-white animate-pulse"
              >
                {vowelFilter('Accept All 4,821 Trackers & Enter')}
              </button>
            )}
          </div>
        </div>

        {/* Hidden 1px escape pixel for clever users */}
        <button
          onClick={handleBypass}
          title="Hidden pixel bypass"
          className="absolute bottom-1 left-1 w-1 h-1 bg-transparent hover:bg-white cursor-pointer opacity-30"
        />
      </div>
    </div>
  );
};
