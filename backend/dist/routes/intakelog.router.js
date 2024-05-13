"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const intakelog_controller_1 = require("../controllers/intakelog.controller");
const intakelogRouter = (0, express_1.Router)();
intakelogRouter.get('/:id', intakelog_controller_1.getIntakelogData);
exports.default = intakelogRouter;
//# sourceMappingURL=intakelog.router.js.map