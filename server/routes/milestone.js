import express from "express";
import {
  createMilestone,
  updateMilestone,
  listMilestones,
  getMilestone,
  migrateMilestones,
} from "../controllers/milestone.js";

import { Protected, isAdmin } from "../middlewares/authHandler.js";
const router = express.Router();

router.post("/", createMilestone);
router.put("/:id", updateMilestone);
router.get("/:id", getMilestone);
router.post("/:limit/:offset", Protected, listMilestones);

export default router;
