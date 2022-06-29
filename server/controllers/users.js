import asyncHandler from "express-async-handler";
import User from "../modals/user.js";

// Access: Public
// Method: post
// Desc: User to login user
export const getToken = asyncHandler(async (req, res) => {
  try {
    let { email, password, user_name } = req.body;

    let user = await User.findOne({
      $or: [{ user_name }, { email }],
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
      name: user.name,
      email: user.email,
      role: user.role,
      token: user.generateToken(),
    });
  } catch (error) {
    throw new Error(error.message);
  }
});

// Access: Admin
// Method: POST
// Desc: To register user
export const createUser = asyncHandler(async (req, res) => {
  try {
    let user = await User.findOne({ user_name: req.body.user_name });
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

// @des     Update user profile
// @route   Put /users/:id
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    const { name, password } = req.body;
    user.name = name || user.name;
    if (password) {
      user.password = password;
    }
    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: updatedUser.generateToken(),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// Access: Admin
// Method: GET
// Route:  /users/:id?search=text&&role=['user']
export const getUsersList = asyncHandler(async (req, res) => {
  try {
    const offset = parseInt(req.params.offset);
    const limit = parseInt(req.params.limit);
    const { search, role } = req.query;

    const filter = {};

    if (search) {
      filter["$or"] = [
        { userName: { $regex: search, $options: "i" } },
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
      ];
    }
    if (role) {
      filter.role = { $in: role };
    }

    let users = await User.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset);

    let allUsers = await User.find(filter);

    return res.json({
      users,
      total: allUsers.length,
    });
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
});
