import express from 'express';
import bodyParser from 'body-parser';
import pool from './config/database.js';
import intakeScheduleRouter from './api/routes/intakeSchedule.js';

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/intake-schedules', intakeScheduleRouter);

// Connect to the database and start the server
const startApp = async () => {
    try {
        await pool.connect();  // Test database connection
        console.log('Connection to the database has been established successfully.');

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

startApp();