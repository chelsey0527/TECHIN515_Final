import { Router } from 'express';
import { getIntakelogData, scheduleDailyIntakeLogs } from '../controllers/intakelog.controller';

const intakelogRouter = Router();

intakelogRouter.get('/:id', getIntakelogData);

export default intakelogRouter;
