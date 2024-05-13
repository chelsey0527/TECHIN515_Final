"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHomeData = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// getHomeData: Fetches all relevant data for home page
const getHomeData = async (req, res) => {
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
        }
        else {
            res.status(404).json({ message: "User not found" });
        }
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Error fetching home data" });
    }
};
exports.getHomeData = getHomeData;
//# sourceMappingURL=home.controller.js.map