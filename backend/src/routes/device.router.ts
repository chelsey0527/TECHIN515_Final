import { Router } from 'express';
import { sendSignalToPillbox } from '../controllers/device.controller';

const deviceRouter = Router();

deviceRouter.get('/find-my-pillbox', sendSignalToPillbox);

export default deviceRouter;