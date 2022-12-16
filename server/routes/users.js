import express from "express";
import {
  createUser,
  getToken,
  listUsers,
  updateUser,
  getUser,
  updateUserPassword,
  getUserByUsername,
  addDepartment,
} from "../controllers/users.js";
import { Protected, isAdmin } from "../middlewares/authHandler.js";

const router = express.Router();

router.post("/token", getToken);
router.post("/:limit/:offset", listUsers);
router.post("/", createUser);

router.put("/:id", updateUser);
router.put("/password/:id", updateUserPassword);

router.get("/adddepartment", addDepartment);
router.get("/:id", getUser);
router.get("/byusername/:username", getUserByUsername);

export default router;
