"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_router_1 = __importDefault(require("./routes/user.router"));
const home_router_1 = __importDefault(require("./routes/home.router"));
const pillcase_router_1 = __importDefault(require("./routes/pillcase.router"));
const environment_router_1 = __importDefault(require("./routes/environment.router"));
const intakelog_router_1 = __importDefault(require("./routes/intakelog.router"));
const device_router_1 = __importDefault(require("./routes/device.router"));
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/users", user_router_1.default);
app.use("/home", home_router_1.default);
app.use("/pillcases", pillcase_router_1.default);
app.use("/intakelog", intakelog_router_1.default);
app.use("/location", environment_router_1.default);
app.use("/device", device_router_1.default);
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
    console.log(`server running on ${port}`);
    // task.start();
    // testTask.start();
});
//# sourceMappingURL=index.js.map