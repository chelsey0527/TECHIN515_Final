import express from 'express';
import { fetchIntakeSchedules } from '../controllers/intakeScheduleController.js';

const router = express.Router();

router.get('/', fetchIntakeSchedules);

export default router;