import { Router } from "express";
import {
  createSalary,
  getSalaries,
  getProjects,
  getSalary,
} from "../controllers/salary.js";

const router = Router();

router.post("/create", createSalary);
router.post("/all/:year/:month/:limit/:offset", getSalaries);
router.post("/get/projects", getProjects);
router.get("/check/:year/:month/:id", getSalary);

export default router;
