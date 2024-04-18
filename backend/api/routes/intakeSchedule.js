// import { DataTypes } from 'sequelize';
// import sequelize from '../../config/database.js';

// const intakeSchedule = sequelize.define('intake_schedules', {
//     user_id: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         field: 'user_id'  // maps userId to user_id in the database
//     },
//     device_id: {
//         type: DataTypes.INTEGER,
//         allowNull: true,
//         field: 'device_id'  // maps userId to user_id in the database
//     },
//     scheduled_time: {
//         type: DataTypes.DATE,
//         allowNull: false,
//         field: 'scheduled_time'  // maps scheduledTime to scheduled_time in the database
//     },
//     is_scheduled: {
//         type: DataTypes.BOOLEAN,
//         defaultValue: true,
//         field: 'is_scheduled'  // maps isScheduled to is_scheduled in the database
//     },
//     is_intaked: {
//         type: DataTypes.BOOLEAN,
//         defaultValue: false,
//         field: 'is_intaked'  // maps isIntaked to is_intaked in the database
//     },
// }, {
//     tableName: 'intake_schedules'
// });

// export default intakeSchedule;


import express from 'express';
import { fetchIntakeSchedules } from '../controllers/intakeScheduleController.js';

const router = express.Router();

router.get('/', fetchIntakeSchedules);

export default router;
