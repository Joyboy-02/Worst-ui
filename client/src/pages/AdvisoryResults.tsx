import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useChaos } from '../context/ChaosContext';
import { MinesweeperAdvisory } from '../components/MinesweeperAdvisory';
import { CropAdvisoryData } from '../types/advisory';
import { Printer, FlipHorizontal, RotateCw, ArrowLeft } from 'lucide-react';

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
      setAdvisory({
        cropHealthScore: 32,
        primaryDiagnosis:
          'Primary Diagnosis for Mahindi (Corn): Acute soil acidification compounded by aggressive nitrogen mismanagement and chronic human optimism.',
        actionableRecommendations: [
          'Incorporate agricultural dolomitic limestone at 3.0 tons/ha before remaining root meristems dissolve in sorrow.',
          'Cease arbitrary chemical dumping; the mycorrhizal fungal network has submitted a formal notice of environmental default.',
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
      <div className="min-h-screen bg-forester-dark text-parchment-drab p-8 font-mono flex items-center justify-center">
        Retrieving official crop dossier from municipal repository...
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-forester-dark text-parchment-drab p-4 md:p-8 select-none transition-transform duration-300 ${
        exportMode === 'upside-down'
          ? 'export-upside-down-preview'
          : exportMode === 'mirrored'
          ? 'export-mirrored-preview'
          : ''
      }`}
    >
      <div className="max-w-5xl mx-auto space-y-5">
        {/* Navigation & Export Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-bureau-green pb-3">
          <Link
            to="/dashboard"
            className="text-xs font-mono text-lichen-stone hover:text-parchment-drab flex items-center gap-1 border border-bureau-green px-3 py-1.5 bg-peat-dark"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{vowelFilter('Return to Telemetry Registry')}</span>
          </Link>

          {/* Nightmare Export Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono text-lichen-stone hidden sm:inline">
              {vowelFilter('STATUTORY EXPORT CONTROLS')}:
            </span>

            <button
              onClick={() =>
                setExportMode((m) => (m === 'upside-down' ? 'normal' : 'upside-down'))
              }
              className={`text-xs font-mono px-3 py-1.5 border flex items-center gap-1 ${
                exportMode === 'upside-down'
                  ? 'bg-bureau-green text-parchment-drab border-regulatory-gold font-bold'
                  : 'bg-peat-dark text-lichen-stone border-bureau-green hover:text-parchment-drab'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>{vowelFilter('Inverted Alignment (180°)')}</span>
            </button>

            <button
              onClick={() =>
                setExportMode((m) => (m === 'mirrored' ? 'normal' : 'mirrored'))
              }
              className={`text-xs font-mono px-3 py-1.5 border flex items-center gap-1 ${
                exportMode === 'mirrored'
                  ? 'bg-bureau-green text-parchment-drab border-regulatory-gold font-bold'
                  : 'bg-peat-dark text-lichen-stone border-bureau-green hover:text-parchment-drab'
              }`}
            >
              <FlipHorizontal className="w-3.5 h-3.5" />
              <span>{vowelFilter('Mirrored Alignment')}</span>
            </button>

            <button
              onClick={() => handlePrint('upside-down')}
              className="bg-bureau-green hover:bg-officer-moss text-parchment-drab text-xs font-mono font-medium px-3.5 py-1.5 border border-regulatory-gold flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{vowelFilter('Export Inverted PDF Record')}</span>
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="text-center py-2">
          <div className="inline-block bg-peat-dark text-regulatory-gold font-mono text-[10px] px-2.5 py-0.5 border border-bureau-green mb-1.5">
            SECTION 84-A // STRUCTURED AI ADVISORY CERTIFICATION
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-parchment-drab tracking-tight">
            {vowelFilter('SUBSURFACE CORE SAMPLE GRID & AUDIT REPORT')}
          </h1>
          <p className="text-xs font-mono text-lichen-stone mt-1">
            {vowelFilter('All agronomic remediation steps below are mathematically certified under Gemini 2.5 Flash protocols.')}
          </p>
        </div>

        {/* Minesweeper Component */}
        <MinesweeperAdvisory advisory={advisory} metadata={meta} />

        {/* Meta envelope */}
        {meta && (
          <div className="p-3.5 bg-peat-dark border border-bureau-green font-mono text-xs text-lichen-stone space-y-1">
            <div className="text-regulatory-gold font-bold">{vowelFilter('REGULATORY OBSERVABILITY ANNEX')}:</div>
            <div>Decay Epoch Timestamp: {meta.epochEntropy}</div>
            <div>Soil Nihilism Vector: [{meta.soilNihilismVector?.join(', ')}]</div>
            <div className="text-parchment-muted">Administrative Note: {vowelFilter(meta.warning || '')}</div>
          </div>
        )}
      </div>
    </div>
  );
};
