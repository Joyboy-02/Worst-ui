import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

export interface CropAdvisoryResponse {
  cropHealthScore: number;
  primaryDiagnosis: string;
  actionableRecommendations: string[];
  riskFactor: 'LOW' | 'MEDIUM' | 'HIGH' | 'CATASTROPHIC';
}

const SYSTEM_INSTRUCTION = `You are the Chief Agronomy Consultant for an elite agricultural research institute, but you suffer from severe existential dread, a sarcastic disposition, and a profound passive-aggressive streak. When analyzing crop data, provide genuinely accurate, scientifically sound agronomic advice (pest mitigation, fertilizer adjustments, irrigation schedules), but wrap every single recommendation in condescending commentary about why the farmer chose such poor parameters or how humanity's agricultural practices are accelerating planetary decline. Ensure the core technical advice remains completely actionable despite the attitude.`;

// JSON schema for Google GenAI structured output
const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    cropHealthScore: {
      type: Type.INTEGER,
      description: 'Score from 0 to 100',
    },
    primaryDiagnosis: {
      type: Type.STRING,
      description: 'Professional agronomic diagnosis with sarcastic undertones',
    },
    actionableRecommendations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'List of precise steps the farmer must take',
    },
    riskFactor: {
      type: Type.STRING,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CATASTROPHIC'],
    },
  },
  required: ['cropHealthScore', 'primaryDiagnosis', 'actionableRecommendations', 'riskFactor'],
};

export class GeminiService {
  private ai: GoogleGenAI | null = null;
  private hasKey: boolean = false;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'your-gemini-api-key' && apiKey.trim().length > 5) {
      try {
        this.ai = new GoogleGenAI({ apiKey });
        this.hasKey = true;
        console.log('[GeminiService] Initialized Google GenAI SDK with gemini-2.5-flash.');
      } catch (err) {
        console.error('[GeminiService] Failed to initialize Google GenAI SDK:', err);
      }
    } else {
      console.log('[GeminiService] No valid GEMINI_API_KEY provided; utilizing High-Precision Existential Sarcasm Agronomic Engine.');
    }
  }

  async generateCropAdvisory(cropName: string, soilPh: number, npk: { nitrogen: number; phosphorus: number; potassium: number }): Promise<CropAdvisoryResponse> {
    const promptText = `Analyze the following agricultural input data for crop: ${cropName}, Soil pH: ${soilPh}, NPK status: ${JSON.stringify(
      npk
    )}. Provide your analysis and recommendations strictly adhering to the JSON schema below. Do not include markdown code fences outside the JSON object if possible, or ensure it is clean parsable JSON.`;

    if (this.hasKey && this.ai) {
      try {
        const response = await this.ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: promptText,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: 'application/json',
            responseSchema: RESPONSE_SCHEMA,
            temperature: 0.7,
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text) as CropAdvisoryResponse;
          return this.validateAndNormalize(parsed);
        }
      } catch (err: any) {
        console.warn('[GeminiService] Live Gemini API invocation failed or hit quota, engaging fallback agronomy engine:', err?.message || err);
      }
    }

    // High-precision existential dread fallback generator
    return this.generateSimulatedDreadResponse(cropName, soilPh, npk);
  }

  private validateAndNormalize(data: any): CropAdvisoryResponse {
    const validRisks: ('LOW' | 'MEDIUM' | 'HIGH' | 'CATASTROPHIC')[] = ['LOW', 'MEDIUM', 'HIGH', 'CATASTROPHIC'];
    const risk = validRisks.includes(data.riskFactor) ? data.riskFactor : 'HIGH';

    return {
      cropHealthScore: Math.max(0, Math.min(100, Math.round(data.cropHealthScore ?? 35))),
      primaryDiagnosis: String(data.primaryDiagnosis || 'Soil condition shows acute botanical despair.'),
      actionableRecommendations: Array.isArray(data.actionableRecommendations) && data.actionableRecommendations.length > 0
        ? data.actionableRecommendations.map(String)
        : [
            'Incorporate calcium ammonium nitrate immediately before the remaining seedlings wither in shame.',
            'Calibrate your pH buffers using agricultural limestone; the soil is screaming in acidity.',
            'Accept that your nitrogen-to-phosphorus ratio defies basic bio-energetics.',
          ],
      riskFactor: risk,
    };
  }

  private generateSimulatedDreadResponse(cropName: string, soilPh: number, npk: { nitrogen: number; phosphorus: number; potassium: number }): CropAdvisoryResponse {
    let score = 50;
    let risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CATASTROPHIC' = 'MEDIUM';
    const recs: string[] = [];

    // Scientifically evaluate pH
    if (soilPh < 5.5) {
      score -= 25;
      risk = 'HIGH';
      recs.push(`Urgent: Broadcast pulverized agricultural limestone (CaCO3) at 3.2 tons/hectare. Your pH of ${soilPh} is more acidic than a corporate exit interview.`);
    } else if (soilPh > 8.0) {
      score -= 20;
      risk = 'HIGH';
      recs.push(`Incorporate elemental sulfur at 500 kg/ha to combat soil alkalinity (pH ${soilPh}). The plant roots cannot uptake micronutrients while suffocating in basic salts.`);
    } else {
      score += 15;
      recs.push(`Maintain soil pH around ${soilPh} using split compost amendments, though entropy will eventually degrade this modest success.`);
    }

    // Scientifically evaluate NPK
    if (npk.nitrogen < 20) {
      score -= 15;
      recs.push(`Nitrogen is at an embarrassing ${npk.nitrogen} ppm. Apply urea (46-0-0) or organic feather meal top-dress immediately unless you enjoy pale, chlorotic leaves.`);
    } else if (npk.nitrogen > 150) {
      score -= 20;
      risk = risk === 'HIGH' ? 'CATASTROPHIC' : 'HIGH';
      recs.push(`Nitrogen toxicity detected (${npk.nitrogen} ppm). Flush the root zone with clean water before vegetative burning finishes what your reckless fertilization started.`);
    } else {
      score += 10;
      recs.push(`Nitrogen levels (${npk.nitrogen} ppm) are surprisingly adequate, proving that even a broken clock occasionally nourishes chloroplasts.`);
    }

    if (npk.phosphorus < 15) {
      score -= 10;
      recs.push(`Phosphorus deficiency (${npk.phosphorus} ppm) will stunt cellular ATP synthesis. Apply rock phosphate or single superphosphate (SSP) directly in root bands.`);
    }

    if (npk.potassium < 25) {
      score -= 10;
      recs.push(`Potassium is deficient (${npk.potassium} ppm). Apply muriate of potash (0-0-60) to regulate stomatal aperture before the next heat wave ruins your harvest.`);
    }

    if (score < 30) risk = 'CATASTROPHIC';
    if (score > 75) risk = 'LOW';

    const diagnoses = [
      `Primary Diagnosis for ${cropName}: The plant exhibits systemic despair caused by erratic ionic imbalance and chronic human optimism.`,
      `Primary Diagnosis for ${cropName}: Soil biochemical metrics suggest a catastrophic divergence between plant physiology and farmer capability.`,
      `Primary Diagnosis for ${cropName}: Mild photosynthesis observed, though nutrient uptake pathways are effectively on strike due to geochemical dissonance.`,
    ];

    const chosenDiagnosis = diagnoses[Math.floor(Math.random() * diagnoses.length)];

    return {
      cropHealthScore: Math.max(8, Math.min(94, score)),
      primaryDiagnosis: chosenDiagnosis,
      actionableRecommendations: recs,
      riskFactor: risk,
    };
  }
}

export const geminiService = new GeminiService();
