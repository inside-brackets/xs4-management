import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import userRouters from "./routes/users.js";
import profileRouters from "./routes/profile.js";
import projectRouters from "./routes/project.js";
import reportRouters from "./routes/reports.js";
import Milestone from "./routes/milestone.js";
import UploadRoute from "./routes/upload.js";
import ExpenseRoute from "./routes/expense.js";
import OtherRevenue from "./routes/otherRevenue.js";
import salaryRoutes from "./routes/salary.js";
import balancesheetRoutes from "./routes/balancesheet.js";

import cors from "cors";
dotenv.config();

connectDb();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use("/users", userRouters);
app.use("/profiles", profileRouters);
app.use("/projects", projectRouters);
app.use("/reports", reportRouters);
app.use("/milestone", Milestone);
app.use("/upload", UploadRoute);
app.use("/expense", ExpenseRoute);
app.use("/other_revenue", OtherRevenue);
app.use("/salary", salaryRoutes);
app.use("/balance", balancesheetRoutes);

app.get("/", (req, res) => {
  console.log("hello");
  res.send("Api is running...");
});

const port = process.env.PORT || 5000;

app.listen(port, "0.0.0.0", () => {
  console.log(
    `Application is running in ${process.env.NODE_ENV} mode at ${port} port.`
  );
});
