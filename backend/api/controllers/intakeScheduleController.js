// import { getIntakeScheduleForUser } from '../services/intakeScheduleService.js';

// export const fetchIntakeSchedules = async (req, res) => {
//     try {
//         const userId = 1;  // Example: Get from request or use a default
//         const schedules = await getIntakeScheduleForUser(user_id);
//         res.json({ userId, schedules });
//         console.log(res);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Internal Server Error');
//     }
// };

import { getIntakeScheduleForUser } from '../services/intakeScheduleService.js';

export const fetchIntakeSchedules = async (req, res) => {
    try {
        const user_id = 1;  // Example: Get from request or use a default
        const schedules = await getIntakeScheduleForUser(user_id);
        res.json({ user_id, schedules });
        console.log(res)
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};
