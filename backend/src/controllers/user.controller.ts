import { PrismaClient } from "@prisma/client"
import { Request, Response } from 'express'; // Importing types

const prisma = new PrismaClient();

// getAllUsers: fetch all user
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const allUsers = await prisma.user.findMany();

        res.status(200).json({ data: allUsers });
    } catch (e) {
        console.error(e);
    }
};

// getUserById: fetch desired user
export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id;
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        res.status(200).json({ data: user });
    } catch (e) {
        console.error(e);
    }
};

// createUser
export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userData = req.body;
        const user = await prisma.user.create({
            data: userData
        });

        res.status(201).json({ data: user });
    } catch (e) {
        console.error(e);
    }
};

// updateUser
export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id;
        const userData = req.body;
        const user = await prisma.user.update({
            where: {
                id: userId
            },
            data: userData
        });

        res.status(200).json({ data: user });
    } catch (e) {
        console.error(e);
    }
};

// deleteUser
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id;
        const user = await prisma.user.delete({
            where: {
                id: userId
            }
        });

        res.status(200).json({ data: user });
    } catch (e) {
        console.error(e);
    }
};