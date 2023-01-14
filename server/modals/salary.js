import mongoose from "mongoose";

const salarySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    adjustment: [
      {
        amount: {
          type: Number,
          required: true,
        },
        desc: {
          type: String,
          required: true,
        },
      },
    ],
    incentive: {
      type: Number,
      required: true,
    },
    base: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Salary = mongoose.model("Salary", salarySchema);
export default Salary;
