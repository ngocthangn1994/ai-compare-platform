import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import { env } from './config/env';
import compareRouter from './routes/compareRoutes';
import historyRouter from './routes/historyRoutes';

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'AI Comparison Backend is running'
  });
});

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'ai-comparison-backend' });
});

app.use('/api', compareRouter);
app.use('/api', historyRouter);

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