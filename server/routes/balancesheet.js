import express from "express";
import { getBalanceSheet } from "../controllers/balancesheet.js";

const router = express.Router();

router.get("/:year/:month", getBalanceSheet);

export default router;
