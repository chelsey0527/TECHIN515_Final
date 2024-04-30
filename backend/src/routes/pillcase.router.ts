import { Router } from 'express';
import { getAllPillcase, getPillcaseById, createPillcase, updatePillcase } from '../controllers/pillcase.controller';

const pillcaseRouter = Router();

pillcaseRouter.get('/', getAllPillcase);
pillcaseRouter.get('/:pillcaseId', getPillcaseById);
pillcaseRouter.post('/', createPillcase);
pillcaseRouter.put('/:pillcaseId', updatePillcase);

export default pillcaseRouter;