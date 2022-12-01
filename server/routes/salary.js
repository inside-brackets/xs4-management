import { Router } from "express";
import {
  createSalary,
  getSalaries,
  getProjects,
  getLastSalary,
} from "../controllers/salary.js";

const router = Router();

router.post("/create", createSalary);
router.post("/all/:limit/:offset", getSalaries);
router.post("/get/projects", getProjects);
router.post("/last", getLastSalary);

export default router;
