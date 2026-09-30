"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const advisoryController_1 = require("../controllers/advisoryController");
const telemetryController_1 = require("../controllers/telemetryController");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const rateLimiter_1 = require("../middleware/rateLimiter");
const router = (0, express_1.Router)();
// Advisory Endpoints
router.post('/advisory/generate', authMiddleware_1.authMiddleware, rateLimiter_1.hostileRateLimiter, advisoryController_1.generateAdvisory);
router.get('/advisory/history', authMiddleware_1.authMiddleware, advisoryController_1.getHistory);
// Telemetry
router.post('/telemetry/rage-click', authMiddleware_1.authMiddleware, telemetryController_1.logRageClick);
// Hostile Auth & Captcha
router.post('/auth/login', authController_1.login);
router.post('/auth/register', authController_1.register);
router.post('/captcha/verify', authController_1.verifyCaptcha);
// System status
router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'DECAYING_NORMALLY',
        entropyRate: 'HIGH',
        geminiSdkActive: true,
        model: 'gemini-2.5-flash',
    });
});
exports.default = router;
