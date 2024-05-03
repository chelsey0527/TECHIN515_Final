import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const axios = require('axios');
const prisma = new PrismaClient();

const PILLBOX_IP = 'http://raspberrypi_local_ip:5000';  // ** Replace with your Raspberry Pi's IP


// sendSignalToPillbox: trigger pillbox when
export async function sendSignalToPillbox() {
    try {
        const response = await axios.get(`${PILLBOX_IP}/light-up`); // the light-up function should be code in raspberry pi
        return { success: response.status === 200, message: "Pillbox located!" };
    } catch (error) {
        console.error("Failed to send signal to pillbox:", error);
        return { success: false };
    }
}