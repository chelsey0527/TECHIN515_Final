import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import moment from "moment-timezone";

const prisma = new PrismaClient();

const calculateStatus = (
  isIntaked: boolean,
  scheduleDate: string,
  scheduleTime: string
): string => {
  const currentDateTime = new Date();
  const itemDateTime = new Date(`${scheduleDate} ${scheduleTime}`);

  if (isIntaked) {
    return "Completed";
  } else if (currentDateTime > itemDateTime) {
    return "Missed";
  } else {
    return "Pending";
  }
};

// getIntakelogData: Fetches all relevant data for intakeLog
export const getIntakelogData = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const pillcases = await prisma.pillcase.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        pillName: true,
        caseNo: true,
        doses: true,
        IntakeLog: {
          orderBy: {
            scheduleTime: "desc", // or 'desc' for descending order
          },
          select: {
            id: true,
            intakeTime: true,
            isIntaked: true,
            scheduleTime: true,
            scheduleDate: true,
            status: true,
          },
        },
      },
    });

    // Flatten the data structure to have each IntakeLog entry separate along with its associated Pillcase data
    const flatIntakeLogs = await Promise.all(
      pillcases.flatMap((pillcase) =>
        pillcase.IntakeLog.map(async (log) => {
          // Remove single quotation marks cause the time are stored in string
          const formattedScheduleTime = log.scheduleTime.replace(/'/g, "");
          const status = calculateStatus(
            log.isIntaked,
            log.scheduleDate,
            formattedScheduleTime
          );

          // Update status in the database only when the status change and its not "Missed" to prevent repetitive work
          if (log.status !== status && log.status == "Pending") {
            await prisma.intakeLog.update({
              where: { id: log.id },
              data: { status: status },
            });
            log.status = status;
          }

          return {
            pillcaseId: pillcase.id,
            pillName: pillcase.pillName,
            caseNo: pillcase.caseNo,
            doses: pillcase.doses,
            scheduleDate: log.scheduleDate,
            scheduleTime: formattedScheduleTime,
            intakeTime: log.intakeTime,
            isIntaked: log.isIntaked,
            status: log.status,
          };
        })
      )
    );

    // Sort by scheduleDate first
    flatIntakeLogs.sort(
      (a, b) =>
        new Date(b.scheduleDate).getTime() - new Date(a.scheduleDate).getTime()
    );

    // Paginate the sorted results
    const paginatedIntakeLogs = flatIntakeLogs.slice(skip, skip + limit);

    if (paginatedIntakeLogs.length > 0) {
      res.status(200).json({ data: paginatedIntakeLogs });
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
  console.log(" --- inside scheduleDailyIntakeLogs ---- ");
  const userId = user_id;
  try {
    const pillcases = await prisma.pillcase.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        scheduleTimes: true,
      },
    });
    console.log("Pillcases found:", JSON.stringify(pillcases, null, 2));
    const date = moment().tz("America/Los_Angeles").format("YYYY-MM-DD");

    const logsToCreate = pillcases.flatMap((pillcase) =>
      pillcase.scheduleTimes.map((scheduleTime) => ({
        pillcaseId: pillcase.id,
        userId: userId,
        intakeTime: null,
        isIntaked: false,
        scheduleDate: date,
        scheduleTime: scheduleTime,
        status: "Pending",
      }))
    );

    // Create all logs using a single batch operation
    const createdLogs = await prisma.intakeLog.createMany({
      data: logsToCreate,
      skipDuplicates: true, // Optional: skips records that would cause a duplicate error
    });

    console.log(`${createdLogs.count} intake logs created.`);
  } catch (error) {
    console.error("Error creating intake logs:", error);
  }
};
