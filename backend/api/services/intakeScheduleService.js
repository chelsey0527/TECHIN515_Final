// import intakeSchedule from '../routes/intakeSchedule.js';
// import { Op } from 'sequelize';

// export const getIntakeScheduleForUser = async (user_id) => {

//     try {
//         const schedules = await intakeSchedule.findAll({
//             where: {
//                 user_id: 1,
//             },
//         });
//         return schedules; // Returns an array of instances
//     } catch (error) {
//         throw error;
//     }
// };


import pool from '../../config/database.js';

export const getIntakeScheduleForUser = async (user_id) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1)

    const query = `
        SELECT * FROM intake_schedules
        WHERE user_id = $1 AND scheduled_time >= $2 AND scheduled_time < $3;
    `

    const values = [user_id, today, tomorrow];

    try {
        const res = await pool.query(query, values);
        return res.rows;
    } catch (error) {
        throw error;
    }
}