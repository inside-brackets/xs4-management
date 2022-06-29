import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import userRouters from "./routes/users.js";
import profileRouters from "./routes/profile.js";
import projectRouters from "./routes/project";
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

app.get("/", (req, res) => {
  res.send("Api is running...");
});

const port = process.env.PORT || 5000;

app.listen(port, "0.0.0.0", () => {
  console.log(
    `Application is running in ${process.env.NODE_ENV} mode at ${port} port.`
  );
});
