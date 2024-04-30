import { PrismaClient } from "@prisma/client";

const pillcaseClient = new PrismaClient();

// getPillcaseById: Fetches all pillcase data for today
export const getPillcaseById = async (req, res) => {
    try {
        const pillcaseId = req.params.pillcaseId;
        const pillcaseData = await pillcaseClient.pillcase.findUnique({
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
        console.log(e);
        res.status(500).json({ message: `Error fetchining pillcase data` });
    }
};

// updatePillcaseById
export const updatePillcaseById = async (req, res) => {
    try {
        const pillcaseId = req.params.pillcaseId;
        const pillcaseData = req.body;
        const pillcase = await pillcaseClient.pillcase.update({
            where: {
                id: pillcaseId,
            },
            data: pillcaseData
        });

        res.status(200).json({ data: pillcase });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: `Error updating pillcase data` });
    }
};