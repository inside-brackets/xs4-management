import express from "express";
import {
  createUser,
  getToken,
  listUsers,
  updateUser,
  getUser,
  updateUserPassword,
} from "../controllers/users.js";
import { Protected, isAdmin } from "../middlewares/authHandler.js";

const router = express.Router();

router.post("/token", getToken);
router.post("/", createUser);
router.put("/:id", updateUser);
router.put("/password/:id", updateUserPassword);
router.get("/:id", getUser);
router.post("/:limit/:offset", listUsers);

export default router;
