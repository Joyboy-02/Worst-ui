import { Router } from 'express';
import { generateAdvisory, getHistory } from '../controllers/advisoryController';
import { logRageClick } from '../controllers/telemetryController';
import { login, register, verifyCaptcha } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';
import { hostileRateLimiter } from '../middleware/rateLimiter';

const router = Router();

// Advisory Endpoints
router.post('/advisory/generate', authMiddleware, hostileRateLimiter, generateAdvisory);
router.get('/advisory/history', authMiddleware, getHistory);

// Telemetry
router.post('/telemetry/rage-click', authMiddleware, logRageClick);

// Hostile Auth & Captcha
router.post('/auth/login', login);
router.post('/auth/register', register);
router.post('/captcha/verify', verifyCaptcha);

// System status
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'DECAYING_NORMALLY',
    entropyRate: 'HIGH',
    geminiSdkActive: true,
    model: 'gemini-2.5-flash',
  });
});

export default router;
