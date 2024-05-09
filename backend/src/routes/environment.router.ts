import { Router } from 'express';
import { getEnvironmentData } from '../controllers/environment.controller';

const environmentRouter = Router();

environmentRouter.get('/:id', getEnvironmentData);

export default environmentRouter;