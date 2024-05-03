import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { scheduler } from "timers/promises";

const prisma = new PrismaClient();

// getIntakelogData: Fetches all relevant data for intakeLog
export const getIntakelogData = async (req: Request, res: Response): Promise<void> => {
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
                        date: true, // scheduleTimes
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
            date: log.date,
            intakeTime: log.intakeTime,
            isIntaked: log.isIntaked,
        })));

        if (flatIntakeLogs.length > 0) {
            res.status(200).json({ data: flatIntakeLogs });
        } else {
            res.status(404).json({ message: "Intakelog data not found" });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Error fetching intake log data" });
    }
};

// scheduleDailyIntakeLogs: Function to schedule daily intake logs for all pillcases
export const scheduleDailyIntakeLogs = async (user_id) => {
    console.log(' --- inside scheduleDailyIntakeLogs ---- ')
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

        const logsToCreate = pillcases.flatMap(pillcase =>
            pillcase.scheduleTimes.map(scheduleTime => ({
                pillcaseId: pillcase.id,
                userId: userId,
                intakeTime: null, // set into null
                isIntaked: false,
                date: scheduleTime // Converts the scheduleTime to a Date object
            }))
        );

        // Create all logs using a single batch operation
        const createdLogs = await prisma.intakeLog.createMany({
            data: logsToCreate,
            skipDuplicates: true // Optional: skips records that would cause a duplicate error
        });

        console.log(`${createdLogs.count} intake logs created.`);
    } catch (error) {
        console.error('Error creating intake logs:', error);
    }
};