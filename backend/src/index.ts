import express from "express";
import http from "http";
import cron from "node-cron";
import cors from "cors";

import userRouter from "./routes/user.router";
import dashboardRouter from "./routes/dashboard.router";
import pillcaseRouter from "./routes/pillcase.router";
import locationRouter from "./routes/environment.router";
import analyzationRouter from "./routes/analyzation.router";
import intakelogRouter from "./routes/intakelog.router";
import deviceRouter from "./routes/device.router";
import upcomingRouter from "./routes/upcoming.router";
import { scheduleDailyIntakeLogs } from "./controllers/intakelog.controller";
import { WebSocketService } from "./services/websocket.service";

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send("Backend API is running!");
});
app.use("/users", userRouter);
app.use("/dashboard", dashboardRouter);
app.use("/pillcases", pillcaseRouter);
app.use("/upcoming", upcomingRouter);
app.use("/analyzation", analyzationRouter);
app.use("/intakelog", intakelogRouter);
app.use("/location", locationRouter);
// app.use("/device", deviceRouter);

// Create a server from the express app
const server = http.createServer(app);

// Initialize WebSocketService with the server
const webSocketService = new WebSocketService(server);

server.listen(port, () => {
  console.log(`server running on ${port} !`);
});

// Setting up the cron job to run at midnight every day
// var task = cron.schedule(
//   "0 0 0 * * *",
//   () => {
//     console.log("Running daily schedule initialization");
//     scheduleDailyIntakeLogs("ee430f72-7def-434c-ade8-c464c04655b7"); // ** Modify user id stored in token
//   },
//   {
//     scheduled: true,
//     timezone: "America/Los_Angeles",
//   }
// );

// TEST: Setting up the cron job to every minutes
// var testTask = cron.schedule(
//   "* * * * *",
//   () => {
//     console.log("Insert data into database");
//     scheduleDailyIntakeLogs("ee430f72-7def-434c-ade8-c464c04655b7");
//   },
//   {
//     scheduled: true,
//     timezone: "America/Los_Angeles",
//   }
// );
