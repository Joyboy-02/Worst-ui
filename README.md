# 🌾 AgroHostile 2.5: AI-Powered Agriculture Crop Advisory Assistant
### *"Worst UI" Edition / Anti-Pattern & Cognitive Friction Case Study*

> **Educational & Psychological Case Study**: A production-grade, end-to-end full-stack web application built to the highest technical and architectural standards (strict TypeScript, Zod schema validation, official Google GenAI SDK integration with `gemini-2.5-flash`, PostgreSQL schema with Row-Level Security), while intentionally executing a masterclass in horrendous, adversarial, and psychologically exhausting user experience (UI/UX dark patterns).

---

## 🚀 Key Architectural & Functional Capabilities

### 1. Robust Server-Side Architecture
- **Runtime & Framework:** Node.js, Express.js, TypeScript.
- **AI Core:** Official Google GenAI SDK (`@google/genai`) invoking model `gemini-2.5-flash` with structured JSON schema (`responseSchema`) enforcing `{ cropHealthScore, primaryDiagnosis, actionableRecommendations, riskFactor }`.
- **Existential Dread Sarcasm Persona:** Chief Agronomy Consultant wrapped in existential dread, providing scientifically accurate agronomic triage wrapped in condescending commentary about planetary decline.
- **Relational Persistence:** Supabase PostgreSQL with full Row-Level Security (RLS) policies for `profiles`, `advisories`, and `rage_clicks`. Includes zero-config in-memory local state fallback for instant offline execution.
- **Validation Pipeline:** Strict Zod parsing on backend bodies with hostile Latin translation responses for invalid parameters.
- **Hostile Rate Limiting:** Triggers an existential CAPTCHA riddle challenge after every 2 requests.

### 2. Hostile UI / UX Anti-Patterns Implemented
- **The "Shifting Sands" Dashboard:** Widgets randomly swap grid coordinates every 12 seconds or when erratic mouse movement exceeds velocity thresholds.
- **4-Layer Modal Cookie Consent Wall:** Covers 98% of the viewport on initial arrival with runaway "Reject All" buttons, nitrogen slider calibration requirements, and an obscure 80px window resize bypass.
- **Rot-13 & Mutating Authentication:** Password input randomly switches type between `text`, `password`, and ROT-13 cipher on every keystroke, with inverted tab orders (`[Tab Index: 3]` on username, `[Tab Index: 1]` on password).
- **The Labyrinthic 7-Step Advisory Form:**
  - Crop dropdown sorted alphabetically in Kiswahili/Zulu (e.g. *Mahindi*, *Mpunga*, *Ngano*).
  - Negative soil pH sliders allowed up to active volcano levels.
  - Number inputs that jitter/increment when clicked.
  - Radio buttons that shrink and run away on hover.
  - Emoji-only irrigation slider (🌵 to 🌊).
  - Hidden required consent checkbox buried deep inside nested accordions ("Ancient Philosophy & Legal Disclaimers").
  - Dynamically swapping "Next" and "Back" buttons.
- **The Cursed Terminal & Minesweeper Advisory Decryption:**
  - Structured Gemini AI diagnosis and recommendations hidden behind a 25-tile Minesweeper grid.
  - Clicking tiles reveals pieces of the agronomic report; clicking a Locust Swarm Mine shakes the screen, plays 8-bit explosion audio, and re-masks previously unlocked advice!
  - Green-on-black CRT terminal emulator with scanlines and phosphor glow.
- **Export & Share Nightmare:**
  - Generates inverted PDFs upside down (`transform: rotate(180deg)`) or mirrored horizontally (`transform: scaleX(-1)`).
- **Sensory Overload Weather Strobe Feed:** Flashes strobe animations; clicking the "Mute Alert" button triggers a 15-second browser lock freeze with progress spinner.
- **Expert Mode (Vowel Stripping):** Toggling "Expert Mode" strips all vowels (`[aeiouAEIOU]`) from the entire application interface.
- **Pure Web Audio API Synthesizer:** Real-time generation of 1998 56k dial-up modem handshakes, explosion booms, and click beeps with zero external audio assets.
- **Real-time Rage Click Telemetry:** Window listener detects rapid clicking and transmits logs to `POST /api/telemetry/rage-click` with live toast alerts ("RAGE DETECTED: Empathy Level 0.00%").

---

## 🗄️ Database Schema & RLS (PostgreSQL)

Run the SQL in `schema.sql` inside your Supabase SQL Editor:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles linked to auth.users
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    chaos_tolerance_score INTEGER DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Advisories table
CREATE TABLE public.advisories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    crop_name TEXT NOT NULL,
    soil_ph DECIMAL(3,1) NOT NULL,
    npk_status JSONB NOT NULL,
    ai_raw_response TEXT,
    frustration_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- UI Rage Clicks Audit Log
CREATE TABLE public.rage_clicks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    element_id TEXT NOT NULL,
    clicked_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rage_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view their own advisories." ON public.advisories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own advisories." ON public.advisories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can log their own rage clicks." ON public.rage_clicks FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Public can view rage clicks." ON public.rage_clicks FOR SELECT USING (true);
```

---

## ⚙️ Environment Variables

Create `.env` at root (or modify existing):

```env
# Supabase Configuration (Leave blank for zero-config local emulation)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Google GenAI Configuration
# Server uses official @google/genai SDK with model gemini-2.5-flash
# If left blank, server uses built-in high-precision existential agronomy engine
GEMINI_API_KEY=your-gemini-api-key

# Server Settings
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
```

---

## 🏃 Running Locally

To launch both the Node/Express TypeScript server (Port 5000) and the React/Vite client (Port 5173):

```bash
npm run dev
```

Or run individually:
```bash
npm run dev:server
npm run dev:client
```

Open **`http://localhost:5173`** in your browser.
