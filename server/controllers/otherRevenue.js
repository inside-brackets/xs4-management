import asyncHandler from "express-async-handler";
import OtherRevenue from "../modals/otherRevenue.js";

// Access: Admin
// Method: POST
// Route:  /revenue/
export const createRevenue = asyncHandler(async (req, res, next) => {
  try {
    let createrevenue = await OtherRevenue.create(req.body);
    res.status(200);
    res.json(createrevenue);
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
});

// Access: Private
// Method: GET
// route:  /revenue/:id
export const getRevenue = asyncHandler(async (req, res) => {
  try {
    let revenue = await OtherRevenue.findById(req.params.id);

    res.status(200);

    res.json(revenue);
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
});

// Access: Private
// Method: GET
// route:  /revenue/postman
export const getAll = asyncHandler(async (req, res) => {
  try {
    let getAllrevenue = await OtherRevenue.find();

    res.status(200);

    res.json(getAllrevenue);
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
});

// Access: Private
// Method: GET
// route:  /revenue/
export const listRevenue = asyncHandler(async (req, res) => {
  try {
    const offset = parseInt(req.params.offset);
    const limit = parseInt(req.params.limit);
    const { search, category, date__lte, date__gte } = req.body;

    const filter = {};

    if (search) {
      filter.client = { $regex: search, $options: "i" };
    }
    if (category?.length > 0) {
      filter.category = { $in: category };
    }

    if (date__gte && date__lte) {
      filter.date = {
        $exists: true,
        $gte: new Date(date__gte),
        $lte: new Date(date__lte),
      };
    }

    let revenues = await OtherRevenue.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset);

    let allrevenues = await OtherRevenue.find(filter);

    return res.json({
      data: revenues,
      length: allrevenues.length,
      batchSize: revenues.length,
    });
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
});

// Access: Private
// Method: PUT
// Route:  /revenue/:id
export const updateRevenue = asyncHandler(async (req, res) => {
  try {
    let updatedMilestone = await OtherRevenue.findOneAndUpdate(
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
// route: /revenue/:id
export const deleteRevenue = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    OtherRevenue.findByIdAndRemove(id).then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete revenue with id=${id}. Maybe Otherrevenue was not found!`,
        });
      } else {
        res.send({
          message: "revenue was deleted successfully!",
        });
      }
    });
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
});
