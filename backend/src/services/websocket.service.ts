import WebSocket, { WebSocketServer } from "ws";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class WebSocketService {
  private wss: WebSocketServer;

  constructor(server: any) {
    this.wss = new WebSocketServer({ server });
    this.initializeConnection();
  }

  private async fetchData(userId: string) {
    // Assuming ID is a number based on your usage
    return await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        pillboxTemperature: true,
        pillboxHumidity: true,
      },
    });
  }

  private initializeConnection() {
    this.wss.on("connection", (ws: WebSocket) => {
      console.log("Client connected");

      const userId = "ee430f72-7def-434c-ade8-c464c04655b7"; // Adjust the user ID acquisition as needed

      const interval = setInterval(async () => {
        try {
          const userData = await this.fetchData(userId); // Corrected to use `this` to access class method
          if (userData) {
            ws.send(
              JSON.stringify({
                temperature: userData.pillboxTemperature,
                humidity: userData.pillboxHumidity,
              })
            );
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }, 2000); // Adjust the interval as needed

      ws.on("close", () => {
        clearInterval(interval);
        console.log("Client disconnected");
      });
    });
  }
}
