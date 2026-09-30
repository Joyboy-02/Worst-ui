import React, { useState, useEffect } from 'react';
import { useChaos } from '../context/ChaosContext';
import { ShieldCheck, BookOpen, FileText } from 'lucide-react';

export const CookieWallModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    return sessionStorage.getItem('agro_cookie_survived') !== 'true';
  });
  const [currentLayer, setCurrentLayer] = useState<number>(1);
  const [rejectPos, setRejectPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [sliderVal, setSliderVal] = useState<number>(50);
  const [windowResized, setWindowResized] = useState<boolean>(false);
  const [individualTrackers, setIndividualTrackers] = useState<boolean[]>([true, true, true, true, true]);
  const { vowelFilter } = useChaos();

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

  const handleRejectHover = () => {
    const randomX = Math.floor(Math.random() * 320) - 160;
    const randomY = Math.floor(Math.random() * 220) - 110;
    setRejectPos({ x: randomX, y: randomY });
  };

  const handleBypass = () => {
    setIsOpen(false);
    sessionStorage.setItem('agro_cookie_survived', 'true');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99990] bg-forester-dark/95 flex items-center justify-center p-3 backdrop-blur-sm select-none">
      <div className="w-[98vw] h-[95vh] bg-forester-dark border-2 border-bureau-green flex flex-col justify-between p-4 md:p-6 shadow-2xl relative overflow-y-auto">
        {/* Header */}
        <div className="border-b border-bureau-green pb-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-bureau-green flex items-center justify-center text-lg border border-subdued-fern text-regulatory-gold">
              🏛️
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-serif font-bold text-parchment-drab tracking-wide">
                {vowelFilter('DEPARTMENT OF AGRONOMIC STANDARDS: FORM 88-SOIL')}
              </h2>
              <p className="text-xs text-regulatory-gold font-mono">
                {vowelFilter(`Statutory Annex ${currentLayer} of 4: Environmental Data Collection & Agronomic Privacy Accord`)}
              </p>
            </div>
          </div>

          <div className="text-right font-mono text-xs text-lichen-stone">
            {windowResized ? (
              <button
                onClick={handleBypass}
                className="bg-bureau-green text-parchment-drab px-3 py-1.5 font-bold border border-regulatory-gold hover:bg-officer-moss"
              >
                {vowelFilter('WINDOW GEOMETRY ALTERED: EXPEDITE WAIVER')}
              </button>
            ) : (
              <span className="hidden sm:inline text-lichen-stone/70 text-[10px]">
                {vowelFilter('(Administrative Note: Window width adjustment of 80px triggers regulatory override)')}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="my-4 flex-1 overflow-y-auto font-mono text-xs text-parchment-muted space-y-4">
          {currentLayer === 1 && (
            <div className="space-y-3">
              <div className="bg-peat-dark p-3.5 border border-bureau-green text-parchment-drab text-xs leading-relaxed">
                {vowelFilter(
                  'Pursuant to Subsection 14(c) of the Arable Lands Protection Act, user telemetry, biometric input velocity, and agronomic keystrokes are recorded in permanent municipal soil registries. Disabling telemetry requires notarized municipal certification.'
                )}
              </div>
              <div className="h-44 overflow-y-scroll p-3.5 bg-peat-dark/80 border border-forester-dark text-[11px] text-lichen-stone leading-relaxed font-serif">
                Article 1.01: The undersigned applicant acknowledges that topsoil integrity represents a public trust administered under federal agronomic supervision. In the event that synthetic nitrogen inputs exceed municipal watershed thresholds, the applicant consents to immediate biometric cross-referencing. Article 1.02: Subterranean macro-invertebrates (including Lumbricus terrestris) shall retain statutory bystander rights during all digital crop consultations...
              </div>
              <p className="text-[11px] text-warning-rust font-mono">
                {vowelFilter('Statutory Notice: No dismiss button is provided by statute. You must complete all annexes.')}
              </p>
            </div>
          )}

          {currentLayer === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-serif font-bold text-regulatory-gold">
                {vowelFilter('Annex II: Nitrogen Runoff Mitigation Calibration')}
              </h3>
              <p className="text-xs text-parchment-muted">
                {vowelFilter('Adjust the administrative compliance regulator until it reaches precisely 73.0%. Any deviation will trigger immediate recalibration.')}
              </p>
              <div className="p-4 bg-peat-dark border border-bureau-green flex flex-col items-center">
                <span className="text-2xl font-mono font-bold text-parchment-drab mb-2">{sliderVal}%</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderVal}
                  onChange={(e) => setSliderVal(Number(e.target.value))}
                  className="w-full h-2 bg-forester-dark rounded appearance-none cursor-pointer accent-regulatory-gold"
                />
              </div>
            </div>
          )}

          {currentLayer === 3 && (
            <div className="space-y-3">
              <h3 className="text-sm font-serif font-bold text-regulatory-gold">
                {vowelFilter('Annex III: Voluntary Disclosures to Third-Party Agronomic Bodies')}
              </h3>
              <p className="text-xs text-parchment-muted">
                {vowelFilter('You must manually disavow each auxiliary ecological telemetry protocol to proceed.')}
              </p>
              <div className="space-y-2 bg-peat-dark p-3.5 border border-bureau-green">
                {[
                  'Nematode Population Impact Assessment Board',
                  'Subterranean Fungal Network Telemetry Registry',
                  'Municipal Fertilizer Audit Commission',
                  'State Rhizosphere Oversight Agency',
                  'Locust Migration Early Advisory Bureau',
                ].map((name, idx) => (
                  <label key={idx} className="flex items-center gap-2.5 text-xs text-parchment-muted cursor-pointer">
                    <input
                      type="checkbox"
                      checked={individualTrackers[idx]}
                      onChange={() => {
                        const updated = [...individualTrackers];
                        updated[idx] = !updated[idx];
                        setIndividualTrackers(updated);
                      }}
                      className="accent-bureau-green w-3.5 h-3.5"
                    />
                    <span>{vowelFilter(name)}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {currentLayer === 4 && (
            <div className="space-y-3 text-center py-6">
              <FileText className="w-12 h-12 text-regulatory-gold mx-auto mb-2" />
              <h3 className="text-lg font-serif font-bold text-parchment-drab">
                {vowelFilter('Annex IV: Final Declaration Under Penalty of Agronomic Perjury')}
              </h3>
              <p className="text-xs text-parchment-muted max-w-md mx-auto leading-relaxed">
                {vowelFilter('The applicant solemnly affirms that all parameters entered into the Gemini 2.5 Flash Advisory Engine reflect true soil conditions and acknowledges full liability for resultant crop degradation.')}
              </p>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="border-t border-bureau-green pt-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {/* Runaway Reject Button */}
            <button
              onMouseEnter={handleRejectHover}
              style={{
                transform: `translate(${rejectPos.x}px, ${rejectPos.y}px)`,
                transition: 'transform 0.12s ease-out',
              }}
              className="bg-peat-dark hover:bg-warning-rust/30 text-lichen-stone font-mono text-xs px-3.5 py-2 border border-lichen-stone/40"
            >
              {vowelFilter('Refuse All & Incur Immediate Audit')}
            </button>

            {currentLayer > 1 && (
              <button
                onClick={() => setCurrentLayer((l) => l - 1)}
                className="bg-forester-dark text-lichen-stone font-mono text-xs px-3 py-2 border border-bureau-green"
              >
                {vowelFilter('Previous Annex')}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {currentLayer < 4 ? (
              <button
                onClick={() => {
                  if (currentLayer === 2 && sliderVal !== 73) {
                    alert('Calibration failed: Runoff mitigation metric is not 73.0%. The Commission denies passage.');
                    return;
                  }
                  setCurrentLayer((l) => l + 1);
                }}
                className="bg-bureau-green text-parchment-drab font-mono text-xs px-5 py-2 border border-regulatory-gold hover:bg-officer-moss transition-colors"
              >
                {vowelFilter('Proceed to Subsequent Annex')} →
              </button>
            ) : (
              <button
                onClick={handleBypass}
                className="bg-bureau-green text-parchment-drab font-mono font-bold text-xs px-6 py-2.5 border border-regulatory-gold hover:bg-officer-moss"
              >
                {vowelFilter('Certify All 4 Annexes & Proceed')}
              </button>
            )}
          </div>
        </div>

        {/* 1px escape pixel */}
        <button
          onClick={handleBypass}
          title="Regulatory bypass"
          className="absolute bottom-1 left-1 w-1 h-1 bg-transparent hover:bg-regulatory-gold cursor-pointer opacity-20"
        />
      </div>
    </div>
  );
};
