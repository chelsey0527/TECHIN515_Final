import { Router } from 'express';
import { getAllPillcase, getPillcaseById, createPillcase, updatePillcaseById } from '../controllers/pillcase.controller';

const pillcaseRouter = Router();

pillcaseRouter.get('/', getAllPillcase);
pillcaseRouter.get('/:pillcaseId', getPillcaseById);
pillcaseRouter.post('/', createPillcase);
pillcaseRouter.put('/:pillcaseId', updatePillcaseById);

export default pillcaseRouter;