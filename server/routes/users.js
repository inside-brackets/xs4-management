import express from "express";
import {
  createUser,
  getToken,
  getUsersList,
  updateUserProfile,
} from "../controllers/users.js";
import { Protected,isAdmin } from "../middlewares/authHandler.js";

const router = express.Router();

router.post("/token", getToken);
router.post("/register",Protected,isAdmin, createUser);
router.get("/:limit/:offset", getUsersList);
router.put("/", Protected, updateUserProfile);
export default router;
