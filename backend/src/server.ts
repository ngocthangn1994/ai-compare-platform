import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import { env } from './config/env';
import compareRouter from './routes/compareRoutes';
import historyRouter from './routes/historyRoutes';
import transcribeRouter from './routes/transcribeRoutes';

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'AI Comparison Backend is running'
  });
});

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'ai-comparison-backend'
  });
});

app.use('/api', compareRouter);
app.use('/api', historyRouter);
app.use('/api', transcribeRouter);

app.use(
  (
    error: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    res.status(500).json({
      message: error.message || 'Internal server error'
    });
  }
);

async function bootstrap(): Promise<void> {
  if (!env.mongoUri) {
    throw new Error('MONGO_URI is required in environment variables.');
  }

  await mongoose.connect(env.mongoUri);

  app.listen(env.port, () => {
    console.log(`Backend running on http://localhost:${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start backend:', error);
  process.exit(1);
});