import { Router } from "express";
import { getDashboardData } from "../controllers/dashboard.controller";

const dashboardRouter = Router();

dashboardRouter.get("/:id", getDashboardData);

export default dashboardRouter;
