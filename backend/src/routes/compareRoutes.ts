import { Router } from 'express';
import { compareController } from '../controllers/compareController';

const compareRouter = Router();

compareRouter.post('/compare', compareController);

export default compareRouter;