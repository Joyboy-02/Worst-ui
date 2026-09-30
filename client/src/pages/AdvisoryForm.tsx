import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChaos } from '../context/ChaosContext';
import { useAuth } from '../context/AuthContext';
import { TrollCaptchaModal } from '../components/TrollCaptchaModal';
import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  RotateCcw,
  FileText,
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
  const [soilType, setSoilType] = useState<string>('Heavy Clay');
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

  const handleSoilHover = (type: string) => {
    const randomX = Math.floor(Math.random() * 80) - 40;
    const randomY = Math.floor(Math.random() * 40) - 20;
    setSoilButtonOffset((prev) => ({
      ...prev,
      [type]: { x: randomX, y: randomY },
    }));
    recordRageClick(`soil_classification_evasion_${type}`);
  };

  const handleNavButtonHover = () => {
    if (Math.random() > 0.4) {
      setSwapButtons((s) => !s);
    }
  };

  const handleNext = () => {
    if (step === 6 && !philosophyConsented) {
      alert('Statutory Warning: You have not located or executed the mandatory Nematode Parity Agreement in Subsection IX!');
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
      'Errare humanum est: Form reset rejected. All crop submissions must withstand rigorous statutory scrutiny.'
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
        sessionStorage.setItem('current_advisory', JSON.stringify(data.data));
        sessionStorage.setItem('current_advisory_meta', JSON.stringify(data.metadataWrapper || {}));
        navigate('/advisory/results');
      } else {
        const heresyMsg = data.reasons?.map((r: any) => r.heresy).join(' | ') || data.message || 'Submission rejected by the commission.';
        setHostileError(heresyMsg);
      }
    } catch (err: any) {
      console.warn('Backend endpoint unreachable, engaging client-side statutory fallback engine:', err);
      const fallbackAdvisory = {
        cropHealthScore: Math.max(14, Math.min(88, 100 - Math.round(Math.abs(Number(soilPh) - 6.5) * 16))),
        primaryDiagnosis: `Statutory Evaluation for ${cropName}: Acute topsoil leaching observed. Soil pH of ${soilPh} combined with NPK status (${nitrogen}-${phosphorus}-${potassium}) demonstrates severe administrative negligence under Section 14-B.`,
        actionableRecommendations: [
          `Incorporate pulverized dolomitic limestone at 2.8 t/ha to buffer active hydrogen ions.`,
          `Suspend excess synthetic fertilizer applications; current nitrogen quotient exceeds watershed limits.`,
          `File Form 24-B with the municipal soil authority before root necrosis progresses further.`
        ],
        riskFactor: Number(soilPh) < 5.5 ? ('HIGH' as const) : ('MEDIUM' as const)
      };
      sessionStorage.setItem('current_advisory', JSON.stringify(fallbackAdvisory));
      sessionStorage.setItem('current_advisory_meta', JSON.stringify({
        epochEntropy: Date.now(),
        soilNihilismVector: ["0.742", "0.381"],
        warning: "Generated under client-side statutory fallback protocol."
      }));
      try {
        const prevHist = JSON.parse(localStorage.getItem('agro_local_history') || '[]');
        prevHist.unshift({
          id: 'advisory-' + Date.now(),
          user_id: 'default',
          crop_name: cropName,
          soil_ph: Number(soilPh),
          npk_status: { nitrogen: Number(nitrogen), phosphorus: Number(phosphorus), potassium: Number(potassium) },
          ai_raw_response: JSON.stringify(fallbackAdvisory),
          ai_parsed: fallbackAdvisory,
          frustration_index: 82,
          created_at: new Date().toISOString()
        });
        localStorage.setItem('agro_local_history', JSON.stringify(prevHist));
      } catch {
        // ignore
      }
      navigate('/advisory/results');
      return;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-forester-dark text-parchment-drab p-4 md:p-8 select-none">
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

      <div className="max-w-3xl mx-auto bg-peat-dark border border-bureau-green p-6 md:p-10 shadow-lg relative">
        {/* Step Indicator */}
        <div className="mb-6 border-b border-bureau-green pb-4">
          <div className="flex justify-between items-center text-xs font-mono text-lichen-stone mb-2">
            <span>
              {vowelFilter(`STATUTORY FILING ANNEX ${step} OF ${totalSteps}`)}
            </span>
            <span className="text-regulatory-gold font-bold">
              {vowelFilter(`Procedural Friction Index: ${(step * 14.28).toFixed(1)}%`)}
            </span>
          </div>

          <div className="w-full bg-forester-dark h-2 border border-bureau-green">
            <div
              className="bg-subdued-fern h-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {hostileError && (
          <div className="mb-6 p-4 bg-forester-dark border border-warning-rust text-parchment-drab text-xs font-mono leading-relaxed">
            § {vowelFilter(hostileError)}
          </div>
        )}

        {/* Step 1: Crop Name */}
        {step === 1 && (
          <div className="space-y-4 font-mono">
            <h2 className="text-base font-serif font-bold text-parchment-drab">
              {vowelFilter('Annex 1: Specimen Botanical Nomenclature')}
            </h2>
            <p className="text-xs text-lichen-stone leading-relaxed">
              {vowelFilter(
                'Select your crop. Notice: Dropdown options are arranged strictly alphabetically in Kiswahili dialect to challenge Eurocentric agronomy.'
              )}
            </p>

            <select
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              className="w-full bg-forester-dark text-parchment-drab border border-bureau-green p-3 font-mono text-sm focus:outline-none focus:border-regulatory-gold"
            >
              {SWAHILI_CROPS.map((c) => (
                <option key={c.val} value={c.val}>
                  {c.label}
                </option>
              ))}
            </select>

            <div className="text-xs text-regulatory-gold">
              * Active Declaration: <span className="font-bold">{cropName}</span>
            </div>
          </div>
        )}

        {/* Step 2: Soil pH */}
        {step === 2 && (
          <div className="space-y-4 font-mono">
            <h2 className="text-base font-serif font-bold text-parchment-drab">
              {vowelFilter('Annex 2: Soil pH Ionization Potential')}
            </h2>
            <p className="text-xs text-lichen-stone leading-relaxed">
              {vowelFilter('Permitted statutory range spans from -2.0 (Volcanic Acid) to 16.0 (Caustic Bleach). Zod will judge you harshly.')}
            </p>

            <div className="p-4 bg-forester-dark border border-bureau-green space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span>{vowelFilter('Declared pH Value')}:</span>
                <span className="text-xl font-bold text-regulatory-gold">{soilPh}</span>
              </div>
              <input
                type="range"
                min="-2"
                max="16"
                step="0.1"
                value={soilPh}
                onChange={(e) => setSoilPh(Number(e.target.value))}
                className="w-full h-2 bg-peat-dark rounded appearance-none cursor-pointer accent-regulatory-gold"
              />
              <div className="flex justify-between text-[10px] text-lichen-stone">
                <span>-2.0 (Volcanic)</span>
                <span>7.0 (Forest Neutral)</span>
                <span>16.0 (Caustic)</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: NPK */}
        {step === 3 && (
          <div className="space-y-4 font-mono">
            <h2 className="text-base font-serif font-bold text-parchment-drab">
              {vowelFilter('Annex 3: Macronutrient NPK Calibration (ppm)')}
            </h2>
            <p className="text-xs text-lichen-stone leading-relaxed">
              {vowelFilter('Input values may fluctuate upon focus due to atmospheric barometric pressure variations.')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-lichen-stone block mb-1">
                  Nitrogen (N)
                </label>
                <input
                  type="number"
                  value={nitrogen}
                  onClick={() => setNitrogen((n) => Math.max(1, n + (Math.random() > 0.5 ? 2 : -2)))}
                  onChange={(e) => setNitrogen(Number(e.target.value))}
                  className="w-full bg-forester-dark text-parchment-drab border border-bureau-green p-2.5 font-mono text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-lichen-stone block mb-1">
                  Phosphorus (P)
                </label>
                <input
                  type="number"
                  value={phosphorus}
                  onClick={() => setPhosphorus((p) => Math.max(1, p + (Math.random() > 0.5 ? 1 : -1)))}
                  onChange={(e) => setPhosphorus(Number(e.target.value))}
                  className="w-full bg-forester-dark text-parchment-drab border border-bureau-green p-2.5 font-mono text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-lichen-stone block mb-1">
                  Potassium (K)
                </label>
                <input
                  type="number"
                  value={potassium}
                  onClick={() => setPotassium((k) => Math.max(1, k + (Math.random() > 0.5 ? 3 : -3)))}
                  onChange={(e) => setPotassium(Number(e.target.value))}
                  className="w-full bg-forester-dark text-parchment-drab border border-bureau-green p-2.5 font-mono text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Soil Type (Fleeing radio buttons) */}
        {step === 4 && (
          <div className="space-y-4 font-mono">
            <h2 className="text-base font-serif font-bold text-parchment-drab">
              {vowelFilter('Annex 4: Physical Soil Texture Classification')}
            </h2>
            <p className="text-xs text-lichen-stone leading-relaxed">
              {vowelFilter('Buttons exhibit slight evasive displacement when hovered, simulating shifting topsoil dunes.')}
            </p>

            <div className="grid grid-cols-2 gap-4 py-3">
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
                      transform: `translate(${offset.x}px, ${offset.y}px)`,
                      transition: 'transform 0.14s ease-out',
                    }}
                    className={`p-3.5 border font-mono text-xs text-center transition-colors ${
                      isSelected
                        ? 'bg-bureau-green text-parchment-drab border-regulatory-gold font-bold shadow-sm'
                        : 'bg-forester-dark text-lichen-stone border-bureau-green hover:border-parchment-muted'
                    }`}
                  >
                    {vowelFilter(type)}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 5: Irrigation Emoji Scale */}
        {step === 5 && (
          <div className="space-y-4 font-mono">
            <h2 className="text-base font-serif font-bold text-parchment-drab">
              {vowelFilter('Annex 5: Hydrological Allocation Protocol')}
            </h2>
            <p className="text-xs text-lichen-stone leading-relaxed">
              {vowelFilter('Numerical irrigation measurements are prohibited by administrative guidelines. Calibrate strictly via approved glyphs.')}
            </p>

            <div className="p-5 bg-forester-dark border border-bureau-green text-center space-y-3">
              <div className="text-4xl">{EMOJI_IRRIGATION_STOPS[irrigationIndex]}</div>
              <input
                type="range"
                min="0"
                max={EMOJI_IRRIGATION_STOPS.length - 1}
                value={irrigationIndex}
                onChange={(e) => setIrrigationIndex(Number(e.target.value))}
                className="w-full h-2 bg-peat-dark rounded appearance-none cursor-pointer accent-regulatory-gold"
              />
              <div className="flex justify-between text-lg px-2">
                {EMOJI_IRRIGATION_STOPS.map((emoji, i) => (
                  <span key={i} className={i === irrigationIndex ? 'opacity-100 font-bold' : 'opacity-40'}>
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
            <h2 className="text-base font-serif font-bold text-parchment-drab">
              {vowelFilter('Annex 6: Statutory Philosophy & Subsurface Environmental Disclaimers')}
            </h2>
            <p className="text-xs text-lichen-stone leading-relaxed">
              {vowelFilter('Mandatory statutory consent. The required validation covenant is located within nested regulatory schedules.')}
            </p>

            <div className="border border-bureau-green bg-forester-dark">
              <button
                type="button"
                onClick={() => setAccordionOpen((o) => !o)}
                className="w-full p-3 text-left font-serif font-bold text-xs flex justify-between items-center text-parchment-drab"
              >
                <span>{vowelFilter('Schedule A: Heraclitean Principle of Humus Decay')}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${accordionOpen ? 'rotate-180' : ''}`} />
              </button>

              {accordionOpen && (
                <div className="p-3 border-t border-bureau-green text-xs text-lichen-stone space-y-3 font-serif">
                  <p>
                    "No steward plows the identical furrow twice, for the topsoil is dynamic and the nutrient reserves undergo continuous decay."
                  </p>

                  <div className="border border-bureau-green bg-peat-dark p-3">
                    <button
                      type="button"
                      onClick={() => setSubAccordionOpen((o) => !o)}
                      className="w-full text-left font-bold text-xs text-regulatory-gold flex justify-between items-center"
                    >
                      <span>{vowelFilter('Schedule A-1: Subsection IX (Nematode Bystander Accord)')}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${subAccordionOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {subAccordionOpen && (
                      <div className="mt-3 pt-2 border-t border-bureau-green space-y-2.5">
                        <p className="text-[11px] text-parchment-muted font-mono">
                          By validating the clause below, the applicant certifies awareness that subterranean nematode and microbial organisms possess equal statutory parity under environmental oversight.
                        </p>

                        <label className="flex items-center space-x-2 text-xs text-parchment-drab cursor-pointer p-2 bg-forester-dark border border-bureau-green font-mono">
                          <input
                            type="checkbox"
                            checked={philosophyConsented}
                            onChange={(e) => setPhilosophyConsented(e.target.checked)}
                            className="w-3.5 h-3.5 accent-bureau-green"
                          />
                          <span>
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

        {/* Step 7: Confirmation & Swapping Buttons */}
        {step === 7 && (
          <div className="space-y-4 font-mono">
            <h2 className="text-base font-serif font-bold text-parchment-drab">
              {vowelFilter('Annex 7: Final Agronomic Dossier Verification')}
            </h2>
            <p className="text-xs text-lichen-stone leading-relaxed">
              {vowelFilter('Review parameters before statutory transmittal to the Gemini 2.5 Flash Advisory Engine.')}
            </p>

            <div className="p-3.5 bg-forester-dark border border-bureau-green space-y-2 text-xs">
              <div className="flex justify-between border-b border-bureau-green pb-1">
                <span className="text-lichen-stone">Declared Crop:</span>
                <span className="text-parchment-drab font-bold">{cropName}</span>
              </div>
              <div className="flex justify-between border-b border-bureau-green pb-1">
                <span className="text-lichen-stone">Soil pH:</span>
                <span className="text-regulatory-gold font-bold">{soilPh}</span>
              </div>
              <div className="flex justify-between border-b border-bureau-green pb-1">
                <span className="text-lichen-stone">NPK Metrics:</span>
                <span className="text-parchment-drab">{nitrogen} - {phosphorus} - {potassium}</span>
              </div>
              <div className="flex justify-between border-b border-bureau-green pb-1">
                <span className="text-lichen-stone">Soil Texture:</span>
                <span className="text-parchment-drab">{soilType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-lichen-stone">Irrigation Glyph:</span>
                <span className="text-base">{EMOJI_IRRIGATION_STOPS[irrigationIndex]}</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons: Swapping on hover */}
        <div className="mt-6 pt-4 border-t border-bureau-green flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-mono text-lichen-stone hover:text-warning-rust flex items-center gap-1 underline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{vowelFilter('Reset Form (Triggers Latin Errors)')}</span>
          </button>

          <div
            onMouseEnter={handleNavButtonHover}
            className={`flex items-center gap-2.5 ${swapButtons ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="bg-forester-dark hover:bg-peat-dark text-lichen-stone font-mono text-xs px-3.5 py-2 border border-bureau-green flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>{vowelFilter('Previous Annex')}</span>
              </button>
            )}

            {step < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="bg-bureau-green hover:bg-officer-moss text-parchment-drab font-mono font-bold text-xs md:text-sm px-5 py-2 border border-regulatory-gold flex items-center gap-1"
              >
                <span>{vowelFilter('Next Annex')}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={submitForm}
                disabled={isSubmitting}
                className="bg-bureau-green hover:bg-officer-moss text-parchment-drab font-mono font-bold text-xs md:text-sm px-6 py-2.5 border border-regulatory-gold shadow-sm"
              >
                {isSubmitting ? 'Consulting Gemini 2.5 Flash...' : vowelFilter('Certify & Transmit to Gemini AI')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
