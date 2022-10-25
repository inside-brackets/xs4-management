import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema(
  {
    // search
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    // search
    firstName: {
      type: String,
    },
    // search
    lastName: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
    },
    address: {
      type: String,
    },
    bank: {
      name: {
        type: String,
      },
      account_no: {
        type: Number,
      },
      branch_code: {
        type: Number,
      },
    },
    // $in
    role: {
      type: String,
      enum: ["user", "admin"],
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    isManager: {
      type: Boolean,
      default: false,
    },
    department: {
      type: String,
      enum: ["accounts", "graphics"],
      default: "accounts",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

userSchema.methods.hashPassword = async function (password) {
  let salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  return password;
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  let salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);
export default User;
