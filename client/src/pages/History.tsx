import React, { useState, useEffect } from 'react';
import { useChaos } from '../context/ChaosContext';
import { useAuth } from '../context/AuthContext';
import { StoredAdvisory } from '../types/advisory';
import { History as HistoryIcon, Shuffle, AlertCircle, ArrowDown } from 'lucide-react';

interface ColumnDef {
  id: string;
  header: string;
  render: (item: StoredAdvisory) => React.ReactNode;
}

export const History: React.FC = () => {
  const { vowelFilter } = useChaos();
  const { token } = useAuth();
  const [advisories, setAdvisories] = useState<StoredAdvisory[]>([]);
  const [columns, setColumns] = useState<ColumnDef[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sortHeaderNote, setSortHeaderNote] = useState<string>('');

  const baseColumns: ColumnDef[] = [
    {
      id: 'crop',
      header: 'BOTANICAL SACRIFICE',
      render: (item) => (
        <span className="font-black text-toxic-green">{item.crop_name}</span>
      ),
    },
    {
      id: 'ph',
      header: 'SOIL pH CORROSION',
      render: (item) => (
        <span className="text-yellow-400 font-bold">{item.soil_ph}</span>
      ),
    },
    {
      id: 'npk',
      header: 'NPK METRIC VECTOR',
      render: (item) => (
        <span className="text-cyan-400 font-mono">
          N:{item.npk_status?.nitrogen} P:{item.npk_status?.phosphorus} K:{item.npk_status?.potassium}
        </span>
      ),
    },
    {
      id: 'diagnosis',
      header: 'AI EXISTENTIAL DIAGNOSIS',
      render: (item) => (
        <span className="text-gray-300 italic text-xs line-clamp-2">
          {item.ai_parsed?.primaryDiagnosis || item.ai_raw_response}
        </span>
      ),
    },
    {
      id: 'frustration',
      header: 'CALCULATED FRUSTRATION',
      render: (item) => (
        <span className="text-red-500 font-black text-base animate-pulse">
          {item.frustration_index}%
        </span>
      ),
    },
    {
      id: 'timestamp',
      header: 'DECAY COMMENCED',
      render: (item) => (
        <span className="text-gray-500 text-[10px]">
          {new Date(item.created_at).toLocaleDateString()}
        </span>
      ),
    },
  ];

  // Randomize column ordering on refresh/mount
  const shuffleColumns = () => {
    const shuffled = [...baseColumns];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setColumns(shuffled);
  };

  useEffect(() => {
    shuffleColumns();

    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch('/api/advisory/history', { headers });
        const hostHeader = res.headers.get('x-hostile-header') || 'Sort: Descending by Regret';
        setSortHeaderNote(hostHeader);

        const data = await res.json();
        if (data.history) {
          setAdvisories(data.history);
        }
      } catch (err) {
        console.warn('History fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [token]);

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 select-none">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-4 border-hostile-pink pb-4">
          <div>
            <div className="flex items-center gap-2 text-hostile-pink text-xs font-mono font-bold">
              <HistoryIcon className="w-4 h-4" />
              <span>{vowelFilter('HISTORICAL AUDIT OF BOTANICAL HUBRIS')}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black font-impact text-white tracking-tight phosphor-glow">
              {vowelFilter('THE INFINITE SCROLL VOID')}
            </h1>
            <p className="text-xs text-yellow-300 font-mono">
              {vowelFilter('Warning: Table columns shuffle randomly on reload. Typography scale is intentionally erratic.')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={shuffleColumns}
              className="bg-neutral-900 hover:bg-neutral-800 text-cyan-400 font-mono font-bold text-xs px-4 py-2.5 border-2 border-cyan-400 flex items-center gap-1.5 shadow-[3px_3px_0px_#fff]"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>{vowelFilter('Shuffle Column Order Live')}</span>
            </button>
          </div>
        </div>

        {sortHeaderNote && (
          <div className="p-2 bg-neutral-900 border border-neutral-700 font-mono text-[11px] text-yellow-400 flex items-center justify-between">
            <span>Server Sorting Vector: {sortHeaderNote}</span>
            <span className="text-gray-500">Unpaginated Record Count: {advisories.length}</span>
          </div>
        )}

        {/* The Infinite Scroll Void Table */}
        <div className="border-4 border-toxic-green bg-neutral-950 overflow-x-auto shadow-[10px_10px_0px_#ffff00]">
          <table className="w-full text-left font-mono border-collapse">
            <thead>
              <tr className="bg-toxic-green text-black font-black text-xs md:text-sm border-b-4 border-black">
                {columns.map((col, idx) => (
                  <th key={col.id} className="p-3 uppercase tracking-wider border-r-2 border-black">
                    {vowelFilter(col.header)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="p-8 text-center text-toxic-green font-mono">
                    Excavating fossilized crop records from database...
                  </td>
                </tr>
              ) : advisories.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="p-8 text-center text-gray-400 font-mono">
                    No past submissions located. Your fields have not yet suffered.
                  </td>
                </tr>
              ) : (
                advisories.map((item, rowIdx) => {
                  // Anti-pattern: Alternating micro-fonts (8px) with huge bold neon text (36px+)
                  const isHugeRow = rowIdx % 3 === 1;
                  const isMicroRow = rowIdx % 3 === 2;

                  return (
                    <tr
                      key={item.id}
                      className={`border-b border-neutral-800 transition-colors hover:bg-neutral-900 ${
                        isHugeRow
                          ? 'bg-hostile-pink/10 text-yellow-300'
                          : isMicroRow
                          ? 'bg-black text-gray-500 text-[8px]'
                          : 'bg-neutral-950 text-gray-200 text-xs'
                      }`}
                    >
                      {columns.map((col) => (
                        <td
                          key={col.id}
                          className={`p-3 border-r border-neutral-800 ${
                            isHugeRow ? 'text-2xl md:text-3xl font-black font-impact' : ''
                          }`}
                        >
                          {col.render(item)}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer note */}
        <div className="text-center py-6 text-gray-500 font-mono text-xs flex items-center justify-center gap-2">
          <ArrowDown className="w-4 h-4 animate-bounce" />
          <span>{vowelFilter('End of records reached. The void stretches infinitely into the soil horizon.')}</span>
        </div>
      </div>
    </div>
  );
};
