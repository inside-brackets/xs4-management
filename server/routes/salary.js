import { Router } from "express";
import {
  createSalary,
  getSalaries,
  getProjects,
  getLastSalary,
  temp,
} from "../controllers/salary.js";

const router = Router();

router.post("/create", createSalary);
router.post("/all/:limit/:offset", getSalaries);
router.post("/get/projects", getProjects);
router.post("/last", getLastSalary);
router.get("/temp", temp);

export default router;
