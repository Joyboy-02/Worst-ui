import React, { useState } from 'react';
import { useChaos } from '../context/ChaosContext';
import { HelpCircle } from 'lucide-react';

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
        setErrorMsg(data.message || 'Verification failed: The Commission rejects your response.');
      }
    } catch {
      if (answer.toLowerCase().includes('entropy') || answer.toLowerCase().includes('0') || answer.toLowerCase().includes('robigo')) {
        onSuccess();
      } else {
        setErrorMsg('The commission rejects your answer. Contemplate thermodynamic entropy.');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-forester-dark/95 flex items-center justify-center p-4 backdrop-blur-sm select-none">
      <div className="w-full max-w-md bg-peat-dark border border-bureau-green p-6 shadow-xl font-mono">
        <div className="flex items-center space-x-2 text-regulatory-gold mb-3 pb-2 border-b border-bureau-green">
          <HelpCircle className="w-5 h-5" />
          <h3 className="text-sm font-serif font-bold tracking-wide text-parchment-drab">
            {vowelFilter('STATUTORY ENQUIRY: ARABLE INTELLECT EVALUATION')}
          </h3>
        </div>

        <p className="text-xs text-lichen-stone mb-2">
          {vowelFilter('Section 22-A Anti-Automation Challenge. You must resolve the following agricultural query:')}
        </p>

        <div className="p-3 bg-forester-dark border border-bureau-green text-parchment-drab text-xs font-serif italic mb-3 leading-relaxed">
          "{vowelFilter(question)}"
        </div>

        {hint && (
          <div className="text-[11px] text-regulatory-gold mb-3 bg-forester-dark p-2 border border-bureau-green/50">
            * Guidance Note: {vowelFilter(hint)}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter philosophical resolution..."
            required
            className="w-full bg-forester-dark text-parchment-drab border border-bureau-green p-2 font-mono text-xs focus:outline-none focus:border-regulatory-gold"
          />

          {errorMsg && (
            <div className="text-xs text-warning-rust bg-forester-dark p-2 border border-warning-rust/50">
              § {vowelFilter(errorMsg)}
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => setAnswer('entropy')}
              className="text-[10px] text-lichen-stone hover:text-parchment-drab underline"
            >
              [ Accept Entropy Default ]
            </button>

            <button
              type="submit"
              disabled={isVerifying}
              className="bg-bureau-green hover:bg-officer-moss text-parchment-drab font-bold text-xs px-4 py-2 border border-regulatory-gold"
            >
              {isVerifying ? 'Auditing...' : vowelFilter('Submit Resolution')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
