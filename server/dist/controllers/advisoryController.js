"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHistory = exports.generateAdvisory = void 0;
const advisorySchema_1 = require("../schemas/advisorySchema");
const geminiService_1 = require("../services/geminiService");
const supabase_1 = require("../config/supabase");
const generateAdvisory = async (req, res) => {
    try {
        // 1. Zod Validation with hostile error formatting
        const validationResult = advisorySchema_1.advisorySchema.safeParse(req.body);
        if (!validationResult.success) {
            const issues = validationResult.error.issues.map((i) => ({
                parameter: i.path.join('.'),
                heresy: i.message,
                latinTranslation: "Errare humanum est, sed perseverare in agronomic stultitia diabolicum.",
            }));
            res.status(400).json({
                error: "AGRONOMIC_HERESY_DETECTED",
                reasons: issues,
                advice: "Abandon farming and take up contemplative stone collecting instead.",
            });
            return;
        }
        const { cropName, soilPh, npk } = validationResult.data;
        const userId = req.user?.id || '00000000-0000-0000-0000-000000000001';
        // 2. Execute Gemini AI service
        const aiResponse = await geminiService_1.geminiService.generateCropAdvisory(cropName, soilPh, npk);
        // 3. Persist to Database (Supabase PostgreSQL with RLS or Local DB fallback)
        let advisoryId = '';
        const rawAiJson = JSON.stringify(aiResponse);
        if (supabase_1.isSupabaseConfigured && supabase_1.supabase) {
            const { data, error } = await supabase_1.supabase
                .from('advisories')
                .insert({
                user_id: userId,
                crop_name: cropName,
                soil_ph: soilPh,
                npk_status: npk,
                ai_raw_response: rawAiJson,
                frustration_index: Math.floor(Math.random() * 50) + 50,
            })
                .select()
                .single();
            if (error) {
                console.warn('[Advisories] Supabase insert failed, falling back to local store:', error.message);
                const localRecord = await supabase_1.localDb.createAdvisory({
                    user_id: userId,
                    crop_name: cropName,
                    soil_ph: soilPh,
                    npk_status: npk,
                    ai_raw_response: rawAiJson,
                    frustration_index: 77,
                });
                advisoryId = localRecord.id;
            }
            else {
                advisoryId = data.id;
            }
        }
        else {
            const localRecord = await supabase_1.localDb.createAdvisory({
                user_id: userId,
                crop_name: cropName,
                soil_ph: soilPh,
                npk_status: npk,
                ai_raw_response: rawAiJson,
                frustration_index: Math.floor(Math.random() * 40) + 60,
            });
            advisoryId = localRecord.id;
        }
        // 4. Return structured JSON packaged in confusing sarcastic metadata wrappers
        res.status(200).json({
            status: "CATASTROPHE_AVERTED_TEMPORARILY",
            consultantDisgustLevel: Math.floor(Math.random() * 20) + 80,
            existentialDreadIndex: "CRITICAL",
            metadataWrapper: {
                epochEntropy: Date.now(),
                soilNihilismVector: [Math.random().toFixed(4), Math.random().toFixed(4)],
                warning: "Reading this advice may cause spontaneous leaf shedding.",
            },
            advisoryId,
            data: aiResponse,
        });
    }
    catch (err) {
        console.error('[GenerateAdvisory] Unexpected server error:', err);
        res.status(500).json({
            error: "TOTAL_BIOSPHERE_COLLAPSE",
            message: err.message || "The server could not stomach your crop metrics.",
        });
    }
};
exports.generateAdvisory = generateAdvisory;
const getHistory = async (req, res) => {
    try {
        const userId = req.user?.id || '00000000-0000-0000-0000-000000000001';
        let advisories = [];
        if (supabase_1.isSupabaseConfigured && supabase_1.supabase) {
            const { data, error } = await supabase_1.supabase
                .from('advisories')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });
            if (error) {
                console.warn('[History] Supabase fetch failed, using local store:', error.message);
                advisories = await supabase_1.localDb.getAdvisoriesByUser(userId);
            }
            else {
                advisories = data || [];
            }
        }
        else {
            advisories = await supabase_1.localDb.getAdvisoriesByUser(userId);
        }
        // Parse ai_raw_response safely if stringified
        const parsedAdvisories = advisories.map((item) => {
            let parsedAi = null;
            try {
                parsedAi = typeof item.ai_raw_response === 'string' ? JSON.parse(item.ai_raw_response) : item.ai_raw_response;
            }
            catch {
                parsedAi = { primaryDiagnosis: item.ai_raw_response };
            }
            return {
                ...item,
                ai_parsed: parsedAi,
            };
        });
        // Provide randomized sorting headers as specified in Section 12
        const fakeHeaders = [
            "X-Chaos-Entropy-Hash: " + Math.random().toString(36).substring(7),
            "X-Farmer-Sigh-Frequency: 14.8 Hz",
            "X-Soil-Resentment-Status: ACTIVE",
            "X-Harvest-Probability: 3.14159%",
        ];
        res.setHeader('X-Hostile-Header', fakeHeaders[Math.floor(Math.random() * fakeHeaders.length)]);
        res.setHeader('X-Randomized-Sort', Math.random() > 0.5 ? 'descending-by-misery' : 'ascending-by-regret');
        res.status(200).json({
            status: "RECORDS_OF_PAST_FAILURES_RETRIEVED",
            totalFailuresRecorded: parsedAdvisories.length,
            history: parsedAdvisories,
        });
    }
    catch (err) {
        res.status(500).json({
            error: "ARCHIVES_CORRUPTED_BY_WEEDS",
            message: err.message,
        });
    }
};
exports.getHistory = getHistory;
