import express from "express";
import { getProfilesSummary } from "../controllers/reports.js";
import { Protected, isAdmin } from "../middlewares/authHandler.js";

const router = express.Router();

router.get("/profiles_summary/:year", Protected, getProfilesSummary);

export default router;
