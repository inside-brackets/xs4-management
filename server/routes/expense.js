import express from "express";
import {
  createExpense,
  updateExpense,
  listExpense,
  getExpense,
  getAll,
  deleteExpense,
} from "../controllers/expense.js";

import { Protected, isAdmin } from "../middlewares/authHandler.js";
const router = express.Router();

router.post("/", createExpense);
router.put("/:id", updateExpense);
router.get("/:id", getExpense);
router.delete("/:id", deleteExpense);
router.get("/", getAll);
router.post("/:limit/:offset", Protected, listExpense);

export default router;
