import express from "express";
import { addDepartment } from "../controllers/users.js";
import { fixProfiles } from "../controllers/profiles.js";
import { migrateMilestones } from "../controllers/milestone.js";

const router = express.Router();

router.get("/milestones/migrate", migrateMilestones);
router.get("/users/add/department", addDepartment);
router.get("/profiles/add/isadmin", fixProfiles);

export default router;
