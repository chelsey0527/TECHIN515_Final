import { Router } from "express";
import {
  getNextSchedules,
  markAllIntakeLogsAsDone,
  markIntakeLogAsDone,
} from "../controllers/upcoming.controller";

const upcomingRouter = Router();

upcomingRouter.get("/:id", getNextSchedules);
upcomingRouter.patch("/:id/done", markIntakeLogAsDone);
upcomingRouter.patch("/done", markAllIntakeLogsAsDone);

export default upcomingRouter;
