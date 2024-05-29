import { Router } from "express";
import { getWeeklyInsights } from "../controllers/analyzation.controller";

const analyzationRouter = Router();

analyzationRouter.get("/:id", getWeeklyInsights);

export default analyzationRouter;
