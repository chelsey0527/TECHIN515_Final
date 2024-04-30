import { PrismaClient } from "@prisma/client";
import { Request, Response } from 'express'; // Importing types

const prisma = new PrismaClient();

// getAllPillcase: Fetches all pillcase data for today
export const getAllPillcase = async (req: Request, res: Response): Promise<void> => {
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
export const getPillcaseById = async (req: Request, res: Response): Promise<void> => {
    try {
        const pillcaseId = req.params.pillcaseId;
        const pillcaseData = await prisma.pillcase.findUnique({
            where: {
                id: pillcaseId,
            }
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
export const createPillcase = async (req: Request, res: Response): Promise<void> => {
    try {
        const pillcaseData = req.body;
        const pillcase = await prisma.pillcase.create({
            data: pillcaseData
        });

        res.status(200).json({ data: pillcase });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: `Error create pillcase data` });
    }
};

// updatePillcase
export const updatePillcase = async (req: Request, res: Response): Promise<void> => {
    try {
        const pillcaseId = req.params.pillcaseId;
        const pillcaseData = req.body;
        const pillcase = await prisma.pillcase.update({
            where: {
                id: pillcaseId,
            },
            data: pillcaseData
        });

        res.status(200).json({ data: pillcase });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: `Error updating pillcase data` });
    }
};