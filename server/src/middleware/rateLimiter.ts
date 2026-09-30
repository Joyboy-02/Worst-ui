import { Request, Response, NextFunction } from 'express';

interface RateRecord {
  count: number;
  lastReset: number;
  captchaCompleted: boolean;
}

const clientRates = new Map<string, RateRecord>();

export const RIDDLES = [
  {
    id: 'riddle-1',
    question: "If a cornstalk falls in an empty monoculture field, does its carbon footprint make a sound?",
    acceptableAnswers: ["yes", "no", "despair", "photosynthesis", "entropy", "carbon", "42"],
    hint: "Answer with 'entropy' or 'despair' if you possess agricultural enlightenment.",
  },
  {
    id: 'riddle-2',
    question: "What is the square root of a nematode's will to live?",
    acceptableAnswers: ["zero", "0", "-1", "i", "imaginary", "none"],
    hint: "Enter 'zero' or '0' to align with biological reality.",
  },
  {
    id: 'riddle-3',
    question: "Which Roman deity of rust and mildew did ancient farmers sacrifice red dogs to?",
    acceptableAnswers: ["robigo", "robigus", "rust", "dog", "fungus"],
    hint: "Enter 'Robigo' or 'Robigus'.",
  },
];

export const hostileRateLimiter = (req: Request, res: Response, next: NextFunction): void => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
  const now = Date.now();

  const record = clientRates.get(clientIp) || { count: 0, lastReset: now, captchaCompleted: false };

  // Reset every 60 seconds
  if (now - record.lastReset > 60000) {
    record.count = 0;
    record.lastReset = now;
    record.captchaCompleted = false;
  }

  // After 2 requests, if captcha not completed, trigger fake CAPTCHA challenge!
  if (record.count >= 2 && !record.captchaCompleted) {
    const randomRiddle = RIDDLES[Math.floor(Math.random() * RIDDLES.length)];
    res.status(429).json({
      error: 'RATE_LIMIT_CHAOS_ENGAGED',
      message: 'Humanity has exceeded its biophysical API budget (2 requests). Solve this existential riddle to proceed.',
      captchaRequired: true,
      challenge: {
        challengeId: randomRiddle.id,
        question: randomRiddle.question,
        hint: randomRiddle.hint,
      },
    });
    return;
  }

  record.count += 1;
  clientRates.set(clientIp, record);
  next();
};

export const solveCaptchaChallenge = (clientIp: string, challengeId: string, solution: string): boolean => {
  const riddle = RIDDLES.find((r) => r.id === challengeId);
  if (!riddle) return false;

  const normalized = solution.trim().toLowerCase();
  const isCorrect = riddle.acceptableAnswers.some((ans) => normalized.includes(ans.toLowerCase()));

  if (isCorrect) {
    const record = clientRates.get(clientIp) || { count: 0, lastReset: Date.now(), captchaCompleted: false };
    record.captchaCompleted = true;
    record.count = 0; // reset
    clientRates.set(clientIp, record);
    return true;
  }

  return false;
};
