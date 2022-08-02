import asyncHandler from "express-async-handler";
import User from "../modals/user.js";
import jwt from "jsonwebtoken";

export const Protected = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      let { id } = jwt.decode(token, process.env.JWT_SECRET);
      let user = await User.findById(id).select("-password");
      req.user = user;
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Unauthorized");
    }
  } else {
    res.status(401);
    throw new Error("Unauthorized");
  }
});

export const isAdmin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(401);
    throw new Error("Unauthorized");
  }
});
