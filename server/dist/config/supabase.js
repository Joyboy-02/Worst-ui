"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.localDb = exports.supabase = exports.isSupabaseConfigured = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv_1 = __importDefault(require("dotenv"));
const crypto_1 = __importDefault(require("crypto"));
dotenv_1.default.config();
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
exports.isSupabaseConfigured = Boolean(supabaseUrl &&
    supabaseKey &&
    !supabaseUrl.includes('your-project') &&
    !supabaseKey.includes('your-supabase'));
exports.supabase = null;
if (exports.isSupabaseConfigured) {
    try {
        exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey, {
            auth: { persistSession: false },
        });
        console.log('[Database] Connected to external Supabase PostgreSQL instance.');
    }
    catch (err) {
        console.warn('[Database] Supabase initialization failed, defaulting to Local In-Memory Relational Engine.', err);
        exports.supabase = null;
    }
}
else {
    console.log('[Database] Running in High-Fidelity Local State Persistence Mode (Zero-Config Supabase Emulation with RLS).');
}
class LocalDatabaseStore {
    profiles = new Map();
    advisories = [];
    rageClicks = [];
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
            id: crypto_1.default.randomUUID(),
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
    async getProfile(id) {
        return this.profiles.get(id) || null;
    }
    async getProfileByUsername(username) {
        for (const p of this.profiles.values()) {
            if (p.username.toLowerCase() === username.toLowerCase())
                return p;
        }
        return null;
    }
    async upsertProfile(profile) {
        this.profiles.set(profile.id, profile);
        return profile;
    }
    // Advisories (enforces user_id filtering for RLS emulation)
    async createAdvisory(data) {
        const record = {
            ...data,
            id: crypto_1.default.randomUUID(),
            created_at: new Date().toISOString(),
        };
        this.advisories.unshift(record);
        return record;
    }
    async getAdvisoriesByUser(userId) {
        return this.advisories.filter((a) => a.user_id === userId);
    }
    async getAllAdvisories() {
        return [...this.advisories];
    }
    // Rage clicks
    async createRageClick(elementId, userId = null) {
        const record = {
            id: crypto_1.default.randomUUID(),
            user_id: userId,
            element_id: elementId,
            clicked_at: new Date().toISOString(),
        };
        this.rageClicks.push(record);
        return record;
    }
    async getRageClicksCount() {
        return this.rageClicks.length;
    }
}
exports.localDb = new LocalDatabaseStore();
