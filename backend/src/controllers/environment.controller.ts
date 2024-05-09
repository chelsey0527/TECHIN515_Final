import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

// getEnvironmentData: Fetches all relevant data for home page
export const getEnvironmentData = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id;
        const environmentData = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                pillboxHumidity: true,
                pillboxTemperature: true,
            }
        });

        if (environmentData) {
            res.status(200).json({ data: environmentData });
        } else {
            res.status(404).json({ message: "Environment not found" });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Error fetching environment data" });
    }
};