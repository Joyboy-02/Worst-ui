import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useChaos } from '../context/ChaosContext';
import { useAuth } from '../context/AuthContext';
import { Skull, Volume2, ShieldAlert, Sparkles, Frown } from 'lucide-react';

interface NavItem {
  path: string;
  defaultLabel: string;
  hostileLabels: string[];
}

export const HostileNavbar: React.FC = () => {
  const location = useLocation();
  const { expertMode, toggleExpertMode, vowelFilter, isDialUpPlaying, startDialUp, rageClicks } = useChaos();
  const { user, logout } = useAuth();

  const navItems: NavItem[] = [
    {
      path: '/',
      defaultLabel: 'Welcome Portal',
      hostileLabels: ['Abandon Hope', 'Return to Clay', 'Fallow Dirt', 'Error 418: Teapot'],
    },
    {
      path: '/dashboard',
      defaultLabel: 'Telemetry Hub',
      hostileLabels: ['Shifting Sands', 'Rotting Meters', 'Panic Room', 'Soil Crisis'],
    },
    {
      path: '/advisory/new',
      defaultLabel: 'New Advisory',
      hostileLabels: ['Invoke Ruin', 'Torture Agronomist', 'Labyrinth Of Blight', 'Waste Fertilizer'],
    },
    {
      path: '/history',
      defaultLabel: 'Past Submissions',
      hostileLabels: ['Hall Of Failures', 'Archive Of Regret', 'The Graveyard', 'Infinite Void'],
    },
  ];

  // Map of hover texts for links
  const [hoverTextMap, setHoverTextMap] = useState<Record<string, string>>({});

  const handleMouseEnter = (path: string, hostileLabels: string[]) => {
    const randomHostile = hostileLabels[Math.floor(Math.random() * hostileLabels.length)];
    setHoverTextMap((prev) => ({ ...prev, [path]: randomHostile }));
  };

  const handleMouseLeave = (path: string) => {
    // 50% chance it doesn't change back immediately to confuse the user!
    if (Math.random() > 0.4) {
      setHoverTextMap((prev) => {
        const copy = { ...prev };
        delete copy[path];
        return copy;
      });
    }
  };

  return (
    <nav className="bg-neutral-950 border-b-4 border-toxic-green sticky top-0 z-40 select-none shadow-[0_4px_20px_rgba(0,255,102,0.2)]">
      {/* Top micro-marquee warning banner */}
      <div className="bg-yellow-400 text-black font-mono font-black text-xs py-1 px-4 overflow-hidden border-b border-black flex justify-between items-center">
        <span className="animate-marquee whitespace-nowrap">
          ⚠️ NOTICE: AGRO-WORST-UI v2.5 OPERATIONAL // NITROGEN LEACHING RISK AT 98.4% // ALL SCIENTIFIC ACCURACY STRICTLY GUARANTEED BY GEMINI 2.5 FLASH // PROCEED AT YOUR OWN PSYCHOLOGICAL RISK ⚠️
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Logo / Brand */}
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="w-10 h-10 bg-toxic-green text-black flex items-center justify-center font-black text-2xl border-2 border-white group-hover:rotate-180 transition-transform duration-300">
            🌾
          </div>
          <div>
            <span className="text-xl font-black font-mono text-toxic-green tracking-wider phosphor-glow block">
              {vowelFilter('AGRO-HOSTILE')}
            </span>
            <span className="text-[10px] text-pink-500 font-mono tracking-widest block uppercase">
              {vowelFilter('Worst UI Agronomy Engine')}
            </span>
          </div>
        </Link>

        {/* Shifting Hostile Navigation Links */}
        <div className="flex flex-wrap items-center gap-1 md:gap-2">
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
                className={`px-3 py-1.5 text-xs md:text-sm font-mono font-bold tracking-tight border-2 transition-all duration-150 ${
                  isActive
                    ? 'bg-toxic-green text-black border-white shadow-[3px_3px_0px_#fff]'
                    : 'bg-black text-gray-300 border-neutral-700 hover:border-hostile-pink hover:text-white hover:bg-neutral-900'
                }`}
              >
                {vowelFilter(currentLabel)}
              </Link>
            );
          })}
        </div>

        {/* Hostile Control Matrix */}
        <div className="flex items-center space-x-2">
          {/* Dial-up modem screech button */}
          <button
            onClick={startDialUp}
            title="Invoke 56k Dial-Up Serenade"
            className={`p-2 border-2 text-xs font-mono font-bold flex items-center gap-1 ${
              isDialUpPlaying
                ? 'bg-red-600 text-yellow-300 border-yellow-300 animate-pulse'
                : 'bg-neutral-900 text-cyan-400 border-cyan-400 hover:bg-cyan-950'
            }`}
          >
            <Volume2 className="w-4 h-4 animate-bounce" />
            <span className="hidden sm:inline">{vowelFilter('56k Audio')}</span>
          </button>

          {/* Expert Mode (Disable Vowels) Toggle */}
          <button
            onClick={toggleExpertMode}
            id="expert-mode-toggle"
            title="Toggle Expert Mode: Deletes all vowels from the application"
            className={`px-2.5 py-1.5 border-2 text-xs font-mono font-black flex items-center gap-1.5 transition-colors ${
              expertMode
                ? 'bg-hostile-pink text-white border-yellow-300 shadow-[3px_3px_0px_#ffff00]'
                : 'bg-neutral-900 text-gray-400 border-neutral-700 hover:text-white hover:border-pink-500'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{expertMode ? 'XPRT MD: N VWLS' : vowelFilter('Expert Mode')}</span>
          </button>

          {/* User profile or login button */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden lg:block text-right">
                <div className="text-[11px] font-mono text-toxic-green truncate max-w-[120px]">
                  @{vowelFilter(user.username)}
                </div>
                <div className="text-[9px] font-mono text-yellow-400">
                  Chaos Tol: {user.chaos_tolerance_score}%
                </div>
              </div>
              <button
                onClick={logout}
                className="bg-neutral-900 hover:bg-red-950 text-red-400 hover:text-red-200 border-2 border-red-800 text-xs px-2.5 py-1 font-mono font-bold"
              >
                {vowelFilter('Abandon')}
              </button>
            </div>
          ) : (
            <Link
              to="/auth/login"
              className="bg-toxic-green text-black font-mono font-black text-xs px-3 py-1.5 border-2 border-white hover:bg-yellow-400 transition-colors shadow-[2px_2px_0px_#ff007f]"
            >
              {vowelFilter('Enter Ordeal')}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
