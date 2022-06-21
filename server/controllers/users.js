import asyncHandler from 'express-async-handler';
import User from '../modals/user.js';

// Access: Public
// Method: post
// Desc: User to login user
export const getToken = asyncHandler(async (req, res) => {
  try {
    let { email, password } = req.body;

    let user = await User.findOne({ email: email });
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    if (!(await user.matchPassword(password))) {
      res.status(401);
      throw new Error('Email or password is incorrect');
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: user.generateToken(),
    });
  } catch (error) {
    throw new Error(error.message);
  }
});

// Access: Public
// Method: post
// Desc: To register user
export const createUser = asyncHandler(async (req, res) => {
  try {
    let { email, password, name, isAdmin } = req.body;

      let user = await User.findOne({ email: email });
      if (user) {
        res.status(400);
        throw new Error('You can\'t create account with this email');
      }
    let createdUser = await User.create({
      name,
      email,
      password,
      isAdmin
    });
    res.status(201);

    res.json({
      _id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
      isAdmin: createdUser.isAdmin,
      token: createdUser.generateToken(),
    });
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
});

// @des     Update user profile
// @route   Put /api/users/profile
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
    throw new Error('User not found');
  }
});
