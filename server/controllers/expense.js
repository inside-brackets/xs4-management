import asyncHandler from "express-async-handler";
import Expense from "../modals/expense.js";

// Access: Admin
// Method: POST
// Route:  /expense/
export const createExpense = asyncHandler(async (req, res, next) => {
  try {
    let createExpense = await Expense.create(req.body);
    res.status(200);
    res.json(createExpense);
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
});

// Access: Private
// Method: GET
// route:  /expense/:id
export const getExpense = asyncHandler(async (req, res) => {
  try {
    let expense = await Expense.findById(req.params.id).populate("profile");

    res.status(200);

    res.json(expense);
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
});

// Access: Private
// Method: GET
// route:  /expense/postman
export const getAll = asyncHandler(async (req, res) => {
  try {
    let getAllExpense = await Expense.find();

    res.status(200);

    res.json(getAllExpense);
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
});

// Access: Private
// Method: GET
// route:  /expense/
export const listExpense = asyncHandler(async (req, res) => {
  try {
    const offset = parseInt(req.params.offset);
    const limit = parseInt(req.params.limit);
    const { search, category, profile, date__lte, date__gte } = req.body;

    const filter = {};

    if (search) {
      filter.description = { $regex: search, $options: "i" };
    }
    if (category?.length > 0) {
      filter.category = { $in: category };
    }

    if (profile?.length > 0) {
      filter.profile = { $in: profile };
    }

    if (date__gte && date__lte) {
      filter.date = {
        $exists: true,
        $gte: new Date(date__gte),
        $lte: new Date(date__lte),
      };
    }
    let expenses = await Expense.find(filter)
      .populate("profile")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset);

    let allExpenses = await Expense.find(filter);

    return res.json({
      data: expenses,
      length: allExpenses.length,
    });
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
});

// Access: Private
// Method: PUT
// Route:  /expense/:id
export const updateExpense = asyncHandler(async (req, res) => {
  try {
    let updatedMilestone = await Expense.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true, upsert: true }
    );

    res.status(200);

    res.json(updatedMilestone);
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
});

// Access: Admin
// Method: DELETE
// route: /expense/:id
export const deleteExpense = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    Expense.findByIdAndRemove(id).then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Expense with id=${id}. Maybe OtherExpense was not found!`,
        });
      } else {
        res.send({
          message: "Expense was deleted successfully!",
        });
      }
    });
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
});
