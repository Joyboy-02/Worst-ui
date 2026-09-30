import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow localhost and any local Vite dev server port
      if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true);
      }
      callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());

// Sarcastic server banner header on all responses
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Powered-By', 'Existential-Dread-v2.5');
  res.setHeader('X-Farmer-Patience-Level', '0.001%');
  next();
});

// Mount API routes
app.use('/api', apiRoutes);

// Sarcastic 404 Catch-All
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'VOID_REACHED',
    message: `You wandered into an unplanted fallow field at ${req.originalUrl}. Nothing grows here.`,
    suggestion: 'Turn back before the crows discover your presence.',
  });
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
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
