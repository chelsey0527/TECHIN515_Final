import { Router } from 'express';
import { getPillcaseById, updatePillcaseById } from '../controllers/pillcase.controller';

const pillcaseRouter = Router();

pillcaseRouter.get('/:pillcaseId', getPillcaseById);
pillcaseRouter.put('/:pillcaseId', updatePillcaseById);

export default pillcaseRouter;