"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const device_controller_1 = require("../controllers/device.controller");
const deviceRouter = (0, express_1.Router)();
deviceRouter.get('/find-my-pillbox', device_controller_1.sendSignalToPillbox);
exports.default = deviceRouter;
//# sourceMappingURL=device.router.js.map