import { Router } from 'express';
import { getHomeData } from '../controllers/home.controller';

const homeRouter = Router();

homeRouter.get('/:id', getHomeData);

export default homeRouter;