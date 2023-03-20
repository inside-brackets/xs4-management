import { Router } from "express";
import {
  createLog,
  updateLog,
  getLogs,
  getAllLogs,
  getUserDontHaveLogs
} from "../controllers/logs.js";
import { Protected, isAdmin } from "../middlewares/authHandler.js";

const router = Router();

router.post("/create", createLog);
router.post("/update", updateLog);
router.post("/", getLogs);
router.get("/all", Protected, isAdmin, getAllLogs);
router.get("/not", Protected, isAdmin, getUserDontHaveLogs);

export default router;
