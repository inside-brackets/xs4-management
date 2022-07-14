import express from "express";
import {
  createProject,
  updateProject,
  listProjects,
  getProject,
} from "../controllers/projects.js";
import { Protected, isAdmin } from "../middlewares/authHandler.js";

const router = express.Router();

router.post("/", createProject);
router.put("/:id", updateProject);
router.get("/:id", getProject);
router.post("/:limit/:offset",Protected, listProjects);

export default router;
