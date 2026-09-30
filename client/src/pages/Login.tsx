import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useChaos } from '../context/ChaosContext';
import { Rot13Input } from '../components/Rot13Input';
import { TrollCaptchaModal } from '../components/TrollCaptchaModal';
import { KeyRound, ShieldAlert, AlertTriangle, UserCheck } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, register, isLoading } = useAuth();
  const { vowelFilter, recordRageClick } = useChaos();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [captchaOpen, setCaptchaOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Hostile label swapping
  const [swapLabels, setSwapLabels] = useState(false);

  // Position shifts on focus
  const [inputShift, setInputShift] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleFocusShift = () => {
    const shiftX = Math.floor(Math.random() * 20) - 10;
    const shiftY = Math.floor(Math.random() * 12) - 6;
    setInputShift({ x: shiftX, y: shiftY });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Trigger riddle captcha on 50% of attempts
    if (!captchaOpen && Math.random() > 0.3) {
      setCaptchaOpen(true);
      return;
    }

    executeAuth();
  };

  const executeAuth = async () => {
    let success = false;
    if (isRegisterMode) {
      success = await register(username, `${username}@agro-hostile.org`, password);
    } else {
      success = await login(username, password);
    }

    if (success) {
      navigate('/dashboard');
    } else {
      setErrorMessage('The authentication matrix deemed your soul unworthy of soil telemetry.');
    }
  };

  const handleGuestQuickPass = async () => {
    await login('existential_farmer_99', 'inevitable_decay');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 select-none">
      <TrollCaptchaModal
        isOpen={captchaOpen}
        onSuccess={() => {
          setCaptchaOpen(false);
          executeAuth();
        }}
      />

      <div className="w-full max-w-lg bg-neutral-950 border-4 border-hostile-pink p-6 md:p-8 shadow-[10px_10px_0px_#00ff66] relative">
        {/* Hostile Header */}
        <div className="text-center mb-6 pb-4 border-b-2 border-dashed border-neutral-800">
          <div className="inline-flex p-3 bg-red-950 border-2 border-red-500 rounded-full mb-3 animate-pulse">
            <KeyRound className="w-8 h-8 text-yellow-300" />
          </div>
          <h2 className="text-2xl font-black font-mono text-toxic-green tracking-wide phosphor-glow">
            {vowelFilter(isRegisterMode ? 'ENLIST IN BOTANICAL DESPAIR' : 'HOSTILE AUTHENTICATION PORTAL')}
          </h2>
          <p className="text-xs text-yellow-400 font-mono mt-1">
            {vowelFilter('Notice: Tab order is deliberately randomized. Fields may flee under focus.')}
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-900/60 border-2 border-red-500 text-yellow-200 text-xs font-mono">
            ⚠️ {vowelFilter(errorMessage)}
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-5">
          {/* Username Input with Inverted TabIndex */}
          <div
            style={{
              transform: `translate(${inputShift.x}px, ${inputShift.y}px)`,
              transition: 'transform 0.15s ease-out',
            }}
          >
            <div className="flex justify-between items-center mb-1">
              <label
                onMouseEnter={() => setSwapLabels((s) => !s)}
                className="text-xs font-mono font-bold text-gray-300 cursor-help"
              >
                {vowelFilter(swapLabels ? 'Secret Passphrase (Swapped!)' : 'Agronomist Codename / Email')}
              </label>
              <span className="text-[10px] text-gray-500 font-mono">[Tab Index: 3]</span>
            </div>
            <input
              type="text"
              tabIndex={3} // Inverted tab order!
              value={username}
              onFocus={handleFocusShift}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. soil_cynic_42"
              required
              className="w-full bg-neutral-900 text-toxic-green border-2 border-neutral-700 focus:border-toxic-green p-2.5 font-mono text-sm focus:outline-none shadow-[2px_2px_0px_#000]"
            />
          </div>

          {/* Hostile Password Input (ROT-13 / Type Jitter) */}
          <div
            style={{
              transform: `translate(${-inputShift.x}px, ${-inputShift.y}px)`,
              transition: 'transform 0.15s ease-out',
            }}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] text-gray-500 font-mono">[Tab Index: 1]</span>
            </div>
            <Rot13Input
              value={password}
              onChange={setPassword}
              placeholder="Type password (mutates live)..."
              required
            />
          </div>

          {/* Inverted Tab Order Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              tabIndex={2} // Inverted tab index: 2 is between password (1) and username (3)
              disabled={isLoading}
              onClick={() => recordRageClick('hostile_auth_submit')}
              className="w-full bg-hostile-pink hover:bg-pink-700 text-white font-mono font-black text-sm py-3.5 border-2 border-white shadow-[4px_4px_0px_#ffff00] transition-transform active:scale-98 uppercase tracking-widest"
            >
              {isLoading
                ? 'Validating Soil Despair...'
                : vowelFilter(isRegisterMode ? 'Enlist New Farmer Profile' : 'Authenticate & Suffer')}
            </button>
          </div>
        </form>

        {/* Mode Toggle & Fast Pass Bypass */}
        <div className="mt-6 pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <button
            type="button"
            onClick={() => setIsRegisterMode((m) => !m)}
            className="text-yellow-400 hover:text-toxic-green underline"
          >
            {vowelFilter(isRegisterMode ? 'Already doomed? Log in here' : 'Need new record of failures? Register')}
          </button>

          <button
            type="button"
            onClick={handleGuestQuickPass}
            className="bg-neutral-900 hover:bg-neutral-800 text-toxic-green border border-toxic-green px-3 py-1.5 text-[11px] font-bold"
          >
            ⚡ {vowelFilter('Direct Bypass (Guest Mode)')}
          </button>
        </div>
      </div>
    </div>
  );
};
