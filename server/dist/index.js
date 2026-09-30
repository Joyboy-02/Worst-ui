"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const api_1 = __importDefault(require("./routes/api"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
// CORS configuration
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow localhost and any local Vite dev server port
        if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
            return callback(null, true);
        }
        callback(null, true);
    },
    credentials: true,
}));
app.use(express_1.default.json());
// Sarcastic server banner header on all responses
app.use((req, res, next) => {
    res.setHeader('X-Powered-By', 'Existential-Dread-v2.5');
    res.setHeader('X-Farmer-Patience-Level', '0.001%');
    next();
});
// Mount API routes
app.use('/api', api_1.default);
// Sarcastic 404 Catch-All
app.use((req, res) => {
    res.status(404).json({
        error: 'VOID_REACHED',
        message: `You wandered into an unplanted fallow field at ${req.originalUrl}. Nothing grows here.`,
        suggestion: 'Turn back before the crows discover your presence.',
    });
});
// Global error handler
app.use((err, req, res, next) => {
    console.error('[Fatal Server Error]:', err);
    res.status(500).json({
        error: 'CATASTROPHIC_SYSTEM_WILTING',
        details: err?.message || 'The server succumbed to chronic nutrient deficiency.',
    });
});
app.listen(PORT, () => {
    console.log(`[AgroWorstUI Server] Listening on port ${PORT}`);
    console.log(`[AgroWorstUI Server] AI Model: gemini-2.5-flash via @google/genai SDK`);
    console.log(`[AgroWorstUI Server] Client Target: ${CLIENT_ORIGIN}`);
});
