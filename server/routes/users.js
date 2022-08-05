import express from "express";
import {
  createUser,
  getToken,
  listUsers,
  updateUser,
  getUser,
  updateUserPassword,
  getUserByUsername,
} from "../controllers/users.js";
import { Protected, isAdmin } from "../middlewares/authHandler.js";

const router = express.Router();

router.post("/token", getToken);
router.post("/", createUser);
router.put("/:id", updateUser);
router.put("/password/:id", updateUserPassword);
router.get("/:id", getUser);
router.get("/byusername/:username", getUserByUsername);
router.post("/:limit/:offset", listUsers);

export default router;
