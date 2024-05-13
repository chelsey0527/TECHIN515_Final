"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePillcaseById = exports.createPillcase = exports.getPillcaseById = exports.getAllPillcase = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// getAllPillcase: Fetches all pillcase data for today
const getAllPillcase = async (req, res) => {
    try {
        const pillcaseData = await prisma.pillcase.findMany({});
        if (pillcaseData) {
            res.status(200).json({ data: pillcaseData });
        }
        else {
            res.status(404).json({ message: "Pillcase data not found" });
        }
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: `Error fetchining pillcase data` });
    }
};
exports.getAllPillcase = getAllPillcase;
// getPillcaseById: Fetches all pillcase data for today
const getPillcaseById = async (req, res) => {
    try {
        const pillcaseId = req.params.pillcaseId;
        const pillcaseData = await prisma.pillcase.findUnique({
            where: {
                id: pillcaseId,
            }
        });
        if (pillcaseData) {
            res.status(200).json({ data: pillcaseData });
        }
        else {
            res.status(404).json({ message: "Pillcase data not found" });
        }
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: `Error fetchining pillcase data` });
    }
};
exports.getPillcaseById = getPillcaseById;
// createPillcase
const createPillcase = async (req, res) => {
    try {
        const pillcaseData = req.body;
        const pillcase = await prisma.pillcase.create({
            data: pillcaseData
        });
        res.status(200).json({ data: pillcase });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: `Error create pillcase data` });
    }
};
exports.createPillcase = createPillcase;
// updatePillcase
const updatePillcaseById = async (req, res) => {
    try {
        const pillcaseId = req.params.pillcaseId;
        const pillcaseData = req.body;
        // ** when updating the scheduleTimes, we should fetch all records and send them back
        const pillcase = await prisma.pillcase.update({
            where: {
                id: pillcaseId,
            },
            data: pillcaseData
        });
        res.status(200).json({ data: pillcase });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: `Error updating pillcase data` });
    }
};
exports.updatePillcaseById = updatePillcaseById;
//# sourceMappingURL=pillcase.controller.js.map