import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import moment from "moment-timezone";

const prisma = new PrismaClient();

export const getWeeklyInsights = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.id;
    const endOfWeek = moment().tz("America/Los_Angeles").format("YYYY-MM-DD");
    const startOfWeek = moment()
      .tz("America/Los_Angeles")
      .subtract(7, "days")
      .format("YYYY-MM-DD");

    const intakeLogs = await prisma.intakeLog.findMany({
      where: {
        userId: userId,
        scheduleDate: {
          gte: startOfWeek,
          lte: endOfWeek,
        },
      },
      select: {
        id: true,
        pillName: true,
        scheduleDate: true,
        scheduleTime: true,
        intakeTime: true,
        isIntaked: true,
        status: true,
      },
    });

    if (intakeLogs.length === 0) {
      res.status(200).json({ message: "No intake logs found for the week" });
    }

    const scheduleTimes = [];
    const intakeTimes = [];
    const pillMissCounts: { [pillName: string]: number } = {};
    let completedCount = 0;
    let missedCount = 0;

    intakeLogs.forEach((log) => {
      const scheduledDateTime = moment(
        `${log.scheduleDate} ${log.scheduleTime}`
      ).format("HH:mm");
      scheduleTimes.push({
        dateTime: scheduledDateTime,
        value: log.scheduleTime,
      });

      if (log.intakeTime) {
        const intakeDateTime = moment(log.intakeTime).format("HH:mm");
        intakeTimes.push({ dateTime: intakeDateTime, value: log.intakeTime });
      } else {
        intakeTimes.push({ dateTime: scheduledDateTime, value: null }); // Mark missed intakes
      }

      if (log.status == "Completed") {
        completedCount++;
      } else {
        missedCount++;
        if (pillMissCounts[log.pillName]) {
          pillMissCounts[log.pillName]++;
        } else {
          pillMissCounts[log.pillName] = 1;
        }
      }
    });

    // Find the most missed pill
    const mostMissedPill = Object.keys(pillMissCounts).reduce((a, b) =>
      pillMissCounts[a] > pillMissCounts[b] ? a : b
    );

    // Find all missed count by day and pillName
    const missedCountByDayAndPill = {};

    intakeLogs.forEach((log) => {
      const day = log.scheduleDate;
      if (!missedCountByDayAndPill[day]) {
        missedCountByDayAndPill[day] = {};
      }
      if (!missedCountByDayAndPill[day][log.pillName]) {
        missedCountByDayAndPill[day][log.pillName] = 0;
      }
      if (log.status == "Missed") {
        missedCountByDayAndPill[day][log.pillName]++;
      }
    });

    const insights = {
      scheduleTimes,
      intakeTimes,
      mostMissedPill,
      completedCount,
      missedCount,
      totalIntakeCount: completedCount + missedCount,
      missedCountByDayAndPill,
    };

    res.status(200).json({ data: insights });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error fetching weekly insights" });
  }
};
