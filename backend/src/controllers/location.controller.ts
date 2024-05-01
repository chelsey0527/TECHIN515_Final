import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

// getLocationData: Fetches all relevant data for home page
export const getLocationData = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id;
        const locationData = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                pillboxLat: true,
                pillboxLong: true,
            }
        });

        if (locationData) {
            res.status(200).json({ data: locationData });
        } else {
            res.status(404).json({ message: "Location not found" });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Error fetching location data" });
    }
};