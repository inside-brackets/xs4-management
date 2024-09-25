import mongoose from "mongoose";

const expenseCategorySchema = new mongoose.Schema(
  {
    label: {
      type: "string",
    },
    value: { type: String },
  },
  {
    timestamps: true,
  }
);

const ExpenseCategory = mongoose.model("ExpenseCategory", expenseCategorySchema);
export default ExpenseCategory;
