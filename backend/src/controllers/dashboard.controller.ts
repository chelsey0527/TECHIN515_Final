import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

// getDashboardData: Fetches all relevant data for Dashboard page
export const getDashboardData = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.id;
    const userData = await prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        name: true,
        profileImageUrl: true,
        pillboxHumidity: true,
        pillboxTemperature: true,
        pillcases: {
          select: {
            id: true,
            caseNo: true,
            pillName: true,
            doses: true,
            scheduleTimes: true,
          },
          orderBy: {
            caseNo: "asc",
          },
        },
      },
    });

    if (userData) {
      res.status(200).json({ data: userData });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error fetching Dashboard data" });
  }
};
