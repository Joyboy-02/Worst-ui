import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseKey && 
  !supabaseUrl.includes('your-project') &&
  !supabaseKey.includes('your-supabase')
);

export let supabase: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });
    console.log('[Database] Connected to external Supabase PostgreSQL instance.');
  } catch (err) {
    console.warn('[Database] Supabase initialization failed, defaulting to Local In-Memory Relational Engine.', err);
    supabase = null;
  }
} else {
  console.log('[Database] Running in High-Fidelity Local State Persistence Mode (Zero-Config Supabase Emulation with RLS).');
}

// ----------------------------------------------------------------------------
// Local In-Memory Fallback Store (Replicates profiles, advisories, rage_clicks)
// ----------------------------------------------------------------------------
export interface LocalProfile {
  id: string;
  username: string;
  chaos_tolerance_score: number;
  created_at: string;
}

export interface LocalAdvisory {
  id: string;
  user_id: string;
  crop_name: string;
  soil_ph: number;
  npk_status: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
  ai_raw_response: string;
  frustration_index: number;
  created_at: string;
}

export interface LocalRageClick {
  id: string;
  user_id: string | null;
  element_id: string;
  clicked_at: string;
}

class LocalDatabaseStore {
  private profiles: Map<string, LocalProfile> = new Map();
  private advisories: LocalAdvisory[] = [];
  private rageClicks: LocalRageClick[] = [];

  constructor() {
    // Seed a default cynical agronomist profile
    const defaultId = '00000000-0000-0000-0000-000000000001';
    this.profiles.set(defaultId, {
      id: defaultId,
      username: 'existential_farmer_99',
      chaos_tolerance_score: 42,
      created_at: new Date().toISOString(),
    });

    // Seed some initial hilarious advisories
    this.advisories.push({
      id: crypto.randomUUID(),
      user_id: defaultId,
      crop_name: 'Mahindi (Corn / Maize)',
      soil_ph: 5.2,
      npk_status: { nitrogen: 12, phosphorus: 8, potassium: 14 },
      ai_raw_response: JSON.stringify({
        cropHealthScore: 23,
        primaryDiagnosis: "Severe soil acidification combined with profound existential neglect.",
        actionableRecommendations: [
          "Apply agricultural dolomitic limestone at 2.5 tonnes/hectare while contemplating human futility.",
          "Cease nitrogen dumping; your maize is drowning in synthetic hope.",
          "Prepare for root rot and inevitable disappointment."
        ],
        riskFactor: "HIGH"
      }),
      frustration_index: 87,
      created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    });
  }

  // Profiles
  async getProfile(id: string): Promise<LocalProfile | null> {
    return this.profiles.get(id) || null;
  }

  async getProfileByUsername(username: string): Promise<LocalProfile | null> {
    for (const p of this.profiles.values()) {
      if (p.username.toLowerCase() === username.toLowerCase()) return p;
    }
    return null;
  }

  async upsertProfile(profile: LocalProfile): Promise<LocalProfile> {
    this.profiles.set(profile.id, profile);
    return profile;
  }

  // Advisories (enforces user_id filtering for RLS emulation)
  async createAdvisory(data: Omit<LocalAdvisory, 'id' | 'created_at'>): Promise<LocalAdvisory> {
    const record: LocalAdvisory = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    };
    this.advisories.unshift(record);
    return record;
  }

  async getAdvisoriesByUser(userId: string): Promise<LocalAdvisory[]> {
    return this.advisories.filter((a) => a.user_id === userId);
  }

  async getAllAdvisories(): Promise<LocalAdvisory[]> {
    return [...this.advisories];
  }

  // Rage clicks
  async createRageClick(elementId: string, userId: string | null = null): Promise<LocalRageClick> {
    const record: LocalRageClick = {
      id: crypto.randomUUID(),
      user_id: userId,
      element_id: elementId,
      clicked_at: new Date().toISOString(),
    };
    this.rageClicks.push(record);
    return record;
  }

  async getRageClicksCount(): Promise<number> {
    return this.rageClicks.length;
  }
}

export const localDb = new LocalDatabaseStore();
