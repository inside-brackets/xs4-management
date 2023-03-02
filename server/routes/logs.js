import { Router } from "express";
import {
  createLog,
  updateLog,
  getLogs,
  getAllLogs,
} from "../controllers/logs.js";
import { Protected, isAdmin } from "../middlewares/authHandler.js";

const router = Router();

router.post("/create", createLog);
router.post("/update", updateLog);
router.post("/", getLogs);
router.get("/all", Protected, isAdmin, getAllLogs);

export default router;
