import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import moment from "moment-timezone";

const prisma = new PrismaClient();

// getNextSchedules: Fetches the next upcoming schedule for each pill
export const getNextSchedules = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.id;
    const currentDateTime = moment()
      .tz("America/Los_Angeles")
      .format("YYYY-MM-DD HH:mm:ss");

    // Fetch the next upcoming intake logs for the user
    const nextIntakeLogs = await prisma.intakeLog.findMany({
      where: {
        userId: userId,
        isIntaked: false,
        OR: [
          {
            scheduleDate: {
              gt: moment().tz("America/Los_Angeles").format("YYYY-MM-DD"),
            },
          },
          {
            scheduleDate: moment()
              .tz("America/Los_Angeles")
              .format("YYYY-MM-DD"),
            scheduleTime: {
              gt: moment().tz("America/Los_Angeles").format("HH:mm:ss"),
            },
          },
        ],
      },
      orderBy: [{ scheduleDate: "asc" }, { scheduleTime: "asc" }],
      select: {
        id: true,
        caseNo: true,
        pillName: true,
        doses: true,
        scheduleDate: true,
        scheduleTime: true,
      },
    });

    // Find the earliest next schedule time
    if (nextIntakeLogs.length === 0) {
      res.status(200).json({ message: "No upcoming schedules found" });
      return;
    }

    const earliestNextScheduleDate = nextIntakeLogs[0].scheduleDate;
    const earliestNextScheduleTime = nextIntakeLogs[0].scheduleTime;

    // Filter the schedules to only include the earliest next schedule time
    const filteredSchedules = nextIntakeLogs.filter(
      (log) =>
        log.scheduleDate === earliestNextScheduleDate &&
        log.scheduleTime === earliestNextScheduleTime
    );

    res.status(200).json({ data: filteredSchedules });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error fetching next schedules" });
  }
};

// Mark a Specific Intake Log as Done
export const markIntakeLogAsDone = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const intakeTime = moment().tz("America/Los_Angeles").toISOString();

    const updatedLog = await prisma.intakeLog.update({
      where: { id: id },
      data: {
        intakeTime: intakeTime,
        status: "Completed",
        isIntaked: true,
      },
    });

    res.status(200).json({ data: updatedLog });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error updating intake log" });
  }
};

// Mark All Fetched Intake Logs as Done
export const markAllIntakeLogsAsDone = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { ids } = req.body;
    const intakeTime = moment().tz("America/Los_Angeles").toISOString();

    const updates = ids.map((id: string) =>
      prisma.intakeLog.update({
        where: { id: id },
        data: {
          intakeTime: intakeTime,
          status: "Completed",
          isIntaked: true,
        },
      })
    );

    await prisma.$transaction(updates);

    res.status(200).json({ message: "All intake logs updated successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error updating intake logs" });
  }
};
