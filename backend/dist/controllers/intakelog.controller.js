"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleDailyIntakeLogs = exports.getIntakelogData = void 0;
const client_1 = require("@prisma/client");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const prisma = new client_1.PrismaClient();
// getIntakelogData: Fetches all relevant data for intakeLog
const getIntakelogData = async (req, res) => {
    try {
        const userId = req.params.id;
        const pillcases = await prisma.pillcase.findMany({
            where: {
                userId: userId
            },
            select: {
                id: true,
                pillName: true,
                caseNo: true,
                doses: true,
                IntakeLog: {
                    select: {
                        intakeTime: true,
                        isIntaked: true,
                        scheduleTime: true, // scheduleTimes
                    }
                }
            }
        });
        // Flatten the data structure to have each IntakeLog entry separate along with its associated Pillcase data
        const flatIntakeLogs = pillcases.flatMap(pillcase => pillcase.IntakeLog.map(log => ({
            pillcaseId: pillcase.id,
            pillName: pillcase.pillName,
            caseNo: pillcase.caseNo,
            doses: pillcase.doses,
            date: log.scheduleTime,
            intakeTime: log.intakeTime,
            isIntaked: log.isIntaked,
        })));
        if (flatIntakeLogs.length > 0) {
            res.status(200).json({ data: flatIntakeLogs });
        }
        else {
            res.status(404).json({ message: "Intakelog data not found" });
        }
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Error fetching intake log data" });
    }
};
exports.getIntakelogData = getIntakelogData;
// scheduleDailyIntakeLogs: Function to schedule daily intake logs for all pillcases
const scheduleDailyIntakeLogs = async (user_id) => {
    console.log(' --- inside scheduleDailyIntakeLogs ---- ');
    const userId = user_id;
    try {
        const pillcases = await prisma.pillcase.findMany({
            where: {
                userId: userId,
            },
            select: {
                id: true,
                scheduleTimes: true,
            }
        });
        console.log('Pillcases found:', JSON.stringify(pillcases, null, 2)); // This will format the output nicely
        const date = (0, moment_timezone_1.default)().tz("America/Los_Angeles").format("YYYY-MM-DD");
        const logsToCreate = pillcases.flatMap(pillcase => pillcase.scheduleTimes.map(scheduleTime => ({
            pillcaseId: pillcase.id,
            userId: userId,
            intakeTime: null, // set into null
            isIntaked: false,
            scheduleDate: date,
            scheduleTime: scheduleTime // Converts the scheduleTime to string
        })));
        // Create all logs using a single batch operation
        const createdLogs = await prisma.intakeLog.createMany({
            data: logsToCreate,
            skipDuplicates: true // Optional: skips records that would cause a duplicate error
        });
        console.log(`${createdLogs.count} intake logs created.`);
    }
    catch (error) {
        console.error('Error creating intake logs:', error);
    }
};
exports.scheduleDailyIntakeLogs = scheduleDailyIntakeLogs;
//# sourceMappingURL=intakelog.controller.js.map