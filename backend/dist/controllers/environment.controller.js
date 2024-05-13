"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvironmentData = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// getEnvironmentData: Fetches all relevant data for home page
const getEnvironmentData = async (req, res) => {
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
        }
        else {
            res.status(404).json({ message: "Environment not found" });
        }
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Error fetching environment data" });
    }
};
exports.getEnvironmentData = getEnvironmentData;
//# sourceMappingURL=environment.controller.js.map