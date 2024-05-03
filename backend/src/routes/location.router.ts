import { Router } from 'express';
import { getLocationData } from '../controllers/location.controller';

const locationRouter = Router();

locationRouter.get('/:id', getLocationData);

export default locationRouter;