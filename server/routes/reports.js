import express from "express";
import { getProfilesSummary } from "../controllers/reports.js";
import { Protected, isAdmin } from "../middlewares/authHandler.js";

const router = express.Router();

router.post("/profiles_summary/:year", getProfilesSummary);

export default router;
