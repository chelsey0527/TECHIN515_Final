import { Router } from 'express';
import { getHomeData } from '../controllers/home.controller';

const homeRouter = Router();

homeRouter.get('/', getHomeData);

export default homeRouter;