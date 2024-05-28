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
    const currentTime = moment().tz("America/Los_Angeles").format("HH:mm");

    const pillcases = await prisma.pillcase.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        caseNo: true,
        pillName: true,
        doses: true,
        scheduleTimes: true,
      },
    });

    const upcomingSchedules = pillcases
      .map((pillcase) => {
        const nextSchedule = pillcase.scheduleTimes
          .filter((time) =>
            moment(time, "HH:mm").isAfter(moment(currentTime, "HH:mm"))
          )
          .sort((a, b) => moment(a, "HH:mm").diff(moment(b, "HH:mm")))[0];
        return {
          caseNo: pillcase.caseNo,
          pillName: pillcase.pillName,
          doses: pillcase.doses,
          nextSchedule: nextSchedule,
        };
      })
      .filter((pill) => pill.nextSchedule);

    // Find the earliest next schedule time
    const earliestNextScheduleTime = upcomingSchedules
      .map((pill) => pill.nextSchedule)
      .sort((a, b) => moment(a, "HH:mm").diff(moment(b, "HH:mm")))[0];

    // Filter the schedules to only include the earliest next schedule time
    const filteredSchedules = upcomingSchedules.filter(
      (pill) => pill.nextSchedule === earliestNextScheduleTime
    );

    res.status(200).json({ data: filteredSchedules });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error fetching next schedules" });
  }
};
