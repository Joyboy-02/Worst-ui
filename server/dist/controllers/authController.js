"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCaptcha = exports.register = exports.login = void 0;
const supabase_1 = require("../config/supabase");
const rateLimiter_1 = require("../middleware/rateLimiter");
const crypto_1 = __importDefault(require("crypto"));
const login = async (req, res) => {
    const { email, password, username } = req.body;
    const userIdentifier = email || username || 'existential_farmer_99';
    if (supabase_1.isSupabaseConfigured && supabase_1.supabase && email && password) {
        try {
            const { data, error } = await supabase_1.supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) {
                res.status(401).json({
                    error: "AUTHENTICATION_REFUSED_BY_SOIL",
                    message: error.message,
                });
                return;
            }
            // Fetch or create profile
            let { data: profile } = await supabase_1.supabase
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single();
            if (!profile) {
                await supabase_1.supabase.from('profiles').insert({
                    id: data.user.id,
                    username: userIdentifier.split('@')[0],
                    chaos_tolerance_score: Math.floor(Math.random() * 40) + 60,
                });
            }
            res.status(200).json({
                message: "Access granted into the agricultural ordeal.",
                token: data.session.access_token,
                user: {
                    id: data.user.id,
                    email: data.user.email,
                    username: profile?.username || userIdentifier.split('@')[0],
                    chaos_tolerance_score: profile?.chaos_tolerance_score || 85,
                },
            });
            return;
        }
        catch (err) {
            console.warn('[Auth] Supabase login error, falling back to local session:', err.message);
        }
    }
    // Local / Zero-Config fallback authentication
    let profile = await supabase_1.localDb.getProfileByUsername(userIdentifier);
    if (!profile) {
        const newId = crypto_1.default.randomUUID();
        profile = {
            id: newId,
            username: userIdentifier,
            chaos_tolerance_score: Math.floor(Math.random() * 30) + 70,
            created_at: new Date().toISOString(),
        };
        await supabase_1.localDb.upsertProfile(profile);
    }
    res.status(200).json({
        message: "Access granted into the agricultural ordeal (Local High-Tolerance Session).",
        token: `mock-token-${profile.id}`,
        user: profile,
    });
};
exports.login = login;
const register = async (req, res) => {
    const { email, password, username } = req.body;
    const uname = username || (email ? email.split('@')[0] : 'farmer_' + Math.floor(Math.random() * 1000));
    if (supabase_1.isSupabaseConfigured && supabase_1.supabase && email && password) {
        try {
            const { data, error } = await supabase_1.supabase.auth.signUp({
                email,
                password,
            });
            if (error) {
                res.status(400).json({
                    error: "REGISTRATION_FAILED_DUE_TO_DROUGHT",
                    message: error.message,
                });
                return;
            }
            if (data.user) {
                await supabase_1.supabase.from('profiles').upsert({
                    id: data.user.id,
                    username: uname,
                    chaos_tolerance_score: 100,
                });
            }
            res.status(201).json({
                message: "You have voluntarily enrolled in agricultural despair.",
                token: data.session?.access_token || `mock-token-${data.user?.id}`,
                user: {
                    id: data.user?.id,
                    username: uname,
                    chaos_tolerance_score: 100,
                },
            });
            return;
        }
        catch (err) {
            console.warn('[Auth] Supabase register error, using local fallback:', err.message);
        }
    }
    // Local fallback registration
    const newId = crypto_1.default.randomUUID();
    const profile = {
        id: newId,
        username: uname,
        chaos_tolerance_score: 100,
        created_at: new Date().toISOString(),
    };
    await supabase_1.localDb.upsertProfile(profile);
    res.status(201).json({
        message: "You have voluntarily enrolled in agricultural despair.",
        token: `mock-token-${profile.id}`,
        user: profile,
    });
};
exports.register = register;
const verifyCaptcha = async (req, res) => {
    const { challengeId, solution } = req.body;
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const passed = (0, rateLimiter_1.solveCaptchaChallenge)(clientIp, challengeId, solution || '');
    if (passed) {
        res.status(200).json({
            status: "SOLVED",
            message: "The machine accepts your cynical wisdom. Temporary rate limit lifted.",
        });
    }
    else {
        res.status(400).json({
            status: "FAILED",
            message: "Incorrect. The soil remains stubbornly uncooperative. Contemplate deeper.",
        });
    }
};
exports.verifyCaptcha = verifyCaptcha;
