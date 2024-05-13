"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const environment_controller_1 = require("../controllers/environment.controller");
const environmentRouter = (0, express_1.Router)();
environmentRouter.get('/:id', environment_controller_1.getEnvironmentData);
exports.default = environmentRouter;
//# sourceMappingURL=environment.router.js.map