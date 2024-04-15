import pool from '../../config/database.js';

export const getIntakeScheduleForUser = async (userId) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to 00:00:00 for the start of the day

    const query = `
    SELECT * 
    FROM intake_schedules 
    WHERE user_id = $1 
    AND scheduled_time::date = $2::date;
  `;
    const values = [userId, today];

    try {
        const result = await pool.query(query, values);
        return result.rows;
    } catch (error) {
        throw error;
    }
};