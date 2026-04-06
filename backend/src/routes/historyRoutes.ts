import { Router } from 'express';
import { historyController } from '../controllers/historyController';

const historyRouter = Router();

historyRouter.get('/history', historyController);

export default historyRouter;