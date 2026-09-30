import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChaos } from '../context/ChaosContext';
import { useAuth } from '../context/AuthContext';
import { TrollCaptchaModal } from '../components/TrollCaptchaModal';
import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  AlertOctagon,
  Sprout,
  HelpCircle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

const SWAHILI_CROPS = [
  { val: 'Maharagwe', label: 'Maharagwe (Common Bean)' },
  { val: 'Mahindi', label: 'Mahindi (Maize / Corn)' },
  { val: 'Mkonge', label: 'Mkonge (Sisal)' },
  { val: 'Mpunga', label: 'Mpunga (Paddy Rice)' },
  { val: 'Mtama', label: 'Mtama (Sorghum)' },
  { val: 'Muhogo', label: 'Muhogo (Cassava)' },
  { val: 'Ngano', label: 'Ngano (Wheat)' },
  { val: 'Pamba', label: 'Pamba (Cotton)' },
  { val: 'Viazi Vitamu', label: 'Viazi Vitamu (Sweet Potato)' },
];

const EMOJI_IRRIGATION_STOPS = ['🌵', '🏜️', '🪣', '💧', '🌧️', '🌊'];

export const AdvisoryForm: React.FC = () => {
  const navigate = useNavigate();
  const { vowelFilter, recordRageClick } = useChaos();
  const { token } = useAuth();

  const [step, setStep] = useState<number>(1);
  const totalSteps = 7;

  // Form State
  const [cropName, setCropName] = useState<string>('Mahindi');
  const [soilPh, setSoilPh] = useState<number>(6.5);
  const [nitrogen, setNitrogen] = useState<number>(45);
  const [phosphorus, setPhosphorus] = useState<number>(20);
  const [potassium, setPotassium] = useState<number>(30);
  const [soilType, setSoilType] = useState<string>('Clay Loam');
  const [irrigationIndex, setIrrigationIndex] = useState<number>(2);
  const [philosophyConsented, setPhilosophyConsented] = useState<boolean>(false);

  // UX Horrors State
  const [swapButtons, setSwapButtons] = useState<boolean>(false);
  const [accordionOpen, setAccordionOpen] = useState<boolean>(false);
  const [subAccordionOpen, setSubAccordionOpen] = useState<boolean>(false);
  const [soilButtonOffset, setSoilButtonOffset] = useState<Record<string, { x: number; y: number }>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [captchaTriggered, setCaptchaTriggered] = useState<boolean>(false);
  const [captchaChallenge, setCaptchaChallenge] = useState<any>(null);
  const [hostileError, setHostileError] = useState<string>('');

  // Hostile radio evasion for Step 4
  const handleSoilHover = (type: string) => {
    const randomX = Math.floor(Math.random() * 80) - 40;
    const randomY = Math.floor(Math.random() * 40) - 20;
    setSoilButtonOffset((prev) => ({
      ...prev,
      [type]: { x: randomX, y: randomY },
    }));
    recordRageClick(`soil_radio_evade_${type}`);
  };

  // Step 7: Swapping Next and Back buttons
  const handleNavButtonHover = () => {
    if (Math.random() > 0.4) {
      setSwapButtons((s) => !s);
    }
  };

  const handleNext = () => {
    if (step === 6 && !philosophyConsented) {
      alert('You failed to locate and sign the Ancient Philosophy & Legal Disclaimers covenant inside the accordion!');
      recordRageClick('failed_accordion_disclaimer');
      return;
    }
    setStep((s) => Math.min(totalSteps, s + 1));
  };

  const handleBack = () => {
    setStep((s) => Math.max(1, s - 1));
  };

  const handleReset = () => {
    setHostileError(
      'Errare humanum est: By clicking Reset, you have invoked the wrath of Zod. Crop name must appease the soil gods.'
    );
    recordRageClick('form_reset_clicked');
  };

  const submitForm = async () => {
    setIsSubmitting(true);
    setHostileError('');

    const payload = {
      cropName,
      soilPh: Number(soilPh),
      npk: {
        nitrogen: Number(nitrogen),
        phosphorus: Number(phosphorus),
        potassium: Number(potassium),
      },
    };

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/advisory/generate', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.status === 429 && data.captchaRequired) {
        setCaptchaChallenge(data.challenge);
        setCaptchaTriggered(true);
        setIsSubmitting(false);
        return;
      }

      if (res.ok && data.data) {
        // Save to sessionStorage for /advisory/results
        sessionStorage.setItem('current_advisory', JSON.stringify(data.data));
        sessionStorage.setItem('current_advisory_meta', JSON.stringify(data.metadataWrapper || {}));
        navigate('/advisory/results');
      } else {
        const heresyMsg = data.reasons?.map((r: any) => r.heresy).join(' | ') || data.message || 'Submission rejected by the biosphere.';
        setHostileError(heresyMsg);
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      setHostileError('Connection severed. Topsoil failed to transmit packet.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 select-none">
      {captchaTriggered && captchaChallenge && (
        <TrollCaptchaModal
          isOpen={captchaTriggered}
          challengeId={captchaChallenge.challengeId}
          question={captchaChallenge.question}
          hint={captchaChallenge.hint}
          onSuccess={() => {
            setCaptchaTriggered(false);
            submitForm();
          }}
        />
      )}

      <div className="max-w-3xl mx-auto bg-neutral-950 border-4 border-toxic-green p-6 md:p-10 shadow-[12px_12px_0px_#ff007f] relative">
        {/* Step Indicator with chaotic progress */}
        <div className="mb-8 border-b-2 border-dashed border-neutral-800 pb-4">
          <div className="flex justify-between items-center text-xs font-mono text-yellow-400 mb-2">
            <span>
              {vowelFilter(`LABYRINTH STEP ${step} OF ${totalSteps}`)}
            </span>
            <span className="text-pink-500 font-bold">
              {vowelFilter(`Frustration Quotient: ${(step * 14.28).toFixed(1)}%`)}
            </span>
          </div>

          <div className="w-full bg-neutral-900 h-3 border border-toxic-green">
            <div
              className="bg-toxic-green h-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {hostileError && (
          <div className="mb-6 p-4 bg-red-950/80 border-2 border-red-500 text-yellow-200 text-xs font-mono leading-relaxed">
            ⚠️ {vowelFilter(hostileError)}
          </div>
        )}

        {/* Step 1: Crop Name (Swahili / Zulu alphabetical order) */}
        {step === 1 && (
          <div className="space-y-4 font-mono">
            <div className="flex items-center space-x-2 text-toxic-green">
              <Sprout className="w-5 h-5" />
              <h2 className="text-lg font-black tracking-wide">
                {vowelFilter('Step 1: Botanical Specimen Categorization')}
              </h2>
            </div>
            <p className="text-xs text-gray-400">
              {vowelFilter(
                'Select your crop. Notice: Dropdown options are arranged strictly alphabetically in Kiswahili dialect to challenge Eurocentric agronomy.'
              )}
            </p>

            <select
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              className="w-full bg-neutral-900 text-toxic-green border-2 border-toxic-green p-3 font-mono text-sm focus:outline-none shadow-[4px_4px_0px_#000]"
            >
              {SWAHILI_CROPS.map((c) => (
                <option key={c.val} value={c.val}>
                  {c.label}
                </option>
              ))}
            </select>

            <div className="text-[11px] text-yellow-300">
              * Selected: <span className="font-bold">{cropName}</span>
            </div>
          </div>
        )}

        {/* Step 2: Soil pH */}
        {step === 2 && (
          <div className="space-y-4 font-mono">
            <h2 className="text-lg font-black text-yellow-300">
              {vowelFilter('Step 2: Soil pH Ionization Potential')}
            </h2>
            <p className="text-xs text-gray-400">
              {vowelFilter('Input pH on a range from -2.0 (Volcanic Acid) to 16.0 (Caustic Bleach). Zod will judge you harshly.')}
            </p>

            <div className="p-4 bg-black border-2 border-neutral-800 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span>{vowelFilter('Selected pH Level')}:</span>
                <span className="text-2xl font-black text-toxic-green">{soilPh}</span>
              </div>
              <input
                type="range"
                min="-2"
                max="16"
                step="0.1"
                value={soilPh}
                onChange={(e) => setSoilPh(Number(e.target.value))}
                className="w-full h-3 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-hostile-pink"
              />
              <div className="flex justify-between text-[10px] text-gray-500">
                <span>-2.0 (Active Volcano)</span>
                <span>7.0 (Nihilistic Neutral)</span>
                <span>16.0 (Alien Crystal)</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: NPK Status (Jittering numeric inputs) */}
        {step === 3 && (
          <div className="space-y-4 font-mono">
            <h2 className="text-lg font-black text-hostile-pink">
              {vowelFilter('Step 3: Macronutrient NPK Ratios (ppm)')}
            </h2>
            <p className="text-xs text-gray-400">
              {vowelFilter('Clicking inputs may cause values to randomly jitter due to subterranean microbial turbulence.')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-toxic-green font-bold block mb-1">
                  Nitrogen (N)
                </label>
                <input
                  type="number"
                  value={nitrogen}
                  onClick={() => setNitrogen((n) => Math.max(1, n + (Math.random() > 0.5 ? 2 : -2)))}
                  onChange={(e) => setNitrogen(Number(e.target.value))}
                  className="w-full bg-neutral-900 text-yellow-300 border-2 border-neutral-700 p-2.5 font-mono text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-yellow-400 font-bold block mb-1">
                  Phosphorus (P)
                </label>
                <input
                  type="number"
                  value={phosphorus}
                  onClick={() => setPhosphorus((p) => Math.max(1, p + (Math.random() > 0.5 ? 1 : -1)))}
                  onChange={(e) => setPhosphorus(Number(e.target.value))}
                  className="w-full bg-neutral-900 text-yellow-300 border-2 border-neutral-700 p-2.5 font-mono text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-cyan-400 font-bold block mb-1">
                  Potassium (K)
                </label>
                <input
                  type="number"
                  value={potassium}
                  onClick={() => setPotassium((k) => Math.max(1, k + (Math.random() > 0.5 ? 3 : -3)))}
                  onChange={(e) => setPotassium(Number(e.target.value))}
                  className="w-full bg-neutral-900 text-yellow-300 border-2 border-neutral-700 p-2.5 font-mono text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Soil Type (Shrinking & Fleeing radio buttons) */}
        {step === 4 && (
          <div className="space-y-4 font-mono">
            <h2 className="text-lg font-black text-cyan-400">
              {vowelFilter('Step 4: Soil Texture Classification')}
            </h2>
            <p className="text-xs text-gray-400">
              {vowelFilter('Hovering over soil types causes them to flee as they resent being anthropomorphized.')}
            </p>

            <div className="grid grid-cols-2 gap-4 py-4">
              {['Sandy Loam', 'Heavy Clay', 'Peat Moss', 'Volcanic Silt'].map((type) => {
                const offset = soilButtonOffset[type] || { x: 0, y: 0 };
                const isSelected = soilType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onMouseEnter={() => handleSoilHover(type)}
                    onClick={() => setSoilType(type)}
                    style={{
                      transform: `translate(${offset.x}px, ${offset.y}px) scale(${isSelected ? 1.05 : 0.95})`,
                      transition: 'transform 0.15s ease-out',
                    }}
                    className={`p-4 border-2 font-mono text-xs font-bold text-center ${
                      isSelected
                        ? 'bg-toxic-green text-black border-white shadow-[3px_3px_0px_#ff007f]'
                        : 'bg-neutral-900 text-gray-300 border-neutral-700 hover:border-yellow-400'
                    }`}
                  >
                    {vowelFilter(type)}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 5: Irrigation Method (Emoji-only slider) */}
        {step === 5 && (
          <div className="space-y-4 font-mono">
            <h2 className="text-lg font-black text-yellow-300">
              {vowelFilter('Step 5: Hydrological Allocation Protocol')}
            </h2>
            <p className="text-xs text-gray-400">
              {vowelFilter('Numerical irrigation measurements are banned. You must calibrate strictly using emojis.')}
            </p>

            <div className="p-6 bg-black border-2 border-neutral-800 text-center space-y-4">
              <div className="text-5xl">{EMOJI_IRRIGATION_STOPS[irrigationIndex]}</div>
              <input
                type="range"
                min="0"
                max={EMOJI_IRRIGATION_STOPS.length - 1}
                value={irrigationIndex}
                onChange={(e) => setIrrigationIndex(Number(e.target.value))}
                className="w-full h-4 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-xl px-2">
                {EMOJI_IRRIGATION_STOPS.map((emoji, i) => (
                  <span key={i} className={i === irrigationIndex ? 'scale-125' : 'opacity-40'}>
                    {emoji}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Legal Disclaimers & Ancient Philosophy Accordion */}
        {step === 6 && (
          <div className="space-y-4 font-mono">
            <h2 className="text-lg font-black text-red-500">
              {vowelFilter('Step 6: Ancient Philosophy & Legal Disclaimers')}
            </h2>
            <p className="text-xs text-gray-400">
              {vowelFilter('Mandatory compliance oath. The required authorization box is concealed within nested philosophical treatises.')}
            </p>

            {/* Accordion Layer 1 */}
            <div className="border-2 border-neutral-700 bg-neutral-900">
              <button
                type="button"
                onClick={() => setAccordionOpen((o) => !o)}
                className="w-full p-3 text-left font-mono font-bold text-xs flex justify-between items-center text-yellow-300"
              >
                <span>{vowelFilter('Volume I: Heraclitus on Soil Flux & Nitrogen Nihilism')}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${accordionOpen ? 'rotate-180' : ''}`} />
              </button>

              {accordionOpen && (
                <div className="p-3 border-t border-neutral-800 text-xs text-gray-400 space-y-3">
                  <p>
                    "No farmer ever steps into the same furrow twice, for it is not the same furrow and they are not the same farmer. Everything decays, especially your phosphorus reserves."
                  </p>

                  {/* Accordion Layer 2 (Deeply Nested) */}
                  <div className="border border-neutral-700 bg-black p-3">
                    <button
                      type="button"
                      onClick={() => setSubAccordionOpen((o) => !o)}
                      className="w-full text-left font-bold text-xs text-toxic-green flex justify-between items-center"
                    >
                      <span>{vowelFilter('Codex Subterranea: Article IX (Spiritual Parity with Nematodes)')}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${subAccordionOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {subAccordionOpen && (
                      <div className="mt-3 pt-2 border-t border-neutral-800 space-y-3">
                        <p className="text-[11px] text-gray-500">
                          By checking the box below, you waive all rights to a fruitful autumn and solemnly declare that aphids possess equal moral standing to agricultural shareholders.
                        </p>

                        <label className="flex items-center space-x-2 text-xs text-yellow-300 cursor-pointer p-2 bg-neutral-900 border border-yellow-500">
                          <input
                            type="checkbox"
                            checked={philosophyConsented}
                            onChange={(e) => setPhilosophyConsented(e.target.checked)}
                            className="w-4 h-4 accent-toxic-green"
                          />
                          <span className="font-bold">
                            {vowelFilter('I acknowledge that soil entropy is irreversible and accept full liability.')}
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 7: Confirmation & Hostile Next/Back Swap */}
        {step === 7 && (
          <div className="space-y-4 font-mono">
            <h2 className="text-xl font-black text-toxic-green">
              {vowelFilter('Step 7: Final Agronomic Submission')}
            </h2>
            <p className="text-xs text-gray-400">
              {vowelFilter('Review your parameters. Notice that the Submit button is prone to kinetic displacement.')}
            </p>

            <div className="p-4 bg-black border-2 border-neutral-800 space-y-2 text-xs">
              <div className="flex justify-between border-b border-neutral-800 pb-1">
                <span className="text-gray-400">Crop:</span>
                <span className="text-toxic-green font-bold">{cropName}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800 pb-1">
                <span className="text-gray-400">Soil pH:</span>
                <span className="text-yellow-400 font-bold">{soilPh}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800 pb-1">
                <span className="text-gray-400">NPK:</span>
                <span className="text-cyan-400 font-bold">{nitrogen} - {phosphorus} - {potassium}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800 pb-1">
                <span className="text-gray-400">Soil Texture:</span>
                <span className="text-gray-200">{soilType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Irrigation:</span>
                <span className="text-lg">{EMOJI_IRRIGATION_STOPS[irrigationIndex]}</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons: Swaps Next and Back dynamically! */}
        <div className="mt-8 pt-4 border-t-2 border-dashed border-neutral-800 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-mono text-gray-500 hover:text-red-400 flex items-center gap-1 underline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{vowelFilter('Reset Form (Triggers Latin Errors)')}</span>
          </button>

          <div
            onMouseEnter={handleNavButtonHover}
            className={`flex items-center gap-3 ${swapButtons ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="bg-neutral-900 hover:bg-neutral-800 text-gray-300 font-mono font-bold text-xs px-4 py-2.5 border-2 border-neutral-700 flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{vowelFilter('Back')}</span>
              </button>
            )}

            {step < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="bg-toxic-green hover:bg-toxic-green/90 text-black font-mono font-black text-xs md:text-sm px-6 py-2.5 border-2 border-white shadow-[3px_3px_0px_#ff007f] flex items-center gap-1 active:scale-95"
              >
                <span>{vowelFilter('Next Step')}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={submitForm}
                disabled={isSubmitting}
                className="bg-hostile-pink hover:bg-pink-600 text-white font-mono font-black text-sm px-8 py-3 border-2 border-white shadow-[4px_4px_0px_#ffff00] animate-pulse"
              >
                {isSubmitting ? 'Consulting Gemini AI 2.5 Flash...' : vowelFilter('Transmit to Google Gemini AI')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
