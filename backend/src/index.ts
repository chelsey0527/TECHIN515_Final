import express from "express";
import cron from "node-cron";
import cors from "cors";

import userRouter from "./routes/user.router";
import homeRouter from "./routes/home.router";
import pillcaseRouter from "./routes/pillcase.router";
import locationRouter from "./routes/environment.router";
import intakelogRouter from "./routes/intakelog.router";
import deviceRouter from "./routes/device.router";
import { scheduleDailyIntakeLogs } from "./controllers/intakelog.controller";

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send("Backend API is running!");
});
app.use("/users", userRouter);
app.use("/home", homeRouter);
app.use("/pillcases", pillcaseRouter);
app.use("/intakelog", intakelogRouter);
app.use("/location", locationRouter);
app.use("/device", deviceRouter);

// Setting up the cron job to run at midnight every day
// var task = cron.schedule('0 0 0 * * *', () => {
//     console.log('Running daily schedule initialization');
//     scheduleDailyIntakeLogs("ee430f72-7def-434c-ade8-c464c04655b7"); // ** Modify user id stored in token
// },
//     {
//         scheduled: true,
//         timezone: "America/Los_Angeles"
//     });

// TEST: Setting up the cron job to every minutes
// var testTask = cron.schedule('* * * * *', () => {
//     console.log('Insert data into database');
//     scheduleDailyIntakeLogs("ee430f72-7def-434c-ade8-c464c04655b7");
// },
//     {
//         scheduled: true,
//         timezone: "America/Los_Angeles"
//     });

app.listen(port, () => {
  console.log(`server running on ${port} !`);
  // task.start();
  // testTask.start();
});
