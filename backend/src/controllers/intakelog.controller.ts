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
        caseNo: true, // Make sure to fetch the caseNo here for sorting
        IntakeLog: {
          orderBy: {
            scheduleTime: "desc", // Sorting by scheduleTime descending
          },
          select: {
            id: true,
            intakeTime: true,
            isIntaked: true,
            scheduleTime: true,
            scheduleDate: true,
            status: true,
            pillName: true,
            doses: true,
          },
        },
      },
    });

    // Flatten the data structure to have each IntakeLog entry separate along with its associated Pillcase data
    const flatIntakeLogs = pillcases.flatMap((pillcase) =>
      pillcase.IntakeLog.map((log) => ({
        pillcaseId: pillcase.id,
        scheduleDate: log.scheduleDate,
        scheduleTime: log.scheduleTime.replace(/'/g, ""), // Formatting time
        intakeTime: log.intakeTime,
        isIntaked: log.isIntaked,
        status: log.status,
        pillName: log.pillName,
        caseNo: pillcase.caseNo, // Using caseNo from pillcase
        doses: log.doses,
      }))
    );

    // First, sort by scheduleDate in descending order
    flatIntakeLogs.sort(
      (a, b) =>
        new Date(b.scheduleDate).getTime() - new Date(a.scheduleDate).getTime()
    );

    // Then, sort by caseNo in ascending order where scheduleDate is the same
    flatIntakeLogs.sort((a, b) => {
      if (a.scheduleDate === b.scheduleDate) {
        return a.caseNo - b.caseNo; // Ensure caseNo is a number
      }
      return 0;
    });

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
        pillName: true,
        caseNo: true,
        doses: true,
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
        pillName: pillcase.pillName,
        caseNo: pillcase.caseNo,
        doses: pillcase.doses,
      }))
    );

    // Create all logs using a single batch operation
    const createdLogs = await prisma.intakeLog.createMany({
      data: logsToCreate,
      skipDuplicates: true, // Skips records that would cause a duplicate error
    });

    console.log(`${createdLogs.count} intake logs created.`);
  } catch (error) {
    console.error("Error creating intake logs:", error);
  }
};
