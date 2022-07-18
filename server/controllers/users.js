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
      res.send("No user found with this username");
      return;
    }
    if (!(await user.matchPassword(password))) {
      res.status(401);
      res.send("Incorrect password.");
      return;
    }
    res.json({
      _id: user._id,
      name: user.userName,
      role: user.role,
      isManager:user.isManager,
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
    if (req.body.password) {
      const user = await User.findById(req.params.id);
      req.body.password = user.hashPassword();
    }
    let updatedUser = await User.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
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
// Method: PUT
// route: /users/password/:id
export const updateUserPassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    const { password } = req.body;
    console.log(password)
    if (password) {
      user.password = password;
    }
    const updatedUser = await user.save();

    res.json({
      updatedUser,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// Access: Private
// Method: GET
// route: /users/:id
export const getUser = asyncHandler(async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      throw new Error("User Not available against this id");
    }
    res.status(200);

    res.json(user);
  } catch (error) {
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
    const { search, role, isManager } = req.body;

    const filter = {};

    if (search) {
      filter["$or"] = [{ userName: search }];
    }
    if (role?.length > 0) {
      filter.role = { $in: role };
    }
    if (isManager) {
      filter.isManager = true;
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
