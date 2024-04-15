import { getIntakeScheduleForUser } from '../services/intakeScheduleService.js';

export const fetchIntakeSchedules = async (req, res) => {
    const userId = 1; // ** Preset using Admin user for demo
    const userName = 'admin';

    try {
        const schedules = await getIntakeScheduleForUser(userId);
        res.json({
            user: { id: userId, username: userName },
            intakeSchedules: schedules
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};