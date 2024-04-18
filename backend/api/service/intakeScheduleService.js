import IntakeSchedule from '../models/IntakeSchedule.js';

export const getIntakeScheduleForUser = async (userId) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to 00:00:00 for the start of the day

    try {
        // Use Sequelize's findAll method to fetch schedules
        const schedules = await IntakeSchedule.findAll({
            where: {
                userId: userId,
                scheduledTime: {
                    // Use Sequelize operator to filter dates
                    $gte: today,
                    $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) // Less than tomorrow
                }
            }
        });
        return schedules; // This returns an array of instances
    } catch (error) {
        throw error;
    }
};
