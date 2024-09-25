import asyncHandler from "express-async-handler";
import MilestoneModal from "../modals/milestone.js";
import ProjectModal from "../modals/project.js";

// Access: Private
// Method: POST
// route: /milestone
export const createMilestone = asyncHandler(async (req, res) => {
  try {
    let createdMilestone = await MilestoneModal.create(req.body);

    res.status(201);

    res.json(createdMilestone);
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
});

export const migrateMilestones = asyncHandler(async (req, res) => {
  try {
    const milestones = await ProjectModal.aggregate([
      {
        // $lookup: {
        //   from: "profiles",
        //   localField: "profile",
        //   foreignField: "_id",
        //   as: "profile",
        // },

        $project: {
          title: "$title",
          project: "$_id",
          totalAmount: "$totalAmount",
          exchangeRate: "$exchangeRate",
          employeeShare: "$empShare",
          amountRecieved: "$amountRecieved",
          profile: "$profile",
          paymentDate: "$closedAt",
          netRecieveable: {
            $cond: {
              if: { $eq: ["$status", "closed"] },
              then: { $divide: ["$amountRecieved", "$exchangeRate"] },
              else: 0,
            },
          },
          amountDeducted: {
            $cond: {
              if: { $eq: ["$status", "closed"] },
              then: {
                $subtract: [
                  "$totalAmount",
                  { $divide: ["$amountRecieved", "$exchangeRate"] },
                ],
              },
              else: 0,
            },
          },
          status: {
            $cond: {
              if: { $eq: ["$status", "closed"] },
              then: "paid",
              else: "unpaid",
            },
          },
        },
      },
    ]);
    res.json(milestones);
    const createMilestone = await MilestoneModal.insertMany(milestones);

    console.log(createMilestone);
  } catch (error) {
    console.log(error);
  }
});

// Access: Private
// Method: GET
// route: /milestone/:id
export const getMilestone = asyncHandler(async (req, res) => {
  try {
    let milestone = await MilestoneModal.findById(req.params.id).populate(
      "project"
    );

    res.status(200);

    res.json(milestone);
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
});

// Access: Private
// Method: PUT
// route: /projects/:id
export const updateMilestone = asyncHandler(async (req, res) => {
  try {
    let updatedMilestone = await MilestoneModal.findOneAndUpdate(
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
// route: /projects/:id
export const deleteProject = asyncHandler(async (req, res) => {
  try {
    // delete project
    res.json({ msh: "comming soon" });
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
});

// Access: Private
// Method: GET
// route: /projects/:limit/:offset
export const listMilestones = asyncHandler(async (req, res) => {
  const sort = {};

  if (req.query.sortBy && req.query.OrderBy) {
    sort[req.query.sortBy] = req.query.OrderBy === "desc" ? -1 : 1;
  }
  try {
    console.log("listMilestones", req.params.offset);
    const offset = parseInt(req.params.offset);
    const limit = parseInt(req.params.limit);
    const filter = req.body;
    console.log(filter);
    const milestones = await MilestoneModal.find(filter)
      .sort({ updatedAt: -1 })
      .limit(limit)
      .skip(offset);

    const totalMilestones = await MilestoneModal.find(filter);

    res.status(200).json({
      data: milestones,
      length: totalMilestones.length,
      batchSize: milestones.length,
    });
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
});
