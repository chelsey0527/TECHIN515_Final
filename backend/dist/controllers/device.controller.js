"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSignalToPillbox = void 0;
const client_1 = require("@prisma/client");
const axios = require('axios');
const prisma = new client_1.PrismaClient();
const PILLBOX_IP = 'http://raspberrypi_local_ip:5000'; // ** Replace with your Raspberry Pi's IP
// sendSignalToPillbox: trigger pillbox when
async function sendSignalToPillbox() {
    try {
        const response = await axios.get(`${PILLBOX_IP}/light-up`); // the light-up function should be code in raspberry pi
        return { success: response.status === 200, message: "Pillbox located!" };
    }
    catch (error) {
        console.error("Failed to send signal to pillbox:", error);
        return { success: false };
    }
}
exports.sendSignalToPillbox = sendSignalToPillbox;
//# sourceMappingURL=device.controller.js.map