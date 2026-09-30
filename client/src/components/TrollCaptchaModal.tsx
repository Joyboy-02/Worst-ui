import React, { useState } from 'react';
import { useChaos } from '../context/ChaosContext';
import { HelpCircle, CheckCircle, XCircle } from 'lucide-react';

interface TrollCaptchaProps {
  challengeId?: string;
  question?: string;
  hint?: string;
  isOpen: boolean;
  onSuccess: () => void;
}

export const TrollCaptchaModal: React.FC<TrollCaptchaProps> = ({
  challengeId = 'riddle-1',
  question = 'If a cornstalk falls in an empty monoculture field, does its carbon footprint make a sound?',
  hint = "Answer with 'entropy' or 'despair' if you possess agricultural enlightenment.",
  isOpen,
  onSuccess,
}) => {
  const [answer, setAnswer] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const { vowelFilter } = useChaos();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/captcha/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId,
          solution: answer,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        onSuccess();
      } else {
        setErrorMsg(data.message || 'Incorrect. The soil is not convinced.');
      }
    } catch {
      // Local fallback bypass for offline resilience
      if (answer.toLowerCase().includes('entropy') || answer.toLowerCase().includes('0') || answer.toLowerCase().includes('robigo')) {
        onSuccess();
      } else {
        setErrorMsg('The soil rejects your answer. Try contemplating entropy.');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-black/90 flex items-center justify-center p-4 backdrop-blur-md select-none">
      <div className="w-full max-w-md bg-neutral-950 border-4 border-yellow-400 p-6 shadow-[8px_8px_0px_#ff007f] font-mono">
        <div className="flex items-center space-x-2 text-yellow-400 mb-4 pb-2 border-b border-yellow-500">
          <HelpCircle className="w-6 h-6 animate-spin" />
          <h3 className="text-lg font-black tracking-wide">
            {vowelFilter('CAPTCHA: EXISTENTIAL SOIL RIDDLE')}
          </h3>
        </div>

        <p className="text-xs text-gray-400 mb-2">
          {vowelFilter('You have triggered the agricultural anti-bot defense matrix.')}
        </p>

        <div className="p-4 bg-black border border-neutral-800 text-yellow-300 text-sm font-bold mb-4 leading-relaxed">
          "{vowelFilter(question)}"
        </div>

        {hint && (
          <div className="text-[11px] text-pink-400 mb-4 bg-pink-950/40 p-2 border border-pink-800">
            💡 {vowelFilter(hint)}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your philosophical solution..."
            required
            className="w-full bg-neutral-900 text-toxic-green border-2 border-toxic-green p-2.5 font-mono text-sm focus:outline-none shadow-[2px_2px_0px_#fff]"
          />

          {errorMsg && (
            <div className="text-xs text-red-500 font-bold bg-red-950/60 p-2 border border-red-700">
              {vowelFilter(errorMsg)}
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => {
                // Troll cheat
                setAnswer('entropy');
              }}
              className="text-[10px] text-gray-500 hover:text-yellow-400 underline"
            >
              [ Surrender to Entropy ]
            </button>

            <button
              type="submit"
              disabled={isVerifying}
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs px-5 py-2.5 border-2 border-black shadow-[3px_3px_0px_#fff] uppercase tracking-wider"
            >
              {isVerifying ? 'Consulting Soil...' : vowelFilter('Submit Riddle Answer')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
