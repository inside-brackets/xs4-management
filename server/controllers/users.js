import asyncHandler from "express-async-handler";
import User from "../modals/user.js";
import url from "url";
import querystring from "querystring";
// Access: Public
// Method: POST
// Desc: User to login user
export const getToken = asyncHandler(async (req, res) => {
  try {
    let { password, userName } = req.body;

    let user = await User.findOne({
      userName,
    });

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    if (!(await user.matchPassword(password))) {
      res.status(401);
      throw new Error("Email or password is incorrect");
    }
    res.json({
      _id: user._id,
      name: user.userName,
      role: user.role,
      token: user.generateToken(),
    });
  } catch (error) {
    throw new Error(error.message);
  }
});

// Access: Admin
// Method: POST
// Route:  /users/
export const createUser = asyncHandler(async (req, res) => {
  try {
    let user = await User.findOne({ userName: req.body.userName });
    if (user) {
      res.status(400);
      throw new Error("You can't create account with this user name");
    }

    let createdUser = await User.create(req.body);
    res.status(201);

    res.json(createdUser);
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
});

// Access: Private
// Method: PUT
// Route:  /users/:id
export const updateUser = asyncHandler(async (req, res) => {
  try {
    let updatedUser = await User.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true, upsert: true }
    );

    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
});

// Access: Private
// Method: GET
// route: /users/:id
export const getUser = asyncHandler(async (req, res) => {
  try {
    let user = await User.findById(req.params.id);

    res.status(200);

    res.json(user);
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
});

// Access: Admin
// Method: GET
// Route:  /users/:id
export const listUsers = asyncHandler(async (req, res) => {
  try {
    const offset = parseInt(req.params.offset);
    const limit = parseInt(req.params.limit);
    const { search, role } = req.body;

    const filter = {};

    if (search) {
      filter["$or"] = [{ userName: search }];
    }
    if (role?.length > 0) {
      filter.role = { $in: role };
    }

    let users = await User.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset);

    let allUsers = await User.find(filter);

    return res.json({
      data: users,
      length: allUsers.length,
    });
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
});
