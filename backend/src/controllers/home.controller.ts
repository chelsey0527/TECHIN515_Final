import { PrismaClient } from "@prisma/client";

const homeClient = new PrismaClient();

// getHomeData: Fetches all relevant data for home page
export const getHomeData = async (req, res) => {
    try {
        const userId = req.params.id;
        const userData = await homeClient.user.findUnique({
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
        console.log(e);
        res.status(500).json({ message: "Error fetching home data" });
    }
};