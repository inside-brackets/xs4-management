import express from "express";
import {
  createProject,
  updateProject,
  listProjects,
  getProject,
} from "../controllers/projects";
import { Protected, isAdmin } from "../middlewares/authHandler.js";

const router = express.Router();

router.post("/", Protected, isAdmin, createProject);
router.put("/:id", Protected, isAdmin, updateProject);
router.get("/:id", Protected, getProject);
router.get("/:limit/:offset", Protected, listProjects);

export default router;
