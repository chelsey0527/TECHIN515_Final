import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

// getHomeData: Fetches all relevant data for home page
export const getHomeData = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id;
        const userData = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                name: true,
                profileImageUrl: true,
                pillboxLat: true,
                pillboxLong: true,
                pillcases: {
                    select: {
                        id: true,
                        caseNo: true,
                        pillName: true,
                        doses: true,
                        scheduleTimes: true,
                    }
                }
            }
        });

        if (userData) {
            res.status(200).json({ data: userData });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Error fetching home data" });
    }
};