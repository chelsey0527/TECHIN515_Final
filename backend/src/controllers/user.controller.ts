import { PrismaClient } from "@prisma/client"

const userClient = new PrismaClient().user;

// getAllUsers: fetch all user
export const getAllUsers = async (req, res) => {
    try {
        const allUsers = await userClient.findMany();

        res.status(200).json({ data: allUsers });
    } catch (e) {
        console.log(e);
    }
};

// getUserById: fetch desired user
export const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await userClient.findUnique({
            where: {
                id: userId
            }
        });

        res.status(200).json({ data: user });
    } catch (e) {
        console.log(e);
    }
};

// createUser
export const createUser = async (req, res) => {
    try {
        const userData = req.body;
        const user = await userClient.create({
            data: userData
        });

        res.status(201).json({ data: user });
    } catch (e) {
        console.log(e);
    }
};

// updateUser
export const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const userData = req.body;
        const user = await userClient.update({
            where: {
                id: userId
            },
            data: userData
        });

        res.status(200).json({ data: user });
    } catch (e) {
        console.log(e);
    }
};

// deleteUser
export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await userClient.delete({
            where: {
                id: userId
            }
        });

        res.status(200).json({ data: user });
    } catch (e) {
        console.log(e);
    }
};