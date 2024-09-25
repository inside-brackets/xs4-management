import asyncHandler from "express-async-handler";
import ExpenseCategory from "../modals/expenseCategory.js";

export const createExpenseCategory = asyncHandler(async (req, res, next) => {
  try {
    let createExpense = await ExpenseCategory.create(req.body);
    res.status(200);
    res.json(createExpense);
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
});

export const listExpenseCategory = asyncHandler(async (req, res, next) => {
  try {
    let expenses = await ExpenseCategory.find({});
    res.status(200);
    res.json(expenses);
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
});
