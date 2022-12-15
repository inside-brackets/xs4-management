import express from "express";
import {
  createRevenue,
  updateRevenue,
  listRevenue,
  getRevenue,
  getAll,
  deleteRevenue,
} from "../controllers/otherRevenue.js";

import { Protected, isAdmin } from "../middlewares/authHandler.js";
const router = express.Router();

router.post("/", createRevenue);
router.put("/:id", updateRevenue);
router.get("/:id", getRevenue);
router.delete("/:id", deleteRevenue);
router.get("/", getAll);
router.post("/:limit/:offset", Protected, listRevenue);

export default router;
