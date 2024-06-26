import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import moment from "moment-timezone";

const prisma = new PrismaClient();

// getAllPillcase: Fetches all pillcase data for today
export const getAllPillcase = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const pillcaseData = await prisma.pillcase.findMany({});

    if (pillcaseData) {
      res.status(200).json({ data: pillcaseData });
    } else {
      res.status(404).json({ message: "Pillcase data not found" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: `Error fetchining pillcase data` });
  }
};

// getPillcaseById: Fetches all pillcase data for today
export const getPillcaseById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const pillcaseId = req.params.pillcaseId;
    const pillcaseData = await prisma.pillcase.findUnique({
      where: {
        id: pillcaseId,
      },
    });

    if (pillcaseData) {
      res.status(200).json({ data: pillcaseData });
    } else {
      res.status(404).json({ message: "Pillcase data not found" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: `Error fetchining pillcase data` });
  }
};

// createPillcase
export const createPillcase = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const pillcaseData = req.body;
    const pillcase = await prisma.pillcase.create({
      data: pillcaseData,
    });

    res.status(200).json({ data: pillcase });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: `Error create pillcase data` });
  }
};

// updatePillcase
// {TODO: still need to check logic in the future}
export const updatePillcaseById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const pillcaseId = req.params.pillcaseId;
  const newPillcaseData = req.body;

  try {
    const pillcaseToUpdate = await prisma.pillcase.findUnique({
      where: { id: pillcaseId },
    });

    if (!pillcaseToUpdate) {
      res.status(404).json({ message: "Pill case not found" });
      return;
    }

    const updatedPillcase = await prisma.pillcase.update({
      where: { id: pillcaseId },
      data: newPillcaseData,
    });

    // Get today's date
    const today = moment().tz("America/Los_Angeles").format("YYYY-MM-DD");

    // Find today's logs for this pill case
    const pillcaseLogs = await prisma.intakeLog.findMany({
      where: {
        pillcaseId: pillcaseId,
        scheduleDate: today,
      },
    });

    console.log(pillcaseLogs);

    // Update today's logs that are pending and have different schedule times
    const updates = pillcaseLogs
      .map((log) => {
        if (log.status === "Pending") {
          // Find the corresponding index in the original schedule times
          const index = pillcaseToUpdate.scheduleTimes.findIndex(
            (time) => time === log.scheduleTime
          );
          if (
            index !== -1 &&
            newPillcaseData.scheduleTimes[index] !== log.scheduleTime
          ) {
            const newTime = newPillcaseData.scheduleTimes[index];
            console.log("new time: ", newTime);
            return prisma.intakeLog.update({
              where: { id: log.id },
              data: { scheduleTime: newTime },
            });
          }
        }
        return null;
      })
      .filter(Boolean);

    console.log(updates);

    // Execute all updates as a transaction
    if (updates.length > 0) {
      await prisma.$transaction(updates);
    }

    res.status(200).json({
      message: "Pill case updated successfully",
      data: updatedPillcase,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: `Error updating pillcase data` });
  }
};
