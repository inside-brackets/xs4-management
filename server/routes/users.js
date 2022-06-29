import express from "express";
import {
  createUser,
  getToken,
  listUsers,
  updateUser,
  getUser,
} from "../controllers/users.js";
import { Protected, isAdmin } from "../middlewares/authHandler.js";

const router = express.Router();

router.post("/token", getToken);
router.post("/", createUser);
router.put("/:id", Protected, updateUser);
router.get("/:id", Protected, getUser);
router.get("/:limit/:offset", listUsers);

export default router;
