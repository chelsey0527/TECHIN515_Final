"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const userRouter = (0, express_1.Router)();
userRouter.get('/', user_controller_1.getAllUsers);
userRouter.get('/:id', user_controller_1.getUserById);
userRouter.post('/', user_controller_1.createUser);
userRouter.put('/:id', user_controller_1.updateUser);
userRouter.delete('/:id', user_controller_1.deleteUser);
exports.default = userRouter;
//# sourceMappingURL=user.router.js.map