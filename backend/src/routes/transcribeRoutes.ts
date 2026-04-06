import { Router } from 'express';
import multer from 'multer';
import { transcribeController } from '../controllers/transcribeController';

const transcribeRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024,
  },
});

transcribeRouter.post('/transcribe', upload.single('audio'), transcribeController);

export default transcribeRouter;