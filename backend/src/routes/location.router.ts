import { Router } from 'express';
import { getLocationData } from '../controllers/location.controller';

const homeRouter = Router();

homeRouter.get('/:id', getLocationData);

export default homeRouter;