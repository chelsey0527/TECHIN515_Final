"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getAllUsers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// getAllUsers: fetch all user
const getAllUsers = async (req, res) => {
    try {
        const allUsers = await prisma.user.findMany();
        res.status(200).json({ data: allUsers });
    }
    catch (e) {
        console.error(e);
    }
};
exports.getAllUsers = getAllUsers;
// getUserById: fetch desired user
const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        res.status(200).json({ data: user });
    }
    catch (e) {
        console.error(e);
    }
};
exports.getUserById = getUserById;
// createUser
const createUser = async (req, res) => {
    try {
        const userData = req.body;
        const user = await prisma.user.create({
            data: userData
        });
        res.status(201).json({ data: user });
    }
    catch (e) {
        console.error(e);
    }
};
exports.createUser = createUser;
// updateUser
const updateUser = async (req, res) => {
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
    }
    catch (e) {
        console.error(e);
    }
};
exports.updateUser = updateUser;
// deleteUser
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await prisma.user.delete({
            where: {
                id: userId
            }
        });
        res.status(200).json({ data: user });
    }
    catch (e) {
        console.error(e);
    }
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=user.controller.js.map