import { Router } from "express";
import { getNextSchedules } from "../controllers/upcoming.controller";

const upcomingRouter = Router();

upcomingRouter.get("/:id", getNextSchedules);

export default upcomingRouter;
