import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useChaos } from '../context/ChaosContext';
import { MinesweeperAdvisory } from '../components/MinesweeperAdvisory';
import { CropAdvisoryData } from '../types/advisory';
import { Printer, Download, FlipHorizontal, RotateCw, Sparkles, ArrowLeft } from 'lucide-react';

export const AdvisoryResults: React.FC = () => {
  const { vowelFilter } = useChaos();
  const [advisory, setAdvisory] = useState<CropAdvisoryData | null>(null);
  const [meta, setMeta] = useState<any>(null);
  const [exportMode, setExportMode] = useState<'normal' | 'upside-down' | 'mirrored'>('normal');

  useEffect(() => {
    const cached = sessionStorage.getItem('current_advisory');
    const cachedMeta = sessionStorage.getItem('current_advisory_meta');

    if (cached) {
      try {
        setAdvisory(JSON.parse(cached));
        if (cachedMeta) setMeta(JSON.parse(cachedMeta));
      } catch {
        // Fallback default
      }
    } else {
      // Default existential response
      setAdvisory({
        cropHealthScore: 32,
        primaryDiagnosis:
          'Primary Diagnosis for Mahindi (Corn): Acute soil acidification compounded by aggressive nitrogen mismanagement and chronic human optimism.',
        actionableRecommendations: [
          'Incorporate agricultural dolomitic limestone at 3.0 tons/ha before the remaining roots dissolve in sorrow.',
          'Cease arbitrary chemical dumping; the mycorrhizal fungi have formally requested a transfer to a better field.',
          'Prepare for secondary fungal leaf blight and inevitable market disappointment.',
        ],
        riskFactor: 'HIGH',
      });
    }
  }, []);

  const handlePrint = (mode: 'upside-down' | 'mirrored') => {
    document.body.classList.remove('export-upside-down', 'export-mirrored');
    if (mode === 'upside-down') {
      document.body.classList.add('export-upside-down');
    } else {
      document.body.classList.add('export-mirrored');
    }

    setTimeout(() => {
      window.print();
      document.body.classList.remove('export-upside-down', 'export-mirrored');
    }, 200);
  };

  if (!advisory) {
    return (
      <div className="min-h-screen bg-black text-toxic-green p-8 font-mono flex items-center justify-center">
        Loading agricultural despair...
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-black text-white p-4 md:p-8 select-none transition-transform duration-300 ${
        exportMode === 'upside-down'
          ? 'export-upside-down-preview'
          : exportMode === 'mirrored'
          ? 'export-mirrored-preview'
          : ''
      }`}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Navigation & Nightmare Export Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-4 border-toxic-green pb-4">
          <Link
            to="/dashboard"
            className="text-xs font-mono text-gray-400 hover:text-toxic-green flex items-center gap-1 border border-neutral-700 px-3 py-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{vowelFilter('Return to Telemetry Hub')}</span>
          </Link>

          {/* Nightmare Export Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono text-yellow-300 font-bold hidden sm:inline">
              {vowelFilter('EXPORT & SHARE NIGHTMARE')}:
            </span>

            <button
              onClick={() =>
                setExportMode((m) => (m === 'upside-down' ? 'normal' : 'upside-down'))
              }
              className={`text-xs font-mono px-3 py-1.5 border-2 flex items-center gap-1 font-bold ${
                exportMode === 'upside-down'
                  ? 'bg-hostile-pink text-white border-white'
                  : 'bg-neutral-900 text-yellow-300 border-yellow-400 hover:bg-neutral-800'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>{vowelFilter('Preview Upside Down (180°)')}</span>
            </button>

            <button
              onClick={() =>
                setExportMode((m) => (m === 'mirrored' ? 'normal' : 'mirrored'))
              }
              className={`text-xs font-mono px-3 py-1.5 border-2 flex items-center gap-1 font-bold ${
                exportMode === 'mirrored'
                  ? 'bg-cyan-500 text-black border-white'
                  : 'bg-neutral-900 text-cyan-300 border-cyan-400 hover:bg-neutral-800'
              }`}
            >
              <FlipHorizontal className="w-3.5 h-3.5" />
              <span>{vowelFilter('Preview Mirrored (Scale -1)')}</span>
            </button>

            <button
              onClick={() => handlePrint('upside-down')}
              className="bg-red-600 hover:bg-red-500 text-yellow-200 text-xs font-mono font-black px-4 py-1.5 border-2 border-white shadow-[2px_2px_0px_#000] flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{vowelFilter('Export Inverted PDF')}</span>
            </button>
          </div>
        </div>

        {/* Page Title */}
        <div className="text-center py-2">
          <div className="inline-block bg-toxic-green text-black font-mono font-black text-xs px-3 py-1 mb-2">
            AI AGRO ADVISORY ENGINE // GEMINI 2.5 FLASH STRUCTURED OUTPUT
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-impact text-toxic-green tracking-tight phosphor-glow">
            {vowelFilter('THE CURSED TERMINAL & MINESWEEPER REPORT')}
          </h1>
          <p className="text-xs font-mono text-yellow-300 mt-1">
            {vowelFilter('All agronomic advice below is scientifically verified by Google GenAI and wrapped in existential dread.')}
          </p>
        </div>

        {/* Minesweeper & Terminal Display */}
        <MinesweeperAdvisory advisory={advisory} metadata={meta} />

        {/* Sarcastic Metadata Breakdown */}
        {meta && (
          <div className="p-4 bg-neutral-950 border-2 border-neutral-800 font-mono text-xs text-gray-400 space-y-1">
            <div className="text-yellow-400 font-bold">{vowelFilter('OBSERVABILITY ENVELOPE')}:</div>
            <div>Epoch Entropy: {meta.epochEntropy}</div>
            <div>Soil Nihilism Vector: [{meta.soilNihilismVector?.join(', ')}]</div>
            <div className="text-pink-400">Notice: {vowelFilter(meta.warning || '')}</div>
          </div>
        )}
      </div>
    </div>
  );
};
