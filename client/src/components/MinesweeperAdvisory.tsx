import React, { useState, useEffect } from 'react';
import { useChaos } from '../context/ChaosContext';
import { CropAdvisoryData } from '../types/advisory';
import { AlertCircle, Eye, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';

interface MinesweeperProps {
  advisory: CropAdvisoryData;
  metadata?: any;
}

interface Tile {
  id: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  content: string;
  category: 'diagnosis' | 'recommendation' | 'mine' | 'trivia';
}

export const MinesweeperAdvisory: React.FC<MinesweeperProps> = ({ advisory, metadata }) => {
  const { triggerScreenShake, vowelFilter, recordRageClick } = useChaos();
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [revealedSentences, setRevealedSentences] = useState<string[]>([]);
  const [mineHits, setMineHits] = useState<number>(0);
  const [reportFormat, setReportFormat] = useState<'gazette' | 'docket'>('gazette');
  const [allRevealed, setAllRevealed] = useState<boolean>(false);

  useEffect(() => {
    const pieces: { text: string; cat: 'diagnosis' | 'recommendation' | 'trivia' }[] = [
      { text: `STATUTORY DIAGNOSIS: ${advisory.primaryDiagnosis}`, cat: 'diagnosis' },
      { text: `HEALTH QUOTIENT: ${advisory.cropHealthScore} / 100 [HAZARD CLASSIFICATION: ${advisory.riskFactor}]`, cat: 'diagnosis' },
      ...advisory.actionableRecommendations.map((r, i) => ({ text: `MANDATED REMEDIATION §${i + 1}: ${r}`, cat: 'recommendation' as const })),
      { text: 'Agronomic Ledger: Subterranean earthworms process 15 metric tons of organic humus per acre annually.', cat: 'trivia' },
      { text: 'Agronomic Ledger: Soil pH below 5.5 triggers immediate aluminum ion solubilization and legal liability.', cat: 'trivia' },
      { text: 'Agronomic Ledger: Nitrogen leaching into riparian corridors violates Section 404 of the Clean Soil Act.', cat: 'trivia' },
    ];

    const grid: Tile[] = [];
    const totalTiles = 25;
    const mineIndices = new Set<number>();

    while (mineIndices.size < 6) {
      mineIndices.add(Math.floor(Math.random() * totalTiles));
    }

    let pieceIdx = 0;
    for (let i = 0; i < totalTiles; i++) {
      if (mineIndices.has(i)) {
        grid.push({
          id: i,
          isMine: true,
          isRevealed: false,
          isFlagged: false,
          content: '⚠️ BIOLOGICAL CONTAMINATION ALERT: CORE SAMPLE VOIDED BY PEST INFESTATION',
          category: 'mine',
        });
      } else {
        const piece = pieces[pieceIdx % pieces.length];
        pieceIdx++;
        grid.push({
          id: i,
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          content: piece.text,
          category: piece.cat,
        });
      }
    }

    for (let i = grid.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [grid[i], grid[j]] = [grid[j], grid[i]];
    }

    setTiles(grid);
  }, [advisory]);

  const handleTileClick = (index: number) => {
    const tile = tiles[index];
    if (tile.isRevealed || tile.isFlagged) return;

    if (tile.isMine) {
      triggerScreenShake();
      setMineHits((m) => m + 1);
      recordRageClick('core_sample_contamination_mine');

      setTiles((prev) => {
        const updated = [...prev];
        updated[index].isRevealed = true;
        const revealedNonMines = updated.filter((t, idx) => t.isRevealed && !t.isMine && idx !== index);
        if (revealedNonMines.length > 0) {
          const toHide = revealedNonMines[Math.floor(Math.random() * revealedNonMines.length)];
          toHide.isRevealed = false;
        }
        return updated;
      });
    } else {
      setTiles((prev) => {
        const updated = [...prev];
        updated[index].isRevealed = true;
        return updated;
      });

      if (!revealedSentences.includes(tile.content)) {
        setRevealedSentences((prev) => [...prev, tile.content]);
      }
    }
  };

  const handleTileContextMenu = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    setTiles((prev) => {
      const updated = [...prev];
      if (!updated[index].isRevealed) {
        updated[index].isFlagged = !updated[index].isFlagged;
      }
      return updated;
    });
  };

  const revealAllAdvice = () => {
    setAllRevealed(true);
    setTiles((prev) => prev.map((t) => ({ ...t, isRevealed: true })));
    setRevealedSentences([
      `STATUTORY DIAGNOSIS: ${advisory.primaryDiagnosis}`,
      `HEALTH QUOTIENT: ${advisory.cropHealthScore} / 100 [HAZARD CLASSIFICATION: ${advisory.riskFactor}]`,
      ...advisory.actionableRecommendations.map((r, i) => `MANDATED REMEDIATION §${i + 1}: ${r}`),
    ]);
  };

  return (
    <div className="space-y-5">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-forester-dark p-3 border border-bureau-green shadow-sm">
        <div className="flex items-center space-x-4">
          <span className="text-xs font-mono text-parchment-drab flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-warning-rust" />
            {vowelFilter('CONTAMINATION INCIDENTS')}: <span className="font-bold text-warning-rust">{mineHits}</span>
          </span>
          <span className="text-xs font-mono text-lichen-stone flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-subdued-fern" />
            {vowelFilter('CERTIFIED SPECIMENS')}: <span className="text-parchment-drab font-bold">{revealedSentences.length}</span>
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setReportFormat((f) => (f === 'gazette' ? 'docket' : 'gazette'))}
            className="text-xs font-mono px-3 py-1.5 bg-peat-dark border border-bureau-green text-parchment-muted hover:text-parchment-drab flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{reportFormat === 'gazette' ? 'Format: Gazette Docket' : 'Format: Official Ledger'}</span>
          </button>

          <button
            onClick={revealAllAdvice}
            className="text-xs font-mono px-3 py-1.5 bg-bureau-green border border-regulatory-gold/60 text-parchment-drab hover:bg-officer-moss flex items-center gap-1 font-medium"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{vowelFilter("Surrender Rights & Disclose All")}</span>
          </button>
        </div>
      </div>

      {/* Subsurface Core Sample Grid */}
      <div className="bg-peat-dark border-2 border-bureau-green p-4 shadow-sm">
        <div className="text-center mb-3">
          <p className="text-xs font-mono text-lichen-stone">
            {vowelFilter('EXCAVATE 25 REGULATORY SOIL CORE SAMPLES // RIGHT CLICK TO PLACE OFFICIAL QUARANTINE SEAL [ § ] ON BLIGHT ZONES')}
          </p>
        </div>

        <div className="grid grid-cols-5 gap-2 max-w-xl mx-auto">
          {tiles.map((tile, idx) => (
            <button
              key={tile.id}
              onClick={() => handleTileClick(idx)}
              onContextMenu={(e) => handleTileContextMenu(e, idx)}
              className={`h-14 sm:h-16 font-mono text-xs border transition-colors flex items-center justify-center p-1 text-center select-none ${
                tile.isRevealed
                  ? tile.isMine
                    ? 'bg-warning-rust/40 text-parchment-drab border-warning-rust font-bold'
                    : tile.category === 'diagnosis'
                    ? 'bg-bureau-green text-parchment-drab border-regulatory-gold'
                    : tile.category === 'recommendation'
                    ? 'bg-officer-moss/60 text-parchment-drab border-subdued-fern'
                    : 'bg-forester-dark text-lichen-stone border-bureau-green'
                  : tile.isFlagged
                  ? 'bg-regulatory-gold/30 text-regulatory-gold border-regulatory-gold font-bold'
                  : 'bg-forester-dark text-parchment-muted/60 border-bureau-green/60 hover:border-lichen-stone hover:text-parchment-drab'
              }`}
            >
              {tile.isRevealed ? (
                tile.isMine ? (
                  <span className="text-[10px] text-warning-rust font-bold">⚠️ QUARANTINE</span>
                ) : (
                  <span className="text-[10px] leading-tight line-clamp-3">
                    {tile.category === 'diagnosis' ? 'DIAGNOSIS' : tile.category === 'recommendation' ? 'REMEDY' : 'SPECIMEN'}
                  </span>
                )
              ) : tile.isFlagged ? (
                '§ QUAR'
              ) : (
                `[ Core #${idx + 1 < 10 ? '0' + (idx + 1) : idx + 1} ]`
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Official Agronomic Report Transcript */}
      <div className="border border-bureau-green bg-forester-dark p-6 text-sm leading-relaxed shadow-sm">
        <div className="flex items-center justify-between border-b border-bureau-green pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <span className="font-serif font-bold text-parchment-drab">
              OFFICIAL AGRONOMIC AUDIT TRANSCRIPT
            </span>
          </div>
          <span className="text-xs text-regulatory-gold font-mono">
            {vowelFilter('Authority: Google Gemini 2.5 Flash SDK')}
          </span>
        </div>

        <div className="space-y-4 font-serif text-parchment-drab">
          <div className="p-3 bg-peat-dark border-l-2 border-regulatory-gold text-xs font-mono">
            <span className="text-regulatory-gold font-bold">&gt; COMPOSITE CROP HEALTH GRADE:</span>{' '}
            <span className="text-parchment-drab font-bold text-sm">
              {advisory.cropHealthScore} / 100 — CLASSIFICATION: {advisory.riskFactor} RISK
            </span>
          </div>

          <div>
            <h4 className="font-bold text-sm text-parchment-drab mb-1">
              {vowelFilter('I. PRIMARY STATUTORY DIAGNOSIS')}
            </h4>
            <p className="text-xs font-mono text-parchment-muted bg-peat-dark/50 p-3 border border-bureau-green leading-relaxed">
              {vowelFilter(advisory.primaryDiagnosis)}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-sm text-parchment-drab mb-1">
              {vowelFilter('II. MANDATED REMEDIATION ACTIONS')}
            </h4>
            <ul className="space-y-2 mt-2">
              {advisory.actionableRecommendations.map((rec, i) => (
                <li key={i} className="text-xs font-mono text-parchment-muted flex items-start space-x-2 bg-peat-dark/30 p-2.5 border border-forester-dark">
                  <span className="text-regulatory-gold font-bold">§ {i + 1}.</span>
                  <span>{vowelFilter(rec)}</span>
                </li>
              ))}
            </ul>
          </div>

          {revealedSentences.length > 0 && !allRevealed && (
            <div className="mt-4 pt-3 border-t border-bureau-green">
              <span className="text-xs text-lichen-stone font-mono font-bold">
                AUDITED CORE SPECIMEN FRAGMENTS ({revealedSentences.length}/25):
              </span>
              <div className="mt-2 space-y-1.5">
                {revealedSentences.map((s, idx) => (
                  <div key={idx} className="text-[11px] text-parchment-muted font-mono bg-peat-dark p-2 border border-bureau-green/40">
                    {vowelFilter(s)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
