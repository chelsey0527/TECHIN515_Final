"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pillcase_controller_1 = require("../controllers/pillcase.controller");
const pillcaseRouter = (0, express_1.Router)();
pillcaseRouter.get('/', pillcase_controller_1.getAllPillcase);
pillcaseRouter.get('/:pillcaseId', pillcase_controller_1.getPillcaseById);
pillcaseRouter.post('/', pillcase_controller_1.createPillcase);
pillcaseRouter.put('/:pillcaseId', pillcase_controller_1.updatePillcaseById);
exports.default = pillcaseRouter;
//# sourceMappingURL=pillcase.router.js.map