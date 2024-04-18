import IntakeSchedule from '../models/intakeSchedule.js';

export const fetchIntakeSchedules = async (req, res) => {
    try {
        const schedules = await IntakeSchedule.findAll({
            where: {
                userId: 1, // admin user ID
                scheduledTime: {
                    [Sequelize.Op.eq]: new Date(), // filters for today’s schedules
                }
            }
        });
        res.json(schedules);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};
