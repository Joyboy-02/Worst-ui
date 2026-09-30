import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useChaos } from '../context/ChaosContext';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Volume2, Bug, Shield, BookOpen } from 'lucide-react';

interface NavItem {
  path: string;
  defaultLabel: string;
  hostileLabels: string[];
}

export const HostileNavbar: React.FC = () => {
  const location = useLocation();
  const {
    expertMode,
    toggleExpertMode,
    vowelFilter,
    isMosquitoDroning,
    toggleMosquito,
    startDialUp,
    isDialUpPlaying,
  } = useChaos();
  const { user, logout } = useAuth();

  const navItems: NavItem[] = [
    {
      path: '/',
      defaultLabel: 'Division of Arable Land',
      hostileLabels: ['Erosion Assessment Portal', 'Form 1040-SOIL', 'Fallow Ground Entry', 'Deforestation Gazette'],
    },
    {
      path: '/dashboard',
      defaultLabel: 'Soil Degradation Audit',
      hostileLabels: ['Phosphorus Citation Bureau', 'Acidity Triage Hub', 'Registry of Soil Decay', 'Sediment Hearing'],
    },
    {
      path: '/advisory/new',
      defaultLabel: 'Chemical Application Filing',
      hostileLabels: ['Nitrogen Violation Appeal', 'Pest Remediation Petition', 'Blight Incident Report', 'Audit Submission'],
    },
    {
      path: '/history',
      defaultLabel: 'Registry of Failed Harvests',
      hostileLabels: ['Archives of Crop Neglect', 'Chronicle of Famine Risk', 'Dead Root Docket', 'Historical Blight Index'],
    },
  ];

  const [hoverTextMap, setHoverTextMap] = useState<Record<string, string>>({});

  const handleMouseEnter = (path: string, hostileLabels: string[]) => {
    const randomHostile = hostileLabels[Math.floor(Math.random() * hostileLabels.length)];
    setHoverTextMap((prev) => ({ ...prev, [path]: randomHostile }));
  };

  const handleMouseLeave = (path: string) => {
    if (Math.random() > 0.4) {
      setHoverTextMap((prev) => {
        const copy = { ...prev };
        delete copy[path];
        return copy;
      });
    }
  };

  return (
    <nav className="bg-forester-dark border-b-2 border-bureau-green sticky top-0 z-40 select-none shadow-md">
      {/* Top Regulatory Compliance Ticker */}
      <div className="bg-bureau-green/80 text-parchment-drab font-mono text-[11px] py-1 px-4 overflow-hidden border-b border-forester-dark flex justify-between items-center tracking-wider">
        <span className="animate-slow-marquee whitespace-nowrap">
          FEDERAL SOIL COMMISSION BULLETIN § 84-A: ALL CROP PARAMETERS SUBJECT TO MANDATORY ARTIFICIAL INTELLIGENCE SCRUTINY // RESIDUAL PHOSPHATE RETENTION AT 14.8% // GEMINI 2.5 FLASH ACTIVE
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <Link to="/" className="flex items-center space-x-2.5 group">
          <div className="w-9 h-9 bg-bureau-green text-parchment-drab flex items-center justify-center font-serif font-bold text-lg border border-subdued-fern group-hover:bg-officer-moss transition-colors">
            🌾
          </div>
          <div>
            <span className="text-base font-serif font-bold text-parchment-drab tracking-wide block bureau-glow">
              {vowelFilter('DEPARTMENT OF AGRONOMIC COMPLIANCE')}
            </span>
            <span className="text-[10px] text-regulatory-gold font-mono tracking-widest block uppercase">
              {vowelFilter('Crop Advisory & Soil Depletion Bureau')}
            </span>
          </div>
        </Link>

        {/* Shifting Navigation Links */}
        <div className="flex flex-wrap items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const currentLabel = hoverTextMap[item.path] || item.defaultLabel;

            return (
              <Link
                key={item.path}
                to={item.path}
                id={`nav-${item.path.replace('/', '') || 'home'}`}
                onMouseEnter={() => handleMouseEnter(item.path, item.hostileLabels)}
                onMouseLeave={() => handleMouseLeave(item.path)}
                className={`px-3 py-1.5 text-xs font-mono tracking-tight border transition-colors ${
                  isActive
                    ? 'bg-bureau-green text-parchment-drab border-regulatory-gold font-bold shadow-sm'
                    : 'bg-forester-dark text-lichen-stone border-transparent hover:border-bureau-green hover:text-parchment-drab hover:bg-peat-dark'
                }`}
              >
                {vowelFilter(currentLabel)}
              </Link>
            );
          })}
        </div>

        {/* Ambient Nature Controls */}
        <div className="flex items-center space-x-2">
          {/* Mosquito Drone */}
          <button
            onClick={toggleMosquito}
            id="mosquito-toggle"
            title="Toggle persistent field mosquito drone"
            className={`px-2.5 py-1.5 border text-xs font-mono flex items-center gap-1.5 transition-colors ${
              isMosquitoDroning
                ? 'bg-warning-rust/40 text-parchment-drab border-warning-rust'
                : 'bg-forester-dark text-lichen-stone border-bureau-green hover:text-parchment-drab'
            }`}
          >
            <Bug className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isMosquitoDroning ? '🦟 Drone Active' : '🦟 Ambience'}
            </span>
          </button>

          {/* Cicada Ambience */}
          <button
            onClick={startDialUp}
            title="Play summer cicada drone"
            className={`px-2.5 py-1.5 border text-xs font-mono flex items-center gap-1 transition-colors ${
              isDialUpPlaying
                ? 'bg-regulatory-gold/20 text-regulatory-gold border-regulatory-gold'
                : 'bg-forester-dark text-lichen-stone border-bureau-green hover:text-parchment-drab'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">🦗 Cicadas</span>
          </button>

          {/* Expert Mode (Drop Vowels) */}
          <button
            onClick={toggleExpertMode}
            id="expert-mode-toggle"
            title="Toggle Expert Mode: Deletes vowels to simulate dense academic brevity"
            className={`px-2.5 py-1.5 border text-xs font-mono font-bold flex items-center gap-1 transition-colors ${
              expertMode
                ? 'bg-regulatory-gold text-forester-dark border-regulatory-gold'
                : 'bg-forester-dark text-lichen-stone border-bureau-green hover:text-parchment-drab'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{expertMode ? 'EXPRT: N VWLS' : vowelFilter('Expert Mode')}</span>
          </button>

          {user ? (
            <div className="flex items-center gap-2 pl-1 border-l border-bureau-green">
              <div className="hidden lg:block text-right">
                <div className="text-[11px] font-mono text-parchment-drab truncate max-w-[120px]">
                  @{vowelFilter(user.username)}
                </div>
                <div className="text-[9px] font-mono text-lichen-stone">
                  Audit Grade: {user.chaos_tolerance_score}%
                </div>
              </div>
              <button
                onClick={logout}
                className="bg-forester-dark hover:bg-warning-rust/30 text-lichen-stone hover:text-parchment-drab border border-bureau-green text-xs px-2 py-1 font-mono"
              >
                {vowelFilter('Sign Out')}
              </button>
            </div>
          ) : (
            <Link
              to="/auth/login"
              className="bg-bureau-green text-parchment-drab font-mono text-xs px-3 py-1.5 border border-regulatory-gold hover:bg-officer-moss transition-colors"
            >
              {vowelFilter('Officer Portal')}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
