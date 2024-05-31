import { Router } from "express";
import {
  getNextSchedules,
  markAllIntakeLogsAsDone,
  markIntakeLogAsDone,
  updateUpcomingSchedulesTime,
} from "../controllers/upcoming.controller";

const upcomingRouter = Router();

upcomingRouter.get("/:id", getNextSchedules);
upcomingRouter.patch("/:id/done", markIntakeLogAsDone);
upcomingRouter.patch("/done", markAllIntakeLogsAsDone);
upcomingRouter.patch("/update-time", updateUpcomingSchedulesTime);

export default upcomingRouter;
