import express from 'express';
import bodyParser from 'body-parser';
import { config as configDotenv } from 'dotenv';
import intakeScheduleRouter from './api/routes/intakeSchedule.js';

// Initialize dotenv
configDotenv();
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/intake-schedules', intakeScheduleRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));