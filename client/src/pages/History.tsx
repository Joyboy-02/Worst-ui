import React, { useState, useEffect } from 'react';
import { useChaos } from '../context/ChaosContext';
import { useAuth } from '../context/AuthContext';
import { StoredAdvisory } from '../types/advisory';
import { History as HistoryIcon, Shuffle, ArrowDown } from 'lucide-react';

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
      header: 'BOTANICAL SPECIMEN',
      render: (item) => (
        <span className="font-serif font-bold text-parchment-drab">{item.crop_name}</span>
      ),
    },
    {
      id: 'ph',
      header: 'pH CORROSION',
      render: (item) => (
        <span className="text-regulatory-gold font-mono font-bold">{item.soil_ph}</span>
      ),
    },
    {
      id: 'npk',
      header: 'NPK METRIC VECTOR',
      render: (item) => (
        <span className="text-lichen-stone font-mono">
          N:{item.npk_status?.nitrogen} P:{item.npk_status?.phosphorus} K:{item.npk_status?.potassium}
        </span>
      ),
    },
    {
      id: 'diagnosis',
      header: 'AI ADVISORY TRANSCRIPT',
      render: (item) => (
        <span className="text-parchment-muted/90 text-xs line-clamp-2 font-serif">
          {item.ai_parsed?.primaryDiagnosis || item.ai_raw_response}
        </span>
      ),
    },
    {
      id: 'frustration',
      header: 'AUDIT FRICTION',
      render: (item) => (
        <span className="text-warning-rust font-mono font-bold text-sm">
          {item.frustration_index}%
        </span>
      ),
    },
    {
      id: 'timestamp',
      header: 'FILING DATE',
      render: (item) => (
        <span className="text-lichen-stone text-[10px] font-mono">
          {new Date(item.created_at).toLocaleDateString()}
        </span>
      ),
    },
  ];

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
        if (res.ok) {
          const hostHeader = res.headers.get('x-hostile-header') || 'Sort: Chronological Registry Order';
          setSortHeaderNote(hostHeader);
          const data = await res.json();
          if (data.history) {
            setAdvisories(data.history);
          }
        } else {
          throw new Error('API unavailable');
        }
      } catch (err) {
        console.warn('Backend history unreachable, loading local archival records:', err);
        const localHist = JSON.parse(localStorage.getItem('agro_local_history') || '[]');
        if (localHist.length > 0) {
          setAdvisories(localHist);
        } else {
          setAdvisories([
            {
              id: 'archive-001',
              user_id: 'default',
              crop_name: 'Mahindi (Maize / Corn)',
              soil_ph: 5.1,
              npk_status: { nitrogen: 18, phosphorus: 12, potassium: 24 },
              ai_raw_response: 'Severe topsoil acidification and chronic phosphorus fixation detected.',
              ai_parsed: {
                cropHealthScore: 28,
                primaryDiagnosis: 'Statutory Evaluation for Mahindi: Severe topsoil acidification and phosphorus fixation detected under Gazette Statute 14.',
                actionableRecommendations: [
                  'Apply 3.0 t/ha agricultural limestone immediately to avert root death.',
                  'Cease nitrogen broadcasting in saturated furrows.'
                ],
                riskFactor: 'HIGH'
              },
              frustration_index: 84,
              created_at: new Date().toISOString()
            }
          ]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [token]);

  return (
    <div className="min-h-screen bg-forester-dark text-parchment-drab p-4 md:p-8 select-none">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-bureau-green pb-4">
          <div>
            <div className="flex items-center gap-2 text-regulatory-gold text-xs font-mono">
              <HistoryIcon className="w-3.5 h-3.5" />
              <span>{vowelFilter('DEPARTMENTAL REGISTER OF PREVIOUS ADVISORY FILINGS')}</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-serif font-bold text-parchment-drab tracking-tight mt-1">
              {vowelFilter('THE CHRONICLE OF BOTANICAL HARVEST RECORDS')}
            </h1>
            <p className="text-xs text-lichen-stone font-mono">
              {vowelFilter('Statutory Warning: Column ordination shuffles randomly on reload. Typography shifts between micro-font and formal docket display.')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={shuffleColumns}
              className="bg-forester-dark hover:bg-peat-dark text-parchment-drab font-mono text-xs px-3.5 py-2 border border-bureau-green flex items-center gap-1.5"
            >
              <Shuffle className="w-3.5 h-3.5 text-regulatory-gold" />
              <span>{vowelFilter('Re-order Docket Columns')}</span>
            </button>
          </div>
        </div>

        {sortHeaderNote && (
          <div className="p-2 bg-peat-dark border border-bureau-green font-mono text-[11px] text-lichen-stone flex items-center justify-between">
            <span>Server Ordination Docket: {sortHeaderNote}</span>
            <span>Recorded Filings: {advisories.length}</span>
          </div>
        )}

        {/* Table */}
        <div className="border border-bureau-green bg-peat-dark overflow-x-auto shadow-sm">
          <table className="w-full text-left font-mono border-collapse">
            <thead>
              <tr className="bg-bureau-green text-parchment-drab font-serif font-bold text-xs border-b border-forester-dark">
                {columns.map((col) => (
                  <th key={col.id} className="p-3 tracking-wider border-r border-forester-dark">
                    {vowelFilter(col.header)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="p-8 text-center text-lichen-stone font-mono">
                    Retrieving historical dossiers from municipal archives...
                  </td>
                </tr>
              ) : advisories.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="p-8 text-center text-lichen-stone font-mono">
                    No previous advisory dossiers on file in this jurisdiction.
                  </td>
                </tr>
              ) : (
                advisories.map((item, rowIdx) => {
                  const isHugeRow = rowIdx % 3 === 1;
                  const isMicroRow = rowIdx % 3 === 2;

                  return (
                    <tr
                      key={item.id}
                      className={`border-b border-bureau-green/40 transition-colors hover:bg-forester-dark ${
                        isHugeRow
                          ? 'bg-bureau-green/15 text-regulatory-gold'
                          : isMicroRow
                          ? 'bg-peat-dark text-lichen-stone/70 text-[9px]'
                          : 'bg-peat-dark text-parchment-drab text-xs'
                      }`}
                    >
                      {columns.map((col) => (
                        <td
                          key={col.id}
                          className={`p-3 border-r border-bureau-green/40 ${
                            isHugeRow ? 'text-xl md:text-2xl font-serif font-bold' : ''
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

        <div className="text-center py-4 text-lichen-stone font-mono text-xs flex items-center justify-center gap-1.5">
          <ArrowDown className="w-3.5 h-3.5" />
          <span>{vowelFilter('End of active archival dockets. Subsurface records continue into municipal bedrock.')}</span>
        </div>
      </div>
    </div>
  );
};
