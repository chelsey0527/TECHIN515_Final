import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

const IntakeSchedule = sequelize.define('IntakeSchedule', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    scheduledTime: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    isScheduled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    isIntaked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: 'intake_schedules'
});

export default IntakeSchedule;
