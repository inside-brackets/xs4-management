import mongoose from "mongoose";

const projectLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "User ObjectId is required."],
    },
    project: {
      type: mongoose.Types.ObjectId,
      ref: "Project",
      required: [true, "Project ObjectId is required."],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Log description is required."],
    },
  },
  {
    timestamps: true,
  }
);

const Log = mongoose.model("Log", projectLogSchema);
export default Log;
