import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    description: {
      type: "string",
      required: true,
    },
    isLocal: {
      type: "boolean",
      default: true,
    },
    amount: { type: Number, default: 0 },
    profile: { type: mongoose.Types.ObjectId, ref: "Profile" },
    date: { type: Date, default: new Date() },
    category: {
      type: String,
      enum: ["office", "profileMembership"],
      default: "office",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;
