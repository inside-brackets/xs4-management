import express from "express";
import {
  createProfile,
  updateProfile,
  listProfiles,
  getProfile,
} from "../controllers/profiles.js";
import { Protected, isAdmin } from "../middlewares/authHandler.js";

const router = express.Router();

router.post("/", Protected, isAdmin, createProfile);
router.put("/:id", Protected, isAdmin, updateProfile);
router.get("/:id", Protected, getProfile);
router.get("/:limit/:offset", Protected, listProfiles);

export default router;
