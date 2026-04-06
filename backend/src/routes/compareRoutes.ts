import { Router } from 'express';
import multer from 'multer';
import { compareController } from '../controllers/compareController';

const compareRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/markdown',
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}`));
    }
  },
});

compareRouter.post(
  '/compare',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'document', maxCount: 1 },
  ]),
  compareController
);

export default compareRouter;