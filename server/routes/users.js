import express from "express";
import {
  createUser,
  getToken,
  updateUserProfile,
} from "../controllers/users.js";
import { Protected } from "../middlewares/authHandler.js";

const router = express.Router();

router.post("/token", getToken);
router.post("/register", createUser);
router.put("/", Protected, updateUserProfile);
export default router;
