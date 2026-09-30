import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useChaos } from '../context/ChaosContext';
import { Rot13Input } from '../components/Rot13Input';
import { TrollCaptchaModal } from '../components/TrollCaptchaModal';
import { KeyRound, Shield } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, register, isLoading } = useAuth();
  const { vowelFilter, recordRageClick } = useChaos();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [captchaOpen, setCaptchaOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [swapLabels, setSwapLabels] = useState(false);
  const [inputShift, setInputShift] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleFocusShift = () => {
    const shiftX = Math.floor(Math.random() * 16) - 8;
    const shiftY = Math.floor(Math.random() * 8) - 4;
    setInputShift({ x: shiftX, y: shiftY });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!captchaOpen && Math.random() > 0.3) {
      setCaptchaOpen(true);
      return;
    }

    executeAuth();
  };

  const executeAuth = async () => {
    let success = false;
    if (isRegisterMode) {
      success = await register(username, `${username}@soil-commission.gov`, password);
    } else {
      success = await login(username, password);
    }

    if (success) {
      navigate('/dashboard');
    } else {
      setErrorMessage('Access denied: Soil credentials failed validation under statutory standards.');
    }
  };

  const handleGuestQuickPass = async () => {
    await login('officer_vance_88', 'statutory_compliance');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-forester-dark text-parchment-drab flex items-center justify-center p-4 select-none">
      <TrollCaptchaModal
        isOpen={captchaOpen}
        onSuccess={() => {
          setCaptchaOpen(false);
          executeAuth();
        }}
      />

      <div className="w-full max-w-lg bg-peat-dark border border-bureau-green p-6 md:p-8 shadow-xl relative">
        <div className="text-center mb-6 pb-4 border-b border-bureau-green">
          <div className="inline-flex p-2.5 bg-forester-dark border border-bureau-green rounded-sm mb-2.5 text-regulatory-gold">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-serif font-bold text-parchment-drab tracking-wide">
            {vowelFilter(isRegisterMode ? 'MUNICIPAL REGISTRATION OF ARABLE OPERATOR' : 'OFFICIAL SOIL ACCESS CHECKPOINT')}
          </h2>
          <p className="text-xs text-lichen-stone font-mono mt-1">
            {vowelFilter('Notice: Tabulation sequence is non-linear per Security Regulation 88-C.')}
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-forester-dark border border-warning-rust text-parchment-drab text-xs font-mono">
            § {vowelFilter(errorMessage)}
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Username (Tab Index: 3) */}
          <div
            style={{
              transform: `translate(${inputShift.x}px, ${inputShift.y}px)`,
              transition: 'transform 0.15s ease-out',
            }}
          >
            <div className="flex justify-between items-center mb-1">
              <label
                onMouseEnter={() => setSwapLabels((s) => !s)}
                className="text-xs font-mono font-medium text-parchment-muted cursor-help"
              >
                {vowelFilter(swapLabels ? 'Passphrase Key (Swapped!)' : 'Officer Codename / Identifier')}
              </label>
              <span className="text-[10px] text-lichen-stone font-mono">[Tab Index: 3]</span>
            </div>
            <input
              type="text"
              tabIndex={3}
              value={username}
              onFocus={handleFocusShift}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. officer_vance_88"
              required
              className="w-full bg-forester-dark text-parchment-drab border border-bureau-green focus:border-regulatory-gold p-2.5 font-mono text-sm focus:outline-none shadow-inner"
            />
          </div>

          {/* Password (Tab Index: 1) */}
          <div
            style={{
              transform: `translate(${-inputShift.x}px, ${-inputShift.y}px)`,
              transition: 'transform 0.15s ease-out',
            }}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] text-lichen-stone font-mono">[Tab Index: 1]</span>
            </div>
            <Rot13Input
              value={password}
              onChange={setPassword}
              placeholder="Enter statutory key..."
              required
            />
          </div>

          {/* Submit Button (Tab Index: 2) */}
          <div className="pt-2">
            <button
              type="submit"
              tabIndex={2}
              disabled={isLoading}
              onClick={() => recordRageClick('hostile_auth_submit')}
              className="w-full bg-bureau-green hover:bg-officer-moss text-parchment-drab font-mono font-bold text-xs py-3 border border-regulatory-gold shadow-sm transition-colors uppercase tracking-wider"
            >
              {isLoading
                ? 'Validating Statutory Registry...'
                : vowelFilter(isRegisterMode ? 'Register Operator File' : 'Authenticate & Enter Docket')}
            </button>
          </div>
        </form>

        <div className="mt-5 pt-3 border-t border-bureau-green flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <button
            type="button"
            onClick={() => setIsRegisterMode((m) => !m)}
            className="text-regulatory-gold hover:underline"
          >
            {vowelFilter(isRegisterMode ? 'Return to Standard Sign-in' : 'New Arable Operator? File Registration')}
          </button>

          <button
            type="button"
            onClick={handleGuestQuickPass}
            className="bg-forester-dark hover:bg-peat-dark text-parchment-muted border border-bureau-green px-2.5 py-1 text-[11px]"
          >
            {vowelFilter('Expedited Officer Pass (Bypass)')}
          </button>
        </div>
      </div>
    </div>
  );
};
