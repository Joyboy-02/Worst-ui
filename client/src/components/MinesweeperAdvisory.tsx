import React, { useState, useEffect } from 'react';
import { useChaos } from '../context/ChaosContext';
import { CropAdvisoryData } from '../types/advisory';
import { Bomb, CheckCircle2, ShieldAlert, Terminal, Eye, VolumeX, AlertOctagon } from 'lucide-react';

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
  const [terminalMode, setTerminalMode] = useState<boolean>(true);
  const [allRevealed, setAllRevealed] = useState<boolean>(false);

  // Initialize 25-tile Minesweeper Grid
  useEffect(() => {
    const pieces: { text: string; cat: 'diagnosis' | 'recommendation' | 'trivia' }[] = [
      { text: `DIAGNOSIS: ${advisory.primaryDiagnosis}`, cat: 'diagnosis' },
      { text: `HEALTH SCORE: ${advisory.cropHealthScore} / 100 [RISK: ${advisory.riskFactor}]`, cat: 'diagnosis' },
      ...advisory.actionableRecommendations.map((r) => ({ text: `ACTION: ${r}`, cat: 'recommendation' as const })),
      { text: 'Soil trivia: Nitrogen atoms in your field originated in dying red giant stars.', cat: 'trivia' },
      { text: 'Soil trivia: Nematodes outnumber humans 4 out of 5 on this planet.', cat: 'trivia' },
      { text: 'Soil trivia: pH below 5.5 triggers aluminum toxicity in root meristems.', cat: 'trivia' },
    ];

    const grid: Tile[] = [];
    const totalTiles = 25;
    const mineIndices = new Set<number>();

    // Place 6 mines randomly
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
          content: '💥 LOCUST INFESTATION MINE! CROP REPORT CORRUPTED!',
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

    // Shuffle grid positions
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
      // Hit a mine!
      triggerScreenShake();
      setMineHits((m) => m + 1);
      recordRageClick('minesweeper_locust_mine');

      setTiles((prev) => {
        const updated = [...prev];
        updated[index].isRevealed = true;
        // Hostile penalty: re-hide a previously revealed piece of advice!
        const revealedNonMines = updated.filter((t, idx) => t.isRevealed && !t.isMine && idx !== index);
        if (revealedNonMines.length > 0) {
          const toHide = revealedNonMines[Math.floor(Math.random() * revealedNonMines.length)];
          toHide.isRevealed = false;
        }
        return updated;
      });
    } else {
      // Safe tile: reveals agronomic sentence
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
      `DIAGNOSIS: ${advisory.primaryDiagnosis}`,
      `HEALTH SCORE: ${advisory.cropHealthScore} / 100 [RISK: ${advisory.riskFactor}]`,
      ...advisory.actionableRecommendations.map((r) => `ACTION: ${r}`),
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Controls & Mode Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-900 p-3 border-2 border-toxic-green">
        <div className="flex items-center space-x-3">
          <span className="text-xs font-mono text-yellow-300 font-bold">
            {vowelFilter('MINES DETONATED')}: <span className="text-red-500 font-black">{mineHits}</span>
          </span>
          <span className="text-xs font-mono text-toxic-green">
            {vowelFilter('DISCOVERED TRUTHS')}: {revealedSentences.length}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setTerminalMode((m) => !m)}
            className="text-xs font-mono px-3 py-1 bg-black border border-toxic-green text-toxic-green hover:bg-toxic-green hover:text-black flex items-center gap-1"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>{terminalMode ? 'CRT View' : 'Standard View'}</span>
          </button>

          <button
            onClick={revealAllAdvice}
            className="text-xs font-mono px-3 py-1 bg-neutral-800 border border-yellow-500 text-yellow-300 hover:bg-yellow-500 hover:text-black flex items-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{vowelFilter("Surrender & Reveal All")}</span>
          </button>
        </div>
      </div>

      {/* Minesweeper Interactive Grid */}
      <div className="bg-black border-4 border-neutral-700 p-4 shadow-[8px_8px_0px_#00ff66]">
        <div className="text-center mb-3">
          <p className="text-xs font-mono text-yellow-400">
            {vowelFilter('CLICK TILES TO EXCAVATE YOUR AI CROP ADVICE // RIGHT CLICK TO FLAG LOCUST MINES')}
          </p>
        </div>

        <div className="grid grid-cols-5 gap-2 max-w-xl mx-auto">
          {tiles.map((tile, idx) => (
            <button
              key={tile.id}
              onClick={() => handleTileClick(idx)}
              onContextMenu={(e) => handleTileContextMenu(e, idx)}
              className={`h-14 sm:h-16 font-mono font-black text-xs border-2 transition-all flex items-center justify-center p-1 text-center select-none ${
                tile.isRevealed
                  ? tile.isMine
                    ? 'bg-red-700 text-white border-yellow-400 animate-strobe-fast'
                    : tile.category === 'diagnosis'
                    ? 'bg-toxic-green text-black border-white'
                    : tile.category === 'recommendation'
                    ? 'bg-cyan-500 text-black border-white'
                    : 'bg-neutral-800 text-gray-300 border-neutral-600'
                  : tile.isFlagged
                  ? 'bg-yellow-400 text-black border-red-600'
                  : 'bg-neutral-900 text-gray-400 border-neutral-700 hover:border-toxic-green hover:bg-neutral-800'
              }`}
            >
              {tile.isRevealed ? (
                tile.isMine ? (
                  <Bomb className="w-6 h-6 animate-spin" />
                ) : (
                  <span className="text-[10px] leading-tight line-clamp-3">
                    {tile.category === 'diagnosis' ? '🩺 DIAGNOSIS' : tile.category === 'recommendation' ? '🌱 ACTION' : '🔬 TRIVIA'}
                  </span>
                )
              ) : tile.isFlagged ? (
                '🚩'
              ) : (
                `[ ${idx + 1} ]`
              )}
            </button>
          ))}
        </div>
      </div>

      {/* The Cursed Terminal Display */}
      <div
        className={`border-4 p-5 font-terminal text-sm md:text-base leading-relaxed relative ${
          terminalMode
            ? 'bg-black text-toxic-green border-toxic-green phosphor-glow animate-flicker'
            : 'bg-neutral-950 text-white border-neutral-600'
        }`}
      >
        <div className="flex items-center justify-between border-b border-toxic-green/50 pb-2 mb-4">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-toxic-green inline-block"></span>
            <span className="font-mono text-xs text-gray-400 ml-2">
              TERMINAL_VT100://GEMINI-2.5-FLASH-AGRONOMY-LOG
            </span>
          </div>
          <span className="text-xs text-pink-400 font-mono">
            {vowelFilter('Sarcasm Level: MAXIMUM')}
          </span>
        </div>

        {/* Marquee Banner inside Terminal */}
        <div className="bg-toxic-green/10 border border-toxic-green py-1 px-3 mb-4 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap text-xs font-mono text-yellow-300">
            {vowelFilter(
              `WARNING: EXPOSURE TO REALISTIC AGRONOMIC DATA MAY CAUSE PROFOUND HUMILITY // RISK ASSESSMENT: ${advisory.riskFactor} // CROP HEALTH: ${advisory.cropHealthScore}%`
            )}
          </div>
        </div>

        {/* Decoded fragments */}
        <div className="space-y-4 font-mono text-sm">
          <div>
            <span className="text-yellow-300 font-bold">
              &gt; OVERALL CROP HEALTH SCORE:
            </span>{' '}
            <span
              className={`font-black text-lg ${
                advisory.cropHealthScore < 40
                  ? 'text-red-500'
                  : advisory.cropHealthScore < 70
                  ? 'text-yellow-400'
                  : 'text-toxic-green'
              }`}
            >
              {advisory.cropHealthScore} / 100 ({advisory.riskFactor} RISK)
            </span>
          </div>

          <div>
            <span className="text-yellow-300 font-bold">&gt; PRIMARY AGRONOMIC DIAGNOSIS:</span>
            <p className="mt-1 p-3 bg-neutral-900/80 border-l-4 border-toxic-green text-gray-200">
              {vowelFilter(advisory.primaryDiagnosis)}
            </p>
          </div>

          <div>
            <span className="text-yellow-300 font-bold">&gt; ACTIONABLE RECOMMENDATIONS:</span>
            <ul className="mt-2 space-y-2">
              {advisory.actionableRecommendations.map((rec, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="text-toxic-green font-bold">[{i + 1}]</span>
                  <span className="text-gray-300">{vowelFilter(rec)}</span>
                </li>
              ))}
            </ul>
          </div>

          {revealedSentences.length > 0 && !allRevealed && (
            <div className="mt-4 pt-3 border-t border-dashed border-neutral-700">
              <span className="text-xs text-cyan-400 font-bold">
                &gt; MINESWEEPER RAW TELEMETRY LOG:
              </span>
              <div className="mt-1 space-y-1">
                {revealedSentences.map((s, idx) => (
                  <div key={idx} className="text-xs text-gray-400 font-mono">
                    [{idx + 1}] {vowelFilter(s)}
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
